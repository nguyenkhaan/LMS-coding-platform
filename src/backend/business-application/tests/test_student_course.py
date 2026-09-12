from datetime import UTC, datetime
from unittest.mock import AsyncMock, Mock

import pytest
from fastapi import HTTPException
from sqlalchemy.dialects import postgresql

from src.app import app
from src.models.base_model import LessonContentType
from src.models.enrollment_model import EnrollmentModel
from src.models.lesson_content_model import LessonContentModel
from src.models.lesson_content_progress_model import LessonContentProgressModel
from src.models.lesson_model import LessonModel
from src.models.section_model import SectionModel
from src.modules.courses.learning.dependencies import (
    get_current_student_id,
    get_student_course_service,
)
from src.modules.courses.learning.service import StudentService


def test_student_course_routes_are_registered() -> None:
    paths = app.openapi()["paths"]

    assert "get" in paths["/api/student/courses"]
    assert "get" in paths["/api/student/courses/{slug}/study"]
    assert (
        "post"
        in paths["/api/student/progress/lesson-contents/{lesson_content_id}/complete"]
    )
    assert "get" in paths["/api/student/progress"]


def test_student_course_dependency_returns_student_service() -> None:
    session = Mock()

    service = get_student_course_service(session)

    assert isinstance(service, StudentService)
    assert service.db_session is session


@pytest.mark.parametrize("payload", [{}, {"sub": True}, {"sub": "1"}, {"sub": 0}])
def test_current_student_id_rejects_invalid_subject(payload: dict[str, object]) -> None:
    with pytest.raises(HTTPException) as exc_info:
        get_current_student_id(payload)  # type: ignore[arg-type]

    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_complete_reading_is_idempotent_for_existing_progress() -> None:
    now = datetime.now(UTC)
    enrollment = EnrollmentModel(id=3, student_id=7, course_id=11, enrolled_at=now)
    content = LessonContentModel(
        id=5,
        lesson_id=2,
        content_type=LessonContentType.READING,
        content_id=9,
        position=0,
        created_at=now,
    )
    lesson = LessonModel(id=2, section_id=4, title="Reading", position=0)
    section = SectionModel(id=4, course_id=11, title="Start", position=0)
    progress = LessonContentProgressModel(
        id=13,
        enrollment_id=enrollment.id,
        lesson_content_id=content.id,
        completed=True,
        completed_at=now,
    )
    row_result = Mock()
    row_result.one_or_none.return_value = (enrollment, content, lesson, section)
    session = Mock()
    session.execute = AsyncMock(return_value=row_result)
    session.scalar = AsyncMock(side_effect=[None, progress, 4, 1])
    session.commit = AsyncMock()
    session.rollback = AsyncMock()
    session.add = Mock()
    service = StudentService(session)

    response = await service.complete_reading(
        student_id=enrollment.student_id,
        lesson_content_id=content.id,
    )

    assert response.data.id == progress.id
    assert response.course_progress_percent == 25.0
    session.add.assert_not_called()
    session.commit.assert_awaited_once()


@pytest.mark.asyncio
async def test_complete_rejects_non_reading_content() -> None:
    enrollment = EnrollmentModel(id=3, student_id=7, course_id=11)
    content = LessonContentModel(
        id=5,
        lesson_id=2,
        content_type=LessonContentType.QUIZ,
        content_id=9,
        position=0,
    )
    lesson = LessonModel(id=2, section_id=4, title="Quiz", position=0)
    section = SectionModel(id=4, course_id=11, title="Start", position=0)
    row_result = Mock()
    row_result.one_or_none.return_value = (enrollment, content, lesson, section)
    session = Mock()
    session.execute = AsyncMock(return_value=row_result)
    service = StudentService(session)

    with pytest.raises(HTTPException) as exc_info:
        await service.complete_reading(student_id=7, lesson_content_id=5)

    assert exc_info.value.status_code == 400


def test_progress_query_is_scoped_to_student_and_course() -> None:
    statement = StudentService._progress_statement(student_id=7, course_id=11)
    sql = str(statement.compile(dialect=postgresql.dialect())).lower()

    assert "enrollment.student_id" in sql
    assert "enrollment.course_id" in sql
    assert "sections.course_id = enrollment.course_id" in sql
