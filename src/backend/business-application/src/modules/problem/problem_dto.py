from pydantic import BaseModel
from typing import Optional, List

class TestCase(BaseModel):
    input: str
    output: str

class ProblemRunRequest(BaseModel): 
    source_code: str
    language_id: int
    stdin: Optional[str] = None

class ProblemSubmitRequest(BaseModel):
    source_code: str
    language_id: int

class ProblemCreateRequest(BaseModel):
    title: str
    statement: str
    input_description: str
    output_description: str
    constraints: str
    sample_tests: List[TestCase]
    explanation: str
    difficulty: int
    public: bool

class ProblemRunResponse(BaseModel):
    stdout: str
    runtime_ms: int
    memory_kb: int
    compile_error: str
    status: str

class ProblemSubmitResponse(BaseModel):
    submission_id: int
    status: str

class ProblemResponse(BaseModel):
    id: int
    slug: str
    title: str
    difficulty: int

class ProblemDetailResponse(ProblemResponse):
    teacher_id: int
    statement: str
    input_description: str
    output_description: str
    constraints: str
    sample_tests: List[TestCase]
    scoring: str # Add this to database later, for batch scoring in the future
    explanation: str
    public: bool

class SubmissionStatusResponse(BaseModel):
    status: str
    score: int
    runtime_ms: int
    memory_kb: int
    details: str

class UploadTestcaseResponse(BaseModel):
    uploaded_count: int
    message: str

