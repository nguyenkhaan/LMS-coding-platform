from unittest.mock import AsyncMock, Mock

import pytest
from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError

from src.models.user_model import UserModel
from src.modules.user.user_dto import UpdateUserPersonal
from src.modules.user.user_service import UserService


@pytest.mark.asyncio
async def test_update_personal_information_updates_only_allowed_fields() -> None:
    user = UserModel(
        id=1,
        full_name="Old name",
        email="student@example.com",
        address="Old address",
        avatar_url=None,
    )
    query_result = Mock()
    query_result.scalar_one_or_none.return_value = user
    session = Mock()
    session.execute = AsyncMock(return_value=query_result)
    session.flush = AsyncMock()
    session.commit = AsyncMock()
    session.refresh = AsyncMock()
    session.rollback = AsyncMock()
    service = UserService(session)

    response = await service.update_personal_information(
        user_id=1,
        data=UpdateUserPersonal(
            full_name="New name",
            avatar_url="https://example.com/avatar.png",
        ),
    )

    assert user.full_name == "New name"
    assert user.address == "Old address"
    assert user.avatar_url == "https://example.com/avatar.png"
    assert response == {
        "message": "Personal information updated successfully",
        "data": {
            "full_name": "New name",
            "address": "Old address",
            "avatar_url": "https://example.com/avatar.png",
        },
    }
    session.flush.assert_awaited_once()
    session.commit.assert_awaited_once()
    session.refresh.assert_awaited_once_with(user)
    session.rollback.assert_not_awaited()


@pytest.mark.asyncio
async def test_update_personal_information_rejects_an_empty_update() -> None:
    session = Mock()
    session.execute = AsyncMock()
    session.rollback = AsyncMock()
    service = UserService(session)

    with pytest.raises(HTTPException) as error:
        await service.update_personal_information(
            user_id=1,
            data=UpdateUserPersonal(),
        )

    assert error.value.status_code == 400
    session.execute.assert_not_awaited()
    session.rollback.assert_awaited_once()


@pytest.mark.asyncio
async def test_update_personal_information_returns_not_found_for_a_missing_user() -> None:
    query_result = Mock()
    query_result.scalar_one_or_none.return_value = None
    session = Mock()
    session.execute = AsyncMock(return_value=query_result)
    session.rollback = AsyncMock()
    service = UserService(session)

    with pytest.raises(HTTPException) as error:
        await service.update_personal_information(
            user_id=999,
            data=UpdateUserPersonal(full_name="New name"),
        )

    assert error.value.status_code == 404
    assert error.value.detail == "User not found"
    session.rollback.assert_awaited_once()


@pytest.mark.asyncio
async def test_update_personal_information_maps_database_errors_to_service_unavailable() -> None:
    session = Mock()
    session.execute = AsyncMock(side_effect=SQLAlchemyError())
    session.rollback = AsyncMock()
    service = UserService(session)

    with pytest.raises(HTTPException) as error:
        await service.update_personal_information(
            user_id=1,
            data=UpdateUserPersonal(full_name="New name"),
        )

    assert error.value.status_code == 503
    assert error.value.detail == "Unable to update personal information right now"
    session.rollback.assert_awaited_once()
