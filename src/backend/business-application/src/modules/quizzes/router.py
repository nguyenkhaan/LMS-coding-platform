from fastapi import APIRouter, Depends, HTTPException, Path, status

from src.middlewares.role_middleware import require_role
from src.models.base_model import Role
from src.modules.quizzes.dependencies import get_teacher_quiz_service
from src.modules.quizzes.dto import (
    TeacherCourseQuizCreateRequest,
    TeacherCourseQuizCreateResponse,
    TeacherCourseQuizQuestionsUpdateRequest,
    TeacherCourseQuizResponse,
    TeacherCourseQuizUpdateRequest,
)
from src.modules.quizzes.service import TeacherQuizService

teacher_lesson_quizzes_router = APIRouter(
    prefix="/teacher/lessons", tags=["Teacher Quiz"]
)

teacher_quizzes_router = APIRouter(prefix="/teacher/quizzes", tags=["Teacher Quiz"])


def get_current_teacher_id(user: dict = Depends(require_role(Role.TEACHER))) -> int:
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return int(user_id)


@teacher_lesson_quizzes_router.post(
    "/{lesson_id}/quizzes",
    response_model=TeacherCourseQuizCreateResponse,
    status_code=201,
)
async def create_quiz(
    data: TeacherCourseQuizCreateRequest,
    lesson_id: int = Path(..., title="The ID of the lesson"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherQuizService = Depends(get_teacher_quiz_service),
):
    return await service.create_quiz(teacher_id, lesson_id, data)


@teacher_quizzes_router.put("/{quiz_id}", response_model=TeacherCourseQuizResponse)
async def update_quiz(
    data: TeacherCourseQuizUpdateRequest,
    quiz_id: int = Path(..., title="The ID of the quiz"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherQuizService = Depends(get_teacher_quiz_service),
):
    return await service.update_quiz(teacher_id, quiz_id, data)


@teacher_quizzes_router.put(
    "/{quiz_id}/questions", response_model=TeacherCourseQuizResponse
)
async def update_quiz_questions(
    data: TeacherCourseQuizQuestionsUpdateRequest,
    quiz_id: int = Path(..., title="The ID of the quiz"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherQuizService = Depends(get_teacher_quiz_service),
):
    return await service.update_quiz_questions(teacher_id, quiz_id, data)

student_quizzes_router = APIRouter(prefix="/student/quizzes", tags=["Student Quiz"])

def get_current_student_id(user: dict = Depends(require_role(Role.STUDENT))) -> int:
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return int(user_id)

from src.modules.quizzes.dependencies import get_student_quiz_service
from fastapi import Query
from src.modules.quizzes.dto import QuizStartResponse, QuizAttemptDetailResponse, QuizSubmitResponse, QuizAttemptSubmitRequest, QuizAttemptListResponse

@student_quizzes_router.post("/{quiz_id}/attempts", response_model=QuizStartResponse, status_code=201)
async def start_attempt(
    quiz_id: int = Path(..., title="The ID of the quiz", gt=0),
    student_id: int = Depends(get_current_student_id),
    service = Depends(get_student_quiz_service),
):
    return await service.start_attempt(quiz_id, student_id)

@student_quizzes_router.get("/{quiz_id}/attempts/{attempt_id}", response_model=QuizAttemptDetailResponse, status_code=200)
async def get_attempt_detail(
    quiz_id: Annotated[int, Path(gt=0, title="The ID of the quiz")],
    attempt_id: Annotated[int, Path(gt=0, title="The ID of the attempt")],
    student_id: int = Depends(get_current_student_id),
    service: StudentQuizService = Depends(get_student_quiz_service),
):
    return await service.get_attempt_detail(quiz_id, attempt_id, student_id)




@student_quizzes_router.post(
    "/{quiz_id}/attempts/{attempt_id}/submit",
    response_model=QuizSubmitResponse,
    status_code=status.HTTP_200_OK,
)
async def submit_attempt(
    quiz_id: int,
    attempt_id: int,
    payload: QuizAttemptSubmitRequest,
    student_id: int = Depends(get_current_student_id),
    service: StudentQuizService = Depends(get_student_quiz_service),
):
    return await service.submit_attempt(quiz_id, attempt_id, student_id, payload)

@student_quizzes_router.get("/{quiz_id}/attempts", response_model=QuizAttemptListResponse, status_code=200)
async def list_attempts(
    quiz_id: Annotated[int, Path(gt=0, title="The ID of the quiz")],
    page: int = Query(1, ge=1, title="Page number"),
    size: int = Query(20, ge=1, title="Page size"),
    student_id: int = Depends(get_current_student_id),
    service: StudentQuizService = Depends(get_student_quiz_service),
):
    return await service.list_attempts(quiz_id, student_id, page, size)

