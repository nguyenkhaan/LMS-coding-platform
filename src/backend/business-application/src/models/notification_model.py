from datetime import datetime, UTC
from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base

if TYPE_CHECKING:
    from src.models.user_model import UserModel

class NotificationModel(Base):
    __tablename__ = 'notification'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    sender_id: Mapped[int | None] = mapped_column(ForeignKey("user.id"), nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(UTC), 
        nullable=False
    )

    # Relationships
    sender: Mapped["UserModel"] = relationship("UserModel", foreign_keys=[sender_id], back_populates="notifications_sent")
    recipient: Mapped["UserModel"] = relationship("UserModel", foreign_keys=[user_id], back_populates="notifications_received")
