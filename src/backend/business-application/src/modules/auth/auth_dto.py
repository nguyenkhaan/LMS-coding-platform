from pydantic import BaseModel, EmailStr 

class RegisterResponse(BaseModel): 
    verify_code: str # code using for verify account register 
    message: str 

class RegisterRequest(BaseModel): 
    email: EmailStr # using email str to verify this is valid 
    password : str 
# status_code , content = { "message" : "Cloudian Notification Request" , "errors" : errors } 