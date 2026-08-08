from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class CourseBase(BaseModel):
    title: str
    description: str
    price: int
    thumbnail_url: Optional[str] = None
    field: str
    tags: List[str]

class CourseCreateRequest(CourseBase):
    pass

class CourseUpdateRequest(CourseBase):
    status: str

class CourseResponse(CourseBase):
    id: int
    status: str
    teacher_id: int

class SectionCreateRequest(BaseModel):
    title: str
    position: int

class SectionUpdateRequest(BaseModel):
    title: str
    position: int

class SectionResponse(BaseModel):
    id: int
    course_id: int
    title: str
    position: int

class LessonCreateRequest(BaseModel):
    title: str
    position: int

class LessonUpdateRequest(BaseModel):
    title: str
    position: int

class LessonResponse(BaseModel):
    id: int
    section_id: int
    title: str
    position: int

class LessonContentCreateRequest(BaseModel):
    content_type: str
    content_data: dict

class LessonContentUpdateRequest(BaseModel):
    content_type: str
    content_data: dict

class LessonContentResponse(BaseModel):
    id: int
    lesson_id: int
    content_type: str
    content_data: dict

class ReorderItemRequest(BaseModel):
    item_type: Literal["section", "lesson"]
    id: int
    position: int
    parent_id: int | None = None

class ReorderCurriculumRequest(BaseModel):
    reorder_data: List[ReorderItemRequest]

class ReorderResponse(BaseModel):
    message: str

class DeleteResponse(BaseModel):
    message: str
