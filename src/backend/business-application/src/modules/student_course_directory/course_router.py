from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path

from src.middlewares.auth_middleware import get_current_user
from src.modules.student_course_directory.course_dependency import get_course_service
from src.modules.student_course_directory.course_dto import (
    EnrollResponse,
    UnenrollResponse,
)
from src.modules.student_course_directory.course_service import CourseService

router = APIRouter(
    prefix="/courses",
    tags=["Student Course Directory"],
)

# ---------------------------------------------------------------------------
# POST /courses/{slug}/enroll  (auth required → 201)
# ---------------------------------------------------------------------------
@router.post("/{slug}/enroll", response_model=EnrollResponse, status_code=201)
async def enroll_course(
    slug: Annotated[str, Path()],
    user: dict = Depends(get_current_user),
    service: CourseService = Depends(get_course_service),
) -> EnrollResponse:
    user_id: int | None = user.get("sub", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user id in authorization token")
    return await service.enroll_course(slug, user_id)


# ---------------------------------------------------------------------------
# POST /courses/{slug}/unenroll  (auth required → 200)
# ---------------------------------------------------------------------------
@router.post("/{slug}/unenroll", response_model=UnenrollResponse, status_code=200)
async def unenroll_course(
    slug: Annotated[str, Path()],
    user: dict = Depends(get_current_user),
    service: CourseService = Depends(get_course_service),
) -> UnenrollResponse:
    user_id: int | None = user.get("sub", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user id in authorization token")
    return await service.unenroll_course(slug, user_id)
