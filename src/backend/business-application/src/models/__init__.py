from src.models.role_model import UserRoleModel 
from src.models.user_model import UserModel 
from src.models.user_history_model import UserHistoryModel
from src.models.student_profile_model import StudentProfileModel
from src.models.teacher_profile_model import TeacherProfileModel
from src.models.teacher_register_model import TeacherRegisterModel
from src.models.course_model import CourseModel
from src.models.enrollment_model import EnrollmentModel
from src.models.section_model import SectionModel
from src.models.lesson_model import LessonModel
from src.models.lesson_content_model import LessonContentModel
from src.models.lesson_content_progress_model import LessonContentProgressModel
from src.models.reading_content_model import ReadingContentModel
from src.models.quiz_model import QuizModel
from src.models.quiz_enrollment_model import QuizEnrollmentModel
from src.models.quiz_question_model import QuizQuestionModel
from src.models.quiz_option_model import QuizOptionModel
from src.models.quiz_submission_model import QuizSubmissionModel
from src.models.problem_model import ProblemModel
from src.models.problem_tag_model import ProblemTagModel, problem_tag_map
from src.models.testcase_model import TestcaseModel
from src.models.submission_model import SubmissionModel
from src.models.submission_result_detail_model import SubmissionResultDetailModel
from src.models.interview_session_model import InterviewSessionModel
from src.models.interview_message_model import InterviewMessageModel
from src.models.interview_report_model import InterviewReportModel
from src.models.problem_config_model import ProblemConfigModel
from src.models.language_model import LanguageModel
from src.models.comment_model import CommentModel
from src.models.notification_model import NotificationModel
from src.models.transaction_model import TransactionModel
from src.models.audit_log_model import AuditLogModel

# Re-export RoleModel as an alias to UserRoleModel to maintain compatibility
RoleModel = UserRoleModel

# redis se tien hành lưu trữ hai dạng: login-${code} 
# session_id: tien hanh luu tru phien dnag nhap cua nguoi dung 