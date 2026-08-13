"""
Tests for Module 2 — Endpoint 7: GET /student/quizzes/{quizId}  (→ 200)
                    Endpoint 8: POST /student/quizzes/{quizId}/submit  (→ 200)

Both endpoints require authentication (STUDENT role).

Fixtures used:
  client        — get_current_user overridden → SEED_STUDENT (happy path)
  unauth_client — no override, no Bearer token → 401 (auth guard test)

Mock reference (from course_service.py):
  _MOCK_QUIZZES:         quiz_id=1 → "Kiểm tra kiến thức Python cơ bản", 3 questions
  _MOCK_QUIZ_ANSWER_KEY: {1: {Q1→opt2, Q2→opt3, Q3→opt1}}

Score calculations (formula: round((correct/total)*10, 2)):
  All correct  {1:2, 2:3, 3:1} → 3/3 → score=10.0,  passed=True
  All wrong    {1:1, 2:1, 3:2} → 0/3 → score=0.0,   passed=False
  Partial 2/3  {1:2, 2:3, 3:2} → 2/3 → score=6.67,  passed=True

Route path uses {quizId} per spec — FastAPI resolves via Path(alias="quizId").

ErrorResponse shape (from app.py http_exception_handler):
    {"message": "Cloudian Notification", "code": int, "detail": str,
     "timestamp": str, "path": str}
"""

from __future__ import annotations

import pytest

from tests.module2.conftest import UNKNOWN_ID

VALID_QUIZ_ID = 1


def _has_field_recursive(obj: object, field: str) -> bool:
    """
    Recursively search all dicts and lists in a JSON-decoded object
    and return True if any dict key matches `field`.

    Used to assert that 'is_correct' is never present at any nesting level.
    """
    if isinstance(obj, dict):
        if field in obj:
            return True
        return any(_has_field_recursive(v, field) for v in obj.values())
    if isinstance(obj, list):
        return any(_has_field_recursive(item, field) for item in obj)
    return False



class TestGetQuiz:

    def test_get_quiz_returns_200_for_valid_id(self, client):
        response = client.get(f"/api/v1/student/quizzes/{VALID_QUIZ_ID}")

        assert response.status_code == 200
        body = response.json()
        assert body["id"] == VALID_QUIZ_ID
        assert "title" in body
        assert "questions" in body
        assert isinstance(body["questions"], list)
        assert len(body["questions"]) > 0

    def test_get_quiz_questions_have_options(self, client):
        response = client.get(f"/api/v1/student/quizzes/{VALID_QUIZ_ID}")

        assert response.status_code == 200
        questions = response.json()["questions"]
        for question in questions:
            assert "id" in question
            assert "question_text" in question
            assert "options" in question
            assert isinstance(question["options"], list)
            assert len(question["options"]) > 0
            for option in question["options"]:
                assert "id" in option
                assert "text" in option

    def test_get_quiz_response_does_not_leak_correct_answer(self, client):
        # Recursively walk the entire response JSON tree.
        # If "is_correct" appears at ANY nesting level, this test fails.
        # This guards against accidental field leakage from the internal answer key.
        response = client.get(f"/api/v1/student/quizzes/{VALID_QUIZ_ID}")

        assert response.status_code == 200
        body = response.json()
        assert not _has_field_recursive(body, "is_correct"), (
            "'is_correct' must never appear in quiz response — "
            "it would leak the answer key to the student."
        )

    def test_get_quiz_returns_404_for_unknown_id(self, client):
        response = client.get(f"/api/v1/student/quizzes/{UNKNOWN_ID}")

        assert response.status_code == 404
        body = response.json()
        assert "message" in body
        assert "detail" in body
        assert body["code"] == 404

    def test_get_quiz_returns_401_without_auth(self, unauth_client):
        response = unauth_client.get(f"/api/v1/student/quizzes/{VALID_QUIZ_ID}")

        assert response.status_code == 401



class TestSubmitQuiz:

    def test_submit_quiz_all_correct_returns_score_10(self, client):
        # Answer key: {Q1→opt2, Q2→opt3, Q3→opt1} — all correct
        payload = {"answers": {"1": 2, "2": 3, "3": 1}}
        response = client.post(
            f"/api/v1/student/quizzes/{VALID_QUIZ_ID}/submit",
            json=payload,
        )

        assert response.status_code == 200
        body = response.json()
        assert body["score"] == 10.0
        assert body["passed"] is True
        assert body["correct_answers"] == body["total_count"]
        assert body["total_count"] == 3

    def test_submit_quiz_all_wrong_returns_score_0(self, client):
        # All wrong answers (none match the answer key)
        payload = {"answers": {"1": 1, "2": 1, "3": 2}}
        response = client.post(
            f"/api/v1/student/quizzes/{VALID_QUIZ_ID}/submit",
            json=payload,
        )

        assert response.status_code == 200
        body = response.json()
        assert body["score"] == 0.0
        assert body["passed"] is False
        assert body["correct_answers"] == 0
        assert body["total_count"] == 3

    def test_submit_quiz_partial_correct_calculates_score_correctly(self, client):
        # Q1 correct (opt2), Q2 correct (opt3), Q3 wrong (opt2 instead of opt1)
        # correct=2, total=3 → score = round((2/3)*10, 2) = 6.67
        payload = {"answers": {"1": 2, "2": 3, "3": 2}}
        response = client.post(
            f"/api/v1/student/quizzes/{VALID_QUIZ_ID}/submit",
            json=payload,
        )

        assert response.status_code == 200
        body = response.json()
        assert body["score"] == 6.67
        assert body["passed"] is True
        assert body["correct_answers"] == 2
        assert body["total_count"] == 3

    def test_submit_quiz_response_has_required_fields(self, client):
        payload = {"answers": {"1": 2, "2": 3, "3": 1}}
        response = client.post(
            f"/api/v1/student/quizzes/{VALID_QUIZ_ID}/submit",
            json=payload,
        )

        assert response.status_code == 200
        body = response.json()
        for field in ("submission_id", "score", "passed",
                      "correct_answers", "total_count"):
            assert field in body, f"Missing field: {field}"

    def test_submit_quiz_empty_answers_returns_400(self, client):
        payload = {"answers": {}}
        response = client.post(
            f"/api/v1/student/quizzes/{VALID_QUIZ_ID}/submit",
            json=payload,
        )

        assert response.status_code == 400

    def test_submit_quiz_returns_404_for_unknown_quiz_id(self, client):
        payload = {"answers": {"1": 2}}
        response = client.post(
            f"/api/v1/student/quizzes/{UNKNOWN_ID}/submit",
            json=payload,
        )

        assert response.status_code == 404
        body = response.json()
        assert "message" in body
        assert "detail" in body
        assert body["code"] == 404

    def test_submit_quiz_returns_401_without_auth(self, unauth_client):
        payload = {"answers": {"1": 2, "2": 3, "3": 1}}
        response = unauth_client.post(
            f"/api/v1/student/quizzes/{VALID_QUIZ_ID}/submit",
            json=payload,
        )

        assert response.status_code == 401
