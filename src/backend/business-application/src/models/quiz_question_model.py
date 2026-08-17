from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Numeric, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base

if TYPE_CHECKING:
    from src.models.quiz_model import QuizModel
    from src.models.quiz_option_model import QuizOptionModel


class QuizQuestionModel(Base):
    __tablename__ = "quiz_questions"

    id: Mapped[int] = mapped_column(primary_key=True)
    quiz_id: Mapped[int] = mapped_column(ForeignKey("quizzes.id"), nullable=False)
    title: Mapped[str | None] = mapped_column(nullable=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    question_type: Mapped[str] = mapped_column(nullable=False)
    points: Mapped[float] = mapped_column(Numeric, default=0, nullable=False)

    quiz: Mapped["QuizModel"] = relationship(back_populates="questions")
    options: Mapped[list["QuizOptionModel"]] = relationship(back_populates="question")
