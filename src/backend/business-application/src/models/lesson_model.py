from datetime import datetime, UTC
from typing import List, TYPE_CHECKING
from sqlalchemy import ForeignKey, DateTime, Text, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base

if TYPE_CHECKING:
    from src.models.section_model import SectionModel
    from src.models.lesson_content_model import LessonContentModel

class LessonModel(Base):
    __tablename__ = 'lesson'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    section_id: Mapped[int] = mapped_column(ForeignKey("sections.id"), nullable=False)
    title: Mapped[str] = mapped_column(nullable=False)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    position: Mapped[int] = mapped_column(default=0, nullable=False)
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
    section: Mapped["SectionModel"] = relationship(back_populates="lessons")
    contents: Mapped[List["LessonContentModel"]] = relationship(back_populates="lesson", cascade="all, delete-orphan")
