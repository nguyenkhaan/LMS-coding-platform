from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Date, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import TimestampMixin

if TYPE_CHECKING:
    from src.models.user_model import UserModel


class StudentDailyActivityModel(TimestampMixin, Base):
    __tablename__ = "student_daily_activity"
    __table_args__ = (UniqueConstraint("student_id", "activity_date"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    activity_date: Mapped[date] = mapped_column(Date, nullable=False)
    contribution_count: Mapped[int] = mapped_column(default=0, nullable=False)
    study_seconds: Mapped[int] = mapped_column(default=0, nullable=False)
    solved_problem_count: Mapped[int] = mapped_column(default=0, nullable=False)

    student: Mapped["UserModel"] = relationship(back_populates="daily_activities")
