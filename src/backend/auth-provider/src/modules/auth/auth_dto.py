from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class AuthBase(BaseModel): 
    message: Optional[str] = None  


class RegisterResponse(BaseModel): 
    verify_code: str 
    message: str 


class RegisterRequest(BaseModel): 
    full_name: str 
    email: EmailStr 
    password: str 
    address: str 


class VerifyRegisterResponse(AuthBase): 
    """
        dto for verify account 
    """


class RefreshRequest(BaseModel): 
    refresh_token: str 


class RefreshResponse(BaseModel):
    access_token: str
    refresh_token: str


class LoginGoogleRequest(BaseModel): 
    credential_code: str 


class LoginGoogleResponse(BaseModel): 
    access_token: str 
    refresh_token: str 


class LoginResponse(BaseModel): 
    code: str 
    redirect_uri: str 
    identity: str 


class LogoutResponse(AuthBase): 
    """
        dto for logout 
    """


class AuthCodeResponse(BaseModel):
    access_token: str 
    refresh_token: str 


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ForgotPasswordResponse(AuthBase):
    """Generic response that never exposes a password reset code."""

class ResendOtpRequest(BaseModel):
    email: EmailStr


class ResendOtpResponse(AuthBase):
    """
        dto for resend otp 
    """


class ChangeEmailRequest(BaseModel):
    new_email: EmailStr
    password: str = Field(min_length=1, max_length=1024)


class ChangeEmailResponse(BaseModel):
    message: str


class ConfirmEmailChangeRequest(BaseModel):
    token: str = Field(min_length=1, max_length=4096)


class ConfirmEmailChangeResponse(AuthBase):
    """Response returned after a new email address is verified."""


class VerifyPasswordChangingRequest(BaseModel):
    code: str = Field(min_length=1, max_length=4096)
    new_password: str = Field(min_length=1, max_length=1024)


class VerifyPasswordChangingResponse(AuthBase):
    """
        dto for verify reset password 
    """
