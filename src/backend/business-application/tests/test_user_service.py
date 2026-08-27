from unittest.mock import AsyncMock, Mock

import pytest
from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError

from src.models.base_model import TeacherRegisterStatus
from src.models.student_profile_model import StudentProfileModel
from src.models.teacher_profile_model import TeacherProfileModel
from src.models.teacher_register_model import TeacherRegisterModel
from src.models.user_model import UserModel
from src.modules.user.user_dto import (
    UpdateStudentProfile,
    UpdateTeacherProfile,
    UpdateUserPersonal,
)
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


@pytest.mark.asyncio
async def test_update_student_profile_updates_only_allowed_fields() -> None:
    profile = StudentProfileModel(
        user_id=1,
        bio="Old bio",
        learning_preferences="Videos",
        social_links=None,
    )
    query_result = Mock()
    query_result.scalar_one_or_none.return_value = profile
    session = Mock()
    session.execute = AsyncMock(return_value=query_result)
    session.flush = AsyncMock()
    session.commit = AsyncMock()
    session.refresh = AsyncMock()
    session.rollback = AsyncMock()
    service = UserService(session)

    response = await service.update_student_profile(
        user_id=1,
        data=UpdateStudentProfile(bio="New bio", social_links="https://example.com"),
    )

    assert profile.bio == "New bio"
    assert profile.learning_preferences == "Videos"
    assert profile.social_links == "https://example.com"
    assert response["data"] == {
        "bio": "New bio",
        "learning_preferences": "Videos",
        "social_links": "https://example.com",
    }
    session.commit.assert_awaited_once()
    session.rollback.assert_not_awaited()


@pytest.mark.asyncio
async def test_update_student_profile_maps_database_errors_to_service_unavailable() -> None:
    session = Mock()
    session.execute = AsyncMock(side_effect=SQLAlchemyError())
    session.rollback = AsyncMock()
    service = UserService(session)

    with pytest.raises(HTTPException) as error:
        await service.update_student_profile(
            user_id=1,
            data=UpdateStudentProfile(bio="New bio"),
        )

    assert error.value.status_code == 503
    assert error.value.detail == "Unable to update student profile right now"
    session.rollback.assert_awaited_once()


@pytest.mark.asyncio
async def test_update_teacher_profile_updates_only_allowed_fields() -> None:
    profile = TeacherProfileModel(
        user_id=1,
        headline="Old headline",
        expertise_tags="Python",
        years_of_experience=2,
        email="teacher@example.com",
    )
    query_result = Mock()
    query_result.scalar_one_or_none.return_value = profile
    session = Mock()
    session.execute = AsyncMock(return_value=query_result)
    session.flush = AsyncMock()
    session.commit = AsyncMock()
    session.refresh = AsyncMock()
    session.rollback = AsyncMock()
    service = UserService(session)

    response = await service.update_teacher_profile(
        user_id=1,
        data=UpdateTeacherProfile(
            headline="New headline",
            years_of_experience=3,
        ),
    )

    assert profile.headline == "New headline"
    assert profile.expertise_tags == "Python"
    assert profile.years_of_experience == 3
    assert response["data"]["headline"] == "New headline"
    assert response["data"]["years_of_experience"] == 3
    session.commit.assert_awaited_once()
    session.rollback.assert_not_awaited()


@pytest.mark.asyncio
async def test_update_teacher_profile_rejects_pending_registration() -> None:
    profile = TeacherProfileModel(user_id=1, headline="Old headline")
    profile.registration = TeacherRegisterModel(
        id=1,
        teacher_profile_id=1,
        identity_number="123456789",
        status=TeacherRegisterStatus.PENDING,
    )
    query_result = Mock()
    query_result.scalar_one_or_none.return_value = profile
    session = Mock()
    session.execute = AsyncMock(return_value=query_result)
    session.commit = AsyncMock()
    session.rollback = AsyncMock()
    service = UserService(session)

    with pytest.raises(HTTPException) as error:
        await service.update_teacher_profile(
            user_id=1,
            data=UpdateTeacherProfile(headline="New headline"),
        )

    assert error.value.status_code == 409
    assert profile.headline == "Old headline"
    session.commit.assert_not_awaited()
    session.rollback.assert_awaited_once()
