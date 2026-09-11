from datetime import UTC, datetime
from decimal import Decimal
from unittest.mock import AsyncMock, Mock

import pytest
from pydantic import ValidationError

from src.app import app
from src.models.audit_log_model import AuditLogModel
from src.models.base_model import CourseStatus, NotificationType
from src.models.course_model import CourseModel
from src.models.course_moderation_review_model import CourseModerationReviewModel
from src.models.notification_model import NotificationModel
from src.modules.teacher.teacher_course.admin.admin_dto import (
    CourseArchiveRequest,
    CourseReviewRequest,
)
from src.modules.teacher.teacher_course.admin.admin_service import AdminCourseService


def course(status: CourseStatus) -> CourseModel:
    now = datetime(2026, 9, 11, tzinfo=UTC)
    return CourseModel(
        id=7,
        title="Algorithms",
        teacher_id=4,
        slug="algorithms",
        field="Computer Science",
        tags="algorithms",
        description="Course description",
        thumbnail_url=None,
        price=Decimal("29.00"),
        status=status,
        submitted_at=now,
        reviewed_by=None,
        reviewed_note=None,
        reviewed_at=None,
        created_at=now,
        updated_at=now,
    )


def session_for(db_course: CourseModel) -> Mock:
    session = Mock()
    session.scalar = AsyncMock(side_effect=[db_course, Decimal("4.5")])

    def assign_ids(models: list[object]) -> None:
        for model in models:
            if isinstance(model, CourseModerationReviewModel):
                model.id = 10

    session.add_all.side_effect = assign_ids
    session.flush = AsyncMock()
    session.commit = AsyncMock()
    session.rollback = AsyncMock()
    return session


def test_admin_course_routes_share_teacher_course_openapi_tag() -> None:
    schema = app.openapi()
    routes = {
        "/api/admin/courses": "get",
        "/api/admin/courses/{course_id}": "get",
        "/api/admin/courses/{course_id}/review": "post",
        "/api/admin/courses/{course_id}/archive": "post",
    }
    for path, method in routes.items():
        assert schema["paths"][path][method]["tags"] == ["Teacher Course"]


def test_rejected_course_requires_a_note() -> None:
    with pytest.raises(ValidationError):
        CourseReviewRequest(decision=CourseStatus.REJECTED, note="  ")


@pytest.mark.asyncio
async def test_review_updates_course_and_writes_side_effects_atomically() -> None:
    db_course = course(CourseStatus.PENDING_REVIEW)
    session = session_for(db_course)
    service = AdminCourseService(session)

    response = await service.review_course(
        course_id=7,
        admin_id=2,
        data=CourseReviewRequest(
            decision=CourseStatus.APPROVED,
            note="Meets the publishing requirements",
        ),
    )

    assert response.data.course.status == CourseStatus.APPROVED
    assert response.data.moderation.reviewed_by == 2
    records = session.add_all.call_args.args[0]
    assert any(isinstance(record, AuditLogModel) for record in records)
    notification = next(
        record for record in records if isinstance(record, NotificationModel)
    )
    assert notification.type == NotificationType.COURSE_APPROVED
    session.flush.assert_awaited_once()
    session.commit.assert_awaited_once()


@pytest.mark.asyncio
async def test_archive_records_history_and_audit() -> None:
    db_course = course(CourseStatus.APPROVED)
    session = session_for(db_course)
    service = AdminCourseService(session)

    response = await service.archive_course(
        course_id=7,
        admin_id=2,
        data=CourseArchiveRequest(note="Course is no longer maintained"),
    )

    assert response.data.status == CourseStatus.ARCHIVED
    records = session.add_all.call_args.args[0]
    moderation = next(
        record
        for record in records
        if isinstance(record, CourseModerationReviewModel)
    )
    assert moderation.status == CourseStatus.ARCHIVED
    assert any(isinstance(record, AuditLogModel) for record in records)
    session.commit.assert_awaited_once()
