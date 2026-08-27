from fastapi import APIRouter, Depends

from src.modules.user.user_dto import UpdateUserPersonal
from src.modules.user.user_dependency import get_user_service
from src.modules.user.user_service import UserService
from src.middlewares.auth_middleware import get_current_user 

router = APIRouter(
    prefix = '/users'
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
