import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.teacher_register_model import TeacherRegisterModel
from src.models.base_model import TeacherRegisterStatus

pytestmark = pytest.mark.asyncio

async def test_get_teacher_applications_as_student_returns_403(client: TestClient):
    response = client.get("/api/admin/teacher-applications")
    # depending on middleware, might be 403 or 401
    assert response.status_code in [401, 403]

async def test_get_teacher_applications_as_admin_returns_list_with_pagination(
    admin_client: TestClient, db_session: AsyncSession, seed_teacher_profile
):
    # Seed an application
    app = TeacherRegisterModel(
        teacher_profile_id=seed_teacher_profile.user_id,
        legal_full_name="John Admin",
        identity_number="1234567890",
        identity_front_url="front.jpg",
        status=TeacherRegisterStatus.PENDING
    )
    db_session.add(app)
    await db_session.commit()

    response = admin_client.get("/api/admin/teacher-applications?page=1&size=10")
    assert response.status_code == 200
    data = response.json()
    assert data["total_items"] == 1
    assert data["total_pages"] == 1
    assert data["current_page"] == 1
    assert len(data["items"]) == 1

    item = data["items"][0]
    assert item["legal_full_name"] == "John Admin"
    # Identity masked
    assert item["identity_number"] == "***7890"
    # URLs should be omitted or None
    assert item.get("identity_front_url") is None

async def test_get_teacher_applications_with_filter(
    admin_client: TestClient, db_session: AsyncSession, seed_teacher_profile, seed_admin_user
):
    # Seed applications
    app1 = TeacherRegisterModel(
        teacher_profile_id=seed_teacher_profile.user_id,
        legal_full_name="John 1",
        identity_number="111111",
        status=TeacherRegisterStatus.PENDING
    )
    db_session.add(app1)
    await db_session.commit()
    
    # Filter by REJECTED should return 0
    response = admin_client.get("/api/admin/teacher-applications?status=REJECTED")
    assert response.status_code == 200
    assert response.json()["total_items"] == 0

    # Filter by PENDING should return 1
    response = admin_client.get("/api/admin/teacher-applications?status=PENDING")
    assert response.status_code == 200
    assert response.json()["total_items"] == 1

from sqlalchemy.future import select
from src.models.audit_log_model import AuditLogModel
from src.models.base_model import AuditAction
from src.models.teacher_register_history_model import TeacherRegisterHistoryModel

async def test_get_teacher_application_detail_full_cccd_and_audit_log(
    admin_client: TestClient, db_session: AsyncSession, seed_teacher_profile, seed_admin_user
):
    app = TeacherRegisterModel(
        teacher_profile_id=seed_teacher_profile.user_id,
        legal_full_name="John Detail",
        identity_number="123456789",
        identity_front_url="front.jpg",
        status=TeacherRegisterStatus.PENDING
    )
    db_session.add(app)
    await db_session.commit()
    await db_session.refresh(app)

    response = admin_client.get(f"/api/admin/teacher-applications/{app.id}")
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["identity_number"] == "123456789"  # Not masked
    assert data["identity_front_url"] == "front.jpg"

    # Verify audit log
    audit_stmt = select(AuditLogModel).where(AuditLogModel.target_id == app.id)
    audit_res = await db_session.execute(audit_stmt)
    logs = audit_res.scalars().all()
    assert len(logs) == 1
    assert logs[0].action == AuditAction.TEACHER_APPLICATION_VIEW
    assert logs[0].user_id == seed_admin_user.id
    assert logs[0].target_type == "TeacherRegisterModel"

async def test_get_teacher_application_detail_not_found(admin_client: TestClient):
    response = admin_client.get("/api/admin/teacher-applications/99999")
    assert response.status_code == 404

from unittest.mock import patch

async def test_get_teacher_application_detail_audit_log_failure(
    admin_client: TestClient, db_session: AsyncSession, seed_teacher_profile
):
    app = TeacherRegisterModel(
        teacher_profile_id=seed_teacher_profile.user_id,
        legal_full_name="John Detail Fail",
        identity_number="123456789",
        status=TeacherRegisterStatus.PENDING
    )
    db_session.add(app)
    await db_session.commit()
    await db_session.refresh(app)

    # Patch db_session.commit in the specific module using it, but wait!
    # A cleaner way is to patch AsyncSession.commit to raise IntegrityError.
    with patch("sqlalchemy.ext.asyncio.AsyncSession.commit") as mock_commit:
        from sqlalchemy.exc import IntegrityError
        # IntegrityError requires statement, params, orig
        mock_commit.side_effect = IntegrityError("mock error", None, None)
        
        response = admin_client.get(f"/api/admin/teacher-applications/{app.id}")
        assert response.status_code == 500
        assert "audit log" in response.json()["detail"]

async def test_review_teacher_application_success(
    admin_client: TestClient, db_session: AsyncSession, seed_teacher_profile, seed_admin_user
):
    app = TeacherRegisterModel(
        teacher_profile_id=seed_teacher_profile.user_id,
        legal_full_name="John Review",
        identity_number="123456",
        status=TeacherRegisterStatus.PENDING
    )
    db_session.add(app)
    await db_session.commit()
    await db_session.refresh(app)

    # Approve
    response = admin_client.post(
        f"/api/admin/teacher-applications/{app.id}/review",
        json={"status": "APPROVED"}
    )
    assert response.status_code == 200
    
    # Check DB updates (Transaction 1: Register update)
    await db_session.refresh(app)
    assert app.status == TeacherRegisterStatus.APPROVED

    # Check DB updates (Transaction 2: History insert)
    hist_stmt = select(TeacherRegisterHistoryModel).where(TeacherRegisterHistoryModel.teacher_register_id == app.id)
    hist = (await db_session.execute(hist_stmt)).scalars().first()
    assert hist is not None
    assert hist.status == TeacherRegisterStatus.APPROVED
    assert hist.acted_by == seed_admin_user.id

    # Check DB updates (Transaction 3: Audit log)
    audit_stmt = select(AuditLogModel).where(
        AuditLogModel.target_id == app.id,
        AuditLogModel.action == AuditAction.TEACHER_APPLICATION_REVIEW
    )
    audit = (await db_session.execute(audit_stmt)).scalars().first()
    assert audit is not None
    assert audit.user_id == seed_admin_user.id

async def test_review_teacher_application_reject_requires_note(
    admin_client: TestClient, db_session: AsyncSession, seed_teacher_profile
):
    app = TeacherRegisterModel(
        teacher_profile_id=seed_teacher_profile.user_id,
        legal_full_name="John Review",
        identity_number="123456",
        status=TeacherRegisterStatus.PENDING
    )
    db_session.add(app)
    await db_session.commit()
    await db_session.refresh(app)

    # Reject without note should fail (422 validation error or 400)
    response = admin_client.post(
        f"/api/admin/teacher-applications/{app.id}/review",
        json={"status": "REJECTED"}
    )
    assert response.status_code in [400, 422]

    # Reject with note should succeed
    response = admin_client.post(
        f"/api/admin/teacher-applications/{app.id}/review",
        json={"status": "REJECTED", "note": "Missing ID"}
    )
    assert response.status_code == 200

async def test_review_teacher_application_reject_success(
    admin_client: TestClient, db_session: AsyncSession, seed_teacher_profile, seed_admin_user
):
    app = TeacherRegisterModel(
        teacher_profile_id=seed_teacher_profile.user_id,
        legal_full_name="John Reject",
        identity_number="123456",
        status=TeacherRegisterStatus.PENDING
    )
    db_session.add(app)
    await db_session.commit()
    await db_session.refresh(app)

    response = admin_client.post(
        f"/api/admin/teacher-applications/{app.id}/review",
        json={"status": "REJECTED", "note": "Blurry image"}
    )
    assert response.status_code == 200
    
    # Check DB updates (Transaction 1: Register update)
    await db_session.refresh(app)
    assert app.status == TeacherRegisterStatus.REJECTED
    assert app.reviewed_note == "Blurry image"

    # Check DB updates (Transaction 2: History insert)
    hist_stmt = select(TeacherRegisterHistoryModel).where(
        TeacherRegisterHistoryModel.teacher_register_id == app.id
    ).order_by(TeacherRegisterHistoryModel.id.desc())
    hist = (await db_session.execute(hist_stmt)).scalars().first()
    assert hist is not None
    assert hist.status == TeacherRegisterStatus.REJECTED
    assert hist.reviewed_note == "Blurry image"
    assert hist.acted_by == seed_admin_user.id

    # Check DB updates (Transaction 3: Audit log)
    audit_stmt = select(AuditLogModel).where(
        AuditLogModel.target_id == app.id,
        AuditLogModel.action == AuditAction.TEACHER_APPLICATION_REVIEW
    ).order_by(AuditLogModel.id.desc())
    audit = (await db_session.execute(audit_stmt)).scalars().first()
    assert audit is not None
    assert audit.user_id == seed_admin_user.id

async def test_review_teacher_application_not_pending_returns_409(
    admin_client: TestClient, db_session: AsyncSession, seed_teacher_profile
):
    app = TeacherRegisterModel(
        teacher_profile_id=seed_teacher_profile.user_id,
        legal_full_name="John Review",
        identity_number="123456",
        status=TeacherRegisterStatus.APPROVED
    )
    db_session.add(app)
    await db_session.commit()
    await db_session.refresh(app)

    response = admin_client.post(
        f"/api/admin/teacher-applications/{app.id}/review",
        json={"status": "REJECTED", "note": "Changed mind"}
    )
    assert response.status_code == 409

