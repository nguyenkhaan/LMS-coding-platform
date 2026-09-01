import os
os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://user:pass@localhost:5432/db")
os.environ.setdefault("VERIFY_REGISTER_SECRET", "test-secret")
os.environ.setdefault("AUTH_PROVIDER_URL", "http://localhost:4001")
os.environ.setdefault("UPSTASH_REDIS_REST_URL", "http://localhost")
os.environ.setdefault("UPSTASH_REDIS_REST_TOKEN", "test-token")
os.environ.setdefault("RABBITMQ_URL", "amqp://guest:guest@localhost:5672//")

import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from src.db import Base, get_async_db_session
from src.app import app

# Create in-memory SQLite for tests
engine = create_async_engine(
    "sqlite+aiosqlite:///:memory:",
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = async_sessionmaker(
    autocommit=False, autoflush=False, bind=engine, class_=AsyncSession
)

@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async def override_get_async_db_session():
        async with TestingSessionLocal() as session:
            yield session

    app.dependency_overrides[get_async_db_session] = override_get_async_db_session
    
    yield
    
    app.dependency_overrides.pop(get_async_db_session, None)
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

from contextlib import asynccontextmanager
@pytest.fixture(autouse=True)
def mock_lifespan(monkeypatch):
    @asynccontextmanager
    async def mock_lifespan_context(app):
        yield
    monkeypatch.setattr(app.router, "lifespan_context", mock_lifespan_context)
