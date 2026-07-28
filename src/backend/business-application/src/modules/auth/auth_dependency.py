

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.modules.redis.redis_dependency import get_redis_service
from src.modules.redis.redis_service import RedisService
from src.db import get_async_db_session
from src.modules.auth.auth_service import AuthService


def get_auth_service(
    session : AsyncSession = Depends(get_async_db_session), 
    redis_service : RedisService = Depends(get_redis_service)
): 
    return AuthService(session , redis_service) 