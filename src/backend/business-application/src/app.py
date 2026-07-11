from contextlib import asynccontextmanager

from fastapi import FastAPI, APIRouter
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from src.modules.auth.auth_router import router as auth_router
from src.modules.health.health_router import router as health_router
from src.jwk_service import PublicKeyService


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Executed once when the application starts.
    Download and cache the JWT public key from the auth provider.
    """

    await PublicKeyService.load()

    print("JWT public key loaded successfully.")

    yield

    # Cleanup if needed when the application shuts down.


app = FastAPI(
    lifespan=lifespan
)

v1_router = APIRouter(prefix="/api/v1")

v1_router.include_router(health_router)
v1_router.include_router(auth_router)


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
        },
    )


app.include_router(v1_router)