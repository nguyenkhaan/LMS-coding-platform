from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.db import get_db_session

from .service import TeacherApplicationService


def get_teacher_application_service(
    db_session: Annotated[AsyncSession, Depends(get_db_session)],
) -> TeacherApplicationService:
    return TeacherApplicationService(db_session)
