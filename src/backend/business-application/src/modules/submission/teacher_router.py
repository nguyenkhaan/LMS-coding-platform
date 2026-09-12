from fastapi import APIRouter, Depends, HTTPException, Query

from src.middlewares.role_middleware import require_role
from src.models.base_model import ProblemSubmissionStatus, Role
from src.modules.courses.authoring.dependencies import get_teacher_course_service
from src.modules.courses.authoring.service import TeacherCourseService
from src.modules.submission.teacher_dto import SubmissionListResponse

router = APIRouter(prefix="/teacher/courses", tags=["Teacher Course"])


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
    user_id = user.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401, detail="User ID not found in token")
    teacher_id = int(user_id)
    return await service.get_course_submissions(
        teacher_id=teacher_id,
        course_id=course_id,
        page=page,
        size=size,
        problem_id=problem_id,
        student_id=student_id,
        status=status,
    )
