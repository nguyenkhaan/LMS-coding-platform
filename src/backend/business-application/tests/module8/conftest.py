import os

# Set required env vars BEFORE any src.* import triggers settings validation.
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///:memory:")
os.environ.setdefault("VERIFY_REGISTER_SECRET", "test-secret")
os.environ.setdefault("AUTH_PROVIDER_URL", "http://localhost:4001")
os.environ.setdefault("UPSTASH_REDIS_REST_URL", "http://localhost")
os.environ.setdefault("UPSTASH_REDIS_REST_TOKEN", "test-token")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from src.app import app
from src.db import get_async_db_session, Base
from src.middlewares.auth_middleware import get_current_user
from src.models.user_model import UserModel
from src.models.teacher_profile_model import TeacherProfileModel
from src.models.teacher_register_model import TeacherRegisterModel
from src.models.base_model import Role, AccountStatus

# SQLite test DB setup
from sqlalchemy.pool import StaticPool
TEST_DB_URL = "sqlite+aiosqlite:///:memory:"
test_engine = create_async_engine(
    TEST_DB_URL, 
    connect_args={"check_same_thread": False}, 
    poolclass=StaticPool
)
test_async_session_maker = async_sessionmaker(test_engine, expire_on_commit=False)

SEED_STUDENT = {
    "sub": 1,
    "email": "student@gmail.com",
    "roles": ["STUDENT"],
}

SEED_ADMIN = {
    "sub": 999,
    "email": "admin@gmail.com",
    "roles": ["ADMIN"],
}

@pytest.fixture(scope="function", autouse=True)
async def setup_test_db():
    # Create all tables in the in-memory SQLite DB
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield
    
    # Drop all tables after the test
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture()
async def db_session():
    async with test_async_session_maker() as session:
        yield session

@pytest.fixture()
def client(db_session):
    def override_get_current_user():
        return SEED_STUDENT

    async def override_get_async_db_session():
        yield db_session

    app.dependency_overrides[get_current_user] = override_get_current_user
    app.dependency_overrides[get_async_db_session] = override_get_async_db_session
    
    with TestClient(app) as test_client:
        yield test_client
        
    app.dependency_overrides.pop(get_current_user, None)
    app.dependency_overrides.pop(get_async_db_session, None)

@pytest.fixture()
def admin_client(db_session):
    def override_get_current_user():
        return SEED_ADMIN

    async def override_get_async_db_session():
        yield db_session

    app.dependency_overrides[get_current_user] = override_get_current_user
    app.dependency_overrides[get_async_db_session] = override_get_async_db_session
    
    with TestClient(app) as test_client:
        yield test_client
        
    app.dependency_overrides.pop(get_current_user, None)
    app.dependency_overrides.pop(get_async_db_session, None)


@pytest.fixture()
async def seed_teacher_profile(db_session):
    user = UserModel(
        id=SEED_STUDENT["sub"],
        email=SEED_STUDENT["email"],
        password="hashed_pass",
        full_name="Seed Student",
        account_status=AccountStatus.ACTIVE
    )
    db_session.add(user)
    
    profile = TeacherProfileModel(
        user_id=user.id
    )
    db_session.add(profile)
    await db_session.commit()
    
    return profile

@pytest.fixture()
async def seed_admin_user(db_session):
    admin = UserModel(
        id=SEED_ADMIN["sub"],
        email=SEED_ADMIN["email"],
        password="hashed_pass",
        full_name="Seed Admin",
        account_status=AccountStatus.ACTIVE
    )
    db_session.add(admin)
    await db_session.commit()
    return admin
