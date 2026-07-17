from datetime import datetime, UTC
from typing import List, TYPE_CHECKING
from sqlalchemy import ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base
from src.models.base_model import InterViewLevel

if TYPE_CHECKING:
    from src.models.user_model import UserModel
    from src.models.interview_message_model import InterviewMessageModel
    from src.models.interview_report_model import InterviewReportModel

class InterviewSessionModel(Base):
    __tablename__ = 'interview_session'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    topic: Mapped[str] = mapped_column(nullable=False)
    level: Mapped[InterViewLevel] = mapped_column(SQLEnum(InterViewLevel), nullable=False)
    status: Mapped[bool] = mapped_column(default=True, nullable=False)
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(UTC), 
        nullable=False
    )
    ended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    student: Mapped["UserModel"] = relationship(back_populates="interview_sessions")
    messages: Mapped[List["InterviewMessageModel"]] = relationship(back_populates="session", cascade="all, delete-orphan")
    reports: Mapped[List["InterviewReportModel"]] = relationship(back_populates="session", cascade="all, delete-orphan")
