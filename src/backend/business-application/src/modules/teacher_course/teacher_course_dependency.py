from fastapi import Depends
from src.modules.teacher_course.teacher_course_service import TeacherCourseService

def get_teacher_course_service() -> TeacherCourseService:
    return TeacherCourseService()
