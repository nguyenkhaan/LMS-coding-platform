from typing import List, TYPE_CHECKING
from sqlalchemy import Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base

if TYPE_CHECKING:
    from src.models.problem_config_model import ProblemConfigModel
    from src.models.submission_model import SubmissionModel

class LanguageModel(Base):
    __tablename__ = 'language'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    default_time_limit: Mapped[float] = mapped_column(Float, default=1000.0, nullable=False)
    default_memory_limit: Mapped[float] = mapped_column(Float, default=256.0, nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)

    # Relationships
    configs: Mapped[List["ProblemConfigModel"]] = relationship(back_populates="language", cascade="all, delete-orphan")
    submissions: Mapped[List["SubmissionModel"]] = relationship(back_populates="language", cascade="all, delete-orphan")
