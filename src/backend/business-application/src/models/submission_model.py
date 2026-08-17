from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey, Numeric, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import ProblemSubmissionStatus, utc_now

if TYPE_CHECKING:
    from src.models.language_model import LanguageModel
    from src.models.problem_model import ProblemModel
    from src.models.submission_result_detail_model import SubmissionResultDetailModel
    from src.models.user_model import UserModel


class SubmissionModel(Base):
    __tablename__ = "submission"

    id: Mapped[int] = mapped_column(primary_key=True)
    problem_id: Mapped[int] = mapped_column(ForeignKey("problem.id"), nullable=False)
    student_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    language_id: Mapped[int] = mapped_column(ForeignKey("language.id"), nullable=False)
    source_code: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[ProblemSubmissionStatus] = mapped_column(SQLEnum(ProblemSubmissionStatus), nullable=False)
    score: Mapped[float] = mapped_column(Numeric, default=0, nullable=True)
    runtime_ms: Mapped[float] = mapped_column(Numeric, default=0, nullable=True)
    memory_kb: Mapped[float] = mapped_column(Numeric, default=0, nullable=True)
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)

    problem: Mapped["ProblemModel"] = relationship(back_populates="submissions")
    student: Mapped["UserModel"] = relationship(back_populates="problem_submissions")
    language: Mapped["LanguageModel"] = relationship(back_populates="submissions")
    results: Mapped[list["SubmissionResultDetailModel"]] = relationship(back_populates="submission")
