from typing import Optional

from pydantic import BaseModel, EmailStr 


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


class ForgotPasswordResponse(BaseModel):
    message: str
    code: str

class ChangePasswordRequest(BaseModel): 
    ... 

class ChangePasswordResponse(BaseModel): 
    message : str 
    code : str  

class ResendOtpRequest(BaseModel):
    email: EmailStr


class ResendOtpResponse(AuthBase):
    """
        dto for resend otp 
    """


class ChangeEmailRequest(BaseModel):
    new_email: EmailStr
    password: str


class ChangeEmailResponse(BaseModel):
    message: str
    token: str


class VerifyPasswordChangingRequest(BaseModel):
    code: str
    new_password: str


class VerifyPasswordChangingResponse(AuthBase):
    """
        dto for verify reset password 
    """


class VerifyResetEmailResponse(AuthBase):
    """
        dto for verify reset email 
    """
