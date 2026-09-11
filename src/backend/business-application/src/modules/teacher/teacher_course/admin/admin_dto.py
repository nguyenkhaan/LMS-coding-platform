from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from src.models.base_model import CourseStatus, LessonContentType


class PaginationView(BaseModel):
    page: int
    size: int
    total: int


class AdminCourseView(BaseModel):
    id: int
    title: str
    teacher_id: int
    slug: str
    rating: float
    field: str | None
    tags: str | None
    description: str | None
    thumbnail_url: str | None
    price: Decimal
    currency: Literal["USD"] = "USD"
    status: CourseStatus
    submitted_at: datetime | None
    reviewed_by: int | None
    reviewed_note: str | None
    reviewed_at: datetime | None
    created_at: datetime
    updated_at: datetime


class CourseModerationView(BaseModel):
    id: int
    course_id: int
    status: CourseStatus
    note: str | None
    reviewed_by: int | None
    reviewed_at: datetime | None
    submitted_at: datetime


class LessonContentReviewView(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    lesson_id: int
    content_type: LessonContentType
    content_id: int
    media_url: str | None
    position: int
    created_at: datetime


class LessonReviewView(BaseModel):
    id: int
    section_id: int
    title: str
    summary: str | None
    score: Decimal
    position: int
    created_at: datetime
    updated_at: datetime
    contents: list[LessonContentReviewView]


class SectionReviewView(BaseModel):
    id: int
    course_id: int
    title: str
    position: int
    lessons: list[LessonReviewView]


class AdminCourseListResponse(BaseModel):
    data: list[AdminCourseView]
    pagination: PaginationView


class AdminCourseDetailView(BaseModel):
    course: AdminCourseView
    moderation_history: list[CourseModerationView]
    sections: list[SectionReviewView]


class AdminCourseDetailResponse(BaseModel):
    data: AdminCourseDetailView


class CourseReviewRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    decision: Literal[CourseStatus.APPROVED, CourseStatus.REJECTED]
    note: str | None = Field(default=None, max_length=2000)

    @field_validator("note")
    @classmethod
    def trim_note(cls, value: str | None) -> str | None:
        return value.strip() or None if value is not None else None

    @model_validator(mode="after")
    def require_rejection_note(self) -> "CourseReviewRequest":
        if self.decision == CourseStatus.REJECTED and self.note is None:
            raise ValueError("note is required when rejecting a course")
        return self


class CourseArchiveRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    note: str = Field(min_length=1, max_length=2000)

    @field_validator("note")
    @classmethod
    def trim_note(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("note must not be blank")
        return value


class CourseReviewResult(BaseModel):
    course: AdminCourseView
    moderation: CourseModerationView


class CourseReviewResponse(BaseModel):
    data: CourseReviewResult
    message: str


class CourseArchiveResponse(BaseModel):
    data: AdminCourseView
    message: str
