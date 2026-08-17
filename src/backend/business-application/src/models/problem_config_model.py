from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Numeric, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base

if TYPE_CHECKING:
    from src.models.language_model import LanguageModel
    from src.models.problem_model import ProblemModel


class ProblemConfigModel(Base):
    __tablename__ = "problem_config"
    __table_args__ = (UniqueConstraint("problem_id", "language_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    problem_id: Mapped[int] = mapped_column(ForeignKey("problem.id"), nullable=False)
    language_id: Mapped[int] = mapped_column(ForeignKey("language.id"), nullable=False)
    time_limit_ms: Mapped[float] = mapped_column(Numeric, nullable=False)
    memory_limit_mb: Mapped[float] = mapped_column(Numeric, nullable=False)

    problem: Mapped["ProblemModel"] = relationship(back_populates="configs")
    language: Mapped["LanguageModel"] = relationship(back_populates="configs")
