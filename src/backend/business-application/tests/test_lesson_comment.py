from datetime import UTC, datetime
from unittest.mock import AsyncMock, Mock

import pytest
from pydantic import ValidationError
from sqlalchemy.dialects import postgresql

from src.app import app
from src.models.comment_model import CommentModel
from src.models.course_model import CourseModel
from src.modules.lesson_comment.lesson_comment_dto import (
    COMMENT_TOMBSTONE,
    CommentWrite,
)
from src.modules.lesson_comment.lesson_comment_service import LessonCommentService


def test_comment_write_trims_content_and_removes_control_characters() -> None:
    payload = CommentWrite(content="  hello\x00 world\r\n  ")

    assert payload.content == "hello world"


@pytest.mark.parametrize("content", ["", "   ", "x" * 3001])
def test_comment_write_rejects_invalid_content(content: str) -> None:
    with pytest.raises(ValidationError):
        CommentWrite(content=content)


def test_lesson_comment_router_exposes_only_canonical_routes() -> None:
    paths = app.openapi()["paths"]

    lesson_comments = paths["/api/lesson-contents/{lesson_content_id}/comments"]
    assert {"get", "post"} <= lesson_comments.keys()
    assert "delete" in paths["/api/comments/{comment_id}"]
    assert "get" in paths["/api/teacher/courses/{course_id}/comments"]
    assert "/api/lesson-contents/{lesson_content_id}/comment" not in paths
    assert "/api/lesson-contents/comment/{comment_id}" not in paths


def test_soft_deleted_comment_view_does_not_leak_original_content() -> None:
    comment = CommentModel(
        id=7,
        lesson_content_id=5,
        user_id=2,
        parent_id=3,
        content="sensitive old content",
        deleted_at=datetime.now(UTC),
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )

    response = LessonCommentService._to_comment_view(comment)

    assert response.content == COMMENT_TOMBSTONE
    assert response.is_deleted is True
    assert "deleted_at" not in response.model_dump()


@pytest.mark.asyncio
async def test_delete_non_root_comment_with_replies_creates_tombstone() -> None:
    session = Mock()
    session.scalar = AsyncMock(side_effect=[1, 1, 1])
    session.commit = AsyncMock()
    session.rollback = AsyncMock()
    session.delete = AsyncMock()
    comment = CommentModel(
        id=7,
        lesson_content_id=5,
        user_id=2,
        parent_id=3,
        content="sensitive old content",
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )
    service = LessonCommentService(session)
    service._get_comment = AsyncMock(return_value=comment)
    service._is_course_moderator = AsyncMock(return_value=False)

    response = await service.delete_comment(comment_id=7, user_id=2)

    assert response.message == "Comment deleted successfully"
    assert comment.content == ""
    assert comment.deleted_at is not None
    session.delete.assert_not_awaited()
    session.commit.assert_awaited_once()


@pytest.mark.asyncio
async def test_delete_root_comment_uses_database_cascade() -> None:
    session = Mock()
    session.scalar = AsyncMock(side_effect=[1])
    session.commit = AsyncMock()
    session.rollback = AsyncMock()
    session.delete = AsyncMock()
    comment = CommentModel(
        id=7,
        lesson_content_id=5,
        user_id=2,
        parent_id=None,
        content="root",
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )
    service = LessonCommentService(session)
    service._get_comment = AsyncMock(return_value=comment)
    service._is_course_moderator = AsyncMock(return_value=False)

    await service.delete_comment(comment_id=7, user_id=2)

    session.delete.assert_awaited_once_with(comment)
    session.commit.assert_awaited_once()


@pytest.mark.asyncio
async def test_unanswered_filter_checks_the_entire_reply_thread() -> None:
    course = CourseModel(id=9, teacher_id=4)
    result = Mock()
    result.all.return_value = []
    session = Mock()
    session.scalar = AsyncMock(side_effect=[course, 4, 0])
    session.execute = AsyncMock(return_value=result)
    service = LessonCommentService(session)

    response = await service.list_teacher_course_comments(
        course_id=9,
        user_id=4,
        unanswered_only=True,
        page=1,
        size=20,
    )

    count_statement = session.scalar.await_args_list[2].args[0]
    compiled_query = str(count_statement.compile()).upper()
    assert "WITH RECURSIVE" in compiled_query
    assert response.pagination.total == 0


@pytest.mark.asyncio
async def test_lesson_comment_page_returns_complete_root_threads() -> None:
    root = CommentModel(
        id=10,
        lesson_content_id=5,
        user_id=2,
        parent_id=None,
        content="root",
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )
    first_reply = CommentModel(
        id=11,
        lesson_content_id=5,
        user_id=3,
        parent_id=10,
        content="first reply",
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )
    nested_reply = CommentModel(
        id=12,
        lesson_content_id=5,
        user_id=4,
        parent_id=11,
        content="reply to first reply",
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )
    root_result = Mock()
    root_result.scalars.return_value.all.return_value = [10]
    thread_result = Mock()
    thread_result.scalars.return_value.all.return_value = [
        root,
        first_reply,
        nested_reply,
    ]
    session = Mock()
    session.scalar = AsyncMock(return_value=1)
    session.execute = AsyncMock(side_effect=[root_result, thread_result])
    service = LessonCommentService(session)
    service._get_lesson_content_course = AsyncMock(
        return_value=Mock(course_id=8, teacher_id=2)
    )
    service._require_course_access = AsyncMock()

    response = await service.list_lesson_content_comments(
        lesson_content_id=5,
        user_id=2,
        page=1,
        size=1,
    )

    assert [comment.id for comment in response.data] == [10, 11, 12]
    assert response.pagination.total == 1
    thread_statement = session.execute.await_args_list[1].args[0]
    compiled_query = str(thread_statement.compile(dialect=postgresql.dialect())).upper()
    assert "WITH RECURSIVE" in compiled_query


@pytest.mark.asyncio
async def test_comment_lookup_can_lock_reply_target_for_mutation() -> None:
    session = Mock()
    session.scalar = AsyncMock(return_value=None)
    service = LessonCommentService(session)

    await service._get_comment(comment_id=10, for_update=True)

    statement = session.scalar.await_args.args[0]
    compiled_query = str(statement.compile(dialect=postgresql.dialect())).upper()
    assert "FOR UPDATE" in compiled_query


@pytest.mark.asyncio
async def test_delete_non_root_comment_without_replies_hard_deletes_it() -> None:
    session = Mock()
    session.scalar = AsyncMock(side_effect=[1, None])
    session.commit = AsyncMock()
    session.rollback = AsyncMock()
    session.delete = AsyncMock()
    comment = CommentModel(
        id=7,
        lesson_content_id=5,
        user_id=2,
        parent_id=3,
        content="leaf reply",
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )
    service = LessonCommentService(session)
    service._get_comment = AsyncMock(return_value=comment)
    service._is_course_moderator = AsyncMock(return_value=False)

    await service.delete_comment(comment_id=7, user_id=2)

    session.delete.assert_awaited_once_with(comment)
    service._get_comment.assert_awaited_once_with(7, for_update=True)
