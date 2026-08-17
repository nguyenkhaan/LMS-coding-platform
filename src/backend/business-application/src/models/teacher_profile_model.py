from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import TimestampMixin

if TYPE_CHECKING:
    from src.models.teacher_register_model import TeacherRegisterModel
    from src.models.user_model import UserModel


class TeacherProfileModel(TimestampMixin, Base):
    __tablename__ = "teacher_profile"

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), primary_key=True)
    avatar_url: Mapped[str | None] = mapped_column(nullable=True)
    headline: Mapped[str | None] = mapped_column(nullable=True)
    expertise_tags: Mapped[str | None] = mapped_column(Text, nullable=True)
    years_of_experience: Mapped[int | None] = mapped_column(nullable=True)
    education_entries: Mapped[str | None] = mapped_column(Text, nullable=True)
    experience_entries: Mapped[str | None] = mapped_column(Text, nullable=True)
    github_url: Mapped[str | None] = mapped_column(nullable=True)
    linkedin_url: Mapped[str | None] = mapped_column(nullable=True)
    website_url: Mapped[str | None] = mapped_column(nullable=True)
    email: Mapped[str | None] = mapped_column(nullable=True)
    phone: Mapped[str | None] = mapped_column(nullable=True)

    user: Mapped["UserModel"] = relationship(back_populates="teacher_profile")
    registration: Mapped["TeacherRegisterModel | None"] = relationship(
        back_populates="teacher_profile", uselist=False
    )
