from fastapi import APIRouter, Depends

from src.middlewares.auth_middleware import get_current_user
from src.middlewares.role_middleware import require_role
from src.models.base_model import Role
from src.modules.users.dependencies import get_user_service
from src.modules.users.profile_dto import (
    TeacherProfileView,
    UpdateStudentProfile,
    UpdateTeacherProfile,
    UpdateUserPersonal,
)
from src.modules.users.service import UserService

router = APIRouter(
    prefix="/users", tags=["Current User, Profile & Admin User Management"]
)


@router.get("/me")
async def get_me(
    user=Depends(get_current_user),
    user_service: UserService = Depends(get_user_service),
):
    id = user.get("sub")
    return await user_service.get_me(id)


@router.get("/me/student")
async def get_me_student(
    user=Depends(get_current_user),
    user_service: UserService = Depends(get_user_service),
):
    id = user.get("sub")
    return await user_service.get_user_student_profile(id)


# Cap nhat thong tin ca nhan
@router.put("/")
async def update_personal_information(
    data: UpdateUserPersonal,
    user=Depends(get_current_user),
    user_service: UserService = Depends(get_user_service),
):
    id = user.get("sub")
    return await user_service.update_personal_information(id, data)


@router.put("/me/student-profile")
async def update_student_profile(
    data: UpdateStudentProfile,
    user=Depends(require_role(Role.STUDENT)),
    user_service: UserService = Depends(get_user_service),
):
    id = user.get("sub")
    return await user_service.update_student_profile(id, data)


@router.post("/me/teacher-profile", response_model=TeacherProfileView, status_code=201)
async def create_teacher_profile(
    data: UpdateTeacherProfile,
    user=Depends(require_role(Role.STUDENT)),
    user_service: UserService = Depends(get_user_service),
) -> TeacherProfileView:
    return await user_service.create_teacher_profile(user["sub"], data)


@router.put("/me/teacher-profile")
async def update_teacher_profile(
    data: UpdateTeacherProfile,
    user=Depends(get_current_user),
    user_service: UserService = Depends(get_user_service),
):
    id = user.get("sub")
    return await user_service.update_teacher_profile(id, data)
