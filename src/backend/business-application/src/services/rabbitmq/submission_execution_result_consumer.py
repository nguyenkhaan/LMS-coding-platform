# Chua cac ham consume de xu ly du lieu khi ben khac tra su lieu ve 
from typing import Any

from sqlalchemy import delete

from src.models.submission_model import SubmissionModel
from src.models.submission_result_detail_model import SubmissionResultDetailModel
from src.models.base_model import ProblemSubmissionStatus
from src.services.sse.sse_manager import SSEManager
from src.modules.submission.submission_contracts import SubmissionExecutionResult 
from src.db import async_session_maker
# Co gang o ben judge service thi truyen dung status voi ProblemSubmissionStatus 
def mapping_submission_status(status : str) -> ProblemSubmissionStatus: 
    try: 
        return ProblemSubmissionStatus(status.upper()) 
    except ValueError as e: 
        raise ValueError(f"Invalid submission status {status} + {e}")

async def handle_submission_execution_result(payload : dict[str, Any] , sse_manager : SSEManager):
    result = SubmissionExecutionResult.model_validate(payload) 
    submission_status = mapping_submission_status(result.status)
    async with async_session_maker() as db: 
        try: 
            submission = await db.get(SubmissionModel, result.submission_id)
            if submission is None:
                raise ValueError(
                    f"Submission {result.submission_id} does not exist"
                )
            submission.status = submission_status 
            submission.score = result.score 
            submission.runtime_ms = result.runtime_ms 
            submission.memory_kb = result.memory_kb
            # phong truong hop rabbitmq se redelivery message. CHung ta se tien hanh xoa het cac submission co submission.id truoc 
            await db.execute(
                delete(SubmissionResultDetailModel).where(
                        SubmissionResultDetailModel.submission_id == submission.id
                    )
                )
            db.add_all(
                [
                    SubmissionResultDetailModel(
                        submission_id=submission.id,
                        testcase_id=testcase.testcase_id,
                        status=mapping_submission_status(testcase.status),
                        runtime_ms=testcase.runtime_ms,
                        memory_kb=testcase.memory_kb,
                    )
                    for testcase in result.testcases
                ]
            )
            await db.commit() 
        except Exception as e: 
            await db.rollback()
            raise e 
    await sse_manager.publish(
        result.submission_id,
        result.model_dump(mode="json"),
    )
