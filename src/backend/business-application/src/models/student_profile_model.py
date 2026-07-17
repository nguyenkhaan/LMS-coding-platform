from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING
from src.db import Base

if TYPE_CHECKING:
    from src.models.user_model import UserModel

class StudentProfileModel(Base):
    __tablename__ = 'student_profile'
    
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), primary_key=True)
    bio: Mapped[str | None] = mapped_column(nullable=True)
    school: Mapped[str | None] = mapped_column(nullable=True)
    major: Mapped[str | None] = mapped_column(nullable=True)
    github_url: Mapped[str | None] = mapped_column(nullable=True)
    facebook_url: Mapped[str | None] = mapped_column(nullable=True)
    linkedln_url: Mapped[str | None] = mapped_column(nullable=True)

    # Relationships
    user: Mapped["UserModel"] = relationship(back_populates="student_profile")
