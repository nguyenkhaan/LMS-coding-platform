# /authorize -> Tien hanh kiem tra xem cookies co luu tru duoc gi khong 
# /login (GET): Render ra template dung de login 
# /login (POST): Nhan vao email + password. Tra cuu database.

from fastapi import APIRouter, Cookie, Depends, Request 
from modules.auth.auth_dto import LoginGoogleRequest, RefreshRequest
from src.modules.auth.auth_dependency import get_auth_service
from src.modules.auth.auth_service import AuthService
from src.cores.template import templates
from src.cores.settings import JWT_ACCESS_PUBLIC
from fastapi.responses import PlainTextResponse

router = APIRouter(prefix="/auth" , tags=["OAuth"]) 

@router.post("/register") 
async def register(): 
    return ""  

@router.get("/verify") 
async def verify(
    otp: str, 
    auth_service : AuthService = Depends(get_auth_service)
): 
    response = await auth_service.verify_register(otp) 
    return response 

@router.post("/resend-otp") # Resend the account verify register
async def resend_otp(): 
    return "" 

@router.post("/forgot-password") 
async def forgot_password(): 
    return "" 

@router.post("/reset-password") 
async def reset_password(): 
    return "" 

@router.post("/change-email")
async def change_email(): 
    return ""

@router.post("/verify-reset-email") 
async def verify_reset_email(): 
    return "" 

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

@router.post("/code") 
async def auth_code(
    code : str, 
    auth_service : AuthService = Depends(get_auth_service) 
): 
    response = await auth_service.auth_code(code) 
    return response 

@router.get("/public-key")
async def public_key(): 
    return PlainTextResponse(JWT_ACCESS_PUBLIC)

@router.post("/refresh") 
async def refresh(
    data : RefreshRequest, 
    auth_service : AuthService = Depends(get_auth_service)
):  
    token = data.refresh_token 
    response = await auth_service.refresh(token) 
    return response 

@router.post('/google') 
async def login_google(
    data : LoginGoogleRequest, 
    auth_service : AuthService = Depends(get_auth_service)
): 
    response = await auth_service.login_google(data.credential_code)
    return response 

# Phai gui kem them JWT token de co the tien hanh xoa di session cua nguoi dung nay
@router.post('/logout')
async def logout(): 
    return "" 