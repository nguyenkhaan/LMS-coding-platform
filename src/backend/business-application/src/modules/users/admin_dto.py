from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

from src.models.base_model import AccountStatus, Role


class UserRoleView(BaseModel):
    id: int
    user_id: int
    role: Role


class UserCapabilitiesView(BaseModel):
    can_learn: bool
    can_teach: bool
    can_manage_users: bool


class UserView(BaseModel):
    id: int
    full_name: str
    address: str | None
    email: str
    avatar_url: str | None
    account_status: AccountStatus
    created_at: datetime
    updated_at: datetime


class AdminUserView(UserView):
    roles: list[UserRoleView]
    capabilities: UserCapabilitiesView


class AdminUserListQuery(BaseModel):
    q: str | None = None
    role: Role | None = None
    account_status: AccountStatus | None = None
    page: int = Field(default=1, ge=1)
    size: int = Field(default=20, ge=1, le=100)

    model_config = ConfigDict(extra="forbid")


class AdminUserListResponse(BaseModel):
    items: list[AdminUserView]
    total_items: int
    total_pages: int
    current_page: int


class UpdateUserAccountStatus(BaseModel):
    account_status: Literal[AccountStatus.ACTIVE, AccountStatus.BANNED] | None = None

    model_config = ConfigDict(extra="forbid")


class UpdateUserRoles(BaseModel):
    roles: list[Role] | None = Field(default=None, min_length=1)

    model_config = ConfigDict(extra="forbid")

    @field_validator("roles")
    @classmethod
    def roles_must_not_contain_duplicates(
        cls,
        roles: list[Role] | None,
    ) -> list[Role] | None:
        if roles is not None and len(set(roles)) != len(roles):
            raise ValueError("roles must not contain duplicates")
        return roles


class UpdateUserRolesResponse(BaseModel):
    user_id: int
    roles: list[UserRoleView]
    capabilities: UserCapabilitiesView
