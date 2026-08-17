from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey, Numeric, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import ProblemDifficulty, utc_now

if TYPE_CHECKING:
    from src.models.problem_config_model import ProblemConfigModel
    from src.models.problem_tag_mapping_model import ProblemTagMappingModel
    from src.models.submission_model import SubmissionModel
    from src.models.testcase_model import TestcaseModel
    from src.models.user_model import UserModel


class ProblemModel(Base):
    __tablename__ = "problem"

    id: Mapped[int] = mapped_column(primary_key=True)
    teacher_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    title: Mapped[str] = mapped_column(nullable=False)
    slug: Mapped[str] = mapped_column(unique=True, nullable=False)
    statement: Mapped[str] = mapped_column(Text, nullable=False)
    input_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    output_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    constraints: Mapped[str | None] = mapped_column(Text, nullable=True)
    sample_input: Mapped[str | None] = mapped_column(Text, nullable=True)
    sample_output: Mapped[str | None] = mapped_column(Text, nullable=True)
    explanation: Mapped[str | None] = mapped_column(Text, nullable=True)
    difficulty: Mapped[ProblemDifficulty] = mapped_column(SQLEnum(ProblemDifficulty), nullable=False)
    passing_score: Mapped[float] = mapped_column(Numeric, default=0, nullable=False)
    public: Mapped[bool] = mapped_column(default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)

    teacher: Mapped["UserModel"] = relationship(back_populates="authored_problems")
    configs: Mapped[list["ProblemConfigModel"]] = relationship(back_populates="problem")
    testcases: Mapped[list["TestcaseModel"]] = relationship(back_populates="problem")
    submissions: Mapped[list["SubmissionModel"]] = relationship(back_populates="problem")
    tag_mappings: Mapped[list["ProblemTagMappingModel"]] = relationship(back_populates="problem")
