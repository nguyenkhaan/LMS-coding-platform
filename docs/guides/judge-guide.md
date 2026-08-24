# HƯỚNG DẪN THỰC HIỆN TESTING VỚI JUDGE SUBMISSION ĐƠN GIẢN ĐẾN CẬU VÀNG CŨNG LÀM ĐƯỢC 

## Tổng quan tiến độ 
- Triển khai hiện tại: 
    + Triển khai rabbitmq để truyền dữ liệu giữa judge-service và business-application 
    + Triển khai SSE: hỗ trợ truyền dữ liệu realtime giữa 
    + Gửi code từ business-application lên judge-service. 
    + judge-service tạo sandbox và chạy đoạn code được gửi lên 
    + Hỗ trợ SSE để gửi dữ liệu realtime 
- Chưa triển khai: 
    + Chỉ mới thực hiện quá trình mock database, (mock code), chưa giao tiếp với database thật sự 
    + Chưa hỗ trợ chạy testcase liên tục 
    + Vẽ một sơ đồ mermaid mô tả luồng thực hiện. 

## Hướng dẫn các bước testing 

Trước tiên, hãy đảm bảo bạn đã chạy `rabbitmq` trong docker. Cũng như có đầy đủ các biến môi trường trong file .env (bao gồm RABBITMQ_URL)

### Bước 1. Mở đường truyền 
- Lần lượt chạy 2 service `business-application` và `judge-service` bằng lệnh `uv run main.py`, mở tại 2 thư mục. 
- `business-application` sẽ chạy ở `http://localhost:4000`, `judge-service` sẽ chạy ở `http://localhost:4002`  

- Mở 1 terminal mới, copy lệnh curl bên dưới để tiến hành đăng ký một hàng chờ với SSE 
`curl -N "http://localhost:4000/api/submission/1/events""`

Bạn sẽ thấy Terminal dừng lại không truyền nữa. Connection giữa client và `business-application` đã được giữ nhờ cơ chế SSE 

### Bước 2. Chạy sandbox image 
- Mở file `README.md` bên trong judge/sandbox/docker_images/README.md. Đọc các lệnh trong đó và khởi động image python (dùng để chạy code python) 
- Nhớ chạy lệnh này trong Terminal đang mở tại judge_service. 

### Bước 3. Chạy code 
- Mở API docs của business-application: `http://localhost:4000/docs`

- Chạy API route: (POST) /api/submission/{submission_id}/result với submission_id = 1 (do mock...) 

- Hãy bấm vào `Try It out` trên API docs, đồng thời quan sát Terminal mà bạn đang gọi: `curl -N http://localhost:4000/api/submission/1/events` ở **Bước 1**; 

- SSE sẽ lần lượt đẩy dữ liệu sang bên cho client với giao diện Terminal như bên dưới: 

```bash 
cloud@cloud ~/w/p/L/s/b/judge (dev)> curl -N "http://localhost:4000/api/submission/1/events"
event: submission_result
data: {"submission_id": 1, "status": "pending"}

event: submission_result
data: {"submission_id": 1, "status": "running"}

event: submission_result
data: {"submission_id": 1, "score": 100, "status": "accepted", "exit_code": 0, "stdout": "Hello world\n", "runtime_ms": 204.67525599997316, "timed_out": 0.0, "stderr": ""}
```