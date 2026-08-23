from upstash_redis.asyncio import Redis
from src.bases.constant.jwt_constant import ACCESS_LIVE_TIME
from src.bases.constant.redis_key import RedisKey
from src.helpers.random import random_string
import json


class SessionService:
    def __init__(self, redis: Redis):
        self.redis = redis

    async def create_session(self, user_id: int) -> str:
        session_id = random_string(5)

        await self.redis.set(
            RedisKey.session(session_id),
            user_id,
            ex=ACCESS_LIVE_TIME,
        )

        return session_id

    async def get_session(self, session_id: str):
        return await self.redis.get(
            RedisKey.session(session_id)
        )

    async def delete_session(self, session_id: str):
        await self.redis.delete(
            RedisKey.session(session_id)
        )

    async def create_authorization_code(self, code: str, data: dict):
        await self.redis.set(
            RedisKey.authorization_code(code),
            json.dumps(data),
            ex=300,
        )

    async def get_authorization_code(self, code: str):
        payload = await self.redis.get(
            RedisKey.authorization_code(code)
        )

        if payload is None:
            return None

        return json.loads(payload)

    async def delete_authorization_code(self, code: str):
        await self.redis.delete(
            RedisKey.authorization_code(code)
        )

    async def delete_value(self, key: str):
        await self.redis.delete(key)

    async def get_value(self, key: str):
        return await self.redis.get(key)

    async def consume_value(self, key: str):
        """Atomically read and delete a one-time value."""
        return await self.redis.getdel(key)
    
    async def set_value(self, key: str, value, expire: int | None = None):
        return await self.redis.set(
            key,
            str(value),
            ex=expire,
        )
