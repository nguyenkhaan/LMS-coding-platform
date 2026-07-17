from datetime import datetime, UTC
from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base

if TYPE_CHECKING:
    from src.models.quiz_model import QuizModel
    from src.models.user_model import UserModel

class QuizEnrollmentModel(Base):
    __tablename__ = 'quiz_enrollment'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    quiz_id: Mapped[int] = mapped_column(ForeignKey("quizzes.id"), nullable=False)
    student_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    enrolled_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(UTC), 
        nullable=False
    )

    # Relationships
    quiz: Mapped["QuizModel"] = relationship(back_populates="enrollments")
    student: Mapped["UserModel"] = relationship(back_populates="quiz_enrollments")
