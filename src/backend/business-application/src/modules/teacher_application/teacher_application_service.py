from typing import TypedDict

from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from src.models.audit_log_model import AuditLogModel
from src.models.base_model import AuditAction, TeacherRegisterStatus
from src.models.teacher_profile_model import TeacherProfileModel
from src.models.teacher_register_history_model import TeacherRegisterHistoryModel
from src.models.teacher_register_model import TeacherRegisterModel

from .teacher_application_dto import (
    TeacherApplicationCreateRequest,
    TeacherApplicationListItemView,
    TeacherApplicationListResponse,
    TeacherApplicationReviewRequest,
    TeacherApplicationSubmitSchema,
    TeacherApplicationUpdateRequest,
)


class AuditLogData(TypedDict):
    user_id: int
    action: AuditAction
    target_id: int
    note: str

class TeacherApplicationService:
    @staticmethod
    def _write_audit_log(db: AsyncSession, data: AuditLogData) -> None:
        audit = AuditLogModel(
            user_id=data["user_id"],
            action=data["action"],
            target_type="TeacherRegisterModel",
            target_id=data["target_id"],
            note=data["note"]
        )
        db.add(audit)

    @staticmethod
    async def create_application(
        user_id: int, 
        data: TeacherApplicationCreateRequest, 
        db: AsyncSession
    ) -> TeacherRegisterModel:
        # Teacher profile must already exist; application does not auto-create it
        stmt = select(TeacherProfileModel).where(TeacherProfileModel.user_id == user_id)
        result = await db.execute(stmt)
        profile = result.scalar_one_or_none()

        if not profile:
            raise HTTPException(status_code=400, detail="Teacher profile does not exist. Please create profile first.")

        # Check if application already exists (though UniqueConstraint will handle it, it's better to check and return 409)
        stmt_exist = select(TeacherRegisterModel).where(TeacherRegisterModel.teacher_profile_id == profile.user_id)
        result_exist = await db.execute(stmt_exist)
        if result_exist.scalar_one_or_none():
            raise HTTPException(status_code=409, detail="Application already exists")

        new_app = TeacherRegisterModel(
            teacher_profile_id=profile.user_id,
            bio=data.bio,
            education_evidence_urls=data.education_evidence_urls,
            legal_full_name=data.legal_full_name,
            date_of_birth=data.date_of_birth,
            identity_number=data.identity_number,
            identity_front_url=data.identity_front_url,
            identity_back_url=data.identity_back_url,
            selfie_with_id_url=data.selfie_with_id_url,
            cv_url=data.cv_url,
            motivation=data.motivation,
            status=TeacherRegisterStatus.DRAFT
        )

        try:
            db.add(new_app)
            await db.commit()
            await db.refresh(new_app)
            return new_app
        except IntegrityError:
            await db.rollback()
            raise HTTPException(status_code=409, detail="Application already exists or identity number is duplicated")

    @staticmethod
    async def _get_owned_application(user_id: int, db: AsyncSession) -> TeacherRegisterModel:
        stmt_app = select(TeacherRegisterModel).where(TeacherRegisterModel.teacher_profile_id == user_id)
        result_app = await db.execute(stmt_app)
        app = result_app.scalar_one_or_none()
        if not app:
            raise HTTPException(status_code=404, detail="Application not found")
            
        return app

    @staticmethod
    async def get_application_by_teacher_profile(
        user_id: int, 
        db: AsyncSession
    ) -> TeacherRegisterModel:
        app = await TeacherApplicationService._get_owned_application(user_id, db)
        return app

    @staticmethod
    async def update_application(
        user_id: int,
        data: TeacherApplicationUpdateRequest,
        db: AsyncSession
    ) -> TeacherRegisterModel:
        app = await TeacherApplicationService._get_owned_application(user_id, db)

        if app.status == TeacherRegisterStatus.PENDING:
            raise HTTPException(status_code=409, detail="Cannot update application while it is pending")

        if app.status == TeacherRegisterStatus.APPROVED:
            if data.bio is not None:
                app.bio = data.bio
            if data.date_of_birth is not None:
                app.date_of_birth = data.date_of_birth
            if data.motivation is not None:
                app.motivation = data.motivation
        else:
            update_data = data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(app, key, value)

        try:
            await db.commit()
            await db.refresh(app)
            return app
        except IntegrityError:
            await db.rollback()
            raise HTTPException(status_code=409, detail="Identity number might be duplicated")

    @staticmethod
    async def submit_application(
        user_id: int,
        db: AsyncSession
    ) -> TeacherRegisterModel:
        app = await TeacherApplicationService._get_owned_application(user_id, db)

        if app.status in [TeacherRegisterStatus.PENDING, TeacherRegisterStatus.APPROVED]:
            raise HTTPException(status_code=409, detail="Application is already submitted or processed")

        try:
            TeacherApplicationSubmitSchema.model_validate(app)
        except ValueError:
            raise HTTPException(status_code=400, detail="Missing required fields for submission")

        app.status = TeacherRegisterStatus.PENDING
        
        history = TeacherRegisterHistoryModel(
            teacher_register_id=app.id,
            status=TeacherRegisterStatus.PENDING,
            reviewed_note="Submitted by teacher",
            acted_by=user_id
        )
        db.add(history)

        try:
            await db.commit()
            await db.refresh(app)
            return app
        except IntegrityError:
            await db.rollback()
            raise HTTPException(status_code=409, detail="Database error occurred during submission")

    @staticmethod
    async def get_applications_for_admin(
        page: int,
        size: int,
        status: TeacherRegisterStatus | None,
        db: AsyncSession
    ) -> TeacherApplicationListResponse:
        stmt = select(TeacherRegisterModel)
        if status:
            stmt = stmt.where(TeacherRegisterModel.status == status)

        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_items = (await db.execute(count_stmt)).scalar() or 0
        total_pages = max(1, (total_items + size - 1) // size)

        stmt = stmt.order_by(TeacherRegisterModel.created_at.desc()).offset((page - 1) * size).limit(size)
        result = await db.execute(stmt)
        apps = result.scalars().all()

        items = []
        for app in apps:
            masked_app = TeacherApplicationListItemView.model_validate(app)
            if masked_app.identity_number and len(masked_app.identity_number) >= 4:
                masked_app.identity_number = "***" + masked_app.identity_number[-4:]
            else:
                masked_app.identity_number = "***"
            
            masked_app.identity_front_url = None
            masked_app.identity_back_url = None
            masked_app.selfie_with_id_url = None
            items.append(masked_app)

        return TeacherApplicationListResponse(
            total_items=total_items,
            total_pages=total_pages,
            current_page=page,
            items=items
        )

    @staticmethod
    async def get_application_detail_for_admin(
        app_id: int,
        admin_id: int,
        db: AsyncSession
    ) -> TeacherRegisterModel:
        stmt = select(TeacherRegisterModel).where(TeacherRegisterModel.id == app_id)
        result = await db.execute(stmt)
        app = result.scalar_one_or_none()
        if not app:
            raise HTTPException(status_code=404, detail="Application not found")

        TeacherApplicationService._write_audit_log(db, {
            "user_id": admin_id,
            "action": AuditAction.TEACHER_APPLICATION_VIEW,
            "target_id": app.id,
            "note": "Viewed teacher application detail"
        })
        
        try:
            await db.commit()
        except IntegrityError:
            await db.rollback()
            raise HTTPException(status_code=500, detail="Database error occurred while recording audit log")

        return app

    @staticmethod
    async def review_application(
        app_id: int,
        admin_id: int,
        data: TeacherApplicationReviewRequest,
        db: AsyncSession
    ) -> TeacherRegisterModel:
        stmt = select(TeacherRegisterModel).where(TeacherRegisterModel.id == app_id)
        result = await db.execute(stmt)
        app = result.scalar_one_or_none()
        if not app:
            raise HTTPException(status_code=404, detail="Application not found")

        if app.status != TeacherRegisterStatus.PENDING:
            raise HTTPException(status_code=409, detail="Application is not in PENDING state")

        app.status = data.status
        if data.note:
            app.reviewed_note = data.note

        history = TeacherRegisterHistoryModel(
            teacher_register_id=app.id,
            status=data.status,
            reviewed_note=data.note,
            acted_by=admin_id
        )
        db.add(history)

        TeacherApplicationService._write_audit_log(db, {
            "user_id": admin_id,
            "action": AuditAction.TEACHER_APPLICATION_REVIEW,
            "target_id": app.id,
            "note": f"Reviewed teacher application: {data.status.value}"
        })

        try:
            await db.commit()
            await db.refresh(app)
            return app
        except IntegrityError:
            await db.rollback()
            raise HTTPException(status_code=409, detail="Database error occurred during review")
