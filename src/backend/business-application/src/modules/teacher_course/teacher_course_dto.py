from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from src.models.base_model import CourseStatus


class TeacherCourseBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    title: str
    description: str
    price: int
    thumbnail_url: str | None = None
    category: str = Field(alias="field")
    tags: list[str]
    status: CourseStatus

class TeacherCourseCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    title: str
    description: str
    price: int
    thumbnail_url: str | None = None
    category: str = Field(alias="field")
    tags: list[str]


class TeacherCourseUpdateRequest(TeacherCourseBase):
    model_config = ConfigDict(populate_by_name=True)
    title: str | None = None
    description: str | None = None
    price: int | None = None
    thumbnail_url: str | None = None
    category: str | None = Field(default=None, alias="field")
    tags: list[str] | None = None
    status: CourseStatus | None = None

class TeacherCourseResponse(TeacherCourseBase):
    id: int
    status: CourseStatus
    teacher_id: int
    submitted_at: str | None = None
    slug: str | None = None
    rating: float = 0.0
    currency: str = "USD"
    reviewed_by: int | None = None
    reviewed_note: str | None = None
    reviewed_at: str | None = None
    created_at: str | None = None
    updated_at: str | None = None


class TeacherCourseSectionCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    title: str | None = None 
    order: int = Field(alias="position")


class TeacherCourseSectionUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    title: str | None = None
    order: int | None = Field(default=None, alias="position")


class TeacherCourseSectionResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: int
    course_id: int
    title: str
    order: int = Field(alias="position")


class TeacherCourseLessonCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    title: str
    order: int = Field(alias="position")


class TeacherCourseLessonUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    title: str | None = None
    order: int | None = Field(default=None, alias="position")


class TeacherCourseLessonResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: int
    section_id: int
    title: str
    order: int = Field(alias="position")


class TeacherCourseLessonContentCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    content_type: str
    content_id: int
    media_url: str | None = None
    order: int = Field(alias="position")


class TeacherCourseLessonContentUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    content_type: str | None = None
    content_id: int | None = None
    media_url: str | None = None
    order: int | None = Field(default=None, alias="position")


class TeacherCourseLessonContentResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    id: int
    lesson_id: int
    content_type: str
    content_id: int
    media_url: str | None = None
    order: int = Field(alias="position")
    created_at: str | None = None


class TeacherCourseReorderItem(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    item_kind: Literal["section", "lesson", "lesson_content"] = Field(alias="item_type")
    id: int
    order: int = Field(alias="position")
    section_id: int | None = Field(default=None, alias="parent_id")


class TeacherCourseReorderRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    items: list[TeacherCourseReorderItem]


class TeacherCourseReorderResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    sections: list[TeacherCourseSectionResponse]
    lessons: list[TeacherCourseLessonResponse]
    lesson_contents: list[TeacherCourseLessonContentResponse]


class TeacherCourseDeleteResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    message: str

class TeacherCourseReadingCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    title: str
    content: str
    order: int = Field(alias="position")

class TeacherCourseReadingUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    title: str | None = None
    content: str | None = None

class TeacherCourseReadingResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    id: int
    title: str
    content: str
    created_at: str | None = None
    updated_at: str | None = None

class TeacherCourseReadingCreateResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    reading_content: TeacherCourseReadingResponse
    lesson_content: TeacherCourseLessonContentResponse

from datetime import datetime


class TeacherCourseQuizCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    title: str
    passing_score: float = 0
    start_date: datetime | None = None
    end_date: datetime | None = None
    attempts: int | None = None
    order: int = Field(alias='position')

class TeacherCourseQuizUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    title: str | None = None
    passing_score: float | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    attempts: int | None = None

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
    model_config = ConfigDict(populate_by_name=True)
    content: str
    is_correct: bool = False

class QuizQuestionWrite(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    title: str | None = None
    content: str
    question_type: str
    points: float = 0
    options: list[QuizOptionAuthorWrite]

class TeacherCourseQuizQuestionsUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    questions: list[QuizQuestionWrite]

from pydantic import BaseModel, ConfigDict


class SubmissionView(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    id: int
    problem_id: int
    student_id: int
    language_id: int
    source_code: str
    status: str
    score: float
    runtime_ms: int
    memory_kb: int
    submitted_at: datetime

class SubmissionListResponse(BaseModel):
    total_items: int
    total_pages: int
    current_page: int
    items: list[SubmissionView]
