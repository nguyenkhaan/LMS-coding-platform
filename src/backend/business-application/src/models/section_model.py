from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base

if TYPE_CHECKING:
    from src.models.course_model import CourseModel
    from src.models.lesson_model import LessonModel


class SectionModel(Base):
    __tablename__ = "sections"
    __table_args__ = (UniqueConstraint("course_id", "position"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"), nullable=False)
    title: Mapped[str] = mapped_column(nullable=False)
    position: Mapped[int] = mapped_column(default=0, nullable=False)

    course: Mapped["CourseModel"] = relationship(back_populates="sections")
    lessons: Mapped[list["LessonModel"]] = relationship(back_populates="section")
