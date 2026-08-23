from typing import Annotated

from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.db import get_db_session
from src.middlewares.auth_middleware import get_current_user
from src.modules.lesson_comment.lesson_comment_service import LessonCommentService


def get_lesson_comment_service(
    db_session: Annotated[AsyncSession, Depends(get_db_session)],
) -> LessonCommentService:
    return LessonCommentService(db_session)


def get_current_user_id(
    current_user: Annotated[dict[str, object], Depends(get_current_user)],
) -> int:
    user_id = current_user.get("sub")
    if isinstance(user_id, bool) or not isinstance(user_id, int) or user_id < 1:
        raise HTTPException(
            status_code=401,
            detail="Invalid user id in authorization token",
        )
    return user_id


CurrentUserId = Annotated[int, Depends(get_current_user_id)]
LessonCommentServiceDependency = Annotated[
    LessonCommentService,
    Depends(get_lesson_comment_service),
]
