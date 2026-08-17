from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base

if TYPE_CHECKING:
    from src.models.user_model import UserModel


class StudentProfileModel(Base):
    __tablename__ = "student_profile"

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), primary_key=True)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    learning_preferences: Mapped[str | None] = mapped_column(Text, nullable=True)
    social_links: Mapped[str | None] = mapped_column(Text, nullable=True)

    user: Mapped["UserModel"] = relationship(back_populates="student_profile")
