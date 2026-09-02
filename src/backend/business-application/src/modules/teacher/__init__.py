from fastapi import APIRouter

from src.modules.teacher.teacher_course.teacher_course_router import (
    router as teacher_course_router,
)
from src.modules.teacher.teacher_curriculum import router as teacher_curriculum_router
from src.modules.teacher.teacher_problem.teacher_problem_router import (
    router as teacher_problem_router,
)
from src.modules.teacher.teacher_quiz.teacher_quiz_router import (
    router as teacher_quiz_router,
)

router = APIRouter(prefix="/teacher")
router.include_router(teacher_course_router)
router.include_router(teacher_curriculum_router)
router.include_router(teacher_problem_router)
router.include_router(teacher_quiz_router)
