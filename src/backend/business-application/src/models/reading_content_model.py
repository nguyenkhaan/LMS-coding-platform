from sqlalchemy import Text
from sqlalchemy.orm import Mapped, mapped_column

from src.db import Base
from src.models.base_model import TimestampMixin


class ReadingContentModel(TimestampMixin, Base):
    __tablename__ = "reading_content"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
