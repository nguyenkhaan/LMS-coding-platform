from typing import List
from typing import Self 
from pydantic import BaseModel
from datetime import datetime 
class LessonContentCommentBase(BaseModel): 
    id : int 
    lesson_content_id: int 
    user_id : int 
    content: str 
    parent_id: int | None = None 
    created_at: datetime 
    updated_at : datetime 


class GetLessonContentCommentResponse(LessonContentCommentBase): 
    replies: list[Self] = [] # Su dung Self trong typing de han che loi de quy vo han 

class CreateLessonContentCommentRequest(BaseModel): 
    parent_id : int | None = None 
    content : str 

class CreateLessonContentCommentResponse(LessonContentCommentBase): 
    ... 

class DeleteLessonContentCommentResponse(BaseModel): 
    message : str = "Comment deleted successfully"