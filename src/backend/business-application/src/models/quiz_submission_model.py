from datetime import datetime, UTC
from typing import TYPE_CHECKING, Any, Optional
from sqlalchemy import ForeignKey, DateTime, Float, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base

if TYPE_CHECKING:
    from src.models.quiz_model import QuizModel
    from src.models.user_model import UserModel

class QuizSubmissionModel(Base):
    __tablename__ = 'quiz_submission'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    quiz_id: Mapped[int] = mapped_column(ForeignKey("quizzes.id"), nullable=False)
    student_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    submitted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(UTC), 
        nullable=False
    )
    answers: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True)

    # Relationships
    quiz: Mapped["QuizModel"] = relationship(back_populates="submissions")
    student: Mapped["UserModel"] = relationship(back_populates="quiz_submissions")
