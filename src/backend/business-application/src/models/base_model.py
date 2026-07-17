from enum import Enum 

class AccountStatus(str , Enum): 
    BANNED = 'banned' 
    UNVERIFIED = 'unverified' 
    ACTIVE = 'active' 

class TeacherRegisterStatus(str , Enum): 
    AGREE = 'agree' 
    REJECT = 'reject' 
    PENDING = 'pending' 

class CourseStatus(str , Enum): 
    DRAFT = 'draft' 
    PENDING_REVIEW = 'pending_review' 
    PUBLISHED = 'published' 
    ARCHIVED = 'archived' 

class LessonContentType(str, Enum): 
    READING = 'reading' 
    QUIZ = 'quiz' 
    PROBLEM = 'problem' 

class ProblemDifficulty(str, Enum): 
    EASY = 'easy' 
    MEDIUM = 'medium'  
    HARD = 'hard' 

class Role(str , Enum): 
    ADMIN = 'admin' 
    TEACHER = 'teacher' 
    STUDENT = 'student' 

class InterViewLevel(str, Enum): 
    INTERN = 'intern' 
    FRESHER = 'fresher' 
    JUNIOR = 'junior' 
    SENIOR = 'senior' 

class ProblemSubmissionStatus(str, Enum):
    PENDING = 'pending'
    RUNNING = 'running'
    ACCEPTED = 'accepted'
    WRONG_ANSWER = 'wrong_answer'
    TIME_LIMIT_EXCEEDED = 'time_limit_exceeded'
    MEMORY_LIMIT_EXCEEDED = 'memory_limit_exceeded'
    RUNTIME_ERROR = 'runtime_error'
    COMPILE_ERROR = 'compile_error'

class PaymentMethod(str, Enum):
    CASH = 'cash'
    TRANSFER = 'transfer'

class PaymentStatus(str, Enum):
    COMPLETE = 'complete'
    PENDING = 'pending'
    FAILED = 'failed'

class ActionType(str, Enum):
    JOIN = 'join'
    INTERVIEW = 'interview'
    SOMETHING = 'something'

