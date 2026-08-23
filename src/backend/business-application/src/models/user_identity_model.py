from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Index, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import TimestampMixin

if TYPE_CHECKING:
    from src.models.user_model import UserModel


class UserIdentityModel(TimestampMixin, Base):
    __tablename__ = "user_identity"
    __table_args__ = (
        UniqueConstraint(
            "provider", "provider_id", name="uq_user_identity_provider_provider_id"
        ),
        UniqueConstraint(
            "user_id", "provider", name="uq_user_identity_user_provider"
        ),
        Index("ix_user_identity_user_id", "user_id"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    provider: Mapped[str] = mapped_column(nullable=False)
    provider_id: Mapped[str] = mapped_column(nullable=False)

    user: Mapped["UserModel"] = relationship(back_populates="identities")
