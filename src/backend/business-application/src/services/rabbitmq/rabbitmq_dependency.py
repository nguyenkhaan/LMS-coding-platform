from fastapi import Request

from src.services.rabbitmq.rabbitmq_manager import RabbitMQManager 

def get_rabbitmq_manager(
        request : Request 
) -> RabbitMQManager: 
    return request.app.state.rabbitmq_manager 