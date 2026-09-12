from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.db import get_async_db_session
from src.middlewares.role_middleware import require_role
from src.models.base_model import Role
from src.modules.courses.authoring.service import TeacherCourseService


def get_teacher_course_service(
    db: AsyncSession = Depends(get_async_db_session),
) -> TeacherCourseService:
    return TeacherCourseService(db=db)


def get_current_teacher_id(
    user: dict = Depends(require_role(Role.TEACHER)),
) -> int:
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return int(user_id)
