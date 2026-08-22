import pytest
from httpx import AsyncClient

class TestStudyMode:
    def test_get_enrolled_courses(self, client):
        res = client.get("/api/v1/student/courses")
        assert res.status_code == 200
        body = res.json()
        assert "items" in body
        assert len(body["items"]) >= 1
        course = body["items"][0]
        assert "progress_percent" in course

    def test_get_study_content(self, client):
        res = client.get("/api/v1/student/courses/python-fundamentals/study")
        assert res.status_code == 200
        body = res.json()
        assert "course" in body
        assert "sections" in body
        assert len(body["sections"]) >= 1
        assert "lessons" in body["sections"][0]
        assert "contents" in body["sections"][0]["lessons"][0]
        content = body["sections"][0]["lessons"][0]["contents"][0]
        assert "locked" in content
        assert "completed" in content

    def test_complete_reading_success(self, client):
        # Fetch study content to get a valid reading content ID
        study_res = client.get("/api/v1/student/courses/python-fundamentals/study")
        study_body = study_res.json()
        content_id = study_body["sections"][0]["lessons"][0]["contents"][0]["id"]

        res = client.post(f"/api/v1/student/progress/lesson-content/{content_id}/complete")
        assert res.status_code == 200
        body = res.json()
        assert "lesson_content_id" in body
        assert body["lesson_content_id"] == content_id
        assert body["completed"] is True

    def test_complete_reading_idempotent(self, client):
        study_res = client.get("/api/v1/student/courses/python-fundamentals/study")
        study_body = study_res.json()
        content_id = study_body["sections"][0]["lessons"][0]["contents"][0]["id"]

        res = client.post(f"/api/v1/student/progress/lesson-content/{content_id}/complete")
        assert res.status_code == 200
        body = res.json()
        assert body["completed"] is True

    def test_complete_quiz_error(self, client):
        # Find a quiz content
        study_res = client.get("/api/v1/student/courses/python-fundamentals/study")
        study_body = study_res.json()
        quiz_id = None
        for sec in study_body["sections"]:
            for l in sec["lessons"]:
                for c in l["contents"]:
                    if c["content_type"] == "QUIZ":
                        quiz_id = c["id"]
                        break
        
        if quiz_id:
            res = client.post(f"/api/v1/student/progress/lesson-content/{quiz_id}/complete")
            assert res.status_code == 400
            assert res.json()["detail"] == "Chỉ có thể đánh dấu hoàn thành cho nội dung READING"

    def test_get_progress(self, client):
        res = client.get("/api/v1/student/progress?course_id=1")
        assert res.status_code == 200
        body = res.json()
        assert "items" in body
