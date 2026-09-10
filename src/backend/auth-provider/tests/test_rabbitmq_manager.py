import pytest
import asyncio
from unittest.mock import patch, AsyncMock, MagicMock
from src.services.rabbitmq_manager import async_retry, RabbitMQManager

@pytest.mark.asyncio
async def test_async_retry_success_after_retries():
    attempts = 0

    @async_retry
    async def flaky_function():
        nonlocal attempts
        attempts += 1
        if attempts < 5:
            raise ValueError("Failed")
        return "Success"

    with patch("asyncio.sleep", new_callable=AsyncMock) as mock_sleep:
        result = await flaky_function()
        
        assert result == "Success"
        assert attempts == 5
        assert mock_sleep.call_count == 4

@pytest.mark.asyncio
async def test_async_retry_fails_all_retries():
    attempts = 0

    @async_retry
    async def failing_function():
        nonlocal attempts
        attempts += 1
        raise ValueError("Always fails")

    with patch("asyncio.sleep", new_callable=AsyncMock) as mock_sleep:
        with pytest.raises(ValueError, match="Always fails"):
            await failing_function()
        
        assert attempts == 5
        assert mock_sleep.call_count == 4

@pytest.mark.asyncio
@patch("src.services.rabbitmq_manager.aio_pika.connect_robust")
async def test_rabbitmq_connect_declares_queues(mock_connect_robust):
    mock_connection = AsyncMock()
    mock_channel = AsyncMock()
    
    mock_connect_robust.return_value = mock_connection
    mock_connection.channel.return_value = mock_channel

    manager = RabbitMQManager()
    await manager.connect()

    assert mock_connect_robust.called
    assert mock_channel.declare_queue.call_count == 3

    # Verify all 3 required queues are declared
    calls = mock_channel.declare_queue.call_args_list
    declared_queues = [call[0][0] for call in calls]
    
    assert "submission_queue" in declared_queues
    assert "transcode_queue" in declared_queues
    assert "email_queue" in declared_queues
    
    for call in calls:
        assert call[1].get("durable") is True

@pytest.mark.asyncio
async def test_rabbitmq_publish_raises_if_not_declared():
    manager = RabbitMQManager()
    # Assume connect() was called but queue was not declared (mocked state)
    manager.channel = AsyncMock()
    
    with pytest.raises(ValueError, match="Queue not_declared_queue is not declared"):
        await manager.publish("not_declared_queue", b'{"test": "data"}')

@pytest.mark.asyncio
@patch("src.services.rabbitmq_manager.RabbitMQManager.connect")
async def test_rabbitmq_publish_auto_connects_if_channel_none(mock_connect):
    manager = RabbitMQManager()
    # channel is None by default, queues is empty
    
    # We override connect to populate channel and queues
    async def fake_connect():
        manager.channel = AsyncMock()
        manager.queues["test_queue"] = AsyncMock()
        
    mock_connect.side_effect = fake_connect

    await manager.publish("test_queue", b'{"msg": "hello"}')
    
    mock_connect.assert_called_once()
    manager.channel.default_exchange.publish.assert_called_once()
