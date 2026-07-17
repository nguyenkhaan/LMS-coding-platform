from datetime import datetime
from typing import List, TYPE_CHECKING
from sqlalchemy import DateTime, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base

if TYPE_CHECKING:
    from src.models.quiz_question_model import QuizQuestionModel
    from src.models.quiz_enrollment_model import QuizEnrollmentModel
    from src.models.quiz_submission_model import QuizSubmissionModel

class QuizModel(Base):
    __tablename__ = 'quizzes'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(nullable=False)
    passing_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    start_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    attempts: Mapped[int | None] = mapped_column(nullable=True)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    questions: Mapped[List["QuizQuestionModel"]] = relationship(back_populates="quiz", cascade="all, delete-orphan")
    enrollments: Mapped[List["QuizEnrollmentModel"]] = relationship(back_populates="quiz", cascade="all, delete-orphan")
    submissions: Mapped[List["QuizSubmissionModel"]] = relationship(back_populates="quiz", cascade="all, delete-orphan")
