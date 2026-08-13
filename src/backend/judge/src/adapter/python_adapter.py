from src.adapter.adapter import LanguageAdapter

# workspace: /tmp/judge-workspaces/submission-uuid/source_file_name.py
class PythonAdapter(LanguageAdapter): 
    image = "judge-python:latest" 
    source_file_name = "main.py"
    def build_command(self) -> list[str]:
        return [] 
    def run_command(self) -> list[str]: 
        return [
            "python", "/workspace/main.py"
        ]