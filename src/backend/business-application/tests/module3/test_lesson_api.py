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
    # Reset mock data
    from src.modules.course.course_service import CourseService
    CourseService._clear_mock_data()
    
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    # Create course
    resp = client.post("/api/v1/teacher/courses", json={"title": "Course", "description": "", "price": 0, "field": "IT", "tags": []})
    course_id = resp.json()["id"]
    # Create section
    resp = client.post(f"/api/v1/teacher/courses/{course_id}/sections", json={"title": "Section 1", "position": 1})
    yield
    app.dependency_overrides = {}

def test_create_lesson_success():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    # section_id = 1 (created in fixture)
    payload = {"title": "Lesson 1", "position": 1}
    response = client.post("/api/v1/teacher/sections/1/lessons", json=payload)
    assert response.status_code == 201
    assert response.json()["title"] == "Lesson 1"
    assert "id" in response.json()

def test_create_lesson_forbidden():
    app.dependency_overrides[get_current_user] = override_get_current_user_student
    payload = {"title": "Lesson 1", "position": 1}
    response = client.post("/api/v1/teacher/sections/1/lessons", json=payload)
    assert response.status_code == 403

def test_update_lesson_success():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    resp = client.post("/api/v1/teacher/sections/1/lessons", json={"title": "Old", "position": 1})
    lesson_id = resp.json()["id"]

    payload = {"title": "New Title", "position": 2}
    response = client.put(f"/api/v1/teacher/lessons/{lesson_id}", json=payload)
    assert response.status_code == 200
    assert response.json()["title"] == "New Title"

def test_create_lesson_content_success():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    resp = client.post("/api/v1/teacher/sections/1/lessons", json={"title": "Lesson 1", "position": 1})
    lesson_id = resp.json()["id"]

    payload = {"content_type": "READING", "content_data": {"text": "Hello World"}}
    response = client.post(f"/api/v1/teacher/lessons/{lesson_id}/contents", json=payload)
    assert response.status_code == 201
    assert response.json()["content_type"] == "READING"
    assert "id" in response.json()

def test_update_lesson_content_success():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    resp = client.post("/api/v1/teacher/sections/1/lessons", json={"title": "Lesson 1", "position": 1})
    lesson_id = resp.json()["id"]

    resp2 = client.post(f"/api/v1/teacher/lessons/{lesson_id}/contents", json={"content_type": "READING", "content_data": {}})
    content_id = resp2.json()["id"]

    payload = {"content_type": "QUIZ", "content_data": {"questions": []}}
    response = client.put(f"/api/v1/teacher/lesson-contents/{content_id}", json=payload)
    assert response.status_code == 200
    assert response.json()["content_type"] == "QUIZ"

def test_cascade_delete_section():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    # Create lesson
    resp = client.post("/api/v1/teacher/sections/1/lessons", json={"title": "Lesson", "position": 1})
    lesson_id = resp.json()["id"]
    # Create content
    resp2 = client.post(f"/api/v1/teacher/lessons/{lesson_id}/contents", json={"content_type": "READING", "content_data": {}})
    content_id = resp2.json()["id"]

    # Delete section 1
    delete_resp = client.delete("/api/v1/teacher/sections/1")
    assert delete_resp.status_code == 200

    # Verify lesson is deleted (update fails 404)
    assert client.put(f"/api/v1/teacher/lessons/{lesson_id}", json={"title": "x", "position": 2}).status_code == 404
    # Verify content is deleted
    assert client.put(f"/api/v1/teacher/lesson-contents/{content_id}", json={"content_type": "QUIZ", "content_data": {}}).status_code == 404
