import pytest
from tests.module2.conftest import SEED_STUDENT, UNKNOWN_ID

class TestCourseFavorite:
    def test_put_favorite_new(self, client):
        # The client fixture already overrides get_current_user to return SEED_STUDENT
        res = client.put("/api/v1/courses/1/favorite")
        # Wait, if require_role fails, we get 403. Let's see.
        assert res.status_code == 200
        assert res.json()["is_favorited"] is True
        assert res.json()["course_id"] == 1

    def test_put_favorite_idempotent(self, client):
        res = client.put("/api/v1/courses/1/favorite")
        assert res.status_code == 200
        assert res.json()["is_favorited"] is True
        
    def test_get_favorites(self, client):
        res = client.get("/api/v1/favorites")
        assert res.status_code == 200
        body = res.json()
        assert "items" in body
        # Since we ran put twice above, we might have 1 item, but tests don't share DB state if rollbacked,
        # wait, the autouse=True setup_database fixture is session scoped. The DB doesn't rollback per test!
        # Oh, the tests share the same database. So if test_put_favorite_new runs first, there will be 1 favorite.
        
    def test_delete_favorite_success(self, client):
        res = client.delete("/api/v1/courses/1/favorite")
        assert res.status_code == 200
        assert res.json()["is_favorited"] is False
        
    def test_delete_favorite_idempotent(self, client):
        res = client.delete("/api/v1/courses/1/favorite")
        assert res.status_code == 200
        assert res.json()["is_favorited"] is False
