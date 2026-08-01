from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING
from sqlalchemy import Enum as SQLEnum 
from src.db import Base
from src.models.base_model import Role 
if TYPE_CHECKING:
    from src.models.user_model import UserModel

class RoleModel(Base):
    __tablename__ = "user_role"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["UserModel"] = relationship(back_populates="roles")
    role : Mapped[Role] =  mapped_column(
        SQLEnum(Role), 
        nullable=False, 
        default = Role.STUDENT
    )
