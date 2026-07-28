from pydantic import BaseModel, EmailStr 
class AuthBase(BaseModel): 
    message : str 

class RegisterResponse(BaseModel): 
    verify_code: str 
    message: str 

class RegisterRequest(BaseModel): 
    full_name: str 
    email: EmailStr 
    password : str 
    address : str 

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
    credential_code : str 

class LoginGoogleResponse(BaseModel): 
    access_token : str 
    refresh_token : str 