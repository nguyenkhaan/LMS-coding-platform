
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Enum as SQLEnum
from models.user_model import UserModel
from src.db import Base
from models.base_model import LoginMethod


class UserIdentityModel(Base): 
    __tablename__ = 'user_identity'  
    id : Mapped[int] = mapped_column(primary_key=True) 
    user_id : Mapped[int] = mapped_column(ForeignKey("user.id" , ondelete="CASCADE") , nullable=False) 
    method : Mapped[LoginMethod] = mapped_column(SQLEnum(LoginMethod) , nullable=False , default=LoginMethod.LOCAL)
    provider_id : Mapped[str] = mapped_column(nullable=True) 

    # relationship 
    user : Mapped["UserModel"] = relationship(back_populates="identities" , cascade="all, delete-orphan")
