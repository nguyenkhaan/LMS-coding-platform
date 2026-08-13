
from pydantic import BaseModel
from enum import Enum 
class Language(str, Enum):  
    CPP = "cpp" 
    PYTHON = "python"
    JS = "javascript"
class CreateSubmissionRequest(BaseModel): 
    language: Language 
    code : str