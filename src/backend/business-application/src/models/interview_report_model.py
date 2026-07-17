from datetime import datetime, UTC
from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, DateTime, Float, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base

if TYPE_CHECKING:
    from src.models.interview_session_model import InterviewSessionModel

class InterviewReportModel(Base):
    __tablename__ = 'interview_reports'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("interview_session.id"), nullable=False)
    overall_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    strengths: Mapped[str | None] = mapped_column(Text, nullable=True)
    weaknesses: Mapped[str | None] = mapped_column(Text, nullable=True)
    suggestions: Mapped[str | None] = mapped_column(Text, nullable=True)
    generated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(UTC), 
        nullable=False
    )

    # Relationships
    session: Mapped["InterviewSessionModel"] = relationship(back_populates="reports")
