# Nho con GPT no code cho, may cai nay nghien cuu nhieu vcl 
from dataclasses import dataclass 
from pathlib import Path 
import uuid
import asyncio
import time 

@dataclass 
class SandboxResult: 
    exit_code: int | None 
    stdout: str 
    stderr: str 
    runtime_ms: float 
    timed_out: bool 

class SandboxRunner: 
    def init_container(self): 
        return f"judge-{uuid.uuid4().hex}" 
    async def run(self, 
            image : str, 
            workspace : Path, 
            container_name : str, 
            command : list[str], 
            timeout_seconds: float,
            memory_limit : str = "128m", 
            stdin_data : str = ""
        ): 
        workspace = workspace.resolve() 
        docker_command = [
             "docker",
            "run",
            "--rm",
            "--name",
            container_name,
            "--network",
            "none",
            "--memory",
            memory_limit,
            "--cpus",
            "0.5",
            "--pids-limit",
            "64",
            "--cap-drop",
            "ALL",
            "--security-opt",
            "no-new-privileges",
            "--user",
            "1000:1000",
            "--read-only",
            "--tmpfs",
            "/tmp:rw,noexec,nosuid,size=64m",
            "--mount",
            f"type=bind,source={workspace},target=/workspace",
            image,
            *command,
        ]
        start_time = time.perf_counter()
        process = await asyncio.create_subprocess_exec(
            *docker_command,
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        try:
            stdout, stderr = await asyncio.wait_for(
                process.communicate(
                    stdin_data.encode("utf-8")
                ),
                timeout=timeout_seconds,
            )

            runtime_ms = (time.perf_counter() - start_time) * 1000

            return SandboxResult(
                exit_code=process.returncode,
                stdout=stdout.decode(
                    "utf-8",
                    errors="replace",
                ),
                stderr=stderr.decode(
                    "utf-8",
                    errors="replace",
                ),
                runtime_ms=runtime_ms,
                timed_out=False,
            )

        except asyncio.TimeoutError:
            await self.stop_container(container_name)

            runtime_ms = (time.perf_counter() - start_time) * 1000

            return SandboxResult(
                exit_code=None,
                stdout="",
                stderr="Execution timed out",
                runtime_ms=runtime_ms,
                timed_out=True,
            )

    async def stop_container(self, container_name: str):
        process = await asyncio.create_subprocess_exec(
            "docker",
            "rm",
            "-f",
            container_name,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )

        await process.communicate()