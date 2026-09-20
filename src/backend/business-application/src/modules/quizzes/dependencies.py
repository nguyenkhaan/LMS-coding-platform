from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.db import get_async_db_session
from src.modules.quizzes.service import TeacherQuizService


def get_teacher_quiz_service(
    db: AsyncSession = Depends(get_async_db_session),
) -> TeacherQuizService:
    return TeacherQuizService(db)

async def get_student_quiz_service(db=Depends(get_async_db_session)):
    from src.modules.quizzes.service import StudentQuizService
    return StudentQuizService(db)
