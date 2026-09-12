from fastapi import APIRouter, Depends, Path

from src.modules.courses.authoring.dependencies import (
    get_current_teacher_id,
    get_teacher_course_service,
)
from src.modules.courses.authoring.dto import (
    TeacherCourseReorderRequest,
    TeacherCourseReorderResponse,
)
from src.modules.courses.authoring.service import TeacherCourseService

router = APIRouter(prefix="/teacher/courses", tags=["Teacher Course"])


@router.put(
    "/{course_id}/curriculum/reorder", response_model=TeacherCourseReorderResponse
)
async def reorder_curriculum(
    data: TeacherCourseReorderRequest,
    course_id: int = Path(..., title="The ID of the course"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service),
):
    return await service.reorder_curriculum(teacher_id, course_id, data)
