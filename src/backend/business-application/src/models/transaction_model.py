from datetime import datetime, UTC
from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, DateTime, Float, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base
from src.models.base_model import PaymentMethod, PaymentStatus

if TYPE_CHECKING:
    from src.models.user_model import UserModel
    from src.models.course_model import CourseModel

class TransactionModel(Base):
    __tablename__ = 'transaction'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"), nullable=False)
    payment_method: Mapped[PaymentMethod] = mapped_column(SQLEnum(PaymentMethod), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    status: Mapped[PaymentStatus] = mapped_column(SQLEnum(PaymentStatus), nullable=False, default=PaymentStatus.PENDING)
    transaction_code: Mapped[str] = mapped_column(unique=True, nullable=False)
    payos_code: Mapped[str | None] = mapped_column(unique=True, nullable=True)
    payos_link: Mapped[str | None] = mapped_column(nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(UTC), 
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(UTC), 
        onupdate=lambda: datetime.now(UTC), 
        nullable=False
    )

    # Relationships
    user: Mapped["UserModel"] = relationship(back_populates="transactions")
    course: Mapped["CourseModel"] = relationship(back_populates="transactions")
