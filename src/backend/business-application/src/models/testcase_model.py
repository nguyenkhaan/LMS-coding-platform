from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Numeric, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base

if TYPE_CHECKING:
    from src.models.problem_model import ProblemModel
    from src.models.submission_result_detail_model import SubmissionResultDetailModel


class TestcaseModel(Base):
    __tablename__ = "testcase"

    id: Mapped[int] = mapped_column(primary_key=True)
    problem_id: Mapped[int] = mapped_column(ForeignKey("problem.id"), nullable=False)
    input_file: Mapped[str] = mapped_column(Text, nullable=False)
    output_file: Mapped[str] = mapped_column(Text, nullable=False)
    score: Mapped[float] = mapped_column(Numeric, default=0, nullable=False)
    is_hidden: Mapped[bool] = mapped_column(default=False, nullable=False)

    problem: Mapped["ProblemModel"] = relationship(back_populates="testcases")
    submission_details: Mapped[list["SubmissionResultDetailModel"]] = relationship(back_populates="testcase")
