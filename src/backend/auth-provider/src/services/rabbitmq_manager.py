import asyncio
from collections.abc import Awaitable, Callable
from functools import wraps
from typing import Any

import aio_pika
from aio_pika import Message
from aio_pika.abc import (AbstractChannel, 
                          AbstractQueue, 
                          AbstractRobustChannel, 
                          AbstractRobustConnection, 
                          AbstractRobustQueue)

from src.cores import settings


def async_retry(func: Callable[..., Awaitable[Any]]) -> Callable[..., Awaitable[Any]]:
    """A decorator that retries an async function up to 5 times with exponential backoff."""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        delay = 1

        for attempt in range(5):
            try:
                return await func(*args, **kwargs)
            except Exception:
                if attempt == 4:
                    raise 
                await asyncio.sleep(delay)
                delay *= 2
    return wrapper


class RabbitMQManager:
    """Manages robust connections and queue declarations for RabbitMQ."""

    def __init__(self):
        self.url = settings.RABBITMQ_URL
        self.connection: AbstractRobustConnection | None = None
        self.channel: AbstractChannel | None = None
        self.queues: dict[str, AbstractQueue] = {}

    @async_retry
    async def connect(self) -> None:
        """Establishes a robust connection to RabbitMQ and declares required queues."""
        self.connection = await aio_pika.connect_robust(self.url)
        self.channel = await self.connection.channel()

        self.queues["submission_queue"] = await self.channel.declare_queue(
            "submission_queue",
            durable=True,
        )
        self.queues["transcode_queue"] = await self.channel.declare_queue(
            "transcode_queue",
            durable=True,
        )
        self.queues["email_queue"] = await self.channel.declare_queue(
            "email_queue",
            durable=True,
        )

    async def publish(self, queue_name: str, message: bytes) -> None:
        """Publishes a persistent message to the specified declared queue."""
        if self.channel is None:
            await self.connect()

        # The check below is redundant but kept for type safety.
        if self.channel is None:
            raise RuntimeError("RabbitMQ channel has not been initialized")

        if queue_name not in self.queues:
            raise ValueError(f"Queue {queue_name} is not declared")

        await self.channel.default_exchange.publish(
            Message(body=message, delivery_mode=aio_pika.DeliveryMode.PERSISTENT),
            routing_key=queue_name,
        )

    async def close(self) -> None:
        """Closes the active channel and connection gracefully."""
        if self.channel is not None and not self.channel.is_closed:
            await self.channel.close()

        if self.connection is not None and not self.connection.is_closed:
            await self.connection.close()

