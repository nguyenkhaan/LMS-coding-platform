from typing import List, TYPE_CHECKING
from sqlalchemy import Table, Column, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base

if TYPE_CHECKING:
    from src.models.problem_model import ProblemModel

# Association table for problem <-> tag many-to-many relationship
problem_tag_map = Table(
    "problem_tag_map",
    Base.metadata,
    Column("problem_id", Integer, ForeignKey("problem.id"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("problem_tag.id"), primary_key=True)
)

class ProblemTagModel(Base):
    __tablename__ = 'problem_tag'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    tag_name: Mapped[str] = mapped_column(nullable=False)

    # Relationships
    problems: Mapped[List["ProblemModel"]] = relationship(
        secondary=problem_tag_map, 
        back_populates="tags"
    )
