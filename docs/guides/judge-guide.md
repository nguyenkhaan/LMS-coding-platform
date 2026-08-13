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


## Cài đặt SSE 
SSE là cơ chế cho phép server đẩy dữ liệu tự động xuống client => Khi chấm bài xong thì tiến hành đẩy kết quả xuống client, bỏ tình trạng client phải pooling request liên tục. 
