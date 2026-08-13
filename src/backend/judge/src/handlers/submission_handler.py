# Tien hanh chay code, sau do gui ket qua ve ben kia bang cach dung rabbitmq, thong qua RESULT_queue 

from sandbox import sandbox_runner
from src.dto.submission_dto import SubmissionJob
from src.sandbox.workspace import create_workspace, write_source_code
from src.adapter.cpp_adapter import CppAdapter
from src.adapter.python_adapter import PythonAdapter
from src.sandbox.sandbox_runner import SandboxRunner

    
def get_adapter(language : str): 
    match language: 
        case 'python': return PythonAdapter() 
        case 'cpp': return CppAdapter() 
    return None 

async def submission_handler_result(data : SubmissionJob): 
    adapter = get_adapter(data.language) 
    if adapter is None: 
        print("Language is not modified")
        return None 
    sandbox_runner = SandboxRunner() 
    container_name = sandbox_runner.init_container() 
    try: 

        submission_id = data.submission_id
        workspace = create_workspace(int(submission_id)) 
        code = data.code 
        # Sau nay se tien hanh tach ra them 1 lop nua, phu thuoc vao tung ngon ngu ma se co cac cach chay code khac nhau 
        source_file_name = write_source_code(workspace , adapter.source_file_name , code) # Nhan ve path 
        memory_limit_mb = data.memory_limit_mb
        time_limit_ms = data.time_limit_ms
        running_result = await sandbox_runner.run(
            adapter.image, 
            workspace, 
            container_name, 
            adapter.run_command(), 
            timeout_seconds=time_limit_ms, 
            memory_limit=memory_limit_mb, 
            stdin_data="" 
        )
        print(running_result) 

    except Exception as e: 
        print(f"Running code error with {e}")
    finally: 
        await sandbox_runner.stop_container(container_name) 
    
