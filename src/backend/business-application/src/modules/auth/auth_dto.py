from pydantic import BaseModel, EmailStr 
# /api/v1/auth/register
class RegisterResponse(BaseModel): 
    verify_code: str 
    message: str 

class RegisterRequest(BaseModel): 
    full_name: str 
    email: EmailStr 
    password : str 
    address : str 

