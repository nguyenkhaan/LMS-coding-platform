# Cai nay kiu con GPT no lam chi, no gioi may cai nay lam .... Codex cung duoc (Hang an cap cua Codex)
import asyncio
import contextlib
import time
import uuid
from dataclasses import dataclass
from pathlib import Path


OUTPUT_CHUNK_SIZE = 64 * 1024
STDERR_CAPTURE_BYTES = 1 * 1024 * 1024


@dataclass
class SandboxResult:
    exit_code: int | None
    stdout: str
    stderr: str
    runtime_ms: float
    timed_out: bool
    output_limited: bool
    memory_limited: bool


class SandboxRunner:
    def init_container(self) -> str:
        return f"judge-{uuid.uuid4().hex}"

    async def _read_stream(
        self,
        stream: asyncio.StreamReader,
        capture_limit_bytes: int,
        overflow_event: asyncio.Event | None = None,
    ) -> bytes:
        captured = bytearray()

        while chunk := await stream.read(OUTPUT_CHUNK_SIZE):
            remaining = capture_limit_bytes - len(captured)

            if remaining > 0:
                captured.extend(chunk[:remaining])

            if len(chunk) > remaining and overflow_event is not None:
                overflow_event.set()
                break

            # stderr vượt capture limit vẫn phải tiếp tục đọc và bỏ phần dư,
            # tránh process bị block vì stderr pipe đầy.
            # stdout vượt limit thì event được set và container sẽ bị kill.

        return bytes(captured)

    async def _write_stdin(
        self,
        stream: asyncio.StreamWriter,
        stdin_data: str,
    ) -> None:
        try:
            stream.write(stdin_data.encode("utf-8"))
            await stream.drain()
        except (BrokenPipeError, ConnectionResetError):
            pass
        finally:
            stream.close()
            with contextlib.suppress(Exception):
                await stream.wait_closed()

    async def is_oom_killed(self, container_name: str) -> bool:
        process = await asyncio.create_subprocess_exec(
            "docker",
            "inspect",
            "--format",
            "{{.State.OOMKilled}}",
            container_name,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        stdout, _ = await process.communicate()

        return process.returncode == 0 and stdout.strip() == b"true"

    async def stop_container(self, container_name: str) -> None:
        process = await asyncio.create_subprocess_exec(
            "docker",
            "rm",
            "-f",
            container_name,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        await process.communicate()

    async def run(
        self,
        image: str,
        workspace: Path,
        container_name: str,
        command: list[str],
        timeout_ms: int,
        memory_limit: str = "128m",
        stdin_data: str = "",
        output_limit_bytes: int = 1 * 1024 * 1024,
    ) -> SandboxResult:
        workspace = workspace.resolve()
        timeout_seconds = max(timeout_ms / 1000, 0.001)

        # Không dùng --rm: cần docker inspect OOMKilled trước khi cleanup.
        docker_command = [
            "docker",
            "run",
            "--interactive",
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

        process: asyncio.subprocess.Process | None = None
        stdin_task: asyncio.Task[None] | None = None
        stdout_task: asyncio.Task[bytes] | None = None
        stderr_task: asyncio.Task[bytes] | None = None
        output_limit_task: asyncio.Task[bool] | None = None

        timed_out = False
        output_limited = False
        memory_limited = False
        start_time = time.perf_counter()

        try:
            process = await asyncio.create_subprocess_exec(
                *docker_command,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )

            assert process.stdin is not None
            assert process.stdout is not None
            assert process.stderr is not None

            output_limit_event = asyncio.Event()

            stdin_task = asyncio.create_task(
                self._write_stdin(process.stdin, stdin_data)
            )
            stdout_task = asyncio.create_task(
                self._read_stream(
                    process.stdout,
                    output_limit_bytes,
                    overflow_event=output_limit_event,
                )
            )
            stderr_task = asyncio.create_task(
                self._read_stream(
                    process.stderr,
                    STDERR_CAPTURE_BYTES,
                )
            )
            process_task = asyncio.create_task(process.wait())
            output_limit_task = asyncio.create_task(
                output_limit_event.wait()
            )

            done, _ = await asyncio.wait(
                {process_task, output_limit_task},
                timeout=timeout_seconds,
                return_when=asyncio.FIRST_COMPLETED,
            )

            output_limited = (
                output_limit_task in done and output_limit_event.is_set()
            )
            timed_out = not done

            if output_limited or timed_out:
                await self.stop_container(container_name)

            await process_task

            if not timed_out and not output_limited:
                memory_limited = await self.is_oom_killed(container_name)

            stdout_bytes = await stdout_task
            stderr_bytes = await stderr_task

            if not stdin_task.done():
                stdin_task.cancel()

            with contextlib.suppress(
                asyncio.CancelledError,
                BrokenPipeError,
                ConnectionResetError,
            ):
                await stdin_task

            runtime_ms = (time.perf_counter() - start_time) * 1000
            # Tra ve sandbox result, ben trong co cac bien de co the quyet dinh duoc day la loi gi 
            return SandboxResult(
                exit_code=process.returncode, # !=0 thi bi runtime error 
                stdout=stdout_bytes.decode("utf-8", errors="replace"),
                stderr=stderr_bytes.decode("utf-8", errors="replace"),
                runtime_ms=runtime_ms, # 
                timed_out=timed_out, # True thi bi TLE 
                output_limited=output_limited, # True thi bi bat loi OLE 
                memory_limited=memory_limited, # True thi bi lat MLE 
            )
        finally:
            if output_limit_task is not None and not output_limit_task.done():
                output_limit_task.cancel()

            if process is not None:
                await self.stop_container(container_name)
