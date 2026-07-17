from datetime import datetime, UTC
from typing import List, TYPE_CHECKING
from sqlalchemy import ForeignKey, DateTime, Text, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base
from src.models.base_model import ProblemDifficulty

if TYPE_CHECKING:
    from src.models.teacher_profile_model import TeacherProfileModel
    from src.models.problem_config_model import ProblemConfigModel
    from src.models.testcase_model import TestcaseModel
    from src.models.submission_model import SubmissionModel
    from src.models.problem_tag_model import ProblemTagModel

class ProblemModel(Base):
    __tablename__ = 'problem'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    teacher_id: Mapped[int] = mapped_column(ForeignKey("teacher_profile.user_id"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(nullable=False)
    slug: Mapped[str] = mapped_column(unique=True, index=True, nullable=False)
    statement: Mapped[str] = mapped_column(Text, nullable=False)
    input_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    output_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    constraints: Mapped[str | None] = mapped_column(Text, nullable=True)
    sample_input: Mapped[str | None] = mapped_column(Text, nullable=True)
    sample_output: Mapped[str | None] = mapped_column(Text, nullable=True)
    explanation: Mapped[str | None] = mapped_column(Text, nullable=True)
    difficulty: Mapped[ProblemDifficulty] = mapped_column(SQLEnum(ProblemDifficulty), nullable=False)
    public: Mapped[bool] = mapped_column(default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(UTC), 
        nullable=False
    )

    # Relationships
    teacher: Mapped["TeacherProfileModel"] = relationship(back_populates="problems")
    configs: Mapped[List["ProblemConfigModel"]] = relationship(back_populates="problem", cascade="all, delete-orphan")
    testcases: Mapped[List["TestcaseModel"]] = relationship(back_populates="problem", cascade="all, delete-orphan")
    submissions: Mapped[List["SubmissionModel"]] = relationship(back_populates="problem", cascade="all, delete-orphan")
    
    # Many-to-many relationship with tags
    tags: Mapped[List["ProblemTagModel"]] = relationship(
        secondary="problem_tag_map", 
        back_populates="problems"
    )
