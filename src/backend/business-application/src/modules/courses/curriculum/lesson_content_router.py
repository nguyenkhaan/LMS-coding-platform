from fastapi import APIRouter, Depends, Path

from src.modules.courses.authoring.dependencies import (
    get_current_teacher_id,
    get_teacher_course_service,
)
from src.modules.courses.authoring.dto import (
    TeacherCourseDeleteResponse,
    TeacherCourseLessonContentCreateRequest,
    TeacherCourseLessonContentResponse,
    TeacherCourseLessonContentUpdateRequest,
    TeacherCourseReadingResponse,
    TeacherCourseReadingUpdateRequest,
)
from src.modules.courses.authoring.service import TeacherCourseService

lesson_router = APIRouter(prefix="/teacher/lessons", tags=["Teacher Lesson"])
router = APIRouter(prefix="/teacher/lesson-contents", tags=["Teacher Lesson Content"])


@lesson_router.post(
    "/{lesson_id}/contents",
    response_model=TeacherCourseLessonContentResponse,
    status_code=201,
)
async def create_lesson_content(
    data: TeacherCourseLessonContentCreateRequest,
    lesson_id: int = Path(..., title="The ID of the lesson"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service),
):
    return await service.create_lesson_content(teacher_id, lesson_id, data)


@router.put("/{content_id}", response_model=TeacherCourseLessonContentResponse)
async def update_lesson_content(
    data: TeacherCourseLessonContentUpdateRequest,
    content_id: int = Path(..., title="The ID of the lesson content"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service),
):
    return await service.update_lesson_content(teacher_id, content_id, data)


@router.put("/{content_id}/reading", response_model=TeacherCourseReadingResponse)
async def update_reading_content(
    data: TeacherCourseReadingUpdateRequest,
    content_id: int = Path(..., title="The ID of the lesson content"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service),
):
    return await service.update_reading_content(teacher_id, content_id, data)


@router.delete("/{content_id}", response_model=TeacherCourseDeleteResponse)
async def delete_lesson_content(
    content_id: int = Path(..., title="The ID of the lesson content"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service),
):
    return await service.delete_lesson_content(teacher_id, content_id)
