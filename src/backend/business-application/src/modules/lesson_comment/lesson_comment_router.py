from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Path
from src.middlewares.auth_middleware import get_current_user
from src.modules.lesson_comment.lesson_comment_dependency import get_lesson_content_comment_service
from src.modules.lesson_comment.lesson_comment_service import LessonContentCommentService
from src.modules.lesson_comment.lesson_comment_dto import (
    CreateLessonContentCommentRequest, 
)
router = APIRouter(
    prefix = '/lesson-contents', 
    tags = ['Lesson Comment']
)
@router.get('/{lesson_content_id}/comments') 
async def getLessonContentComments(
    lesson_content_id : int, 
    limit : Annotated[int , Query(ge=1 , le=100)] = 20, 
    offset: Annotated[int , Query(ge = 0, le = 100)] = 0, 
    route_service : LessonContentCommentService = Depends(
        get_lesson_content_comment_service
    )
): 
    response = await route_service.getLessonContentComments(
        lesson_content_id, limit, offset 
    )
    return response 

@router.post('/{lesson_content_id}/comment')
async def createLessonContentComment(
    lesson_content_id : Annotated[int , Path()], 
    data : CreateLessonContentCommentRequest, 
    user = Depends(get_current_user), 
    route_service : LessonContentCommentService = Depends(
        get_lesson_content_comment_service
    ), 
    
): 
    user_id = user.get('sub', None) 
    if not user_id: 
        raise HTTPException(
            status_code=401, 
            detail = "Invalid user id in authorization token"
        )
    return (
        await route_service.createLessonContentComment(user_id , int(lesson_content_id) , data)
    )

@router.delete('/comment/{comment_id}') 
async def deleteComment(
    comment_id : Annotated[int , Path()], 
    user = Depends(get_current_user), 
    route_service : LessonContentCommentService = Depends(
        get_lesson_content_comment_service
    ), 
): 
    user_id = user.get('sub', None) 
    return (
        await route_service.deleteLessonContentComment(user_id ,int(comment_id))
    )