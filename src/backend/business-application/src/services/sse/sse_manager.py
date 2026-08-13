from asyncio import Queue
from typing import List 

class SSEManager: 
    def __init__(self): 
        # La mot list hang doi de xu ly truong hop nguoi dung mo nhieu tab 
        self.clients : dict[int , List[Queue]] = {}
    async def subscribe(self , submission_id : int): 
        queue = Queue() 
        if submission_id not in self.clients: 
            self.clients[submission_id] = [ ] # Moi hang submission_id la 1 list
        self.clients[submission_id].append(queue) # Them queue vao ben trong list nhe em 
        return queue 
    async def unsubscribe(self , submission_id , queue : Queue): 
        if submission_id not in self.clients: 
            return 
        if queue in self.clients[submission_id]: 
            self.clients[submission_id].remove(queue) 
        if not self.clients[submission_id]: 
            del self.clients[submission_id]
    async def publish(self, submission_id : int, data : dict): 
        # Duyet qua tat ca cac queue cua submission_id => nguoi dung mo nhieu tab 
        for queue in self.clients.get(submission_id , []): 
            await queue.put(data) 