import pytest
from tests.module2.conftest import UNKNOWN_ID

class TestGetInstructorCatalog:
    def test_get_instructor_catalog_returns_200(self, client):
        response = client.get("/api/v1/instructors")
        assert response.status_code == 200
        body = response.json()
        assert "total_items" in body
        assert "items" in body
        assert len(body["items"]) > 0

    def test_get_instructor_detail_returns_200_for_existing(self, client):
        # Teacher from seed has ID 2
        response = client.get("/api/v1/instructors/2")
        assert response.status_code == 200
        body = response.json()
        assert body["id"] == 2
        assert "courses" in body

    def test_get_instructor_detail_returns_404_for_unknown(self, client):
        response = client.get(f"/api/v1/instructors/{UNKNOWN_ID}")
        assert response.status_code == 404

    def test_get_instructor_catalog_counts_enrollments_correctly(self, client):
        # Teacher from seed (ID 2) has 2 courses, each with 1 enrollment from the student.
        response = client.get("/api/v1/instructors/2")
        assert response.status_code == 200
        body = response.json()
        
        # Verify enrollment and course counts
        assert body["course_count"] == 2
        assert body["enrolled_students"] == 2
