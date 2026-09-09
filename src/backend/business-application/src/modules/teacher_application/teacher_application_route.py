from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, Query, UploadFile, status

from src.modules.teacher_application.teacher_application_dependency import get_teacher_application_service
from src.modules.teacher_application.teacher_application_service import TeacherApplicationService
from src.middlewares.auth_middleware import UserPayload
from src.middlewares.role_middleware import require_role
from src.models.base_model import Role, TeacherRegisterStatus
from src.services.minio.minio_dependency import get_minio_handler
from src.services.minio.minio_handler import MinioHandler

from .teacher_application_dto import (
    TeacherApplicationAdminDetailResponse,
    TeacherApplicationCreateRequest,
    TeacherApplicationDocumentUploads,
    TeacherApplicationListResponse,
    TeacherApplicationMeResponse,
    TeacherApplicationReviewRequest,
    TeacherApplicationReviewResponse,
    TeacherApplicationSubmitResponse,
    TeacherApplicationUpdateRequest,
    TeacherApplicationView,
)

router = APIRouter(prefix="/teacher-applications", tags=["Teacher Applications"])
admin_router = APIRouter(
    prefix="/admin/teacher-applications", tags=["Admin Teacher Applications"]
)



@router.post(
    "",
    response_model=TeacherApplicationView,
    status_code=status.HTTP_201_CREATED,
    summary="Create a teacher application draft and upload documents",
)
async def create_teacher_application(
    identity_number: Annotated[str, Form(min_length=1)],
    bio: Annotated[str | None, Form()] = None,
    education_evidence: Annotated[UploadFile | None, File()] = None,
    legal_full_name: Annotated[str | None, Form()] = None,
    date_of_birth: Annotated[date | None, Form()] = None,
    identity_front: Annotated[UploadFile | None, File()] = None,
    identity_back: Annotated[UploadFile | None, File()] = None,
    selfie_with_id: Annotated[UploadFile | None, File()] = None,
    cv: Annotated[UploadFile | None, File()] = None,
    motivation: Annotated[str | None, Form()] = None,
    current_user: UserPayload = Depends(require_role(Role.STUDENT)),
    minio_handler: MinioHandler = Depends(get_minio_handler),
    service: TeacherApplicationService = Depends(get_teacher_application_service) 
) -> TeacherApplicationView:
    return await service.create_application(
        user_id=current_user["sub"],
        data=TeacherApplicationCreateRequest(
            bio=bio,
            legal_full_name=legal_full_name,
            date_of_birth=date_of_birth,
            identity_number=identity_number,
            motivation=motivation,
        ),
        documents=TeacherApplicationDocumentUploads(
            identity_front=identity_front,
            identity_back=identity_back,
            selfie_with_id=selfie_with_id,
            education_evidence=education_evidence,
            cv=cv,
        ),
        minio_handler=minio_handler,
    )


@router.get("/me")
async def get_my_teacher_application(
    current_user: UserPayload = Depends(require_role(Role.STUDENT)),
    minio_handler: MinioHandler = Depends(get_minio_handler),
    service: TeacherApplicationService = Depends(get_teacher_application_service) 
) -> TeacherApplicationMeResponse:
    return await service.get_application_by_teacher_profile(
        user_id=current_user["sub"], minio_handler=minio_handler
    )


@router.put(
    "/me",
    summary="Update a draft or rejected application and replace documents",
)
async def update_my_teacher_application(
    bio: Annotated[str | None, Form()] = None,
    education_evidence: Annotated[UploadFile | None, File()] = None,
    legal_full_name: Annotated[str | None, Form()] = None,
    date_of_birth: Annotated[date | None, Form()] = None,
    identity_number: Annotated[str | None, Form(min_length=1)] = None,
    identity_front: Annotated[UploadFile | None, File()] = None,
    identity_back: Annotated[UploadFile | None, File()] = None,
    selfie_with_id: Annotated[UploadFile | None, File()] = None,
    cv: Annotated[UploadFile | None, File()] = None,
    motivation: Annotated[str | None, Form()] = None,
    current_user: UserPayload = Depends(require_role(Role.STUDENT)),
    minio_handler: MinioHandler = Depends(get_minio_handler),
    service: TeacherApplicationService = Depends(get_teacher_application_service) 
) -> TeacherApplicationMeResponse:
    data = TeacherApplicationUpdateRequest.model_validate(
        {
            field: value
            for field, value in {
                "bio": bio,
                "legal_full_name": legal_full_name,
                "date_of_birth": date_of_birth,
                "identity_number": identity_number,
                "motivation": motivation,
            }.items()
            if value is not None
        }
    )
    return await service.update_application(
        user_id=current_user["sub"],
        data=data,
        documents=TeacherApplicationDocumentUploads(
            identity_front=identity_front,
            identity_back=identity_back,
            selfie_with_id=selfie_with_id,
            education_evidence=education_evidence,
            cv=cv,
        ),
        minio_handler=minio_handler,
    )


@router.post("/me/submit", response_model=TeacherApplicationSubmitResponse)
async def submit_my_teacher_application(
    service: TeacherApplicationService = Depends(get_teacher_application_service),
    current_user: UserPayload = Depends(require_role(Role.STUDENT)),
) -> TeacherApplicationSubmitResponse:
    return await service.submit_application(user_id=current_user["sub"])


@admin_router.get(
    "",
    response_model=TeacherApplicationListResponse,
    response_model_exclude_none=True,
)
async def get_teacher_applications(
    page: Annotated[int, Query(ge=1)] = 1,
    size: Annotated[int, Query(ge=1, le=100)] = 10,
    status_filter: Annotated[TeacherRegisterStatus | None, Query(alias="status")] = None,
    q: Annotated[str | None, Query(max_length=200)] = None,
    _: UserPayload = Depends(require_role(Role.ADMIN)),
    service: TeacherApplicationService = Depends(get_teacher_application_service) 
) -> TeacherApplicationListResponse:
    return await service.get_applications_for_admin(
        page=page, size=size, status_filter=status_filter, q=q
    )


@admin_router.get("/{application_id}", response_model=TeacherApplicationAdminDetailResponse)
async def get_teacher_application_detail(

    application_id: int,
    admin: UserPayload = Depends(require_role(Role.ADMIN)),
    minio_handler: MinioHandler = Depends(get_minio_handler),
    service: TeacherApplicationService = Depends(get_teacher_application_service) 
) -> TeacherApplicationAdminDetailResponse:
    return await service.get_application_detail_for_admin(
        app_id=application_id,
        admin_id=admin["sub"],
        minio_handler=minio_handler,
    )


@admin_router.post(
    "/{application_id}/review", response_model=TeacherApplicationReviewResponse
)
async def review_teacher_application(

    application_id: int,
    data: TeacherApplicationReviewRequest,
    admin: UserPayload = Depends(require_role(Role.ADMIN)),
    minio_handler: MinioHandler = Depends(get_minio_handler),
    service: TeacherApplicationService = Depends(get_teacher_application_service) 
) -> TeacherApplicationReviewResponse:
    return await service.review_application(
        app_id=application_id,
        admin_id=admin["sub"],
        data=data,
        minio_handler=minio_handler,
    )
