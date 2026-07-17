from datetime import datetime, UTC
from typing import TYPE_CHECKING, Optional
from sqlalchemy import ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base
from src.models.base_model import TeacherRegisterStatus

if TYPE_CHECKING:
    from src.models.user_model import UserModel

class TeacherRegisterModel(Base):
    __tablename__ = 'teacher_register'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    teacher_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    motivation: Mapped[str | None] = mapped_column(nullable=True)
    cccd: Mapped[str] = mapped_column(unique=True, nullable=False)
    cccd_front_url: Mapped[str | None] = mapped_column(nullable=True)
    cccd_back_url: Mapped[str | None] = mapped_column(nullable=True)
    status: Mapped[TeacherRegisterStatus] = mapped_column(
        SQLEnum(TeacherRegisterStatus), 
        nullable=False, 
        default=TeacherRegisterStatus.PENDING
    )
    reviewed_note: Mapped[str | None] = mapped_column(nullable=True)
    reviewed_by: Mapped[int | None] = mapped_column(ForeignKey("user.id"), nullable=True)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
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
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    teacher: Mapped["UserModel"] = relationship(
        "UserModel", foreign_keys=[teacher_id], back_populates="teacher_registrations"
    )
    reviewer: Mapped[Optional["UserModel"]] = relationship(
        "UserModel", foreign_keys=[reviewed_by], back_populates="reviewed_registrations"
    )
