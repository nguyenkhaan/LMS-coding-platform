from pydantic import BaseModel
from enum import Enum 
class Language(str, Enum):  
    CPP = "cpp" 
    PYTHON = "python"
    JS = "javascript"
class CreateSubmissionRequest(BaseModel): 
    language: Language 
    code : str

class SubmissionJob(BaseModel): 
    submission_id : int 
    language : str 
    time_limit_ms: int 
    memory_limit_mb: str 
    code : str 

class SubmissionResult(BaseModel): 
    id : int 
    score: int 
    status: str 
    # Du lieu bo sung them 
    exit_code: int | None = None 
    stdout: str 
    runtime_ms: float 
    timed_out: float 
    stderr: str 