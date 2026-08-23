from fastapi import APIRouter, Cookie, Depends, Request, Body
from fastapi.responses import PlainTextResponse

from src.cores.settings import JWT_ACCESS_PUBLIC
from src.cores.template import templates
from src.modules.auth.auth_dto import (
    AuthCodeResponse,
    ChangeEmailRequest,
    ChangeEmailResponse,
    ConfirmEmailChangeRequest,
    ConfirmEmailChangeResponse,
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
    VerifyPasswordChangingResponse,
    VerifyPasswordChangingRequest,
)
from src.modules.auth.auth_dependency import get_auth_service
from src.modules.auth.auth_service import AuthService
from src.middlewares.auth_middleware import get_current_user

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


@router.post("/change-password", response_model=ForgotPasswordResponse)
async def reset_password(
    auth_service: AuthService = Depends(get_auth_service),
    user: dict = Depends(get_current_user),
):
    return await auth_service.change_password(user["sub"])

@router.post("/verify-password-changing")
async def verify_password_changing(
    data : VerifyPasswordChangingRequest, 
    auth_service : AuthService = Depends(get_auth_service) 
    
): 
    return await auth_service.verify_password_changing(
        data.code,
        data.new_password
    )

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


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
async def forgot_password(
    data: ForgotPasswordRequest,
    auth_service: AuthService = Depends(get_auth_service),
):
    return await auth_service.forgot_password(data.email)


@router.post("/change-email", response_model=ChangeEmailResponse)
async def change_email(
    data: ChangeEmailRequest,
    auth_service: AuthService = Depends(get_auth_service),
    user: dict = Depends(get_current_user),
):
    return await auth_service.request_email_change(
        user["sub"], str(data.new_email), data.password
    )


@router.post("/confirm-email-change", response_model=ConfirmEmailChangeResponse)
async def confirm_email_change(
    data: ConfirmEmailChangeRequest,
    auth_service: AuthService = Depends(get_auth_service),
):
    return await auth_service.confirm_email_change(data.token)
