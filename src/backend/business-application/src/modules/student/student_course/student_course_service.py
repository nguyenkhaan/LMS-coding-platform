from collections import defaultdict
from collections.abc import Sequence
from decimal import Decimal
from typing import TypeVar

from fastapi import HTTPException
from sqlalchemy import Select, and_, func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.base_model import LessonContentType, utc_now
from src.models.course_model import CourseModel
from src.models.enrollment_model import EnrollmentModel
from src.models.lesson_content_model import LessonContentModel
from src.models.lesson_content_progress_model import LessonContentProgressModel
from src.models.lesson_model import LessonModel
from src.models.problem_model import ProblemModel
from src.models.quiz_model import QuizModel
from src.models.reading_content_model import ReadingContentModel
from src.models.section_model import SectionModel
from src.modules.student.student_course.student_course_dto import (
    CompleteReadingResponse,
    CourseStudyResponse,
    CourseStudyView,
    CourseView,
    EnrollmentView,
    LessonContentProgressView,
    LessonContentStudyView,
    LessonStudyView,
    PaginationView,
    ProblemContentView,
    ProgressListResponse,
    QuizContentView,
    ReadingContentView,
    SectionStudyView,
    StudentCourseListResponse,
    StudentCourseView,
)


ModelT = TypeVar("ModelT")


class StudentService:
    def __init__(self, db_session: AsyncSession) -> None:
        self.db_session = db_session

    async def list_courses(
        self,
        student_id: int,
        page: int,
        size: int,
        status_filter: str | None,
    ) -> StudentCourseListResponse:
        filters = [
            EnrollmentModel.student_id == student_id,
            CourseModel.deleted_at.is_(None),
        ]
        if status_filter is not None:
            filters.append(EnrollmentModel.status == status_filter)

        total = await self.db_session.scalar(
            select(func.count(EnrollmentModel.id))
            .join(CourseModel, CourseModel.id == EnrollmentModel.course_id)
            .where(*filters)
        )
        statement = (
            select(EnrollmentModel, CourseModel)
            .join(CourseModel, CourseModel.id == EnrollmentModel.course_id)
            .where(*filters)
            .order_by(EnrollmentModel.enrolled_at.desc(), EnrollmentModel.id.desc())
            .offset((page - 1) * size)
            .limit(size)
        )
        rows = (await self.db_session.execute(statement)).all()

        items = [
            StudentCourseView(
                enrollment=EnrollmentView.model_validate(enrollment),
                course=CourseView.model_validate(course),
                progress_percent=await self._course_progress_percent(
                    enrollment_id=enrollment.id,
                    course_id=course.id,
                ),
            )
            for enrollment, course in rows
        ]
        return StudentCourseListResponse(
            data=items,
            pagination=PaginationView(page=page, size=size, total=total or 0),
        )

    async def get_course_study(
        self,
        student_id: int,
        slug: str,
    ) -> CourseStudyResponse:
        enrollment_row = (
            await self.db_session.execute(
                select(EnrollmentModel, CourseModel)
                .join(CourseModel, CourseModel.id == EnrollmentModel.course_id)
                .where(
                    EnrollmentModel.student_id == student_id,
                    CourseModel.slug == slug,
                    CourseModel.deleted_at.is_(None),
                )
            )
        ).one_or_none()
        if enrollment_row is None:
            raise HTTPException(status_code=404, detail="Course enrollment not found")
        enrollment, course = enrollment_row

        sections = list(
            (
                await self.db_session.scalars(
                    select(SectionModel)
                    .where(SectionModel.course_id == course.id)
                    .order_by(SectionModel.position, SectionModel.id)
                )
            ).all()
        )
        lessons = await self._load_lessons(sections)
        contents = await self._load_lesson_contents(lessons)
        completed_ids = await self._load_completed_content_ids(enrollment.id)
        reading_by_id, quiz_by_id, problem_by_id = await self._load_content_records(
            contents
        )

        lessons_by_section: dict[int, list[LessonModel]] = defaultdict(list)
        for lesson in lessons:
            lessons_by_section[lesson.section_id].append(lesson)
        contents_by_lesson: dict[int, list[LessonContentModel]] = defaultdict(list)
        for content in contents:
            contents_by_lesson[content.lesson_id].append(content)

        previous_lesson_completed = True
        section_views: list[SectionStudyView] = []
        for section in sections:
            lesson_views: list[LessonStudyView] = []
            for lesson in lessons_by_section[section.id]:
                lesson_contents = contents_by_lesson[lesson.id]
                lesson_locked = not previous_lesson_completed
                content_views = [
                    self._content_view(
                        content=content,
                        completed=content.id in completed_ids,
                        locked=lesson_locked,
                        reading_by_id=reading_by_id,
                        quiz_by_id=quiz_by_id,
                        problem_by_id=problem_by_id,
                    )
                    for content in lesson_contents
                ]
                lesson_completed = all(item.completed for item in content_views)
                lesson_views.append(
                    LessonStudyView(
                        id=lesson.id,
                        section_id=lesson.section_id,
                        title=lesson.title,
                        summary=lesson.summary,
                        score=Decimal(str(lesson.score or 0)),
                        position=lesson.position,
                        created_at=lesson.created_at,
                        updated_at=lesson.updated_at,
                        completed=lesson_completed,
                        locked=lesson_locked,
                        contents=content_views,
                    )
                )
                previous_lesson_completed = (
                    previous_lesson_completed and lesson_completed
                )
            section_views.append(
                SectionStudyView(
                    id=section.id,
                    course_id=section.course_id,
                    title=section.title,
                    position=section.position,
                    lessons=lesson_views,
                )
            )

        course_view = CourseView.model_validate(course)
        return CourseStudyResponse(
            data=CourseStudyView(
                **course_view.model_dump(),
                progress_percent=await self._course_progress_percent(
                    enrollment_id=enrollment.id,
                    course_id=course.id,
                ),
                sections=section_views,
            )
        )

    async def complete_reading(
        self,
        student_id: int,
        lesson_content_id: int,
    ) -> CompleteReadingResponse:
        row = (
            await self.db_session.execute(
                select(
                    EnrollmentModel,
                    LessonContentModel,
                    LessonModel,
                    SectionModel,
                )
                .join(SectionModel, SectionModel.course_id == EnrollmentModel.course_id)
                .join(LessonModel, LessonModel.section_id == SectionModel.id)
                .join(
                    LessonContentModel,
                    LessonContentModel.lesson_id == LessonModel.id,
                )
                .join(CourseModel, CourseModel.id == EnrollmentModel.course_id)
                .where(
                    EnrollmentModel.student_id == student_id,
                    LessonContentModel.id == lesson_content_id,
                    CourseModel.deleted_at.is_(None),
                )
            )
        ).one_or_none()
        if row is None:
            raise HTTPException(status_code=404, detail="Lesson content not found")
        enrollment, lesson_content, lesson, section = row
        if lesson_content.content_type != LessonContentType.READING:
            raise HTTPException(
                status_code=400,
                detail="Only reading content can be completed directly",
            )
        if await self._lesson_is_locked(
            enrollment_id=enrollment.id,
            course_id=enrollment.course_id,
            section_position=section.position,
            lesson_position=lesson.position,
        ):
            raise HTTPException(status_code=409, detail="Lesson is locked")

        progress = await self.db_session.scalar(
            select(LessonContentProgressModel)
            .where(
                LessonContentProgressModel.enrollment_id == enrollment.id,
                LessonContentProgressModel.lesson_content_id == lesson_content.id,
            )
            .with_for_update()
        )
        if progress is None:
            progress = LessonContentProgressModel(
                enrollment_id=enrollment.id,
                lesson_content_id=lesson_content.id,
                completed=True,
                completed_at=utc_now(),
            )
            self.db_session.add(progress)
        elif not progress.completed:
            progress.completed = True
            progress.completed_at = utc_now()

        try:
            await self.db_session.commit()
        except IntegrityError:
            await self.db_session.rollback()
            progress = await self.db_session.scalar(
                select(LessonContentProgressModel).where(
                    LessonContentProgressModel.enrollment_id == enrollment.id,
                    LessonContentProgressModel.lesson_content_id == lesson_content.id,
                )
            )
            if progress is None:
                raise

        return CompleteReadingResponse(
            data=LessonContentProgressView.model_validate(progress),
            course_progress_percent=await self._course_progress_percent(
                enrollment_id=enrollment.id,
                course_id=enrollment.course_id,
            ),
            message="Reading content completed",
        )

    async def list_progress(
        self,
        student_id: int,
        course_id: int | None,
        page: int,
        size: int,
    ) -> ProgressListResponse:
        statement = self._progress_statement(student_id, course_id)
        total = await self.db_session.scalar(
            select(func.count()).select_from(statement.order_by(None).subquery())
        )
        progresses = list(
            (
                await self.db_session.scalars(
                    statement
                    .order_by(LessonContentProgressModel.id)
                    .offset((page - 1) * size)
                    .limit(size)
                )
            ).all()
        )
        return ProgressListResponse(
            data=[
                LessonContentProgressView.model_validate(progress)
                for progress in progresses
            ],
            pagination=PaginationView(page=page, size=size, total=total or 0),
        )

    @staticmethod
    def _progress_statement(
        student_id: int,
        course_id: int | None,
    ) -> Select[tuple[LessonContentProgressModel]]:
        statement = (
            select(LessonContentProgressModel)
            .join(
                EnrollmentModel,
                EnrollmentModel.id == LessonContentProgressModel.enrollment_id,
            )
            .join(
                LessonContentModel,
                LessonContentModel.id
                == LessonContentProgressModel.lesson_content_id,
            )
            .join(LessonModel, LessonModel.id == LessonContentModel.lesson_id)
            .join(SectionModel, SectionModel.id == LessonModel.section_id)
            .join(CourseModel, CourseModel.id == EnrollmentModel.course_id)
            .where(
                EnrollmentModel.student_id == student_id,
                SectionModel.course_id == EnrollmentModel.course_id,
                CourseModel.deleted_at.is_(None),
            )
        )
        if course_id is not None:
            statement = statement.where(EnrollmentModel.course_id == course_id)
        return statement

    async def _course_progress_percent(
        self,
        enrollment_id: int,
        course_id: int,
    ) -> float:
        total = await self.db_session.scalar(
            select(func.count(LessonContentModel.id))
            .join(LessonModel, LessonModel.id == LessonContentModel.lesson_id)
            .join(SectionModel, SectionModel.id == LessonModel.section_id)
            .where(SectionModel.course_id == course_id)
        )
        if not total:
            return 0.0
        completed = await self.db_session.scalar(
            select(func.count(LessonContentProgressModel.id))
            .join(
                LessonContentModel,
                LessonContentModel.id
                == LessonContentProgressModel.lesson_content_id,
            )
            .join(LessonModel, LessonModel.id == LessonContentModel.lesson_id)
            .join(SectionModel, SectionModel.id == LessonModel.section_id)
            .where(
                LessonContentProgressModel.enrollment_id == enrollment_id,
                LessonContentProgressModel.completed.is_(True),
                SectionModel.course_id == course_id,
            )
        )
        return round((completed or 0) * 100 / total, 2)

    async def _lesson_is_locked(
        self,
        enrollment_id: int,
        course_id: int,
        section_position: int,
        lesson_position: int,
    ) -> bool:
        prior_lesson_order = or_(
            SectionModel.position < section_position,
            and_(
                SectionModel.position == section_position,
                LessonModel.position < lesson_position,
            ),
        )
        incomplete_content_id = await self.db_session.scalar(
            select(LessonContentModel.id)
            .join(LessonModel, LessonModel.id == LessonContentModel.lesson_id)
            .join(SectionModel, SectionModel.id == LessonModel.section_id)
            .outerjoin(
                LessonContentProgressModel,
                and_(
                    LessonContentProgressModel.lesson_content_id
                    == LessonContentModel.id,
                    LessonContentProgressModel.enrollment_id == enrollment_id,
                    LessonContentProgressModel.completed.is_(True),
                ),
            )
            .where(
                SectionModel.course_id == course_id,
                prior_lesson_order,
                LessonContentProgressModel.id.is_(None),
            )
            .limit(1)
        )
        return incomplete_content_id is not None

    async def _load_lessons(
        self,
        sections: Sequence[SectionModel],
    ) -> list[LessonModel]:
        section_ids = [section.id for section in sections]
        if not section_ids:
            return []
        return list(
            (
                await self.db_session.scalars(
                    select(LessonModel)
                    .where(LessonModel.section_id.in_(section_ids))
                    .order_by(
                        LessonModel.section_id,
                        LessonModel.position,
                        LessonModel.id,
                    )
                )
            ).all()
        )

    async def _load_lesson_contents(
        self,
        lessons: Sequence[LessonModel],
    ) -> list[LessonContentModel]:
        lesson_ids = [lesson.id for lesson in lessons]
        if not lesson_ids:
            return []
        return list(
            (
                await self.db_session.scalars(
                    select(LessonContentModel)
                    .where(LessonContentModel.lesson_id.in_(lesson_ids))
                    .order_by(
                        LessonContentModel.lesson_id,
                        LessonContentModel.position,
                        LessonContentModel.id,
                    )
                )
            ).all()
        )

    async def _load_completed_content_ids(self, enrollment_id: int) -> set[int]:
        return set(
            (
                await self.db_session.scalars(
                    select(LessonContentProgressModel.lesson_content_id).where(
                        LessonContentProgressModel.enrollment_id == enrollment_id,
                        LessonContentProgressModel.completed.is_(True),
                    )
                )
            ).all()
        )

    async def _load_content_records(
        self,
        contents: Sequence[LessonContentModel],
    ) -> tuple[
        dict[int, ReadingContentModel],
        dict[int, QuizModel],
        dict[int, ProblemModel],
    ]:
        ids: dict[LessonContentType, list[int]] = defaultdict(list)
        for content in contents:
            ids[content.content_type].append(content.content_id)

        readings = await self._records_by_id(
            ReadingContentModel,
            ids[LessonContentType.READING],
        )
        quizzes = await self._records_by_id(
            QuizModel,
            ids[LessonContentType.QUIZ],
        )
        problems = await self._records_by_id(
            ProblemModel,
            ids[LessonContentType.PROBLEM],
        )
        return readings, quizzes, problems

    async def _records_by_id(
        self,
        model: type[ModelT],
        ids: list[int],
    ) -> dict[int, ModelT]:
        if not ids:
            return {}
        model_id = getattr(model, "id")
        records = (
            await self.db_session.scalars(select(model).where(model_id.in_(ids)))
        ).all()
        return {int(getattr(record, "id")): record for record in records}

    @staticmethod
    def _content_view(
        content: LessonContentModel,
        completed: bool,
        locked: bool,
        reading_by_id: dict[int, ReadingContentModel],
        quiz_by_id: dict[int, QuizModel],
        problem_by_id: dict[int, ProblemModel],
    ) -> LessonContentStudyView:
        reading = reading_by_id.get(content.content_id)
        quiz = quiz_by_id.get(content.content_id)
        problem = problem_by_id.get(content.content_id)
        expected_record = {
            LessonContentType.READING: reading,
            LessonContentType.QUIZ: quiz,
            LessonContentType.PROBLEM: problem,
        }[content.content_type]
        if expected_record is None:
            raise HTTPException(status_code=409, detail="Invalid lesson content binding")
        return LessonContentStudyView(
            id=content.id,
            lesson_id=content.lesson_id,
            content_type=content.content_type,
            content_id=content.content_id,
            media_url=content.media_url,
            position=content.position,
            created_at=content.created_at,
            completed=completed,
            locked=locked,
            reading=(
                ReadingContentView.model_validate(reading)
                if content.content_type == LessonContentType.READING and not locked
                else None
            ),
            quiz=(
                QuizContentView.model_validate(quiz)
                if content.content_type == LessonContentType.QUIZ and not locked
                else None
            ),
            problem=(
                ProblemContentView.model_validate(problem)
                if content.content_type == LessonContentType.PROBLEM and not locked
                else None
            ),
        )
