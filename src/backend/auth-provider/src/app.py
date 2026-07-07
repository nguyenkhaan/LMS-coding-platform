from contextlib import asynccontextmanager
from src.cores.redis import redis_client
from fastapi import FastAPI, APIRouter 
from src.modules.auth.auth_route import router as auth_router 
api_router = APIRouter(
    prefix="/api"
)
api_router.include_router(auth_router) 

@asynccontextmanager
async def lifespan(app : FastAPI): 
    await redis_client.ping() 
    print("Redis client has been connected") 
    
    yield 
    await redis_client.close() 
    
app = FastAPI(
    lifespan=lifespan
) 

# template engine 


app.include_router(api_router) 
