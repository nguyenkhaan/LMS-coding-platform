from src.language_adapters.language_adapter import LanguageAdapter

# workspace: /tmp/judge-workspaces/submission-uuid/source_file_name.py
class PythonLanguageAdapter(LanguageAdapter): 
    image = "judge-python:latest" 
    source_filename = "main.py"
    def build_command(self) -> list[str]:
        return [] 
    def run_command(self) -> list[str]: 
        return [
            "python", "/workspace/main.py"
        ]
