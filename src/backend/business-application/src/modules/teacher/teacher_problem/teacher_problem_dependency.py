from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.services.minio.minio_dependency import get_minio_handler
from src.services.minio.minio_handler import MinioHandler
from src.db import get_async_db_session
from src.modules.teacher.teacher_problem.teacher_problem_service import TeacherProblemService


def get_teacher_problem_service(db: AsyncSession = Depends(get_async_db_session) , minio_handler : MinioHandler = Depends(get_minio_handler)) -> TeacherProblemService:
    return TeacherProblemService(db , minio_handler)
