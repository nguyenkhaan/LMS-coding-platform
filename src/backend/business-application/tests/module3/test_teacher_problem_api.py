import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from src.app import app
from src.db import Base, get_async_db_session
from src.middlewares.auth_middleware import get_current_user
from src.models.user_model import UserModel
from src.models.base_model import Role
from src.models.problem_tag_model import ProblemTagModel

# --- MOCK SETUP ---
engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
TestingSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def override_get_async_db_session():
    async with TestingSessionLocal() as session:
        yield session

async def override_get_current_user_teacher():
    return {"sub": "2", "roles": [Role.TEACHER]}



client = AsyncClient(transport=ASGITransport(app=app), base_url="http://test")


@pytest.fixture(autouse=True)
async def setup_db():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    app.dependency_overrides[get_async_db_session] = override_get_async_db_session
    async with engine.begin() as conn:

        await conn.run_sync(Base.metadata.create_all)
        
    async with TestingSessionLocal() as session:
        tags = [ProblemTagModel(tag_name="Arrays"), ProblemTagModel(tag_name="Dynamic Programming")]
        session.add_all(tags)
        await session.commit()
        
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.mark.asyncio
async def test_get_problem_tags_success():
    resp = await client.get("/api/v1/teacher/problem-tags")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 2
    assert data[0]["tag_name"] == "Arrays"
    assert data[1]["tag_name"] == "Dynamic Programming"

@pytest.mark.asyncio
async def test_get_problem_tags_forbidden():
    async def override_get_current_user_student():
        return {"sub": "3", "roles": [Role.STUDENT]}
        
    app.dependency_overrides[get_current_user] = override_get_current_user_student
    resp = await client.get("/api/v1/teacher/problem-tags")
    assert resp.status_code == 403
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
@pytest.mark.asyncio
async def test_create_problem_success():
    async def override_get_current_user_teacher():
        return {"sub": "2", "roles": [Role.TEACHER]}
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    
    payload = {
        "title": "Two Sum",
        "slug": "two-sum",
        "statement": "Find two numbers that add up to target.",
        "difficulty": "EASY",
        "passing_score": 100.0,
        "tag_ids": [1],
        "configs": [
            {
                "language_id": 1,
                "time_limit_ms": 1000.0,
                "memory_limit_mb": 256.0
            }
        ]
    }
    
    resp = await client.post("/api/v1/teacher/problems", json=payload)
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Two Sum"
    assert data["teacher_id"] == 2

@pytest.mark.asyncio
async def test_create_problem_invalid_tag():
    async def override_get_current_user_teacher():
        return {"sub": "2", "roles": [Role.TEACHER]}
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    
    payload = {
        "title": "Two Sum 2",
        "slug": "two-sum-2",
        "statement": "Find two numbers.",
        "difficulty": "EASY",
        "passing_score": 100.0,
        "tag_ids": [999]
    }
    
    resp = await client.post("/api/v1/teacher/problems", json=payload)
    assert resp.status_code == 400
    assert "tag_ids are invalid" in resp.json()["message"]

@pytest.mark.asyncio
async def test_create_problem_forbidden():
    async def override_get_current_user_student():
        return {"sub": "3", "roles": [Role.STUDENT]}
    app.dependency_overrides[get_current_user] = override_get_current_user_student
    
    resp = await client.post("/api/v1/teacher/problems", json={"title": "Test", "slug": "test", "statement": "test", "difficulty": "EASY", "passing_score": 100})
    assert resp.status_code == 403
from sqlalchemy import select
from src.models.problem_model import ProblemModel
from src.models.problem_tag_mapping_model import ProblemTagMappingModel

@pytest.fixture
async def setup_problem():
    async with TestingSessionLocal() as session:
        problem = ProblemModel(
            teacher_id=2,
            title="Old Title",
            slug="old-slug",
            statement="Old statement",
            difficulty="EASY",
            passing_score=50.0,
            public=True
        )
        session.add(problem)
        await session.commit()
        await session.refresh(problem)
        
        mapping = ProblemTagMappingModel(problem_id=problem.id, tag_id=1)
        session.add(mapping)
        await session.commit()
        return problem.id

@pytest.mark.asyncio
async def test_update_problem_success(setup_problem):
    problem_id = setup_problem
    
    payload = {
        "title": "New Title",
        "slug": "new-slug",
        "statement": "New statement",
        "difficulty": "MEDIUM",
        "passing_score": 80.0,
        "tag_ids": [2],
        "configs": []
    }
    
    resp = await client.put(f"/api/v1/teacher/problems/{problem_id}", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "New Title"
    assert data["difficulty"] == "MEDIUM"

@pytest.mark.asyncio
async def test_update_problem_mapping_cleared(setup_problem):
    problem_id = setup_problem
    
    payload = {
        "title": "New Title",
        "slug": "new-slug-2",
        "statement": "New statement",
        "difficulty": "MEDIUM",
        "passing_score": 80.0,
        "tag_ids": [2],
        "configs": []
    }
    
    resp = await client.put(f"/api/v1/teacher/problems/{problem_id}", json=payload)
    assert resp.status_code == 200
    
    async with TestingSessionLocal() as session:
        stmt = select(ProblemTagMappingModel).where(ProblemTagMappingModel.problem_id == problem_id)
        result = await session.execute(stmt)
        mappings = result.scalars().all()
        assert len(mappings) == 1
        assert mappings[0].tag_id == 2

@pytest.mark.asyncio
async def test_update_problem_invalid_tag(setup_problem):
    problem_id = setup_problem
    
    payload = {
        "title": "New Title",
        "slug": "new-slug-3",
        "statement": "New statement",
        "difficulty": "MEDIUM",
        "passing_score": 80.0,
        "tag_ids": [999],
        "configs": []
    }
    
    resp = await client.put(f"/api/v1/teacher/problems/{problem_id}", json=payload)
    assert resp.status_code == 400
    assert "tag_ids are invalid" in resp.json()["message"]

@pytest.mark.asyncio
async def test_update_problem_not_found():
    payload = {
        "title": "New Title",
        "slug": "new-slug-4",
        "statement": "New statement",
        "difficulty": "MEDIUM",
        "passing_score": 80.0,
        "tag_ids": [2],
        "configs": []
    }
    
    resp = await client.put(f"/api/v1/teacher/problems/9999", json=payload)
    assert resp.status_code == 404

@pytest.mark.asyncio
async def test_update_problem_forbidden(setup_problem):
    problem_id = setup_problem
    
    async def override_get_current_user_teacher2():
        return {"sub": "99", "roles": [Role.TEACHER]}
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher2
    
    payload = {
        "title": "New Title",
        "slug": "new-slug-5",
        "statement": "New statement",
        "difficulty": "MEDIUM",
        "passing_score": 80.0,
        "tag_ids": [2],
        "configs": []
    }
    
    resp = await client.put(f"/api/v1/teacher/problems/{problem_id}", json=payload)
    assert resp.status_code == 403
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
import io

@pytest.mark.asyncio
async def test_upload_testcase_success(setup_problem):
    problem_id = setup_problem
    
    input_content = b"input data"
    output_content = b"output data"
    
    files = {
        "input_file": ("test.in", input_content, "text/plain"),
        "output_file": ("test.out", output_content, "text/plain"),
    }
    data = {
        "score": 10.0,
        "is_hidden": True
    }
    
    resp = await client.post(f"/api/v1/teacher/problems/{problem_id}/testcases/upload", data=data, files=files)
    assert resp.status_code == 201
    res_data = resp.json()
    assert res_data["uploaded_count"] == 1
    assert "mock-bucket" in res_data["testcases"][0]["input_file"]
    assert res_data["testcases"][0]["score"] == 10.0
    assert res_data["testcases"][0]["is_hidden"] is True

@pytest.mark.asyncio
async def test_upload_testcase_invalid_type(setup_problem):
    problem_id = setup_problem
    
    files = {
        "input_file": ("test.jpg", b"fake image", "image/jpeg"),
        "output_file": ("test.out", b"output data", "text/plain"),
    }
    data = {"score": 10.0, "is_hidden": True}
    
    resp = await client.post(f"/api/v1/teacher/problems/{problem_id}/testcases/upload", data=data, files=files)
    assert resp.status_code == 400
    assert "Invalid file type" in resp.json()["message"]

@pytest.mark.asyncio
async def test_upload_testcase_missing_file(setup_problem):
    problem_id = setup_problem
    
    files = {
        "input_file": ("test.in", b"data", "text/plain")
        # Missing output_file
    }
    data = {"score": 10.0, "is_hidden": True}
    
    resp = await client.post(f"/api/v1/teacher/problems/{problem_id}/testcases/upload", data=data, files=files)
    assert resp.status_code == 400
    assert "Both input_file and output_file are required" in resp.json()["message"]

@pytest.mark.asyncio
async def test_upload_testcase_too_large(setup_problem):
    problem_id = setup_problem
    
    # Over 5MB
    large_content = b"0" * (5 * 1024 * 1024 + 10)
    
    files = {
        "input_file": ("test.in", large_content, "text/plain"),
        "output_file": ("test.out", b"output data", "text/plain"),
    }
    data = {"score": 10.0, "is_hidden": True}
    
    resp = await client.post(f"/api/v1/teacher/problems/{problem_id}/testcases/upload", data=data, files=files)
    assert resp.status_code == 400
    assert "exceeds" in resp.json()["message"]

@pytest.mark.asyncio
async def test_upload_testcase_not_found():
    files = {
        "input_file": ("test.in", b"data", "text/plain"),
        "output_file": ("test.out", b"data", "text/plain"),
    }
    data = {"score": 10.0, "is_hidden": True}
    
    resp = await client.post(f"/api/v1/teacher/problems/9999/testcases/upload", data=data, files=files)
    assert resp.status_code == 404

@pytest.mark.asyncio
async def test_upload_testcase_forbidden(setup_problem):
    problem_id = setup_problem
    
    async def override_get_current_user_teacher2():
        return {"sub": "99", "roles": [Role.TEACHER]}
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher2
    
    files = {
        "input_file": ("test.in", b"data", "text/plain"),
        "output_file": ("test.out", b"data", "text/plain"),
    }
    data = {"score": 10.0, "is_hidden": True}
    
    resp = await client.post(f"/api/v1/teacher/problems/{problem_id}/testcases/upload", data=data, files=files)
    assert resp.status_code == 403
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
