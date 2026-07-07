# /authorize -> Tien hanh kiem tra xem cookies co luu tru duoc gi khong 
# /login (GET): Render ra template dung de login 
# /login (POST): Nhan vao email + password. Tra cuu database.

from fastapi import APIRouter, Cookie, Depends, Request 
from src.routers.auth.auth_dependency import get_auth_service
from src.routers.auth.auth_service import AuthService
from src.cores.template import templates
router = APIRouter(prefix="/auth" , tags=["OAuth"]) 

@router.post("/authorize") 
async def authorize(
    redirect_uri: str, 
    session_id : str | None = Cookie(None),
    auth_service : AuthService = Depends(get_auth_service)
): 
    response = await auth_service.authorize(session_id, redirect_uri) 
    return response 

@router.get("/login") 
async def login_template(
    request : Request, 
    redirect_uri : str 
): 
    return templates.TemplateResponse(
        request = request, 
        context={
            "redirect_uri" : redirect_uri
        }
    )

@router.post("/login") 
async def login():
    pass 