from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.db import get_db_session
from src.modules.problem.problem_service import ProblemService

def get_problem_service(db_session: AsyncSession = Depends(get_db_session)) -> ProblemService:
    return ProblemService(db_session=db_session)
