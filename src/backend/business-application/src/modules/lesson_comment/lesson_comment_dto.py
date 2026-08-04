from typing import List
from typing import Self 
from pydantic import BaseModel, ConfigDict
from datetime import datetime 
class LessonContentCommentBase(BaseModel): 
    id : int 
    lesson_content_id: int 
    user_id : int 
    content: str 
    parent_id: int | None = None 
    created_at: datetime 
    updated_at : datetime 
    model_config = ConfigDict(from_attributes=True)

class GetLessonContentCommentResponse(LessonContentCommentBase): 
    replies: list[LessonContentCommentBase] = [] # Su dung Self trong typing de han che loi de quy vo han 
    model_config = ConfigDict(from_attributes=True)

class CreateLessonContentCommentRequest(BaseModel): 
    parent_id : int | None = None 
    content : str 
    model_config = ConfigDict(from_attributes=True)

class CreateLessonContentCommentResponse(LessonContentCommentBase): 
    ... 

class DeleteLessonContentCommentResponse(BaseModel): 
    message : str = "Comment deleted successfully"
    model_config = ConfigDict(from_attributes=True)