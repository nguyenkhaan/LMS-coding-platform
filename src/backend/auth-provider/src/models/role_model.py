from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING

from src.db import Base

if TYPE_CHECKING:
    from src.models.user_model import UserModel

class RoleModel(Base):
    __tablename__ = "role"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["UserModel"] = relationship(back_populates="roles")
    system_role: Mapped[str] = mapped_column(nullable=False)
    system_position: Mapped[str] = mapped_column(nullable=False)
