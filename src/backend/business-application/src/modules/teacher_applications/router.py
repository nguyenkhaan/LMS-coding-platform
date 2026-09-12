from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, UploadFile, status

from src.middlewares.auth_middleware import UserPayload
from src.middlewares.role_middleware import require_role
from src.models.base_model import Role
from src.modules.teacher_applications.dependencies import (
    get_teacher_application_service,
)
from src.modules.teacher_applications.service import TeacherApplicationService
from src.services.minio.minio_dependency import get_minio_handler
from src.services.minio.minio_handler import MinioHandler

from .dto import (
    TeacherApplicationCreateRequest,
    TeacherApplicationDocumentUploads,
    TeacherApplicationMeResponse,
    TeacherApplicationSubmitResponse,
    TeacherApplicationUpdateRequest,
    TeacherApplicationView,
)

router = APIRouter(prefix="/teacher-applications", tags=["Teacher Applications"])


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
    service: TeacherApplicationService = Depends(get_teacher_application_service),
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
    service: TeacherApplicationService = Depends(get_teacher_application_service),
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
    service: TeacherApplicationService = Depends(get_teacher_application_service),
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
