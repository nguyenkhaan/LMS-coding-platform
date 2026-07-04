from typing import List
from datetime import datetime 

from sqlalchemy import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db import Base


class UserModel(Base): 
    
    __tablename__ = "user" 
    id : Mapped[int] = mapped_column(primary_key=True) 
    email : Mapped[str] = mapped_column(unique=True) 
    password : Mapped[str] = mapped_column(nullable=False) 
    created_at: Mapped[datetime] = mapped_column(server_default=func.now()) 
    updated_at : Mapped[datetime] = mapped_column(server_default = func.now()) 
    deleted_at : Mapped[str | None] = mapped_column(default = None) 
    
    # relationship 
    from src.models.role_model import RoleModel
    roles : Mapped[List["RoleModel"]] = relationship(back_populates="user") 