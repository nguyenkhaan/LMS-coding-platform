"""
Tests for Module 2 - Endpoint 6:
  POST /student/progress/lesson-content/{id}/complete

Auth required (STUDENT role).

Fixtures used:
  client        - get_current_user overridden -> SEED_STUDENT (happy path)
  unauth_client - no override, no Bearer token -> 401 (auth guard test)
"""

from __future__ import annotations

from datetime import datetime

import pytest

from tests.module2.conftest import UNKNOWN_ID

VALID_LESSON_CONTENT_ID = 1   # Reading lesson in Free course
VALID_LESSON_CONTENT_ID_2 = 4 # Reading lesson in Paid course

class TestCompleteLessonContent:

    def test_complete_lesson_content_returns_200_for_valid_id(self, client):
        response = client.post(
            f"/api/v1/student/progress/lesson-content/{VALID_LESSON_CONTENT_ID}/complete"
        )

        assert response.status_code == 200
        body = response.json()
        assert "id" in body
        assert "lesson_content_id" in body
        assert "completed" in body
        assert "completed_at" in body

    def test_complete_lesson_content_is_completed_true(self, client):
        response = client.post(
            f"/api/v1/student/progress/lesson-content/{VALID_LESSON_CONTENT_ID}/complete"
        )

        assert response.status_code == 200
        assert response.json()["completed"] is True

    def test_complete_lesson_content_completed_at_is_valid_datetime(self, client):
        response = client.post(
            f"/api/v1/student/progress/lesson-content/{VALID_LESSON_CONTENT_ID}/complete"
        )

        assert response.status_code == 200
        completed_at_str = response.json()["completed_at"]
        parsed = datetime.fromisoformat(completed_at_str.replace("Z", "+00:00"))
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

    def test_complete_lesson_content_returns_200_for_existing_row(self, client):
        response = client.post(
            f"/api/v1/student/progress/lesson-content/{VALID_LESSON_CONTENT_ID_2}/complete"
        )

        assert response.status_code == 200
        body = response.json()
        assert body["lesson_content_id"] == VALID_LESSON_CONTENT_ID_2
        assert body["completed"] is True
        assert "completed_at" in body
