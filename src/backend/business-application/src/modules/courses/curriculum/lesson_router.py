from fastapi import APIRouter, Depends, Path

from src.modules.courses.authoring.dependencies import (
    get_current_teacher_id,
    get_teacher_course_service,
)
from src.modules.courses.authoring.dto import (
    TeacherCourseDeleteResponse,
    TeacherCourseLessonCreateRequest,
    TeacherCourseLessonResponse,
    TeacherCourseLessonUpdateRequest,
    TeacherCourseReadingCreateRequest,
    TeacherCourseReadingCreateResponse,
)
from src.modules.courses.authoring.service import TeacherCourseService

section_router = APIRouter(prefix="/teacher/sections", tags=["Teacher Section"])
router = APIRouter(prefix="/teacher/lessons", tags=["Teacher Lesson"])


@section_router.post(
    "/{section_id}/lessons", response_model=TeacherCourseLessonResponse, status_code=201
)
async def create_lesson(
    data: TeacherCourseLessonCreateRequest,
    section_id: int = Path(..., title="The ID of the section"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service),
):
    return await service.create_lesson(teacher_id, section_id, data)


@router.put("/{lesson_id}", response_model=TeacherCourseLessonResponse)
async def update_lesson(
    data: TeacherCourseLessonUpdateRequest,
    lesson_id: int = Path(..., title="The ID of the lesson"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service),
):
    return await service.update_lesson(teacher_id, lesson_id, data)


@router.delete("/{lesson_id}", response_model=TeacherCourseDeleteResponse)
async def delete_lesson(
    lesson_id: int = Path(..., title="The ID of the lesson"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service),
):
    return await service.delete_lesson(teacher_id, lesson_id)


@router.post(
    "/{lesson_id}/readings",
    response_model=TeacherCourseReadingCreateResponse,
    status_code=201,
)
async def create_reading_content(
    data: TeacherCourseReadingCreateRequest,
    lesson_id: int = Path(..., title="The ID of the lesson"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service),
):
    return await service.create_reading_content(teacher_id, lesson_id, data)
