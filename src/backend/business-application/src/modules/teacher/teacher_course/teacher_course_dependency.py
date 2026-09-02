from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.db import get_async_db_session
from src.modules.teacher.teacher_course.teacher_course_service import TeacherCourseService


def get_teacher_course_service(db: AsyncSession = Depends(get_async_db_session)) -> TeacherCourseService:
    return TeacherCourseService(db=db)
