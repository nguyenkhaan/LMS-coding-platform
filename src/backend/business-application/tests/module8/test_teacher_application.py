import pytest
from fastapi.testclient import TestClient

pytestmark = pytest.mark.asyncio

async def test_create_teacher_application(client: TestClient, seed_teacher_profile):
    payload = {
        "bio": "I am a great teacher",
        "education_evidence_urls": "http://example.com/edu.pdf",
        "legal_full_name": "Nguyen Van A",
        "date_of_birth": "1990-01-01",
        "identity_number": "123456789",
        "identity_front_url": "http://example.com/front.jpg",
        "identity_back_url": "http://example.com/back.jpg",
        "selfie_with_id_url": "http://example.com/selfie.jpg",
        "cv_url": "http://example.com/cv.pdf",
        "motivation": "I want to share my knowledge"
    }

    # SEED_STUDENT is logged in by the client fixture
    response = client.post(
        "/api/teacher-applications",
        json=payload
    )

    assert response.status_code == 201

async def test_create_teacher_application_duplicate_returns_409(client: TestClient, seed_teacher_profile):
    payload = {
        "bio": "I am a great teacher",
        "education_evidence_urls": "http://example.com/edu.pdf",
        "legal_full_name": "Nguyen Van A",
        "date_of_birth": "1990-01-01",
        "identity_number": "123456789",
        "identity_front_url": "http://example.com/front.jpg",
        "identity_back_url": "http://example.com/back.jpg",
        "selfie_with_id_url": "http://example.com/selfie.jpg",
        "cv_url": "http://example.com/cv.pdf",
        "motivation": "I want to share my knowledge"
    }

    # First creation should succeed
    response = client.post(
        "/api/teacher-applications",
        json=payload
    )
    assert response.status_code == 201

    # Second creation should return 409
    response_duplicate = client.post(
        "/api/teacher-applications",
        json=payload
    )
    assert response_duplicate.status_code == 409
    assert response_duplicate.json()["detail"] == "Application already exists"

async def test_get_my_teacher_application_returns_404_if_not_created(client: TestClient, seed_teacher_profile):
    response = client.get("/api/teacher-applications/me")
    assert response.status_code == 404
    assert response.json()["detail"] == "Application not found"

async def test_get_my_teacher_application_returns_200_if_created(client: TestClient, seed_teacher_profile):
    # First create
    payload = {
        "bio": "I am a great teacher",
        "identity_number": "123456789"
    }
    client.post("/api/teacher-applications", json=payload)

    # Then get
    response = client.get("/api/teacher-applications/me")
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["bio"] == "I am a great teacher"
    assert data["identity_number"] == "123456789"
    assert data["status"] == "DRAFT"

async def test_update_teacher_application_success_on_draft(client: TestClient, seed_teacher_profile, db_session):
    client.post("/api/teacher-applications", json={"identity_number": "111"})
    
    response = client.put(
        "/api/teacher-applications/me",
        json={"bio": "Updated bio", "identity_number": "111"}
    )
    assert response.status_code == 200
    assert response.json()["data"]["bio"] == "Updated bio"

async def test_update_teacher_application_returns_409_when_pending(client: TestClient, seed_teacher_profile, db_session):
    client.post("/api/teacher-applications", json={"identity_number": "111"})
    # Change status to PENDING manually for test setup
    from src.models.teacher_register_model import TeacherRegisterModel
    from src.models.base_model import TeacherRegisterStatus
    from sqlalchemy.future import select
    app = (await db_session.execute(select(TeacherRegisterModel))).scalar_one()
    app.status = TeacherRegisterStatus.PENDING
    await db_session.commit()

    response = client.put(
        "/api/teacher-applications/me",
        json={"bio": "Try to update"}
    )
    assert response.status_code == 409
    assert response.json()["detail"] == "Cannot update application while it is pending"

async def test_update_teacher_application_whitelist_fields_when_approved(client: TestClient, seed_teacher_profile, db_session):
    client.post("/api/teacher-applications", json={"identity_number": "111", "legal_full_name": "Old Name"})
    # Change status to APPROVED manually
    from src.models.teacher_register_model import TeacherRegisterModel
    from src.models.base_model import TeacherRegisterStatus
    from sqlalchemy.future import select
    app = (await db_session.execute(select(TeacherRegisterModel))).scalar_one()
    app.status = TeacherRegisterStatus.APPROVED
    await db_session.commit()

    response = client.put(
        "/api/teacher-applications/me",
        json={"bio": "New Bio", "legal_full_name": "New Name"} # legal_full_name should be ignored
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["bio"] == "New Bio"
    assert data["legal_full_name"] == "Old Name"

async def test_submit_teacher_application_returns_400_if_missing_required_fields(client: TestClient, seed_teacher_profile):
    client.post("/api/teacher-applications", json={"identity_number": "111"}) # missing legal_full_name, etc.
    response = client.post("/api/teacher-applications/me/submit")
    assert response.status_code == 400
    assert "Missing required fields" in response.json()["detail"]

async def test_submit_teacher_application_success(client: TestClient, seed_teacher_profile, db_session):
    client.post("/api/teacher-applications", json={
        "identity_number": "111",
        "legal_full_name": "Full Name",
        "education_evidence_urls": "url",
        "identity_front_url": "url",
        "identity_back_url": "url",
        "selfie_with_id_url": "url",
        "cv_url": "url"
    })
    response = client.post("/api/teacher-applications/me/submit")
    assert response.status_code == 200
    assert response.json()["data"]["status"] == "PENDING"
    
    # Verify history
    from src.models.teacher_register_history_model import TeacherRegisterHistoryModel
    from sqlalchemy.future import select
    history = (await db_session.execute(select(TeacherRegisterHistoryModel))).scalars().all()
    assert len(history) == 1
    assert history[0].status.name == "PENDING"
    assert history[0].teacher_register_id == response.json()["data"]["id"]
    assert history[0].acted_by == seed_teacher_profile.user_id

async def test_submit_teacher_application_returns_409_if_already_submitted(client: TestClient, seed_teacher_profile, db_session):
    client.post("/api/teacher-applications", json={
        "identity_number": "111",
        "legal_full_name": "Full Name",
        "education_evidence_urls": "url",
        "identity_front_url": "url",
        "identity_back_url": "url",
        "selfie_with_id_url": "url",
        "cv_url": "url"
    })
    # Submit first time
    client.post("/api/teacher-applications/me/submit")
    
    # Submit second time
    response = client.post("/api/teacher-applications/me/submit")
    assert response.status_code == 409
    assert response.json()["detail"] == "Application is already submitted or processed"
