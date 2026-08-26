import pytest
from httpx import ASGITransport, AsyncClient
from src.models.base_model import CourseStatus
from src.app import app
from src.models.base_model import Role
from src.middlewares.auth_middleware import get_current_user
from src.db import Base, get_async_db_session
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
TestingSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def override_get_async_db_session():
    async with TestingSessionLocal() as session:
        yield session

async def override_get_current_user_teacher():
    return {"sub": "2", "roles": [Role.TEACHER]}

@pytest.fixture(autouse=True)
async def setup_db():
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher
    app.dependency_overrides[get_async_db_session] = override_get_async_db_session
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    yield
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    
    app.dependency_overrides.clear()

@pytest.fixture
async def setup_course_submissions():
    from src.models.course_model import CourseModel
    from src.models.problem_model import ProblemModel, ProblemDifficulty
    from src.models.submission_model import SubmissionModel
    from src.models.lesson_content_model import LessonContentModel
    from src.models.base_model import LessonContentType
    from src.models.lesson_model import LessonModel
    from src.models.section_model import SectionModel
    
    async with TestingSessionLocal() as session:
        # Create a course for teacher_id = 2
        course = CourseModel(
            title="Python Course", slug="python-course", teacher_id=2, field="IT", status=CourseStatus.APPROVED
        )
        session.add(course)
        await session.flush()
        
        section = SectionModel(course_id=course.id, title="Section 1", position=1)
        session.add(section)
        await session.flush()
        
        lesson = LessonModel(section_id=section.id, title="Lesson 1", position=1)
        session.add(lesson)
        await session.flush()
        
        # Create two problems
        prob1 = ProblemModel(
            title="Prob1", slug="prob1", statement="Stmt", difficulty=ProblemDifficulty.EASY,
            teacher_id=2, public=True, passing_score=50
        )
        prob2 = ProblemModel(
            title="Prob2", slug="prob2", statement="Stmt", difficulty=ProblemDifficulty.EASY,
            teacher_id=2, public=True, passing_score=50
        )
        session.add_all([prob1, prob2])
        await session.flush()
        
        # Link prob1 to the course via lesson_content
        lc1 = LessonContentModel(
            lesson_id=lesson.id, content_type=LessonContentType.PROBLEM, content_id=prob1.id,
            position=1
        )
        session.add(lc1)
        await session.flush()
        
        # Create submissions
        sub1 = SubmissionModel(
            problem_id=prob1.id, student_id=5, language_id=1, source_code="print(1)", status="ACCEPTED",
            score=100.0, runtime_ms=10, memory_kb=1024
        )
        sub2 = SubmissionModel(
            problem_id=prob1.id, student_id=6, language_id=1, source_code="print(2)", status="WRONG_ANSWER",
            score=0.0, runtime_ms=10, memory_kb=1024
        )
        sub3 = SubmissionModel(
            problem_id=prob2.id, student_id=5, language_id=1, source_code="print(3)", status="ACCEPTED",
            score=100.0, runtime_ms=10, memory_kb=1024
        )
        
        session.add_all([sub1, sub2, sub3])
        await session.commit()
        
        return {
            "course_id": course.id,
            "prob1_id": prob1.id,
            "prob2_id": prob2.id,
            "student5": 5,
            "student6": 6
        }

client = AsyncClient(transport=ASGITransport(app=app), base_url='http://test')

@pytest.mark.asyncio
async def test_get_submissions_success(setup_course_submissions):
    course_id = setup_course_submissions["course_id"]
    
    resp = await client.get(f"/api/v1/teacher/courses/{course_id}/submissions?page=1&size=10")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_items"] == 2
    assert len(data["items"]) == 2
    
@pytest.mark.asyncio
async def test_get_submissions_filter_student(setup_course_submissions):
    course_id = setup_course_submissions["course_id"]
    student5 = setup_course_submissions["student5"]
    
    resp = await client.get(f"/api/v1/teacher/courses/{course_id}/submissions?student_id={student5}")
    assert resp.status_code == 200
    assert resp.json()["total_items"] == 1
    assert resp.json()["items"][0]["student_id"] == student5
    
@pytest.mark.asyncio
async def test_get_submissions_filter_invalid_student(setup_course_submissions):
    course_id = setup_course_submissions["course_id"]
    
    resp = await client.get(f"/api/v1/teacher/courses/{course_id}/submissions?student_id=999")
    assert resp.status_code == 200
    assert resp.json()["total_items"] == 0
    assert len(resp.json()["items"]) == 0
    
@pytest.mark.asyncio
async def test_get_submissions_filter_invalid_problem(setup_course_submissions):
    course_id = setup_course_submissions["course_id"]
    prob2_id = setup_course_submissions["prob2_id"]
    
    resp = await client.get(f"/api/v1/teacher/courses/{course_id}/submissions?problem_id={prob2_id}")
    assert resp.status_code == 200
    assert resp.json()["total_items"] == 0

@pytest.mark.asyncio
async def test_get_submissions_not_found():
    resp = await client.get("/api/v1/teacher/courses/9999/submissions")
    assert resp.status_code == 404

@pytest.mark.asyncio
async def test_get_submissions_forbidden(setup_course_submissions):
    course_id = setup_course_submissions["course_id"]
    
    async def override_teacher2():
        return {"sub": "99", "roles": [Role.TEACHER]}
    app.dependency_overrides[get_current_user] = override_teacher2
    
    resp = await client.get(f"/api/v1/teacher/courses/{course_id}/submissions")
    assert resp.status_code == 403
    app.dependency_overrides[get_current_user] = override_get_current_user_teacher

@pytest.mark.asyncio
async def test_get_submissions_pagination_max_size(setup_course_submissions):
    course_id = setup_course_submissions["course_id"]
    
    resp = await client.get(f"/api/v1/teacher/courses/{course_id}/submissions?size=1000")
    assert resp.status_code == 422

@pytest.mark.asyncio
async def test_get_submissions_invalid_status(setup_course_submissions):
    course_id = setup_course_submissions["course_id"]
    
    resp = await client.get(f"/api/v1/teacher/courses/{course_id}/submissions?status=INVALID_STATUS")
    assert resp.status_code == 422
