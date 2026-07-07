from redis.asyncio import Redis

from bases.jwt_constant import ACCESS_LIVE_TIME
from helpers.random import random_string 


class SessionService: 
    def __init__(self , redis : Redis): 
        self.redis = redis 
    async def create_session(
        self, user_id : int 
    ): 
        session_id = random_string(5) 
        await self.session.set(
            f"session:{session_id}", 
            user_id, 
            ex = ACCESS_LIVE_TIME # create session for store access token 
        ) 
    async def get_session(
        self , session_id : str
    ): 
        return await self.redis.get(
            f"session:{session_id}"
        )
    async def delete_session(
        self, session_id : str
    ): 
        await self.redis.delete(f"session:{session_id}")