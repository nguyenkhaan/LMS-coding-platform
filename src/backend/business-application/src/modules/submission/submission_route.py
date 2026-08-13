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
from src.modules.submission.submission_dto import CreateSubmissionRequest 
import json 
mock_submission_result = {
    "123": {
        "submission_id": "123", 
        "status": "pending",
        "code": "print('Hello world')",
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
    payload = json.dumps(data).encode('utf-8')
    await rabbitmq.publish(
        SUBMISSION_QUEUE, 
        payload
    ) 
    submission_id = '123'
    return mock_submission_result[submission_id]

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
    sse_manager : SSEManager = Depends(get_sse_manager)
): 
    # pending 
    await asyncio.sleep(2) 
    payload = {
        "submission_id": submission_id,
        "status": "pending" 
    } 
    await sse_manager.publish(submission_id , payload)
    # running 
    await asyncio.sleep(2) 
    payload = {
        "submission_id": submission_id,
        "status": "running" 
    }
    await sse_manager.publish(submission_id , payload)
    # run the code 
    await asyncio.sleep(5) 
    payload = {
        "submission_id": submission_id,
        "status": "accepted", 
        "score": 100 
    } 
    await sse_manager.publish(submission_id , payload)