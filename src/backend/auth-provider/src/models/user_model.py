from datetime import datetime
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import func, Enum as SQLEnum 
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models.base_model import AccountStatus
from src.db import Base

if TYPE_CHECKING:
    from src.models.user_identity_provider_model import UserIdentityModel
    

class UserModel(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    active: Mapped[bool] = mapped_column(default=False)
    full_name: Mapped[str] = mapped_column(nullable=False) 
    address : Mapped[str] = mapped_column(nullable=False) 
    password: Mapped[str] = mapped_column(nullable=False)
    avatar_url : Mapped[Optional[str]] = mapped_column(nullable=True) 
    active: Mapped[bool] = mapped_column(nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now())
    account_status : Mapped[AccountStatus] = mapped_column(
        SQLEnum(AccountStatus), 
        nullable=False, 
        default=AccountStatus.ACTIVE
    ) 
    roles: Mapped[List["RoleModel"]] = relationship(back_populates="user")
    identities: Mapped[List["UserIdentityModel"]] = relationship(back_populates="user", cascade="all, delete-orphan")
from src.models.role_model import RoleModel