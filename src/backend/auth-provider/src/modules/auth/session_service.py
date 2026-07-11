from redis.asyncio import Redis

from src.bases.constant.jwt_constant import ACCESS_LIVE_TIME
from src.helpers.random import random_string 
import json 

class SessionService: 
    def __init__(self , redis : Redis): 
        self.redis = redis 
    async def create_session(
        self, user_id : int 
    ): 
        session_id = random_string(5) 
        await self.redis.set(
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
    async def create_authorization_code(self , code : str , data : dict): 
        await self.redis.set(
            f"auth_code:{code}",
            json.dumps(data), 
            ex=300 # 5 minute 
        )
    async def get_authorization_code(self , code : str): 
        payload = await self.redis.get(
            f"auth_code:{code}"
        )  
        if payload is None: 
            return None 
        return json.loads(payload) 
    async def delete_authorization_code(self , code : str): 
        await self.redis.delete(
            f"auth_code:{code}"
        )
