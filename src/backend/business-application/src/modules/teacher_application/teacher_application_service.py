from pathlib import Path
from typing import TypedDict
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status
from sqlalchemy import func, or_, select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from starlette.concurrency import run_in_threadpool
from uuid import uuid4
from src.models.audit_log_model import AuditLogModel
from src.models.base_model import (
    AuditAction,
    NotificationType,
    Role,
    TeacherRegisterStatus,
)
from src.models.notification_model import NotificationModel
from src.models.role_model import UserRoleModel
from src.models.teacher_profile_model import TeacherProfileModel
from src.models.teacher_register_history_model import TeacherRegisterHistoryModel
from src.models.teacher_register_model import TeacherRegisterModel
from src.models.user_model import UserModel
from src.services.minio.minio_handler import MinioHandler

from .teacher_application_dto import (
    TeacherApplicationAdminDetailResponse,
    TeacherApplicationCreateRequest,
    TeacherApplicationDocumentUploads,
    TeacherApplicationHistoryView,
    TeacherApplicationListResponse,
    TeacherApplicationMeResponse,
    TeacherApplicationReviewRequest,
    TeacherApplicationReviewResponse,
    TeacherApplicationSubmitResponse,
    TeacherApplicationSubmitSchema,
    TeacherApplicationUpdateRequest,
    TeacherApplicationView,
    TeacherProfileView,
)

MAX_DOCUMENT_SIZE_BYTES = 5 * 1024 * 1024
_IMAGE_MIME_TYPES = frozenset({"image/jpeg", "image/png", "image/webp"})
_IMAGE_SUFFIXES = frozenset({".jpg", ".jpeg", ".png", ".webp"})
_DOCUMENT_MIME_TYPES = frozenset(
    {
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }
)
_DOCUMENT_SUFFIXES = frozenset({".pdf", ".doc", ".docx"})
_DOCUMENT_RULES: dict[str, tuple[frozenset[str], frozenset[str]]] = {
    "identity_front_url": (_IMAGE_MIME_TYPES, _IMAGE_SUFFIXES),
    "identity_back_url": (_IMAGE_MIME_TYPES, _IMAGE_SUFFIXES),
    "selfie_with_id_url": (_IMAGE_MIME_TYPES, _IMAGE_SUFFIXES),
    "education_evidence_urls": (_DOCUMENT_MIME_TYPES, _DOCUMENT_SUFFIXES),
    "cv_url": (_DOCUMENT_MIME_TYPES, _DOCUMENT_SUFFIXES),
}


class AuditLogData(TypedDict):
    user_id: int
    action: AuditAction
    target_id: int
    note: str


class TeacherApplicationService:
    def __init__(self, db_session: AsyncSession):
        self.db: AsyncSession = db_session

    def _write_audit_log(self, data: AuditLogData) -> None:
        self.db.add(
            AuditLogModel(
                user_id=data["user_id"],
                action=data["action"],
                target_type="teacher_register",
                target_id=data["target_id"],
                note=data["note"],
            )
        )

    def _mask_identity_number(self, identity_number: str) -> str:
        return f"***{identity_number[-4:]}" if len(identity_number) >= 4 else "***"

    def _document_fields(
        self,
        documents: TeacherApplicationDocumentUploads,
    ) -> tuple[tuple[str, str, UploadFile | None], ...]:
        return (
            ("identity_front_url", "identity-front", documents.identity_front),
            ("identity_back_url", "identity-back", documents.identity_back),
            ("selfie_with_id_url", "selfie-with-id", documents.selfie_with_id),
            (
                "education_evidence_urls",
                "education-evidence",
                documents.education_evidence,
            ),
            ("cv_url", "cv", documents.cv),
        )

    async def _validate_document(self, file: UploadFile, database_field: str) -> None:
        allowed_mime_types, allowed_suffixes = _DOCUMENT_RULES[database_field]
        suffix = Path(file.filename or "").suffix.lower()
        if not file.filename or file.content_type not in allowed_mime_types or suffix not in allowed_suffixes:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Invalid file type for {database_field}",
            )

        file_size = file.size
        if file_size is None:
            def get_file_size() -> int:
                file.file.seek(0, 2)
                size = file.file.tell()
                file.file.seek(0)
                return size

            file_size = await run_in_threadpool(get_file_size)
        if file_size > MAX_DOCUMENT_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"{database_field} exceeds the 5 MB limit",
            )
        await file.seek(0)

    async def _validate_documents(
        self, documents: TeacherApplicationDocumentUploads
    ) -> None:
        for database_field, _, file in self._document_fields(documents):
            if file is not None:
                await self._validate_document(file, database_field)

    async def _delete_objects(
        self, minio_handler: MinioHandler, object_keys: list[str]
    ) -> None:
        for object_key in object_keys:
            try:
                await run_in_threadpool(minio_handler.remove_object, object_key)
            except Exception:
                continue

    async def _upload_documents(
        self,
        documents: TeacherApplicationDocumentUploads,
        minio_handler: MinioHandler,
        application_id: int,
    ) -> dict[str, str]:
        uploaded: dict[str, str] = {}
        try:
            for database_field, document_type, file in self._document_fields(documents):
                if file is None:
                    continue
                suffix = Path(file.filename or "").suffix.lower()
                object_name = (
                    f"teacher-application-{application_id}-{document_type}-"
                    f"{uuid4().hex}{suffix}"
                )
                result = await run_in_threadpool(
                    minio_handler.put_object,
                    file.file,
                    object_name,
                    file.content_type,
                )
                uploaded[database_field] = str(result["file_name"])
        except Exception as exc:
            await self._delete_objects(minio_handler, list(uploaded.values()))
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unable to upload application documents",
            ) from exc
        return uploaded

    async def _document_url(
        self, object_key: str | None, minio_handler: MinioHandler
    ) -> str | None:
        if object_key is None:
            return None
        if object_key.startswith(("http://", "https://")):
            return object_key
        try:
            return await run_in_threadpool(
                minio_handler.presigned_get_object,
                minio_handler.bucket_name,
                object_key,
            )
        except Exception:
            return None

    def _history_view(self, history: TeacherRegisterHistoryModel) -> TeacherApplicationHistoryView:
        return TeacherApplicationHistoryView(
            id=history.id,
            teacher_register_id=history.teacher_register_id,
            status=history.status,
            note=history.reviewed_note,
            acted_by=history.acted_by,
            acted_at=history.submitted_at,
        )

    def _profile_view(self, profile: TeacherProfileModel) -> TeacherProfileView:
        return TeacherProfileView.model_validate(profile)

    async def _application_view(
        self,
        app: TeacherRegisterModel,
        *,
        minio_handler: MinioHandler | None,
        include_sensitive: bool,
    ) -> TeacherApplicationView:
        history = sorted(app.history, key=lambda item: (item.submitted_at, item.id))
        submitted = next(
            (
                item
                for item in reversed(history)
                if item.status == TeacherRegisterStatus.PENDING
            ),
            None,
        )
        review = next(
            (
                item
                for item in reversed(history)
                if item.status
                in (TeacherRegisterStatus.APPROVED, TeacherRegisterStatus.REJECTED)
            ),
            None,
        )
        if include_sensitive and minio_handler is None:
            raise RuntimeError("A MinIO handler is required for sensitive application views")

        return TeacherApplicationView(
            id=app.id,
            teacher_profile_id=app.teacher_profile_id,
            bio=app.bio,
            education_evidence_urls=(
                await self._document_url(app.education_evidence_urls, minio_handler)
                if include_sensitive and minio_handler is not None
                else None
            ),
            legal_full_name=app.legal_full_name,
            date_of_birth=app.date_of_birth,
            identity_number=(
                app.identity_number
                if include_sensitive
                else self._mask_identity_number(app.identity_number)
            ),
            identity_front_url=(
                await self._document_url(app.identity_front_url, minio_handler)
                if include_sensitive and minio_handler is not None
                else None
            ),
            identity_back_url=(
                await self._document_url(app.identity_back_url, minio_handler)
                if include_sensitive and minio_handler is not None
                else None
            ),
            selfie_with_id_url=(
                await self._document_url(app.selfie_with_id_url, minio_handler)
                if include_sensitive and minio_handler is not None
                else None
            ),
            cv_url=(
                await self._document_url(app.cv_url, minio_handler)
                if include_sensitive and minio_handler is not None
                else None
            ),
            motivation=app.motivation,
            status=app.status,
            reviewed_note=review.reviewed_note if review else None,
            reviewed_by=review.acted_by if review else None,
            reviewed_at=review.submitted_at if review else None,
            submitted_at=submitted.submitted_at if submitted else None,
            created_at=app.created_at,
            updated_at=app.updated_at,
        )

    async def _me_response(
        self, app: TeacherRegisterModel, minio_handler: MinioHandler
    ) -> TeacherApplicationMeResponse:
        profile = app.teacher_profile
        if profile is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Teacher profile is missing for this application",
            )
        return TeacherApplicationMeResponse(
            application=await self._application_view(
                app, minio_handler=minio_handler, include_sensitive=True
            ),
            teacher_profile=self._profile_view(profile),
            history=[self._history_view(item) for item in sorted(app.history, key=lambda item: item.id)],
            can_edit=app.status
            in (
                TeacherRegisterStatus.DRAFT,
                TeacherRegisterStatus.REJECTED,
                TeacherRegisterStatus.APPROVED,
            ),
            can_submit=app.status
            in (TeacherRegisterStatus.DRAFT, TeacherRegisterStatus.REJECTED),
        )

    async def _admin_detail_response(
        self, app: TeacherRegisterModel, minio_handler: MinioHandler
    ) -> TeacherApplicationAdminDetailResponse:
        profile = app.teacher_profile
        if profile is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Teacher profile is missing for this application",
            )
        return TeacherApplicationAdminDetailResponse(
            application=await self._application_view(
                app, minio_handler=minio_handler, include_sensitive=True
            ),
            teacher_profile=self._profile_view(profile),
            history=[self._history_view(item) for item in sorted(app.history, key=lambda item: item.id)],
        )

    async def _get_application(
        self, app_id: int, *, lock: bool = False
    ) -> TeacherRegisterModel:
        stmt = (
            select(TeacherRegisterModel)
            .options(
                selectinload(TeacherRegisterModel.teacher_profile),
                selectinload(TeacherRegisterModel.history),
            )
            .where(TeacherRegisterModel.id == app_id)
        )
        app = (await self.db.execute(stmt)).scalar_one_or_none()
        if app is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
        return app

    async def _get_owned_application(
        self, user_id: int, *, lock: bool = False
    ) -> TeacherRegisterModel:
        stmt = (
            select(TeacherRegisterModel)
            .options(
                selectinload(TeacherRegisterModel.teacher_profile),
                selectinload(TeacherRegisterModel.history),
            )
            .where(TeacherRegisterModel.teacher_profile_id == user_id)
        )
        if lock:
            stmt = stmt.with_for_update()
        app = (await self.db.execute(stmt)).scalar_one_or_none()
        if app is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
        return app

    async def create_application(
        self,
        user_id: int,
        data: TeacherApplicationCreateRequest,
        documents: TeacherApplicationDocumentUploads,
        minio_handler: MinioHandler,
    ) -> TeacherApplicationView:
        await self._validate_documents(documents)
        profile = await self.db.get(TeacherProfileModel, user_id)
        if profile is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Teacher profile does not exist. Please create profile first.",
            )

        new_app = TeacherRegisterModel(
            teacher_profile_id=profile.user_id,
            bio=data.bio,
            legal_full_name=data.legal_full_name,
            date_of_birth=data.date_of_birth,
            identity_number=data.identity_number,
            motivation=data.motivation,
            status=TeacherRegisterStatus.DRAFT,
        )
        uploaded: dict[str, str] = {}
        try:
            self.db.add(new_app)
            await self.db.flush()
            uploaded = await self._upload_documents(documents, minio_handler, new_app.id)
            for database_field, object_key in uploaded.items():
                setattr(new_app, database_field, object_key)
            await self.db.commit()
        except HTTPException:
            await self.db.rollback()
            await self._delete_objects(minio_handler, list(uploaded.values()))
            raise
        except IntegrityError as exc:
            await self.db.rollback()
            await self._delete_objects(minio_handler, list(uploaded.values()))
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An application already exists for this profile or identity number",
            ) from exc
        except SQLAlchemyError as exc:
            await self.db.rollback()
            await self._delete_objects(minio_handler, list(uploaded.values()))
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unable to create the application",
            ) from exc

        app = await self._get_application(new_app.id)
        return await self._application_view(
            app, minio_handler=minio_handler, include_sensitive=True
        )

    async def get_application_by_teacher_profile(
        self, user_id: int, minio_handler: MinioHandler
    ) -> TeacherApplicationMeResponse:
        return await self._me_response(
            await self._get_owned_application(user_id), minio_handler
        )

    async def update_application(
        self,
        user_id: int,
        data: TeacherApplicationUpdateRequest,
        documents: TeacherApplicationDocumentUploads,
        minio_handler: MinioHandler,
    ) -> TeacherApplicationMeResponse:
        app = await self._get_owned_application(user_id, lock=True)
        update_data = data.model_dump(exclude_unset=True, exclude_none=True)
        if not update_data and not documents.has_any():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least one application field or document is required",
            )
        if app.status == TeacherRegisterStatus.PENDING:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Cannot update application while it is pending",
            )
        if app.status == TeacherRegisterStatus.APPROVED:
            allowed_fields = {"bio", "date_of_birth", "motivation"}
            if set(update_data) - allowed_fields or documents.has_any():
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Sensitive application fields and documents are locked after approval",
                )

        await self._validate_documents(documents)
        previous_keys = [
            getattr(app, database_field)
            for database_field, _, file in self._document_fields(documents)
            if file is not None and getattr(app, database_field) is not None
        ]
        uploaded: dict[str, str] = {}
        try:
            for field, value in update_data.items():
                setattr(app, field, value)
            uploaded = await self._upload_documents(documents, minio_handler, app.id)
            for database_field, object_key in uploaded.items():
                setattr(app, database_field, object_key)
            await self.db.commit()
        except HTTPException:
            await self.db.rollback()
            await self._delete_objects(minio_handler, list(uploaded.values()))
            raise
        except IntegrityError as exc:
            await self.db.rollback()
            await self._delete_objects(minio_handler, list(uploaded.values()))
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="identity_number is already in use",
            ) from exc
        except SQLAlchemyError as exc:
            await self.db.rollback()
            await self._delete_objects(minio_handler, list(uploaded.values()))
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unable to update the application",
            ) from exc

        await self._delete_objects(minio_handler, previous_keys)
        return await self._me_response(
            await self._get_owned_application(user_id), minio_handler
        )

    async def submit_application(
        self, user_id: int
    ) -> TeacherApplicationSubmitResponse:
        app = await self._get_owned_application(user_id, lock=True)
        if app.status not in (TeacherRegisterStatus.DRAFT, TeacherRegisterStatus.REJECTED):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Only a draft or rejected application can be submitted",
            )
        try:
            TeacherApplicationSubmitSchema.model_validate(app)
        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing required fields for submission",
            ) from exc

        app.status = TeacherRegisterStatus.PENDING
        history = TeacherRegisterHistoryModel(
            teacher_register_id=app.id,
            status=TeacherRegisterStatus.PENDING,
            reviewed_note="Submitted by teacher",
            acted_by=user_id,
        )
        self.db.add(history)
        try:
            await self.db.flush()
            await self.db.commit()
        except SQLAlchemyError as exc:
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unable to submit the application",
            ) from exc

        return TeacherApplicationSubmitResponse(
            id=app.id,
            status=TeacherRegisterStatus.PENDING,
            submitted_at=history.submitted_at,
        )

    async def get_applications_for_admin(
        self,
        page: int,
        size: int,
        status_filter: TeacherRegisterStatus | None,
        q: str | None,
    ) -> TeacherApplicationListResponse:
        stmt = select(TeacherRegisterModel)
        if status_filter is not None:
            stmt = stmt.where(TeacherRegisterModel.status == status_filter)
        if q is not None and q.strip():
            search_term = f"%{q.strip()}%"
            stmt = stmt.join(TeacherProfileModel).join(UserModel).where(
                or_(
                    TeacherRegisterModel.legal_full_name.ilike(search_term),
                    UserModel.full_name.ilike(search_term),
                    UserModel.email.ilike(search_term),
                )
            )

        total_items = await self.db.scalar(
            select(func.count()).select_from(stmt.order_by(None).subquery())
        )
        apps = (
            await self.db.execute(
                stmt.options(selectinload(TeacherRegisterModel.history))
                .order_by(TeacherRegisterModel.created_at.desc())
                .offset((page - 1) * size)
                .limit(size)
            )
        ).scalars().all()
        items = []
        for app in apps:
            items.append(
                await self._application_view(
                    app, minio_handler=None, include_sensitive=False
                )
            )
        total = total_items or 0
        return TeacherApplicationListResponse(
            total_items=total,
            total_pages=(total + size - 1) // size,
            current_page=page,
            items=items,
        )

    async def get_application_detail_for_admin(
        self,
        app_id: int,
        admin_id: int,
        minio_handler: MinioHandler,
    ) -> TeacherApplicationAdminDetailResponse:
        app = await self._get_application(app_id)
        # self._write_audit_log(
        #     {
        #         "user_id": admin_id,
        #         "action": AuditAction.TEACHER_APPLICATION_VIEW,
        #         "target_id": app.id,
        #         "note": "Viewed teacher application detail",
        #     },
        # )
        audit_log = AuditLogModel(
            user_id = admin_id, 
            target_type = "teacher_register",  
            action = AuditAction.TEACHER_APPLICATION_REVIEW, 
            target_id = app.id, 
            note = "Viewed teacher application detail",
            correlation_id = str(uuid4())
        )
        self.db.add(audit_log)
        try:
            await self.db.commit()
        except SQLAlchemyError as exc:
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Unable to record the application access audit log",
            ) from exc
        return await self._admin_detail_response(app, minio_handler)

    async def review_application(
        self,
        app_id: int,
        admin_id: int,
        data: TeacherApplicationReviewRequest,
        minio_handler: MinioHandler,
    ) -> TeacherApplicationReviewResponse:
        app = await self._get_application(app_id, lock=True)
        if app.status != TeacherRegisterStatus.PENDING:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Application is not in PENDING state",
            )

        app.status = data.decision
        history = TeacherRegisterHistoryModel(
            teacher_register_id=app.id,
            status=data.decision,
            reviewed_note=data.note,
            acted_by=admin_id,
        )
        self.db.add(history)

        if data.decision == TeacherRegisterStatus.APPROVED:
            teacher_role_id = await self.db.scalar(
                select(UserRoleModel.id)
                .where(
                    UserRoleModel.user_id == app.teacher_profile_id,
                    UserRoleModel.role == Role.TEACHER,
                )
                .limit(1)
            )
            if teacher_role_id is None:
                self.db.add(
                    UserRoleModel(
                        user_id=app.teacher_profile_id,
                        role=Role.TEACHER,
                    )
                )

        notification_type = (
            NotificationType.TEACHER_APPLICATION_APPROVED
            if data.decision == TeacherRegisterStatus.APPROVED
            else NotificationType.TEACHER_APPLICATION_REJECTED
        )
        notification_content = (
            "Your teacher application has been approved."
            if data.decision == TeacherRegisterStatus.APPROVED
            else "Your teacher application has been rejected. Please review the feedback."
        )
        self.db.add(
            NotificationModel(
                sender_id=admin_id,
                user_id=app.teacher_profile_id,
                type=notification_type,
                target_type="teacher_register",
                target_id=app.id,
                content=notification_content,
            )
        )
        self._write_audit_log(
            {
                "user_id": admin_id,
                "action": AuditAction.TEACHER_APPLICATION_REVIEW,
                "target_id": app.id,
                "note": f"Reviewed teacher application: {data.decision.value}",
            },
        )

        try:
            await self.db.flush()
            await self.db.commit()
        except SQLAlchemyError as exc:
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unable to review the application",
            ) from exc

        refreshed_app = await self._get_application(app.id)
        return TeacherApplicationReviewResponse(
            application=await self._application_view(
                refreshed_app, minio_handler=minio_handler, include_sensitive=True
            ),
            history=self._history_view(history),
        )
