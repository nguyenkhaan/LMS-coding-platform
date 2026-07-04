from fastapi import APIRouter, HTTPException

from src.modules.auth.auth_dto import RegisterRequest

router = APIRouter(prefix="/auth" , tags=["Auth"]) 

@router.post(
    "/register", 
) 
async def register(data : RegisterRequest):
    print("Du lieu gui len la: " , data) 
    return "Register successfully" 