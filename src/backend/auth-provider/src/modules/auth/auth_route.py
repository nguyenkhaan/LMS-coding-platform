# /authorize -> Tien hanh kiem tra xem cookies co luu tru duoc gi khong 
# /login (GET): Render ra template dung de login 
# /login (POST): Nhan vao email + password. Tra cuu database.

from fastapi import APIRouter, Cookie, Depends, Request 
from src.modules.auth.auth_dependency import get_auth_service
from src.modules.auth.auth_service import AuthService
from src.cores.template import templates
router = APIRouter(prefix="/auth" , tags=["OAuth"]) 

@router.get("/authorize") 
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
        name="login.html",  
        request = request, 
        context={
            "redirect_uri" : redirect_uri
        }
    )

@router.post("/login") 
async def login(
    request: Request, 
    auth_service : AuthService = Depends(get_auth_service)
):
    form = await request.form() 
    email = form.get("email") 
    password = form.get("password") 
    redirect_uri = form.get("redirect_uri") 
    print(email, password) 
    response = await auth_service.login(email , password , redirect_uri) 
    return response 
    