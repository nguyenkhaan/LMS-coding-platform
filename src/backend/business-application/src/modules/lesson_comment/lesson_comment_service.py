from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.models.base_model import Role
from src.models.role_model import UserRoleModel
from src.models.user_model import UserModel
from src.models.comment_model import CommentModel
from src.models.lesson_content_model import LessonContentModel
from src.modules.lesson_comment.lesson_comment_dto import CreateLessonContentCommentRequest, CreateLessonContentCommentResponse, DeleteLessonContentCommentResponse, GetLessonContentCommentResponse

class LessonContentCommentService: 
    def __init__(self , db_session: AsyncSession): 
        self.db_session = db_session 
    async def getLessonContentComments(self  , lesson_content_id : int , limit : int , offset : int): 
        try: 
            result = await self.db_session.execute(
                select(
                    CommentModel
                )
                .options(selectinload(CommentModel.replies))
                .where(CommentModel.lesson_content_id == lesson_content_id) 
                .where(CommentModel.parent_id.is_(None))
                
                .limit(limit)
                .offset(offset) 
                .order_by(CommentModel.created_at.desc())
            )
            comments = result.scalars().all() 
            response = [
                GetLessonContentCommentResponse.model_validate(comment) 
                for comment in comments 
            ]
            return response 
        except Exception: 
            await self.db_session.rollback() 
            raise 
    async def createLessonContentComment(self , user_id : int , lesson_content_id : int , data : CreateLessonContentCommentRequest): 
        try: 
            lesson_content = await self.db_session.scalar(
                select(LessonContentModel).where(LessonContentModel.id == lesson_content_id)
            )
            if lesson_content is None:
                raise HTTPException(
                    status_code=404,
                    detail="Lesson content not found",
                )

            if data.parent_id is not None: 
                parent_comment = await self.db_session.scalar(
                    select(CommentModel).where(CommentModel.id == data.parent_id)
                )
                if parent_comment is None: 
                    raise HTTPException(
                        status_code = 404, 
                        detail = "Parent comment not found"
                    )
                if parent_comment.lesson_content_id != lesson_content_id:
                    raise HTTPException(
                        status_code=400,
                        detail="Parent comment does not belong to this lesson content",
                    )

            content = data.content.strip()
            if not content:
                raise HTTPException(
                    status_code=400,
                    detail="Comment content cannot be empty",
                )

            comment = CommentModel(
                user_id = user_id, 
                lesson_content_id = lesson_content_id, 
                content = content[:3000], 
                parent_id = data.parent_id
            )
            self.db_session.add(comment) 
            await self.db_session.flush() 
            await self.db_session.refresh(comment) 
            await self.db_session.commit() 
            return CreateLessonContentCommentResponse(
                id = comment.id, 
                user_id = user_id, 
                parent_id = data.parent_id,  
                lesson_content_id=comment.lesson_content_id, 
                content = comment.content,
                created_at = comment.created_at, 
                updated_at = comment.updated_at, 
                
            )
        except Exception: 
            await self.db_session.rollback() 
            raise 
    async def deleteLessonContentComment(self , user_id : int , comment_id : int): 
        try: 
            user = await self.db_session.scalar(
                select(UserModel)
                .where(UserModel.id == user_id)
            ) 
            if not(user): 
                raise HTTPException(
                    status_code = 404, 
                    detail="User not found"
                ) 
            comment = await self.db_session.scalar(
                select(CommentModel).where(
                    CommentModel.id == comment_id
                )
            )
            if comment is None:
                raise HTTPException(
                    status_code=404,
                    detail="Comment not found",
                )

            is_admin = await self.db_session.scalar(
                select(UserRoleModel.id)
                .where(
                    UserRoleModel.user_id == user_id,
                    UserRoleModel.role == Role.ADMIN,
                )
                .limit(1)
            )
            if not (is_admin or (comment.user_id == user_id)): 
                raise HTTPException(
                    status_code = 403, 
                    detail = "You cannot delete this resource" 
                ) 
            await self.db_session.delete(comment) 
            await self.db_session.commit() 
            return DeleteLessonContentCommentResponse() 
        except Exception: 
            await self.db_session.rollback() 
            raise 
"""
.scalar()
    ↓
Get the first scalar from the result. It also automatically execute the 
first scalar of each row -> Return the model directly 

.scalars()
    ↓
Get the first scalar of each row 
    ↓
.first() / .all() / .one()...
"""
