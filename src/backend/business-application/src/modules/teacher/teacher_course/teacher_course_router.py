
from fastapi import APIRouter, Depends, HTTPException, Path, Query

from src.middlewares.role_middleware import require_role
from src.models.base_model import ProblemSubmissionStatus, Role
from src.modules.teacher_course.teacher_course_dependency import (
    get_teacher_course_service,
)
from src.modules.teacher_course.teacher_course_dto import (
    SubmissionListResponse,
    TeacherCourseCreateRequest,
    TeacherCourseDeleteResponse,
    TeacherCourseLessonContentCreateRequest,
    TeacherCourseLessonContentResponse,
    TeacherCourseLessonContentUpdateRequest,
    TeacherCourseLessonCreateRequest,
    TeacherCourseLessonResponse,
    TeacherCourseLessonUpdateRequest,
    TeacherCourseReadingCreateRequest,
    TeacherCourseReadingCreateResponse,
    TeacherCourseReadingResponse,
    TeacherCourseReadingUpdateRequest,
    TeacherCourseReorderRequest,
    TeacherCourseReorderResponse,
    TeacherCourseResponse,
    TeacherCourseSectionCreateRequest,
    TeacherCourseSectionResponse,
    TeacherCourseSectionUpdateRequest,
    TeacherCourseUpdateRequest,
)
from src.modules.teacher_course.teacher_course_service import TeacherCourseService

teacher_course_router = APIRouter(
    prefix="/teacher/courses",
    tags=["Teacher Course"]
)

teacher_sections_router = APIRouter(
    prefix="/teacher/sections",
    tags=["Teacher Section"]
)

teacher_lessons_router = APIRouter(
    prefix="/teacher/lessons",
    tags=["Teacher Lesson"]
)

teacher_lesson_contents_router = APIRouter(
    prefix="/teacher/lesson-contents",
    tags=["Teacher Lesson Content"]
)

def get_current_teacher_id(user: dict = Depends(require_role(Role.TEACHER))) -> int:
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    return int(user_id)

@teacher_course_router.get("", response_model=list[TeacherCourseResponse])
async def get_teacher_courses(
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service)
):
    return await service.get_teacher_courses(teacher_id)

@teacher_course_router.get("/{course_id}", response_model=TeacherCourseResponse)
async def get_course_detail(
    course_id: int = Path(..., title="The ID of the course"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service)
):
    return await service.get_course_detail(teacher_id, course_id)

@teacher_course_router.post("", response_model=TeacherCourseResponse, status_code=201)
async def create_course(
    data: TeacherCourseCreateRequest,
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service)
):
    return await service.create_course(teacher_id, data)

@teacher_course_router.put("/{course_id}", response_model=TeacherCourseResponse)
async def update_course(
    data: TeacherCourseUpdateRequest,
    course_id: int = Path(..., title="The ID of the course"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service)
):
    return await service.update_course(teacher_id, course_id, data)

@teacher_course_router.post("/{course_id}/submit-review", response_model=TeacherCourseResponse)
async def submit_course_review(
    course_id: int = Path(..., title="The ID of the course"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service)
):
    return await service.submit_course_review(teacher_id, course_id)

@teacher_course_router.post("/{course_id}/sections", response_model=TeacherCourseSectionResponse, status_code=201)
async def create_section(
    data: TeacherCourseSectionCreateRequest,
    course_id: int = Path(..., title="The ID of the course"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service)
):
    return await service.create_section(teacher_id, course_id, data)

@teacher_sections_router.put("/{section_id}", response_model=TeacherCourseSectionResponse)
async def update_section(
    data: TeacherCourseSectionUpdateRequest,
    section_id: int = Path(..., title="The ID of the section"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service)
):
    return await service.update_section(teacher_id, section_id, data)

@teacher_sections_router.delete("/{section_id}", response_model=TeacherCourseDeleteResponse)
async def delete_section(
    section_id: int = Path(..., title="The ID of the section"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service)
):
    return await service.delete_section(teacher_id, section_id)

@teacher_sections_router.post("/{section_id}/lessons", response_model=TeacherCourseLessonResponse, status_code=201)
async def create_lesson(
    data: TeacherCourseLessonCreateRequest,
    section_id: int = Path(..., title="The ID of the section"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service)
):
    return await service.create_lesson(teacher_id, section_id, data)

@teacher_lessons_router.put("/{lesson_id}", response_model=TeacherCourseLessonResponse)
async def update_lesson(
    data: TeacherCourseLessonUpdateRequest,
    lesson_id: int = Path(..., title="The ID of the lesson"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service)
):
    return await service.update_lesson(teacher_id, lesson_id, data)

@teacher_lessons_router.delete("/{lesson_id}", response_model=TeacherCourseDeleteResponse)
async def delete_lesson(
    lesson_id: int = Path(..., title="The ID of the lesson"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service)
):
    return await service.delete_lesson(teacher_id, lesson_id)

@teacher_lessons_router.post("/{lesson_id}/readings", response_model=TeacherCourseReadingCreateResponse, status_code=201)
async def create_reading_content(
    data: TeacherCourseReadingCreateRequest,
    lesson_id: int = Path(..., title="The ID of the lesson"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service)
):
    return await service.create_reading_content(teacher_id, lesson_id, data)

@teacher_lessons_router.post("/{lesson_id}/contents", response_model=TeacherCourseLessonContentResponse, status_code=201)
async def create_lesson_content(
    data: TeacherCourseLessonContentCreateRequest,
    lesson_id: int = Path(..., title="The ID of the lesson"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service)
):
    return await service.create_lesson_content(teacher_id, lesson_id, data)

@teacher_lesson_contents_router.put("/{content_id}", response_model=TeacherCourseLessonContentResponse)
async def update_lesson_content(
    data: TeacherCourseLessonContentUpdateRequest,
    content_id: int = Path(..., title="The ID of the lesson content"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service)
):
    return await service.update_lesson_content(teacher_id, content_id, data)

@teacher_lesson_contents_router.put("/{content_id}/reading", response_model=TeacherCourseReadingResponse)
async def update_reading_content(
    data: TeacherCourseReadingUpdateRequest,
    content_id: int = Path(..., title="The ID of the lesson content"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service)
):
    return await service.update_reading_content(teacher_id, content_id, data)

@teacher_lesson_contents_router.delete("/{content_id}", response_model=TeacherCourseDeleteResponse)
async def delete_lesson_content(
    content_id: int = Path(..., title="The ID of the lesson content"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service)
):
    return await service.delete_lesson_content(teacher_id, content_id)

@teacher_course_router.put("/{course_id}/curriculum/reorder", response_model=TeacherCourseReorderResponse)
async def reorder_curriculum(
    data: TeacherCourseReorderRequest,
    course_id: int = Path(..., title="The ID of the course"),
    teacher_id: int = Depends(get_current_teacher_id),
    service: TeacherCourseService = Depends(get_teacher_course_service)
):
    return await service.reorder_curriculum(teacher_id, course_id, data)




@teacher_course_router.get("/{course_id}/submissions", response_model=SubmissionListResponse)
async def get_course_submissions(
    course_id: int,
    problem_id: int | None = Query(None),
    student_id: int | None = Query(None),
    status: ProblemSubmissionStatus | None = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    user: dict = Depends(require_role(Role.TEACHER)),
    service: TeacherCourseService = Depends(get_teacher_course_service)
):
    teacher_id = int(user.get("sub"))
    return await service.get_course_submissions(
        teacher_id=teacher_id,
        course_id=course_id,
        page=page,
        size=size,
        problem_id=problem_id,
        student_id=student_id,
        status=status
    )
