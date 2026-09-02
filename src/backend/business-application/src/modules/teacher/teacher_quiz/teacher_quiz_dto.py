from datetime import datetime

from pydantic import BaseModel, ConfigDict

from src.modules.teacher.teacher_course.teacher_course_dto import (
    TeacherCourseLessonContentResponse,
)


class TeacherCourseQuizCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    title: str
    passing_score: float = 0.0
    start_date: datetime | None = None
    end_date: datetime | None = None
    attempts: int | None = None
    position: int

class TeacherCourseQuizResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
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
