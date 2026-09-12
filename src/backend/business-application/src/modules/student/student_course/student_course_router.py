# Thuc hien testing 3 API nay - Test Student 123
from typing import Annotated

from fastapi import APIRouter, Path, Query

from src.modules.student.student_course.student_course_dependency import (
    CurrentStudentId,
    StudentCourseServiceDependency,
)
from src.modules.student.student_course.student_course_dto import (
    CompleteReadingResponse,
    CourseStudyResponse,
    ProgressListResponse,
    StudentCourseListResponse,
)


router = APIRouter(tags=["Student Course"])


@router.get("/courses", response_model=StudentCourseListResponse)
async def list_student_courses(
    student_id: CurrentStudentId,
    student_course_service: StudentCourseServiceDependency,
    page: Annotated[int, Query(ge=1)] = 1,
    size: Annotated[int, Query(ge=1, le=100)] = 20,
    status_filter: Annotated[str | None, Query(alias="status", max_length=50)] = None,
) -> StudentCourseListResponse:
    return await student_course_service.list_courses(
        student_id=student_id,
        page=page,
        size=size,
        status_filter=status_filter,
    )


@router.get("/courses/{slug}/study", response_model=CourseStudyResponse)
async def get_student_course_study(
    slug: Annotated[str, Path(min_length=1, max_length=255)],
    student_id: CurrentStudentId,
    student_course_service: StudentCourseServiceDependency,
) -> CourseStudyResponse:
    return await student_course_service.get_course_study(
        student_id=student_id,
        slug=slug,
    )


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
