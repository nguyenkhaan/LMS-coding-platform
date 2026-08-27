from typing import List

from pydantic import BaseModel

from src.models.base_model import AccountStatus, Role 

class UserIdentityMe(BaseModel): 
    email: str 
    roles: List[Role]
    status : AccountStatus

class StudentProfileView(BaseModel): 
    id : int 
    full_name: str 
    address: str | None 
    email : str 
    status : AccountStatus 
    avatar_url : str | None = None 
    bio : str | None 
    learning_preferences : str | None 
    social_links: str | None 

class UpdateUserPersonal(BaseModel): 
    full_name: str | None  = None 
    address : str | None = None 
    avatar_url : str | None = None # Cap nhat thong tin avatar 