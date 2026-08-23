from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey, Index, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import QuizAttemptStatus, utc_now

if TYPE_CHECKING:
    from src.models.quiz_model import QuizModel
    from src.models.quiz_submission_model import QuizSubmissionModel
    from src.models.user_model import UserModel


class QuizAttemptModel(Base):
    __tablename__ = "quiz_attempt"
    __table_args__ = (
        UniqueConstraint(
            "quiz_id",
            "student_id",
            "attempt_no",
            name="uq_quiz_attempt_quiz_student_number",
        ),
        Index(
            "ix_quiz_attempt_student_quiz_status",
            "student_id",
            "quiz_id",
            "status",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    quiz_id: Mapped[int] = mapped_column(ForeignKey("quizzes.id"), nullable=False)
    student_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    attempt_no: Mapped[int] = mapped_column(nullable=False)
    status: Mapped[QuizAttemptStatus] = mapped_column(
        SQLEnum(QuizAttemptStatus),
        default=QuizAttemptStatus.IN_PROGRESS,
        nullable=False,
    )
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, nullable=False
    )
    submitted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    quiz: Mapped["QuizModel"] = relationship(back_populates="attempts_history")
    student: Mapped["UserModel"] = relationship(back_populates="quiz_attempts")
    submission: Mapped["QuizSubmissionModel | None"] = relationship(
        back_populates="attempt", uselist=False
    )
