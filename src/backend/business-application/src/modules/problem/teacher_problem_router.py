from fastapi import APIRouter, Depends, status, Request, UploadFile, File
from src.modules.problem.problem_dto import ProblemCreateRequest, ProblemDetailResponse
from src.modules.problem.problem_dependency import get_problem_service
from src.modules.problem.problem_service import ProblemService

router = APIRouter(
    prefix="/teacher/problems", 
    tags=["Teacher OJ Problems"]
)

@router.post("", response_model=ProblemDetailResponse, status_code=status.HTTP_201_CREATED)
async def create_problem(
    data: ProblemCreateRequest,
    request: Request,
    problem_service: ProblemService = Depends(get_problem_service)
):
    teacher_id = 2 # Mock data
    return await problem_service.create_problem(teacher_id, data)

@router.post("/{problemId}/testcases/upload", status_code=status.HTTP_201_CREATED)
async def upload_testcases(
    problemId: int,
    request: Request,
    file: UploadFile = File(...), # Get the client uploaded file
    problem_service: ProblemService = Depends(get_problem_service)
):
    teacher_id = 2 # Mock data
    return await problem_service.upload_testcases(teacher_id, problemId, file)
