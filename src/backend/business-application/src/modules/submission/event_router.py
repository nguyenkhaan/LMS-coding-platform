import json

from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse

from src.services.sse.sse_dependency import get_sse_manager
from src.services.sse.sse_manager import SSEManager

router = APIRouter(prefix="/submission", tags=["Submission"])


@router.get("/{submission_id}/events")
async def submission_event(
    submission_id: int,
    request: Request,
    sse_manager: SSEManager = Depends(get_sse_manager),
):
    queue = await sse_manager.subscribe(submission_id)

    async def event_generator():
        try:
            while True:
                if await request.is_disconnected():
                    break
                data = await queue.get()
                yield (f"event: submission_result\ndata: {json.dumps(data)}\n\n")
                if data["status"] not in ["running", "pending"]:
                    break
        finally:
            await sse_manager.unsubscribe(submission_id, queue)

    return StreamingResponse(
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
        media_type="text/event-stream",
        content=event_generator(),
    )
