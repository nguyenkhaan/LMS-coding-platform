from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.db import get_async_db_session
from src.middlewares.role_middleware import require_role
from src.models.base_model import ProblemSubmissionStatus, Role
from src.models.language_model import LanguageModel
from src.models.problem_config_model import ProblemConfigModel
from src.models.problem_model import ProblemModel
from src.models.submission_model import SubmissionModel
from src.modules.submission.submission_contracts import (
    CreateSubmissionRequest,
)

mock_submission_result = {
    1: {
        "submission_id": 1,
        "status": "pending",
        "code": "print('Hello world')",
        "score": 0,
    }
}
router = APIRouter(prefix="/submission", tags=["Submission"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_submission(
    data: CreateSubmissionRequest,
    current_user: dict = Depends(require_role(Role.STUDENT, Role.TEACHER)),
    db: AsyncSession = Depends(get_async_db_session),
):
    problem = await db.get(ProblemModel, data.problem_id)
    if problem is None:
        raise HTTPException(status_code=404, detail="Problem not found")

    language = await db.scalar(
        select(LanguageModel).where(
            LanguageModel.name == data.language,
            LanguageModel.is_active.is_(True),
        )
    )
    if language is None:
        raise HTTPException(status_code=400, detail="Unsupported language")

    language_is_enabled = await db.scalar(
        select(ProblemConfigModel.id).where(
            ProblemConfigModel.problem_id == problem.id,
            ProblemConfigModel.language_id == language.id,
        )
    )
    if language_is_enabled is None:
        raise HTTPException(
            status_code=400,
            detail="Language is not enabled for this problem",
        )

    submission = SubmissionModel(
        problem_id=problem.id,
        student_id=current_user["sub"],
        language_id=language.id,
        source_code=data.code,
        status=ProblemSubmissionStatus.PENDING,
    )
    db.add(submission)
    await db.commit()
    await db.refresh(submission)

    return {
        "submission_id": submission.id,
        "status": submission.status,
    }
