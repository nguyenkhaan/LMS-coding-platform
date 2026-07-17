from typing import List, TYPE_CHECKING
from sqlalchemy import ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base

if TYPE_CHECKING:
    from src.models.quiz_model import QuizModel
    from src.models.quiz_option_model import QuizOptionModel

class QuizQuestionModel(Base):
    __tablename__ = 'quiz_questions'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    quiz_id: Mapped[int] = mapped_column(ForeignKey("quizzes.id"), nullable=False)
    title: Mapped[str] = mapped_column(nullable=False)
    content: Mapped[str] = mapped_column(nullable=False)
    question_type: Mapped[str] = mapped_column(nullable=False)
    points: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    # Relationships
    quiz: Mapped["QuizModel"] = relationship(back_populates="questions")
    options: Mapped[List["QuizOptionModel"]] = relationship(back_populates="question", cascade="all, delete-orphan")
