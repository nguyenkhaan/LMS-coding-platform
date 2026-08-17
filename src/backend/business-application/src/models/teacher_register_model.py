from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Date, DateTime, Enum as SQLEnum, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import TeacherRegisterStatus, TimestampMixin, utc_now

if TYPE_CHECKING:
    from src.models.teacher_profile_model import TeacherProfileModel
    from src.models.teacher_register_history_model import TeacherRegisterHistoryModel


class TeacherRegisterModel(TimestampMixin, Base):
    __tablename__ = "teacher_register"
    __table_args__ = (UniqueConstraint("teacher_profile_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    teacher_profile_id: Mapped[int] = mapped_column(
        ForeignKey("teacher_profile.user_id"), nullable=False
    )
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    education_evidence_urls: Mapped[str | None] = mapped_column(Text, nullable=True)
    legal_full_name: Mapped[str | None] = mapped_column(nullable=True)
    date_of_birth: Mapped[date | None] = mapped_column(Date, nullable=True)
    identity_number: Mapped[str] = mapped_column(unique=True, nullable=False)
    identity_front_url: Mapped[str | None] = mapped_column(nullable=True)
    identity_back_url: Mapped[str | None] = mapped_column(nullable=True)
    selfie_with_id_url: Mapped[str | None] = mapped_column(nullable=True)
    cv_url: Mapped[str | None] = mapped_column(nullable=True)
    motivation: Mapped[str | None] = mapped_column(Text, default="", nullable=True)
    status: Mapped[TeacherRegisterStatus] = mapped_column(
        SQLEnum(TeacherRegisterStatus), default=TeacherRegisterStatus.DRAFT, nullable=False
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    teacher_profile: Mapped["TeacherProfileModel"] = relationship(back_populates="registration")
    history: Mapped[list["TeacherRegisterHistoryModel"]] = relationship(back_populates="teacher_register")
