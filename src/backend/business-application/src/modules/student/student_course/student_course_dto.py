from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from src.models.base_model import CourseStatus, LessonContentType, ProblemDifficulty


class PaginationView(BaseModel):
    page: int
    size: int
    total: int


class EnrollmentView(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    student_id: int
    course_id: int
    status: str | None
    enrolled_at: datetime
    completed_at: datetime | None


class CourseView(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    teacher_id: int
    slug: str
    field: str | None
    tags: str | None
    description: str | None
    thumbnail_url: str | None
    price: Decimal
    currency: str = "USD"
    status: CourseStatus
    created_at: datetime
    updated_at: datetime


class StudentCourseView(BaseModel):
    enrollment: EnrollmentView
    course: CourseView
    progress_percent: float


class StudentCourseListResponse(BaseModel):
    data: list[StudentCourseView]
    pagination: PaginationView


class ReadingContentView(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    content: str
    created_at: datetime
    updated_at: datetime


class QuizContentView(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    passing_score: Decimal
    start_date: datetime | None
    end_date: datetime | None
    attempts: int | None


class ProblemContentView(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    teacher_id: int
    title: str
    slug: str
    statement: str
    input_description: str | None
    output_description: str | None
    constraints: str | None
    sample_input: str | None
    sample_output: str | None
    explanation: str | None
    difficulty: ProblemDifficulty
    passing_score: Decimal
    public: bool
    created_at: datetime


class LessonContentStudyView(BaseModel):
    id: int
    lesson_id: int
    content_type: LessonContentType
    content_id: int
    media_url: str | None
    position: int
    created_at: datetime
    completed: bool
    locked: bool
    reading: ReadingContentView | None = None
    quiz: QuizContentView | None = None
    problem: ProblemContentView | None = None


class LessonStudyView(BaseModel):
    id: int
    section_id: int
    title: str
    summary: str | None
    score: Decimal
    position: int
    created_at: datetime
    updated_at: datetime
    completed: bool
    locked: bool
    contents: list[LessonContentStudyView]


class SectionStudyView(BaseModel):
    id: int
    course_id: int
    title: str
    position: int
    lessons: list[LessonStudyView]


class CourseStudyView(CourseView):
    progress_percent: float
    sections: list[SectionStudyView]


class CourseStudyResponse(BaseModel):
    data: CourseStudyView


class LessonContentProgressView(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    enrollment_id: int
    lesson_content_id: int
    completed: bool
    completed_at: datetime | None


class CompleteReadingResponse(BaseModel):
    data: LessonContentProgressView
    course_progress_percent: float
    message: str


class ProgressListResponse(BaseModel):
    data: list[LessonContentProgressView]
    pagination: PaginationView
