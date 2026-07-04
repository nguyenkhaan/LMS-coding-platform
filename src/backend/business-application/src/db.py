import datetime
from typing import AsyncGenerator

from sqlalchemy import DateTime
from sqlalchemy.ext.asyncio import (
    AsyncAttrs,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase
from src.cores.settings import DATABASE_URL

class Base(AsyncAttrs, DeclarativeBase):
    """Base class for all models"""

    type_annotation_map = {
        datetime.datetime: DateTime(timezone=True),
    } 


engine = create_async_engine(
    DATABASE_URL, 
    echo=True,
)  

async_session_maker = async_sessionmaker(engine, expire_on_commit=False)

async def get_async_db_session() -> AsyncGenerator[AsyncSession, None]: 
    async with async_session_maker() as session:
        yield session