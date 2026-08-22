from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Query
from src.middlewares.auth_middleware import get_current_user
from src.middlewares.role_middleware import require_role
from src.models.base_model import Role
from src.modules.student_course_directory.course_dependency import get_course_service
from src.modules.student_course_directory.course_dto import CourseFavoriteListResponse
from src.modules.student_course_directory.course_service import CourseService

router = APIRouter(
    prefix="/favorites",
    tags=["Course Favorites"],
)

def _extract_user_id(user: dict) -> int:
    user_id: int | None = user.get("sub", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user id in authorization token")
    return user_id

@router.get("", response_model=CourseFavoriteListResponse, status_code=200)
async def get_favorite_courses(
    page: Annotated[int, Query(ge=1)] = 1,
    size: Annotated[int, Query(ge=1, le=100)] = 10,
    user: dict = Depends(require_role(Role.STUDENT)),
    service: CourseService = Depends(get_course_service),
) -> CourseFavoriteListResponse:
    user_id = _extract_user_id(user)
    return await service.get_favorite_courses(user_id, page, size)
