"""
Tests for Module 2 — Endpoint 6:
  POST /student/progress/lesson-content/{id}/complete  (→ 200)

Auth required (STUDENT role).

Fixtures used:
  client        — get_current_user overridden → SEED_STUDENT (happy path)
  unauth_client — no override, no Bearer token → 401 (auth guard test)

Mock reference (from course_service.py):
  _VALID_LESSON_CONTENT_IDS = {1, 2, 3, 4, 5, 6, 20, 21, 22}
  completed_at  = datetime.now(timezone.utc)  → ISO 8601 string in response

Route path uses {id} per spec — FastAPI resolves via Path(alias="id").
Test uses URL /student/progress/lesson-content/1/complete (id=1 is valid).

ErrorResponse shape (from app.py http_exception_handler):
    {"message": "Cloudian Notification", "code": int, "detail": str,
     "timestamp": str, "path": str}
"""

from __future__ import annotations

from datetime import datetime

import pytest

from tests.module2.conftest import UNKNOWN_ID

VALID_LESSON_CONTENT_ID = 1   # Present in _VALID_LESSON_CONTENT_IDS



class TestCompleteLessonContent:

    def test_complete_lesson_content_returns_200_for_valid_id(self, client):
        response = client.post(
            f"/api/v1/student/progress/lesson-content/{VALID_LESSON_CONTENT_ID}/complete"
        )

        assert response.status_code == 200
        body = response.json()
        assert "message" in body
        assert "completed_at" in body

    def test_complete_lesson_content_message_is_non_empty_string(self, client):
        response = client.post(
            f"/api/v1/student/progress/lesson-content/{VALID_LESSON_CONTENT_ID}/complete"
        )

        assert response.status_code == 200
        message = response.json()["message"]
        assert isinstance(message, str)
        assert len(message) > 0

    def test_complete_lesson_content_completed_at_is_valid_datetime(self, client):
        response = client.post(
            f"/api/v1/student/progress/lesson-content/{VALID_LESSON_CONTENT_ID}/complete"
        )

        assert response.status_code == 200
        completed_at_str = response.json()["completed_at"]
        # Must parse without raising — service returns datetime.now(timezone.utc)
        parsed = datetime.fromisoformat(completed_at_str)
        assert parsed is not None

    def test_complete_lesson_content_returns_404_for_unknown_id(self, client):
        response = client.post(
            f"/api/v1/student/progress/lesson-content/{UNKNOWN_ID}/complete"
        )

        assert response.status_code == 404
        body = response.json()
        assert "message" in body
        assert "detail" in body
        assert body["code"] == 404

    def test_complete_lesson_content_returns_401_without_auth(self, unauth_client):
        response = unauth_client.post(
            f"/api/v1/student/progress/lesson-content/{VALID_LESSON_CONTENT_ID}/complete"
        )

        assert response.status_code == 401

    def test_complete_lesson_content_returns_200_for_newly_added_lesson(self, client):
        # ID 23 was added during the mock data expansion for Python Section 2
        response = client.post(
            "/api/v1/student/progress/lesson-content/23/complete"
        )

        assert response.status_code == 200
        body = response.json()
        assert "message" in body
        assert "completed_at" in body
