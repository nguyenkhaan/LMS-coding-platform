from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey, Numeric, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import Currency, PayoutStatus, TimestampMixin, utc_now

if TYPE_CHECKING:
    from src.models.transaction_model import TransactionModel
    from src.models.user_model import UserModel


class WalletModel(TimestampMixin, Base):
    __tablename__ = "wallet"

    id: Mapped[int] = mapped_column(primary_key=True)
    teacher_id: Mapped[int] = mapped_column(ForeignKey("user.id"), unique=True, nullable=False)
    available_balance: Mapped[float] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    pending_balance: Mapped[float] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    currency: Mapped[Currency] = mapped_column(SQLEnum(Currency), default=Currency.USD, nullable=False)

    teacher: Mapped["UserModel"] = relationship(back_populates="wallet")
    ledger_entries: Mapped[list["WalletLedgerModel"]] = relationship(back_populates="wallet")
    payout_requests: Mapped[list["PayoutRequestModel"]] = relationship(back_populates="wallet")


class WalletLedgerModel(Base):
    __tablename__ = "wallet_ledger"

    id: Mapped[int] = mapped_column(primary_key=True)
    wallet_id: Mapped[int] = mapped_column(ForeignKey("wallet.id"), nullable=False)
    transaction_id: Mapped[int | None] = mapped_column(ForeignKey("transaction.id"), nullable=True)
    payout_request_id: Mapped[int | None] = mapped_column(ForeignKey("payout_request.id"), nullable=True)
    entry_type: Mapped[str] = mapped_column(nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[Currency] = mapped_column(SQLEnum(Currency), default=Currency.USD, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)

    wallet: Mapped["WalletModel"] = relationship(back_populates="ledger_entries")
    transaction: Mapped["TransactionModel | None"] = relationship(back_populates="ledger_entries")
    payout_request: Mapped["PayoutRequestModel | None"] = relationship(back_populates="ledger_entries")


class PayoutRequestModel(TimestampMixin, Base):
    __tablename__ = "payout_request"

    id: Mapped[int] = mapped_column(primary_key=True)
    wallet_id: Mapped[int] = mapped_column(ForeignKey("wallet.id"), nullable=False)
    teacher_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[Currency] = mapped_column(SQLEnum(Currency), default=Currency.USD, nullable=False)
    status: Mapped[PayoutStatus] = mapped_column(SQLEnum(PayoutStatus), default=PayoutStatus.PENDING, nullable=False)
    reviewed_by: Mapped[int | None] = mapped_column(ForeignKey("user.id"), nullable=True)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    settlement_reference: Mapped[str | None] = mapped_column(nullable=True)
    failure_reason: Mapped[str | None] = mapped_column(Text, nullable=True)

    wallet: Mapped["WalletModel"] = relationship(back_populates="payout_requests")
    teacher: Mapped["UserModel"] = relationship(back_populates="payout_requests", foreign_keys=[teacher_id])
    reviewer: Mapped["UserModel | None"] = relationship(back_populates="reviewed_payout_requests", foreign_keys=[reviewed_by])
    ledger_entries: Mapped[list["WalletLedgerModel"]] = relationship(back_populates="payout_request")
