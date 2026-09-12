# HƯỚNG DẪN KHỞI ĐỘNG HỆ THỐNG BACKEND ĐƠN GIẢN ĐẾN CẬU VÀNG CŨNG LÀM ĐƯỢC

## 1. Mở workspace

- Dự án chúng ta sẽ mở theo workspace. Mở file `lms.code-workspace` bằng VS Code.
- Chọn **File → Open Workspace from File...** → chọn file `lms.code-workspace`.

Khi dự án được mở bằng workspace, chúng ta sẽ có các service tương ứng:

- `LMS-coding-platform`: toàn bộ dự án.
- `frontend`: dự án frontend.
- `business-application`: service chính.
- `auth-provider`: service để thực hiện các chức năng authentication.
- `judge`: worker chấm code.
- `ai-assistant` (chưa khai báo): AI interview service.
- `gateway`.

## 2. Setup hệ thống

### Cài đặt

- [uv](https://docs.astral.sh/uv/getting-started/installation/)
- [Docker](https://docs.docker.com/engine/install/)
- Docker extension cho VS Code.

### Cấu hình môi trường

- Cập nhật file `.env` cho `business-application` và `auth-provider` từ file `.env.example` tương ứng.
- Điền thông tin PostgreSQL (Supabase hoặc môi trường development của team), Upstash Redis, JWT keys và các secret cần thiết.
- `business-application` cần `AUTH_PROVIDER_URL=http://localhost:4001`.
- Nếu dùng email local, giữ cấu hình Mailpit trong `.env` của `auth-provider`.

> Không commit file `.env` hoặc các JWT key/secret lên Git.

### Khởi động các service hạ tầng bằng Docker

Tại thư mục gốc `LMS-coding-platform`, chạy:

```bash
docker compose up -d postgres redis rabbitmq minio mailpit
```

Kiểm tra container đang chạy:

```bash
docker compose ps
```

- **PostgreSQL**: `localhost:5432`.
- **Redis**: `localhost:6379`.
- **MinIO API**: `http://localhost:9000`.
- **MinIO Console**: `http://localhost:9001` — `minioadmin` / `minioadmin`.
  - Tạo bucket tên `lms` và chuyển bucket này sang **Public** nếu cần phục vụ file public trong môi trường local.
- **RabbitMQ Management**: `http://localhost:15672` — `lms` / `lms`.
- **Mailpit**: `http://localhost:8025`.

> Nếu `.env` đang dùng Supabase và Upstash thì PostgreSQL/Redis local không bắt buộc. RabbitMQ, MinIO và Mailpit vẫn hữu ích cho development local.

### Migration và dữ liệu demo (nếu cần)

Mở terminal tại thư mục `business-application`:

```bash
uv run alembic upgrade head
```

Nếu cần ba tài khoản demo bên dưới, chạy thêm:

```bash
uv run python seed.py
```

> Lệnh seed sẽ xóa và tạo lại dữ liệu trong database hiện tại. Chỉ chạy trên database development/disposable.

## 3. Chạy dự án

Khởi động theo thứ tự: `auth-provider` → `business-application` → `gateway`.

### Khởi động auth-provider

Mở 1 terminal tại thư mục `auth-provider` (bấm `+` ở Terminal → chọn `auth-provider`):

```bash
uv sync
uv run main.py
```

Auth Provider chạy tại `http://localhost:4001` và mở gRPC tại port `50051`.

### Khởi động business-application

Mở 1 terminal tại thư mục `business-application` (bấm `+` ở Terminal → chọn `business-application`):

```bash
uv sync
uv run main.py
```

Business Application chạy tại `http://localhost:4000`. Service này cần Auth Provider đang chạy để lấy JWT public key khi khởi động.

### Khởi động gateway

Mở 1 terminal tại thư mục `gateway` (bấm `+` ở Terminal → chọn `gateway`):

```bash
uv sync
uv run main.py
```

Hệ thống gateway khởi động tại `http://localhost:4040`.

API docs:

- Business Application: `http://localhost:4040/business-application/docs`
- Auth Provider: `http://localhost:4040/auth-provider/docs`

## 4. Lấy access token

Truy cập đường link qua gateway:

```text
http://localhost:4040/auth-provider/auth/authorize?redirect_uri=https://google.com
```

Hoặc gọi trực tiếp Auth Provider:

```text
http://localhost:4001/api/auth/authorize?redirect_uri=https://google.com
```

Nếu đã chạy dữ liệu demo, hệ thống có sẵn ba tài khoản tương ứng với ba role:

- Student: `student@gmail.com` / `student123`
- Teacher: `teacher@gmail.com` / `teacher123`
- Admin: `cloudian@gmail.com` / `admin123`

Khi đăng nhập thành công, hệ thống sẽ redirect người dùng về `redirect_uri` ở endpoint đã truy cập.

Quay lại terminal của Auth Provider để lấy `authorization_code` được in ra. Sau đó truy cập API docs của Auth Provider:

```text
http://localhost:4040/auth-provider/docs
```

Sử dụng endpoint `POST /code` (có thể nhấn `Ctrl + F` trên Swagger và tìm `/code`), dán authorization code vào. Nếu chạy đúng :v thì sẽ nhận được `access_token` và `refresh_token`.
