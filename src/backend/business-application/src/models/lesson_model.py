from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Numeric, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import TimestampMixin

if TYPE_CHECKING:
    from src.models.lesson_content_model import LessonContentModel
    from src.models.section_model import SectionModel


class LessonModel(TimestampMixin, Base):
    __tablename__ = "lesson"
    __table_args__ = (UniqueConstraint("section_id", "position"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    section_id: Mapped[int] = mapped_column(ForeignKey("sections.id"), nullable=False)
    title: Mapped[str] = mapped_column(nullable=False)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    score: Mapped[float] = mapped_column(Numeric, default=0, nullable=True)
    position: Mapped[int] = mapped_column(default=0, nullable=False)

    section: Mapped["SectionModel"] = relationship(back_populates="lessons")
    contents: Mapped[list["LessonContentModel"]] = relationship(back_populates="lesson")
