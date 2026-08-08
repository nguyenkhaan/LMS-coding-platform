from fastapi import APIRouter, Depends, HTTPException, Path
from typing import List
from src.middlewares.auth_middleware import get_current_user
from src.modules.course.course_dto import (
    CourseCreateRequest, CourseUpdateRequest, CourseResponse,
    SectionCreateRequest, SectionUpdateRequest, SectionResponse,
    LessonCreateRequest, LessonUpdateRequest, LessonResponse,
    LessonContentCreateRequest, LessonContentUpdateRequest, LessonContentResponse,
    ReorderCurriculumRequest, ReorderResponse, DeleteResponse
)
from src.modules.course.course_dependency import get_course_service
from src.modules.course.course_service import CourseService

router = APIRouter(
    prefix="/teacher/courses",
    tags=["Teacher Course"]
)

section_router = APIRouter(
    prefix="/teacher/sections",
    tags=["Teacher Section"]
)

lesson_router = APIRouter(
    prefix="/teacher/lessons",
    tags=["Teacher Lesson"]
)

lesson_content_router = APIRouter(
    prefix="/teacher/lesson-contents",
    tags=["Teacher Lesson Content"]
)

def get_teacher_id(user: dict = Depends(get_current_user)) -> int:
    # Check if user is logged in
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    # In a real app we'd also check if user has 'teacher' role
    return int(user_id)

@router.get("", response_model=List[CourseResponse])
async def get_teacher_courses(
    teacher_id: int = Depends(get_teacher_id),
    service: CourseService = Depends(get_course_service)
):
    return await service.get_teacher_courses(teacher_id)

@router.post("", response_model=CourseResponse, status_code=201)
async def create_course(
    data: CourseCreateRequest,
    teacher_id: int = Depends(get_teacher_id),
    service: CourseService = Depends(get_course_service)
):
    return await service.create_course(teacher_id, data)

@router.put("/{course_id}", response_model=CourseResponse)
async def update_course(
    data: CourseUpdateRequest,
    course_id: int = Path(..., title="The ID of the course"),
    teacher_id: int = Depends(get_teacher_id),
    service: CourseService = Depends(get_course_service)
):
    return await service.update_course(teacher_id, course_id, data)

@router.post("/{course_id}/sections", response_model=SectionResponse, status_code=201)
async def create_section(
    data: SectionCreateRequest,
    course_id: int = Path(..., title="The ID of the course"),
    teacher_id: int = Depends(get_teacher_id),
    service: CourseService = Depends(get_course_service)
):
    return await service.create_section(teacher_id, course_id, data)

@section_router.put("/{section_id}", response_model=SectionResponse)
async def update_section(
    data: SectionUpdateRequest,
    section_id: int = Path(..., title="The ID of the section"),
    teacher_id: int = Depends(get_teacher_id),
    service: CourseService = Depends(get_course_service)
):
    return await service.update_section(teacher_id, section_id, data)

@section_router.delete("/{section_id}", response_model=DeleteResponse)
async def delete_section(
    section_id: int = Path(..., title="The ID of the section"),
    teacher_id: int = Depends(get_teacher_id),
    service: CourseService = Depends(get_course_service)
):
    return await service.delete_section(teacher_id, section_id)

@section_router.post("/{section_id}/lessons", response_model=LessonResponse, status_code=201)
async def create_lesson(
    data: LessonCreateRequest,
    section_id: int = Path(..., title="The ID of the section"),
    teacher_id: int = Depends(get_teacher_id),
    service: CourseService = Depends(get_course_service)
):
    return await service.create_lesson(teacher_id, section_id, data)

@lesson_router.put("/{lesson_id}", response_model=LessonResponse)
async def update_lesson(
    data: LessonUpdateRequest,
    lesson_id: int = Path(..., title="The ID of the lesson"),
    teacher_id: int = Depends(get_teacher_id),
    service: CourseService = Depends(get_course_service)
):
    return await service.update_lesson(teacher_id, lesson_id, data)

@lesson_router.post("/{lesson_id}/contents", response_model=LessonContentResponse, status_code=201)
async def create_lesson_content(
    data: LessonContentCreateRequest,
    lesson_id: int = Path(..., title="The ID of the lesson"),
    teacher_id: int = Depends(get_teacher_id),
    service: CourseService = Depends(get_course_service)
):
    return await service.create_lesson_content(teacher_id, lesson_id, data)

@lesson_content_router.put("/{content_id}", response_model=LessonContentResponse)
async def update_lesson_content(
    data: LessonContentUpdateRequest,
    content_id: int = Path(..., title="The ID of the content"),
    teacher_id: int = Depends(get_teacher_id),
    service: CourseService = Depends(get_course_service)
):
    return await service.update_lesson_content(teacher_id, content_id, data)

@router.put("/{course_id}/curriculum/reorder", response_model=ReorderResponse)
async def reorder_curriculum(
    data: ReorderCurriculumRequest,
    course_id: int = Path(..., title="The ID of the course"),
    teacher_id: int = Depends(get_teacher_id),
    service: CourseService = Depends(get_course_service)
):
    return await service.reorder_curriculum(teacher_id, course_id, data)
