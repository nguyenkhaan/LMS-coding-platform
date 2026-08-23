from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Numeric, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import utc_now

if TYPE_CHECKING:
    from src.models.quiz_attempt_model import QuizAttemptModel


class QuizSubmissionModel(Base):
    __tablename__ = "quiz_submission"

    id: Mapped[int] = mapped_column(primary_key=True)
    quiz_attempt_id: Mapped[int] = mapped_column(
        ForeignKey("quiz_attempt.id"), unique=True, nullable=False
    )
    score: Mapped[float] = mapped_column(Numeric, default=0, nullable=False)
    answers: Mapped[str | None] = mapped_column(Text, nullable=True)
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)

    attempt: Mapped["QuizAttemptModel"] = relationship(back_populates="submission")
