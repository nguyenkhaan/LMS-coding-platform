from typing import List

from pydantic import BaseModel, ConfigDict, Field

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

class UpdateStudentProfile(BaseModel): 
    bio : str | None = None 
    learning_preferences : str | None = None 
    social_links : str | None = None 
    model_config = ConfigDict(extra="forbid")

class UpdateTeacherProfile(BaseModel): 
    avatar_url: str | None = None
    headline: str | None = None
    expertise_tags: str | None = None
    years_of_experience: int | None = Field(default=None, ge=0)
    education_entries: str | None = None
    experience_entries: str | None = None
    github_url: str | None = None
    linkedin_url: str | None = None
    website_url: str | None = None
    email: str | None = None
    phone: str | None = None

    model_config = ConfigDict(extra="forbid")
