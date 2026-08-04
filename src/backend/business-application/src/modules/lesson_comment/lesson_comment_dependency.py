from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.modules.lesson_comment.lesson_comment_service import LessonContentCommentService
from src.db import get_db_session


def get_lesson_content_comment_service(
    db_session : AsyncSession = Depends(get_db_session)
): 
    return LessonContentCommentService(db_session)