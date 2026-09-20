"""
Integration tests for Endpoint 5: POST /student/quizzes/{quiz_id}/attempts

TDD: RED phase
"""

from __future__ import annotations

import os
from contextlib import asynccontextmanager
from unittest.mock import AsyncMock
from datetime import datetime, UTC, timedelta

from dotenv import load_dotenv

load_dotenv()

os.environ["DATABASE_URL"] = os.environ.get("TEST_DATABASE_URL", "postgresql+asyncpg://lms:lms@localhost:5433/lms")
os.environ.setdefault("VERIFY_REGISTER_SECRET", "test-secret")
os.environ.setdefault("AUTH_PROVIDER_URL", "http://localhost:4001")
os.environ.setdefault("UPSTASH_REDIS_REST_URL", "http://localhost")
os.environ.setdefault("UPSTASH_REDIS_REST_TOKEN", "test-token")

import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.pool import NullPool
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from src.app import app
from src.db import get_async_db_session, Base

test_engine = create_async_engine(os.environ["DATABASE_URL"], poolclass=NullPool)

class RollbackSession(AsyncSession):
    async def commit(self):
        await self.flush()

test_session_maker = async_sessionmaker(
    test_engine,
    class_=RollbackSession,
    expire_on_commit=False,
    autoflush=False
)


from src.middlewares.auth_middleware import get_current_user

# ---------------------------------------------------------------------------
# Seed data
# ---------------------------------------------------------------------------

SEED_TEACHER = {"sub": 2, "email": "teacher@gmail.com", "roles": ["TEACHER"]}
SEED_STUDENT = {"sub": 1, "email": "student@gmail.com", "roles": ["STUDENT"]}
SEED_OTHER_STUDENT = {"sub": 3, "email": "other@gmail.com", "roles": ["STUDENT"]}
UNKNOWN_ID = 99999

# ---------------------------------------------------------------------------
# Test Setup & Fixtures
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app):
    yield

app.router.lifespan_context = lifespan



@pytest.fixture(scope="function")
async def test_db_session():
    async with test_engine.connect() as conn:
        trans = await conn.begin()
        async with test_session_maker(bind=conn) as session:
            try:
                from src.models.teacher_profile_model import TeacherProfileModel
                from sqlalchemy import select
                existing = await session.scalar(
                    select(TeacherProfileModel).where(TeacherProfileModel.user_id == 2)
                )
                if not existing:
                    session.add(TeacherProfileModel(user_id=2, full_name="Seed Teacher", title="Title", bio="Bio"))
                await session.flush()
                yield session
            finally:
                await trans.rollback()

@pytest.fixture(autouse=True)
def mock_external_services(monkeypatch):
    monkeypatch.setattr("src.app.AuthGrpcClient.close", AsyncMock())
    monkeypatch.setattr("src.app.PublicKeyService.load", AsyncMock())
    monkeypatch.setattr("src.app.RabbitMQManager.connect", AsyncMock())
    monkeypatch.setattr("src.app.RabbitMQManager.consume", AsyncMock())
    monkeypatch.setattr("src.app.RabbitMQManager.close", AsyncMock())
    yield

# ---------------------------------------------------------------------------
# Client factory
# ---------------------------------------------------------------------------

@asynccontextmanager
async def client_as(user: dict, db_session: AsyncSession):
    def override_user():
        return user

    async def override_db():
        yield db_session

    app.dependency_overrides[get_current_user] = override_user
    app.dependency_overrides[get_async_db_session] = override_db
    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://testserver") as c:
            yield c
    finally:
        app.dependency_overrides.pop(get_current_user, None)
        app.dependency_overrides.pop(get_async_db_session, None)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

async def create_course_with_quiz(client: AsyncClient, start_date=None, end_date=None, attempts=None) -> tuple[int, int]:
    """Returns (course_id, quiz_id)"""
    res = await client.post(
        "/api/teacher/courses",
        json={"title": "Quiz Attempt Test Course", "field": "IT", "tags": [], "description": "desc", "price": 0},
    )
    assert res.status_code == 201, res.text
    course_id = res.json()["id"]

    res = await client.post(f"/api/teacher/courses/{course_id}/sections", json={"title": "Section 1", "position": 1})
    section_id = res.json()["id"]

    res = await client.post(f"/api/teacher/sections/{section_id}/lessons", json={"title": "Lesson 1", "position": 1})
    lesson_id = res.json()["id"]

    payload = {"title": "Attempt Test Quiz", "position": 0}
    if start_date: payload["start_date"] = start_date
    if end_date: payload["end_date"] = end_date
    if attempts: payload["attempts"] = attempts

    res = await client.post(f"/api/teacher/lessons/{lesson_id}/quizzes", json=payload)
    return course_id, res.json()["quiz"]["id"]

async def enroll_student(session: AsyncSession, course_id: int, student_id: int):
    from src.models.enrollment_model import EnrollmentModel
    e = EnrollmentModel(student_id=student_id, course_id=course_id, status="active")
    session.add(e)
    await session.commit()

# ===========================================================================
# POST /student/quizzes/{quiz_id}/attempts
# ===========================================================================

class TestStartAttempt:

    # 401 Ã¢â‚¬â€ unauthenticated
    async def test_returns_401_when_unauthenticated(self, test_db_session):
        app.dependency_overrides = {}
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://testserver") as c:
            res = await c.post("/api/student/quizzes/1/attempts")
        assert res.status_code == 401

    # 404 Ã¢â‚¬â€ quiz not found
    async def test_returns_404_for_nonexistent_quiz(self, test_db_session):
        async with client_as(SEED_STUDENT, test_db_session) as c:
            res = await c.post(f"/api/student/quizzes/{UNKNOWN_ID}/attempts")
        assert res.status_code == 404

    # 403 Ã¢â‚¬â€ not enrolled
    async def test_returns_403_when_not_enrolled(self, test_db_session):
        async with client_as(SEED_TEACHER, test_db_session) as c:
            _, quiz_id = await create_course_with_quiz(c)

        # SEED_STUDENT is not enrolled
        async with client_as(SEED_STUDENT, test_db_session) as c:
            res = await c.post(f"/api/student/quizzes/{quiz_id}/attempts")
        assert res.status_code == 403
        assert "not enrolled" in res.json()["message"].lower()

    # 400 Ã¢â‚¬â€ quiz not open yet
    async def test_returns_400_when_quiz_not_open_yet(self, test_db_session):
        future_date = (datetime.now(UTC) + timedelta(days=2)).isoformat()
        async with client_as(SEED_TEACHER, test_db_session) as c:
            course_id, quiz_id = await create_course_with_quiz(c, start_date=future_date)
            await enroll_student(test_db_session, course_id, SEED_STUDENT["sub"])

        async with client_as(SEED_STUDENT, test_db_session) as c:
            res = await c.post(f"/api/student/quizzes/{quiz_id}/attempts")
        assert res.status_code == 403
        assert "not yet available" in res.json()["message"].lower()

    # 400 Ã¢â‚¬â€ quiz closed
    async def test_returns_400_when_quiz_closed(self, test_db_session):
        past_date = (datetime.now(UTC) - timedelta(days=2)).isoformat()
        async with client_as(SEED_TEACHER, test_db_session) as c:
            course_id, quiz_id = await create_course_with_quiz(c, start_date=None, end_date=past_date)
            await enroll_student(test_db_session, course_id, SEED_STUDENT["sub"])

        async with client_as(SEED_STUDENT, test_db_session) as c:
            res = await c.post(f"/api/student/quizzes/{quiz_id}/attempts")
        assert res.status_code == 403
        assert "ended" in res.json()["message"].lower()

    # 400 Ã¢â‚¬â€ reached max attempts
    async def test_returns_400_when_max_attempts_reached(self, test_db_session):
        async with client_as(SEED_TEACHER, test_db_session) as c:
            course_id, quiz_id = await create_course_with_quiz(c, attempts=1) # only 1 attempt allowed
            await enroll_student(test_db_session, course_id, SEED_STUDENT["sub"])

        async with client_as(SEED_STUDENT, test_db_session) as c:
            # First attempt
            res1 = await c.post(f"/api/student/quizzes/{quiz_id}/attempts")
            assert res1.status_code == 201
            
            # Second attempt should fail
            res2 = await c.post(f"/api/student/quizzes/{quiz_id}/attempts")
            assert res2.status_code == 403
            assert "maximum" in res2.json()["message"].lower()

    # 201 Ã¢â‚¬â€ abandons old in_progress attempt and creates new one
    async def test_abandons_old_attempt_and_creates_new(self, test_db_session):
        async with client_as(SEED_TEACHER, test_db_session) as c:
            course_id, quiz_id = await create_course_with_quiz(c) # unlimited attempts
            await enroll_student(test_db_session, course_id, SEED_STUDENT["sub"])

        async with client_as(SEED_STUDENT, test_db_session) as c:
            res1 = await c.post(f"/api/student/quizzes/{quiz_id}/attempts")
            assert res1.status_code == 201
            body1 = res1.json()
            assert "attempt" in body1
            assert "questions" in body1
            attempt1 = body1["attempt"]
            assert attempt1["attempt_no"] == 1
            assert attempt1["status"] == "IN_PROGRESS"

            # Create second attempt while first is still in progress
            res2 = await c.post(f"/api/student/quizzes/{quiz_id}/attempts")
            assert res2.status_code == 201
            body2 = res2.json()
            attempt2 = body2["attempt"]
            assert attempt2["attempt_no"] == 2
            assert attempt2["status"] == "IN_PROGRESS"

            # Verify in DB that the first attempt is now ABANDONED
            from src.models.quiz_attempt_model import QuizAttemptModel
            from sqlalchemy import select
            
            a1_db = await test_db_session.scalar(select(QuizAttemptModel).where(QuizAttemptModel.id == attempt1["id"]))
            assert a1_db.status.value == "ABANDONED"











async def create_attempt(session, quiz_id: int, student_id: int, status: str = "IN_PROGRESS", attempt_no: int = 1) -> int:
    from src.models.quiz_attempt_model import QuizAttemptModel
    from src.models.base_model import QuizAttemptStatus
    from datetime import datetime, UTC
    
    a = QuizAttemptModel(
        quiz_id=quiz_id, 
        student_id=student_id, 
        attempt_no=attempt_no, 
        status=QuizAttemptStatus(status), 
        started_at=datetime.now(UTC)
    )
    session.add(a)
    await session.commit()
    await session.refresh(a)
    return a.id
class TestGetAttemptDetail:

    async def test_returns_401_when_unauthenticated(self, test_db_session):
        app.dependency_overrides = {}
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://testserver") as c:
            res = await c.get("/api/student/quizzes/1/attempts/1")
        assert res.status_code == 401

    async def test_returns_401_when_unauthenticated(self):
        app.dependency_overrides = {}
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://testserver") as c:
            res = await c.post("/api/student/quizzes/1/attempts/1/submit", json={"answers": {}})
        assert res.status_code == 401

    async def test_returns_404_for_nonexistent_attempt(self, test_db_session):
        async with client_as(SEED_STUDENT, test_db_session) as c:
            res = await c.get(f"/api/student/quizzes/1/attempts/{UNKNOWN_ID}")
        assert res.status_code == 404
        

    async def test_returns_404_for_mismatched_quiz_id(self, test_db_session):
        async with client_as(SEED_TEACHER, test_db_session) as c:
            course_id, quiz_id = await create_course_with_quiz(c)
        await enroll_student(test_db_session, course_id, SEED_STUDENT["sub"])
        attempt_id = await create_attempt(test_db_session, quiz_id, SEED_STUDENT["sub"])

        async with client_as(SEED_STUDENT, test_db_session) as c:
            res = await c.get(f"/api/student/quizzes/{UNKNOWN_ID}/attempts/{attempt_id}")
        assert res.status_code == 404

    async def test_returns_403_when_attempt_owned_by_other(self, test_db_session):
        async with client_as(SEED_TEACHER, test_db_session) as c:
            course_id, quiz_id = await create_course_with_quiz(c)
        
        # Enrolled but attempting to read someone else's attempt
        await enroll_student(test_db_session, course_id, SEED_OTHER_STUDENT["sub"])
        attempt_id = await create_attempt(test_db_session, quiz_id, SEED_STUDENT["sub"])

        async with client_as(SEED_OTHER_STUDENT, test_db_session) as c:
            res = await c.get(f"/api/student/quizzes/{quiz_id}/attempts/{attempt_id}")
        assert res.status_code == 403
        assert "own this attempt" in res.json()["message"].lower()

    async def test_returns_403_when_not_enrolled(self, test_db_session):
        async with client_as(SEED_TEACHER, test_db_session) as c:
            course_id, quiz_id = await create_course_with_quiz(c)
        
        # Student owns attempt but is NOT enrolled (e.g. unenrolled later)
        attempt_id = await create_attempt(test_db_session, quiz_id, SEED_STUDENT["sub"])

        async with client_as(SEED_STUDENT, test_db_session) as c:
            res = await c.get(f"/api/student/quizzes/{quiz_id}/attempts/{attempt_id}")
        assert res.status_code == 403
        assert "not enrolled" in res.json()["message"].lower()

    async def test_returns_attempt_detail_successfully(self, test_db_session):
        async with client_as(SEED_TEACHER, test_db_session) as c:
            course_id, quiz_id = await create_course_with_quiz(c)
            q_payload = {
                "questions": [{
                    "content": "What is 2+2?",
                    "question_type": "SINGLE_CHOICE",
                    "points": 1.0,
                    "options": [
                        {"content": "3", "is_correct": False},
                        {"content": "4", "is_correct": True}
                    ]
                }]
            }
            q_res = await c.put(f"/api/teacher/quizzes/{quiz_id}/questions", json=q_payload)
            assert q_res.status_code == 200
        
        await enroll_student(test_db_session, course_id, SEED_STUDENT["sub"])
        attempt_id = await create_attempt(test_db_session, quiz_id, SEED_STUDENT["sub"])

        async with client_as(SEED_STUDENT, test_db_session) as c:
            res = await c.get(f"/api/student/quizzes/{quiz_id}/attempts/{attempt_id}")
            
        assert res.status_code == 200
        body = res.json()
        assert "attempt" in body
        assert "questions" in body
        
        assert body["attempt"]["id"] == attempt_id
        assert body["attempt"]["student_id"] == SEED_STUDENT["sub"]
        
        questions = body["questions"]
        assert len(questions) == 1
        assert questions[0]["content"] == "What is 2+2?"
        assert "is_correct" not in questions[0]["options"][0]
        
        








async def create_course_with_quiz_and_questions(client: AsyncClient, session) -> tuple[int, int, int, int]:
    res = await client.post(
        "/api/teacher/courses",
        json={"title": "Submit Attempt Test Course", "field": "IT", "tags": [], "description": "desc", "price": 0},
    )
    course_id = res.json()["id"]

    res = await client.post(f"/api/teacher/courses/{course_id}/sections", json={"title": "Section 1", "position": 1})
    section_id = res.json()["id"]

    res = await client.post(f"/api/teacher/sections/{section_id}/lessons", json={"title": "Lesson 1", "position": 1})
    lesson_id = res.json()["id"]

    payload = {"title": "Submit Attempt Test Quiz", "position": 0}
    res = await client.post(f"/api/teacher/lessons/{lesson_id}/quizzes", json=payload)
    quiz_id = res.json()["quiz"]["id"]
    
    q_payload = {
        "questions": [{
            "content": "What is 2+2?",
            "question_type": "SINGLE_CHOICE",
            "points": 1.0,
            "options": [
                {"content": "3", "is_correct": False},
                {"content": "4", "is_correct": True}
            ]
        }]
    }
    await client.put(f"/api/teacher/quizzes/{quiz_id}/questions", json=q_payload)

    from sqlalchemy import select
    from sqlalchemy.orm import selectinload
    from src.models.quiz_question_model import QuizQuestionModel
    from src.models.quiz_model import QuizModel

    quiz = await session.scalar(
        select(QuizModel).options(selectinload(QuizModel.questions).selectinload(QuizQuestionModel.options)).where(QuizModel.id == quiz_id)
    )
    question_id = quiz.questions[0].id
    option_id = quiz.questions[0].options[0].id

    return course_id, quiz_id, question_id, option_id


class TestSubmitAttemptValidation:

    async def test_returns_401_when_unauthenticated(self):
        app.dependency_overrides = {}
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://testserver") as c:
            res = await c.post("/api/student/quizzes/1/attempts/1/submit", json={"answers": {}})
        assert res.status_code == 401

    async def test_returns_404_for_nonexistent_attempt(self, test_db_session):
        async with client_as(SEED_STUDENT, test_db_session) as c:
            res = await c.post(
                f"/api/student/quizzes/1/attempts/{UNKNOWN_ID}/submit",
                json={"answers": [{"question_id": 1, "option_ids": [1]}]}
            )
        assert res.status_code == 404

    async def test_returns_403_when_attempt_owned_by_other(self, test_db_session):
        async with client_as(SEED_TEACHER, test_db_session) as c:
            course_id, quiz_id, q_id, opt_id = await create_course_with_quiz_and_questions(c, test_db_session)
        
        await enroll_student(test_db_session, course_id, SEED_OTHER_STUDENT["sub"])
        attempt_id = await create_attempt(test_db_session, quiz_id, SEED_STUDENT["sub"])

        async with client_as(SEED_OTHER_STUDENT, test_db_session) as c:
            res = await c.post(
                f"/api/student/quizzes/{quiz_id}/attempts/{attempt_id}/submit",
                json={"answers": [{"question_id": q_id, "option_ids": [opt_id]}]}
            )
        assert res.status_code == 403

    async def test_returns_400_when_attempt_abandoned(self, test_db_session):
        async with client_as(SEED_TEACHER, test_db_session) as c:
            course_id, quiz_id, q_id, opt_id = await create_course_with_quiz_and_questions(c, test_db_session)
        
        await enroll_student(test_db_session, course_id, SEED_STUDENT["sub"])
        attempt_id = await create_attempt(test_db_session, quiz_id, SEED_STUDENT["sub"], status="ABANDONED")

        async with client_as(SEED_STUDENT, test_db_session) as c:
            res = await c.post(
                f"/api/student/quizzes/{quiz_id}/attempts/{attempt_id}/submit",
                json={"answers": [{"question_id": q_id, "option_ids": [opt_id]}]}
            )
        assert res.status_code == 400
        assert "abandoned" in res.json()["message"].lower()

    async def test_returns_400_for_question_not_in_quiz(self, test_db_session):
        async with client_as(SEED_TEACHER, test_db_session) as c:
            course_id, quiz_id, _, _ = await create_course_with_quiz_and_questions(c, test_db_session)
        
        await enroll_student(test_db_session, course_id, SEED_STUDENT["sub"])
        attempt_id = await create_attempt(test_db_session, quiz_id, SEED_STUDENT["sub"])

        async with client_as(SEED_STUDENT, test_db_session) as c:
            res = await c.post(
                f"/api/student/quizzes/{quiz_id}/attempts/{attempt_id}/submit",
                json={"answers": [{"question_id": UNKNOWN_ID, "option_ids": [1]}]}
            )
        assert res.status_code == 400
        assert "does not belong" in res.json()["message"].lower()

    async def test_returns_400_for_option_not_in_question(self, test_db_session):
        async with client_as(SEED_TEACHER, test_db_session) as c:
            course_id, quiz_id, q_id, _ = await create_course_with_quiz_and_questions(c, test_db_session)
        
        await enroll_student(test_db_session, course_id, SEED_STUDENT["sub"])
        attempt_id = await create_attempt(test_db_session, quiz_id, SEED_STUDENT["sub"])

        async with client_as(SEED_STUDENT, test_db_session) as c:
            res = await c.post(
                f"/api/student/quizzes/{quiz_id}/attempts/{attempt_id}/submit",
                json={"answers": [{"question_id": q_id, "option_ids": [UNKNOWN_ID]}]}
            )
        assert res.status_code == 400
        assert "does not belong to question" in res.json()["message"].lower()










class TestSubmitAttemptGrading:
    async def _setup_quiz(self, test_db_session):
        async with client_as(SEED_TEACHER, test_db_session) as c:
            course_id, quiz_id, q1_id, o1_id = await create_course_with_quiz_and_questions(c, test_db_session)
            
            q_payload = {
                "questions": [
                    {
                        "content": "Q1",
                        "question_type": "SINGLE_CHOICE",
                        "points": 10.0,
                        "options": [
                            {"content": "A", "is_correct": False},
                            {"content": "B", "is_correct": True}
                        ]
                    },
                    {
                        "content": "Q2",
                        "question_type": "MULTIPLE_CHOICE",
                        "points": 20.0,
                        "options": [
                            {"content": "C", "is_correct": True},
                            {"content": "D", "is_correct": True},
                            {"content": "E", "is_correct": False}
                        ]
                    }
                ]
            }
            await c.put(f"/api/teacher/quizzes/{quiz_id}", json={"title": "Quiz", "passing_score": 50.0})
            await c.put(f"/api/teacher/quizzes/{quiz_id}/questions", json=q_payload)

            from sqlalchemy import select
            from sqlalchemy.orm import selectinload
            from src.models.quiz_model import QuizModel
            from src.models.quiz_question_model import QuizQuestionModel
            
            quiz = await test_db_session.scalar(
                select(QuizModel).options(selectinload(QuizModel.questions).selectinload(QuizQuestionModel.options)).where(QuizModel.id == quiz_id)
            )
            q1 = quiz.questions[0]
            q2 = quiz.questions[1]
            q1_correct_opt = [o.id for o in q1.options if o.is_correct][0]
            q2_correct_opts = [o.id for o in q2.options if o.is_correct]
            q2_wrong_opt = [o.id for o in q2.options if not o.is_correct][0]
            
            return course_id, quiz_id, q1, q2, q1_correct_opt, q2_correct_opts, q2_wrong_opt

    async def test_calculates_passed_true_for_full_score(self, test_db_session):
        course_id, quiz_id, q1, q2, q1_correct_opt, q2_correct_opts, q2_wrong_opt = await self._setup_quiz(test_db_session)
        await enroll_student(test_db_session, course_id, SEED_STUDENT["sub"])
        
        attempt_id = await create_attempt(test_db_session, quiz_id, SEED_STUDENT["sub"])
        async with client_as(SEED_STUDENT, test_db_session) as c:
            res = await c.post(
                f"/api/student/quizzes/{quiz_id}/attempts/{attempt_id}/submit",
                json={"answers": [
                    {"question_id": q1.id, "option_ids": [q1_correct_opt]},
                    {"question_id": q2.id, "option_ids": q2_correct_opts}
                ]}
            )
        assert res.status_code == 200
        data = res.json()
        assert data["submission"]["score"] == 30.0
        assert data["passed"] is True
        assert data["attempt"]["status"] == "SUBMITTED"

    async def test_calculates_failed_for_partial_multiselect(self, test_db_session):
        course_id, quiz_id, q1, q2, q1_correct_opt, q2_correct_opts, q2_wrong_opt = await self._setup_quiz(test_db_session)
        await enroll_student(test_db_session, course_id, SEED_STUDENT["sub"])
        
        attempt_id = await create_attempt(test_db_session, quiz_id, SEED_STUDENT["sub"])
        async with client_as(SEED_STUDENT, test_db_session) as c:
            res = await c.post(
                f"/api/student/quizzes/{quiz_id}/attempts/{attempt_id}/submit",
                json={"answers": [
                    {"question_id": q1.id, "option_ids": [q1_correct_opt]},
                    {"question_id": q2.id, "option_ids": [q2_correct_opts[0]]} # missing one correct option
                ]}
            )
        assert res.status_code == 200
        data = res.json()
        assert data["submission"]["score"] == 10.0 # Q1 correct (10), Q2 partial -> 0
        assert data["passed"] is False

    async def test_calculates_missing_question_as_zero(self, test_db_session):
        course_id, quiz_id, q1, q2, q1_correct_opt, q2_correct_opts, q2_wrong_opt = await self._setup_quiz(test_db_session)
        await enroll_student(test_db_session, course_id, SEED_STUDENT["sub"])
        
        attempt_id = await create_attempt(test_db_session, quiz_id, SEED_STUDENT["sub"])
        async with client_as(SEED_STUDENT, test_db_session) as c:
            res = await c.post(
                f"/api/student/quizzes/{quiz_id}/attempts/{attempt_id}/submit",
                json={"answers": [
                    {"question_id": q2.id, "option_ids": q2_correct_opts} # Q1 is entirely missing
                ]}
            )
        assert res.status_code == 200
        data = res.json()
        assert data["submission"]["score"] == 20.0 # Q2 correct (20), Q1 blank -> 0
        assert data["passed"] is True
        assert data["passed"] is True

    async def test_calculates_passed_for_zero_max_points(self, test_db_session):
        async with client_as(SEED_TEACHER, test_db_session) as c:
            course_id, quiz_id, _, _ = await create_course_with_quiz_and_questions(c, test_db_session)
            await c.put(f"/api/teacher/quizzes/{quiz_id}", json={"title": "Quiz", "passing_score": 0.0})
            await c.put(f"/api/teacher/quizzes/{quiz_id}/questions", json={"questions": []})
            
        await enroll_student(test_db_session, course_id, SEED_STUDENT["sub"])
        attempt_id = await create_attempt(test_db_session, quiz_id, SEED_STUDENT["sub"])

        async with client_as(SEED_STUDENT, test_db_session) as c:
            res = await c.post(
                f"/api/student/quizzes/{quiz_id}/attempts/{attempt_id}/submit",
                json={"answers": []}
            )
        assert res.status_code == 200
        data = res.json()
        assert data["submission"]["score"] == 0.0
        assert data["passed"] is True


class TestSubmitAttemptIdempotencyAndProgress:
    async def _setup_quiz(self, test_db_session):
        async with client_as(SEED_TEACHER, test_db_session) as c:
            course_id, quiz_id, q1_id, o1_id = await create_course_with_quiz_and_questions(c, test_db_session)
            # Make sure it has a correct answer so we can pass
            q_payload = {
                "questions": [
                    {
                        "content": "Q1",
                        "question_type": "SINGLE_CHOICE",
                        "points": 10.0,
                        "options": [
                            {"content": "A", "is_correct": False},
                            {"content": "B", "is_correct": True}
                        ]
                    }
                ]
            }
            await c.put(f"/api/teacher/quizzes/{quiz_id}", json={"title": "Quiz", "passing_score": 50.0})
            await c.put(f"/api/teacher/quizzes/{quiz_id}/questions", json=q_payload)

            from sqlalchemy import select
            from sqlalchemy.orm import selectinload
            from src.models.quiz_model import QuizModel
            from src.models.quiz_question_model import QuizQuestionModel
            
            quiz = await test_db_session.scalar(
                select(QuizModel).options(selectinload(QuizModel.questions).selectinload(QuizQuestionModel.options)).where(QuizModel.id == quiz_id)
            )
            q1 = quiz.questions[0]
            q1_correct_opt = [o.id for o in q1.options if o.is_correct][0]
            
            return course_id, quiz_id, q1.id, q1_correct_opt

    async def test_returns_idempotent_result_on_double_submit(self, test_db_session):
        course_id, quiz_id, q1_id, q1_correct_opt = await self._setup_quiz(test_db_session)
        await enroll_student(test_db_session, course_id, SEED_STUDENT["sub"])
        
        attempt_id = await create_attempt(test_db_session, quiz_id, SEED_STUDENT["sub"])
        
        # First submit
        async with client_as(SEED_STUDENT, test_db_session) as c:
            res1 = await c.post(
                f"/api/student/quizzes/{quiz_id}/attempts/{attempt_id}/submit",
                json={"answers": [
                    {"question_id": q1_id, "option_ids": [q1_correct_opt]}
                ]}
            )
        assert res1.status_code == 200
        data1 = res1.json()
        assert data1["passed"] is True
        assert data1["progress"] is not None # Progress returned on first submit
        
        # Second submit
        async with client_as(SEED_STUDENT, test_db_session) as c:
            res2 = await c.post(
                f"/api/student/quizzes/{quiz_id}/attempts/{attempt_id}/submit",
                json={"answers": [
                    {"question_id": q1_id, "option_ids": [q1_correct_opt]}
                ]}
            )
        
        assert res2.status_code == 200
        data2 = res2.json()
        # Ensure it returns the same submission
        assert data2["submission"]["id"] == data1["submission"]["id"]
        assert data2["submission"]["score"] == data1["submission"]["score"]
        assert data2["passed"] is True
        assert data2["progress"] is None # Progress is None on idempotent submit
        
        # Verify only 1 submission in DB
        from sqlalchemy import select
        from sqlalchemy import func
        from src.models.quiz_submission_model import QuizSubmissionModel
        count = await test_db_session.scalar(select(func.count()).select_from(QuizSubmissionModel).where(QuizSubmissionModel.quiz_attempt_id == attempt_id))
        assert count == 1

        # Verify only 1 progress in DB
        from src.models.lesson_content_progress_model import LessonContentProgressModel
        from src.models.enrollment_model import EnrollmentModel as CourseEnrollmentModel
        enrollment = await test_db_session.scalar(select(CourseEnrollmentModel).where(CourseEnrollmentModel.course_id == course_id, CourseEnrollmentModel.student_id == SEED_STUDENT["sub"]))
        
        progress_count = await test_db_session.scalar(
            select(func.count()).select_from(LessonContentProgressModel).where(LessonContentProgressModel.enrollment_id == enrollment.id)
        )


class TestListAttempts:
    async def test_returns_401_when_unauthenticated(self, test_db_session):
        app.dependency_overrides = {}
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://testserver") as c:
            res = await c.get("/api/student/quizzes/999/attempts")
        assert res.status_code == 401

    async def test_returns_404_for_nonexistent_quiz(self, test_db_session):
        async with client_as(SEED_STUDENT, test_db_session) as c:
            res = await c.get("/api/student/quizzes/9999/attempts")
        assert res.status_code == 404
        assert res.json()["message"] == "Quiz not found"

    async def test_returns_403_when_not_enrolled(self, test_db_session):
        async with client_as(SEED_TEACHER, test_db_session) as c:
            course_id, quiz_id, q1_id, o1_id = await create_course_with_quiz_and_questions(c, test_db_session)
        async with client_as(SEED_STUDENT, test_db_session) as c:
            res = await c.get(f"/api/student/quizzes/{quiz_id}/attempts")
        assert res.status_code == 403
        assert res.json()["message"] == "Student is not enrolled in the course containing this quiz"

    async def test_lists_attempts_with_pagination_and_capped_size(self, test_db_session):
        async with client_as(SEED_TEACHER, test_db_session) as c:
            course_id, quiz_id, q1_id, o1_id = await create_course_with_quiz_and_questions(c, test_db_session)
        await enroll_student(test_db_session, course_id, SEED_STUDENT["sub"])

        # Create 3 attempts manually
        from src.models.quiz_attempt_model import QuizAttemptModel
        from src.models.base_model import QuizAttemptStatus
        from datetime import datetime, UTC
        
        test_db_session.add_all([
            QuizAttemptModel(quiz_id=quiz_id, student_id=SEED_STUDENT["sub"], attempt_no=1, status=QuizAttemptStatus.ABANDONED, started_at=datetime.now(UTC)),
            QuizAttemptModel(quiz_id=quiz_id, student_id=SEED_STUDENT["sub"], attempt_no=2, status=QuizAttemptStatus.SUBMITTED, started_at=datetime.now(UTC)),
            QuizAttemptModel(quiz_id=quiz_id, student_id=SEED_STUDENT["sub"], attempt_no=3, status=QuizAttemptStatus.IN_PROGRESS, started_at=datetime.now(UTC)),
        ])
        await test_db_session.commit()

        # Fetch page 1, size 2
        async with client_as(SEED_STUDENT, test_db_session) as c:
            res = await c.get(f"/api/student/quizzes/{quiz_id}/attempts?page=1&size=2")
        assert res.status_code == 200
        data = res.json()
        assert data["pagination"]["total"] == 3
        assert data["pagination"]["page"] == 1
        assert data["pagination"]["size"] == 2
        assert len(data["data"]) == 2
        # Descending order -> attempt_no 3 and 2
        assert data["data"][0]["attempt_no"] == 3
        assert data["data"][0]["status"] == "IN_PROGRESS"
        assert data["data"][1]["attempt_no"] == 2
        
        # Test size capping (> 100 -> 100)
        async with client_as(SEED_STUDENT, test_db_session) as c:
            res2 = await c.get(f"/api/student/quizzes/{quiz_id}/attempts?page=1&size=1000")
        assert res2.status_code == 200
        assert res2.json()["pagination"]["size"] == 100













