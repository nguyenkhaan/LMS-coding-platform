from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import LessonContentType, utc_now

if TYPE_CHECKING:
    from src.models.comment_model import CommentModel
    from src.models.lesson_content_progress_model import LessonContentProgressModel
    from src.models.lesson_model import LessonModel


class LessonContentModel(Base):
    __tablename__ = "lesson_content"
    __table_args__ = (
        UniqueConstraint(
            "lesson_id", "position", name="uq_lesson_content_lesson_position"
        ),
        UniqueConstraint(
            "lesson_id",
            "content_type",
            "content_id",
            name="uq_lesson_content_lesson_type_content",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    lesson_id: Mapped[int] = mapped_column(ForeignKey("lesson.id"), nullable=False)
    content_type: Mapped[LessonContentType] = mapped_column(SQLEnum(LessonContentType), nullable=False)
    content_id: Mapped[int] = mapped_column(nullable=False)
    media_url: Mapped[str | None] = mapped_column(nullable=True)
    position: Mapped[int] = mapped_column(default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)

    lesson: Mapped["LessonModel"] = relationship(back_populates="contents")
    progresses: Mapped[list["LessonContentProgressModel"]] = relationship(back_populates="lesson_content")
    comments: Mapped[list["CommentModel"]] = relationship(
        back_populates="lesson_content"
    )
