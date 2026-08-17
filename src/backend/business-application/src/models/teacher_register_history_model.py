from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import TeacherRegisterStatus, utc_now

if TYPE_CHECKING:
    from src.models.teacher_register_model import TeacherRegisterModel
    from src.models.user_model import UserModel


class TeacherRegisterHistoryModel(Base):
    __tablename__ = "teacher_register_history"

    id: Mapped[int] = mapped_column(primary_key=True)
    teacher_register_id: Mapped[int] = mapped_column(ForeignKey("teacher_register.id"), nullable=False)
    status: Mapped[TeacherRegisterStatus] = mapped_column(SQLEnum(TeacherRegisterStatus), nullable=False)
    reviewed_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    acted_by: Mapped[int | None] = mapped_column(ForeignKey("user.id"), nullable=True)

    teacher_register: Mapped["TeacherRegisterModel"] = relationship(back_populates="history")
    actor: Mapped["UserModel | None"] = relationship(back_populates="teacher_register_history_actions")
