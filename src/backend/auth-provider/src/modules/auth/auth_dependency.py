
from fastapi import Depends
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession
from src.db import get_async_db_session
from src.modules.auth.auth_service import AuthService
from src.modules.auth.session_service import SessionService
from src.cores.redis import redis_client
from src.modules.auth.jwt.jwt_service import JwtService

def get_redis_client():
    return redis_client


def get_session_service(redis: Redis = Depends(get_redis_client)) -> SessionService:
    return SessionService(redis)


def get_db_session(session: AsyncSession = Depends(get_async_db_session)) -> AsyncSession:
    return session


def get_jwt_service():
    return JwtService()


def get_auth_service(
    db_session: AsyncSession = Depends(get_db_session),
    session_service: SessionService = Depends(get_session_service),
    jwt_service: JwtService = Depends(get_jwt_service),
) -> AuthService:
    return AuthService(db_session, session_service, jwt_service) 