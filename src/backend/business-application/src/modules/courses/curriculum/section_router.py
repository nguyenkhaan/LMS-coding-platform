from fastapi import APIRouter, Depends, Path

from src.modules.courses.authoring.dependencies import (
    get_current_teacher_id,
    get_teacher_course_service,
)
from src.modules.courses.authoring.dto import (
    TeacherCourseDeleteResponse,
    TeacherCourseSectionCreateRequest,
    TeacherCourseSectionResponse,
    TeacherCourseSectionUpdateRequest,
)
from src.modules.courses.authoring.service import TeacherCourseService

course_router = APIRouter(prefix="/teacher/courses", tags=["Teacher Course"])
router = APIRouter(prefix="/teacher/sections", tags=["Teacher Section"])


@course_router.post(
    "/{course_id}/sections",
    response_model=TeacherCourseSectionResponse,
    status_code=201,
)
async def create_section(
    data: TeacherCourseSectionCreateRequest,
    course_id: int = Path(..., title="The ID of the course"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service),
):
    return await service.create_section(teacher_id, course_id, data)


@router.put("/{section_id}", response_model=TeacherCourseSectionResponse)
async def update_section(
    data: TeacherCourseSectionUpdateRequest,
    section_id: int = Path(..., title="The ID of the section"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service),
):
    return await service.update_section(teacher_id, section_id, data)


@router.delete("/{section_id}", response_model=TeacherCourseDeleteResponse)
async def delete_section(
    section_id: int = Path(..., title="The ID of the section"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service),
):
    return await service.delete_section(teacher_id, section_id)
