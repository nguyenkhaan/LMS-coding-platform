from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from src.modules.courses.authoring.dto import TeacherCourseLessonContentResponse


class TeacherCourseQuizCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    title: str
    passing_score: float = 0
    start_date: datetime | None = None
    end_date: datetime | None = None
    attempts: int | None = None
    order: int = Field(alias="position")


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
