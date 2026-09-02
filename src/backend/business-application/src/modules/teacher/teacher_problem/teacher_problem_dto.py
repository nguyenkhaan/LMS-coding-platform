from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from src.models.problem_model import ProblemDifficulty


class ProblemTagView(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    id: int
    tag_name: str

class ProblemConfigWrite(BaseModel):
    language_id: int
    time_limit_ms: float = Field(..., gt=0)
    memory_limit_mb: float = Field(..., gt=0)

class ProblemWrite(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=1, max_length=255)
    statement: str = Field(..., min_length=1)
    sample_input: str | None = None
    sample_output: str | None = None
    explanation: str | None = None
    difficulty: ProblemDifficulty
    passing_score: float = Field(0.0, ge=0.0)
    public: bool = True
    tag_ids: list[int] = Field(default_factory=list)
    configs: list[ProblemConfigWrite] = Field(default_factory=list)

class ProblemView(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    id: int
    teacher_id: int
    title: str
    slug: str
    statement: str
    sample_input: str | None
    sample_output: str | None
    explanation: str | None
    difficulty: ProblemDifficulty
    passing_score: float
    public: bool
    created_at: datetime

class TestcaseView(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    id: int
    problem_id: int
    input_file: str
    output_file: str
    score: float
    is_hidden: bool

class TestcaseUploadResponse(BaseModel):
    uploaded_count: int
    message: str
    testcases: list[TestcaseView]
