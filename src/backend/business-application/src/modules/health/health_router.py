from fastapi import APIRouter, Depends, HTTPException

from src.models.base_model import Role
from src.middlewares.role_middleware import require_role
from src.middlewares import auth_middleware
router = APIRouter(
    prefix="/health", 
    tags=["Health"]
) 

@router.get("/liveness") 
async def liveness(): 
    return {
        "message": "Your application is running. Build with Cloudian 💙 Cloud"
    }

@router.get("/error") 
async def error(): 
    raise HTTPException(
        status_code = 400, 
        detail = "Testing error"
    )

@router.get("/scalar") 
async def scalar(): 
    return "This is a single line"

@router.get("/test-auth") 
async def test_auth(
    user = Depends(
        require_role(Role.STUDENT)
    )
): 
    return "Authentication OK!!!"