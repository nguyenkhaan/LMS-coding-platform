from __future__ import annotations

import os
import unittest
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock

os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://user:pass@localhost:5432/db")
os.environ.setdefault("VERIFY_REGISTER_SECRET", "test-secret")
os.environ.setdefault("AUTH_PROVIDER_URL", "http://localhost:4001")
os.environ.setdefault("UPSTASH_REDIS_REST_URL", "http://localhost")
os.environ.setdefault("UPSTASH_REDIS_REST_TOKEN", "test-token")

from sqlalchemy.exc import MissingGreenlet
from fastapi import HTTPException

from src.models.comment_model import CommentModel
from src.modules.lesson_comment.lesson_comment_dto import CreateLessonContentCommentRequest
from src.modules.lesson_comment.lesson_comment_service import LessonContentCommentService


class LazyRolesUser:
    def __init__(self, user_id: int = 1):
        self.id = user_id

    @property
    def roles(self):
        raise MissingGreenlet(
            "greenlet_spawn has not been called; can't call await_only() here."
        )


class LessonContentCommentServiceTest(unittest.IsolatedAsyncioTestCase):
    def _make_session(self) -> SimpleNamespace:
        return SimpleNamespace(
            scalar=AsyncMock(),
            execute=AsyncMock(),
            add=Mock(),
            delete=AsyncMock(),
            flush=AsyncMock(),
            refresh=AsyncMock(),
            commit=AsyncMock(),
            rollback=AsyncMock(),
        )

    async def test_delete_comment_allows_admin_without_touching_lazy_roles(self):
        session = self._make_session()
        service = LessonContentCommentService(session)
        user = LazyRolesUser(user_id=1)
        comment = CommentModel(
            lesson_content_id=10,
            user_id=2,
            parent_id=None,
            content="Seed comment",
        )
        session.scalar = AsyncMock(side_effect=[user, comment, 1])

        result = await service.deleteLessonContentComment(user_id=1, comment_id=99)

        self.assertEqual(result.message, "Comment deleted successfully")
        session.delete.assert_awaited_once_with(comment)
        session.commit.assert_awaited_once()

    async def test_delete_comment_raises_404_when_comment_does_not_exist(self):
        session = self._make_session()
        service = LessonContentCommentService(session)
        session.scalar = AsyncMock(side_effect=[SimpleNamespace(id=1), None])

        with self.assertRaises(HTTPException) as context:
            await service.deleteLessonContentComment(user_id=1, comment_id=99)

        self.assertEqual(context.exception.status_code, 404)

    async def test_create_comment_rejects_parent_from_another_lesson(self):
        session = self._make_session()
        service = LessonContentCommentService(session)
        created_comment = CommentModel(
            lesson_content_id=10,
            user_id=1,
            parent_id=5,
            content="Replying to the wrong lesson",
        )

        async def populate_comment(comment):
            comment.id = 123
            comment.created_at = __import__("datetime").datetime(2026, 8, 4)
            comment.updated_at = __import__("datetime").datetime(2026, 8, 4)

        session.refresh = AsyncMock(side_effect=populate_comment)
        session.scalar = AsyncMock(
            side_effect=[
                SimpleNamespace(id=10),  # lesson content exists
                CommentModel(
                    lesson_content_id=20,
                    user_id=2,
                    parent_id=None,
                    content="Parent from another lesson",
                ),
            ]
        )

        with self.assertRaises(HTTPException) as context:
            await service.createLessonContentComment(
                user_id=1,
                lesson_content_id=10,
                data=CreateLessonContentCommentRequest(
                    parent_id=5,
                    content="  Replying to the wrong lesson  ",
                ),
            )

        self.assertEqual(context.exception.status_code, 400)

    async def test_get_comments_returns_only_top_level_comments(self):
        session = self._make_session()
        service = LessonContentCommentService(session)
        reply = CommentModel(
            lesson_content_id=10,
            user_id=2,
            parent_id=1,
            content="Reply",
        )
        top_level = CommentModel(
            lesson_content_id=10,
            user_id=1,
            parent_id=None,
            content="Root",
        )
        top_level.id = 1
        top_level.created_at = __import__("datetime").datetime(2026, 8, 4)
        top_level.updated_at = __import__("datetime").datetime(2026, 8, 4)
        reply.id = 2
        reply.created_at = __import__("datetime").datetime(2026, 8, 4)
        reply.updated_at = __import__("datetime").datetime(2026, 8, 4)
        top_level.replies = [reply]

        async def execute_side_effect(statement):
            sql = str(statement.compile(compile_kwargs={"literal_binds": True}))
            if "parent_id IS NULL" in sql:
                rows = [top_level]
            else:
                rows = [top_level, reply]

            return SimpleNamespace(
                scalars=lambda: SimpleNamespace(all=lambda: rows)
            )

        session.execute = AsyncMock(side_effect=execute_side_effect)

        response = await service.getLessonContentComments(lesson_content_id=10, limit=20, offset=0)

        self.assertEqual(len(response), 1)
        self.assertEqual(response[0].id, 1)
        self.assertEqual(len(response[0].replies), 1)
        self.assertEqual(response[0].replies[0].id, 2)


if __name__ == "__main__":
    unittest.main()
