from datetime import datetime, UTC
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import ForeignKey, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base

if TYPE_CHECKING:
    from src.models.user_model import UserModel
    from src.models.lesson_content_model import LessonContentModel

class CommentModel(Base):
    __tablename__ = 'comment'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    lesson_content_id: Mapped[int] = mapped_column(ForeignKey("lesson_content.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    parent_id: Mapped[int | None] = mapped_column(ForeignKey("comment.id"), nullable=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(UTC), 
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(UTC), 
        onupdate=lambda: datetime.now(UTC), 
        nullable=False
    )

    # Relationships
    user: Mapped["UserModel"] = relationship(back_populates="comments")
    lesson_content: Mapped["LessonContentModel"] = relationship(back_populates="comments")
    parent: Mapped[Optional["CommentModel"]] = relationship("CommentModel", remote_side=[id], back_populates="replies")
    replies: Mapped[List["CommentModel"]] = relationship("CommentModel", back_populates="parent", cascade="all, delete-orphan")
