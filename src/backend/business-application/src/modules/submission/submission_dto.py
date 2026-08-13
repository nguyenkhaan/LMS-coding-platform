
from dataclasses import dataclass

from pydantic import BaseModel
from enum import Enum 
class Language(str, Enum):  
    CPP = "cpp" 
    PYTHON = "python"
    JS = "javascript"
class CreateSubmissionRequest(BaseModel): 
    language: Language 
    code : str

@dataclass
class SubmissionJob: 
    submission_id : int 
    language : str 
    time_limit_ms: int 
    memory_limit_mb: str 
    code : str 
    