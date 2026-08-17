from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import InterviewMessageSender, utc_now

if TYPE_CHECKING:
    from src.models.interview_session_model import InterviewSessionModel


class InterviewMessageModel(Base):
    __tablename__ = "interview_message"

    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("interview_session.id"), nullable=False)
    sender: Mapped[InterviewMessageSender] = mapped_column(SQLEnum(InterviewMessageSender), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)

    session: Mapped["InterviewSessionModel"] = relationship(back_populates="messages")
