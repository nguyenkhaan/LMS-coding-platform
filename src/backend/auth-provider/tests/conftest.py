import os
import base64

os.environ.setdefault("BACKEND_URL", "http://localhost:4001")
os.environ.setdefault("JWT_ACCESS_PRIVATE", base64.b64encode(b"test-private-key").decode())
os.environ.setdefault("JWT_ACCESS_PUBLIC", base64.b64encode(b"test-public-key").decode())
os.environ.setdefault("JWT_REFRESH_SECRET", "test-refresh-secret-with-at-least-32-bytes")
os.environ.setdefault("JWT_EMAIL_CHANGE_SECRET", "test-email-change-secret-with-at-least-32-bytes")
os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://user:password@localhost/test")
os.environ.setdefault("UPSTASH_REDIS_REST_URL", "https://example.test")
os.environ.setdefault("UPSTASH_REDIS_REST_TOKEN", "test-token")
os.environ.setdefault("RABBITMQ_URL", "amqp://guest:guest@localhost/")
os.environ.setdefault("SMTP_HOST", "localhost")
os.environ.setdefault("SMTP_PORT", "1025")
