from fastapi import APIRouter

from src.modules.student.student_course.student_course_router import (
    router as student_course_router,
)


router = APIRouter(prefix="/student")
router.include_router(student_course_router)
