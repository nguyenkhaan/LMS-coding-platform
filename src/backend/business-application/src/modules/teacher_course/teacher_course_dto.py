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

class TeacherCourseCreateRequest(TeacherCourseBase):
    pass


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
    content_payload: dict = Field(alias="content_data")


class TeacherCourseLessonContentUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    content_type: str | None = None
    content_payload: dict | None = Field(default=None, alias="content_data")


class TeacherCourseLessonContentResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: int
    lesson_id: int
    content_type: str
    content_payload: dict = Field(alias="content_data")


class TeacherCourseReorderItem(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    item_kind: Literal["section", "lesson"] = Field(alias="item_type")
    id: int
    order: int = Field(alias="position")
    section_id: int | None = Field(default=None, alias="parent_id")


class TeacherCourseReorderRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    items: List[TeacherCourseReorderItem] = Field(alias="reorder_data")


class TeacherCourseReorderResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    message: str


class TeacherCourseDeleteResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    message: str
