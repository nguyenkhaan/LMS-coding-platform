from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Numeric, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import utc_now

if TYPE_CHECKING:
    from src.models.interview_session_model import InterviewSessionModel


class InterviewReportModel(Base):
    __tablename__ = "interview_reports"

    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("interview_session.id"), unique=True, nullable=False)
    overall_score: Mapped[float] = mapped_column(Numeric, default=0, nullable=True)
    strengths: Mapped[str | None] = mapped_column(Text, nullable=True)
    weaknesses: Mapped[str | None] = mapped_column(Text, nullable=True)
    suggestions: Mapped[str | None] = mapped_column(Text, nullable=True)
    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)

    session: Mapped["InterviewSessionModel"] = relationship(back_populates="report")
