from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base

if TYPE_CHECKING:
    from src.models.problem_tag_mapping_model import ProblemTagMappingModel


class ProblemTagModel(Base):
    __tablename__ = "problem_tag"

    id: Mapped[int] = mapped_column(primary_key=True)
    tag_name: Mapped[str] = mapped_column(unique=True, nullable=False)

    problem_mappings: Mapped[list["ProblemTagMappingModel"]] = relationship(back_populates="tag")
