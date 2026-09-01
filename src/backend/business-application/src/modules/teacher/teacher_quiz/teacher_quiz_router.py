from fastapi import APIRouter, Depends, HTTPException, Path

from src.middlewares.role_middleware import require_role
from src.models.base_model import Role
from src.modules.teacher.teacher_course.teacher_course_dto import (
    TeacherCourseQuizCreateRequest,
    TeacherCourseQuizCreateResponse,
    TeacherCourseQuizQuestionsUpdateRequest,
    TeacherCourseQuizResponse,
    TeacherCourseQuizUpdateRequest,
)
from src.modules.teacher.teacher_quiz.teacher_quiz_dependency import get_teacher_quiz_service
from src.modules.teacher.teacher_quiz.teacher_quiz_service import TeacherQuizService

teacher_lesson_quizzes_router = APIRouter(
    prefix="/teacher/lessons",
    tags=["Teacher Quiz"]
)

teacher_quizzes_router = APIRouter(
    prefix="/teacher/quizzes",
    tags=["Teacher Quiz"]
)

def get_current_teacher_id(user: dict = Depends(require_role(Role.TEACHER))) -> int:
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return int(user_id)

@teacher_lesson_quizzes_router.post("/{lesson_id}/quizzes", response_model=TeacherCourseQuizCreateResponse, status_code=201)
async def create_quiz(
    data: TeacherCourseQuizCreateRequest,
    lesson_id: int = Path(..., title="The ID of the lesson"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherQuizService = Depends(get_teacher_quiz_service)
):
    return await service.create_quiz(teacher_id, lesson_id, data)

@teacher_quizzes_router.put("/{quiz_id}", response_model=TeacherCourseQuizResponse)
async def update_quiz(
    data: TeacherCourseQuizUpdateRequest,
    quiz_id: int = Path(..., title="The ID of the quiz"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherQuizService = Depends(get_teacher_quiz_service)
):
    return await service.update_quiz(teacher_id, quiz_id, data)
@teacher_quizzes_router.put("/{quiz_id}/questions", response_model=TeacherCourseQuizResponse)
async def update_quiz_questions(
    data: TeacherCourseQuizQuestionsUpdateRequest,
    quiz_id: int = Path(..., title="The ID of the quiz"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherQuizService = Depends(get_teacher_quiz_service)
):
    return await service.update_quiz_questions(teacher_id, quiz_id, data)
