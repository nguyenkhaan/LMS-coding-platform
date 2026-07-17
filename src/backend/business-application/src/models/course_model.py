from datetime import datetime, UTC
from typing import List, TYPE_CHECKING
from sqlalchemy import ForeignKey, DateTime, Enum as SQLEnum, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base
from src.models.base_model import CourseStatus

if TYPE_CHECKING:
    from src.models.teacher_profile_model import TeacherProfileModel
    from src.models.section_model import SectionModel
    from src.models.enrollment_model import EnrollmentModel
    from src.models.transaction_model import TransactionModel

class CourseModel(Base):
    __tablename__ = 'courses'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(nullable=False)
    teacher_id: Mapped[int] = mapped_column(ForeignKey("teacher_profile.user_id"), nullable=False)
    slug: Mapped[str] = mapped_column(unique=True, nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    field: Mapped[str | None] = mapped_column(nullable=True)
    tags: Mapped[str | None] = mapped_column(nullable=True)
    description: Mapped[str | None] = mapped_column(nullable=True)
    thumbnai_url: Mapped[str | None] = mapped_column(nullable=True)
    price: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    status: Mapped[CourseStatus] = mapped_column(
        SQLEnum(CourseStatus), 
        nullable=False, 
        default=CourseStatus.DRAFT
    )
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
    teacher: Mapped["TeacherProfileModel"] = relationship(back_populates="courses")
    sections: Mapped[List["SectionModel"]] = relationship(back_populates="course", cascade="all, delete-orphan")
    enrollments: Mapped[List["EnrollmentModel"]] = relationship(back_populates="course", cascade="all, delete-orphan")
    transactions: Mapped[List["TransactionModel"]] = relationship(back_populates="course", cascade="all, delete-orphan")
