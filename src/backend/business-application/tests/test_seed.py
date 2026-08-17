from datetime import UTC, datetime

import pytest

import seed
import src.models  # noqa: F401
from src.db import Base


class RecordingSession:
    def __init__(self) -> None:
        self.records: list[object] = []
        self._next_id = 1

    def add(self, record: object) -> None:
        self.records.append(record)

    def add_all(self, records: object) -> None:
        self.records.extend(records)

    async def flush(self) -> None:
        for record in self.records:
            if hasattr(record, "id") and getattr(record, "id") is None:
                setattr(record, "id", self._next_id)
                self._next_id += 1


def test_seed_accounts_keep_the_debug_credentials() -> None:
    assert [(account.email, account.password) for account in seed.SEED_ACCOUNTS] == [
        ("student@gmail.com", "student123"),
        ("teacher@gmail.com", "teacher123"),
        ("cloudian@gmail.com", "admin123"),
    ]


@pytest.mark.asyncio
async def test_seed_helpers_cover_every_registered_table() -> None:
    session = RecordingSession()
    seed_time = datetime(2026, 8, 17, tzinfo=UTC)

    users = await seed.seed_users(session, seed_time)
    registrations = await seed.seed_teacher_registers(session, users, seed_time)
    references = await seed.seed_reference_data(session)
    quiz = await seed.seed_quiz(session, seed_time)
    problem_data = await seed.seed_problem(
        session, references, users["teacher"], users["student"], seed_time
    )
    curriculum = await seed.seed_courses_and_curriculum(
        session, users["teacher"], quiz, problem_data["problem"], seed_time
    )
    commerce = await seed.seed_learning_and_commerce(
        session, users, quiz, curriculum, seed_time
    )
    await seed.seed_activity_and_communication(
        session,
        users,
        problem_data["submission"],
        commerce["transaction"],
        registrations["approved"],
        seed_time,
    )

    seeded_tables = {
        record.__tablename__
        for record in session.records
        if hasattr(record, "__tablename__")
    }
    assert seeded_tables == set(Base.metadata.tables)
