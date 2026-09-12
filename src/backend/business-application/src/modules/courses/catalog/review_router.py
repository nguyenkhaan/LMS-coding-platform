from fastapi import APIRouter, Depends, Query

from src.middlewares.auth_middleware import UserPayload
from src.modules.courses.catalog.dependencies import (
    get_course_directory_service,
    get_current_student,
)
from src.modules.courses.catalog.dto import (
    CourseReviewPatch,
    CourseReviewView,
    CourseReviewWrite,
    MutationResponse,
    ReviewListResponse,
)
from src.modules.courses.catalog.service import CourseDirectoryService

router = APIRouter(tags=["Course Directory"])


@router.get("/courses/{course_id}/reviews", response_model=ReviewListResponse)
async def list_reviews(
    course_id: int,
    rating: int | None = Query(None, ge=1, le=5),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    service: CourseDirectoryService = Depends(get_course_directory_service),
):
    return await service.list_reviews(course_id, rating, page, size)


@router.post(
    "/courses/{course_id}/reviews",
    response_model=MutationResponse[CourseReviewView],
)
async def add_review(
    course_id: int,
    payload: CourseReviewWrite,
    user: UserPayload = Depends(get_current_student),
    service: CourseDirectoryService = Depends(get_course_directory_service),
):
    return {
        "data": await service.add_review(course_id, user["sub"], payload),
        "message": "Review saved",
    }


@router.patch(
    "/courses/{course_id}/reviews/{review_id}",
    response_model=MutationResponse[CourseReviewView],
)
async def update_review(
    course_id: int,
    review_id: int,
    payload: CourseReviewPatch,
    user: UserPayload = Depends(get_current_student),
    service: CourseDirectoryService = Depends(get_course_directory_service),
):
    return {
        "data": await service.update_review(course_id, review_id, user["sub"], payload),
        "message": "Review updated",
    }
