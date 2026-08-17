from typing import TYPE_CHECKING

from sqlalchemy import Enum as SQLEnum, ForeignKey, Numeric, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import ProblemSubmissionStatus

if TYPE_CHECKING:
    from src.models.submission_model import SubmissionModel
    from src.models.testcase_model import TestcaseModel


class SubmissionResultDetailModel(Base):
    __tablename__ = "submission_result_detail"
    __table_args__ = (UniqueConstraint("submission_id", "testcase_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    submission_id: Mapped[int] = mapped_column(ForeignKey("submission.id"), nullable=False)
    testcase_id: Mapped[int] = mapped_column(ForeignKey("testcase.id"), nullable=False)
    status: Mapped[ProblemSubmissionStatus] = mapped_column(SQLEnum(ProblemSubmissionStatus), nullable=False)
    runtime_ms: Mapped[float] = mapped_column(Numeric, default=0, nullable=True)
    memory_kb: Mapped[float] = mapped_column(Numeric, default=0, nullable=True)

    submission: Mapped["SubmissionModel"] = relationship(back_populates="results")
    testcase: Mapped["TestcaseModel"] = relationship(back_populates="submission_details")
