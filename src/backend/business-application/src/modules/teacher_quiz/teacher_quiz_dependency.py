from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.db import get_async_db_session
from src.modules.teacher_quiz.teacher_quiz_service import TeacherQuizService

def get_teacher_quiz_service(db: AsyncSession = Depends(get_async_db_session)) -> TeacherQuizService:
    return TeacherQuizService(db)
