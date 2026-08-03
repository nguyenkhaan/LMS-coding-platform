from contextlib import asynccontextmanager
from datetime import datetime, timezone
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import grpc
from src.grpc.server import create_grpc_server
from src.cores.redis import redis_client
from fastapi import FastAPI, APIRouter 
from src.modules.auth.auth_router import router as auth_router 
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.middleware.cors import CORSMiddleware
api_router = APIRouter(
    prefix="/api"
)
api_router.include_router(auth_router) 

@asynccontextmanager
async def lifespan(app : FastAPI): 
    # start redis 
    await redis_client.ping() 
    print("Redis client has been connected") 
    # start grpc server 
    grpc_server = await create_grpc_server() 
    await grpc_server.start() 
    print("Grpc server started on: 50051")
    yield 
    await redis_client.close() 
    print("redis stopped") 
    await grpc_server.stop(grace = 5) 
    print("grpc stopped") 

# cors origins 
origins = [
    'http://localhost:5173', 
    'http://localhost:50051', 
    'http://localhost:4000'
]   
app = FastAPI(
    lifespan=lifespan
) 
app.add_middleware(
    CORSMiddleware, 
    allow_credentials=True, 
    allow_origins=origins, 
    allow_methods=['*'], 
    allow_headers=['Content-Type', 'Authorization']
)
# handle exception 

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError):
    errors = []

    for err in exc.errors():
        errors.append({
            "field": err["loc"][-1],
            "message": err["msg"],
        })

    return JSONResponse(
        status_code=422,
        content={
            "message": "Cloudian Notification Request",
            "errors": errors,
        },
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "message": "Cloudian Notification",
            "code": exc.status_code,
            "detail": str(exc.detail),
            # Them thoi gian dien ra loi: 
            # "timestamp": 
            "timestamp": datetime.now(timezone.utc).isoformat(), 
            "path": request.url.path 
        },
    )

app.include_router(api_router) 
