from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import utc_now

if TYPE_CHECKING:
    from src.models.course_model import CourseModel
    from src.models.lesson_content_progress_model import LessonContentProgressModel
    from src.models.user_model import UserModel


class EnrollmentModel(Base):
    __tablename__ = "enrollment"
    __table_args__ = (UniqueConstraint("student_id", "course_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"), nullable=False)
    status: Mapped[str | None] = mapped_column(nullable=True)
    enrolled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    student: Mapped["UserModel"] = relationship(back_populates="enrollments")
    course: Mapped["CourseModel"] = relationship(back_populates="enrollments")
    progresses: Mapped[list["LessonContentProgressModel"]] = relationship(back_populates="enrollment")
