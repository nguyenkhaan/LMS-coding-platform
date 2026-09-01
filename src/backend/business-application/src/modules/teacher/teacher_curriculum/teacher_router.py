from typing import Annotated

from fastapi import APIRouter, Depends, Path

from src.middlewares.auth_middleware import UserPayload
from src.middlewares.role_middleware import require_role
from src.models.base_model import Role
from src.modules.teacher.teacher_curriculum.teacher_curriculum_dependency import (
    get_teacher_service,
)
from src.modules.teacher.teacher_curriculum.teacher_curriculum_dto import (
    CurriculumReorderRequest,
    CurriculumReorderResponse,
    LessonContentBindRequest,
    LessonContentUpdateRequest,
    LessonContentView,
    LessonUpdateRequest,
    LessonView,
    LessonWriteRequest,
    MessageResponse,
    ReadingContentCreateRequest,
    ReadingContentCreateResponse,
    ReadingContentUpdateRequest,
    ReadingContentView,
    SectionUpdateRequest,
    SectionView,
    SectionWriteRequest,
)
from src.modules.teacher.teacher_curriculum.teacher_curriculum_service import (
    TeacherService,
)


router = APIRouter(tags=["Teacher Curriculum Builder"])

TeacherUser = Annotated[UserPayload, Depends(require_role(Role.TEACHER))]
TeacherServiceDependency = Annotated[TeacherService, Depends(get_teacher_service)]


@router.post("/courses/{course_id}/sections", response_model=SectionView, status_code=201)
async def create_course_section(course_id: Annotated[int, Path()], data: SectionWriteRequest, teacher: TeacherUser, service: TeacherServiceDependency) -> SectionView:
    return await service.create_course_section(course_id, teacher["sub"], data)


@router.put("/sections/{section_id}", response_model=SectionView)
async def update_course_section(section_id: Annotated[int, Path()], data: SectionUpdateRequest, teacher: TeacherUser, service: TeacherServiceDependency) -> SectionView:
    return await service.update_course_section(section_id, teacher["sub"], data)


@router.delete("/sections/{section_id}", response_model=MessageResponse)
async def delete_course_section(section_id: Annotated[int, Path()], teacher: TeacherUser, service: TeacherServiceDependency) -> MessageResponse:
    return await service.delete_course_section(section_id, teacher["sub"])


@router.post("/sections/{section_id}/lessons", response_model=LessonView, status_code=201)
async def create_lesson(section_id: Annotated[int, Path()], data: LessonWriteRequest, teacher: TeacherUser, service: TeacherServiceDependency) -> LessonView:
    return await service.create_lesson(section_id, teacher["sub"], data)


@router.put("/lessons/{lesson_id}", response_model=LessonView)
async def update_lesson(lesson_id: Annotated[int, Path()], data: LessonUpdateRequest, teacher: TeacherUser, service: TeacherServiceDependency) -> LessonView:
    return await service.update_lesson(lesson_id, teacher["sub"], data)


@router.delete("/lessons/{lesson_id}", response_model=MessageResponse)
async def delete_lesson(lesson_id: Annotated[int, Path()], teacher: TeacherUser, service: TeacherServiceDependency) -> MessageResponse:
    return await service.delete_lesson(lesson_id, teacher["sub"])


@router.post("/lessons/{lesson_id}/readings", response_model=ReadingContentCreateResponse, status_code=201)
async def create_reading_content(lesson_id: Annotated[int, Path()], data: ReadingContentCreateRequest, teacher: TeacherUser, service: TeacherServiceDependency) -> ReadingContentCreateResponse:
    return await service.create_reading_content(lesson_id, teacher["sub"], data)


@router.put("/lesson-contents/{lesson_content_id}/reading", response_model=ReadingContentView)
async def update_reading_content(lesson_content_id: Annotated[int, Path()], data: ReadingContentUpdateRequest, teacher: TeacherUser, service: TeacherServiceDependency) -> ReadingContentView:
    return await service.update_reading_content(lesson_content_id, teacher["sub"], data)


@router.post("/lessons/{lesson_id}/contents", response_model=LessonContentView, status_code=201)
async def bind_lesson_content(lesson_id: Annotated[int, Path()], data: LessonContentBindRequest, teacher: TeacherUser, service: TeacherServiceDependency) -> LessonContentView:
    return await service.bind_lesson_content(lesson_id, teacher["sub"], data)


@router.put("/lesson-contents/{lesson_content_id}", response_model=LessonContentView)
async def update_lesson_content(lesson_content_id: Annotated[int, Path()], data: LessonContentUpdateRequest, teacher: TeacherUser, service: TeacherServiceDependency) -> LessonContentView:
    return await service.update_lesson_content(lesson_content_id, teacher["sub"], data)


@router.delete("/lesson-contents/{lesson_content_id}", response_model=MessageResponse)
async def delete_lesson_content(lesson_content_id: Annotated[int, Path()], teacher: TeacherUser, service: TeacherServiceDependency) -> MessageResponse:
    return await service.delete_lesson_content(lesson_content_id, teacher["sub"])


@router.put("/courses/{course_id}/curriculum/reorder", response_model=CurriculumReorderResponse)
async def reorder_curriculum(course_id: Annotated[int, Path()], data: CurriculumReorderRequest, teacher: TeacherUser, service: TeacherServiceDependency) -> CurriculumReorderResponse:
    return await service.reorder_curriculum(course_id, teacher["sub"], data)
