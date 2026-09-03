from fastapi import APIRouter, Depends

from src.modules.user.user_dto import (
    AdminUserListQuery,
    UpdateStudentProfile,
    UpdateTeacherProfile,
    UpdateUserAccountStatus,
    UpdateUserPersonal,
    UpdateUserRoles,
)
from src.modules.user.user_dependency import get_user_service
from src.modules.user.user_service import UserService
from src.middlewares.auth_middleware import get_current_user 
from src.middlewares.role_middleware import require_role
from src.models.base_model import Role

router = APIRouter(
    prefix = '/users',
    tags=['Current User, Profile & Admin User Management']
)
admin_router = APIRouter(
    prefix='/admin/users',
    tags=['Current User, Profile & Admin User Management'],
)

@router.get('/me') 
async def get_me(
    user = Depends(get_current_user), 
    user_service : UserService = Depends(get_user_service)
): 
    id = user.get('sub') 
    return (await user_service.get_me(id)) 

@router.get('/me/student') 
async def get_me_student(
    user = Depends(get_current_user), 
    user_service : UserService = Depends(get_user_service)
): 
    id = user.get('sub') 
    return (await user_service.get_user_student_profile(id)) 

# Cap nhat thong tin ca nhan 
@router.put('/') 
async def update_personal_information(
    data : UpdateUserPersonal, 
    user = Depends(get_current_user), 
    user_service : UserService = Depends(get_user_service)
): 
    id = user.get('sub')
    return await user_service.update_personal_information(id, data)

@router.put('/me/student-profile')
async def update_student_profile(
    data : UpdateStudentProfile,
    user = Depends(require_role(Role.STUDENT)),
    user_service : UserService = Depends(get_user_service)
): 
    id = user.get('sub')
    return await user_service.update_student_profile(id, data)

@router.put('/me/teacher-profile') 
async def update_teacher_profile(
    data : UpdateTeacherProfile,
    user = Depends(require_role(Role.TEACHER)),
    user_service : UserService = Depends(get_user_service)
): 
    id = user.get('sub')
    return await user_service.update_teacher_profile(id, data)


@admin_router.get('')
async def get_admin_users(
    query: AdminUserListQuery = Depends(),
    admin = Depends(require_role(Role.ADMIN)),
    user_service: UserService = Depends(get_user_service),
):
    return await user_service.get_admin_users(query)


@admin_router.put('/{user_id}/status')
async def update_user_account_status(
    user_id: int,
    data: UpdateUserAccountStatus,
    admin=Depends(require_role(Role.ADMIN)),
    user_service: UserService = Depends(get_user_service),
):
    return await user_service.update_user_account_status(admin['sub'], user_id, data)


@admin_router.put('/{user_id}/roles')
async def update_user_roles(
    user_id: int,
    data: UpdateUserRoles,
    admin=Depends(require_role(Role.ADMIN)),
    user_service: UserService = Depends(get_user_service),
):
    return await user_service.update_user_roles(admin['sub'], user_id, data)
