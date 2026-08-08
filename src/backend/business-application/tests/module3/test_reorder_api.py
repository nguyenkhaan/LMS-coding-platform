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
    
    # Create course 1 (Teacher 1)
    resp = client.post("/api/v1/teacher/courses", json={"title": "Course 1", "description": "", "price": 0, "field": "IT", "tags": []})
    course_id = resp.json()["id"] # Should be 1
    
    # Create section 1 and 2
    client.post(f"/api/v1/teacher/courses/{course_id}/sections", json={"title": "S1", "position": 1})
    client.post(f"/api/v1/teacher/courses/{course_id}/sections", json={"title": "S2", "position": 2})
    
    # Create lessons in section 1
    client.post(f"/api/v1/teacher/sections/1/lessons", json={"title": "L1", "position": 1})
    client.post(f"/api/v1/teacher/sections/1/lessons", json={"title": "L2", "position": 2})

    # Create course 2 (Teacher 1) to test cross-course manipulation
    client.post("/api/v1/teacher/courses", json={"title": "Course 2", "description": "", "price": 0, "field": "IT", "tags": []})
    client.post(f"/api/v1/teacher/courses/2/sections", json={"title": "C2_S1", "position": 1})
    
    yield
    app.dependency_overrides = {}


def test_reorder_success():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    payload = {
        "reorder_data": [
            {"item_type": "section", "id": 2, "position": 1, "parent_id": None},
            {"item_type": "section", "id": 1, "position": 2, "parent_id": None},
            {"item_type": "lesson", "id": 2, "position": 1, "parent_id": 1},
            {"item_type": "lesson", "id": 1, "position": 2, "parent_id": 1}
        ]
    }
    response = client.put("/api/v1/teacher/courses/1/curriculum/reorder", json=payload)
    assert response.status_code == 200
    assert response.json()["message"] == "Reordered successfully"


def test_reorder_course_not_found():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    payload = {
        "reorder_data": [
            {"item_type": "section", "id": 2, "position": 1, "parent_id": None}
        ]
    }
    response = client.put("/api/v1/teacher/courses/999/curriculum/reorder", json=payload)
    assert response.status_code == 404
    assert response.json()["error_code"] == "COURSE_NOT_FOUND"


def test_reorder_forbidden():
    app.dependency_overrides[get_current_user] = override_get_current_user_student
    payload = {
        "reorder_data": [
            {"item_type": "section", "id": 2, "position": 1, "parent_id": None}
        ]
    }
    response = client.put("/api/v1/teacher/courses/1/curriculum/reorder", json=payload)
    assert response.status_code == 403
    assert response.json()["error_code"] == "FORBIDDEN"


def test_reorder_item_not_in_course():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    # Section 3 belongs to Course 2. We try to reorder it in Course 1.
    payload = {
        "reorder_data": [
            {"item_type": "section", "id": 3, "position": 1, "parent_id": None}
        ]
    }
    response = client.put("/api/v1/teacher/courses/1/curriculum/reorder", json=payload)
    assert response.status_code == 404
    assert response.json()["error_code"] == "SECTION_NOT_FOUND"

    # Also test for LESSON
    # Let's create a lesson in section 3 (course 2)
    client.post(f"/api/v1/teacher/sections/3/lessons", json={"title": "C2_L1", "position": 1})
    payload = {
        "reorder_data": [
            {"item_type": "lesson", "id": 3, "position": 1, "parent_id": 1} # Try to move it to section 1 of course 1
        ]
    }
    # Wait, the item belongs to course 2, but we pass course_id=1. It should throw LESSON_NOT_FOUND or similar for course 1 context.
    response2 = client.put("/api/v1/teacher/courses/1/curriculum/reorder", json=payload)
    assert response2.status_code == 404
    assert response2.json()["error_code"] == "LESSON_NOT_FOUND"
