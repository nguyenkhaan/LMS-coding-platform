from fastapi import APIRouter
from fastapi.routing import APIRoute
from datetime import datetime, UTC
from src.modules.lesson_comment.lesson_comment_dto import CreateLessonContentCommentResponse, DeleteLessonContentCommentResponse, GetLessonContentCommentResponse

router = APIRouter(
    prefix = '/lesson-contents', 
    tags = ['Lesson Comment']
)
@router.get('/{lesson_content_id}/comments') 
async def getLessonContentComments(
    lesson_content_id : int 
): 
    return GetLessonContentCommentResponse(
        id = 1, 
        content = "I don't know this question", 
        created_at=datetime(2026, 8, 3, 21, 30, 0, tzinfo=UTC), 
        updated_at = datetime(2026, 8, 3, 21, 30, 0, tzinfo=UTC), 
        user_id = 10, 
        lesson_content_id=2 
    )

@router.post('/{lesson_content_id}/comment')
async def createLessonContentComment(
    lesson_content_id : int 
): 
    return CreateLessonContentCommentResponse(
        id = 1, 
        content = "I already know this question", 
        created_at=datetime(2026, 8, 3, 21, 30, 0, tzinfo=UTC), 
        updated_at = datetime(2026, 8, 3, 21, 30, 0, tzinfo=UTC), 
        user_id = 10, 
        lesson_content_id=2 
    )

@router.delete('/comment/{comment_id}') 
async def deleteComment(
    comment_id : int 
): 
    return DeleteLessonContentCommentResponse() 