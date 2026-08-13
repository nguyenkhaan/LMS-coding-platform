from email import message

import aio_pika
from aio_pika.abc import AbstractIncomingMessage
from aio_pika.abc import AbstractChannel, AbstractIncomingMessage, AbstractRobustConnection
from src.contracts.submission_execution import SubmissionExecutionRequest
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
        self.connection = connection 
        self.channel = await self.connection.channel() 

        # declare queue 
        await self.channel.declare_queue(
            name = SUBMISSION_EXECUTION_QUEUE, 
            durable=True 
        )
        await self.channel.declare_queue(
            name = SUBMISSION_EXECUTION_RESULT_QUEUE, 
            durable=True 
        )
        print('RabbitMQ has been connected')
    async def publish(
        self, 
        queue_name : str, 
        data : bytes 
    ): 
        if self.channel is None or self.connection is None: 
            raise RuntimeError(
                "RabbitMQ connection is failed"
            ) 
        
        await self.channel.default_exchange.publish(
            aio_pika.Message(
                body=data, 
                content_type="application/json", 
                delivery_mode=aio_pika.DeliveryMode.PERSISTENT
            ), 
            routing_key=queue_name
        ) 
    async def consume(
        self, 
        queue_name : str, 
        handler 
    ): 
        if self.channel is None or self.connection is None: 
            raise RuntimeError(
                "RabbitMQ connection is failed"
            ) 
        queue = await self.channel.declare_queue(
            queue_name, 
            durable=True 
        )
   
        async def process_message(
            message : AbstractIncomingMessage
        ): 
            try:
                payload = json.loads(
                    message.body.decode('utf-8')
                )
                await handler(SubmissionExecutionRequest(**payload)) # Chuan hoa KSL tro thanh dang submission_job 
                await message.ack() # bao hieu da thanh cong, de cho queue khong bi treo 
            except Exception as e: 
                print(
                    f"Failed to execute consumer with {e} error"
                ) 
                await message.nack(requeue=True)
        consumer_id = await queue.consume(process_message , no_ack=False) 
        return consumer_id
    
    async def close(self): 
        if self.connection is not None: 
            await self.connection.close() 
        print("RabbitMQ has been closed") 
