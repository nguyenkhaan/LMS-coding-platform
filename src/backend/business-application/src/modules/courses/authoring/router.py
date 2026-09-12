from fastapi import APIRouter, Depends, Path

from src.modules.courses.authoring.dependencies import (
    get_current_teacher_id,
    get_teacher_course_service,
)
from src.modules.courses.authoring.dto import (
    TeacherCourseCreateRequest,
    TeacherCourseResponse,
    TeacherCourseUpdateRequest,
)
from src.modules.courses.authoring.service import TeacherCourseService

router = APIRouter(prefix="/teacher/courses", tags=["Teacher Course"])


@router.get("", response_model=list[TeacherCourseResponse])
async def get_teacher_courses(
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service),
):
    return await service.get_teacher_courses(teacher_id)


@router.get("/{course_id}", response_model=TeacherCourseResponse)
async def get_course_detail(
    course_id: int = Path(..., title="The ID of the course"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service),
):
    return await service.get_course_detail(teacher_id, course_id)


@router.post("", response_model=TeacherCourseResponse, status_code=201)
async def create_course(
    data: TeacherCourseCreateRequest,
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service),
):
    return await service.create_course(teacher_id, data)


@router.put("/{course_id}", response_model=TeacherCourseResponse)
async def update_course(
    data: TeacherCourseUpdateRequest,
    course_id: int = Path(..., title="The ID of the course"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service),
):
    return await service.update_course(teacher_id, course_id, data)


@router.post("/{course_id}/submit-review", response_model=TeacherCourseResponse)
async def submit_course_review(
    course_id: int = Path(..., title="The ID of the course"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service),
):
    return await service.submit_course_review(teacher_id, course_id)
