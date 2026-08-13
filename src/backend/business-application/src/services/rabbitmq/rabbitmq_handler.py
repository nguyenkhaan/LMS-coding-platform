# Chua cac ham consume de xu ly du lieu khi ben khac tra su lieu ve 
from typing import Any

from src.modules.submission.submission_dto import SubmissionResult 
# ket qua tra ve ben trong result_queue 
async def handle_result(payload : dict[str, Any]):
    data = SubmissionResult.model_validate(payload)
    id = data.id
    status = data.status # status: running, pending, wrong_answer, tle, olm, ... 
    score = data.score 
    stdout = data.stdout
    print('id' , id) 
    print('status' , status) 
    print('score' , score)
    print('stdout' , stdout)