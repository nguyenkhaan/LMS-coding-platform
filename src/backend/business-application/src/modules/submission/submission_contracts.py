from pydantic import BaseModel, Field
from enum import Enum 

class CreateSubmissionRequest(BaseModel): 
    problem_id: int = Field(gt=0)
    language: str 
    code: str = Field(min_length=1)
class TestcaseExecutionRequest(BaseModel): 
    testcase_id : int 
    input_file : str 
    output_file: str 
    score : float 
class SubmissionExecutionRequest(BaseModel): 
    submission_id : int 
    language : str 
    time_limit_ms: int 
    memory_limit_mb: str 
    code : str 
    testcases : list[TestcaseExecutionRequest]

# Chinh sua lai API contract nay de tien hanh cap nhat ket qwa vao ben trong database 
class TestcaseExecutionResult(BaseModel): 
    testcase_id : int 
    status : str 
    runtime_ms: float = 0 
    memory_kb :float = 0
# Ket qua cham bai chi tiet, bao gom ket qua cua nhieu testcase 

class SubmissionExecutionResult(BaseModel):
    submission_id: int
    score: float
    status: str
    exit_code: int | None = None
    stdout: str = ""
    stderr: str = ""
    runtime_ms: float = 0
    memory_kb: float = 0
    timed_out: bool = False
    testcases: list[TestcaseExecutionResult] = Field(default_factory=list)