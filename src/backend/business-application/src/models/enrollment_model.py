from datetime import datetime, UTC
from typing import List, TYPE_CHECKING
from sqlalchemy import ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base

if TYPE_CHECKING:
    from src.models.user_model import UserModel
    from src.models.course_model import CourseModel
    from src.models.lesson_content_progress_model import LessonContentProgressModel

class EnrollmentModel(Base):
    __tablename__ = 'enrollment'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"), nullable=False)
    status: Mapped[str] = mapped_column(nullable=False, default="active")
    enrolled_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(UTC), 
        nullable=False
    )
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    student: Mapped["UserModel"] = relationship(back_populates="enrollments")
    course: Mapped["CourseModel"] = relationship(back_populates="enrollments")
    progresses: Mapped[List["LessonContentProgressModel"]] = relationship(back_populates="enrollment", cascade="all, delete-orphan")
