import asyncio

import aio_pika
from aio_pika.abc import AbstractRobustConnection, AbstractChannel, AbstractIncomingMessage
from src.bases.constants.submission_queues import SUBMISSION_EXECUTION_QUEUE, SUBMISSION_EXECUTION_RESULT_QUEUE
import json 

class RabbitMQManager: 
    def __init__(self , url : str): 
        self.url = url 
        self.connection : AbstractRobustConnection | None = None 
        self.channel : AbstractChannel | None = None 
    async def connect(self): 
        connection = await aio_pika.connect_robust(
            self.url
        ) 
        self.connection = connection # Khong su dung async with vi async with la dong luon
        self.channel = await self.connection.channel() 
        await self.channel.declare_queue(
            SUBMISSION_EXECUTION_QUEUE,
            durable=True 
        ) 
        await self.channel.declare_queue(
            SUBMISSION_EXECUTION_RESULT_QUEUE,
            durable=True 
        ) 
        print('RabbitMQ has been connected')
    
    # Publisher - Ok yeah 
    # https://docs.aio-pika.com/quick-start.html : Simple publisher 
    async def publish(self , queue_name, body : bytes): 
        if self.channel is None: 
            raise RuntimeError(
                "RabbitMQ is not initialized"
            ) 
        await self.channel.default_exchange.publish(
            aio_pika.Message(
                body=body, 
                content_type="application/json", 
                # Phai thuc hien chuyen thanh json truoc bang json.dumps(payload).encode('utf-8')
                delivery_mode=aio_pika.DeliveryMode.PERSISTENT
            ), 
            routing_key=queue_name
        )

    # Consumer declaration - OK yeah 
    # https://docs.aio-pika.com/quick-start.html - Synchronus & asynchronus message processing
    async def consume(
        self, 
        queue_name : str, 
        handler
    ): 
        if self.channel is None: 
            raise RuntimeError(
                "RabbitMQ channel not found"
            ) 
        queue = await self.channel.declare_queue(
            queue_name, 
            durable=True 
        ) 
        async def process_message(
            message : AbstractIncomingMessage 
        ) -> None: 
            try: 
                payload = json.loads(
                    message.body.decode('utf-8')
                ) 
                await handler(payload) 
                await message.ack() # Xu ly thanh cong thi dua ack vao de loai bo message nay ra 
            except Exception as e:  
                print(
                    f"Failed to execute consumer with {e} error"
                ) 
                await message.nack(
                    requeue=True 
                )

        consumer_id = await queue.consume(
            process_message, 
            no_ack=False # Xu ly thi khong gui gi ve ben kia nen khong can ack nua 
        ) # Tra ve ma dinh danh cua consumer 
        return consumer_id 
    
    async def close(self): 
        try: 
            if self.connection is not None: 
                await asyncio.wait_for(
                    self.connection.close(), 
                    timeout=5
                ) 
            print("RabbitMQ has been closed") 
        except asyncio.TimeoutError:
            print(
                "RabbitMQ close timeout",
                flush=True,
            )

        except Exception as error:
            print(
                f"RabbitMQ close failed: {error}",
                flush=True,
            )
