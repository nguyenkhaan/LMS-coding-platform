from typing import Annotated

from fastapi import APIRouter, Path, Query, status

from src.modules.lesson_comments.dependencies import (
    CurrentUserId,
    LessonCommentServiceDependency,
)
from src.modules.lesson_comments.dto import (
    CommentListResponse,
    CommentMutationResponse,
    CommentWrite,
    DeleteCommentResponse,
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


# submission, disscussion trong Online judge
# Bỏ đi thời gian trong trang Online Judge
# Thêm topic vào bên trong AI interview để bắt đầu
#
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
