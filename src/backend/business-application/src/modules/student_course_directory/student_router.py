from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path

from src.middlewares.role_middleware import require_role
from src.models.base_model import Role
from src.modules.student_course_directory.course_dependency import get_course_service
from src.modules.student_course_directory.course_dto import (
    CompleteContentResponse,
    QuizResponse,
    QuizSubmitRequest,
    QuizSubmitResponse,
    StudentCoursesResponse,
    StudyResponse,
)
from src.modules.student_course_directory.course_service import CourseService

router = APIRouter(
    prefix="/student",
    tags=["Student Study Mode"],
)


def _extract_user_id(user: dict) -> int:
    """Extract and validate user_id from get_current_user payload."""
    # "sub" is already cast to int by auth_middleware.py
    user_id: int | None = user.get("sub", None)
    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid user id in authorization token",
        )
    return user_id



@router.get("/courses", response_model=StudentCoursesResponse, status_code=200)
async def get_enrolled_courses(
    user: dict = Depends(require_role(Role.STUDENT)),
    service: CourseService = Depends(get_course_service),
) -> StudentCoursesResponse:
    user_id = _extract_user_id(user)
    return await service.get_enrolled_courses(user_id)



@router.get("/courses/{slug}/study", response_model=StudyResponse, status_code=200)
async def get_study_content(
    slug: Annotated[str, Path()],
    user: dict = Depends(require_role(Role.STUDENT)),
    service: CourseService = Depends(get_course_service),
) -> StudyResponse:
    user_id = _extract_user_id(user)
    return await service.get_study_content(slug, user_id)


#              path param is {id} per spec — Python alias: lesson_content_id

@router.post(
    "/progress/lesson-content/{id}/complete",
    response_model=CompleteContentResponse,
    status_code=200,
)
async def complete_lesson_content(
    lesson_content_id: Annotated[int, Path(alias="id")],
    user: dict = Depends(require_role(Role.STUDENT)),
    service: CourseService = Depends(get_course_service),
) -> CompleteContentResponse:
    user_id = _extract_user_id(user)
    return await service.complete_lesson_content(lesson_content_id, user_id)


#              path param is {quizId} per spec — Python alias: quiz_id

@router.get("/quizzes/{quizId}", response_model=QuizResponse, status_code=200)
async def get_quiz(
    quiz_id: Annotated[int, Path(alias="quizId")],
    user: dict = Depends(require_role(Role.STUDENT)),
    service: CourseService = Depends(get_course_service),
) -> QuizResponse:
    user_id = _extract_user_id(user)
    return await service.get_quiz(quiz_id)


#              path param is {quizId} per spec — Python alias: quiz_id

@router.post(
    "/quizzes/{quizId}/submit",
    response_model=QuizSubmitResponse,
    status_code=200,
)
async def submit_quiz(
    quiz_id: Annotated[int, Path(alias="quizId")],
    payload: QuizSubmitRequest,
    user: dict = Depends(require_role(Role.STUDENT)),
    service: CourseService = Depends(get_course_service),
) -> QuizSubmitResponse:
    user_id = _extract_user_id(user)
    return await service.submit_quiz(quiz_id, payload, user_id)
