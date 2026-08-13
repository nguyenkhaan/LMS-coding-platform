from dataclasses import dataclass

@dataclass
class SubmissionJob: 
    submission_id : int 
    language : str 
    time_limit_ms: int 
    memory_limit_mb: str 
    code : str 
