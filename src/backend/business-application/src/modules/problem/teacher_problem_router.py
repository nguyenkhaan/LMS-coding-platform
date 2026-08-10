from fastapi import APIRouter, Depends, status, Request, UploadFile, File
from src.modules.problem.problem_dto import ProblemCreateRequest, ProblemDetailResponse
from src.modules.problem.problem_dependency import get_problem_service
from src.modules.problem.problem_service import ProblemService
from src.middlewares.role_middleware import require_role
from src.models.base_model import Role
from fastapi import HTTPException

def get_current_teacher_id(user: dict = Depends(require_role(Role.TEACHER))) -> int:
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return int(user_id)
router = APIRouter(
    prefix="/teacher/problems", 
    tags=["Teacher OJ Problems"]
)

@router.post("", response_model=ProblemDetailResponse, status_code=status.HTTP_201_CREATED)
async def create_problem(
    data: ProblemCreateRequest,
    teacher_id: int = Depends(get_current_teacher_id),
    problem_service: ProblemService = Depends(get_problem_service)
):
    return await problem_service.create_problem(teacher_id, data)

@router.post("/{problemId}/testcases/upload", status_code=status.HTTP_201_CREATED)
async def upload_testcases(
    problemId: int,
    file: UploadFile = File(...), # Get the client uploaded file
    teacher_id: int = Depends(get_current_teacher_id),
    problem_service: ProblemService = Depends(get_problem_service)
):
    return await problem_service.upload_testcases(teacher_id, problemId, file)
