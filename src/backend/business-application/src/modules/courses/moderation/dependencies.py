from typing import Annotated

from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.db import get_db_session
from src.middlewares.auth_middleware import UserPayload
from src.middlewares.role_middleware import require_role
from src.models.base_model import Role
from src.modules.courses.moderation.service import AdminCourseService


def get_admin_course_service(
    db_session: Annotated[AsyncSession, Depends(get_db_session)],
) -> AdminCourseService:
    return AdminCourseService(db_session)


def get_current_admin_id(
    current_user: Annotated[UserPayload, Depends(require_role(Role.ADMIN))],
) -> int:
    admin_id = current_user.get("sub")
    if isinstance(admin_id, bool) or not isinstance(admin_id, int) or admin_id < 1:
        raise HTTPException(status_code=401, detail="Invalid admin id in token")
    return admin_id


AdminCourseServiceDependency = Annotated[
    AdminCourseService, Depends(get_admin_course_service)
]
CurrentAdminId = Annotated[int, Depends(get_current_admin_id)]
