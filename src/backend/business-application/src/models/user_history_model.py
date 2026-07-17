
from datetime import datetime, UTC
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime, ForeignKey
from src.db import Base
from src.models.user_model import UserModel

class UserHistoryModel(Base): 
    __tablename__ = 'user_history'
    id : Mapped[int] = mapped_column(primary_key=True) 
    created_at : Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default = lambda : datetime.now(UTC), 
        nullable = False 
    ) 
    updated_at : Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default = lambda : datetime.now(UTC), 
        onupdate = lambda : datetime.now(UTC), 
        nullable = False 
    )
    problem_count : Mapped[int] = mapped_column(default=0) 
    user_id : Mapped[int] = mapped_column(
        ForeignKey("user.id")
    )

    user : Mapped['UserModel'] = relationship(
        back_populates = "history"
    )