from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SubmissionView(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    id: int
    problem_id: int
    student_id: int
    language_id: int
    source_code: str
    status: str
    score: float
    runtime_ms: int
    memory_kb: int
    submitted_at: datetime


class SubmissionListResponse(BaseModel):
    total_items: int
    total_pages: int
    current_page: int
    items: list[SubmissionView]
