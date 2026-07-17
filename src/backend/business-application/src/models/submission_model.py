from datetime import datetime, UTC
from typing import List, TYPE_CHECKING
from sqlalchemy import ForeignKey, DateTime, Text, Enum as SQLEnum, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base
from src.models.base_model import ProblemSubmissionStatus

if TYPE_CHECKING:
    from src.models.problem_model import ProblemModel
    from src.models.user_model import UserModel
    from src.models.language_model import LanguageModel
    from src.models.submission_result_detail_model import SubmissionResultDetailModel

class SubmissionModel(Base):
    __tablename__ = 'submission'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    problem_id: Mapped[int] = mapped_column(ForeignKey("problem.id"), nullable=False)
    student_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    language_id: Mapped[int] = mapped_column(ForeignKey("language.id"), nullable=False)
    source_code: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[ProblemSubmissionStatus] = mapped_column(SQLEnum(ProblemSubmissionStatus), nullable=False)
    score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    runtime_ms: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    memory_kb: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    submitted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(UTC), 
        nullable=False
    )

    # Relationships
    problem: Mapped["ProblemModel"] = relationship(back_populates="submissions")
    student: Mapped["UserModel"] = relationship(back_populates="problem_submissions")
    language: Mapped["LanguageModel"] = relationship(back_populates="submissions")
    results: Mapped[List["SubmissionResultDetailModel"]] = relationship(back_populates="submission", cascade="all, delete-orphan")
