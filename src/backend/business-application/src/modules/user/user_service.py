from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import load_only, selectinload

from src.models.user_model import UserModel
from src.modules.user.user_dto import (
    StudentProfileView,
    UpdateUserPersonal,
    UserIdentityMe,
)
class UserService: 
    def __init__(self, db_session : AsyncSession): 
        self.db_session = db_session 
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
