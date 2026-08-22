from typing import Annotated
from fastapi import APIRouter, Depends, Query, Path
from src.modules.student_course_directory.course_dependency import get_course_service
from src.modules.student_course_directory.course_service import CourseService
from src.modules.student_course_directory.course_dto import InstructorCatalogResponse, InstructorDetailResponse

router = APIRouter(
    prefix="/instructors",
    tags=["Student Course Directory"],
)

@router.get("", response_model=InstructorCatalogResponse, status_code=200)
async def get_instructor_catalog(
    page: Annotated[int, Query(ge=1)] = 1,
    size: Annotated[int, Query(ge=1, le=100)] = 10,
    q: Annotated[str | None, Query()] = None,
    service: CourseService = Depends(get_course_service),
) -> InstructorCatalogResponse:
    return await service.get_instructor_catalog(page, size, q)

@router.get("/{user_id}", response_model=InstructorDetailResponse, status_code=200)
async def get_instructor_detail(
    user_id: Annotated[int, Path()],
    service: CourseService = Depends(get_course_service),
) -> InstructorDetailResponse:
    return await service.get_instructor_detail(user_id)
