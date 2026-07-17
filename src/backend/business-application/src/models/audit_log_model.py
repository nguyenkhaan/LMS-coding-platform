from datetime import datetime, UTC
from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, DateTime, Text, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base
from src.models.base_model import ActionType

if TYPE_CHECKING:
    from src.models.user_model import UserModel

class AuditLogModel(Base):
    __tablename__ = 'audit_log'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    action: Mapped[ActionType] = mapped_column(SQLEnum(ActionType), nullable=False)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    do_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(UTC), 
        nullable=False
    )

    # Relationships
    user: Mapped["UserModel"] = relationship(back_populates="audit_logs")
