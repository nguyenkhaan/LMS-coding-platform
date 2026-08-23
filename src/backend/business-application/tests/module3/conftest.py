import os
os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://user:pass@localhost:5432/db")
os.environ.setdefault("VERIFY_REGISTER_SECRET", "test-secret")
os.environ.setdefault("AUTH_PROVIDER_URL", "http://localhost:4001")
os.environ.setdefault("UPSTASH_REDIS_REST_URL", "http://localhost")
os.environ.setdefault("UPSTASH_REDIS_REST_TOKEN", "test-token")
os.environ.setdefault("RABBITMQ_URL", "amqp://guest:guest@localhost:5672//")
