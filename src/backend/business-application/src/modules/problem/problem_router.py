from src.modules.problem.problem_dto import SubmissionStatusResponse
from src.modules.problem.problem_dto import ProblemDetailResponse
from fastapi import APIRouter, Depends, status, Request
from src.modules.problem.problem_dto import ProblemRunRequest, ProblemRunResponse, ProblemSubmitRequest, ProblemSubmitResponse
from src.modules.problem.problem_dependency import get_problem_service
from src.modules.problem.problem_service import ProblemService

router = APIRouter(
    prefix="/problems",
    tags=["Online Judge (OJ) Problems"],
)

@router.get("/")
async def get_problems(
    request: Request,
    problem_service: ProblemService = Depends(get_problem_service)
):
    return await problem_service.get_problems()

@router.get(
    "/{slug}",
    response_model=ProblemDetailResponse,
    status_code=status.HTTP_200_OK,
)
async def get_problem_by_slug(
    slug: str,
    request: Request,
    problem_service: ProblemService = Depends(get_problem_service)
):  
    return await problem_service.get_problems_by_slug(slug)

@router.post(
    "/{slug}/run",
    response_model=ProblemRunResponse,
    status_code=status.HTTP_200_OK,
)
async def run_code(
    slug: str,
    data: ProblemRunRequest,
    request: Request,
    problem_service: ProblemService = Depends(get_problem_service)
):
    user_id = 1 # Mock data, it should be request.state.user.id

    return await problem_service.run_code(user_id=user_id, problem_slug=slug, data=data)

@router.post(
    "/{slug}/submit",
    response_model=ProblemSubmitResponse,
    status_code=status.HTTP_201_CREATED,
)
async def submit_code(
    slug: str,
    data: ProblemSubmitRequest,
    request: Request,
    problem_service: ProblemService = Depends(get_problem_service)
):
    user_id = 1 # Mock data, it should be request.state.user.id
    return await problem_service.submit_code(user_id=user_id, problem_slug=slug, data=data)

@router.get(
    "/submissions/{submissionId}/status",
    response_model=SubmissionStatusResponse,
    status_code=status.HTTP_200_OK,
)
async def get_submission_status(
    submissionId: str,
    request: Request,
    problem_service: ProblemService = Depends(get_problem_service)
):
    # Get user_id from request.state.user.id
    user_id = 1
    return await problem_service.get_submission_status(submissionId, user_id)