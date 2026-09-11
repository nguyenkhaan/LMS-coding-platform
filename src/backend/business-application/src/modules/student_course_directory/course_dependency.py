from src.modules.student_course_directory.course_service import CourseService


def get_course_service() -> CourseService:
    """Provide a CourseService instance for FastAPI Depends injection."""
    return CourseService()
