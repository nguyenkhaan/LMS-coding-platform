import pytest
from fastapi.testclient import TestClient

from src.app import app
from src.middlewares.auth_middleware import get_current_user

client = TestClient(app)

def override_get_current_user_teacher():
    return {"sub": "1", "role": "teacher"}

def override_get_current_user_student():
    return {"sub": "2", "role": "student"}

@pytest.fixture(autouse=True)
def setup_teardown():
    # Reset mock data before each test
    from src.modules.course.course_service import CourseService
    CourseService._clear_mock_data()
    
    # Pre-create a course for teacher 1
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    payload = {
        "title": "Test Course",
        "description": "Desc",
        "price": 100,
        "field": "IT",
        "tags": ["test"]
    }
    client.post("/api/v1/teacher/courses", json=payload)
    yield
    app.dependency_overrides = {}


def test_create_section_success():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    payload = {"title": "Introduction", "position": 1}
    # Using course_id 1 because it's created in fixture
    response = client.post("/api/v1/teacher/courses/1/sections", json=payload)
    assert response.status_code == 201
    assert response.json()["title"] == "Introduction"
    assert "id" in response.json()

def test_create_section_forbidden():
    app.dependency_overrides[get_current_user] = override_get_current_user_student
    payload = {"title": "Introduction", "position": 1}
    response = client.post("/api/v1/teacher/courses/1/sections", json=payload)
    assert response.status_code == 403
    assert response.json()["error_code"] == "FORBIDDEN"

def test_create_section_course_not_found():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    payload = {"title": "Introduction", "position": 1}
    response = client.post("/api/v1/teacher/courses/999/sections", json=payload)
    assert response.status_code == 404

def test_update_section_success():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    # Create section first
    create_resp = client.post("/api/v1/teacher/courses/1/sections", json={"title": "Old", "position": 1})
    section_id = create_resp.json()["id"]

    # Update section
    payload = {"title": "New Title", "position": 2}
    response = client.put(f"/api/v1/teacher/sections/{section_id}", json=payload)
    assert response.status_code == 200
    assert response.json()["title"] == "New Title"
    assert response.json()["position"] == 2

def test_update_section_forbidden():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    create_resp = client.post("/api/v1/teacher/courses/1/sections", json={"title": "Old", "position": 1})
    section_id = create_resp.json()["id"]

    app.dependency_overrides[get_current_user] = override_get_current_user_student
    response = client.put(f"/api/v1/teacher/sections/{section_id}", json={"title": "New", "position": 2})
    assert response.status_code == 403

def test_delete_section_success():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    create_resp = client.post("/api/v1/teacher/courses/1/sections", json={"title": "Old", "position": 1})
    section_id = create_resp.json()["id"]

    response = client.delete(f"/api/v1/teacher/sections/{section_id}")
    assert response.status_code == 200

    # Ensure it's deleted by trying to update it
    response2 = client.put(f"/api/v1/teacher/sections/{section_id}", json={"title": "New", "position": 2})
    assert response2.status_code == 404
