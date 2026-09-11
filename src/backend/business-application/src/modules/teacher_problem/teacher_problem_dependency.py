from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.db import get_async_db_session
from src.modules.teacher_problem.teacher_problem_service import TeacherProblemService


def get_teacher_problem_service(db: AsyncSession = Depends(get_async_db_session)) -> TeacherProblemService:
    return TeacherProblemService(db)
