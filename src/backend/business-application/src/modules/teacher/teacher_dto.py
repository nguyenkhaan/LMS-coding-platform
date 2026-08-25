from datetime import datetime
from decimal import Decimal
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field

from src.models.base_model import CourseStatus, LessonContentType


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

    model_config = ConfigDict(extra="forbid")


class SectionUpdateRequest(BaseModel):
    title: str | None = None
    position: int | None = None

    model_config = ConfigDict(extra="forbid")


class SectionView(BaseModel):
    id: int
    course_id: int
    title: str
    position: int

    model_config = ConfigDict(from_attributes=True)


class LessonWriteRequest(BaseModel):
    title: str
    summary: str | None = None
    score: float = 0
    position: int

    model_config = ConfigDict(extra="forbid")


class LessonUpdateRequest(BaseModel):
    title: str | None = None
    summary: str | None = None
    score: float | None = None
    position: int | None = None

    model_config = ConfigDict(extra="forbid")


class LessonView(BaseModel):
    id: int
    section_id: int
    title: str
    summary: str | None
    score: float
    position: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LessonContentBindRequest(BaseModel):
    content_type: LessonContentType
    content_id: int
    media_url: str | None = None
    position: int

    model_config = ConfigDict(extra="forbid")


class LessonContentUpdateRequest(BaseModel):
    content_id: int | None = None
    media_url: str | None = None
    position: int | None = None

    model_config = ConfigDict(extra="forbid")


class LessonContentView(BaseModel):
    id: int
    lesson_id: int
    content_type: LessonContentType
    content_id: int
    media_url: str | None
    position: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReadingContentWriteRequest(BaseModel):
    title: str
    content: str = ""

    model_config = ConfigDict(extra="forbid")


class ReadingContentCreateRequest(ReadingContentWriteRequest):
    position: int


class ReadingContentUpdateRequest(BaseModel):
    title: str | None = None
    content: str | None = None

    model_config = ConfigDict(extra="forbid")


class ReadingContentView(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReadingContentCreateResponse(BaseModel):
    reading: ReadingContentView
    lesson_content: LessonContentView


class CurriculumItemType(str, Enum):
    SECTION = "SECTION"
    LESSON = "LESSON"
    LESSON_CONTENT = "LESSON_CONTENT"


class CurriculumReorderItemRequest(BaseModel):
    item_type: CurriculumItemType
    id: int
    parent_id: int | None = None
    position: int

    model_config = ConfigDict(extra="forbid")


class CurriculumReorderRequest(BaseModel):
    items: list[CurriculumReorderItemRequest] = Field(min_length=1)

    model_config = ConfigDict(extra="forbid")


class CurriculumReorderResponse(BaseModel):
    sections: list[SectionView]
    lessons: list[LessonView]
    lesson_contents: list[LessonContentView]


class MessageResponse(BaseModel):
    message: str


class LessonContentProgressView(BaseModel):
    id: int
    enrollment_id: int
    lesson_content_id: int
    completed: bool
    completed_at: datetime | None = None


class CourseFavoriteView(BaseModel):
    id: int
    student_id: int
    course_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CourseReviewWriteRequest(BaseModel):
    rating: float = 0
    content: str = ""

    model_config = ConfigDict(extra="forbid")


class CourseReviewView(BaseModel):
    id: int
    course_id: int
    student_id: int
    rating: float
    content: str
    created_at: datetime
    updated_at: datetime
