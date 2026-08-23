from typing import List, Optional, Literal

from pydantic import BaseModel, ConfigDict, Field

from src.models.base_model import CourseStatus


class TeacherCourseBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    title: str
    description: str
    price: int
    thumbnail_url: Optional[str] = None
    category: str = Field(alias="field")
    tags: List[str]
    status: CourseStatus

class TeacherCourseCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    title: str
    description: str
    price: int
    thumbnail_url: Optional[str] = None
    category: str = Field(alias="field")
    tags: List[str]


class TeacherCourseUpdateRequest(TeacherCourseBase):
    model_config = ConfigDict(populate_by_name=True)
    title: str | None = None
    description: str | None = None
    price: int | None = None
    thumbnail_url: Optional[str] = None
    category: str | None = Field(default=None, alias="field")
    tags: Optional[List[str]] = None
    status: CourseStatus | None = None

class TeacherCourseResponse(TeacherCourseBase):
    id: int
    status: CourseStatus
    teacher_id: int
    submitted_at: Optional[str] = None
    slug: Optional[str] = None
    rating: float = 0.0
    currency: str = "USD"
    reviewed_by: Optional[int] = None
    reviewed_note: Optional[str] = None
    reviewed_at: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


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

    items: List[TeacherCourseReorderItem]


class TeacherCourseReorderResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    sections: List[TeacherCourseSectionResponse]
    lessons: List[TeacherCourseLessonResponse]
    lesson_contents: List[TeacherCourseLessonContentResponse]


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
    options: List[QuizOptionAuthorWrite]

class TeacherCourseQuizQuestionsUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    questions: List[QuizQuestionWrite]
