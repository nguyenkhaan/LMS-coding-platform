# Tien hanh chay code, sau do gui ket qua ve ben kia bang cach dung rabbitmq, thong qua RESULT_queue 

from src.bases.constants.submission_queues import SUBMISSION_EXECUTION_RESULT_QUEUE
from src.messaging.rabbitmq_manager import RabbitMQManager
from src.sandbox import sandbox_runner
from src.contracts.submission_execution import SubmissionExecutionRequest, SubmissionExecutionResult
from src.sandbox.workspace import create_workspace, write_source_code
from src.language_adapters.cpp_language_adapter import CppLanguageAdapter
from src.language_adapters.python_language_adapter import PythonLanguageAdapter
from src.sandbox.sandbox_runner import SandboxRunner

    
def get_language_adapter(language : str): 
    match language: 
        case 'python': return PythonLanguageAdapter() 
        case 'cpp': return CppLanguageAdapter() 
    return None 

async def process_submission_execution_request(submission_execution_request : SubmissionExecutionRequest , rabbitmq_manager : RabbitMQManager): 
    language_adapter = get_language_adapter(submission_execution_request.language) 
    if language_adapter is None: 
        print("Language is not modified")
        return None 
    sandbox_runner = SandboxRunner() 
    container_name = sandbox_runner.init_container() 
    try: 

        submission_id = submission_execution_request.submission_id
        workspace = create_workspace(int(submission_id)) 
        code = submission_execution_request.code 
        # Sau nay se tien hanh tach ra them 1 lop nua, phu thuoc vao tung ngon ngu ma se co cac cach chay code khac nhau 
        source_file_path = write_source_code(workspace , language_adapter.source_filename , code) # Nhan ve path 
        memory_limit_mb = submission_execution_request.memory_limit_mb
        time_limit_ms = submission_execution_request.time_limit_ms
        execution_result = await sandbox_runner.run(
            language_adapter.image, 
            workspace, 
            container_name, 
            language_adapter.run_command(), 
            timeout_seconds=time_limit_ms, 
            memory_limit=memory_limit_mb, 
            stdin_data="" 
        )
        print(execution_result) 
        submission_execution_result = SubmissionExecutionResult(
            submission_id = submission_id, 
            status = "accepted", 
            score = 100, 
            exit_code= execution_result.exit_code, 
            stdout= execution_result.stdout, 
            stderr= execution_result.stderr, 
            runtime_ms= execution_result.runtime_ms, 
            timed_out= execution_result.timed_out, 
        )
        await rabbitmq_manager.publish(
            SUBMISSION_EXECUTION_RESULT_QUEUE, 
            submission_execution_result.model_dump_json().encode('utf-8')
        )
        # Gui du lieu ve cho business-application thong qua rabbitmq 


    except Exception as e: 
        print(f"Running code error with {e}")
    finally: 
        await sandbox_runner.stop_container(container_name) 
    
