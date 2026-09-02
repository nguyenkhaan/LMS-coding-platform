import asyncio

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.testcase_model import TestcaseModel
from src.bases.constants.submission_queues import SUBMISSION_EXECUTION_QUEUE
from src.db import get_async_db_session
from src.middlewares.role_middleware import require_role
from src.models.base_model import ProblemSubmissionStatus, Role
from src.models.language_model import LanguageModel
from src.models.problem_config_model import ProblemConfigModel
from src.models.problem_model import ProblemModel
from src.models.submission_model import SubmissionModel
from src.services.sse.sse_dependency import get_sse_manager
from src.services.sse.sse_manager import SSEManager
from src.services.rabbitmq.rabbitmq_dependency import get_rabbitmq_manager
from src.services.rabbitmq.rabbitmq_manager import RabbitMQManager
from src.modules.submission.submission_contracts import (
    CreateSubmissionRequest,
    SubmissionExecutionRequest,
    TestcaseExecutionRequest,
)
import json 

mock_submission_result = {
    1: {
        "submission_id": 1, 
        "status": "pending",
        "code": "print('Hello world')",
        "score": 0 
    }
}
router = APIRouter(
    prefix = "/submission", 
    tags = ['Submission']
) 

@router.post('/', status_code=status.HTTP_201_CREATED)
async def create_submission(
    data: CreateSubmissionRequest,
    current_user: dict = Depends(require_role(Role.STUDENT , Role.TEACHER)),
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

# ham dung de mo ket noi sse, chung ta se tien hanh truyen du lieu dua tren ket noi nay 
@router.get('/{submission_id}/events') 
async def submission_event(
    submission_id : int, 
    request: Request, 
    sse_manager : SSEManager = Depends(get_sse_manager)
): 
    queue = await sse_manager.subscribe(submission_id)
    async def event_generator(): 
        try: 
            while True: 
                if await request.is_disconnected(): 
                    break 
                data = await queue.get() 
                yield (
                    "event: submission_result\n" 
                    f"data: {json.dumps(data)}\n\n"
                )
                if data['status'] not in ['running' , 'pending']: 
                    break 
        finally: 
            await sse_manager.unsubscribe(submission_id , queue)
    return StreamingResponse(
        headers = {
            "Cache-Control": "no-cache", 
            "Connection": "keep-alive"
        }, 
        media_type="text/event-stream", 
        content = event_generator() 
    )
@router.post('/{submission_id}/result') 
async def submission_result(
    submission_id : int, 
    current_user : dict = Depends(require_role(Role.STUDENT , Role.TEACHER)), 
    sse_manager : SSEManager = Depends(get_sse_manager), 
    rabbitmq : RabbitMQManager = Depends(get_rabbitmq_manager), 
    db : AsyncSession = Depends(get_async_db_session)
): 
    submission = await db.get(SubmissionModel , submission_id) 
    if submission is None: 
        raise HTTPException(
            status_code = 404, 
            detail = "Submission not found"
        )
    if submission.student_id != int(current_user['sub']): 
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to run this submission",
        )
    language = await db.get(LanguageModel, submission.language_id)
    if language is None or not language.is_active:
        raise HTTPException(status_code=400, detail="Unsupported language")
    # Lay problem config tuong ung voi language ma se submit ben trong submission 
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

    # Load het tat ca cac testcase len 
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
        language=language.name, # Luu luon la python, cpp, javascript 
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
        # Day cac thay doi xuong database 
        await db.flush()  
        await rabbitmq.publish(
            SUBMISSION_EXECUTION_QUEUE, 
            execution_request.model_dump_json().encode('utf-8')
        )
    except Exception: 
        await db.rollback() 
        raise HTTPException(
            status_code=503,
            detail="Could not queue submission for judging",
        )
    # Publish the result to sse_manager -> Change the status to running 
    await sse_manager.publish(
        submission.id,
        {"submission_id": submission.id, "status": "running"},
    )
    return {
        "submission_id": submission.id, 
        "status": submission.status 
    }