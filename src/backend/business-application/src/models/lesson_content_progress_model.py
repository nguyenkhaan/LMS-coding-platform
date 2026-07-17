from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base

if TYPE_CHECKING:
    from src.models.enrollment_model import EnrollmentModel
    from src.models.lesson_content_model import LessonContentModel

class LessonContentProgressModel(Base):
    __tablename__ = 'lesson_content_progress'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    enrollment_id: Mapped[int] = mapped_column(ForeignKey("enrollment.id"), nullable=False)
    lesson_content_id: Mapped[int] = mapped_column(ForeignKey("lesson_content.id"), nullable=False)
    completed: Mapped[bool] = mapped_column(default=False, nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Table args for unique constraint
    __table_args__ = (
        UniqueConstraint("enrollment_id", "lesson_content_id", name="uq_lesson_content_progress_enrollment_content"),
    )

    # Relationships
    enrollment: Mapped["EnrollmentModel"] = relationship(back_populates="progresses")
    lesson_content: Mapped["LessonContentModel"] = relationship(back_populates="progresses")
