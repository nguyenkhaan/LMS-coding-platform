from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field

from src.modules.teacher_course.teacher_course_dto import TeacherCourseLessonContentResponse

class TeacherCourseQuizCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    title: str
    passing_score: float = 0.0
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    attempts: Optional[int] = None
    position: int

class TeacherCourseQuizResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    passing_score: float
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    attempts: Optional[int] = None

class TeacherCourseQuizCreateResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    quiz: TeacherCourseQuizResponse
    lesson_content: TeacherCourseLessonContentResponse
