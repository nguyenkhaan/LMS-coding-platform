from fastapi import APIRouter, Depends, Query

from src.middlewares.auth_middleware import UserPayload
from src.modules.courses.catalog.dependencies import (
    get_course_directory_service,
    get_current_student,
)
from src.modules.courses.catalog.dto import (
    CourseFavoriteView,
    FavoriteListResponse,
    FavoriteRemovalView,
    MutationResponse,
)
from src.modules.courses.catalog.service import CourseDirectoryService

router = APIRouter(tags=["Course Directory"])


@router.get("/favorites", response_model=FavoriteListResponse)
async def list_favorites(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    user: UserPayload = Depends(get_current_student),
    service: CourseDirectoryService = Depends(get_course_directory_service),
):
    return await service.list_favorites(user["sub"], page, size)


@router.put(
    "/courses/{course_id}/favorite",
    response_model=MutationResponse[CourseFavoriteView],
)
async def add_favorite(
    course_id: int,
    user: UserPayload = Depends(get_current_student),
    service: CourseDirectoryService = Depends(get_course_directory_service),
):
    return {
        "data": await service.add_favorite(user["sub"], course_id),
        "message": "Course favorited",
    }


@router.delete(
    "/courses/{course_id}/favorite",
    response_model=MutationResponse[FavoriteRemovalView],
)
async def remove_favorite(
    course_id: int,
    user: UserPayload = Depends(get_current_student),
    service: CourseDirectoryService = Depends(get_course_directory_service),
):
    return {
        "data": await service.remove_favorite(user["sub"], course_id),
        "message": "Favorite removed",
    }
