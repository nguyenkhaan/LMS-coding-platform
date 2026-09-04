import time

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from src.cores.settings import S3_BUCKET_NAME
from src.middlewares.role_middleware import require_role
from src.models.base_model import Role
from src.modules.teacher.teacher_problem.teacher_problem_dependency import (
    get_teacher_problem_service,
)
from src.modules.teacher.teacher_problem.teacher_problem_dto import (
    ProblemTagView,
    ProblemView,
    ProblemWrite,
    TestcaseUploadResponse,
)
from src.modules.teacher.teacher_problem.teacher_problem_service import TeacherProblemService

router = APIRouter(tags=["Teacher Problem"])

def get_current_teacher_id(user: dict = Depends(require_role(Role.TEACHER))) -> int:
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in token")
    return int(user_id)

@router.get("/problem-tags", response_model=list[ProblemTagView])
async def get_problem_tags(
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherProblemService = Depends(get_teacher_problem_service)
):
    return await service.get_all_problem_tags()

@router.post("/problems", response_model=ProblemView, status_code=status.HTTP_201_CREATED)
async def create_problem(
    data: ProblemWrite,
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherProblemService = Depends(get_teacher_problem_service)
):
    return await service.create_problem(teacher_id, data)

@router.put("/problems/{problem_id}", response_model=ProblemView)
async def update_problem(
    problem_id: int,
    data: ProblemWrite,
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherProblemService = Depends(get_teacher_problem_service)
):
    return await service.update_problem(teacher_id, problem_id, data)

from src.cores.settings import MAX_TESTCASE_FILE_SIZE_MB

MAX_FILE_SIZE = MAX_TESTCASE_FILE_SIZE_MB * 1024 * 1024
ALLOWED_EXTENSIONS = [".txt", ".in", ".out"]
ALLOWED_MIME_TYPES = ["text/plain"]

def validate_file(file: UploadFile):
    if not file:
        raise HTTPException(status_code=400, detail="File is missing")
    
    filename = file.filename or ""
    ext = ""
    if "." in filename:
        ext = "." + filename.rsplit(".", 1)[1].lower()
        
    if ext not in ALLOWED_EXTENSIONS and file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail=f"Invalid file type for {filename}")
        
    if file.size and file.size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail=f"File {filename} exceeds {MAX_TESTCASE_FILE_SIZE_MB}MB limit")
        
@router.post("/problems/{problem_id}/testcases/upload", response_model=TestcaseUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_testcase(
    problem_id: int,
    input_file: UploadFile | None = File(None),
    output_file: UploadFile | None = File(None),
    score: float = Form(0.0),
    is_hidden: bool = Form(False),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherProblemService = Depends(get_teacher_problem_service)
):
    if not input_file or not output_file:
        raise HTTPException(status_code=400, detail="Both input_file and output_file are required")
        
    validate_file(input_file)
    validate_file(output_file)
    
    # TODO: replace with real S3 upload once integration is ready
    ts = int(time.time())
    mock_input_key = f"s3://{S3_BUCKET_NAME}/problems/{problem_id}/tc_{ts}_in.txt"
    mock_output_key = f"s3://{S3_BUCKET_NAME}/problems/{problem_id}/tc_{ts}_out.txt"
    
    return await service.upload_testcase(
        teacher_id=teacher_id,
        problem_id=problem_id,
        input_file=mock_input_key,
        output_file=mock_output_key,
        score=score,
        is_hidden=is_hidden
    )
