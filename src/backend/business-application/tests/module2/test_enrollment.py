"""
Tests for Module 2 — Endpoint 3: POST /courses/{slug}/enroll (→ 201)
                    Endpoint 9: POST /courses/{slug}/unenroll (→ 200)

Both endpoints require authentication (STUDENT role).

Fixtures used:
  client        — get_current_user overridden → SEED_STUDENT (happy path)
  unauth_client — no override, no Bearer token → 401 (auth guard test)

Mock slug reference (from course_service.py _MOCK_COURSES):
  FREE  slugs → ENROLLED,         checkout_url=None : nhap-mon-lap-trinh-python, co-so-du-lieu-sql
  PAID  slugs → PENDING_PAYMENT,  checkout_url set  : cau-truc-du-lieu-va-giai-thuat, lap-trinh-web-voi-fastapi

ErrorResponse shape (from app.py http_exception_handler):
    {"message": "Cloudian Notification", "code": int, "detail": str,
     "timestamp": str, "path": str}
"""

from __future__ import annotations

import pytest

from tests.module2.conftest import UNKNOWN_SLUG

FREE_SLUG = "nhap-mon-lap-trinh-python"
PAID_SLUG = "cau-truc-du-lieu-va-giai-thuat"



class TestEnrollCourse:

    def test_enroll_course_returns_201_for_free_slug(self, client):
        response = client.post(f"/api/v1/courses/{FREE_SLUG}/enroll")

        assert response.status_code == 201
        body = response.json()
        assert "status" in body

    def test_enroll_course_checkout_url_is_null_when_enrolled(self, client):
        # FREE course → status=ENROLLED, checkout_url must be absent or null
        response = client.post(f"/api/v1/courses/{FREE_SLUG}/enroll")

        assert response.status_code == 201
        body = response.json()
        assert body["status"] == "ENROLLED"
        # checkout_url is Optional — either missing from payload or explicitly null
        assert body.get("checkout_url") is None

    def test_enroll_course_checkout_url_present_when_pending_payment(self, client):
        # PAID course → status=PENDING_PAYMENT, checkout_url must be a non-empty string
        response = client.post(f"/api/v1/courses/{PAID_SLUG}/enroll")

        assert response.status_code == 201
        body = response.json()
        assert body["status"] == "PENDING_PAYMENT"
        assert isinstance(body.get("checkout_url"), str)
        assert len(body["checkout_url"]) > 0

    def test_enroll_course_returns_404_for_unknown_slug(self, client):
        response = client.post(f"/api/v1/courses/{UNKNOWN_SLUG}/enroll")

        assert response.status_code == 404
        body = response.json()
        assert "message" in body
        assert "detail" in body
        assert body["code"] == 404

    def test_enroll_course_returns_401_without_auth(self, unauth_client):
        response = unauth_client.post(f"/api/v1/courses/{FREE_SLUG}/enroll")

        assert response.status_code == 401



class TestUnenrollCourse:

    def test_unenroll_course_returns_200_for_existing_slug(self, client):
        response = client.post(f"/api/v1/courses/{FREE_SLUG}/unenroll")

        assert response.status_code == 200
        body = response.json()
        assert "message" in body
        assert isinstance(body["message"], str)
        assert len(body["message"]) > 0

    def test_unenroll_course_message_contains_course_title(self, client):
        response = client.post(f"/api/v1/courses/{FREE_SLUG}/unenroll")

        assert response.status_code == 200
        # Service returns: "Successfully unenrolled from course '<title>'"
        assert "Successfully" in response.json()["message"]

    def test_unenroll_course_returns_404_for_unknown_slug(self, client):
        response = client.post(f"/api/v1/courses/{UNKNOWN_SLUG}/unenroll")

        assert response.status_code == 404
        body = response.json()
        assert "message" in body
        assert "detail" in body
        assert body["code"] == 404

    def test_unenroll_course_returns_401_without_auth(self, unauth_client):
        response = unauth_client.post(f"/api/v1/courses/{FREE_SLUG}/unenroll")

        assert response.status_code == 401
