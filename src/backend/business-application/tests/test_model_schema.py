from sqlalchemy import UniqueConstraint
from sqlalchemy.orm import configure_mappers

import src.models  # noqa: F401
from src.db import Base


EXPECTED_TABLES = {
    "user", "user_role", "student_profile", "teacher_profile", "teacher_register",
    "teacher_register_history", "courses", "course_moderation_review", "sections",
    "lesson", "lesson_content", "lesson_content_progress", "reading_content", "quizzes",
    "quiz_enrollment", "quiz_questions", "quiz_options", "quiz_submission", "problem",
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


def test_models_match_database_table_inventory_and_relationships() -> None:
    assert set(Base.metadata.tables) == EXPECTED_TABLES
    configure_mappers()


def test_documented_unique_constraints_are_declared() -> None:
    expected_constraints = {
        "user_role": {"user_id", "role"},
        "teacher_register": {"teacher_profile_id"},
        "sections": {"course_id", "position"},
        "lesson": {"section_id", "position"},
        "lesson_content": {"lesson_id", "position"},
        "lesson_content_progress": {"enrollment_id", "lesson_content_id"},
        "quiz_enrollment": {"quiz_id", "student_id"},
        "quiz_submission": {"quiz_id", "student_id", "attempt_no"},
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
        "user", "teacher_profile", "teacher_register", "courses", "lesson",
        "reading_content", "transaction", "course_review", "wallet", "payout_request",
        "student_daily_activity",
    }

    for table_name in table_names:
        table = Base.metadata.tables[table_name]
        assert table.c.created_at.default is not None
        assert table.c.updated_at.default is not None
        assert table.c.updated_at.onupdate is not None


def test_documented_foreign_keys_are_declared() -> None:
    expected_foreign_keys = {
        "user_role": {("user_id", "user.id")},
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
        "quiz_enrollment": {("quiz_id", "quizzes.id"), ("student_id", "user.id")},
        "quiz_questions": {("quiz_id", "quizzes.id")},
        "quiz_options": {("question_id", "quiz_questions.id")},
        "quiz_submission": {("quiz_id", "quizzes.id"), ("student_id", "user.id")},
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
