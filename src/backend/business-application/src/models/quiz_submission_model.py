from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Numeric, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import utc_now

if TYPE_CHECKING:
    from src.models.quiz_model import QuizModel
    from src.models.user_model import UserModel


class QuizSubmissionModel(Base):
    __tablename__ = "quiz_submission"
    __table_args__ = (UniqueConstraint("quiz_id", "student_id", "attempt_no"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    quiz_id: Mapped[int] = mapped_column(ForeignKey("quizzes.id"), nullable=False)
    student_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    attempt_no: Mapped[int] = mapped_column(nullable=False)
    score: Mapped[float] = mapped_column(Numeric, default=0, nullable=False)
    answers: Mapped[str | None] = mapped_column(Text, nullable=True)
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)

    quiz: Mapped["QuizModel"] = relationship(back_populates="submissions")
    student: Mapped["UserModel"] = relationship(back_populates="quiz_submissions")
