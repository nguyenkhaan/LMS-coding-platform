from datetime import datetime, UTC
from typing import List, TYPE_CHECKING
from sqlalchemy import ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base
from src.models.base_model import LessonContentType

if TYPE_CHECKING:
    from src.models.lesson_model import LessonModel
    from src.models.lesson_content_progress_model import LessonContentProgressModel
    from src.models.comment_model import CommentModel

class LessonContentModel(Base):
    __tablename__ = 'lesson_content'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    lesson_id: Mapped[int] = mapped_column(ForeignKey("lesson.id"), nullable=False)
    content_type: Mapped[LessonContentType] = mapped_column(SQLEnum(LessonContentType), nullable=False)
    content_id: Mapped[int] = mapped_column(nullable=False)
    media_url: Mapped[str | None] = mapped_column(nullable=True)
    position: Mapped[int] = mapped_column(default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(UTC), 
        nullable=False
    )

    # Relationships
    lesson: Mapped["LessonModel"] = relationship(back_populates="contents")
    progresses: Mapped[List["LessonContentProgressModel"]] = relationship(back_populates="lesson_content", cascade="all, delete-orphan")
    comments: Mapped[List["CommentModel"]] = relationship(back_populates="lesson_content", cascade="all, delete-orphan")
