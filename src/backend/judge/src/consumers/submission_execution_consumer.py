# Tien hanh chay code, sau do gui ket qua ve ben kia bang cach dung rabbitmq, thong qua RESULT_queue 

import asyncio

from src.minio.minio_handler import MinioHandler
from src.judge.output_comparator import output_matches
from src.bases.constants.submission_queues import SUBMISSION_EXECUTION_RESULT_QUEUE
from src.messaging.rabbitmq_manager import RabbitMQManager
from src.sandbox import sandbox_runner
from src.contracts.submission_execution import SubmissionExecutionRequest, SubmissionExecutionResult, TestcaseExecutionResult
from src.sandbox.workspace import create_workspace, write_source_code
from src.language_adapters.cpp_language_adapter import CppLanguageAdapter
from src.language_adapters.python_language_adapter import PythonLanguageAdapter
from src.sandbox.sandbox_runner import SandboxRunner
from enum import Enum 

class ExecutionStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    ACCEPTED = "ACCEPTED"
    WRONG_ANSWER = "WRONG_ANSWER"
    TIME_LIMIT_EXCEEDED = "TIME_LIMIT_EXCEEDED"
    MEMORY_LIMIT_EXCEEDED = "MEMORY_LIMIT_EXCEEDED"
    RUNTIME_ERROR = "RUNTIME_ERROR"
    COMPILE_ERROR = "COMPILE_ERROR"
    OUTPUT_LIMIT_EXCEEDED = "OUTPUT_LIMIT_EXCEEDED"

    
def get_language_adapter(language : str): 
    match language: 
        case 'python': return PythonLanguageAdapter() 
        case 'cpp': return CppLanguageAdapter() 
    return None 

def get_execution_status(execution_result , expected_output: str) -> str: 
    if execution_result.timed_out: 
        return ExecutionStatus.TIME_LIMIT_EXCEEDED 
    if execution_result.output_limited: 
        return  ExecutionStatus.OUTPUT_LIMIT_EXCEEDED 
    if execution_result.memory_limited: 
        return ExecutionStatus.MEMORY_LIMIT_EXCEEDED 
    if execution_result.exit_code != 0: 
        return ExecutionStatus.RUNTIME_ERROR 
    
    if not output_matches(execution_result.stdout , expected_output): 
        return ExecutionStatus.WRONG_ANSWER 

    return ExecutionStatus.ACCEPTED

# Ham dung de gui ket qua thong qua message queue 
async def publish_result(
    rabbitmq_manager: RabbitMQManager,
    result: SubmissionExecutionResult,
) -> None:
    await rabbitmq_manager.publish(
        SUBMISSION_EXECUTION_RESULT_QUEUE,
        result.model_dump_json().encode("utf-8"),
    )


async def process_submission_execution_request(submission_execution_request : SubmissionExecutionRequest , rabbitmq_manager : RabbitMQManager , minio_handler : MinioHandler): 

    language_adapter = get_language_adapter(submission_execution_request.language) 
    if language_adapter is None: 
        print("Language is not modified")
        return None 
    sandbox_runner = SandboxRunner() 
    container_name = sandbox_runner.init_container() 
  

    submission_id = submission_execution_request.submission_id
    workspace = create_workspace(int(submission_id)) 

    testcase_results : list[TestcaseExecutionResult] = [] 
    score = 0.0 
    total_runtime_ms = 0.0 
    final_status = ExecutionStatus.ACCEPTED 
    last_exit_code : int | None = None 
    last_stdout = '' 
    last_stderr = '' 
    timed_out = False 

    code = submission_execution_request.code 
    try: 
        write_source_code(
                workspace, 
                language_adapter.source_filename, 
                code 
        )
        # Thuc hien compile truoc 
        # Cu phap nay tuong duong vua gan gia tri, vua tra ve gia tri do 
        # build_command = language_adapter.build_command(); if build_command(): .... 
        if build_command := language_adapter.build_command(): 
            build_result = await sandbox_runner.run(
                image = language_adapter.image, 
                workspace = workspace, 
                container_name = sandbox_runner.init_container(), 
                command = build_command, 
                timeout_ms = submission_execution_request.time_limit_ms, 
                memory_limit=submission_execution_request.memory_limit_mb, 
                output_limit_bytes=1024*1024*1
            )
            # Xu ly loi build result 
            if build_result.memory_limited:
                final_status = ExecutionStatus.MEMORY_LIMIT_EXCEEDED
            elif build_result.output_limited:
                final_status = ExecutionStatus.OUTPUT_LIMIT_EXCEEDED
            elif build_result.timed_out or build_result.exit_code != 0:
                final_status = ExecutionStatus.COMPILE_ERROR
            if final_status != ExecutionStatus.ACCEPTED: 
                await publish_result(
                    rabbitmq_manager,
                    SubmissionExecutionResult(
                        submission_id=submission_execution_request.submission_id,
                        status=final_status,
                        score=0,
                        exit_code=build_result.exit_code,
                        stdout="",
                        stderr=build_result.stderr,
                        runtime_ms=build_result.runtime_ms,
                        memory_kb=0,
                        timed_out=build_result.timed_out,
                        testcases=[],
                    ),
                )
                return
        # Lap qua danh sach cac testcase va tien hanh so sanh ket qua cua tung cai 
        for testcase in submission_execution_request.testcases: 
            
            input_bytes = await asyncio.to_thread(
                minio_handler.get_object_bytes, 
                testcase.input_file # arg1 cho ham get_object_bytes 
            )
            expected_output_bytes = await asyncio.to_thread(
                minio_handler.get_object_bytes, 
                testcase.output_file
            )
            print("Input objects: " , testcase.input_file) 
            print("Input len: " , len(input_bytes))
            print("content: ", repr(input_bytes))

            print("expected output: " , repr(expected_output_bytes))
            execution_result = await sandbox_runner.run(
                image=language_adapter.image,
                workspace=workspace,
                container_name=sandbox_runner.init_container(),
                command=language_adapter.run_command(),
                timeout_ms=submission_execution_request.time_limit_ms,
                memory_limit=submission_execution_request.memory_limit_mb,
                stdin_data=input_bytes.decode("utf-8"),
                output_limit_bytes=1*1024*1024,
            )
            # Cong don cac gia tri 
            total_runtime_ms += execution_result.runtime_ms
            last_exit_code = execution_result.exit_code 
            last_stdout = execution_result.stdout 
            last_stderr = execution_result.stderr
            timed_out = execution_result.timed_out
            testcase_status = get_execution_status(
                execution_result, 
                expected_output=expected_output_bytes.decode('utf-8')
            )
            testcase_results.append(
                TestcaseExecutionResult(
                    testcase_id=testcase.testcase_id,
                    status=testcase_status,
                    runtime_ms=execution_result.runtime_ms,
                    memory_kb=0,
                )
            )
            # Kiem tra xem no co ACCEPTED hay khong 
            if testcase_status != ExecutionStatus.ACCEPTED: 
                final_status = testcase_status 
                break 
            score += testcase.score
        await publish_result(
            rabbitmq_manager,
            SubmissionExecutionResult(
                submission_id=submission_execution_request.submission_id,
                status=final_status,
                score=score,
                exit_code=last_exit_code,
                stdout=last_stdout,
                stderr=last_stderr,
                runtime_ms=total_runtime_ms,
                memory_kb=0,
                timed_out=timed_out,
                testcases=testcase_results,
            ),
        )
    except Exception as e: 
        print(f"Running code error with {e}")
    finally: 
        await sandbox_runner.stop_container(container_name) 
    
