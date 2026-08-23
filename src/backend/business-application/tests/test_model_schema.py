import re
from pathlib import Path

from sqlalchemy import Index, UniqueConstraint
from sqlalchemy.orm import configure_mappers

import src.models  # noqa: F401
from src.db import Base


DATABASE_SPEC_PATH = Path(__file__).resolve().parents[4] / "docs" / "DATABASE.txt"


EXPECTED_TABLES = {
    "user", "user_role", "user_identity", "student_profile", "teacher_profile", "teacher_register",
    "teacher_register_history", "courses", "course_moderation_review", "sections",
    "lesson", "lesson_content", "lesson_content_progress", "comment", "reading_content", "quizzes",
    "quiz_enrollment", "quiz_questions", "quiz_options", "quiz_attempt", "quiz_submission", "problem",
    "problem_tag", "problem_tag_mapping", "problem_config", "language", "testcase",
    "submission", "submission_result_detail", "enrollment", "transaction", "course_favorite",
    "course_review", "wallet", "wallet_ledger", "payout_request", "interview_session",
    "interview_message", "interview_reports", "notification", "audit_log",
    "student_daily_activity",
}


def unique_column_sets(table_name: str) -> set[frozenset[str]]:
    table = Base.metadata.tables[table_name]
    return {
        frozenset(constraint.columns.keys())
        for constraint in table.constraints
        if isinstance(constraint, UniqueConstraint)
    }


def index_column_sets(table_name: str) -> set[frozenset[str]]:
    table = Base.metadata.tables[table_name]
    return {
        frozenset(index.columns.keys())
        for index in table.indexes
        if isinstance(index, Index)
    }


def documented_table_columns() -> dict[str, set[str]]:
    database_spec = DATABASE_SPEC_PATH.read_text(encoding="utf-8")
    table_blocks = re.findall(r"Table (\w+) \{\n(.*?)\n\}", database_spec, re.DOTALL)

    return {
        table_name: {
            line.split()[0]
            for line in table_body.splitlines()
            if line.strip() and not line.strip().startswith("//")
        }
        for table_name, table_body in table_blocks
    }


def test_models_match_database_table_inventory_and_relationships() -> None:
    assert set(Base.metadata.tables) == EXPECTED_TABLES
    configure_mappers()


def test_all_model_columns_match_canonical_database() -> None:
    expected_columns = documented_table_columns()
    actual_columns = {
        table_name: set(table.columns.keys())
        for table_name, table in Base.metadata.tables.items()
    }

    assert actual_columns == expected_columns


def test_documented_unique_constraints_are_declared() -> None:
    expected_constraints = {
        "user_role": {"user_id", "role"},
        "user_identity": {"provider", "provider_id"},
        "teacher_register": {"teacher_profile_id"},
        "sections": {"course_id", "position"},
        "lesson": {"section_id", "position"},
        "lesson_content": {"lesson_id", "position"},
        "lesson_content_progress": {"enrollment_id", "lesson_content_id"},
        "quiz_enrollment": {"quiz_id", "student_id"},
        "quiz_attempt": {"quiz_id", "student_id", "attempt_no"},
        "quiz_submission": {"quiz_attempt_id"},
        "problem_tag_mapping": {"problem_id", "tag_id"},
        "problem_config": {"problem_id", "language_id"},
        "submission_result_detail": {"submission_id", "testcase_id"},
        "enrollment": {"student_id", "course_id"},
        "course_favorite": {"student_id", "course_id"},
        "course_review": {"course_id", "student_id"},
        "wallet": {"teacher_id"},
        "interview_reports": {"session_id"},
        "student_daily_activity": {"student_id", "activity_date"},
    }

    for table_name, columns in expected_constraints.items():
        assert frozenset(columns) in unique_column_sets(table_name)

    assert frozenset({"user_id", "provider"}) in unique_column_sets("user_identity")


def test_lesson_content_unique_constraints_have_distinct_names() -> None:
    constraints = [
        constraint
        for constraint in Base.metadata.tables["lesson_content"].constraints
        if isinstance(constraint, UniqueConstraint)
    ]

    assert {constraint.name for constraint in constraints} == {
        "uq_lesson_content_lesson_position",
        "uq_lesson_content_lesson_type_content",
    }


def test_updated_timestamp_columns_have_create_and_update_defaults() -> None:
    table_names = {
        "user", "user_identity", "teacher_profile", "teacher_register", "courses", "lesson",
        "reading_content", "transaction", "course_review", "wallet", "payout_request",
        "student_daily_activity", "comment",
    }

    for table_name in table_names:
        table = Base.metadata.tables[table_name]
        assert table.c.created_at.default is not None
        assert table.c.updated_at.default is not None
        assert table.c.updated_at.onupdate is not None


def test_documented_foreign_keys_are_declared() -> None:
    expected_foreign_keys = {
        "user_role": {("user_id", "user.id")},
        "user_identity": {("user_id", "user.id")},
        "student_profile": {("user_id", "user.id")},
        "teacher_profile": {("user_id", "user.id")},
        "teacher_register": {("teacher_profile_id", "teacher_profile.user_id")},
        "teacher_register_history": {
            ("teacher_register_id", "teacher_register.id"), ("acted_by", "user.id")
        },
        "courses": {("teacher_id", "user.id")},
        "course_moderation_review": {("course_id", "courses.id")},
        "sections": {("course_id", "courses.id")},
        "lesson": {("section_id", "sections.id")},
        "lesson_content": {("lesson_id", "lesson.id")},
        "lesson_content_progress": {
            ("enrollment_id", "enrollment.id"), ("lesson_content_id", "lesson_content.id")
        },
        "comment": {
            ("lesson_content_id", "lesson_content.id"),
            ("user_id", "user.id"),
            ("parent_id", "comment.id"),
        },
        "quiz_enrollment": {("quiz_id", "quizzes.id"), ("student_id", "user.id")},
        "quiz_questions": {("quiz_id", "quizzes.id")},
        "quiz_options": {("question_id", "quiz_questions.id")},
        "quiz_attempt": {("quiz_id", "quizzes.id"), ("student_id", "user.id")},
        "quiz_submission": {("quiz_attempt_id", "quiz_attempt.id")},
        "problem": {("teacher_id", "user.id")},
        "problem_tag_mapping": {("problem_id", "problem.id"), ("tag_id", "problem_tag.id")},
        "problem_config": {("problem_id", "problem.id"), ("language_id", "language.id")},
        "testcase": {("problem_id", "problem.id")},
        "submission": {
            ("problem_id", "problem.id"), ("student_id", "user.id"), ("language_id", "language.id")
        },
        "submission_result_detail": {
            ("submission_id", "submission.id"), ("testcase_id", "testcase.id")
        },
        "enrollment": {("student_id", "user.id"), ("course_id", "courses.id")},
        "transaction": {("student_id", "user.id"), ("course_id", "courses.id")},
        "course_favorite": {("student_id", "user.id"), ("course_id", "courses.id")},
        "course_review": {("student_id", "user.id"), ("course_id", "courses.id")},
        "wallet": {("teacher_id", "user.id")},
        "wallet_ledger": {
            ("wallet_id", "wallet.id"), ("transaction_id", "transaction.id"),
            ("payout_request_id", "payout_request.id")
        },
        "payout_request": {
            ("wallet_id", "wallet.id"), ("teacher_id", "user.id"), ("reviewed_by", "user.id")
        },
        "interview_session": {("student_id", "user.id")},
        "interview_message": {("session_id", "interview_session.id")},
        "interview_reports": {("session_id", "interview_session.id")},
        "notification": {("sender_id", "user.id"), ("user_id", "user.id")},
        "audit_log": {("user_id", "user.id")},
        "student_daily_activity": {("student_id", "user.id")},
    }

    for table_name, expected in expected_foreign_keys.items():
        actual = {
            (foreign_key.parent.name, foreign_key.target_fullname)
            for foreign_key in Base.metadata.tables[table_name].foreign_keys
        }
        assert actual == expected


def test_new_table_columns_match_canonical_database() -> None:
    expected_columns = {
        "user_identity": {
            "id", "user_id", "provider", "provider_id", "created_at", "updated_at"
        },
        "comment": {
            "id", "lesson_content_id", "user_id", "parent_id", "content",
            "created_at", "updated_at", "deleted_at",
        },
        "quiz_attempt": {
            "id", "quiz_id", "student_id", "attempt_no", "status", "started_at",
            "submitted_at",
        },
        "quiz_submission": {
            "id", "quiz_attempt_id", "score", "answers", "submitted_at"
        },
    }

    for table_name, columns in expected_columns.items():
        assert set(Base.metadata.tables[table_name].columns.keys()) == columns


def test_new_table_indexes_match_canonical_database() -> None:
    assert index_column_sets("user_identity") >= {frozenset({"user_id"})}
    assert index_column_sets("comment") >= {
        frozenset({"lesson_content_id", "created_at"}),
        frozenset({"parent_id"}),
        frozenset({"user_id"}),
    }
    assert index_column_sets("quiz_attempt") >= {
        frozenset({"student_id", "quiz_id", "status"})
    }


def test_comment_parent_delete_cascades_reply_tree() -> None:
    parent_foreign_key = next(
        foreign_key
        for foreign_key in Base.metadata.tables["comment"].foreign_keys
        if foreign_key.parent.name == "parent_id"
    )

    assert parent_foreign_key.ondelete == "CASCADE"
