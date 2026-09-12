from typing import Annotated

from fastapi import APIRouter, Depends, Path, Query

from src.middlewares.auth_middleware import UserPayload
from src.modules.courses.catalog.dependencies import (
    get_course_directory_service,
    get_optional_user,
)
from src.modules.courses.catalog.dto import (
    CourseDetailView,
    CourseListResponse,
    InstructorDetailView,
    InstructorListResponse,
    PriceType,
    ResourceResponse,
)
from src.modules.courses.catalog.service import CourseDirectoryService

router = APIRouter(tags=["Course Directory"])


@router.get("/courses", response_model=CourseListResponse)
async def list_courses(
    q: str | None = None,
    field: str | None = None,
    tag: str | None = None,
    price_type: PriceType | None = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    service: CourseDirectoryService = Depends(get_course_directory_service),
):
    return await service.list_courses(page, size, q, field, tag, price_type)


@router.get("/courses/{slug}", response_model=ResourceResponse[CourseDetailView])
async def get_course(
    slug: Annotated[str, Path(min_length=1)],
    user: UserPayload | None = Depends(get_optional_user),
    service: CourseDirectoryService = Depends(get_course_directory_service),
):
    user_id = user["sub"] if user else None
    return {"data": await service.get_course(slug, user_id)}


@router.get("/instructors", response_model=InstructorListResponse)
async def list_instructors(
    q: str | None = None,
    field: str | None = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    service: CourseDirectoryService = Depends(get_course_directory_service),
):
    return await service.list_instructors(page, size, q, field)


@router.get(
    "/instructors/{user_id}", response_model=ResourceResponse[InstructorDetailView]
)
async def get_instructor(
    user_id: int,
    service: CourseDirectoryService = Depends(get_course_directory_service),
):
    return {"data": await service.get_instructor(user_id)}
