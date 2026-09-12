from typing import Annotated

from fastapi import APIRouter, Path, Query

from src.modules.lesson_comments.dependencies import (
    CurrentUserId,
    LessonCommentServiceDependency,
)
from src.modules.lesson_comments.dto import TeacherCommentListResponse

router = APIRouter(tags=["Lesson Comment"])


@router.get(
    "/teacher/courses/{course_id}/comments",
    response_model=TeacherCommentListResponse,
)
async def list_teacher_course_comments(
    course_id: Annotated[int, Path(ge=1)],
    user_id: CurrentUserId,
    service: LessonCommentServiceDependency,
    unanswered_only: Annotated[bool, Query()] = False,
    page: Annotated[int, Query(ge=1)] = 1,
    size: Annotated[int, Query(ge=1, le=100)] = 20,
) -> TeacherCommentListResponse:
    return await service.list_teacher_course_comments(
        course_id=course_id,
        user_id=user_id,
        unanswered_only=unanswered_only,
        page=page,
        size=size,
    )
