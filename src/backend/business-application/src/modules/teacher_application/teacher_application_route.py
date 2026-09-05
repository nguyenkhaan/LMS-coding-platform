from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.db import get_async_db_session
from src.middlewares.auth_middleware import get_current_user
from src.middlewares.auth_middleware import get_current_user, UserPayload

from .teacher_application_dto import (
    TeacherApplicationCreateRequest,
    TeacherApplicationResponse,
    TeacherApplicationUpdateRequest,
)
from .teacher_application_service import TeacherApplicationService

router = APIRouter(prefix="/teacher-applications", tags=["Teacher Applications"])

@router.post(
    "", 
    response_model=TeacherApplicationResponse, 
    status_code=201,
    summary="Create a new teacher application",
    description="Creates a new teacher application in DRAFT state. A teacher profile must already exist for the user."
)
async def create_teacher_application(
    data: TeacherApplicationCreateRequest,
    current_user: UserPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db_session)
):
    user_id = int(current_user["sub"])
    app = await TeacherApplicationService.create_application(user_id, data, db)
    return TeacherApplicationResponse(data=app)

@router.get(
    "/me", 
    response_model=TeacherApplicationResponse,
    summary="Get current user's teacher application",
    description="Returns the teacher application for the authenticated user, if it exists."
)
async def get_my_teacher_application(
    current_user: UserPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db_session)
):
    user_id = int(current_user["sub"])
    app = await TeacherApplicationService.get_application_by_teacher_profile(user_id, db)
    return TeacherApplicationResponse(data=app)

@router.put(
    "/me", 
    response_model=TeacherApplicationResponse,
    summary="Update current user's teacher application",
    description="Updates the draft application. If the application is APPROVED, only a whitelist of fields (bio, date_of_birth, motivation) can be updated. Cannot update if PENDING."
)
async def update_my_teacher_application(
    data: TeacherApplicationUpdateRequest,
    current_user: UserPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db_session)
):
    user_id = int(current_user["sub"])
    app = await TeacherApplicationService.update_application(user_id, data, db)
    return TeacherApplicationResponse(data=app)

@router.post(
    "/me/submit", 
    response_model=TeacherApplicationResponse,
    summary="Submit current user's teacher application",
    description="Submits the draft application for review. Validates that all required fields are present and changes status to PENDING."
)
async def submit_my_teacher_application(
    current_user: UserPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db_session)
):
    user_id = int(current_user["sub"])
    app = await TeacherApplicationService.submit_application(user_id, db)
    return TeacherApplicationResponse(data=app)

from typing import Annotated

from fastapi import Query

from src.middlewares.role_middleware import require_role
from src.models.base_model import Role, TeacherRegisterStatus

from .teacher_application_dto import TeacherApplicationListResponse

admin_router = APIRouter(prefix="/admin/teacher-applications", tags=["Admin Teacher Applications"])

@admin_router.get(
    "", 
    response_model=TeacherApplicationListResponse,
    summary="List teacher applications (Admin)",
    description="Returns a paginated list of teacher applications with masked identity numbers. Can be filtered by status."
)
async def get_teacher_applications(
    page: Annotated[int, Query(ge=1)] = 1,
    size: Annotated[int, Query(ge=1, le=100)] = 10,
    status: TeacherRegisterStatus | None = None,
    admin: UserPayload = Depends(require_role(Role.ADMIN)),
    db: AsyncSession = Depends(get_async_db_session)
):
    return await TeacherApplicationService.get_applications_for_admin(page, size, status, db)

from .teacher_application_dto import TeacherApplicationReviewRequest


@admin_router.get(
    "/{application_id}", 
    response_model=TeacherApplicationResponse,
    summary="Get teacher application detail (Admin)",
    description="Returns full unmasked details of a teacher application. This action creates an audit log entry."
)
async def get_teacher_application_detail(
    application_id: int,
    admin: UserPayload = Depends(require_role(Role.ADMIN)),
    db: AsyncSession = Depends(get_async_db_session)
):
    admin_id = int(admin["sub"])
    app = await TeacherApplicationService.get_application_detail_for_admin(application_id, admin_id, db)
    return TeacherApplicationResponse(data=app)

@admin_router.post(
    "/{application_id}/review", 
    response_model=TeacherApplicationResponse,
    summary="Review teacher application (Admin)",
    description="Approves or rejects a pending application. Rejection requires a review note. Updates application, writes to history, and creates an audit log."
)
async def review_teacher_application(
    application_id: int,
    data: TeacherApplicationReviewRequest,
    admin: UserPayload = Depends(require_role(Role.ADMIN)),
    db: AsyncSession = Depends(get_async_db_session)
):
    admin_id = int(admin["sub"])
    app = await TeacherApplicationService.review_application(application_id, admin_id, data, db)
    return TeacherApplicationResponse(data=app)
