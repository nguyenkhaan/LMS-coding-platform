from contextlib import asynccontextmanager
from datetime import datetime, timezone
from sqlite3 import Date

from fastapi import FastAPI, APIRouter
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.middleware.cors import CORSMiddleware
from src.modules.lesson_comment.lesson_comment_router import router as lesson_comment_router 
from src.grpc.client import AuthGrpcClient
from src.modules.health.health_router import router as health_router
from src.modules.teacher_course.teacher_course_router import (
    teacher_course_router,
    teacher_sections_router,
    teacher_lessons_router,
    teacher_lesson_contents_router,
)
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
v1_router.include_router(lesson_comment_router)
v1_router.include_router(teacher_course_router)
v1_router.include_router(teacher_sections_router)
v1_router.include_router(teacher_lessons_router)
v1_router.include_router(teacher_lesson_contents_router)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError):
    errors = []

    for err in exc.errors():
        errors.append({
            "field": err["loc"][-1] if len(err["loc"]) > 0 else "unknown",
            "message": err["msg"],
        })

    return JSONResponse(
        status_code=422,
        content={
            "message": "Dữ liệu đầu vào không hợp lệ",
            "error_code": "VALIDATION_ERROR",
            "details": errors,
        },
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc: StarletteHTTPException):
    status_map = {
        400: ("Yêu cầu không hợp lệ", "BAD_REQUEST"),
        401: ("Vui lòng đăng nhập để tiếp tục", "UNAUTHORIZED"),
        403: ("Bạn không có quyền thực hiện hành động này", "FORBIDDEN"),
        404: ("Không tìm thấy tài nguyên", "RESOURCE_NOT_FOUND"),
        500: ("Lỗi máy chủ nội bộ", "SERVER_ERROR"),
    }
    
    default_msg, default_code = status_map.get(exc.status_code, ("Lỗi xử lý yêu cầu", "SERVER_ERROR"))
    
    # If exc.detail is explicitly provided and looks like an ERROR_CODE, use it
    detail_str = str(exc.detail)
    if detail_str.isupper() and "_" in detail_str:
        error_code = detail_str
        message = default_msg
    elif detail_str and detail_str not in ("Not Found", "Method Not Allowed", "Unauthorized", "Forbidden"):
        error_code = default_code
        message = detail_str
    else:
        error_code = default_code
        message = default_msg

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "message": message,
            "error_code": error_code,
            "details": [],
        },
    )


app.include_router(v1_router)
