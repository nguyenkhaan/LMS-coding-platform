from datetime import datetime
from typing import List, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

from src.models.base_model import AccountStatus, Role 

class UserIdentityMe(BaseModel): 
    email: str 
    roles: List[Role]
    status : AccountStatus

class StudentProfileView(BaseModel): 
    id : int 
    full_name: str 
    address: str | None 
    email : str 
    status : AccountStatus 
    avatar_url : str | None = None 
    bio : str | None 
    learning_preferences : str | None 
    social_links: str | None 

class UpdateUserPersonal(BaseModel): 
    full_name: str | None  = None 
    address : str | None = None 
    avatar_url : str | None = None # Cap nhat thong tin avatar 

class UpdateStudentProfile(BaseModel): 
    bio : str | None = None 
    learning_preferences : str | None = None 
    social_links : str | None = None 
    model_config = ConfigDict(extra="forbid")

class UpdateTeacherProfile(BaseModel): 
    avatar_url: str | None = None
    headline: str | None = None
    expertise_tags: str | None = None
    years_of_experience: int | None = Field(default=None, ge=0)
    education_entries: str | None = None
    experience_entries: str | None = None
    github_url: str | None = None
    linkedin_url: str | None = None
    website_url: str | None = None
    email: str | None = None
    phone: str | None = None

    model_config = ConfigDict(extra="forbid")


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
    roles: List[UserRoleView]
    capabilities: UserCapabilitiesView


class AdminUserListQuery(BaseModel):
    q: str | None = None
    role: Role | None = None
    account_status: AccountStatus | None = None
    page: int = Field(default=1, ge=1)
    size: int = Field(default=20, ge=1, le=100)

    model_config = ConfigDict(extra="forbid")


class AdminUserListResponse(BaseModel):
    items: List[AdminUserView]
    total_items: int
    total_pages: int
    current_page: int


class UpdateUserAccountStatus(BaseModel):
    account_status: Literal[AccountStatus.ACTIVE, AccountStatus.BANNED] | None = None

    model_config = ConfigDict(extra="forbid")


class UpdateUserRoles(BaseModel):
    roles: List[Role] | None = Field(default=None, min_length=1)

    model_config = ConfigDict(extra="forbid")

    @field_validator("roles")
    @classmethod
    def roles_must_not_contain_duplicates(
        cls,
        roles: List[Role] | None,
    ) -> List[Role] | None:
        if roles is not None and len(set(roles)) != len(roles):
            raise ValueError("roles must not contain duplicates")
        return roles


class UpdateUserRolesResponse(BaseModel):
    user_id: int
    roles: List[UserRoleView]
    capabilities: UserCapabilitiesView
