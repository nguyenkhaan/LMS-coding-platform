from datetime import datetime, UTC
from typing import List, TYPE_CHECKING
from sqlalchemy import ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base

if TYPE_CHECKING:
    from src.models.user_model import UserModel
    from src.models.course_model import CourseModel
    from src.models.problem_model import ProblemModel

class TeacherProfileModel(Base):
    __tablename__ = 'teacher_profile'
    
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), primary_key=True)
    bio: Mapped[str | None] = mapped_column(nullable=True)
    school_address: Mapped[str | None] = mapped_column(nullable=True)
    verified: Mapped[bool] = mapped_column(default=False, nullable=False)
    cv_url: Mapped[str | None] = mapped_column(nullable=True)
    created_at : Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default = lambda : datetime.now(UTC), 
        nullable = False 
    ) 
    updated_at : Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default = lambda : datetime.now(UTC), 
        onupdate = lambda : datetime.now(UTC), 
        nullable = False 
    )

    # Relationships
    user: Mapped["UserModel"] = relationship(back_populates="teacher_profile")
    courses: Mapped[List["CourseModel"]] = relationship(back_populates="teacher", cascade="all, delete-orphan")
    problems: Mapped[List["ProblemModel"]] = relationship(back_populates="teacher", cascade="all, delete-orphan")
