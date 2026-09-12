from typing import Annotated

from fastapi import APIRouter, Path, Query

from src.modules.courses.learning.dependencies import (
    CurrentStudentId,
    StudentCourseServiceDependency,
)
from src.modules.courses.learning.dto import (
    CompleteReadingResponse,
    ProgressListResponse,
)

router = APIRouter(prefix="/student", tags=["Student Course"])


@router.post(
    "/progress/lesson-contents/{lesson_content_id}/complete",
    response_model=CompleteReadingResponse,
)
async def complete_reading_content(
    lesson_content_id: Annotated[int, Path(ge=1)],
    student_id: CurrentStudentId,
    student_course_service: StudentCourseServiceDependency,
) -> CompleteReadingResponse:
    return await student_course_service.complete_reading(
        student_id=student_id,
        lesson_content_id=lesson_content_id,
    )


@router.get("/progress", response_model=ProgressListResponse)
async def list_student_progress(
    student_id: CurrentStudentId,
    student_course_service: StudentCourseServiceDependency,
    course_id: Annotated[int | None, Query(ge=1)] = None,
    page: Annotated[int, Query(ge=1)] = 1,
    size: Annotated[int, Query(ge=1, le=100)] = 20,
) -> ProgressListResponse:
    return await student_course_service.list_progress(
        student_id=student_id,
        course_id=course_id,
        page=page,
        size=size,
    )
