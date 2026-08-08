from fastapi import Depends
from src.modules.course.course_service import CourseService

def get_course_service() -> CourseService:
    # Here we would normally inject DB session, but we use a mock service
    return CourseService()
