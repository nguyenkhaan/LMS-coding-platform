# Cu phap de luu key redis: project:service:value 
from upstash_redis.asyncio import Redis
class RedisService: 
    def __init__(self): 
        self.redis = Redis.from_env()
    async def get_value(self, key : str): 
        v = await self.redis.get(key) 
        return v 
    async def set_value(self , key : str , value , expire : int | None = None): # seconds ~ 300s = 5 phut 
        
        return await self.redis.set(key , str(value) , ex=expire)  
