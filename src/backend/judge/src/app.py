from contextlib import asynccontextmanager

from fastapi import FastAPI , APIRouter
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager 
async def lifespan(app : FastAPI): 
    yield 

app = FastAPI(
    lifespan=lifespan
) 

api_router = APIRouter(prefix="/api") 


# Setup cors 
origins = [
    'http://localhost:4000'
] 
app.add_middleware(
    CORSMiddleware, 
    allow_credentials=True, 
    allow_origins=origins, 
    allow_methods=['*'], 
    allow_headers=['Content-Type', 'Authorization']
)

# lifespan 

# router 
@api_router.get('/health') 
async def health(): 
    return "Judge service is running. Build with Cloudian 💙 Cloud"

app.include_router(api_router)