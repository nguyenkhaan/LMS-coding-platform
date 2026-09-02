from datetime import UTC, datetime
from unittest.mock import AsyncMock, Mock

import pytest
from fastapi import HTTPException
from sqlalchemy.dialects import postgresql

from src.models.base_model import LessonContentType
from src.models.course_model import CourseModel
from src.models.course_moderation_review_model import CourseModerationReviewModel
from src.models.lesson_content_model import LessonContentModel
from src.models.section_model import SectionModel
from src.modules.teacher.teacher_course.teacher_course_service import (
    TeacherCourseService,
)
from src.modules.teacher.teacher_curriculum.teacher_curriculum_dto import (
    SectionWriteRequest,
)
from src.modules.teacher.teacher_curriculum.teacher_curriculum_service import (
    TeacherService,
)
from src.modules.teacher.teacher_quiz.teacher_quiz_service import TeacherQuizService


@pytest.mark.asyncio
async def test_create_section_rejects_a_course_not_owned_by_the_teacher() -> None:
    session = Mock()
    session.scalar = AsyncMock(return_value=None)
    aggregate_result = Mock()
    aggregate_result.scalar_one_or_none.return_value = -1
    session.execute = AsyncMock(return_value=aggregate_result)
    session.add.side_effect = lambda section: setattr(section, "id", 1)
    session.flush = AsyncMock()
    session.commit = AsyncMock()
    session.refresh = AsyncMock()
    session.rollback = AsyncMock()
    service = TeacherService(session)

    with pytest.raises(HTTPException) as error:
        await service.create_course_section(
            course_id=3,
            teacher_id=99,
            data=SectionWriteRequest(title="Unauthorized section"),
        )

    assert error.value.status_code == 404
    session.add.assert_not_called()
    statement = session.scalar.await_args.args[0]
    compiled_statement = str(statement.compile(dialect=postgresql.dialect())).upper()
    assert "FOR UPDATE" in compiled_statement
    assert "COURSES.STATUS IN" in compiled_statement
    assert "COURSES.DELETED_AT IS NULL" in compiled_statement


@pytest.mark.asyncio
async def test_course_bound_content_requires_an_existing_binding_to_the_course() -> None:
    session = Mock()
    result = Mock()
    result.all.return_value = []
    session.scalars = AsyncMock(return_value=result)
    service = TeacherService(session)

    with pytest.raises(HTTPException) as error:
        await service._ensure_course_bound_content(
            course_id=3,
            content_type=LessonContentType.QUIZ,
            content_id=7,
        )

    assert error.value.status_code == 409


@pytest.mark.asyncio
async def test_delete_lesson_content_with_comments_returns_a_specific_conflict() -> None:
    lesson_content = LessonContentModel(
        id=4,
        lesson_id=2,
        content_type="READING",
        content_id=3,
        position=0,
    )
    query_result = Mock()
    query_result.scalar.return_value = lesson_content
    session = Mock()
    session.execute = AsyncMock(return_value=query_result)
    session.scalar = AsyncMock(return_value=10)
    session.delete = AsyncMock()
    session.commit = AsyncMock()
    session.rollback = AsyncMock()
    service = TeacherService(session)

    with pytest.raises(HTTPException) as error:
        await service.delete_lesson_content(lesson_content_id=4, teacher_id=1)

    assert error.value.status_code == 409
    assert error.value.detail == "Cannot delete lesson content that has comments"
    session.delete.assert_not_awaited()


@pytest.mark.asyncio
async def test_quiz_lesson_ownership_uses_the_database() -> None:
    session = Mock()
    session.scalar = AsyncMock(return_value=9)
    service = TeacherQuizService(session)

    await service._require_owned_lesson(lesson_id=4, teacher_id=9)

    session.scalar.assert_awaited_once()


@pytest.mark.asyncio
async def test_course_moderation_history_is_owner_scoped_and_paginated() -> None:
    course = CourseModel(id=3, teacher_id=9, slug="course-3")
    review = CourseModerationReviewModel(
        id=4,
        course_id=3,
        reviewed_note="Ready for review",
        approved_at=None,
        submitted_at=datetime(2026, 9, 1, tzinfo=UTC),
    )
    result = Mock()
    result.scalars.return_value.all.return_value = [review]
    session = Mock()
    session.scalar = AsyncMock(side_effect=[course, 1])
    session.execute = AsyncMock(return_value=result)
    service = TeacherCourseService(session)

    response = await service.get_course_moderation_history(
        teacher_id=9,
        course_id=3,
        page=1,
        size=20,
    )

    assert response.total_items == 1
    assert response.total_pages == 1
    assert response.items[0].id == 4
    assert response.items[0].reviewed_note == "Ready for review"
