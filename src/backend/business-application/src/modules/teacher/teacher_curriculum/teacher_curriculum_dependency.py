from typing import Annotated
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.modules.teacher.teacher_curriculum.teacher_curriculum_service import (
    TeacherService,
)
from src.db import get_db_session 

def get_teacher_service(
    db_session : AsyncSession = Depends(get_db_session)
): 
    return TeacherService(db_session=db_session)
