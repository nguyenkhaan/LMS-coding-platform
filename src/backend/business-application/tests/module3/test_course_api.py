import pytest
from fastapi.testclient import TestClient

# We will import the app after we create it, but for now we'll mock the import or assume it exists.
# We need to make sure the app has the router.
from src.app import app
from src.middlewares.auth_middleware import get_current_user

client = TestClient(app)

# Mocking current user dependency
def override_get_current_user_teacher():
    return {"sub": "1", "role": "teacher"}

def override_get_current_user_student():
    return {"sub": "2", "role": "student"}

def test_get_courses_unauthorized():
    # Test 401 when not logged in (no dependency override)
    app.dependency_overrides = {}
    response = client.get("/api/v1/teacher/courses")
    assert response.status_code == 401
    data = response.json()
    assert "error_code" in data

def test_get_courses_success():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    response = client.get("/api/v1/teacher/courses")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_course_unauthorized():
    app.dependency_overrides = {}
    payload = {
        "title": "New Course",
        "description": "Course description",
        "price": 100,
        "thumbnail_url": "http://example.com/img.png",
        "field": "IT",
        "tags": ["programming"]
    }
    response = client.post("/api/v1/teacher/courses", json=payload)
    assert response.status_code == 401

def test_create_course_validation_error():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    payload = {
        "title": "New Course"
        # missing other fields
    }
    response = client.post("/api/v1/teacher/courses", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert data["error_code"] == "VALIDATION_ERROR"
    assert "details" in data

def test_create_course_success():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    payload = {
        "title": "New Course",
        "description": "Course description",
        "price": 100,
        "thumbnail_url": "http://example.com/img.png",
        "field": "IT",
        "tags": ["programming"]
    }
    response = client.post("/api/v1/teacher/courses", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == payload["title"]
    assert "id" in data

def test_update_course_success():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    payload = {
        "title": "Updated Course",
        "description": "Updated description",
        "price": 200,
        "thumbnail_url": "http://example.com/img2.png",
        "status": "PUBLISHED",
        "field": "IT",
        "tags": ["advanced"]
    }
    response = client.put("/api/v1/teacher/courses/1", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "PUBLISHED"

def test_update_course_not_found():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    payload = {
        "title": "Updated Course",
        "description": "Updated description",
        "price": 200,
        "thumbnail_url": "http://example.com/img2.png",
        "status": "PUBLISHED",
        "field": "IT",
        "tags": ["advanced"]
    }
    # Mocking that course 999 does not exist
    response = client.put("/api/v1/teacher/courses/999", json=payload)
    assert response.status_code == 404
    assert response.json()["error_code"] == "COURSE_NOT_FOUND"

def test_update_course_forbidden():
    # First, create a course as teacher 2
    app.dependency_overrides[get_current_user] = override_get_current_user_student  # Using student logic just to simulate another ID
    payload = {
        "title": "Another Teacher Course",
        "description": "Updated description",
        "price": 200,
        "thumbnail_url": "http://example.com/img2.png",
        "field": "IT",
        "tags": ["advanced"]
    }
    create_resp = client.post("/api/v1/teacher/courses", json=payload)
    assert create_resp.status_code == 201
    course_id = create_resp.json()["id"]

    # Now login as teacher 1 and try to update it
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    payload["status"] = "PUBLISHED"
    response = client.put(f"/api/v1/teacher/courses/{course_id}", json=payload)
    assert response.status_code == 403
    assert response.json()["error_code"] == "FORBIDDEN"
