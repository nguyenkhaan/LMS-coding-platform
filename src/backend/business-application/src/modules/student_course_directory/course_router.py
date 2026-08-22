from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query

from src.middlewares.auth_middleware import get_current_user
from src.modules.student_course_directory.course_dependency import get_course_service
from src.modules.student_course_directory.course_dto import (
    CourseCatalogResponse,
    CourseDetailResponse,
    EnrollResponse,
    PriceType,
    UnenrollResponse,
)
from src.modules.student_course_directory.course_service import CourseService

router = APIRouter(
    prefix="/courses",
    tags=["Student Course Directory"],
)


# ---------------------------------------------------------------------------
# Endpoint 1 — GET /courses  (public, no auth)
# ---------------------------------------------------------------------------

@router.get("", response_model=CourseCatalogResponse, status_code=200)
async def get_course_catalog(
    page: Annotated[int, Query(ge=1)] = 1,
    size: Annotated[int, Query(ge=1, le=100)] = 10,
    q: Annotated[str | None, Query()] = None,
    price_type: Annotated[PriceType | None, Query()] = None,
    service: CourseService = Depends(get_course_service),
) -> CourseCatalogResponse:
    return await service.get_course_catalog(page, size, q, price_type)


# ---------------------------------------------------------------------------
# Endpoint 2 — GET /courses/{slug}  (public, no auth)
# ---------------------------------------------------------------------------

@router.get("/{slug}", response_model=CourseDetailResponse, status_code=200)
async def get_course_detail(
    slug: Annotated[str, Path()],
    service: CourseService = Depends(get_course_service),
) -> CourseDetailResponse:
    return await service.get_course_detail(slug)


# ---------------------------------------------------------------------------
# Endpoint 3 — POST /courses/{slug}/enroll  (auth required → 201)
# ---------------------------------------------------------------------------

@router.post("/{slug}/enroll", response_model=EnrollResponse, status_code=201)
async def enroll_course(
    slug: Annotated[str, Path()],
    user: dict = Depends(get_current_user),
    service: CourseService = Depends(get_course_service),
) -> EnrollResponse:
    # payload from get_current_user: {"sub": int, "email": str, "roles": list}
    # "sub" is already cast to int by auth_middleware.py (line 36: user_id = int(sub))
    user_id: int | None = user.get("sub", None)
    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid user id in authorization token",
        )
    return await service.enroll_course(slug, user_id)


# ---------------------------------------------------------------------------
# Endpoint 9 — POST /courses/{slug}/unenroll  (auth required → 200)
# ---------------------------------------------------------------------------

@router.post("/{slug}/unenroll", response_model=UnenrollResponse, status_code=200)
async def unenroll_course(
    slug: Annotated[str, Path()],
    user: dict = Depends(get_current_user),
    service: CourseService = Depends(get_course_service),
) -> UnenrollResponse:
    # payload from get_current_user: {"sub": int, "email": str, "roles": list}
    user_id: int | None = user.get("sub", None)
    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid user id in authorization token",
        )
    return await service.unenroll_course(slug, user_id)

# ---------------------------------------------------------------------------
# Endpoint 11 — PUT /courses/{course_id}/favorite
# ---------------------------------------------------------------------------
from src.modules.student_course_directory.course_dto import CourseFavoriteToggleResponse
from src.middlewares.role_middleware import require_role
from src.models.base_model import Role

@router.put("/{course_id}/favorite", response_model=CourseFavoriteToggleResponse, status_code=200)
async def add_favorite_course(
    course_id: Annotated[int, Path()],
    user: dict = Depends(require_role(Role.STUDENT)),
    service: CourseService = Depends(get_course_service),
) -> CourseFavoriteToggleResponse:
    user_id: int | None = user.get("sub", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user id in authorization token")
    return await service.add_favorite_course(course_id, user_id)

# ---------------------------------------------------------------------------
# Endpoint 12 — DELETE /courses/{course_id}/favorite
# ---------------------------------------------------------------------------
@router.delete("/{course_id}/favorite", response_model=CourseFavoriteToggleResponse, status_code=200)
async def remove_favorite_course(
    course_id: Annotated[int, Path()],
    user: dict = Depends(require_role(Role.STUDENT)),
    service: CourseService = Depends(get_course_service),
) -> CourseFavoriteToggleResponse:
    user_id: int | None = user.get("sub", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user id in authorization token")
    return await service.remove_favorite_course(course_id, user_id)
# ---------------------------------------------------------------------------
# Endpoint 13 — POST /courses/{course_id}/reviews
# ---------------------------------------------------------------------------
from src.modules.student_course_directory.course_dto import CourseReviewWrite, CourseReviewView, CourseReviewListResponse

@router.post("/{course_id}/reviews", response_model=CourseReviewView, status_code=200)
async def add_course_review(
    course_id: Annotated[int, Path()],
    payload: CourseReviewWrite,
    user: dict = Depends(require_role(Role.STUDENT)),
    service: CourseService = Depends(get_course_service),
) -> CourseReviewView:
    user_id: int | None = user.get("sub", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user id in authorization token")
    return await service.add_course_review(course_id, user_id, payload)

# ---------------------------------------------------------------------------
# Endpoint 14 — PATCH /courses/{course_id}/reviews/{review_id}
# ---------------------------------------------------------------------------
@router.patch("/{course_id}/reviews/{review_id}", response_model=CourseReviewView, status_code=200)
async def update_course_review(
    course_id: Annotated[int, Path()],
    review_id: Annotated[int, Path()],
    payload: CourseReviewWrite,
    user: dict = Depends(require_role(Role.STUDENT)),
    service: CourseService = Depends(get_course_service),
) -> CourseReviewView:
    user_id: int | None = user.get("sub", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user id in authorization token")
    return await service.update_course_review(course_id, review_id, user_id, payload)

# ---------------------------------------------------------------------------
# Endpoint 15 — GET /courses/{course_id}/reviews
# ---------------------------------------------------------------------------
@router.get("/{course_id}/reviews", response_model=CourseReviewListResponse, status_code=200)
async def get_course_reviews(
    course_id: Annotated[int, Path()],
    rating: Annotated[int | None, Query()] = None,
    page: Annotated[int, Query(ge=1)] = 1,
    size: Annotated[int, Query(ge=1, le=100)] = 10,
    service: CourseService = Depends(get_course_service),
) -> CourseReviewListResponse:
    return await service.get_course_reviews(course_id, rating, page, size)
