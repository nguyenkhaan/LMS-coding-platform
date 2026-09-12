from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from src.db import get_async_db_session
from src.middlewares.auth_middleware import UserPayload, get_current_user
from src.models.base_model import Role
from src.modules.courses.catalog.service import CourseDirectoryService

optional_bearer = HTTPBearer(auto_error=False)


async def get_course_directory_service(
    db: AsyncSession = Depends(get_async_db_session),
) -> CourseDirectoryService:
    return CourseDirectoryService(db)


async def get_current_student(
    user: UserPayload = Depends(get_current_user),
) -> UserPayload:
    if Role.STUDENT not in user.get("roles", []):
        raise HTTPException(403, "Student role required")
    return user


async def get_optional_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(optional_bearer),
) -> UserPayload | None:
    return None if credentials is None else await get_current_user(credentials)
