# HƯỚNG DẪN CÀI ĐẶT ONLINE JUDGE 
Kiến trúc hệ thống 
## 1. RabbitMQ 
### Khởi động rabbitMQ & cấu hình cơ bản 

- Khởi động rabbitmq bằng cấu hình bên trong `docker-compose.yaml`. Dashboard chạy tại: `http://localhost:15672`
Bên trong `business-application`, tiến hành cài đặt package: `uv add aio-pika`

- Cài đặt url của rabbitMQ tại: `amqp://{user}:{password}@{host}:{port}/'`

Đối với hệ thống của chúng ta, chúng ta sẽ có các queue gồm: 
1. submission_queue: Gửi bài submission (code) đi 
2. result_queue: Gửi kết quả chấm code về 

Truy cập vào trang `http://localhost:15672` vào tạo 2 queue với tên tương ứng. Durable đặc là True 

### Cài đặt rabbitmq manager class 

- Làm nhiệm vụ kết nối và publish dữ liệu đi 

```py 
```

- Đăng ký vào bên trong app context 
```py 
rabbitmq_manager = RabbitMQManager(
        url = RABBITMQ_URL
    )
await rabbitmq_manager.connect() 
app.state.rabbitmq_manager = rabbitmq_manager  
```

- Tạo dependency injection: 
```py
from fastapi import Request

from src.modules.rabbitmq.rabbitmq_manager import RabbitMQManager 

def get_rabbitmq_manager(
        request : Request 
) -> RabbitMQManager: 
    return request.app.state.rabbitmq_manager  
```

### Cài đặt một số hàm service để xử lý rabbitmq 


## 2. Cài đặt SSE 
SSE là cơ chế cho phép server đẩy dữ liệu tự động xuống client => Khi chấm bài xong thì tiến hành đẩy kết quả xuống client, bỏ tình trạng client phải pooling request liên tục. 

### Viết class SSE Manager 
Cơ chế là chúng ta sẽ tạo ra một list, với các submission_id là các key 
    + Mỗi phần tử là một mảng (Xử lý người dùng mở nhiều tab)
    + Mỗi phần tử trong mảng là một Queue (Chứa danh sách dữ liệu)

```python 
class SSEManager: 
    def __init__(self): 
        self.clients : dict[int , List[Queue]] = {} 
    async def subscribe(self, submission_id : int): 
        # Moi khi nguoi dung muon mo 1 phien nop bai (tren 1 tab), chung ta phai them mot Queue de xu ly 
        queue = Queue() 
        if submission_id not in self.clients: 
            self.clients[submission_id] = [] 
        self.clients[submission_id].append(queue) 
        return queue 
    async def unsubscribe(self, submission_id : int, queue): 
        # unsibscribe thi phai biet submission_id va c an go queue (tab) nao 
        if submission_id not in self.clients: 
            return 
        self.clients[submission_id].remove(queue) 
        if not self.clients[submission_id]: 
            del self.clients[submission_id]
    async def publish(self, submission_id : int, data : dict): 
        # Day data vao queue -> Day ra khoi duong truyen de tra ve cho client tutu 
        for queue in self.clients.get(submission_id , []): 
            await queue.put(data) 
```

### Viết route event và route publish 
- route_event: Client sẽ gọi đến route này và tiến hành bước subscribe với client. Route này sẽ được giữ kết nối (miễn là người dùng còn mở tab). Dữ liệu sẽ được truyền qua route này đến cho client 
- publish: Dùng để xử lý logic. Khi client gọi vào route này thì sẽ trigger hoạt động submit code (chấm bài). Sau khi chấm xong thì sẽ gọi hàm để trả kết quả từ từ cho client thông qua route_event ở trên. 

**Route envent**: 

```python 
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
```

**Publish event**: 
```python 
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
```

## 3. Sandbox 
