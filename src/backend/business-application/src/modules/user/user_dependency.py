from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.modules.user.user_service import UserService
from src.db import get_db_session
def get_user_service(
    session : AsyncSession = Depends(get_db_session)
): 
    return UserService(session)