from src.models.base_model import Role
from src.db import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Enum as SQLEnum, ForeignKey 
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.user_model import UserModel

class UserRoleModel(Base): 
    __tablename__ = 'user_role'
    id : Mapped[int] = mapped_column(primary_key=True)
    user_id : Mapped[int] = mapped_column(
        ForeignKey("user.id")
    ) 
    role : Mapped[Role] =  mapped_column(
        SQLEnum(Role), 
        nullable=False, 
        default = Role.STUDENT
    )

    # relationship 
    user : Mapped["UserModel"] = relationship(back_populates="roles") 

RoleModel = UserRoleModel
