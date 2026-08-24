from typing import Optional
from datetime import datetime 
from pydantic import BaseModel, ConfigDict
from decimal import Decimal
from enum import Enum 
class CourseStatus(str, Enum): 
    DRAFT = "DRAFT"
    PENDING_REVIEW = "PENDING_REVIEW"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    ARCHIVED = "ARCHIVED"

class CourseWriteRequest(BaseModel):
    title: str
    field: str
    tags: str
    description: str | None = None
    thumbnail_url: str | None = None
    price: Decimal

    model_config = ConfigDict(extra="forbid")


class CourseView(BaseModel):
    id: int
    title: str
    teacher_id: int
    slug: str
    rating: float
    field: str
    tags: str
    description: str | None
    thumbnail_url: str | None
    price: Decimal
    currency: str
    status: CourseStatus
    submitted_at: datetime | None
    reviewed_by: int | None
    reviewed_note: str | None
    reviewed_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SectionWriteRequest(BaseModel): 
    title: str 
    position: int 

class SectionView(BaseModel): 
    id : int
    course_id: int
    title: str 
    position: int 

class LessonWriteRequest(BaseModel): 
    title : str
    summary: str
    score: float
    position: int 

class LessonView(BaseModel): 
    id: int 
    section_id: int 
    title: str 
    summary: str 
    score: float 
    position: int 
    created_at: datetime 
    updated_at: datetime 