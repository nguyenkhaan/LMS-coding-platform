from dataclasses import dataclass 

@dataclass 
class ExecutionResult: 
    score: int 
    status: str 
    id: int 

class LanguageAdapter: 
    image: str 
    source_file_name: str 
    def build_command(self) -> list[str]: 
        raise NotImplementedError 
    def run_command(self) -> list[str]: 
        raise NotImplementedError 
