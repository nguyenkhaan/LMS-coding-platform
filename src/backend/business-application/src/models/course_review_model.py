from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Numeric, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import TimestampMixin

if TYPE_CHECKING:
    from src.models.course_model import CourseModel
    from src.models.user_model import UserModel


class CourseReviewModel(TimestampMixin, Base):
    __tablename__ = "course_review"
    __table_args__ = (UniqueConstraint("course_id", "student_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"), nullable=False)
    student_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    rating: Mapped[float] = mapped_column(Numeric, nullable=False)
    content: Mapped[str | None] = mapped_column(Text, nullable=True)

    course: Mapped["CourseModel"] = relationship(back_populates="reviews")
    student: Mapped["UserModel"] = relationship(back_populates="course_reviews")
