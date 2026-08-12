from enum import Enum
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict
from src.models.base_model import LessonContentType


# ---------------------------------------------------------------------------
# Shared enums
# ---------------------------------------------------------------------------

class PriceType(str, Enum):
    FREE = "free"
    PAID = "paid"


class EnrollStatus(str, Enum):
    ENROLLED = "enrolled"
    PENDING_PAYMENT = "pending_payment"


# ContentType is not redefined here — use LessonContentType from src.models.base_model


# ---------------------------------------------------------------------------
# Public Course Catalog  (Endpoint 1 & 2)
# ---------------------------------------------------------------------------

class CourseItemResponse(BaseModel):
    id: int
    slug: str
    title: str
    thumbnail_url: str
    price: float
    price_type: PriceType
    field: str
    tags: list[str]
    enrolled_count: int
    rating: float
    model_config = ConfigDict(from_attributes=True)


class CourseCatalogResponse(BaseModel):
    total_items: int
    total_pages: int
    current_page: int
    items: list[CourseItemResponse]
    model_config = ConfigDict(from_attributes=True)


class SectionOverviewResponse(BaseModel):
    id: int
    title: str
    position: int
    lesson_count: int
    model_config = ConfigDict(from_attributes=True)


class CourseDetailResponse(BaseModel):
    id: int
    slug: str
    title: str
    description: str
    price: float
    price_type: PriceType
    field: str
    tags: list[str]
    enrolled_count: int
    rating: float
    sections: list[SectionOverviewResponse]
    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Enroll / Unenroll  (Endpoint 3 & 9)
# ---------------------------------------------------------------------------

class EnrollResponse(BaseModel):
    status: EnrollStatus
    checkout_url: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class UnenrollResponse(BaseModel):
    message: str
    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Student Enrolled Courses  (Endpoint 4)
# ---------------------------------------------------------------------------

class EnrolledCourseResponse(BaseModel):
    id: int
    slug: str
    title: str
    thumbnail_url: str
    progress_percent: float
    model_config = ConfigDict(from_attributes=True)


class StudentCoursesResponse(BaseModel):
    items: list[EnrolledCourseResponse]
    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Study Mode  (Endpoint 5)
# ---------------------------------------------------------------------------

class LessonContentStudyResponse(BaseModel):
    id: int
    content_type: LessonContentType
    media_url: Optional[str] = None
    completed: bool
    model_config = ConfigDict(from_attributes=True)


class LessonStudyResponse(BaseModel):
    id: int
    title: str
    position: int
    locked: bool
    contents: list[LessonContentStudyResponse]
    model_config = ConfigDict(from_attributes=True)


class SectionStudyResponse(BaseModel):
    id: int
    title: str
    position: int
    lessons: list[LessonStudyResponse]
    model_config = ConfigDict(from_attributes=True)


class StudyResponse(BaseModel):
    course_slug: str
    sections: list[SectionStudyResponse]
    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Progress  (Endpoint 6)
# ---------------------------------------------------------------------------

class CompleteContentResponse(BaseModel):
    message: str
    completed_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Quiz  (Endpoint 7)
# NOTE: QuizOptionResponse intentionally has NO is_correct field — students
#       must not receive the answer key when fetching questions.
# ---------------------------------------------------------------------------

class QuizOptionResponse(BaseModel):
    id: int
    text: str
    model_config = ConfigDict(from_attributes=True)


class QuizQuestionResponse(BaseModel):
    id: int
    question_text: str
    options: list[QuizOptionResponse]
    model_config = ConfigDict(from_attributes=True)


class QuizResponse(BaseModel):
    id: int
    title: str
    questions: list[QuizQuestionResponse]
    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Quiz Submit  (Endpoint 8)
# ---------------------------------------------------------------------------

class QuizSubmitRequest(BaseModel):
    # Map of question_id -> selected option_id
    answers: dict[int, int]
    model_config = ConfigDict(from_attributes=True)


class QuizSubmitResponse(BaseModel):
    submission_id: int
    score: float
    passed: bool
    correct_count: int
    total_count: int
    model_config = ConfigDict(from_attributes=True)
