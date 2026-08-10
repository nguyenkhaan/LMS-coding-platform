from src.modules.problem.problem_dto import UploadTestcaseResponse
from fastapi import UploadFile
from src.modules.problem.problem_dto import ProblemCreateRequest
from src.modules.problem.problem_dto import SubmissionStatusResponse
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from src.modules.problem.problem_dto import TestCase, ProblemRunRequest, ProblemSubmitRequest, ProblemRunResponse, ProblemSubmitResponse, ProblemResponse, ProblemDetailResponse

class ProblemService:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def get_problems(self) -> List[ProblemResponse]:
        # TODO: Fetch from database here.
        return [
            ProblemResponse(id=1, slug="helloworld", title="Hello World", difficulty=800),
            ProblemResponse(id=2, slug="twosum", title="A + B", difficulty=800),
            ProblemResponse(id=3, slug="cf837g", title="Functions On The Segments", difficulty=2600)
        ]

    async def get_problems_by_slug(self, slug: str) -> ProblemDetailResponse:
        return ProblemDetailResponse(
            id=3,
            slug="cf837g",
            title="Functions On The Segments",
            difficulty=2600,
            teacher_id=1,
            statement="https://codeforces.com/problemset/problem/837/G",
            input_description="",
            output_description="",
            constraints="",
            sample_tests=[TestCase(input="1\n1 2 1 4 5 10\n1\n1 1 2", output="13")],
            scoring="",
            explanation="",
            public=True
        )

    async def run_code(self, user_id: int, problem_slug: str, data: ProblemRunRequest) -> ProblemRunResponse:
        try:
            # TODO: Run code in Sandbox here
            return ProblemRunResponse(
                stdout="Hello World",
                runtime_ms=15,
                memory_kb=1024,
                compile_error="",
                status="ACCEPTED"
            )
        except Exception as e:
            await self.db_session.rollback()
            return ProblemRunResponse(
                stdout="",
                runtime_ms=0,
                memory_kb=0,
                compile_error=str(e),
                status="INTERNAL_ERROR"
            )

    async def submit_code(self, user_id: int, problem_slug: str, data: ProblemSubmitRequest) -> ProblemSubmitResponse:
        try:
            # TODO: Append a task to RabbitMQ to handle this submission
            return ProblemSubmitResponse(
                submission_id=1,
                status="PENDING"
            )
        except Exception as e:
            await self.db_session.rollback()
            raise e

    async def get_submission_status(self, submission_id: str, user_id: int) -> SubmissionStatusResponse:
        # TODO: Check submission status in RabbitMQ
        # Verify submission belongs to this user, or this is a teacher/ admin
        # if not exists: raise HTTPException(status_code=404, detail="Submission not found")
        # if not authorized: raise HTTPException(status_code=403, detail="You do not have permission to access this submission")
        if False:
            raise HTTPException(status_code=403, detail="You do not have permission to access this submission")
        return SubmissionStatusResponse(
            status="ACCEPTED",
            score=100,
            runtime_ms=500,
            memory_kb=524288,
            details="Accepted, you are a genius!"
        )

    async def create_problem(self, user_id: int, data: ProblemCreateRequest) -> ProblemDetailResponse:
        # TODO: Verify if this user is a teacher/ admin
        # if not, raise HTTPException(status_code=403, detail="You do not have permission to create problem")
        # TODO: Save the data to database
        # TODO: Return the created problem
        if False:
            raise HTTPException(status_code=403, detail="You do not have permission to create problem")
        return ProblemDetailResponse(
            id=user_id,
            slug="cf837g",
            title="Functions On The Segments",
            difficulty=2600,
            teacher_id=1,
            statement="https://codeforces.com/problemset/problem/837/G",
            input_description="",
            output_description="",
            constraints="",
            sample_tests=[TestCase(input="1\n1 2 1 4 5 10\n1\n1 1 2", output="13")],
            scoring="",
            explanation="",
            public=True
        )

    async def upload_testcases(self, user_id: int, problem_id: int, file: UploadFile) -> UploadTestcaseResponse:
        # TODO: Verify if this user is a teacher/ admin
        # if not, raise HTTPException(status_code=403, detail="You do not have permission to upload testcases")
        # TODO: Check if this is a .zip file
        if not file.filename.endswith(".zip") and False:
            raise HTTPException(status_code=400, detail="File must be a .zip file")
        # TODO: Save the data to database
        # Extract the zip file to get the
        # TODO: Return the uploaded testcases count
        if False:
            raise HTTPException(status_code=403, detail="You do not have permission to upload testcases")
        return UploadTestcaseResponse(
            uploaded_count=10,
            message="Uploaded successful"
        )