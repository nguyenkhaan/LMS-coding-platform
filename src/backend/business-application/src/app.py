import logging
from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from src.bases.constants.submission_queues import SUBMISSION_EXECUTION_RESULT_QUEUE
from src.cores.settings import RABBITMQ_URL
from src.grpc.client import AuthGrpcClient
from src.jwk_service import PublicKeyService
from src.modules.courses.authoring.router import router as teacher_course_router
from src.modules.courses.catalog.favorite_router import router as course_favorite_router
from src.modules.courses.catalog.review_router import router as course_review_router
from src.modules.courses.catalog.router import (
    router as course_directory_router,
)
from src.modules.courses.curriculum.lesson_content_router import (
    lesson_router as teacher_lesson_contents_create_router,
)
from src.modules.courses.curriculum.lesson_content_router import (
    router as teacher_lesson_contents_router,
)
from src.modules.courses.curriculum.lesson_router import (
    router as teacher_lessons_router,
)
from src.modules.courses.curriculum.lesson_router import (
    section_router as teacher_section_lessons_router,
)
from src.modules.courses.curriculum.reorder_router import (
    router as teacher_curriculum_reorder_router,
)
from src.modules.courses.curriculum.section_router import (
    course_router as teacher_course_sections_router,
)
from src.modules.courses.curriculum.section_router import (
    router as teacher_sections_router,
)
from src.modules.courses.learning.progress_router import (
    router as student_progress_router,
)
from src.modules.courses.learning.router import router as student_learning_router
from src.modules.courses.moderation.router import (
    router as admin_course_router,
)
from src.modules.health.router import router as health_router
from src.modules.lesson_comments.router import (
    router as lesson_comment_router,
)
from src.modules.lesson_comments.teacher_router import (
    router as teacher_lesson_comment_router,
)
from src.modules.payments.admin_router import router as payment_admin_router
from src.modules.payments.checkout_router import router as payment_checkout_router
from src.modules.payments.transaction_router import router as payment_transaction_router
from src.modules.payments.webhook_router import router as payment_webhook_router
from src.modules.problems.router import teacher_problem_router
from src.modules.quizzes.router import (
    teacher_lesson_quizzes_router,
    teacher_quizzes_router,
)
from src.modules.submission.dispatch_router import router as submission_dispatch_router
from src.modules.submission.event_router import router as submission_event_router
from src.modules.submission.router import router as submission_router
from src.modules.submission.teacher_router import router as teacher_submission_router
from src.modules.teacher_applications.admin_router import (
    router as admin_teacher_application_router,
)
from src.modules.teacher_applications.router import router as teacher_application_router
from src.modules.users.admin_router import router as admin_user_router
from src.modules.users.router import router as user_router
from src.services.rabbitmq.rabbitmq_manager import RabbitMQManager
from src.services.rabbitmq.submission_execution_result_consumer import (
    handle_submission_execution_result,
)
from src.services.sse.sse_manager import SSEManager

logger = logging.getLogger(__name__)


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

        await rabbitmq_manager.consume(
            SUBMISSION_EXECUTION_RESULT_QUEUE, handle_submission_result
        )
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

v1_router.include_router(health_router)
v1_router.include_router(course_directory_router)
v1_router.include_router(course_favorite_router)
v1_router.include_router(course_review_router)
v1_router.include_router(student_learning_router)
v1_router.include_router(student_progress_router)
v1_router.include_router(user_router)
v1_router.include_router(admin_user_router)
v1_router.include_router(teacher_application_router)
v1_router.include_router(admin_teacher_application_router)
v1_router.include_router(payment_checkout_router)
v1_router.include_router(payment_webhook_router)
v1_router.include_router(payment_transaction_router)
v1_router.include_router(payment_admin_router)
v1_router.include_router(lesson_comment_router)
v1_router.include_router(teacher_lesson_comment_router)
v1_router.include_router(submission_router)
v1_router.include_router(submission_event_router)
v1_router.include_router(submission_dispatch_router)
v1_router.include_router(teacher_course_router)
v1_router.include_router(teacher_course_sections_router)
v1_router.include_router(teacher_curriculum_reorder_router)
v1_router.include_router(teacher_submission_router)
v1_router.include_router(teacher_sections_router)
v1_router.include_router(teacher_section_lessons_router)
v1_router.include_router(teacher_lessons_router)
v1_router.include_router(teacher_lesson_contents_create_router)
v1_router.include_router(teacher_lesson_contents_router)
v1_router.include_router(teacher_lesson_quizzes_router)
v1_router.include_router(teacher_quizzes_router)
v1_router.include_router(teacher_problem_router)
v1_router.include_router(admin_course_router)

app.include_router(v1_router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "message": "Invalid request",
            "error_code": "VALIDATION_ERROR",
            "details": [
                {"field": ".".join(map(str, error["loc"])), "reason": error["msg"]}
                for error in exc.errors()
            ],
        },
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc: StarletteHTTPException):
    codes = {
        400: "INVALID_REQUEST",
        401: "UNAUTHENTICATED",
        403: "FORBIDDEN",
        404: "NOT_FOUND",
        409: "INVALID_STATE",
        410: "PAYMENT_EXPIRED",
        422: "VALIDATION_ERROR",
        429: "RATE_LIMITED",
    }
    detail = exc.detail
    if isinstance(detail, dict):
        payload = {
            "message": detail.get("message", "Request failed"),
            "error_code": detail.get(
                "error_code", codes.get(exc.status_code, "INVALID_REQUEST")
            ),
            "details": detail.get("details", []),
        }
    else:
        code = (
            "DUPLICATE_RESOURCE"
            if str(detail).startswith("DUPLICATE_RESOURCE:")
            else codes.get(exc.status_code, "INVALID_REQUEST")
        )
        payload = {"message": str(detail), "error_code": code, "details": []}
    return JSONResponse(
        status_code=exc.status_code, content=payload, headers=exc.headers
    )
