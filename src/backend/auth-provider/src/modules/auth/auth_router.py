from fastapi import APIRouter, Cookie, Depends, Request, Body
from fastapi.responses import PlainTextResponse

from src.cores.settings import JWT_ACCESS_PUBLIC
from src.cores.template import templates
from src.modules.auth.auth_dto import (
    AuthCodeResponse,
    ChangeEmailRequest,
    ChangeEmailResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginGoogleRequest,
    LoginResponse,
    LogoutResponse,
    RefreshRequest,
    RefreshResponse,
    RegisterRequest,
    RegisterResponse,
    ResendOtpRequest,
    ResendOtpResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
    VerifyResetEmailResponse,
)
from src.modules.auth.auth_dependency import get_auth_service
from src.modules.auth.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["OAuth"])


@router.get("/authorize")
async def authorize(
    redirect_uri: str,
    session_id: str | None = Cookie(None),
    auth_service: AuthService = Depends(get_auth_service),
):
    response = await auth_service.authorize(session_id, redirect_uri)
    return response


@router.get("/login")
async def login_template(
    request: Request,
    redirect_uri: str,
):
    return templates.TemplateResponse(
        name="login.html",
        request=request,
        context={
            "redirect_uri": redirect_uri
        },
    )


@router.get("/public-key")
async def public_key():
    return PlainTextResponse(JWT_ACCESS_PUBLIC)


@router.get("/verify")
async def verify(
    otp: str,
    auth_service: AuthService = Depends(get_auth_service),
):
    response = await auth_service.verify_register(otp)
    return response


@router.post("/reset-password")
async def reset_password(
    data: ResetPasswordRequest = Body(...),
    auth_service: AuthService = Depends(get_auth_service),
):
    return await auth_service.reset_password(data.code, data.new_password)


@router.get("/verify-reset-email")
async def verify_reset_email(
    token: str,
    auth_service: AuthService = Depends(get_auth_service),
):
    response = await auth_service.verify_reset_email(token)
    return response


@router.post("/login")
async def login(
    request: Request,
    auth_service: AuthService = Depends(get_auth_service),
):
    form = await request.form()
    email = str(form.get("email")) 
    password = str(form.get("password"))
    redirect_uri = str(form.get("redirect_uri")) 
    response = await auth_service.login(email, password, redirect_uri)
    return response


@router.post("/code")
async def auth_code(
    code: str,
    auth_service: AuthService = Depends(get_auth_service),
):
    response = await auth_service.auth_code(code)
    return response


@router.post("/refresh")
async def refresh(
    data: RefreshRequest,
    auth_service: AuthService = Depends(get_auth_service),
):
    token = data.refresh_token
    response = await auth_service.refresh(token)
    return response


@router.post("/google")
async def login_google(
    data: LoginGoogleRequest,
    auth_service: AuthService = Depends(get_auth_service),
):
    response = await auth_service.login_google(data.credential_code)
    return response


@router.post("/logout")
async def logout(
    auth_service: AuthService = Depends(get_auth_service),
):
    return await auth_service.logout()


@router.post("/register")
async def register(
    data: RegisterRequest,
    auth_service: AuthService = Depends(get_auth_service),
):
    return await auth_service.register(data)


@router.post("/resend-otp")
async def resend_otp(
    data: ResendOtpRequest,
    auth_service: AuthService = Depends(get_auth_service),
):
    return await auth_service.resend_otp(data.email)


@router.post("/forgot-password")
async def forgot_password(
    data: ForgotPasswordRequest,
    auth_service: AuthService = Depends(get_auth_service),
):
    return await auth_service.forgot_password(data.email)


@router.post("/change-email")
async def change_email(
    data: ChangeEmailRequest,
    auth_service: AuthService = Depends(get_auth_service),
):
    return await auth_service.change_email(data.new_email, data.password)
