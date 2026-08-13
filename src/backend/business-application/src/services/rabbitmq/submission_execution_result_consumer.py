# Chua cac ham consume de xu ly du lieu khi ben khac tra su lieu ve 
from typing import Any

from src.modules.submission.submission_contracts import SubmissionExecutionResult 
# ket qua tra ve ben trong result_queue 
async def handle_submission_execution_result(payload : dict[str, Any]):
    submission_execution_result = SubmissionExecutionResult.model_validate(payload)
    submission_id = submission_execution_result.submission_id
    status = submission_execution_result.status # status: running, pending, wrong_answer, tle, olm, ... 
    score = submission_execution_result.score 
    stdout = submission_execution_result.stdout
    print('id' , submission_id) 
    print('status' , status) 
    print('score' , score)
    print('stdout' , stdout)
