from typing import Annotated

from fastapi import APIRouter, Path, Query, status

from src.modules.lesson_comment.lesson_comment_dependency import (
    CurrentUserId,
    LessonCommentServiceDependency,
)
from src.modules.lesson_comment.lesson_comment_dto import (
    CommentListResponse,
    CommentMutationResponse,
    CommentWrite,
    DeleteCommentResponse,
    TeacherCommentListResponse,
)

router = APIRouter(tags=["Lesson Comment"])


@router.get(
    "/lesson-contents/{lesson_content_id}/comments",
    response_model=CommentListResponse,
)
async def list_lesson_content_comments(
    lesson_content_id: Annotated[int, Path(ge=1)],
    user_id: CurrentUserId,
    service: LessonCommentServiceDependency,
    page: Annotated[int, Query(ge=1)] = 1,
    size: Annotated[int, Query(ge=1, le=100)] = 20,
) -> CommentListResponse:
    return await service.list_lesson_content_comments(
        lesson_content_id=lesson_content_id,
        user_id=user_id,
        page=page,
        size=size,
    )


@router.post(
    "/lesson-contents/{lesson_content_id}/comments",
    response_model=CommentMutationResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_lesson_content_comment(
    lesson_content_id: Annotated[int, Path(ge=1)],
    payload: CommentWrite,
    user_id: CurrentUserId,
    service: LessonCommentServiceDependency,
) -> CommentMutationResponse:
    return await service.create_comment(
        lesson_content_id=lesson_content_id,
        user_id=user_id,
        payload=payload,
    )


@router.delete(
    "/comments/{comment_id}",
    response_model=DeleteCommentResponse,
)
async def delete_comment(
    comment_id: Annotated[int, Path(ge=1)],
    user_id: CurrentUserId,
    service: LessonCommentServiceDependency,
) -> DeleteCommentResponse:
    return await service.delete_comment(comment_id=comment_id, user_id=user_id)


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
