# Nho dung skill clean-comments de xoa di cac comment do AI tao ra **Quantrong** 
from enum import Enum
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict
from src.models.base_model import LessonContentType


class PriceType(str, Enum):
    FREE = "free"
    PAID = "paid"


class EnrollStatus(str, Enum):
    ENROLLED = "enrolled"
    PENDING_PAYMENT = "pending_payment"


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


class EnrollResponse(BaseModel):
    status: EnrollStatus
    checkout_url: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class UnenrollResponse(BaseModel):
    message: str
    model_config = ConfigDict(from_attributes=True)

class CourseFavoriteView(BaseModel):
    id: int
    student_id: int
    course_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class CourseFavoriteToggleResponse(BaseModel):
    # for PUT
    id: int | None = None
    student_id: int | None = None
    course_id: int
    created_at: datetime | None = None
    is_favorited: bool
    model_config = ConfigDict(from_attributes=True)

class CourseFavoriteItemResponse(CourseFavoriteView):
    course: CourseItemResponse

class CourseFavoriteListResponse(BaseModel):
    items: list[CourseFavoriteItemResponse]
    total_items: int
    total_pages: int
    current_page: int
    model_config = ConfigDict(from_attributes=True)

class CourseReviewWrite(BaseModel):
    rating: float
    content: str | None = None

class CourseReviewView(BaseModel):
    id: int
    course_id: int
    student_id: int
    student_name: str | None = None
    rating: float
    content: str | None = None
    created_at: datetime
    updated_at: datetime | None = None
    model_config = ConfigDict(from_attributes=True)

class RatingSummary(BaseModel):
    average_rating: float
    total_reviews: int
    five_stars: int
    four_stars: int
    three_stars: int
    two_stars: int
    one_stars: int

class CourseReviewListResponse(BaseModel):
    items: list[CourseReviewView]
    summary: RatingSummary
    total_items: int
    total_pages: int
    current_page: int
    model_config = ConfigDict(from_attributes=True)


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



class InstructorItemResponse(BaseModel):
    id: int
    full_name: str
    headline: Optional[str]
    avatar_url: Optional[str]
    enrolled_students: int
    course_count: int
    rating: float
    model_config = ConfigDict(from_attributes=True)

class InstructorCatalogResponse(BaseModel):
    total_items: int
    total_pages: int
    current_page: int
    items: list[InstructorItemResponse]
    model_config = ConfigDict(from_attributes=True)

class InstructorDetailResponse(BaseModel):
    id: int
    full_name: str
    headline: Optional[str]
    avatar_url: str | None
    # TODO: bio field missing in teacher_profile_model, gap giữa api_spec.md và DB schema, cần leader dự án quyết định thêm cột hay sửa spec
    expertise_tags: list[str]
    enrolled_students: int
    course_count: int
    rating: float
    courses: list[CourseItemResponse]
    model_config = ConfigDict(from_attributes=True)

class LessonContentStudyResponse(BaseModel):
    id: int
    content_type: LessonContentType
    media_url: Optional[str] = None
    position: int
    locked: bool = False
    completed: bool = False
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


class LessonContentProgressView(BaseModel):
    id: int
    enrollment_id: int
    lesson_content_id: int
    completed: bool
    completed_at: datetime | None = None
    model_config = ConfigDict(from_attributes=True)

class ProgressListResponse(BaseModel):
    items: list[LessonContentProgressView]
    total_items: int
    total_pages: int
    current_page: int
    model_config = ConfigDict(from_attributes=True)

class StudyResponse(BaseModel):
    course: CourseItemResponse
    sections: list[SectionStudyResponse]
    model_config = ConfigDict(from_attributes=True)


class CompleteContentResponse(LessonContentProgressView):
    pass


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
