"""
Shared pytest fixtures for Module 2: Student Course Directory and Study Mode.

LƯU Ý QUAN TRỌNG:
Trước khi chạy `pytest tests/module2/`, PHẢI chạy `uv run python seed.py` thủ công 1 lần để khởi tạo dữ liệu.
(Hàm setup_database() tự động đã bị gỡ do gây deadlock, xem chi tiết mục 6 trong ADR-001).
"""
from __future__ import annotations
import os
import asyncio

os.environ.setdefault("VERIFY_REGISTER_SECRET", "test-secret")
os.environ.setdefault("AUTH_PROVIDER_URL", "http://localhost:4001")
os.environ.setdefault("UPSTASH_REDIS_REST_URL", "http://localhost")
os.environ.setdefault("UPSTASH_REDIS_REST_TOKEN", "test-token")
os.environ.setdefault("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock

from src.app import app
from src.middlewares.auth_middleware import get_current_user
from src.db import Base, engine as global_engine, get_db_session
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from src.cores.settings import DATABASE_URL
from sqlalchemy.pool import NullPool
from seed import seed_database

SEED_STUDENT = {
    "sub": 1,
    "email": "student@gmail.com",
    "roles": ["STUDENT"],
}

UNKNOWN_SLUG = "khoa-hoc-khong-ton-tai-xyz"
UNKNOWN_ID = 99999



async def override_get_db_session():
    req_engine = create_async_engine(DATABASE_URL, echo=False, poolclass=NullPool)
    req_maker = async_sessionmaker(req_engine, expire_on_commit=False)
    try:
        async with req_maker() as session:
            yield session
    finally:
        await req_engine.dispose()

@pytest.fixture()
def client():
    def override_get_current_user():
        return SEED_STUDENT
    app.dependency_overrides[get_current_user] = override_get_current_user
    app.dependency_overrides[get_db_session] = override_get_db_session
    with patch("src.app.RabbitMQManager.connect", new_callable=AsyncMock), \
         patch("src.app.RabbitMQManager.consume", new_callable=AsyncMock), \
         patch("src.app.RabbitMQManager.close", new_callable=AsyncMock), \
         patch("src.app.AuthGrpcClient.close", new_callable=AsyncMock), \
         TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.pop(get_current_user, None)
    app.dependency_overrides.pop(get_db_session, None)

@pytest.fixture()
def unauth_client():
    app.dependency_overrides[get_db_session] = override_get_db_session
    with patch("src.app.RabbitMQManager.connect", new_callable=AsyncMock), \
         patch("src.app.RabbitMQManager.consume", new_callable=AsyncMock), \
         patch("src.app.RabbitMQManager.close", new_callable=AsyncMock), \
         patch("src.app.AuthGrpcClient.close", new_callable=AsyncMock), \
         TestClient(app, raise_server_exceptions=False) as test_client:
        yield test_client
    app.dependency_overrides.pop(get_db_session, None)
