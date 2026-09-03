from unittest.mock import AsyncMock, Mock

import pytest

from src.models.base_model import ProblemSubmissionStatus
from src.models.language_model import LanguageModel
from src.models.problem_model import ProblemModel
from src.models.submission_model import SubmissionModel
from src.modules.submission.submission_contracts import CreateSubmissionRequest
from src.modules.submission.submission_route import create_submission


@pytest.mark.asyncio
async def test_create_submission_persists_pending_submission() -> None:
    problem = ProblemModel(id=7, teacher_id=2, title="Two Sum", slug="two-sum", statement="...")
    language = LanguageModel(id=3, name="Python", is_active=True)
    db = Mock()
    db.get = AsyncMock(return_value=problem)
    db.scalar = AsyncMock(side_effect=[language, 1])
    db.commit = AsyncMock()

    async def refresh(submission: SubmissionModel) -> None:
        submission.id = 42

    db.refresh = AsyncMock(side_effect=refresh)

    response = await create_submission(
        data=CreateSubmissionRequest(problem_id=7, language="python", code="print(1)"),
        current_user={"sub": 9},
        db=db,
    )

    submission = db.add.call_args.args[0]
    assert isinstance(submission, SubmissionModel)
    assert submission.problem_id == 7
    assert submission.student_id == 9
    assert submission.language_id == 3
    assert submission.source_code == "print(1)"
    assert submission.status is ProblemSubmissionStatus.PENDING
    assert response == {"submission_id": 42, "status": ProblemSubmissionStatus.PENDING}
    db.commit.assert_awaited_once()
