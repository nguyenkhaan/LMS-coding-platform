from datetime import datetime
from typing import Self

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from src.modules.courses.authoring.dto import TeacherCourseLessonContentResponse


class TeacherCourseQuizCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")
    title: str
    passing_score: float = 0
    start_date: datetime | None = None
    end_date: datetime | None = None
    attempts: int | None = None
    order: int = Field(alias="position")

    @model_validator(mode="after")
    def validate_dates(self) -> Self:
        if self.start_date and self.end_date:
            if self.end_date <= self.start_date:
                raise ValueError("end_date must be strictly after start_date")
        return self


class TeacherCourseQuizUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")
    title: str | None = None
    passing_score: float | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    attempts: int | None = None

    @model_validator(mode="after")
    def validate_dates(self) -> Self:
        if self.start_date and self.end_date:
            if self.end_date <= self.start_date:
                raise ValueError("end_date must be strictly after start_date")
        return self


class TeacherCourseQuizResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)
    id: int
    title: str
    passing_score: float
    start_date: datetime | None = None
    end_date: datetime | None = None
    attempts: int | None = None


class TeacherCourseQuizCreateResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    quiz: TeacherCourseQuizResponse
    lesson_content: TeacherCourseLessonContentResponse


class QuizOptionAuthorWrite(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")
    content: str
    is_correct: bool = False


class QuizQuestionWrite(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")
    title: str | None = None
    content: str
    question_type: str
    points: float = 0
    options: list[QuizOptionAuthorWrite]

    @field_validator("points")
    def validate_points(cls, v: float) -> float:
        if v < 0:
            raise ValueError("points cannot be negative")
        return v

    @field_validator("options")
    def validate_options(cls, v: list[QuizOptionAuthorWrite]) -> list[QuizOptionAuthorWrite]:
        if not v:
            raise ValueError("at least one option must be provided")
        if not any(opt.is_correct for opt in v):
            raise ValueError("at least one correct option must be provided")
        return v


class TeacherCourseQuizQuestionsUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")
    questions: list[QuizQuestionWrite]

from src.models.base_model import QuizAttemptStatus

class QuizOptionLearnerView(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    question_id: int
    content: str

class QuizQuestionLearnerView(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    quiz_id: int
    title: str | None
    content: str
    question_type: str
    points: float
    options: list[QuizOptionLearnerView]

class QuizAttemptView(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    quiz_id: int
    student_id: int
    attempt_no: int
    status: QuizAttemptStatus
    started_at: datetime
    submitted_at: datetime | None = None
    expires_at: datetime | None = None

class QuizStartResponse(BaseModel):
    attempt: QuizAttemptView
    questions: list[QuizQuestionLearnerView]

class QuizAttemptDetailResponse(BaseModel):
    """Response for GET /student/quizzes/{quiz_id}/attempts/{attempt_id}.
    
    Returns attempt metadata and the learner question/option view.
    Does NOT return the answer key.
    """
    attempt: QuizAttemptView
    questions: list[QuizQuestionLearnerView]

class QuizSubmissionView(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    quiz_attempt_id: int
    score: float
    answers: str | None = None
    submitted_at: datetime

class LessonContentProgressView(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    enrollment_id: int
    lesson_content_id: int
    completed: bool
    completed_at: datetime | None = None

class QuizAttemptAnswer(BaseModel):
    model_config = ConfigDict(extra="forbid")
    question_id: int
    option_ids: list[int]

class QuizAttemptSubmitRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    answers: list[QuizAttemptAnswer]

class QuizSubmitResponse(BaseModel):
    attempt: QuizAttemptView
    submission: QuizSubmissionView
    passed: bool
    progress: LessonContentProgressView | None = None

class PaginationMeta(BaseModel):
    model_config = ConfigDict(extra="forbid")
    page: int
    size: int
    total: int

class QuizAttemptListResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")
    data: list[QuizAttemptView]
    pagination: PaginationMeta
