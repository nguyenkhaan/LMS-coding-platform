import asyncio
import json
import sys
from pathlib import Path

from dotenv import load_dotenv


AUTH_PROVIDER_DIR = Path(__file__).resolve().parents[1] / "src" / "backend" / "auth-provider"
sys.path.append(str(AUTH_PROVIDER_DIR))

# Ensure auth-provider settings read from the real env file.
load_dotenv(dotenv_path=AUTH_PROVIDER_DIR / ".env", override=False)

from src.services.rabbitmq_manager import RabbitMQManager  # noqa: E402


async def main() -> None:
    manager = RabbitMQManager()
    await manager.connect()
    await manager.publish("email_queue", json.dumps({"test": True}).encode("utf-8"))

    queue = manager.queues["email_queue"]
    incoming = await queue.get(fail=False, no_ack=True)
    if incoming is None:
        print("WARNING: message published but not found in queue")
        await manager.close()
        raise SystemExit(1)

    print(incoming.body.decode("utf-8"))
    print("RabbitMQ test: OK (message verified in queue)")
    await manager.close()


if __name__ == "__main__":
    asyncio.run(main())

