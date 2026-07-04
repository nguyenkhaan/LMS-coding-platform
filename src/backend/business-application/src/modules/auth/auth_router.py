from fastapi import APIRouter, Depends

from src.modules.auth.auth_dependency import get_auth_service
from src.modules.auth.auth_service import AuthService
from src.modules.auth.auth_dto import RegisterRequest, RegisterResponse

router = APIRouter(prefix="/auth" , tags=["Auth"]) 

@router.post(
    "/register", 
    response_model=RegisterResponse
) 
async def register(data : RegisterRequest , auth_service : AuthService = Depends(get_auth_service)):
    response = await auth_service.register(data) 
    return response 