from typing import Annotated

from fastapi import APIRouter, Depends, Query

from src.middlewares.auth_middleware import UserPayload
from src.middlewares.role_middleware import require_role
from src.models.base_model import Role, TeacherRegisterStatus
from src.modules.teacher_applications.dependencies import (
    get_teacher_application_service,
)
from src.modules.teacher_applications.dto import (
    TeacherApplicationAdminDetailResponse,
    TeacherApplicationListResponse,
    TeacherApplicationReviewRequest,
    TeacherApplicationReviewResponse,
)
from src.modules.teacher_applications.service import TeacherApplicationService
from src.services.minio.minio_dependency import get_minio_handler
from src.services.minio.minio_handler import MinioHandler

router = APIRouter(
    prefix="/admin/teacher-applications",
    tags=["Admin Teacher Applications"],
)


@router.get(
    "",
    response_model=TeacherApplicationListResponse,
    response_model_exclude_none=True,
)
async def get_teacher_applications(
    page: Annotated[int, Query(ge=1)] = 1,
    size: Annotated[int, Query(ge=1, le=100)] = 10,
    status_filter: Annotated[
        TeacherRegisterStatus | None, Query(alias="status")
    ] = None,
    q: Annotated[str | None, Query(max_length=200)] = None,
    _: UserPayload = Depends(require_role(Role.ADMIN)),
    service: TeacherApplicationService = Depends(get_teacher_application_service),
) -> TeacherApplicationListResponse:
    return await service.get_applications_for_admin(
        page=page, size=size, status_filter=status_filter, q=q
    )


@router.get("/{application_id}", response_model=TeacherApplicationAdminDetailResponse)
async def get_teacher_application_detail(
    application_id: int,
    admin: UserPayload = Depends(require_role(Role.ADMIN)),
    minio_handler: MinioHandler = Depends(get_minio_handler),
    service: TeacherApplicationService = Depends(get_teacher_application_service),
) -> TeacherApplicationAdminDetailResponse:
    return await service.get_application_detail_for_admin(
        app_id=application_id,
        admin_id=admin["sub"],
        minio_handler=minio_handler,
    )


@router.post(
    "/{application_id}/review",
    response_model=TeacherApplicationReviewResponse,
)
async def review_teacher_application(
    application_id: int,
    data: TeacherApplicationReviewRequest,
    admin: UserPayload = Depends(require_role(Role.ADMIN)),
    minio_handler: MinioHandler = Depends(get_minio_handler),
    service: TeacherApplicationService = Depends(get_teacher_application_service),
) -> TeacherApplicationReviewResponse:
    return await service.review_application(
        app_id=application_id,
        admin_id=admin["sub"],
        data=data,
        minio_handler=minio_handler,
    )
