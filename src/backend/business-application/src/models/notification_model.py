from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import NotificationType, utc_now

if TYPE_CHECKING:
    from src.models.user_model import UserModel


class NotificationModel(Base):
    __tablename__ = "notification"

    id: Mapped[int] = mapped_column(primary_key=True)
    sender_id: Mapped[int | None] = mapped_column(ForeignKey("user.id"), nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    type: Mapped[NotificationType] = mapped_column(SQLEnum(NotificationType), nullable=False)
    target_type: Mapped[str | None] = mapped_column(nullable=True)
    target_id: Mapped[int | None] = mapped_column(nullable=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)

    sender: Mapped["UserModel | None"] = relationship(back_populates="notifications_sent", foreign_keys=[sender_id])
    recipient: Mapped["UserModel"] = relationship(back_populates="notifications_received", foreign_keys=[user_id])
