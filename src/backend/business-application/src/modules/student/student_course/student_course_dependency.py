from typing import Annotated

from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.db import get_db_session
from src.middlewares.auth_middleware import UserPayload
from src.middlewares.role_middleware import require_role
from src.models.base_model import Role
from src.modules.student.student_course.student_course_service import StudentService


def get_student_course_service(
    db_session: Annotated[AsyncSession, Depends(get_db_session)],
) -> StudentService:
    return StudentService(db_session)


def get_current_student_id(
    current_user: Annotated[UserPayload, Depends(require_role(Role.STUDENT))],
) -> int:
    user_id = current_user.get("sub")
    if isinstance(user_id, bool) or not isinstance(user_id, int) or user_id < 1:
        raise HTTPException(status_code=401, detail="Invalid student id in token")
    return user_id


CurrentStudentId = Annotated[int, Depends(get_current_student_id)]
StudentCourseServiceDependency = Annotated[
    StudentService,
    Depends(get_student_course_service),
]
