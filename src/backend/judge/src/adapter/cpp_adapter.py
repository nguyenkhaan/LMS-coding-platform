from src.adapter.adapter import LanguageAdapter

class CppAdapter(LanguageAdapter): 
    image = "judge-cpp:latest"
    source_file_name = "main.cpp"
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