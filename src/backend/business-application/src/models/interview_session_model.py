from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import InterviewLevel, InterviewStatus, utc_now

if TYPE_CHECKING:
    from src.models.interview_message_model import InterviewMessageModel
    from src.models.interview_report_model import InterviewReportModel
    from src.models.user_model import UserModel


class InterviewSessionModel(Base):
    __tablename__ = "interview_session"

    id: Mapped[int] = mapped_column(primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    topic: Mapped[str] = mapped_column(nullable=False)
    level: Mapped[InterviewLevel] = mapped_column(SQLEnum(InterviewLevel), nullable=False)
    status: Mapped[InterviewStatus] = mapped_column(SQLEnum(InterviewStatus), default=InterviewStatus.ACTIVE, nullable=False)
    max_questions: Mapped[int] = mapped_column(default=12, nullable=False)
    question_count: Mapped[int] = mapped_column(default=0, nullable=False)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)
    ended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    report_generated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    student: Mapped["UserModel"] = relationship(back_populates="interview_sessions")
    messages: Mapped[list["InterviewMessageModel"]] = relationship(back_populates="session")
    report: Mapped["InterviewReportModel | None"] = relationship(back_populates="session", uselist=False)
