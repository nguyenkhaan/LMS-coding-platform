from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import AuditAction, utc_now

if TYPE_CHECKING:
    from src.models.user_model import UserModel


class AuditLogModel(Base):
    __tablename__ = "audit_log"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    action: Mapped[AuditAction] = mapped_column(SQLEnum(AuditAction), nullable=False)
    target_type: Mapped[str | None] = mapped_column(nullable=True)
    target_id: Mapped[int | None] = mapped_column(nullable=True)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    correlation_id: Mapped[str | None] = mapped_column(nullable=True)
    do_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)

    user: Mapped["UserModel"] = relationship(back_populates="audit_logs")
