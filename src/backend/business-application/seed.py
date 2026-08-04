"""Seed a full debug dataset for the business-application database.

Usage:
    cd src/backend/business-application
    uv run python seed.py

This script is destructive by design: it truncates the business-application
tables and rebuilds a fresh demo dataset for local debugging.
"""

from __future__ import annotations

import asyncio
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from typing import Any

from sqlalchemy import text

import src.models  # noqa: F401 - ensure all ORM tables are registered
from src.db import Base, async_session_maker
from src.helpers.pwd_hash import password_hash
from src.models.audit_log_model import AuditLogModel
from src.models.base_model import (
    AccountStatus,
    ActionType,
    CourseStatus,
    InterViewLevel,
    LessonContentType,
    LoginMethod,
    PaymentMethod,
    PaymentStatus,
    ProblemDifficulty,
    ProblemSubmissionStatus,
    Role,
    TeacherRegisterStatus,
)
from src.models.comment_model import CommentModel
from src.models.course_model import CourseModel
from src.models.enrollment_model import EnrollmentModel
from src.models.interview_message_model import InterviewMessageModel
from src.models.interview_report_model import InterviewReportModel
from src.models.interview_session_model import InterviewSessionModel
from src.models.language_model import LanguageModel
from src.models.lesson_content_model import LessonContentModel
from src.models.lesson_content_progress_model import LessonContentProgressModel
from src.models.lesson_model import LessonModel
from src.models.notification_model import NotificationModel
from src.models.problem_config_model import ProblemConfigModel
from src.models.problem_model import ProblemModel
from src.models.problem_tag_model import ProblemTagModel
from src.models.quiz_enrollment_model import QuizEnrollmentModel
from src.models.quiz_model import QuizModel
from src.models.quiz_option_model import QuizOptionModel
from src.models.quiz_question_model import QuizQuestionModel
from src.models.quiz_submission_model import QuizSubmissionModel
from src.models.reading_content_model import ReadingContentModel
from src.models.role_model import UserRoleModel
from src.models.section_model import SectionModel
from src.models.student_profile_model import StudentProfileModel
from src.models.submission_model import SubmissionModel
from src.models.submission_result_detail_model import SubmissionResultDetailModel
from src.models.teacher_profile_model import TeacherProfileModel
from src.models.teacher_register_model import TeacherRegisterModel
from src.models.testcase_model import TestcaseModel
from src.models.transaction_model import TransactionModel
from src.models.user_history_model import UserHistoryModel
from src.models.user_identity_provider_model import UserIdentityModel
from src.models.user_model import UserModel


@dataclass(frozen=True)
class SeedAccount:
    key: str
    full_name: str
    email: str
    password: str
    role: Role
    address: str


SEED_ACCOUNTS: tuple[SeedAccount, ...] = (
    SeedAccount(
        key="admin",
        full_name="Cloudian Admin",
        email="cloudian@gmail.com",
        password="admin123",
        role=Role.ADMIN,
        address="Cloudian HQ",
    ),
    SeedAccount(
        key="teacher",
        full_name="Cloudian Teacher",
        email="teacher@gmail.com",
        password="teacher123",
        role=Role.TEACHER,
        address="Cloudian School",
    ),
    SeedAccount(
        key="student",
        full_name="Cloudian Student",
        email="student@gmail.com",
        password="student123",
        role=Role.STUDENT,
        address="Cloudian Campus",
    ),
)


def now() -> datetime:
    return datetime.now(UTC)


async def reset_business_database(session) -> None:
    table_names = ", ".join(f'"{table.name}"' for table in Base.metadata.sorted_tables)
    await session.execute(text(f"TRUNCATE {table_names} RESTART IDENTITY CASCADE"))


async def seed_users(session) -> dict[str, UserModel]:
    users: dict[str, UserModel] = {}
    seed_time = now()

    for account in SEED_ACCOUNTS:
        user = UserModel(
            full_name=account.full_name,
            email=account.email,
            password=password_hash.hash(account.password),
            address=account.address,
            avatar_url=None,
            active=True,
            account_status=AccountStatus.ACTIVE,
            created_at=seed_time,
            updated_at=seed_time,
        )
        session.add(user)
        await session.flush()

        session.add(
            UserRoleModel(
                user_id=user.id,
                role=account.role,
            )
        )
        session.add(
            UserIdentityModel(
                user_id=user.id,
                method=LoginMethod.LOCAL,
                provider_id=None,
            )
        )
        session.add(
            UserHistoryModel(
                user_id=user.id,
                problem_count=0 if account.role == Role.ADMIN else (2 if account.role == Role.STUDENT else 5),
                created_at=seed_time,
                updated_at=seed_time,
            )
        )

        if account.role == Role.TEACHER:
            session.add(
                TeacherProfileModel(
                    user_id=user.id,
                    bio="Seeded teacher account for debugging.",
                    school_address="Cloudian School",
                    verified=True,
                    cv_url="https://example.com/cv/teacher.pdf",
                    created_at=seed_time,
                    updated_at=seed_time,
                )
            )
        elif account.role == Role.STUDENT:
            session.add(
                StudentProfileModel(
                    user_id=user.id,
                    bio="Seeded student account for debugging.",
                    school="Cloudian Campus",
                    major="Computer Science",
                    github_url="https://github.com/cloudian-student",
                    facebook_url=None,
                    linkedln_url=None,
                )
            )

        users[account.key] = user

    await session.flush()
    return users


async def seed_reference_data(session) -> dict[str, Any]:
    seed_time = now()

    languages = {
        "python": LanguageModel(
            name="Python",
            default_time_limit=1000.0,
            default_memory_limit=256.0,
            is_active=True,
        ),
        "cpp": LanguageModel(
            name="C++",
            default_time_limit=1000.0,
            default_memory_limit=256.0,
            is_active=True,
        ),
        "javascript": LanguageModel(
            name="JavaScript",
            default_time_limit=1000.0,
            default_memory_limit=256.0,
            is_active=True,
        ),
    }
    session.add_all(languages.values())

    tags = {
        "arrays": ProblemTagModel(tag_name="Arrays"),
        "strings": ProblemTagModel(tag_name="Strings"),
        "dynamic_programming": ProblemTagModel(tag_name="Dynamic Programming"),
    }
    session.add_all(tags.values())
    await session.flush()

    return {
        "seed_time": seed_time,
        "languages": languages,
        "tags": tags,
    }


async def seed_quiz(session, seed_time: datetime) -> dict[str, Any]:
    quiz = QuizModel(
        title="Python Fundamentals Checkpoint",
        passing_score=80.0,
        start_date=seed_time - timedelta(days=1),
        end_date=seed_time + timedelta(days=30),
        attempts=3,
        deleted_at=None,
    )
    session.add(quiz)
    await session.flush()

    q1 = QuizQuestionModel(
        quiz_id=quiz.id,
        title="Variables",
        content="Which keyword is used to define a constant in Python?",
        question_type="single_choice",
        points=5.0,
    )
    q2 = QuizQuestionModel(
        quiz_id=quiz.id,
        title="Lists",
        content="What is the output of len([1, 2, 3, 4])?",
        question_type="single_choice",
        points=5.0,
    )
    session.add_all([q1, q2])
    await session.flush()

    session.add_all(
        [
            QuizOptionModel(question_id=q1.id, content="const", is_correct=False),
            QuizOptionModel(question_id=q1.id, content="let", is_correct=False),
            QuizOptionModel(question_id=q1.id, content="There is no constant keyword", is_correct=True),
            QuizOptionModel(question_id=q1.id, content="final", is_correct=False),
            QuizOptionModel(question_id=q2.id, content="3", is_correct=False),
            QuizOptionModel(question_id=q2.id, content="4", is_correct=True),
            QuizOptionModel(question_id=q2.id, content="5", is_correct=False),
            QuizOptionModel(question_id=q2.id, content="6", is_correct=False),
        ]
    )
    await session.flush()

    return {"quiz": quiz}


async def seed_problem(session, refs: dict[str, Any], users: dict[str, UserModel]) -> dict[str, Any]:
    seed_time = refs["seed_time"]
    teacher = users["teacher"]
    python = refs["languages"]["python"]
    cpp = refs["languages"]["cpp"]
    arrays = refs["tags"]["arrays"]
    strings = refs["tags"]["strings"]

    problem = ProblemModel(
        teacher_id=teacher.id,
        title="Two Sum Seed",
        slug="two-sum-seed",
        statement="Given an array of integers and a target value, return the indices of the two numbers that add up to the target.",
        input_description="The first line contains n and target. The second line contains n integers.",
        output_description="Print the zero-based indices of the two numbers.",
        constraints="1 <= n <= 1000",
        sample_input="4 9\n2 7 11 15",
        sample_output="0 1",
        explanation="A simple hash map solution is enough for debug.",
        difficulty=ProblemDifficulty.EASY,
        public=True,
        created_at=seed_time,
    )
    problem.tags.extend([arrays, strings])
    session.add(problem)
    await session.flush()

    session.add_all(
        [
            ProblemConfigModel(
                problem_id=problem.id,
                language_id=python.id,
                time_limit_ms=1000.0,
                memory_limit_mb=256.0,
            ),
            ProblemConfigModel(
                problem_id=problem.id,
                language_id=cpp.id,
                time_limit_ms=1000.0,
                memory_limit_mb=256.0,
            ),
        ]
    )

    testcase_1 = TestcaseModel(
        problem_id=problem.id,
        input_file="1.in",
        output_file="1.out",
        score=50.0,
        is_hidden=False,
    )
    testcase_2 = TestcaseModel(
        problem_id=problem.id,
        input_file="2.in",
        output_file="2.out",
        score=50.0,
        is_hidden=True,
    )
    session.add_all([testcase_1, testcase_2])
    await session.flush()

    submission = SubmissionModel(
        problem_id=problem.id,
        student_id=users["student"].id,
        language_id=python.id,
        source_code="def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in seen:\n            return [seen[diff], i]\n        seen[n] = i\n",
        status=ProblemSubmissionStatus.ACCEPTED,
        score=100.0,
        runtime_ms=12.5,
        memory_kb=512.0,
        submitted_at=seed_time,
    )
    session.add(submission)
    await session.flush()

    session.add_all(
        [
            SubmissionResultDetailModel(
                submission_id=submission.id,
                testcase_id=testcase_1.id,
                status=ProblemSubmissionStatus.ACCEPTED,
                runtime_ms=11.8,
                memory_kb=500.0,
            ),
            SubmissionResultDetailModel(
                submission_id=submission.id,
                testcase_id=testcase_2.id,
                status=ProblemSubmissionStatus.ACCEPTED,
                runtime_ms=12.5,
                memory_kb=512.0,
            ),
        ]
    )

    return {
        "problem": problem,
        "submission": submission,
    }


async def seed_courses_and_curriculum(
    session,
    users: dict[str, UserModel],
    quiz: QuizModel,
    problem: ProblemModel,
    seed_time: datetime,
) -> dict[str, Any]:
    teacher = users["teacher"]

    free_course = CourseModel(
        title="Python Fundamentals",
        teacher_id=teacher.id,
        slug="python-fundamentals",
        rating=4.8,
        field="Programming",
        tags="python,basics",
        description="A friendly starter course for new Python learners.",
        thumbnai_url="https://example.com/courses/python-fundamentals.png",
        price=0.0,
        status=CourseStatus.PUBLISHED,
        created_at=seed_time - timedelta(days=10),
        updated_at=seed_time - timedelta(days=2),
        deleted_at=None,
    )
    paid_course = CourseModel(
        title="Advanced Algorithms",
        teacher_id=teacher.id,
        slug="advanced-algorithms",
        rating=4.9,
        field="Computer Science",
        tags="algorithms,data-structures",
        description="A paid course for deeper algorithm practice.",
        thumbnai_url="https://example.com/courses/advanced-algorithms.png",
        price=299000.0,
        status=CourseStatus.PUBLISHED,
        created_at=seed_time - timedelta(days=8),
        updated_at=seed_time - timedelta(days=1),
        deleted_at=None,
    )
    draft_course = CourseModel(
        title="AI Interview Lab",
        teacher_id=teacher.id,
        slug="ai-interview-lab",
        rating=0.0,
        field="Career",
        tags="interview,ai",
        description="Draft course for interview preparation workflows.",
        thumbnai_url="https://example.com/courses/ai-interview-lab.png",
        price=199000.0,
        status=CourseStatus.DRAFT,
        created_at=seed_time - timedelta(days=3),
        updated_at=seed_time - timedelta(days=3),
        deleted_at=None,
    )
    session.add_all([free_course, paid_course, draft_course])
    await session.flush()

    intro_section = SectionModel(course_id=free_course.id, title="Getting Started", position=0)
    practice_section = SectionModel(course_id=free_course.id, title="Practice", position=1)
    paid_section = SectionModel(course_id=paid_course.id, title="Core Concepts", position=0)
    session.add_all([intro_section, practice_section, paid_section])
    await session.flush()

    lesson_intro = LessonModel(
        section_id=intro_section.id,
        title="Welcome to Python",
        summary="Course introduction and setup guidance.",
        score=10.0,
        position=0,
        created_at=seed_time - timedelta(days=9),
        updated_at=seed_time - timedelta(days=9),
    )
    lesson_quiz = LessonModel(
        section_id=intro_section.id,
        title="Python Basics Quiz",
        summary="Short quiz to check foundational knowledge.",
        score=20.0,
        position=1,
        created_at=seed_time - timedelta(days=9),
        updated_at=seed_time - timedelta(days=9),
    )
    lesson_problem = LessonModel(
        section_id=practice_section.id,
        title="Two Sum Practice",
        summary="Solve a classic array problem.",
        score=30.0,
        position=0,
        created_at=seed_time - timedelta(days=9),
        updated_at=seed_time - timedelta(days=9),
    )
    paid_lesson = LessonModel(
        section_id=paid_section.id,
        title="Algorithm Thinking",
        summary="A short reading lesson for the paid course.",
        score=15.0,
        position=0,
        created_at=seed_time - timedelta(days=7),
        updated_at=seed_time - timedelta(days=7),
    )
    session.add_all([lesson_intro, lesson_quiz, lesson_problem, paid_lesson])
    await session.flush()

    reading_1 = ReadingContentModel(
        title="Why Python is a good starter language",
        content="Python is easy to read, has a large ecosystem, and is great for automation.",
        created_at=seed_time - timedelta(days=9),
        updated_at=seed_time - timedelta(days=9),
    )
    reading_2 = ReadingContentModel(
        title="Algorithm basics",
        content="Look for patterns, reduce the problem, and test edge cases.",
        created_at=seed_time - timedelta(days=7),
        updated_at=seed_time - timedelta(days=7),
    )
    session.add_all([reading_1, reading_2])
    await session.flush()

    lesson_content_reading = LessonContentModel(
        lesson_id=lesson_intro.id,
        content_type=LessonContentType.READING,
        content_id=reading_1.id,
        media_url=None,
        position=0,
        created_at=seed_time - timedelta(days=9),
    )
    lesson_content_quiz = LessonContentModel(
        lesson_id=lesson_quiz.id,
        content_type=LessonContentType.QUIZ,
        content_id=quiz.id,
        media_url=None,
        position=0,
        created_at=seed_time - timedelta(days=9),
    )
    lesson_content_problem = LessonContentModel(
        lesson_id=lesson_problem.id,
        content_type=LessonContentType.PROBLEM,
        content_id=problem.id,
        media_url=None,
        position=0,
        created_at=seed_time - timedelta(days=9),
    )
    lesson_content_paid = LessonContentModel(
        lesson_id=paid_lesson.id,
        content_type=LessonContentType.READING,
        content_id=reading_2.id,
        media_url=None,
        position=0,
        created_at=seed_time - timedelta(days=7),
    )
    session.add_all(
        [
            lesson_content_reading,
            lesson_content_quiz,
            lesson_content_problem,
            lesson_content_paid,
        ]
    )
    await session.flush()

    return {
        "free_course": free_course,
        "paid_course": paid_course,
        "draft_course": draft_course,
        "intro_section": intro_section,
        "practice_section": practice_section,
        "lesson_content_reading": lesson_content_reading,
        "lesson_content_quiz": lesson_content_quiz,
        "lesson_content_problem": lesson_content_problem,
        "lesson_content_paid": lesson_content_paid,
    }


async def seed_enrollment_and_progress(
    session,
    users: dict[str, UserModel],
    graph: dict[str, Any],
    seed_time: datetime,
) -> dict[str, Any]:
    student = users["student"]

    free_enrollment = EnrollmentModel(
        student_id=student.id,
        course_id=graph["free_course"].id,
        status="active",
        enrolled_at=seed_time - timedelta(days=5),
        completed_at=None,
    )
    paid_enrollment = EnrollmentModel(
        student_id=student.id,
        course_id=graph["paid_course"].id,
        status="active",
        enrolled_at=seed_time - timedelta(days=2),
        completed_at=None,
    )
    session.add_all([free_enrollment, paid_enrollment])
    await session.flush()

    session.add_all(
        [
            LessonContentProgressModel(
                enrollment_id=free_enrollment.id,
                lesson_content_id=graph["lesson_content_reading"].id,
                completed=True,
                completed_at=seed_time - timedelta(days=5),
            ),
            LessonContentProgressModel(
                enrollment_id=free_enrollment.id,
                lesson_content_id=graph["lesson_content_quiz"].id,
                completed=True,
                completed_at=seed_time - timedelta(days=4),
            ),
            LessonContentProgressModel(
                enrollment_id=free_enrollment.id,
                lesson_content_id=graph["lesson_content_problem"].id,
                completed=True,
                completed_at=seed_time - timedelta(days=3),
            ),
            LessonContentProgressModel(
                enrollment_id=paid_enrollment.id,
                lesson_content_id=graph["lesson_content_paid"].id,
                completed=False,
                completed_at=None,
            ),
        ]
    )

    session.add(
        QuizEnrollmentModel(
            quiz_id=graph["lesson_content_quiz"].content_id,
            student_id=student.id,
            enrolled_at=seed_time - timedelta(days=4),
        )
    )
    session.add(
        QuizSubmissionModel(
            quiz_id=graph["lesson_content_quiz"].content_id,
            student_id=student.id,
            score=100.0,
            submitted_at=seed_time - timedelta(days=4),
            answers={"1": 3, "2": 2},
        )
    )

    return {
        "free_enrollment": free_enrollment,
        "paid_enrollment": paid_enrollment,
    }


async def seed_commenting(session, users: dict[str, UserModel], graph: dict[str, Any], seed_time: datetime) -> None:
    student = users["student"]
    teacher = users["teacher"]

    parent = CommentModel(
        lesson_content_id=graph["lesson_content_reading"].id,
        user_id=student.id,
        parent_id=None,
        content="This explanation is clear, but can you add a variable example?",
        created_at=seed_time - timedelta(days=4),
        updated_at=seed_time - timedelta(days=4),
    )
    session.add(parent)
    await session.flush()

    session.add(
        CommentModel(
            lesson_content_id=graph["lesson_content_reading"].id,
            user_id=teacher.id,
            parent_id=parent.id,
            content="Yes, I will add a short example in the next update.",
            created_at=seed_time - timedelta(days=4),
            updated_at=seed_time - timedelta(days=4),
        )
    )


async def seed_teacher_registers(session, users: dict[str, UserModel], seed_time: datetime) -> None:
    admin = users["admin"]
    teacher = users["teacher"]
    student = users["student"]

    session.add_all(
        [
            TeacherRegisterModel(
                teacher_id=student.id,
                motivation="I want to become a teacher and share what I learn.",
                cccd="012345678901",
                cccd_front_url="https://example.com/identity/student-front.png",
                cccd_back_url="https://example.com/identity/student-back.png",
                status=TeacherRegisterStatus.PENDING,
                reviewed_note=None,
                reviewed_by=None,
                reviewed_at=None,
                created_at=seed_time - timedelta(days=1),
                updated_at=seed_time - timedelta(days=1),
                deleted_at=None,
            ),
            TeacherRegisterModel(
                teacher_id=teacher.id,
                motivation="I already teach backend and want to publish paid courses.",
                cccd="012345678902",
                cccd_front_url="https://example.com/identity/teacher-front.png",
                cccd_back_url="https://example.com/identity/teacher-back.png",
                status=TeacherRegisterStatus.AGREE,
                reviewed_note="Approved for seed data.",
                reviewed_by=admin.id,
                reviewed_at=seed_time - timedelta(hours=12),
                created_at=seed_time - timedelta(days=2),
                updated_at=seed_time - timedelta(hours=12),
                deleted_at=None,
            ),
        ]
    )


async def seed_transactions_notifications_audit_logs(
    session,
    users: dict[str, UserModel],
    graph: dict[str, Any],
    seed_time: datetime,
) -> None:
    admin = users["admin"]
    teacher = users["teacher"]
    student = users["student"]

    session.add(
        TransactionModel(
            user_id=student.id,
            course_id=graph["paid_course"].id,
            payment_method=PaymentMethod.TRANSFER,
            amount=299000.0,
            status=PaymentStatus.COMPLETE,
            transaction_code="TRX-20260804-0001",
            payos_code="PAYOS-20260804-0001",
            payos_link="https://payos.example.com/checkout/TRX-20260804-0001",
            created_at=seed_time - timedelta(days=2),
            updated_at=seed_time - timedelta(days=2),
        )
    )

    session.add_all(
        [
            NotificationModel(
                sender_id=admin.id,
                user_id=student.id,
                content="Your teacher application is waiting for review.",
                is_read=False,
                created_at=seed_time - timedelta(days=1),
            ),
            NotificationModel(
                sender_id=teacher.id,
                user_id=student.id,
                content="Nice work on the quiz. Keep going!",
                is_read=True,
                created_at=seed_time - timedelta(days=1),
            ),
        ]
    )

    session.add_all(
        [
            AuditLogModel(
                user_id=admin.id,
                action=ActionType.JOIN,
                note="Seed admin account created.",
                do_at=seed_time - timedelta(days=10),
            ),
            AuditLogModel(
                user_id=admin.id,
                action=ActionType.SOMETHING,
                note="Approved teacher registration for seeded dataset.",
                do_at=seed_time - timedelta(hours=12),
            ),
        ]
    )


async def seed_interview(session, users: dict[str, UserModel], seed_time: datetime) -> None:
    student = users["student"]

    session_model = InterviewSessionModel(
        student_id=student.id,
        topic="Python Backend Developer",
        level=InterViewLevel.JUNIOR,
        status=False,
        started_at=seed_time - timedelta(days=1),
        ended_at=(seed_time - timedelta(days=1)) + timedelta(minutes=25),
    )
    session.add(session_model)
    await session.flush()

    session.add_all(
        [
            InterviewMessageModel(
                session_id=session_model.id,
                sender="AI",
                content="Tell me about a backend project you built.",
                created_at=seed_time - timedelta(days=1),
            ),
            InterviewMessageModel(
                session_id=session_model.id,
                sender="HUMAN",
                content="I built a FastAPI service with async PostgreSQL access.",
                created_at=(seed_time - timedelta(days=1)) + timedelta(minutes=2),
            ),
            InterviewMessageModel(
                session_id=session_model.id,
                sender="AI",
                content="How would you improve its reliability?",
                created_at=(seed_time - timedelta(days=1)) + timedelta(minutes=4),
            ),
            InterviewMessageModel(
                session_id=session_model.id,
                sender="HUMAN",
                content="I would add retries, better monitoring, and integration tests.",
                created_at=(seed_time - timedelta(days=1)) + timedelta(minutes=6),
            ),
        ]
    )

    session.add(
        InterviewReportModel(
            session_id=session_model.id,
            overall_score=8.5,
            strengths="Clear backend thinking, good testing instincts, and practical architecture.",
            weaknesses="Could be more specific about scaling trade-offs and observability.",
            suggestions="Practice system design answers and mention concrete metrics.",
            generated_at=(seed_time - timedelta(days=1)) + timedelta(minutes=10),
        )
    )


async def seed_database() -> None:
    async with async_session_maker() as session:
        async with session.begin():
            await reset_business_database(session)

            seed_time = now()
            users = await seed_users(session)
            refs = await seed_reference_data(session)
            quiz_pack = await seed_quiz(session, refs["seed_time"])
            problem_pack = await seed_problem(session, refs, users)
            graph = await seed_courses_and_curriculum(
                session,
                users,
                quiz_pack["quiz"],
                problem_pack["problem"],
                seed_time,
            )
            await seed_enrollment_and_progress(session, users, graph, seed_time)
            await seed_commenting(session, users, graph, seed_time)
            await seed_teacher_registers(session, users, seed_time)
            await seed_transactions_notifications_audit_logs(session, users, graph, seed_time)
            await seed_interview(session, users, seed_time)

    print("Seed completed successfully.")
    print("Created debug accounts:")
    print("- cloudian@gmail.com / admin123")
    print("- teacher@gmail.com / teacher123")
    print("- student@gmail.com / student123")
    print("Seeded supporting data:")
    print("- courses, sections, lessons, lesson contents, and progress")
    print("- quiz, quiz questions, options, enrollment, and submission")
    print("- problem, tags, configs, testcases, and accepted submission")
    print("- teacher register requests, payments, notifications, comments, audit logs, and interview session")


def main() -> None:
    asyncio.run(seed_database())


if __name__ == "__main__":
    main()
