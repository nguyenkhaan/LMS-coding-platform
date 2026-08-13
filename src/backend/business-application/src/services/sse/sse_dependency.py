
from fastapi import Request
from src.services.sse.sse_manager import SSEManager


def get_sse_manager(
    request : Request
) -> SSEManager: 
    return request.app.state.sse_manager 