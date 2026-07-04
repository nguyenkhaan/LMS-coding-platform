
from sqlalchemy import Enum 

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db import Base
from models.base_model import SystemPosition, SystemRole
from models.user_model import UserModel


class RoleModel(Base): 
    __tablename__ = "role" 
    id : Mapped[int] = mapped_column(primary_key=True) 
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id")) 
    user : Mapped["UserModel"] = relationship(back_populates="roles") 
    system_role: Mapped[SystemRole] = mapped_column(Enum(SystemRole) , default=SystemRole.USER , nullable=False)# User, Amin, Manager 
    system_position : Mapped[SystemPosition] = mapped_column(Enum(SystemPosition) , default=SystemPosition.STUDENT , nullable=False)  #Teacher, Student 