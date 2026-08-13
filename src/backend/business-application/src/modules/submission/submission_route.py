import asyncio
import re

from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.util import b

from src.bases.constants.rabbit_queue import SUBMISSION_QUEUE
from src.services.sse.sse_dependency import get_sse_manager
from src.services.sse.sse_manager import SSEManager
from src.services.rabbitmq.rabbitmq_dependency import get_rabbitmq_manager
from src.services.rabbitmq.rabbitmq_manager import RabbitMQManager
from src.modules.submission.submission_dto import CreateSubmissionRequest, SubmissionJob 
from src.bases.constants.rabbit_queue import SUBMISSION_QUEUE
import json 
mock_language = "python" 
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

@router.post('/')
async def create_submission(
    data : CreateSubmissionRequest, 
    rabbitmq : RabbitMQManager = Depends(get_rabbitmq_manager)
):
    print("Data nhan duoc la: " , data)   
    submission_id = '1'
    return mock_submission_result[int(submission_id)]

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
    sse_manager : SSEManager = Depends(get_sse_manager), 
    rabbitmq : RabbitMQManager = Depends(get_rabbitmq_manager)
): 
    # pending 
    await asyncio.sleep(2) 
    running_result = {
        "submission_id": submission_id,
        "status": "pending" 
    } 
    await sse_manager.publish(submission_id , running_result)

    # run the code 
    submission = mock_submission_result[submission_id] 
    if submission: 
        # running cold start 
        await asyncio.sleep(1) 
        await sse_manager.publish(submission_id , {
            "submission_id" : submission_id, 
            "status": "running"
        }) 
        payload : SubmissionJob = SubmissionJob(
            submission_id=submission_id, 
            memory_limit_mb='128mb', 
            time_limit_ms=1000, 
            language='python', 
            code = submission.get('code') or '' 
        )
        # Gui du lieu qua ben judge_service thong qua SUBMISSION_QUEUE 
        await rabbitmq.publish(
            SUBMISSION_QUEUE, 
            payload.model_dump_json().encode('utf-8')
        )
