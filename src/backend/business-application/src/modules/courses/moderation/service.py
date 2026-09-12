from collections import defaultdict
from collections.abc import Sequence
from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql.elements import ColumnElement

from src.models.audit_log_model import AuditLogModel
from src.models.base_model import (
    AuditAction,
    CourseStatus,
    NotificationType,
    utc_now,
)
from src.models.course_model import CourseModel
from src.models.course_moderation_review_model import CourseModerationReviewModel
from src.models.course_review_model import CourseReviewModel
from src.models.lesson_content_model import LessonContentModel
from src.models.lesson_model import LessonModel
from src.models.notification_model import NotificationModel
from src.models.section_model import SectionModel
from src.modules.courses.moderation.dto import (
    AdminCourseDetailResponse,
    AdminCourseDetailView,
    AdminCourseListResponse,
    AdminCourseView,
    CourseArchiveRequest,
    CourseArchiveResponse,
    CourseModerationView,
    CourseReviewRequest,
    CourseReviewResponse,
    CourseReviewResult,
    LessonContentReviewView,
    LessonReviewView,
    PaginationView,
    SectionReviewView,
)


class AdminCourseService:
    def __init__(self, db_session: AsyncSession) -> None:
        self.db_session = db_session

    async def list_courses(
        self,
        status_filter: CourseStatus | None,
        q: str | None,
        page: int,
        size: int,
    ) -> AdminCourseListResponse:
        filters: list[ColumnElement[bool]] = [CourseModel.deleted_at.is_(None)]
        if status_filter is not None:
            filters.append(CourseModel.status == status_filter)
        if q is not None and q.strip():
            term = f"%{q.strip()}%"
            filters.append(
                or_(
                    CourseModel.title.ilike(term),
                    CourseModel.slug.ilike(term),
                    CourseModel.field.ilike(term),
                )
            )

        total = await self.db_session.scalar(
            select(func.count(CourseModel.id)).where(*filters)
        )
        courses = list(
            (
                await self.db_session.scalars(
                    select(CourseModel)
                    .where(*filters)
                    .order_by(
                        func.coalesce(
                            CourseModel.submitted_at, CourseModel.created_at
                        ).desc(),
                        CourseModel.id.desc(),
                    )
                    .offset((page - 1) * size)
                    .limit(size)
                )
            ).all()
        )
        ratings = await self._course_ratings([course.id for course in courses])
        return AdminCourseListResponse(
            data=[
                self._course_view(course, ratings.get(course.id, 0.0))
                for course in courses
            ],
            pagination=PaginationView(page=page, size=size, total=total or 0),
        )

    async def get_course(self, course_id: int) -> AdminCourseDetailResponse:
        course = await self._require_course(course_id)
        rating = await self._course_rating(course.id)
        history = list(
            (
                await self.db_session.scalars(
                    select(CourseModerationReviewModel)
                    .where(CourseModerationReviewModel.course_id == course.id)
                    .order_by(
                        CourseModerationReviewModel.submitted_at.desc(),
                        CourseModerationReviewModel.id.desc(),
                    )
                )
            ).all()
        )
        return AdminCourseDetailResponse(
            data=AdminCourseDetailView(
                course=self._course_view(course, rating),
                moderation_history=[self._moderation_view(item) for item in history],
                sections=await self._curriculum(course.id),
            )
        )

    async def review_course(
        self,
        course_id: int,
        admin_id: int,
        data: CourseReviewRequest,
    ) -> CourseReviewResponse:
        course = await self._require_course(course_id, lock=True)
        if course.status != CourseStatus.PENDING_REVIEW:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Only a pending course can be reviewed",
            )

        rating = await self._course_rating(course.id)
        reviewed_at = utc_now()
        course.status = data.decision
        course.reviewed_by = admin_id
        course.reviewed_note = data.note
        course.reviewed_at = reviewed_at
        moderation = CourseModerationReviewModel(
            course_id=course.id,
            status=data.decision,
            reviewed_note=data.note,
            reviewed_by=admin_id,
            reviewed_at=reviewed_at,
            approved_at=(
                reviewed_at if data.decision == CourseStatus.APPROVED else None
            ),
            submitted_at=course.submitted_at or reviewed_at,
        )
        notification_type = (
            NotificationType.COURSE_APPROVED
            if data.decision == CourseStatus.APPROVED
            else NotificationType.COURSE_REJECTED
        )
        self.db_session.add_all(
            [
                moderation,
                NotificationModel(
                    sender_id=admin_id,
                    user_id=course.teacher_id,
                    type=notification_type,
                    target_type="course",
                    target_id=course.id,
                    content=(
                        "Your course has been approved."
                        if data.decision == CourseStatus.APPROVED
                        else "Your course has been rejected. Please review the feedback."
                    ),
                ),
                AuditLogModel(
                    user_id=admin_id,
                    action=AuditAction.COURSE_MODERATION,
                    target_type="course",
                    target_id=course.id,
                    note=data.note,
                ),
            ]
        )
        await self._commit()
        return CourseReviewResponse(
            data=CourseReviewResult(
                course=self._course_view(course, rating),
                moderation=self._moderation_view(moderation),
            ),
            message=f"Course {data.decision.value.lower()}",
        )

    async def archive_course(
        self,
        course_id: int,
        admin_id: int,
        data: CourseArchiveRequest,
    ) -> CourseArchiveResponse:
        course = await self._require_course(course_id, lock=True)
        if course.status != CourseStatus.APPROVED:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Only an approved course can be archived",
            )

        rating = await self._course_rating(course.id)
        reviewed_at = utc_now()
        course.status = CourseStatus.ARCHIVED
        course.reviewed_by = admin_id
        course.reviewed_note = data.note
        course.reviewed_at = reviewed_at
        self.db_session.add_all(
            [
                CourseModerationReviewModel(
                    course_id=course.id,
                    status=CourseStatus.ARCHIVED,
                    reviewed_note=data.note,
                    reviewed_by=admin_id,
                    reviewed_at=reviewed_at,
                    submitted_at=course.submitted_at or reviewed_at,
                ),
                AuditLogModel(
                    user_id=admin_id,
                    action=AuditAction.COURSE_MODERATION,
                    target_type="course",
                    target_id=course.id,
                    note=data.note,
                ),
            ]
        )
        await self._commit()
        return CourseArchiveResponse(
            data=self._course_view(course, rating),
            message="Course archived",
        )

    async def _require_course(self, course_id: int, lock: bool = False) -> CourseModel:
        statement = select(CourseModel).where(
            CourseModel.id == course_id,
            CourseModel.deleted_at.is_(None),
        )
        if lock:
            statement = statement.with_for_update()
        course = await self.db_session.scalar(statement)
        if course is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found",
            )
        return course

    async def _course_rating(self, course_id: int) -> float:
        rating = await self.db_session.scalar(
            select(func.avg(CourseReviewModel.rating)).where(
                CourseReviewModel.course_id == course_id
            )
        )
        return float(rating or 0)

    async def _course_ratings(self, course_ids: list[int]) -> dict[int, float]:
        if not course_ids:
            return {}
        rows = (
            await self.db_session.execute(
                select(CourseReviewModel.course_id, func.avg(CourseReviewModel.rating))
                .where(CourseReviewModel.course_id.in_(course_ids))
                .group_by(CourseReviewModel.course_id)
            )
        ).all()
        return {course_id: float(rating) for course_id, rating in rows}

    async def _curriculum(self, course_id: int) -> list[SectionReviewView]:
        sections = list(
            (
                await self.db_session.scalars(
                    select(SectionModel)
                    .where(SectionModel.course_id == course_id)
                    .order_by(SectionModel.position, SectionModel.id)
                )
            ).all()
        )
        lessons = await self._lessons(sections)
        contents = await self._lesson_contents(lessons)
        lessons_by_section: dict[int, list[LessonModel]] = defaultdict(list)
        contents_by_lesson: dict[int, list[LessonContentModel]] = defaultdict(list)
        for lesson in lessons:
            lessons_by_section[lesson.section_id].append(lesson)
        for content in contents:
            contents_by_lesson[content.lesson_id].append(content)

        return [
            SectionReviewView(
                id=section.id,
                course_id=section.course_id,
                title=section.title,
                position=section.position,
                lessons=[
                    LessonReviewView(
                        id=lesson.id,
                        section_id=lesson.section_id,
                        title=lesson.title,
                        summary=lesson.summary,
                        score=Decimal(str(lesson.score or 0)),
                        position=lesson.position,
                        created_at=lesson.created_at,
                        updated_at=lesson.updated_at,
                        contents=[
                            LessonContentReviewView.model_validate(content)
                            for content in contents_by_lesson[lesson.id]
                        ],
                    )
                    for lesson in lessons_by_section[section.id]
                ],
            )
            for section in sections
        ]

    async def _lessons(self, sections: Sequence[SectionModel]) -> list[LessonModel]:
        section_ids = [section.id for section in sections]
        if not section_ids:
            return []
        return list(
            (
                await self.db_session.scalars(
                    select(LessonModel)
                    .where(LessonModel.section_id.in_(section_ids))
                    .order_by(LessonModel.position, LessonModel.id)
                )
            ).all()
        )

    async def _lesson_contents(
        self, lessons: Sequence[LessonModel]
    ) -> list[LessonContentModel]:
        lesson_ids = [lesson.id for lesson in lessons]
        if not lesson_ids:
            return []
        return list(
            (
                await self.db_session.scalars(
                    select(LessonContentModel)
                    .where(LessonContentModel.lesson_id.in_(lesson_ids))
                    .order_by(LessonContentModel.position, LessonContentModel.id)
                )
            ).all()
        )

    async def _commit(self) -> None:
        try:
            await self.db_session.flush()
            await self.db_session.commit()
        except SQLAlchemyError as exc:
            await self.db_session.rollback()
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unable to update course moderation",
            ) from exc

    @staticmethod
    def _course_view(course: CourseModel, rating: float) -> AdminCourseView:
        return AdminCourseView(
            id=course.id,
            title=course.title,
            teacher_id=course.teacher_id,
            slug=course.slug,
            rating=rating,
            field=course.field,
            tags=course.tags,
            description=course.description,
            thumbnail_url=course.thumbnail_url,
            price=Decimal(str(course.price)),
            status=course.status,
            submitted_at=course.submitted_at,
            reviewed_by=course.reviewed_by,
            reviewed_note=course.reviewed_note,
            reviewed_at=course.reviewed_at,
            created_at=course.created_at,
            updated_at=course.updated_at,
        )

    @staticmethod
    def _moderation_view(
        moderation: CourseModerationReviewModel,
    ) -> CourseModerationView:
        return CourseModerationView(
            id=moderation.id,
            course_id=moderation.course_id,
            status=moderation.status,
            note=moderation.reviewed_note,
            reviewed_by=moderation.reviewed_by,
            reviewed_at=moderation.reviewed_at,
            submitted_at=moderation.submitted_at,
        )
