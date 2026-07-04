
from sqlalchemy import Enum 

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING
from src.db import Base
from src.models.base_model import SystemPosition, SystemRole
if TYPE_CHECKING: 
    from src.models.user_model import UserModel
# TYPE_CHECKING duoc su dung de xu ly mot loi rat pho bien: circular_import chi phuc vu type hint => Giup 
# cho no khong import luc runetime 
class RoleModel(Base): 
    __tablename__ = "role" 
    id : Mapped[int] = mapped_column(primary_key=True) 
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id")) 
    user : Mapped["UserModel"] = relationship(back_populates="roles") 
    system_role: Mapped[SystemRole] = mapped_column(Enum(SystemRole) , default=SystemRole.USER , nullable=False)# User, Amin, Manager 
    system_position : Mapped[SystemPosition] = mapped_column(Enum(SystemPosition) , default=SystemPosition.STUDENT , nullable=False)  #Teacher, Student 