from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import utc_now

if TYPE_CHECKING:
    from src.models.course_model import CourseModel


class CourseModerationReviewModel(Base):
    __tablename__ = "course_moderation_review"

    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"), nullable=False)
    reviewed_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)

    course: Mapped["CourseModel"] = relationship(back_populates="moderation_reviews")
