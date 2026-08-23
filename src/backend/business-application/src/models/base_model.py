from datetime import UTC, datetime
from enum import Enum

from sqlalchemy import DateTime
from sqlalchemy.orm import Mapped, mapped_column


def utc_now() -> datetime:
    return datetime.now(UTC)


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )


class AccountStatus(str, Enum):
    BANNED = "BANNED"
    UNVERIFIED = "UNVERIFIED"
    ACTIVE = "ACTIVE"


class TeacherRegisterStatus(str, Enum):
    DRAFT = "DRAFT"
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class CourseStatus(str, Enum):
    DRAFT = "DRAFT"
    PENDING_REVIEW = "PENDING_REVIEW"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    ARCHIVED = "ARCHIVED"


class LessonContentType(str, Enum):
    READING = "READING"
    QUIZ = "QUIZ"
    PROBLEM = "PROBLEM"


class ProblemDifficulty(str, Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"


class Role(str, Enum):
    ADMIN = "ADMIN"
    TEACHER = "TEACHER"
    STUDENT = "STUDENT"


class QuizAttemptStatus(str, Enum):
    IN_PROGRESS = "IN_PROGRESS"
    SUBMITTED = "SUBMITTED"
    ABANDONED = "ABANDONED"


class InterviewLevel(str, Enum):
    INTERN = "INTERN"
    FRESHER = "FRESHER"
    JUNIOR = "JUNIOR"
    SENIOR = "SENIOR"


class InterviewStatus(str, Enum):
    ACTIVE = "ACTIVE"
    REPORT_GENERATING = "REPORT_GENERATING"
    COMPLETED = "COMPLETED"
    ABORTED = "ABORTED"
    FAILED = "FAILED"


class InterviewMessageSender(str, Enum):
    AI = "AI"
    STUDENT = "STUDENT"
    SYSTEM = "SYSTEM"


class ProblemSubmissionStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    ACCEPTED = "ACCEPTED"
    WRONG_ANSWER = "WRONG_ANSWER"
    TIME_LIMIT_EXCEEDED = "TIME_LIMIT_EXCEEDED"
    MEMORY_LIMIT_EXCEEDED = "MEMORY_LIMIT_EXCEEDED"
    RUNTIME_ERROR = "RUNTIME_ERROR"
    COMPILE_ERROR = "COMPILE_ERROR"


class PaymentStatus(str, Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    EXPIRED = "EXPIRED"


class PayoutStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class NotificationType(str, Enum):
    PAYMENT_SUCCESS = "PAYMENT_SUCCESS"
    PAYMENT_FAILED = "PAYMENT_FAILED"
    TEACHER_APPLICATION_APPROVED = "TEACHER_APPLICATION_APPROVED"
    TEACHER_APPLICATION_REJECTED = "TEACHER_APPLICATION_REJECTED"
    COURSE_APPROVED = "COURSE_APPROVED"
    COURSE_REJECTED = "COURSE_REJECTED"
    JUDGE_RESULT = "JUDGE_RESULT"
    AI_REPORT_READY = "AI_REPORT_READY"
    PAYOUT_APPROVED = "PAYOUT_APPROVED"
    PAYOUT_REJECTED = "PAYOUT_REJECTED"


class AuditAction(str, Enum):
    JOIN = "JOIN"
    INTERVIEW = "INTERVIEW"
    TEACHER_APPLICATION_REVIEW = "TEACHER_APPLICATION_REVIEW"
    COURSE_MODERATION = "COURSE_MODERATION"
    PAYMENT_WEBHOOK = "PAYMENT_WEBHOOK"
    PAYOUT_REVIEW = "PAYOUT_REVIEW"
    ACCOUNT_STATUS_UPDATE = "ACCOUNT_STATUS_UPDATE"
    ROLE_UPDATE = "ROLE_UPDATE"


class Currency(str, Enum):
    USD = "USD"


InterViewLevel = InterviewLevel
