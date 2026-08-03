from contextlib import asynccontextmanager
from datetime import datetime, timezone
from sqlite3 import Date

from fastapi import FastAPI, APIRouter
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.middleware.cors import CORSMiddleware
from src.grpc.client import AuthGrpcClient
from src.modules.health.health_router import router as health_router
from src.jwk_service import PublicKeyService


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Executed once when the application starts.
    Download and cache the JWT public key from the auth provider.
    """
    client = AuthGrpcClient(
        "localhost:50051"
    )
    public_key = await PublicKeyService.load(client)
    print("Are you ready") 
    yield
    await client.close() 
    print('Grpc client stopped')
    # Cleanup if needed when the application shuts down.
    # Nguyen tac quan trong: Ai tao ra resource thi nguoi do phai dong resource

# CORS origins 
origins = [
    'http://localhost:5173', 
    'http://localhost:50051', 
    'http://localhost:4001'
]
app = FastAPI(
    lifespan=lifespan
)
app.add_middleware(
    CORSMiddleware, 
    allow_origins = origins,
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["Authorization" , "Content-Type"],
)
v1_router = APIRouter(prefix="/api/v1")

v1_router.include_router(health_router)

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


app.include_router(v1_router)