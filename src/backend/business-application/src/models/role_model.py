from typing import TYPE_CHECKING

from sqlalchemy import Enum as SQLEnum, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base
from src.models.base_model import Role

if TYPE_CHECKING:
    from src.models.user_model import UserModel


class UserRoleModel(Base):
    __tablename__ = "user_role"
    __table_args__ = (UniqueConstraint("user_id", "role"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    role: Mapped[Role] = mapped_column(SQLEnum(Role), nullable=False)

    user: Mapped["UserModel"] = relationship(back_populates="roles")


RoleModel = UserRoleModel
