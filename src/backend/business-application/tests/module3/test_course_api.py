import pytest
from fastapi.testclient import TestClient

# We will import the app after we create it, but for now we'll mock the import or assume it exists.
# We need to make sure the app has the router.
from src.app import app
from src.middlewares.auth_middleware import get_current_user

client = TestClient(app)

# Mocking current user dependency
def override_get_current_user_teacher():
    return {"sub": "1", "roles": ["TEACHER"]}

def override_get_current_user_student():
    return {"sub": "2", "roles": ["STUDENT"]}

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
        "status": "PENDING_REVIEW",
        "field": "IT",
        "tags": ["advanced"]
    }
    response = client.put("/api/v1/teacher/courses/1", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "PENDING_REVIEW"

def test_update_course_not_found():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    payload = {
        "title": "Updated Course",
        "description": "Updated description",
        "price": 200,
        "thumbnail_url": "http://example.com/img2.png",
        "status": "PENDING_REVIEW",
        "field": "IT",
        "tags": ["advanced"]
    }
    # Mocking that course 999 does not exist
    response = client.put("/api/v1/teacher/courses/999", json=payload)
    assert response.status_code == 404
    assert response.json()["error_code"] == "COURSE_NOT_FOUND"

def test_update_course_forbidden():
    # First, create a course as teacher 2
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher2
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
    payload["status"] = "PENDING_REVIEW"
    response = client.put(f"/api/v1/teacher/courses/{course_id}", json=payload)
    assert response.status_code == 403
    assert response.json()["error_code"] == "FORBIDDEN"

def override_get_current_user_teacher2():
    return {"sub": "2", "roles": ["TEACHER"]}

def test_get_course_detail_success():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    # Create first to ensure it exists and we own it
    payload = {
        "title": "Get My Course",
        "description": "Desc",
        "price": 50,
        "thumbnail_url": "url",
        "field": "IT",
        "tags": []
    }
    create_resp = client.post("/api/v1/teacher/courses", json=payload)
    course_id = create_resp.json()["id"]

    response = client.get(f"/api/v1/teacher/courses/{course_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == course_id
    assert data["title"] == payload["title"]
    assert "sections" not in data

def test_get_course_detail_not_found():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    response = client.get("/api/v1/teacher/courses/9999")
    assert response.status_code == 404
    assert response.json()["error_code"] == "COURSE_NOT_FOUND"

def test_get_course_detail_forbidden():
    # Simulate course created by teacher 2 
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher2
    payload = {
        "title": "Someone Elses Course",
        "description": "Desc",
        "price": 50,
        "thumbnail_url": "url",
        "field": "IT",
        "tags": []
    }
    create_resp = client.post("/api/v1/teacher/courses", json=payload)
    course_id = create_resp.json()["id"]

    # Teacher 1 tries to access it
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    response = client.get(f"/api/v1/teacher/courses/{course_id}")
    assert response.status_code == 403
    assert response.json()["error_code"] == "FORBIDDEN"

def test_submit_review_success_from_draft():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    # Create draft course
    payload = {
        "title": "Draft Course",
        "description": "Desc",
        "price": 50,
        "thumbnail_url": "url",
        "field": "IT",
        "tags": []
    }
    create_resp = client.post("/api/v1/teacher/courses", json=payload)
    course_id = create_resp.json()["id"]

    response = client.post(f"/api/v1/teacher/courses/{course_id}/submit-review")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "PENDING_REVIEW"
    assert "submitted_at" in data

def test_submit_review_invalid_state():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    payload = {
        "title": "Another Draft",
        "description": "Desc",
        "price": 50,
        "thumbnail_url": "url",
        "field": "IT",
        "tags": []
    }
    create_resp = client.post("/api/v1/teacher/courses", json=payload)
    course_id = create_resp.json()["id"]

    # Submit first time -> becomes PENDING_REVIEW
    client.post(f"/api/v1/teacher/courses/{course_id}/submit-review")

    # Submit second time -> should fail with 409 INVALID_STATE
    response = client.post(f"/api/v1/teacher/courses/{course_id}/submit-review")
    assert response.status_code == 409
    assert response.json()["error_code"] == "INVALID_STATE"

def test_submit_review_forbidden():
    # Simulate course created by teacher 2
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher2
    payload = {
        "title": "Teacher 2 Course",
        "description": "Desc",
        "price": 50,
        "thumbnail_url": "url",
        "field": "IT",
        "tags": []
    }
    create_resp = client.post("/api/v1/teacher/courses", json=payload)
    course_id = create_resp.json()["id"]

    # Teacher 1 tries to submit
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    response = client.post(f"/api/v1/teacher/courses/{course_id}/submit-review")
    assert response.status_code == 403
    assert response.json()["error_code"] == "FORBIDDEN"

def test_submit_review_not_found():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    response = client.post("/api/v1/teacher/courses/9999/submit-review")
    assert response.status_code == 404
    assert response.json()["error_code"] == "COURSE_NOT_FOUND"


def test_reorder_curriculum_success():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    # Create course
    payload = {"title": "Course for reorder", "description": "D", "price": 10, "thumbnail_url": "u", "field": "IT", "tags": []}
    course_resp = client.post("/api/v1/teacher/courses", json=payload)
    course_id = course_resp.json()["id"]

    # Add 2 sections
    s1_resp = client.post(f"/api/v1/teacher/courses/{course_id}/sections", json={"title": "Sec1", "position": 1})
    s1_id = s1_resp.json()["id"]
    s2_resp = client.post(f"/api/v1/teacher/courses/{course_id}/sections", json={"title": "Sec2", "position": 2})
    s2_id = s2_resp.json()["id"]

    # Reorder payload
    reorder_payload = {
        "reorder_data": [
            {"item_type": "section", "id": s2_id, "position": 1, "parent_id": None},
            {"item_type": "section", "id": s1_id, "position": 2, "parent_id": None}
        ]
    }
    resp = client.put(f"/api/v1/teacher/courses/{course_id}/curriculum/reorder", json=reorder_payload)
    assert resp.status_code == 200

def test_reorder_curriculum_missing_item():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    # Create course
    payload = {"title": "Course missing item", "description": "D", "price": 10, "thumbnail_url": "u", "field": "IT", "tags": []}
    course_resp = client.post("/api/v1/teacher/courses", json=payload)
    course_id = course_resp.json()["id"]

    # Add 1 section
    s1_resp = client.post(f"/api/v1/teacher/courses/{course_id}/sections", json={"title": "Sec1", "position": 1})
    s1_id = s1_resp.json()["id"]

    # Reorder payload tries to reorder a non-existent section
    reorder_payload = {
        "reorder_data": [
            {"item_type": "section", "id": 9999, "position": 1, "parent_id": None}
        ]
    }
    resp = client.put(f"/api/v1/teacher/courses/{course_id}/curriculum/reorder", json=reorder_payload)
    assert resp.status_code == 400
    assert resp.json()["error_code"] == "INVALID_REQUEST"

def test_reorder_curriculum_wrong_course():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    # Create course 1
    c1_resp = client.post("/api/v1/teacher/courses", json={"title": "C1", "description": "D", "price": 10, "thumbnail_url": "u", "field": "IT", "tags": []})
    c1_id = c1_resp.json()["id"]
    s1_resp = client.post(f"/api/v1/teacher/courses/{c1_id}/sections", json={"title": "Sec1", "position": 1})
    s1_id = s1_resp.json()["id"]

    # Create course 2
    c2_resp = client.post("/api/v1/teacher/courses", json={"title": "C2", "description": "D", "price": 10, "thumbnail_url": "u", "field": "IT", "tags": []})
    c2_id = c2_resp.json()["id"]

    # Try to put c1's section into c2
    reorder_payload = {
        "reorder_data": [
            {"item_type": "section", "id": s1_id, "position": 1, "parent_id": None}
        ]
    }
    resp = client.put(f"/api/v1/teacher/courses/{c2_id}/curriculum/reorder", json=reorder_payload)
    assert resp.status_code == 400
    assert resp.json()["error_code"] == "INVALID_REQUEST"

def test_reorder_curriculum_forbidden():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher2
    c1_resp = client.post("/api/v1/teacher/courses", json={"title": "C1", "description": "D", "price": 10, "thumbnail_url": "u", "field": "IT", "tags": []})
    c1_id = c1_resp.json()["id"]

    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    reorder_payload = {"reorder_data": []}
    resp = client.put(f"/api/v1/teacher/courses/{c1_id}/curriculum/reorder", json=reorder_payload)
    assert resp.status_code == 403
    assert resp.json()["error_code"] == "FORBIDDEN"


def test_reorder_curriculum_lesson_content():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    # Create course
    payload = {"title": "Course for content", "description": "D", "price": 10, "thumbnail_url": "u", "field": "IT", "tags": []}
    course_resp = client.post("/api/v1/teacher/courses", json=payload)
    course_id = course_resp.json()["id"]

    # Add 1 section
    s1_resp = client.post(f"/api/v1/teacher/courses/{course_id}/sections", json={"title": "Sec1", "position": 1})
    s1_id = s1_resp.json()["id"]

    # Add 1 lesson
    l1_resp = client.post(f"/api/v1/teacher/sections/{s1_id}/lessons", json={"title": "Les1", "summary": "S", "position": 1})
    l1_id = l1_resp.json()["id"]

    # Add 2 contents
    c1_resp = client.post(f"/api/v1/teacher/lessons/{l1_id}/contents", json={"content_type": "READING", "content_id": 1, "media_url": "url", "position": 1})
    c1_id = c1_resp.json()["id"]
    c2_resp = client.post(f"/api/v1/teacher/lessons/{l1_id}/contents", json={"content_type": "READING", "content_id": 2, "media_url": "url", "position": 2})
    c2_id = c2_resp.json()["id"]

    # Reorder contents
    reorder_payload = {
        "reorder_data": [
            {"item_type": "section", "id": s1_id, "position": 1, "parent_id": None},
            {"item_type": "lesson", "id": l1_id, "position": 1, "parent_id": s1_id},
            {"item_type": "lesson_content", "id": c2_id, "position": 1, "parent_id": l1_id},
            {"item_type": "lesson_content", "id": c1_id, "position": 2, "parent_id": l1_id}
        ]
    }
    resp = client.put(f"/api/v1/teacher/courses/{course_id}/curriculum/reorder", json=reorder_payload)
    assert resp.status_code == 200

def test_reorder_curriculum_content_wrong_course():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    c1_resp = client.post("/api/v1/teacher/courses", json={"title": "C1", "description": "D", "price": 10, "thumbnail_url": "u", "field": "IT", "tags": []})
    c1_id = c1_resp.json()["id"]
    s1_resp = client.post(f"/api/v1/teacher/courses/{c1_id}/sections", json={"title": "Sec1", "position": 1})
    s1_id = s1_resp.json()["id"]
    l1_resp = client.post(f"/api/v1/teacher/sections/{s1_id}/lessons", json={"title": "Les1", "summary": "S", "position": 1})
    l1_id = l1_resp.json()["id"]
    c1_resp = client.post(f"/api/v1/teacher/lessons/{l1_id}/contents", json={"content_type": "READING", "content_id": 1, "media_url": "url", "position": 1})
    c1_id = c1_resp.json()["id"]

    # Course 2
    c2_resp = client.post("/api/v1/teacher/courses", json={"title": "C2", "description": "D", "price": 10, "thumbnail_url": "u", "field": "IT", "tags": []})
    c2_id = c2_resp.json()["id"]

    # Reorder payload tries to reorder c1's content in c2
    reorder_payload = {
        "reorder_data": [
            {"item_type": "lesson_content", "id": c1_id, "position": 1, "parent_id": l1_id}
        ]
    }
    resp = client.put(f"/api/v1/teacher/courses/{c2_id}/curriculum/reorder", json=reorder_payload)
    assert resp.status_code == 400
    assert resp.json()["error_code"] == "INVALID_REQUEST"


def test_reorder_curriculum_duplicate_positions():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    # Create course
    payload = {"title": "Course duplicate pos", "description": "D", "price": 10, "thumbnail_url": "u", "field": "IT", "tags": []}
    course_resp = client.post("/api/v1/teacher/courses", json=payload)
    course_id = course_resp.json()["id"]

    s1_resp = client.post(f"/api/v1/teacher/courses/{course_id}/sections", json={"title": "Sec1", "position": 1})
    s1_id = s1_resp.json()["id"]
    s2_resp = client.post(f"/api/v1/teacher/courses/{course_id}/sections", json={"title": "Sec2", "position": 2})
    s2_id = s2_resp.json()["id"]

    # Reorder payload with duplicate positions
    reorder_payload = {
        "reorder_data": [
            {"item_type": "section", "id": s1_id, "position": 1, "parent_id": None},
            {"item_type": "section", "id": s2_id, "position": 1, "parent_id": None}
        ]
    }
    resp = client.put(f"/api/v1/teacher/courses/{course_id}/curriculum/reorder", json=reorder_payload)
    assert resp.status_code == 409
    assert resp.json()["error_code"] == "INVALID_STATE"


def test_reorder_curriculum_missing_or_extra_items():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    # Create course
    payload = {"title": "Course incomplete pos", "description": "D", "price": 10, "thumbnail_url": "u", "field": "IT", "tags": []}
    course_resp = client.post("/api/v1/teacher/courses", json=payload)
    course_id = course_resp.json()["id"]

    s1_resp = client.post(f"/api/v1/teacher/courses/{course_id}/sections", json={"title": "Sec1", "position": 1})
    s1_id = s1_resp.json()["id"]
    s2_resp = client.post(f"/api/v1/teacher/courses/{course_id}/sections", json={"title": "Sec2", "position": 2})
    s2_id = s2_resp.json()["id"]

    # Missing s2
    reorder_payload_missing = {
        "reorder_data": [
            {"item_type": "section", "id": s1_id, "position": 1, "parent_id": None}
        ]
    }
    resp = client.put(f"/api/v1/teacher/courses/{course_id}/curriculum/reorder", json=reorder_payload_missing)
    assert resp.status_code == 400
    assert resp.json()["error_code"] == "INVALID_REQUEST"




def test_delete_lesson_success():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    # Create course, section, lesson
    c_resp = client.post("/api/v1/teacher/courses", json={"title": "Course for delete", "description": "D", "price": 10, "thumbnail_url": "u", "field": "IT", "tags": []})
    c_id = c_resp.json()["id"]
    s_resp = client.post(f"/api/v1/teacher/courses/{c_id}/sections", json={"title": "Sec", "position": 1})
    s_id = s_resp.json()["id"]
    l_resp = client.post(f"/api/v1/teacher/sections/{s_id}/lessons", json={"title": "Les", "summary": "S", "position": 1})
    l_id = l_resp.json()["id"]

    # Delete lesson
    del_resp = client.delete(f"/api/v1/teacher/lessons/{l_id}")
    assert del_resp.status_code == 200
    assert del_resp.json()["message"] == "Deleted successfully"

def test_delete_lesson_has_content_blocks():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    # Create course, section, lesson, content
    c_resp = client.post("/api/v1/teacher/courses", json={"title": "Course block", "description": "D", "price": 10, "thumbnail_url": "u", "field": "IT", "tags": []})
    c_id = c_resp.json()["id"]
    s_resp = client.post(f"/api/v1/teacher/courses/{c_id}/sections", json={"title": "Sec", "position": 1})
    s_id = s_resp.json()["id"]
    l_resp = client.post(f"/api/v1/teacher/sections/{s_id}/lessons", json={"title": "Les block", "summary": "S", "position": 1})
    l_id = l_resp.json()["id"]
    client.post(f"/api/v1/teacher/lessons/{l_id}/contents", json={"content_type": "READING", "content_id": 1, "position": 1})

    # Try delete lesson -> blocked 409
    del_resp = client.delete(f"/api/v1/teacher/lessons/{l_id}")
    assert del_resp.status_code == 409
    assert del_resp.json()["error_code"] == "INVALID_STATE"

def test_delete_lesson_wrong_course_state():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    # Create course, section, lesson
    c_resp = client.post("/api/v1/teacher/courses", json={"title": "Course wrong state", "description": "D", "price": 10, "thumbnail_url": "u", "field": "IT", "tags": []})
    c_id = c_resp.json()["id"]
    s_resp = client.post(f"/api/v1/teacher/courses/{c_id}/sections", json={"title": "Sec", "position": 1})
    s_id = s_resp.json()["id"]
    l_resp = client.post(f"/api/v1/teacher/sections/{s_id}/lessons", json={"title": "Les wrong state", "summary": "S", "position": 1})
    l_id = l_resp.json()["id"]

    # Change state to PENDING_REVIEW by submitting
    client.post(f"/api/v1/teacher/courses/{c_id}/submit-review")

    # Try delete lesson -> blocked 409
    del_resp = client.delete(f"/api/v1/teacher/lessons/{l_id}")
    assert del_resp.status_code == 409
    assert del_resp.json()["error_code"] == "INVALID_STATE"

def test_delete_lesson_not_found():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    del_resp = client.delete(f"/api/v1/teacher/lessons/9999")
    assert del_resp.status_code == 404
    assert del_resp.json()["error_code"] == "LESSON_NOT_FOUND"

def test_delete_lesson_forbidden():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    # Course owner is teacher 1
    c_resp = client.post("/api/v1/teacher/courses", json={"title": "C1", "description": "D", "price": 10, "thumbnail_url": "u", "field": "IT", "tags": []})
    c_id = c_resp.json()["id"]
    s_resp = client.post(f"/api/v1/teacher/courses/{c_id}/sections", json={"title": "Sec", "position": 1})
    s_id = s_resp.json()["id"]
    l_resp = client.post(f"/api/v1/teacher/sections/{s_id}/lessons", json={"title": "Les", "summary": "S", "position": 1})
    l_id = l_resp.json()["id"]

    # Teacher 2 tries to delete
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher2
    del_resp = client.delete(f"/api/v1/teacher/lessons/{l_id}")
    # Either 404 or 403 depending on get_lesson_or_404
    assert del_resp.status_code in [403, 404]


def test_create_reading_success():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    # Create course, section, lesson
    c_resp = client.post("/api/v1/teacher/courses", json={"title": "Course read", "description": "D", "price": 10, "thumbnail_url": "u", "field": "IT", "tags": []})
    c_id = c_resp.json()["id"]
    s_resp = client.post(f"/api/v1/teacher/courses/{c_id}/sections", json={"title": "Sec", "position": 1})
    s_id = s_resp.json()["id"]
    l_resp = client.post(f"/api/v1/teacher/sections/{s_id}/lessons", json={"title": "Les", "summary": "S", "position": 1})
    l_id = l_resp.json()["id"]

    payload = {
        "title": "Read 1",
        "content": "<p>Content</p>",
        "position": 1
    }
    r_resp = client.post(f"/api/v1/teacher/lessons/{l_id}/readings", json=payload)
    assert r_resp.status_code == 201
    data = r_resp.json()
    assert "reading_content" in data
    assert "lesson_content" in data
    assert data["reading_content"]["title"] == "Read 1"
    assert data["lesson_content"]["content_type"] == "READING"
    assert data["lesson_content"]["position"] == 1

def test_create_reading_invalid_state():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    c_resp = client.post("/api/v1/teacher/courses", json={"title": "C", "description": "D", "price": 10, "thumbnail_url": "u", "field": "IT", "tags": []})
    c_id = c_resp.json()["id"]
    s_resp = client.post(f"/api/v1/teacher/courses/{c_id}/sections", json={"title": "Sec", "position": 1})
    s_id = s_resp.json()["id"]
    l_resp = client.post(f"/api/v1/teacher/sections/{s_id}/lessons", json={"title": "Les", "summary": "S", "position": 1})
    l_id = l_resp.json()["id"]

    client.post(f"/api/v1/teacher/courses/{c_id}/submit-review")

    payload = {"title": "R1", "content": "C", "position": 1}
    r_resp = client.post(f"/api/v1/teacher/lessons/{l_id}/readings", json=payload)
    assert r_resp.status_code == 409
    assert r_resp.json()["error_code"] == "INVALID_STATE"

def test_create_reading_not_found():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    payload = {"title": "R1", "content": "C", "position": 1}
    r_resp = client.post(f"/api/v1/teacher/lessons/9999/readings", json=payload)
    assert r_resp.status_code == 404
    assert r_resp.json()["error_code"] == "LESSON_NOT_FOUND"

def test_create_reading_forbidden():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    c_resp = client.post("/api/v1/teacher/courses", json={"title": "C1", "description": "D", "price": 10, "thumbnail_url": "u", "field": "IT", "tags": []})
    c_id = c_resp.json()["id"]
    s_resp = client.post(f"/api/v1/teacher/courses/{c_id}/sections", json={"title": "Sec", "position": 1})
    s_id = s_resp.json()["id"]
    l_resp = client.post(f"/api/v1/teacher/sections/{s_id}/lessons", json={"title": "Les", "summary": "S", "position": 1})
    l_id = l_resp.json()["id"]

    app.dependency_overrides[get_current_user] = override_get_current_user_teacher2
    payload = {"title": "R1", "content": "C", "position": 1}
    r_resp = client.post(f"/api/v1/teacher/lessons/{l_id}/readings", json=payload)
    assert r_resp.status_code in [403, 404]


def test_update_reading_success():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    c_resp = client.post("/api/v1/teacher/courses", json={"title": "C update", "description": "D", "price": 10, "thumbnail_url": "u", "field": "IT", "tags": []})
    c_id = c_resp.json()["id"]
    s_resp = client.post(f"/api/v1/teacher/courses/{c_id}/sections", json={"title": "Sec", "position": 1})
    s_id = s_resp.json()["id"]
    l_resp = client.post(f"/api/v1/teacher/sections/{s_id}/lessons", json={"title": "Les", "summary": "S", "position": 1})
    l_id = l_resp.json()["id"]

    # Create reading
    r_resp = client.post(f"/api/v1/teacher/lessons/{l_id}/readings", json={"title": "R1", "content": "C1", "position": 1})
    lc_id = r_resp.json()["lesson_content"]["id"]

    # Update reading
    update_payload = {"title": "R1 Updated", "content": "C1 Updated"}
    u_resp = client.put(f"/api/v1/teacher/lesson-contents/{lc_id}/reading", json=update_payload)
    assert u_resp.status_code == 200
    assert u_resp.json()["title"] == "R1 Updated"
    assert u_resp.json()["content"] == "C1 Updated"

def test_update_reading_invalid_state():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    c_resp = client.post("/api/v1/teacher/courses", json={"title": "C", "description": "D", "price": 10, "thumbnail_url": "u", "field": "IT", "tags": []})
    c_id = c_resp.json()["id"]
    s_resp = client.post(f"/api/v1/teacher/courses/{c_id}/sections", json={"title": "Sec", "position": 1})
    s_id = s_resp.json()["id"]
    l_resp = client.post(f"/api/v1/teacher/sections/{s_id}/lessons", json={"title": "Les", "summary": "S", "position": 1})
    l_id = l_resp.json()["id"]

    r_resp = client.post(f"/api/v1/teacher/lessons/{l_id}/readings", json={"title": "R1", "content": "C1", "position": 1})
    lc_id = r_resp.json()["lesson_content"]["id"]

    client.post(f"/api/v1/teacher/courses/{c_id}/submit-review")

    u_resp = client.put(f"/api/v1/teacher/lesson-contents/{lc_id}/reading", json={"title": "New"})
    assert u_resp.status_code == 409
    assert u_resp.json()["error_code"] == "INVALID_STATE"

def test_update_reading_wrong_type():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    c_resp = client.post("/api/v1/teacher/courses", json={"title": "C", "description": "D", "price": 10, "thumbnail_url": "u", "field": "IT", "tags": []})
    c_id = c_resp.json()["id"]
    s_resp = client.post(f"/api/v1/teacher/courses/{c_id}/sections", json={"title": "Sec", "position": 1})
    s_id = s_resp.json()["id"]
    l_resp = client.post(f"/api/v1/teacher/sections/{s_id}/lessons", json={"title": "Les", "summary": "S", "position": 1})
    l_id = l_resp.json()["id"]

    # Create a raw lesson content of type QUIZ
    qc_resp = client.post(f"/api/v1/teacher/lessons/{l_id}/contents", json={"content_type": "QUIZ", "content_id": 99, "position": 1})
    lc_id = qc_resp.json()["id"]

    u_resp = client.put(f"/api/v1/teacher/lesson-contents/{lc_id}/reading", json={"title": "New"})
    assert u_resp.status_code == 400
    assert u_resp.json()["error_code"] == "INVALID_REQUEST"

def test_update_reading_not_found():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    u_resp = client.put(f"/api/v1/teacher/lesson-contents/9999/reading", json={"title": "New"})
    assert u_resp.status_code == 404
    assert u_resp.json()["error_code"] == "CONTENT_NOT_FOUND"

def test_update_reading_forbidden():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    c_resp = client.post("/api/v1/teacher/courses", json={"title": "C1", "description": "D", "price": 10, "thumbnail_url": "u", "field": "IT", "tags": []})
    c_id = c_resp.json()["id"]
    s_resp = client.post(f"/api/v1/teacher/courses/{c_id}/sections", json={"title": "Sec", "position": 1})
    s_id = s_resp.json()["id"]
    l_resp = client.post(f"/api/v1/teacher/sections/{s_id}/lessons", json={"title": "Les", "summary": "S", "position": 1})
    l_id = l_resp.json()["id"]
    r_resp = client.post(f"/api/v1/teacher/lessons/{l_id}/readings", json={"title": "R1", "content": "C1", "position": 1})
    lc_id = r_resp.json()["lesson_content"]["id"]

    app.dependency_overrides[get_current_user] = override_get_current_user_teacher2
    u_resp = client.put(f"/api/v1/teacher/lesson-contents/{lc_id}/reading", json={"title": "New"})
    assert u_resp.status_code in [403, 404]


def test_delete_lesson_content_success():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    c_resp = client.post("/api/v1/teacher/courses", json={"title": "C del lc", "description": "D", "price": 10, "thumbnail_url": "u", "field": "IT", "tags": []})
    c_id = c_resp.json()["id"]
    s_resp = client.post(f"/api/v1/teacher/courses/{c_id}/sections", json={"title": "Sec", "position": 1})
    s_id = s_resp.json()["id"]
    l_resp = client.post(f"/api/v1/teacher/sections/{s_id}/lessons", json={"title": "Les", "summary": "S", "position": 1})
    l_id = l_resp.json()["id"]
    r_resp = client.post(f"/api/v1/teacher/lessons/{l_id}/readings", json={"title": "R1", "content": "C1", "position": 1})
    lc_id = r_resp.json()["lesson_content"]["id"]

    del_resp = client.delete(f"/api/v1/teacher/lesson-contents/{lc_id}")
    assert del_resp.status_code == 200
    assert del_resp.json()["message"] == "Deleted successfully"

def test_delete_lesson_content_invalid_state():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    c_resp = client.post("/api/v1/teacher/courses", json={"title": "C", "description": "D", "price": 10, "thumbnail_url": "u", "field": "IT", "tags": []})
    c_id = c_resp.json()["id"]
    s_resp = client.post(f"/api/v1/teacher/courses/{c_id}/sections", json={"title": "Sec", "position": 1})
    s_id = s_resp.json()["id"]
    l_resp = client.post(f"/api/v1/teacher/sections/{s_id}/lessons", json={"title": "Les", "summary": "S", "position": 1})
    l_id = l_resp.json()["id"]
    r_resp = client.post(f"/api/v1/teacher/lessons/{l_id}/readings", json={"title": "R1", "content": "C1", "position": 1})
    lc_id = r_resp.json()["lesson_content"]["id"]

    client.post(f"/api/v1/teacher/courses/{c_id}/submit-review")

    del_resp = client.delete(f"/api/v1/teacher/lesson-contents/{lc_id}")
    assert del_resp.status_code == 409
    assert del_resp.json()["error_code"] == "INVALID_STATE"

def test_delete_lesson_content_not_found():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    del_resp = client.delete(f"/api/v1/teacher/lesson-contents/9999")
    assert del_resp.status_code == 404
    assert del_resp.json()["error_code"] == "CONTENT_NOT_FOUND"

def test_delete_lesson_content_forbidden():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    c_resp = client.post("/api/v1/teacher/courses", json={"title": "C1", "description": "D", "price": 10, "thumbnail_url": "u", "field": "IT", "tags": []})
    c_id = c_resp.json()["id"]
    s_resp = client.post(f"/api/v1/teacher/courses/{c_id}/sections", json={"title": "Sec", "position": 1})
    s_id = s_resp.json()["id"]
    l_resp = client.post(f"/api/v1/teacher/sections/{s_id}/lessons", json={"title": "Les", "summary": "S", "position": 1})
    l_id = l_resp.json()["id"]
    r_resp = client.post(f"/api/v1/teacher/lessons/{l_id}/readings", json={"title": "R1", "content": "C1", "position": 1})
    lc_id = r_resp.json()["lesson_content"]["id"]

    app.dependency_overrides[get_current_user] = override_get_current_user_teacher2
    del_resp = client.delete(f"/api/v1/teacher/lesson-contents/{lc_id}")
    assert del_resp.status_code in [403, 404]

