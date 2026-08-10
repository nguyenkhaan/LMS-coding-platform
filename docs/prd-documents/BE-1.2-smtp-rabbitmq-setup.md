# BE-1.2 — SMTP Email Client & RabbitMQ Setup (auth-provider)

Thiết lập SMTP client (local qua Mailpit) và RabbitMQ manager (`aio-pika`) trong `auth-provider`, để service có thể gửi mail thử và publish message vào queue. Đây là nền tảng cho các async jobs sau này: gửi mail OTP/hóa đơn, chấm bài OJ, và transcode video.

## File đã thêm / sửa

| File | Thay đổi |
|------|----------|
| `docker-compose.yaml` | Thêm service `mailpit` (`axllent/mailpit:latest`, SMTP `1025`, UI `8025`) |
| `src/backend/auth-provider/.env.example` | Thêm biến `SMTP_*` và `RABBITMQ_URL` |
| `src/backend/auth-provider/src/cores/settings.py` | Đọc SMTP (có default) và `RABBITMQ_URL` (bắt buộc) qua `get_env_var` |
| `src/backend/auth-provider/pyproject.toml` (+ `uv.lock`) | Thêm dependency `aio-pika>=9.0.0` |
| `src/backend/auth-provider/src/services/email_client.py` | `SMTPClient.send_email` — `smtplib` chạy qua `asyncio.to_thread` |
| `src/backend/auth-provider/src/services/rabbitmq_manager.py` | `RabbitMQManager`: connect/retry, declare 3 durable queues, publish |
| `src/backend/auth-provider/src/app.py` | Wire `RabbitMQManager` vào lifespan (`connect` / `close`) và `app.state.rabbitmq_manager` |
| `scripts/test_smtp.py` | Script độc lập gửi mail test qua Mailpit |
| `scripts/test_rabbitmq.py` | Script độc lập publish + verify message trên `email_queue` |

## Cấu hình `.env`

Thêm / chỉnh các biến sau trong `src/backend/auth-provider/.env` (tham chiếu `.env.example`):

| Biến | Mô tả | Giá trị mẫu (local + Mailpit) |
|------|--------|-------------------------------|
| `SMTP_HOST` | Host SMTP | `localhost` |
| `SMTP_PORT` | Port SMTP | `1025` |
| `SMTP_USER` | Username (để trống nếu không auth) | _(rỗng)_ |
| `SMTP_PASSWORD` | Password (để trống nếu không auth) | _(rỗng)_ |
| `SMTP_USE_TLS` | Bật STARTTLS (`true` / `false`) | `false` |
| `SMTP_FROM` | Địa chỉ From | `noreply@lms.local` |
| `RABBITMQ_URL` | URL AMQP (bắt buộc, không có default) | `amqp://lms:lms@localhost:5672/` |

SMTP có default trong `settings.py` phù hợp Mailpit; `RABBITMQ_URL` bắt buộc phải có trong env. Login SMTP chỉ chạy khi cả `SMTP_USER` và `SMTP_PASSWORD` đều khác rỗng (Mailpit local không cần auth).

## Queues đã khai báo

Ba queue durable được declare khi `RabbitMQManager.connect()`:

| Queue | Mục đích |
|-------|----------|
| `submission_queue` | Job chấm bài OJ |
| `transcode_queue` | Job cắt/transcode video bài giảng (HLS) |
| `email_queue` | Job gửi mail (OTP xác thực, hóa đơn, thông báo) |

Publish dùng default exchange với `routing_key=queue_name` (không custom exchange/binding).

## Retry / reconnect (`RabbitMQManager`)

- Decorator `@async_retry` chỉ gắn trên `connect()`.
- Tối đa **5** lần thử; delay bắt đầu `1s`, nhân đôi mỗi lần thất bại (exponential backoff: 1 → 2 → 4 → 8 giây giữa các lần).
- Hết 5 lần vẫn lỗi → raise exception gốc (fail-fast khi RabbitMQ down lúc startup).
- `publish()` **không** retry; nếu channel chưa có thì gọi `connect()` một lần rồi publish.

## Chạy thử local

1. Từ root repo, khởi động hạ tầng (ít nhất Mailpit + RabbitMQ):

```bash
docker compose up -d
```

2. Đảm bảo `src/backend/auth-provider/.env` đã có đủ 7 biến SMTP/RabbitMQ ở trên. Cài dependency nếu cần:

```bash
cd src/backend/auth-provider
uv sync
```

3. Chạy hai script test (từ root repo; script tự load `.env` của auth-provider):

```bash
python scripts/test_smtp.py
python scripts/test_rabbitmq.py
```

- SMTP: kỳ vọng `SMTP test: OK (email send succeeded)`; kiểm tra mail tại Mailpit UI `http://localhost:8025`.
- RabbitMQ: kỳ vọng in ra JSON message và `RabbitMQ test: OK (message verified in queue)`.

## Quyết định thiết kế

- Giữ convention module-level `get_env_var` trong `settings.py`, không chuyển sang pydantic-settings.
- `RABBITMQ_URL` bắt buộc (không default) — thiếu biến sẽ fail ngay khi import settings.
- SMTP dùng stdlib `smtplib` + `email.message`; không thêm thư viện email bên thứ ba; gọi blocking SMTP qua `asyncio.to_thread`.
- `connect()` fail-fast khi RabbitMQ down sau hết retry là **chủ đích**: auth-provider không start “nửa vời” khi queue không sẵn sàng.
- Implementation nằm trong `auth-provider` (không phải business-application).

## Ngoài phạm vi task này

Consumer / background worker cho các queue **chưa** được triển khai trong BE-1.2; thuộc task khác, ví dụ:

- Worker lắng nghe `email_queue` và gửi mail thật (OTP trong register flow — liên quan BE-2.1)
- Worker lắng nghe `submission_queue` (chấm bài OJ)
- Worker lắng nghe `transcode_queue` (ffmpeg / HLS)

Task này chỉ dừng ở: SMTP client + RabbitMQ connect/declare/publish + script verify.
