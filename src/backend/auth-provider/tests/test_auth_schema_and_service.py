import base64
import json
import os
import unittest
from datetime import datetime, timedelta, timezone
from unittest.mock import patch

import jwt
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa

os.environ.setdefault("BACKEND_URL", "http://localhost:4001")
os.environ.setdefault("JWT_ACCESS_PRIVATE", base64.b64encode(b"test-private-key").decode())
os.environ.setdefault("JWT_ACCESS_PUBLIC", base64.b64encode(b"test-public-key").decode())
os.environ.setdefault("JWT_REFRESH_SECRET", "test-refresh-secret-with-at-least-32-bytes")
os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://user:password@localhost/test")
os.environ.setdefault("UPSTASH_REDIS_REST_URL", "https://example.test")
os.environ.setdefault("UPSTASH_REDIS_REST_TOKEN", "test-token")
os.environ.setdefault("RABBITMQ_URL", "amqp://guest:guest@localhost/")

from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy import UniqueConstraint
from sqlalchemy.orm import configure_mappers

from src.models.base_model import AccountStatus, Role
from src.models.role_model import UserRoleModel
from src.models.user_model import UserModel
from src.bases.constant.redis_key import RedisKey
from src.modules.auth.auth_dto import RegisterRequest
from src.modules.auth.auth_service import AuthService
from src.modules.auth.jwt.jwt_service import JwtService
from src.bases.enum.jwt_enum import TokenType
from src.middlewares.auth_middleware import get_current_user


class FakeDatabaseSession:
    def __init__(self, scalar_results=()):
        self._scalar_results = iter(scalar_results)
        self.added = []
        self.commits = 0
        self.rollbacks = 0

    async def scalar(self, _statement):
        return next(self._scalar_results)

    def add(self, value):
        self.added.append(value)

    async def flush(self):
        for value in self.added:
            if isinstance(value, UserModel) and value.id is None:
                value.id = 101

    async def commit(self):
        self.commits += 1

    async def rollback(self):
        self.rollbacks += 1

    async def refresh(self, _value):
        return None


class FakeSessionService:
    def __init__(self, *, otp_payload=None, authorization_payload=None, redis_values=None):
        self.otp_payload = otp_payload
        self.authorization_payload = authorization_payload
        self.redis_values = dict(redis_values or {})
        self.values = []
        self.deleted_authorization_codes = []
        self.deleted_values = []

    async def set_value(self, key, value, expire=None):
        self.values.append((key, value, expire))
        self.redis_values[key] = value

    async def get_value(self, key):
        return self.redis_values.get(key, self.otp_payload)

    async def delete_value(self, key):
        self.deleted_values.append(key)
        self.redis_values.pop(key, None)

    async def create_authorization_code(self, code, data):
        self.authorization_payload = data
        self.created_authorization_code = code

    async def get_authorization_code(self, _code):
        return self.authorization_payload

    async def delete_authorization_code(self, code):
        self.deleted_authorization_codes.append(code)


class FakeJwtService:
    def __init__(self, refresh_payload=None):
        self.created = []
        self.refresh_payload = refresh_payload

    async def create_token(self, data, token_type, _expires_delta):
        self.created.append((data, token_type))
        return f"{token_type.value}-{len(self.created)}"

    async def verify_token(self, _token, _token_type):
        return self.refresh_payload


def make_user(
    *,
    account_status=AccountStatus.ACTIVE,
    password=None,
    refresh_token=None,
    roles=None,
):
    user = UserModel(
        id=7,
        email="student@example.com",
        full_name="Student",
        account_status=account_status,
        password=password,
        refresh_token=refresh_token,
    )
    user.roles = roles or [UserRoleModel(id=1, user_id=7, role=Role.STUDENT)]
    return user


class AuthSchemaTests(unittest.TestCase):
    def test_user_and_role_models_match_the_shared_auth_schema(self):
        configure_mappers()

        user_columns = UserModel.__table__.c
        self.assertEqual(
            set(user_columns.keys()),
            {
                "id", "full_name", "address", "email", "password", "avatar_url",
                "refresh_token", "account_status", "created_at", "updated_at",
            },
        )
        self.assertTrue(user_columns.address.nullable)
        self.assertTrue(user_columns.password.nullable)
        self.assertFalse(user_columns.account_status.nullable)
        self.assertEqual(set(AccountStatus), {AccountStatus.BANNED, AccountStatus.UNVERIFIED, AccountStatus.ACTIVE})
        self.assertEqual(set(Role), {Role.ADMIN, Role.TEACHER, Role.STUDENT})

        constraints = [
            frozenset(constraint.columns.keys())
            for constraint in UserRoleModel.__table__.constraints
            if isinstance(constraint, UniqueConstraint)
        ]
        self.assertIn(frozenset({"user_id", "role"}), constraints)


class AuthServiceTests(unittest.IsolatedAsyncioTestCase):
    async def test_refresh_jwt_has_a_refresh_type_claim_and_can_be_verified(self):
        service = JwtService()

        token = await service.create_token(
            {"sub": "7"}, TokenType.REFRESH_TOKEN, timedelta(minutes=1)
        )
        payload = await service.verify_token(token, TokenType.REFRESH_TOKEN)

        self.assertEqual(payload["sub"], "7")
        self.assertEqual(payload["token_type"], TokenType.REFRESH_TOKEN.value)

    async def test_register_creates_unverified_student_and_otp(self):
        database = FakeDatabaseSession([None])
        sessions = FakeSessionService()
        service = AuthService(database, sessions, FakeJwtService())

        await service.register(
            RegisterRequest(
                full_name="New Student",
                email="new.student@example.com",
                password="secure-password",
                address="Ha Noi",
            )
        )

        user = next(value for value in database.added if isinstance(value, UserModel))
        role = next(value for value in database.added if isinstance(value, UserRoleModel))
        self.assertEqual(user.account_status, AccountStatus.UNVERIFIED)
        self.assertEqual(role.role, Role.STUDENT)
        self.assertEqual(role.user_id, user.id)
        self.assertEqual(database.commits, 1)
        self.assertEqual(len(sessions.values), 2)

    async def test_new_registration_otp_replaces_the_previous_otp_for_the_same_user(self):
        user_id = 7
        old_otp = "expired-by-resend"
        latest_otp_key = RedisKey.save_verify_register(str(user_id))
        sessions = FakeSessionService(redis_values={latest_otp_key: old_otp})
        service = AuthService(FakeDatabaseSession(), sessions, FakeJwtService())

        new_otp = await service._create_registration_otp(user_id)

        self.assertEqual(sessions.deleted_values, [RedisKey.verify_register(old_otp)])
        self.assertEqual(sessions.redis_values[latest_otp_key], new_otp)
        self.assertIn(RedisKey.verify_register(new_otp), sessions.redis_values)
        self.assertEqual(len(sessions.values), 2)

    async def test_resend_otp_replaces_the_previous_otp_for_an_unverified_user(self):
        user = make_user(account_status=AccountStatus.UNVERIFIED)
        old_otp = "old-otp"
        sessions = FakeSessionService(
            redis_values={RedisKey.save_verify_register(str(user.id)): old_otp}
        )
        service = AuthService(FakeDatabaseSession([user]), sessions, FakeJwtService())

        await service.resend_otp(user.email)

        self.assertEqual(sessions.deleted_values, [RedisKey.verify_register(old_otp)])
        self.assertEqual(len(sessions.values), 2)

    async def test_verify_register_activates_only_an_unverified_account_and_consumes_otp(self):
        user = make_user(account_status=AccountStatus.UNVERIFIED)
        database = FakeDatabaseSession([user])
        sessions = FakeSessionService(otp_payload=json.dumps({"user_id": "7", "type": "register"}))
        service = AuthService(database, sessions, FakeJwtService())

        await service.verify_register("otp-code")

        self.assertEqual(user.account_status, AccountStatus.ACTIVE)
        self.assertEqual(database.commits, 1)
        self.assertEqual(len(sessions.deleted_values), 1)

    async def test_login_rejects_unverified_or_banned_accounts_even_with_correct_password(self):
        password = "secure-password"
        from src.helpers.pwd_hash import password_hash

        for status in (AccountStatus.UNVERIFIED, AccountStatus.BANNED):
            with self.subTest(status=status):
                user = make_user(account_status=status, password=password_hash.hash(password))
                service = AuthService(FakeDatabaseSession([user]), FakeSessionService(), FakeJwtService())

                with self.assertRaises(HTTPException) as raised:
                    await service.login(user.email, password, "http://client.example/callback")

                self.assertEqual(raised.exception.status_code, 401)

    async def test_auth_code_is_single_use_and_persists_the_issued_refresh_token(self):
        user = make_user()
        database = FakeDatabaseSession([user])
        sessions = FakeSessionService(authorization_payload={"client_id": 7, "email": user.email})
        jwt_service = FakeJwtService()
        service = AuthService(database, sessions, jwt_service)

        response = await service.auth_code("one-time-code")

        self.assertEqual(response.refresh_token, "refresh_token-2")
        self.assertEqual(user.refresh_token, response.refresh_token)
        self.assertEqual(sessions.deleted_authorization_codes, ["one-time-code"])
        self.assertEqual(database.commits, 1)

    async def test_refresh_rotates_a_valid_stored_refresh_token_for_an_active_account(self):
        old_token = "refresh-token-before-rotation"
        user = make_user(refresh_token=old_token)
        database = FakeDatabaseSession([user])
        sessions = FakeSessionService()
        jwt_service = FakeJwtService(refresh_payload={"sub": "7", "token_type": "refresh_token"})
        service = AuthService(database, sessions, jwt_service)

        response = await service.refresh(old_token)

        self.assertEqual(response.access_token, "access_token-1")
        self.assertEqual(response.refresh_token, "refresh_token-2")
        self.assertEqual(user.refresh_token, "refresh_token-2")
        self.assertEqual(database.commits, 1)


class CurrentUserMiddlewareTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        self.private_key = private_key.private_bytes(
            serialization.Encoding.PEM,
            serialization.PrivateFormat.PKCS8,
            serialization.NoEncryption(),
        ).decode()
        self.public_key = private_key.public_key().public_bytes(
            serialization.Encoding.PEM,
            serialization.PublicFormat.SubjectPublicKeyInfo,
        ).decode()

    def create_token(self, *, token_type=TokenType.ACCESS_TOKEN.value, sub="7"):
        return jwt.encode(
            {
                "sub": sub,
                "email": "student@example.com",
                "roles": ["STUDENT"],
                "token_type": token_type,
                "exp": datetime.now(timezone.utc) + timedelta(minutes=5),
            },
            self.private_key,
            algorithm="RS256",
        )

    async def test_get_current_user_returns_verified_access_token_claims(self):
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer", credentials=self.create_token()
        )

        with patch("src.middlewares.auth_middleware.JWT_ACCESS_PUBLIC", self.public_key):
            current_user = await get_current_user(credentials)

        self.assertEqual(current_user["sub"], 7)
        self.assertEqual(current_user["email"], "student@example.com")
        self.assertEqual(current_user["roles"], ["STUDENT"])

    async def test_get_current_user_rejects_a_refresh_token_even_when_rs256_signed(self):
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials=self.create_token(token_type=TokenType.REFRESH_TOKEN.value),
        )

        with patch("src.middlewares.auth_middleware.JWT_ACCESS_PUBLIC", self.public_key):
            with self.assertRaises(HTTPException) as raised:
                await get_current_user(credentials)

        self.assertEqual(raised.exception.status_code, 401)

    async def test_get_current_user_rejects_missing_bearer_credentials(self):
        with self.assertRaises(HTTPException) as raised:
            await get_current_user(None)

        self.assertEqual(raised.exception.status_code, 401)
