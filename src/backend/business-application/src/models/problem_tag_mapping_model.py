from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base

if TYPE_CHECKING:
    from src.models.problem_model import ProblemModel
    from src.models.problem_tag_model import ProblemTagModel


class ProblemTagMappingModel(Base):
    __tablename__ = "problem_tag_mapping"
    __table_args__ = (UniqueConstraint("problem_id", "tag_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    problem_id: Mapped[int] = mapped_column(ForeignKey("problem.id"), nullable=False)
    tag_id: Mapped[int] = mapped_column(ForeignKey("problem_tag.id"), nullable=False)

    problem: Mapped["ProblemModel"] = relationship(back_populates="tag_mappings")
    tag: Mapped["ProblemTagModel"] = relationship(back_populates="problem_mappings")
