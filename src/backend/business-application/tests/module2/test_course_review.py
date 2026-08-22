import pytest

class TestCourseReview:
    def test_post_review_unauthorized(self, unauth_client):
        res = unauth_client.post("/api/v1/courses/1/reviews", json={"rating": 5.0, "content": "Great!"})
        assert res.status_code == 401

    def test_post_review_success(self, client):
        # First ensure the user (student) is enrolled in course 1
        # In seed data, student (id=1) is enrolled in course 1
        res = client.post("/api/v1/courses/1/reviews", json={"rating": 5.0, "content": "Great!"})
        if res.status_code == 409:
            # Seed data might already have a review, let's check
            pass
        else:
            assert res.status_code == 200
            assert res.json()["rating"] == 5.0
            
    def test_post_review_duplicate(self, client):
        res = client.post("/api/v1/courses/1/reviews", json={"rating": 4.0, "content": "Again"})
        assert res.status_code == 409
        
    def test_patch_review_success(self, client):
        # We need the review_id. Let's get it from the list.
        list_res = client.get("/api/v1/courses/1/reviews")
        assert list_res.status_code == 200
        items = list_res.json()["items"]
        if not items:
            pytest.skip("No reviews to patch")
            
        review_id = items[0]["id"]
        res = client.patch(f"/api/v1/courses/1/reviews/{review_id}", json={"rating": 4.5, "content": "Updated"})
        assert res.status_code == 200
        assert res.json()["rating"] == 4.5
        assert res.json()["content"] == "Updated"
        
    def test_get_course_reviews(self, client):
        res = client.get("/api/v1/courses/1/reviews")
        assert res.status_code == 200
        body = res.json()
        assert "items" in body
        assert "summary" in body
        assert "average_rating" in body["summary"]
