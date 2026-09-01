from fastapi import APIRouter, Depends, HTTPException, Path, Query

from src.middlewares.role_middleware import require_role
from src.models.base_model import ProblemSubmissionStatus, Role
from src.modules.teacher.teacher_course.teacher_course_dependency import (
    get_teacher_course_service,
)
from src.modules.teacher.teacher_course.teacher_course_dto import (
    CourseModerationHistoryResponse,
    SubmissionListResponse,
    TeacherCourseCreateRequest,
    TeacherCourseResponse,
    TeacherCourseUpdateRequest,
)
from src.modules.teacher.teacher_course.teacher_course_service import TeacherCourseService


router = APIRouter(prefix="/courses", tags=["Teacher Course"])


def get_current_teacher_id(user: dict = Depends(require_role(Role.TEACHER))) -> int:
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    return int(user_id)


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


@router.get(
    "/{course_id}/moderation-history",
    response_model=CourseModerationHistoryResponse,
)
async def get_course_moderation_history(
    course_id: int = Path(..., ge=1, title="The ID of the course"),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service),
):
    return await service.get_course_moderation_history(
        teacher_id=teacher_id,
        course_id=course_id,
        page=page,
        size=size,
    )


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


@router.get("/{course_id}/submissions", response_model=SubmissionListResponse)
async def get_course_submissions(
    course_id: int,
    problem_id: int | None = Query(None),
    student_id: int | None = Query(None),
    status: ProblemSubmissionStatus | None = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    user: dict = Depends(require_role(Role.TEACHER)),
    service: TeacherCourseService = Depends(get_teacher_course_service),
):
    teacher_id = user.get("sub")
    if teacher_id is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid credential infotmation",
        )
    return await service.get_course_submissions(
        teacher_id=int(teacher_id),
        course_id=course_id,
        page=page,
        size=size,
        problem_id=problem_id,
        student_id=student_id,
        status=status,
    )
