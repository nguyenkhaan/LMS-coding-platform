from fastapi import APIRouter, Depends

from src.modules.auth import auth_service
from src.modules.auth.auth_dependency import get_auth_service
from src.modules.auth.auth_service import AuthService
from src.modules.auth.auth_dto import RegisterRequest, RegisterResponse
from src.bases.guards.jwt_guard import require_login
router = APIRouter(prefix="/auth" , tags=["Auth"]) 

@router.post(
    "/register", 
    response_model=RegisterResponse
) 
async def register(data : RegisterRequest , auth_service : AuthService = Depends(get_auth_service)):
    response = await auth_service.register(data) 
    return response 
@router.get(
    "/verify", 
) 
async def verify(code : str , auth_service : AuthService = Depends(get_auth_service)):
    return (await auth_service.verify_register(code)) 

@router.get("/test") 
async def testing_jwt(
    user = Depends(require_login)
): 
    print("Testing successfully") 
    return user 