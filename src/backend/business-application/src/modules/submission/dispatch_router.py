from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.bases.constants.submission_queues import SUBMISSION_EXECUTION_QUEUE
from src.db import get_async_db_session
from src.middlewares.role_middleware import require_role
from src.models.base_model import ProblemSubmissionStatus, Role
from src.models.language_model import LanguageModel
from src.models.problem_config_model import ProblemConfigModel
from src.models.submission_model import SubmissionModel
from src.models.testcase_model import TestcaseModel
from src.modules.submission.submission_contracts import (
    SubmissionExecutionRequest,
    TestcaseExecutionRequest,
)
from src.services.rabbitmq.rabbitmq_dependency import get_rabbitmq_manager
from src.services.rabbitmq.rabbitmq_manager import RabbitMQManager
from src.services.sse.sse_dependency import get_sse_manager
from src.services.sse.sse_manager import SSEManager

router = APIRouter(prefix="/submission", tags=["Submission"])


@router.post("/{submission_id}/result")
async def submission_result(
    submission_id: int,
    current_user: dict = Depends(require_role(Role.STUDENT, Role.TEACHER)),
    sse_manager: SSEManager = Depends(get_sse_manager),
    rabbitmq: RabbitMQManager = Depends(get_rabbitmq_manager),
    db: AsyncSession = Depends(get_async_db_session),
):
    submission = await db.get(SubmissionModel, submission_id)
    if submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")
    if submission.student_id != int(current_user["sub"]):
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to run this submission",
        )
    language = await db.get(LanguageModel, submission.language_id)
    if language is None or not language.is_active:
        raise HTTPException(status_code=400, detail="Unsupported language")
    problem_config = await db.scalar(
        select(ProblemConfigModel).where(
            ProblemConfigModel.problem_id == submission.problem_id,
            ProblemConfigModel.language_id == submission.language_id,
        )
    )
    if problem_config is None:
        raise HTTPException(
            status_code=400,
            detail="Language is not enabled for this problem",
        )

    testcases = (
        await db.scalars(
            select(TestcaseModel).where(
                TestcaseModel.problem_id == submission.problem_id
            )
        )
    ).all()
    if not testcases:
        raise HTTPException(
            status_code=400,
            detail="Problem does not have any testcases",
        )
    execution_request = SubmissionExecutionRequest(
        submission_id=submission.id,
        language=language.name,
        time_limit_ms=int(problem_config.time_limit_ms),
        memory_limit_mb=f"{int(problem_config.memory_limit_mb)}m",
        code=submission.source_code,
        testcases=[
            TestcaseExecutionRequest(
                testcase_id=testcase.id,
                input_file=testcase.input_file,
                output_file=testcase.output_file,
                score=float(testcase.score),
            )
            for testcase in testcases
        ],
    )

    await sse_manager.publish(
        submission.id,
        {"submission_id": submission.id, "status": "pending"},
    )
    submission.status = ProblemSubmissionStatus.RUNNING
    try:
        await db.flush()
        await db.commit()
        await rabbitmq.publish(
            SUBMISSION_EXECUTION_QUEUE,
            execution_request.model_dump_json().encode("utf-8"),
        )
    except Exception:
        await db.rollback()
        raise HTTPException(
            status_code=503,
            detail="Could not queue submission for judging",
        )
    await sse_manager.publish(
        submission.id,
        {"submission_id": submission.id, "status": "running"},
    )
    return {
        "submission_id": submission.id,
        "status": submission.status,
    }
