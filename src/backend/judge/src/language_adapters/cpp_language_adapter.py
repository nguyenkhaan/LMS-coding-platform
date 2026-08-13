from src.language_adapters.language_adapter import LanguageAdapter

class CppLanguageAdapter(LanguageAdapter): 
    image = "judge-cpp:latest"
    source_filename = "main.cpp"
    def build_command(self): 
        return [
            "g++",
            "-std=c++17",
            "-O2",
            "-pipe",
            "/workspace/main.cpp",
            "-o",
            "/workspace/program",
        ]
    def run_command(self) -> list[str]:
        return [
            "/workspace/program"
        ]
