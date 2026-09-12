from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from src.models.base_model import CourseStatus


class TeacherCourseBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    title: str
    description: str | None
    price: float
    thumbnail_url: str | None = None
    category: str | None = Field(alias="field")
    tags: list[str]
    status: CourseStatus


class TeacherCourseCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    title: str
    description: str
    price: float
    thumbnail_url: str | None = None
    category: str = Field(alias="field")
    tags: list[str]


class TeacherCourseUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    title: str | None = None
    description: str | None = None
    price: float | None = None
    thumbnail_url: str | None = None
    category: str | None = Field(default=None, alias="field")
    tags: list[str] | None = None


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

    title: str
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
    summary: str | None = None
    score: float = 0
    order: int = Field(alias="position")


class TeacherCourseLessonUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    title: str | None = None
    summary: str | None = None
    score: float | None = None
    order: int | None = Field(default=None, alias="position")


class TeacherCourseLessonResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: int
    section_id: int
    title: str
    summary: str | None = None
    score: float = 0
    order: int = Field(alias="position")
    created_at: str | None = None
    updated_at: str | None = None


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
