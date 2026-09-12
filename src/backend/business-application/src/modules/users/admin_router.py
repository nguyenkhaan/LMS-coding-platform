from fastapi import APIRouter, Depends

from src.middlewares.role_middleware import require_role
from src.models.base_model import Role
from src.modules.users.admin_dto import (
    AdminUserListQuery,
    UpdateUserAccountStatus,
    UpdateUserRoles,
)
from src.modules.users.dependencies import get_user_service
from src.modules.users.service import UserService

router = APIRouter(
    prefix="/admin/users",
    tags=["Current User, Profile & Admin User Management"],
)


@router.get("")
async def get_admin_users(
    query: AdminUserListQuery = Depends(),
    admin=Depends(require_role(Role.ADMIN)),
    user_service: UserService = Depends(get_user_service),
):
    return await user_service.get_admin_users(query)


@router.put("/{user_id}/status")
async def update_user_account_status(
    user_id: int,
    data: UpdateUserAccountStatus,
    admin=Depends(require_role(Role.ADMIN)),
    user_service: UserService = Depends(get_user_service),
):
    return await user_service.update_user_account_status(admin["sub"], user_id, data)


@router.put("/{user_id}/roles")
async def update_user_roles(
    user_id: int,
    data: UpdateUserRoles,
    admin=Depends(require_role(Role.ADMIN)),
    user_service: UserService = Depends(get_user_service),
):
    return await user_service.update_user_roles(admin["sub"], user_id, data)
