from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base

if TYPE_CHECKING:
    from src.models.quiz_question_model import QuizQuestionModel

class QuizOptionModel(Base):
    __tablename__ = 'quiz_options'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    question_id: Mapped[int] = mapped_column(ForeignKey("quiz_questions.id"), nullable=False)
    content: Mapped[str] = mapped_column(nullable=False)
    is_correct: Mapped[bool] = mapped_column(default=False, nullable=False)

    # Relationships
    question: Mapped["QuizQuestionModel"] = relationship(back_populates="options")
