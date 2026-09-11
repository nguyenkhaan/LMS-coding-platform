from contextlib import asynccontextmanager

from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import logging

from src.cores.settings import RABBITMQ_URL
from src.grpc.client import AuthGrpcClient
from src.jwk_service import PublicKeyService
from src.services.sse.sse_manager import SSEManager
from src.services.rabbitmq.rabbitmq_manager import RabbitMQManager
from src.services.rabbitmq.submission_execution_result_consumer import handle_submission_execution_result
from src.bases.constants.submission_queues import SUBMISSION_EXECUTION_RESULT_QUEUE

logger = logging.getLogger(__name__)

# 1. CORE & SHARED ROUTERS
from src.modules.health.health_router import router as health_router
from src.modules.submission.submission_route import router as submission_router
from src.modules.lesson_comment.lesson_comment_router import router as lesson_comment_router

# 2. COURSE CATALOG ROUTER (staging-dev — Catalog, Instructor, Favorite, Review)
from src.modules.course_directory.course_directory_router import router as course_directory_router

# 3. STUDENT ROUTERS (khôi phục — Study Mode, Enroll/Unenroll, Quiz Attempt)
from src.modules.student_course_directory.course_router import router as course_router
from src.modules.student_course_directory.student_router import router as student_router

# 4. ADMIN, PAYMENT & USER ROUTERS (staging-dev)
from src.modules.user.user_router import admin_router, router as user_router
from src.modules.teacher_application.teacher_application_route import (
    router as teacher_application_router,
    admin_router as admin_teacher_application_router,
)
from src.modules.payment.payment_router import router as payment_router
from src.modules.payment.payment_admin_router import router as payment_admin_router
from src.modules.user.user_router import admin_router, router as user_router
from src.modules.submission.submission_route import router as submission_router
from src.modules.student import router as student_router
from src.modules.teacher import router as teacher_router
from src.services.rabbitmq.rabbitmq_manager import RabbitMQManager
from src.services.rabbitmq.submission_execution_result_consumer import (
    handle_submission_execution_result,
)
from src.modules.teacher_problem.teacher_problem_router import teacher_problem_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # JWT Public Key
    client = AuthGrpcClient("localhost:50051")
    await PublicKeyService.load(client)

    # SSE Manager
    sse_manager = SSEManager()
    app.state.sse_manager = sse_manager

    # RabbitMQ — wrapped with try/except to allow local dev bypass without Docker
    rabbitmq_manager = RabbitMQManager(url=RABBITMQ_URL)
    try:
        await rabbitmq_manager.connect()
        async def handle_submission_result(job):
            await handle_submission_execution_result(job, sse_manager)
        await rabbitmq_manager.consume(SUBMISSION_EXECUTION_RESULT_QUEUE, handle_submission_result)
        app.state.rabbitmq_manager = rabbitmq_manager
    except Exception as e:
        logger.warning(f"Failed to connect to RabbitMQ: {e}. Bypassing for local dev.")
        app.state.rabbitmq_manager = None

    yield

    # Cleanup
    rmq = getattr(app.state, "rabbitmq_manager", None)
    if rmq:
        await rmq.close()
        print("Rabbit MQ stopped")
    await client.close()
    print("Grpc client stopped")
    app.state.sse_manager = None
    print("SSE connection stopped")


# CORS origins
origins = ["http://localhost:5173", "http://localhost:50051", "http://localhost:4001"]
app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Authorization", "Content-Type", "Idempotency-Key"],
)

v1_router = APIRouter(prefix="/api")

# Core/Shared
v1_router.include_router(health_router)
v1_router.include_router(submission_router)
v1_router.include_router(student_router)
v1_router.include_router(lesson_comment_router)

# Course Catalog
v1_router.include_router(course_directory_router)

# Student
v1_router.include_router(course_router)
v1_router.include_router(student_router)

# Admin, User, Payment
v1_router.include_router(user_router)
v1_router.include_router(admin_router)
v1_router.include_router(teacher_application_router)
v1_router.include_router(admin_teacher_application_router)
v1_router.include_router(payment_router)
v1_router.include_router(payment_admin_router)

# Module 3
v1_router.include_router(teacher_course_router)
v1_router.include_router(teacher_sections_router)
v1_router.include_router(teacher_lessons_router)
v1_router.include_router(teacher_lesson_contents_router)
v1_router.include_router(teacher_lesson_quizzes_router)
v1_router.include_router(teacher_quizzes_router)
v1_router.include_router(teacher_problem_router)

app.include_router(v1_router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError):
    return JSONResponse(status_code=422, content={
        "message": "Invalid request",
        "error_code": "VALIDATION_ERROR",
        "details": [
            {"field": ".".join(map(str, error["loc"])), "reason": error["msg"]}
            for error in exc.errors()
        ],
    })


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc: StarletteHTTPException):
    codes = {
        400: "INVALID_REQUEST", 401: "UNAUTHENTICATED", 403: "FORBIDDEN",
        404: "NOT_FOUND", 409: "INVALID_STATE", 410: "PAYMENT_EXPIRED",
        422: "VALIDATION_ERROR", 429: "RATE_LIMITED",
    }
    detail = exc.detail
    if isinstance(detail, dict):
        payload = {
            "message": detail.get("message", "Request failed"),
            "error_code": detail.get("error_code", codes.get(exc.status_code, "INVALID_REQUEST")),
            "details": detail.get("details", []),
        }
    else:
        code = (
            "DUPLICATE_RESOURCE"
            if str(detail).startswith("DUPLICATE_RESOURCE:")
            else codes.get(exc.status_code, "INVALID_REQUEST")
        )
        payload = {"message": str(detail), "error_code": code, "details": []}
    return JSONResponse(status_code=exc.status_code, content=payload, headers=exc.headers)
