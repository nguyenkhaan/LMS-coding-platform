import asyncio
import os
import sys
import base64

os.environ.setdefault("BACKEND_URL", "http://localhost:4001")
os.environ.setdefault("JWT_ACCESS_PRIVATE", base64.b64encode(b"test").decode())
os.environ.setdefault("JWT_ACCESS_PUBLIC", base64.b64encode(b"test").decode())
os.environ.setdefault("JWT_REFRESH_SECRET", "test")
os.environ.setdefault("JWT_EMAIL_CHANGE_SECRET", "test")
os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://user:password@localhost/test")
os.environ.setdefault("UPSTASH_REDIS_REST_URL", "https://example.test")
os.environ.setdefault("UPSTASH_REDIS_REST_TOKEN", "test-token")
os.environ.setdefault("RABBITMQ_URL", "amqp://guest:guest@localhost/")
os.environ.setdefault("SMTP_HOST", "localhost")
os.environ.setdefault("SMTP_PORT", "1025")

# Add the project root to the path so we can import src
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.cores import settings
from src.services.rabbitmq_manager import RabbitMQManager

async def main():
    print("Testing RabbitMQ connection...")
    print(f"RabbitMQ URL: {settings.RABBITMQ_URL}")
    
    manager = RabbitMQManager()
    try:
        await manager.connect()
        print("Connected to RabbitMQ successfully.")
        print(f"Declared Queues: {list(manager.queues.keys())}")
        
        # Verify 3 queues are declared
        expected_queues = {"submission_queue", "transcode_queue", "email_queue"}
        declared = set(manager.queues.keys())
        if expected_queues.issubset(declared):
            print("All expected queues were declared successfully.")
        else:
            print(f"Missing expected queues: {expected_queues - declared}")
            
    except Exception as e:
        print(f"Failed to connect to RabbitMQ: {e}")
    finally:
        if manager.connection:
            await manager.connection.close()
            print("Connection closed.")

if __name__ == "__main__":
    asyncio.run(main())
