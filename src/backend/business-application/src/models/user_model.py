from datetime import datetime, UTC
from typing import List, Optional, TYPE_CHECKING

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime, Enum as SQLEnum
from src.models.base_model import AccountStatus
from src.db import Base

if TYPE_CHECKING:
    from src.models.role_model import UserRoleModel

class UserModel(Base): 
    __tablename__ = 'user' 
    id : Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(nullable=False) 
    address : Mapped[str] = mapped_column(nullable=False) 
    email : Mapped[str] = mapped_column(nullable=False, unique=True) 
    password : Mapped[str] = mapped_column() 
    avatar_url : Mapped[Optional[str]] = mapped_column(nullable=True) 
    refresh_token: Mapped[Optional[str]] = mapped_column(nullable=True)
    status: Mapped[str] = mapped_column(nullable=False, default="verified")
    active: Mapped[bool] = mapped_column(nullable=False, default=False)
    account_status : Mapped[AccountStatus] = mapped_column(
        SQLEnum(AccountStatus), 
        nullable=False, 
        default=AccountStatus.UNVERIFIED
    ) 
    created_at : Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default = lambda : datetime.now(UTC), 
        nullable = False 
    ) 
    updated_at : Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default = lambda : datetime.now(UTC), 
        onupdate = lambda : datetime.now(UTC), 
        nullable = False 
    )

    # Relationships
    roles : Mapped[List["UserRoleModel"]] = relationship(
        back_populates = "user", cascade = "all, delete-orphan"
    )
    history : Mapped[List["UserHistoryModel"]] = relationship(
        back_populates = "user", cascade = "all, delete-orphan"
    )
    student_profile : Mapped[Optional["StudentProfileModel"]] = relationship(
        back_populates = "user", uselist = False, cascade = "all, delete-orphan"
    )
    teacher_profile : Mapped[Optional["TeacherProfileModel"]] = relationship(
        back_populates = "user", uselist = False, cascade = "all, delete-orphan"
    )
    teacher_registrations : Mapped[List["TeacherRegisterModel"]] = relationship(
        back_populates = "teacher", foreign_keys = "[TeacherRegisterModel.teacher_id]", cascade = "all, delete-orphan"
    )
    reviewed_registrations : Mapped[List["TeacherRegisterModel"]] = relationship(
        back_populates = "reviewer", foreign_keys = "[TeacherRegisterModel.reviewed_by]"
    )
    enrollments : Mapped[List["EnrollmentModel"]] = relationship(
        back_populates = "student", cascade = "all, delete-orphan"
    )
    quiz_enrollments : Mapped[List["QuizEnrollmentModel"]] = relationship(
        back_populates = "student", cascade = "all, delete-orphan"
    )
    quiz_submissions : Mapped[List["QuizSubmissionModel"]] = relationship(
        back_populates = "student", cascade = "all, delete-orphan"
    )
    problem_submissions : Mapped[List["SubmissionModel"]] = relationship(
        back_populates = "student", cascade = "all, delete-orphan"
    )
    interview_sessions : Mapped[List["InterviewSessionModel"]] = relationship(
        back_populates = "student", cascade = "all, delete-orphan"
    )
    comments : Mapped[List["CommentModel"]] = relationship(
        back_populates = "user", cascade = "all, delete-orphan"
    )
    notifications_sent : Mapped[List["NotificationModel"]] = relationship(
        back_populates = "sender", foreign_keys = "[NotificationModel.sender_id]", cascade = "all, delete-orphan"
    )
    notifications_received : Mapped[List["NotificationModel"]] = relationship(
        back_populates = "recipient", foreign_keys = "[NotificationModel.user_id]", cascade = "all, delete-orphan"
    )
    transactions : Mapped[List["TransactionModel"]] = relationship(
        back_populates = "user", cascade = "all, delete-orphan"
    )
    audit_logs : Mapped[List["AuditLogModel"]] = relationship(
        back_populates = "user", cascade = "all, delete-orphan"
    )

from src.models.role_model import UserRoleModel
from src.models.user_history_model import UserHistoryModel
from src.models.student_profile_model import StudentProfileModel
from src.models.teacher_profile_model import TeacherProfileModel
from src.models.teacher_register_model import TeacherRegisterModel
from src.models.enrollment_model import EnrollmentModel
from src.models.quiz_enrollment_model import QuizEnrollmentModel
from src.models.quiz_submission_model import QuizSubmissionModel
from src.models.submission_model import SubmissionModel
from src.models.interview_session_model import InterviewSessionModel
from src.models.comment_model import CommentModel
from src.models.notification_model import NotificationModel
from src.models.transaction_model import TransactionModel
from src.models.audit_log_model import AuditLogModel