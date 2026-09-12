from asyncio import Queue
from typing import Any


class SSEManager:
    def __init__(self) -> None:
        # La mot list hang doi de xu ly truong hop nguoi dung mo nhieu tab
        self.clients: dict[int, list[Queue[dict[str, Any]]]] = {}

    async def subscribe(self, submission_id: int) -> Queue[dict[str, Any]]:
        queue: Queue[dict[str, Any]] = Queue()
        if submission_id not in self.clients:
            self.clients[submission_id] = []
        self.clients[submission_id].append(queue)
        return queue

    async def unsubscribe(
        self, submission_id: int, queue: Queue[dict[str, Any]]
    ) -> None:
        if submission_id not in self.clients:
            return
        if queue in self.clients[submission_id]:
            self.clients[submission_id].remove(queue)
        if not self.clients[submission_id]:
            del self.clients[submission_id]

    async def publish(self, submission_id: int, data: dict[str, Any]) -> None:
        # Duyet qua tat ca cac queue cua submission_id => nguoi dung mo nhieu tab
        for queue in self.clients.get(submission_id, []):
            await queue.put(data)
