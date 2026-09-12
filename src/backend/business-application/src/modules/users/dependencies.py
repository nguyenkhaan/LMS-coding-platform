from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.db import get_db_session
from src.modules.users.service import UserService


def get_user_service(session: AsyncSession = Depends(get_db_session)):
    return UserService(session)
