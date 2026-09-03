from fastapi import HTTPException
from sqlalchemy import delete, func, or_, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import load_only, selectinload

from src.models.audit_log_model import AuditLogModel
from src.models.base_model import (
    AccountStatus,
    AuditAction,
    Role,
    TeacherRegisterStatus,
)
from src.models.role_model import UserRoleModel
from src.models.student_profile_model import StudentProfileModel
from src.models.teacher_profile_model import TeacherProfileModel
from src.models.user_model import UserModel
from src.modules.user.user_dto import (
    AdminUserListQuery,
    AdminUserListResponse,
    AdminUserView,
    StudentProfileView,
    UpdateStudentProfile,
    UpdateTeacherProfile,
    UpdateUserAccountStatus,
    UpdateUserRoles,
    UpdateUserRolesResponse,
    UpdateUserPersonal,
    UserCapabilitiesView,
    UserIdentityMe,
    UserRoleView,
    UserView,
)
class UserService: 
    def __init__(self, db_session : AsyncSession): 
        self.db_session = db_session 

    @staticmethod
    def _to_user_view(user: UserModel) -> UserView:
        return UserView(
            id=user.id,
            full_name=user.full_name,
            address=user.address,
            email=user.email,
            avatar_url=user.avatar_url,
            account_status=user.account_status,
            created_at=user.created_at,
            updated_at=user.updated_at,
        )

    @staticmethod
    def _to_user_role_view(user_role: UserRoleModel) -> UserRoleView:
        return UserRoleView(
            id=user_role.id,
            user_id=user_role.user_id,
            role=user_role.role,
        )

    @staticmethod
    def _get_capabilities(
        roles: list[Role],
        teacher_profile: TeacherProfileModel | None,
    ) -> UserCapabilitiesView:
        can_teach = (
            Role.TEACHER in roles
            and teacher_profile is not None
            and teacher_profile.registration is not None
            and teacher_profile.registration.status == TeacherRegisterStatus.APPROVED
        )
        return UserCapabilitiesView(
            can_learn=Role.STUDENT in roles,
            can_teach=can_teach,
            can_manage_users=Role.ADMIN in roles,
        )

    def _to_admin_user_view(self, user: UserModel) -> AdminUserView:
        roles = [user_role.role for user_role in user.roles]
        return AdminUserView(
            **self._to_user_view(user).model_dump(),
            roles=[self._to_user_role_view(user_role) for user_role in user.roles],
            capabilities=self._get_capabilities(roles, user.teacher_profile),
        )

    async def get_admin_users(self, query: AdminUserListQuery) -> AdminUserListResponse:
        try:
            filters = []
            if query.q and query.q.strip():
                search_term = f"%{query.q.strip()}%"
                filters.append(
                    or_(
                        UserModel.full_name.ilike(search_term),
                        UserModel.email.ilike(search_term),
                    )
                )
            if query.role is not None:
                filters.append(
                    UserModel.roles.any(UserRoleModel.role == query.role)
                )
            if query.account_status is not None:
                filters.append(UserModel.account_status == query.account_status)

            count_stmt = select(func.count(UserModel.id)).where(*filters)
            stmt = (
                select(UserModel)
                .options(
                    selectinload(UserModel.roles),
                    selectinload(UserModel.teacher_profile).selectinload(
                        TeacherProfileModel.registration
                    ),
                )
                .where(*filters)
                .order_by(UserModel.id)
                .offset((query.page - 1) * query.size)
                .limit(query.size)
            )
            total_items = await self.db_session.scalar(count_stmt)
            users = (await self.db_session.execute(stmt)).scalars().all()

            return AdminUserListResponse(
                items=[self._to_admin_user_view(user) for user in users],
                total_items=total_items or 0,
                total_pages=((total_items or 0) + query.size - 1) // query.size,
                current_page=query.page,
            )
        except SQLAlchemyError as e:
            await self.db_session.rollback()
            print("Get admin users error:", e)
            raise HTTPException(
                status_code=503,
                detail="Unable to retrieve users right now",
            ) from e

    async def update_user_account_status(
        self,
        admin_id: int,
        user_id: int,
        data: UpdateUserAccountStatus,
    ) -> UserView:
        try:
            if data.account_status is None:
                raise HTTPException(
                    status_code=400,
                    detail="account_status is required",
                )

            stmt = select(UserModel).where(UserModel.id == user_id).with_for_update()
            user = (await self.db_session.execute(stmt)).scalar_one_or_none()
            if user is None:
                raise HTTPException(status_code=404, detail="User not found")

            previous_status = user.account_status
            user.account_status = data.account_status
            if data.account_status == AccountStatus.BANNED:
                user.refresh_token = None

            self.db_session.add(
                AuditLogModel(
                    user_id=admin_id,
                    action=AuditAction.ACCOUNT_STATUS_UPDATE,
                    target_type="user",
                    target_id=user.id,
                    note=(
                        "Account status changed from "
                        f"{previous_status.value} to {data.account_status.value}"
                    ),
                )
            )
            await self.db_session.flush()
            await self.db_session.commit()
            await self.db_session.refresh(user)
            return self._to_user_view(user)
        except HTTPException:
            await self.db_session.rollback()
            raise
        except SQLAlchemyError as e:
            await self.db_session.rollback()
            print("Update user account status error:", e)
            raise HTTPException(
                status_code=503,
                detail="Unable to update user account status right now",
            ) from e

    async def update_user_roles(
        self,
        admin_id: int,
        user_id: int,
        data: UpdateUserRoles,
    ) -> UpdateUserRolesResponse:
        try:
            if data.roles is None:
                raise HTTPException(status_code=400, detail="roles is required")

            stmt = (
                select(UserModel)
                .options(
                    selectinload(UserModel.roles),
                    selectinload(UserModel.teacher_profile).selectinload(
                        TeacherProfileModel.registration
                    ),
                )
                .where(UserModel.id == user_id)
                .with_for_update()
            )
            user = (await self.db_session.execute(stmt)).scalar_one_or_none()
            if user is None:
                raise HTTPException(status_code=404, detail="User not found")

            previous_roles = {user_role.role for user_role in user.roles}
            requested_roles = set(data.roles)
            if previous_roles == requested_roles:
                return UpdateUserRolesResponse(
                    user_id=user.id,
                    roles=[
                        self._to_user_role_view(user_role)
                        for user_role in user.roles
                    ],
                    capabilities=self._get_capabilities(
                        list(requested_roles), user.teacher_profile
                    ),
                )

            await self.db_session.execute(
                delete(UserRoleModel).where(UserRoleModel.user_id == user.id)
            )
            new_user_roles = [
                UserRoleModel(user_id=user.id, role=role)
                for role in sorted(requested_roles, key=lambda item: item.value)
            ]
            self.db_session.add_all(new_user_roles)
            self.db_session.add(
                AuditLogModel(
                    user_id=admin_id,
                    action=AuditAction.ROLE_UPDATE,
                    target_type="user",
                    target_id=user.id,
                    note=(
                        "Roles changed from "
                        f"{', '.join(sorted(role.value for role in previous_roles))} to "
                        f"{', '.join(role.role.value for role in new_user_roles)}"
                    ),
                )
            )
            await self.db_session.flush()
            await self.db_session.commit()

            return UpdateUserRolesResponse(
                user_id=user.id,
                roles=[
                    self._to_user_role_view(user_role)
                    for user_role in new_user_roles
                ],
                capabilities=self._get_capabilities(
                    [user_role.role for user_role in new_user_roles],
                    user.teacher_profile,
                ),
            )
        except HTTPException:
            await self.db_session.rollback()
            raise
        except SQLAlchemyError as e:
            await self.db_session.rollback()
            print("Update user roles error:", e)
            raise HTTPException(
                status_code=503,
                detail="Unable to update user roles right now",
            ) from e
    async def get_me(self, user_id : int): 
        try: 
            stmt = select(UserModel).options(
                load_only(UserModel.email , UserModel.account_status), 
                selectinload(UserModel.roles)
            ).where(UserModel.id == int(user_id)) 
            user = (await self.db_session.execute(stmt)).scalar_one_or_none() 
            if user is None: 
                raise HTTPException(
                    status_code= 404, 
                    detail = "User not found" 
                ) 
            # print("Address: " , user.address) Error: sqlalchemy.exc.MissingGreenlet: greenlet_spawn has not been called; can't call await_only() here. Was IO attempted in an
            return UserIdentityMe(
                email = user.email, 
                roles = [x.role for x in user.roles], 
                status = user.account_status
            )
        except Exception as e:  
            await self.db_session.rollback() 
            print("Get personal information error: ", e) 
            raise e 
    async def get_user_student_profile(self , user_id : int): 
        try: 
            stmt = select(UserModel).options(
                load_only(UserModel.id , UserModel.address , UserModel.email, UserModel.full_name, UserModel.account_status , UserModel.avatar_url), 
                selectinload(UserModel.student_profile)
            ).where(
                UserModel.id == user_id 
            ) 
            student = (await self.db_session.execute(stmt)).scalar_one_or_none() 
            if student is None or student.student_profile is None: 
                raise HTTPException(
                    status_code = 404, 
                    detail = "User not found"
                )
            profile = student.student_profile
            return StudentProfileView(
                id = student.id, 
                full_name = student.full_name, 
                address = student.address, 
                email = student.email, 
                status = student.account_status, 
                avatar_url = student.avatar_url, 
                bio = profile.bio, 
                learning_preferences = profile.learning_preferences,  
                social_links = profile.social_links
            )
        except Exception as e: 
            print("Get student's information error: ", e) 
            raise e 

    async def update_personal_information(
        self,
        user_id: int,
        data: UpdateUserPersonal,
    ):
        try:
            update_data = data.model_dump(exclude_none=True)
            if not update_data:
                raise HTTPException(
                    status_code=400,
                    detail="At least one personal information field is required",
                )

            stmt = select(UserModel).options(
                load_only(
                    UserModel.id,
                    UserModel.full_name,
                    UserModel.address,
                    UserModel.avatar_url,
                )
            ).where(UserModel.id == user_id)
            user = (await self.db_session.execute(stmt)).scalar_one_or_none()
            if user is None:
                raise HTTPException(
                    status_code=404,
                    detail="User not found",
                )

            for field, value in update_data.items():
                setattr(user, field, value)

            await self.db_session.flush()
            await self.db_session.commit()
            await self.db_session.refresh(user)

            return {
                "message": "Personal information updated successfully",
                "data": {
                    "full_name": user.full_name,
                    "address": user.address,
                    "avatar_url": user.avatar_url,
                },
            }
        except HTTPException:
            await self.db_session.rollback()
            raise
        except SQLAlchemyError as e:
            await self.db_session.rollback()
            print("Update personal information error:", e)
            raise HTTPException(
                status_code=503,
                detail="Unable to update personal information right now",
            ) from e

    async def update_student_profile(
        self,
        user_id: int,
        data: UpdateStudentProfile,
    ):
        try:
            update_data = data.model_dump(exclude_none=True)
            if not update_data:
                raise HTTPException(
                    status_code=400,
                    detail="At least one student profile field is required",
                )

            stmt = select(StudentProfileModel).where(
                StudentProfileModel.user_id == user_id
            )
            profile = (await self.db_session.execute(stmt)).scalar_one_or_none()
            if profile is None:
                raise HTTPException(
                    status_code=404,
                    detail="Student profile not found",
                )

            for field, value in update_data.items():
                setattr(profile, field, value)

            await self.db_session.flush()
            await self.db_session.commit()
            await self.db_session.refresh(profile)

            return {
                "message": "Student profile updated successfully",
                "data": {
                    "bio": profile.bio,
                    "learning_preferences": profile.learning_preferences,
                    "social_links": profile.social_links,
                },
            }
        except HTTPException:
            await self.db_session.rollback()
            raise
        except SQLAlchemyError as e:
            await self.db_session.rollback()
            print("Update student profile error:", e)
            raise HTTPException(
                status_code=503,
                detail="Unable to update student profile right now",
            ) from e

    async def update_teacher_profile(
        self,
        user_id: int,
        data: UpdateTeacherProfile,
    ):
        try:
            update_data = data.model_dump(exclude_none=True)
            if not update_data:
                raise HTTPException(
                    status_code=400,
                    detail="At least one teacher profile field is required",
                )

            stmt = select(TeacherProfileModel).options(
                selectinload(TeacherProfileModel.registration)
            ).where(TeacherProfileModel.user_id == user_id)
            profile = (await self.db_session.execute(stmt)).scalar_one_or_none()
            if profile is None:
                raise HTTPException(
                    status_code=404,
                    detail="Teacher profile not found",
                )
            if (
                profile.registration is not None
                and profile.registration.status == TeacherRegisterStatus.PENDING
            ):
                raise HTTPException(
                    status_code=409,
                    detail="Teacher profile cannot be updated while registration is pending",
                )

            for field, value in update_data.items():
                setattr(profile, field, value)

            await self.db_session.flush()
            await self.db_session.commit()
            await self.db_session.refresh(profile)

            return {
                "message": "Teacher profile updated successfully",
                "data": {
                    "avatar_url": profile.avatar_url,
                    "headline": profile.headline,
                    "expertise_tags": profile.expertise_tags,
                    "years_of_experience": profile.years_of_experience,
                    "education_entries": profile.education_entries,
                    "experience_entries": profile.experience_entries,
                    "github_url": profile.github_url,
                    "linkedin_url": profile.linkedin_url,
                    "website_url": profile.website_url,
                    "email": profile.email,
                    "phone": profile.phone,
                },
            }
        except HTTPException:
            await self.db_session.rollback()
            raise
        except SQLAlchemyError as e:
            await self.db_session.rollback()
            print("Update teacher profile error:", e)
            raise HTTPException(
                status_code=503,
                detail="Unable to update teacher profile right now",
            ) from e
