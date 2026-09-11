from typing import Annotated

from fastapi import APIRouter, Path, Query, status

from src.models.base_model import CourseStatus
from src.modules.teacher.teacher_course.admin.admin_dependency import (
    AdminCourseServiceDependency,
    CurrentAdminId,
)
from src.modules.teacher.teacher_course.admin.admin_dto import (
    AdminCourseDetailResponse,
    AdminCourseListResponse,
    CourseArchiveRequest,
    CourseArchiveResponse,
    CourseReviewRequest,
    CourseReviewResponse,
)


router = APIRouter(prefix="/admin/courses", tags=["Teacher Course"])


@router.get("", response_model=AdminCourseListResponse)
async def list_courses_for_moderation(
    service: AdminCourseServiceDependency,
    _admin_id: CurrentAdminId,
    status_filter: Annotated[CourseStatus | None, Query(alias="status")] = None,
    q: Annotated[str | None, Query(max_length=200)] = None,
    page: Annotated[int, Query(ge=1)] = 1,
    size: Annotated[int, Query(ge=1, le=100)] = 20,
) -> AdminCourseListResponse:
    return await service.list_courses(
        status_filter=status_filter, q=q, page=page, size=size
    )


@router.get("/{course_id}", response_model=AdminCourseDetailResponse)
async def get_course_for_moderation(
    course_id: Annotated[int, Path(ge=1)],
    service: AdminCourseServiceDependency,
    _admin_id: CurrentAdminId,
) -> AdminCourseDetailResponse:
    return await service.get_course(course_id)


@router.post("/{course_id}/review", response_model=CourseReviewResponse)
async def review_course(
    course_id: Annotated[int, Path(ge=1)],
    data: CourseReviewRequest,
    admin_id: CurrentAdminId,
    service: AdminCourseServiceDependency,
) -> CourseReviewResponse:
    return await service.review_course(course_id, admin_id, data)


@router.post(
    "/{course_id}/archive",
    response_model=CourseArchiveResponse,
    status_code=status.HTTP_200_OK,
)
async def archive_course(
    course_id: Annotated[int, Path(ge=1)],
    data: CourseArchiveRequest,
    admin_id: CurrentAdminId,
    service: AdminCourseServiceDependency,
) -> CourseArchiveResponse:
    return await service.archive_course(course_id, admin_id, data)
