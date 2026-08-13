import shutil
import tempfile
from src.bases.constants.sandbox_constant import BASE_WORKSPACE
from pathlib import Path 
# workspace: /tmp/judge-workspaces/submission-uuid/source_file_name.py

def create_workspace(submission_id: int) -> Path:
    BASE_WORKSPACE.mkdir(
        parents=True,
        exist_ok=True,
    )
    workspace = Path(
        tempfile.mkdtemp(
            prefix=f"submission-{submission_id}-",
            dir=BASE_WORKSPACE,
        )
    )
    return workspace # Tra ve workspace de truyen vao ben trong runner 

def write_source_code(
    workspace: Path,
    source_filename: str,
    code: str,
) -> Path:
    workspace = workspace.resolve()
    source_path = (workspace / source_filename).resolve()
    if workspace not in source_path.parents:
        raise ValueError("Invalid source filename")

    source_path.write_text(
        code,
        encoding="utf-8",
    )

    return source_path


def delete_workspace(workspace: Path):
    workspace = workspace.resolve()

    # Chỉ cho phép xóa workspace nằm trong thư mục workspace chung
    if BASE_WORKSPACE.resolve() not in workspace.parents:
        raise ValueError("Invalid workspace path")

    shutil.rmtree(workspace)