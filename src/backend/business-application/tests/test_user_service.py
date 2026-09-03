from unittest.mock import AsyncMock, Mock
from datetime import UTC, datetime

import pytest
from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError

from src.models.base_model import AccountStatus, Role, TeacherRegisterStatus
from src.models.role_model import UserRoleModel
from src.models.student_profile_model import StudentProfileModel
from src.models.teacher_profile_model import TeacherProfileModel
from src.models.teacher_register_model import TeacherRegisterModel
from src.models.user_model import UserModel
from src.modules.user.user_dto import (
    AdminUserListQuery,
    UpdateStudentProfile,
    UpdateTeacherProfile,
    UpdateUserAccountStatus,
    UpdateUserPersonal,
    UpdateUserRoles,
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


@pytest.mark.asyncio
async def test_get_admin_users_returns_redacted_users_with_capabilities() -> None:
    timestamp = datetime.now(UTC)
    user = UserModel(
        id=1,
        full_name="Student User",
        email="student@example.com",
        address=None,
        avatar_url=None,
        password="must-not-be-returned",
        refresh_token="must-not-be-returned",
        account_status=AccountStatus.ACTIVE,
        created_at=timestamp,
        updated_at=timestamp,
    )
    user.roles = [UserRoleModel(id=10, user_id=1, role=Role.STUDENT)]
    query_result = Mock()
    query_result.scalars.return_value.all.return_value = [user]
    session = Mock()
    session.scalar = AsyncMock(return_value=1)
    session.execute = AsyncMock(return_value=query_result)
    service = UserService(session)

    response = await service.get_admin_users(AdminUserListQuery())

    assert response.total_items == 1
    assert response.total_pages == 1
    assert response.current_page == 1
    assert response.items[0].id == 1
    assert response.items[0].roles[0].role == Role.STUDENT
    assert response.items[0].capabilities.can_learn is True
    assert response.items[0].capabilities.can_teach is False
    assert response.items[0].capabilities.can_manage_users is False
    assert "password" not in response.items[0].model_dump()
    assert "refresh_token" not in response.items[0].model_dump()


@pytest.mark.asyncio
async def test_banning_a_user_revokes_the_refresh_token_and_writes_an_audit_log() -> None:
    timestamp = datetime.now(UTC)
    user = UserModel(
        id=2,
        full_name="Banned User",
        email="banned@example.com",
        account_status=AccountStatus.ACTIVE,
        refresh_token="active-refresh-token",
        created_at=timestamp,
        updated_at=timestamp,
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

    response = await service.update_user_account_status(
        admin_id=1,
        user_id=2,
        data=UpdateUserAccountStatus(account_status=AccountStatus.BANNED),
    )

    assert user.account_status == AccountStatus.BANNED
    assert user.refresh_token is None
    assert response.account_status == AccountStatus.BANNED
    audit_log = session.add.call_args.args[0]
    assert audit_log.user_id == 1
    assert audit_log.action.value == "ACCOUNT_STATUS_UPDATE"
    assert audit_log.target_type == "user"
    assert audit_log.target_id == 2
    session.commit.assert_awaited_once()


@pytest.mark.asyncio
async def test_update_user_roles_replaces_roles_and_does_not_grant_teaching_capability() -> None:
    user = UserModel(id=2, full_name="Teacher", email="teacher@example.com")
    user.roles = [UserRoleModel(id=10, user_id=2, role=Role.STUDENT)]
    user.teacher_profile = TeacherProfileModel(user_id=2)
    query_result = Mock()
    query_result.scalar_one_or_none.return_value = user
    session = Mock()
    session.execute = AsyncMock(side_effect=[query_result, Mock()])
    session.add_all.side_effect = lambda roles: [
        setattr(role, "id", index) for index, role in enumerate(roles, start=20)
    ]
    session.flush = AsyncMock()
    session.commit = AsyncMock()
    session.rollback = AsyncMock()
    service = UserService(session)

    response = await service.update_user_roles(
        admin_id=1,
        user_id=2,
        data=UpdateUserRoles(roles=[Role.TEACHER]),
    )

    assert [role.role for role in response.roles] == [Role.TEACHER]
    assert response.capabilities.can_teach is False
    audit_log = session.add.call_args.args[0]
    assert audit_log.action.value == "ROLE_UPDATE"
    assert audit_log.target_id == 2
    session.add_all.assert_called_once()
    session.commit.assert_awaited_once()
