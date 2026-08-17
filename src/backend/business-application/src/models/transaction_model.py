from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import PaymentStatus, TimestampMixin

if TYPE_CHECKING:
    from src.models.course_model import CourseModel
    from src.models.user_model import UserModel
    from src.models.wallet_model import WalletLedgerModel


class TransactionModel(TimestampMixin, Base):
    __tablename__ = "transaction"

    id: Mapped[int] = mapped_column(primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    status: Mapped[PaymentStatus] = mapped_column(
        SQLEnum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False
    )
    transaction_code: Mapped[str] = mapped_column(unique=True, nullable=False)
    payos_code: Mapped[str | None] = mapped_column(unique=True, nullable=True)
    payos_link: Mapped[str | None] = mapped_column(nullable=True)
    idempotency_key: Mapped[str] = mapped_column(unique=True, nullable=False)
    signature_verified: Mapped[bool] = mapped_column(default=False, nullable=False)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    student: Mapped["UserModel"] = relationship(back_populates="transactions")
    course: Mapped["CourseModel"] = relationship(back_populates="transactions")
    ledger_entries: Mapped[list["WalletLedgerModel"]] = relationship(back_populates="transaction")
