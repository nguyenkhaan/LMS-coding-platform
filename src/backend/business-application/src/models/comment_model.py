from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Index, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import TimestampMixin

if TYPE_CHECKING:
    from src.models.lesson_content_model import LessonContentModel
    from src.models.user_model import UserModel


class CommentModel(TimestampMixin, Base):
    __tablename__ = "comment"
    __table_args__ = (
        Index(
            "ix_comment_lesson_content_created_at",
            "lesson_content_id",
            "created_at",
        ),
        Index("ix_comment_parent_id", "parent_id"),
        Index("ix_comment_user_id", "user_id"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    lesson_content_id: Mapped[int] = mapped_column(
        ForeignKey("lesson_content.id"), nullable=False
    )
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    parent_id: Mapped[int | None] = mapped_column(
        ForeignKey("comment.id", ondelete="CASCADE"), nullable=True
    )
    content: Mapped[str] = mapped_column(Text, nullable=False)
    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    lesson_content: Mapped["LessonContentModel"] = relationship(
        back_populates="comments"
    )
    user: Mapped["UserModel"] = relationship(back_populates="comments")
    parent: Mapped["CommentModel | None"] = relationship(
        back_populates="replies", remote_side=[id]
    )
    replies: Mapped[list["CommentModel"]] = relationship(
        back_populates="parent", passive_deletes="all"
    )
