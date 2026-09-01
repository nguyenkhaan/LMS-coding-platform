from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.models.base_model import CourseStatus, LessonContentType
from src.models.comment_model import CommentModel
from src.models.course_model import CourseModel
from src.models.lesson_content_model import LessonContentModel
from src.models.lesson_content_progress_model import LessonContentProgressModel
from src.models.lesson_model import LessonModel
from src.models.problem_model import ProblemModel
from src.models.quiz_model import QuizModel
from src.models.reading_content_model import ReadingContentModel
from src.models.section_model import SectionModel
from src.modules.teacher.teacher_curriculum.teacher_curriculum_dto import (
    CurriculumItemType,
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


class TeacherService:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def _swap_positions(
        self,
        item: SectionModel | LessonModel | LessonContentModel,
        replacement: SectionModel | LessonModel | LessonContentModel,
        target_position: int,
    ) -> None:
        """Swap two sibling positions without violating their unique constraint."""
        current_position = item.position

        # All client-facing positions are non-negative. A negative primary key is
        # therefore a unique temporary position; this is also the strategy used
        # by reorder_curriculum below.
        item.position = -item.id
        await self.db_session.flush()

        replacement.position = current_position
        await self.db_session.flush()

        item.position = target_position

    async def _ensure_content_is_not_already_bound(
        self,
        lesson_id: int,
        content_type: LessonContentType,
        content_id: int,
        excluded_lesson_content_id: int | None = None,
    ) -> None:
        """Reject duplicate content bindings before the database constraint does."""
        stmt = select(LessonContentModel.id).where(
            LessonContentModel.lesson_id == lesson_id,
            LessonContentModel.content_type == content_type,
            LessonContentModel.content_id == content_id,
        )
        if excluded_lesson_content_id is not None:
            stmt = stmt.where(LessonContentModel.id != excluded_lesson_content_id)

        duplicate_id = await self.db_session.scalar(stmt)
        if duplicate_id is not None:
            raise HTTPException(
                status_code=409,
                detail="This content is already bound to the lesson",
            )

    async def _ensure_course_bound_content(
        self,
        course_id: int,
        content_type: LessonContentType,
        content_id: int,
    ) -> None:
        """Allow a Quiz/Reading to be reused only inside its owning course."""
        course_ids = set(
            (await self.db_session.scalars(
                select(SectionModel.course_id)
                .select_from(LessonContentModel)
                .join(LessonModel, LessonModel.id == LessonContentModel.lesson_id)
                .join(SectionModel, SectionModel.id == LessonModel.section_id)
                .where(
                    LessonContentModel.content_type == content_type,
                    LessonContentModel.content_id == content_id,
                )
                .distinct()
            )).all()
        )
        if not course_ids:
            raise HTTPException(
                status_code=409,
                detail="Content must be associated with a course before it can be reused",
            )
        if course_ids != {course_id}:
            raise HTTPException(status_code=409, detail="Content belongs to another course")

    async def _validate_content_for_course(
        self,
        content_type: LessonContentType,
        content_id: int,
        teacher_id: int,
        course_id: int,
    ) -> None:
        if content_type == LessonContentType.PROBLEM:
            problem = await self.db_session.scalar(
                select(ProblemModel).where(
                    ProblemModel.id == content_id,
                    ProblemModel.teacher_id == teacher_id,
                )
            )
            if problem is None:
                raise HTTPException(status_code=404, detail="Problem not found")
            return

        if content_type == LessonContentType.QUIZ:
            quiz = await self.db_session.scalar(
                select(QuizModel).where(QuizModel.id == content_id)
            )
            if quiz is None:
                raise HTTPException(status_code=404, detail="Quiz not found")
        elif content_type == LessonContentType.READING:
            reading = await self.db_session.scalar(
                select(ReadingContentModel).where(ReadingContentModel.id == content_id)
            )
            if reading is None:
                raise HTTPException(status_code=404, detail="Reading not found")
        else:
            raise HTTPException(status_code=400, detail="Unsupported lesson content type")

        await self._ensure_course_bound_content(course_id, content_type, content_id)

    async def create_course_section(self, course_id: int, teacher_id: int, data: SectionWriteRequest) -> SectionView:
        try:
            owned_course_id = await self.db_session.scalar(
                select(CourseModel.id).where(
                    CourseModel.id == course_id,
                    CourseModel.teacher_id == teacher_id,
                    CourseModel.status.in_([CourseStatus.DRAFT, CourseStatus.REJECTED]),
                    CourseModel.deleted_at.is_(None),
                ).with_for_update()
            )
            if owned_course_id is None:
                raise HTTPException(status_code=404, detail="Course not found")

            max_position = await self.db_session.scalar(
                select(func.coalesce(func.max(SectionModel.position), -1)).where(
                    SectionModel.course_id == owned_course_id,
                )
            )
            next_position: int = int(max_position) + 1 if max_position is not None else 0

            new_section = SectionModel(
                course_id = course_id,
                title = data.title,
                position = next_position,
            )
            self.db_session.add(new_section)

            await self.db_session.flush()
            await self.db_session.commit()
            await self.db_session.refresh(new_section)

            return SectionView(
                id = new_section.id,
                course_id = course_id,
                title = data.title,
                position = new_section.position,
            )
        except Exception as e:
            await self.db_session.rollback()
            raise

    async def update_course_section(self, section_id: int, teacher_id: int, data: SectionUpdateRequest) -> SectionView:
        try:
            stmt = select(SectionModel).join(
                CourseModel,
                CourseModel.id == SectionModel.course_id
            ).options(
                selectinload(SectionModel.course).selectinload(CourseModel.sections)
            ).where(
                CourseModel.teacher_id == teacher_id,
                SectionModel.id == section_id,
                CourseModel.status.in_([CourseStatus.DRAFT, CourseStatus.REJECTED]),
                CourseModel.deleted_at.is_(None),
            ).with_for_update(of=CourseModel)
            result = (await self.db_session.execute(stmt)).scalar_one_or_none()
            if result is None:
                raise HTTPException(
                    status_code = 404,
                    detail = "Course not found"
                )
            if data.title is not None:
                result.title = data.title
            if data.position is not None:
                sections = result.course.sections
                replaced = next(
                    (section for section in sections if section.position == data.position),
                    None,
                )
                if replaced is None:
                    result.position = data.position
                elif replaced.id != result.id:
                    await self._swap_positions(result, replaced, data.position)
            await self.db_session.flush()
            await self.db_session.commit()
            await self.db_session.refresh(result)
            return SectionView(
                id = result.id,
                title = result.title,
                position = result.position,
                course_id = result.course_id
            )
        except Exception as e:
            await self.db_session.rollback()
            raise

    async def delete_course_section(self, section_id: int, teacher_id: int) -> MessageResponse:
        try:
            stmt = select(SectionModel).join(
                CourseModel,
                CourseModel.id == SectionModel.course_id,
            ).where(
                SectionModel.id == section_id,
                CourseModel.teacher_id == teacher_id,
                CourseModel.status.in_([CourseStatus.DRAFT, CourseStatus.REJECTED]),
                CourseModel.deleted_at.is_(None),
            ).with_for_update(of=CourseModel)
            section = (await self.db_session.execute(stmt)).scalar()
            if section is None:
                raise HTTPException(status_code=404, detail="Section not found")

            lesson_id = await self.db_session.scalar(
                select(LessonModel.id).where(LessonModel.section_id == section.id).limit(1)
            )
            if lesson_id is not None:
                raise HTTPException(
                    status_code=409,
                    detail="Cannot delete a section that still contains lessons",
                )

            await self.db_session.delete(section)
            await self.db_session.commit()
            return MessageResponse(message="Section deleted")
        except Exception as e:
            await self.db_session.rollback()
            raise e

    async def create_lesson(self, section_id: int, teacher_id: int, data: LessonWriteRequest) -> LessonView:
        try:
            stmt = select(SectionModel).join(
                CourseModel,
                CourseModel.id == SectionModel.course_id,
            ).where(
                SectionModel.id == section_id,
                CourseModel.teacher_id == teacher_id,
                CourseModel.status.in_([CourseStatus.DRAFT, CourseStatus.REJECTED]),
                CourseModel.deleted_at.is_(None),
            ).with_for_update(of=CourseModel)
            section = (await self.db_session.execute(stmt)).scalar()
            if section is None:
                raise HTTPException(status_code=404, detail="Section not found")

            max_position = await self.db_session.scalar(
                select(func.coalesce(func.max(LessonModel.position), -1)).where(
                    LessonModel.section_id == section.id,
                )
            )
            next_position: int = int(max_position) + 1 if max_position is not None else 0

            lesson = LessonModel(
                section_id=section.id,
                title=data.title,
                summary=data.summary,
                score=data.score,
                position=next_position,
            )
            self.db_session.add(lesson)
            await self.db_session.flush()
            await self.db_session.commit()
            await self.db_session.refresh(lesson)
            return LessonView.model_validate(lesson)
        except Exception as e:
            await self.db_session.rollback()
            raise e

    async def update_lesson(self, lesson_id: int, teacher_id: int, data: LessonUpdateRequest) -> LessonView:
        try:
            stmt = select(LessonModel).join(
                SectionModel,
                SectionModel.id == LessonModel.section_id,
            ).join(
                CourseModel,
                CourseModel.id == SectionModel.course_id,
            ).where(
                LessonModel.id == lesson_id,
                CourseModel.teacher_id == teacher_id,
                CourseModel.status.in_([CourseStatus.DRAFT, CourseStatus.REJECTED]),
                CourseModel.deleted_at.is_(None),
            ).with_for_update(of=CourseModel)
            lesson = (await self.db_session.execute(stmt)).scalar()
            if lesson is None:
                raise HTTPException(status_code=404, detail="Lesson not found")

            if data.position is not None and data.position != lesson.position:
                replaced = await self.db_session.scalar(
                    select(LessonModel).where(
                        LessonModel.section_id == lesson.section_id,
                        LessonModel.position == data.position,
                        LessonModel.id != lesson.id,
                    )
                )
                if replaced is None:
                    lesson.position = data.position
                else:
                    await self._swap_positions(lesson, replaced, data.position)
            if data.title is not None:
                lesson.title = data.title
            if data.summary is not None:
                lesson.summary = data.summary
            if data.score is not None:
                lesson.score = data.score

            await self.db_session.flush()
            await self.db_session.commit()
            await self.db_session.refresh(lesson)
            return LessonView.model_validate(lesson)
        except Exception as e:
            await self.db_session.rollback()
            raise e

    async def delete_lesson(self, lesson_id: int, teacher_id: int) -> MessageResponse:
        try:
            stmt = select(LessonModel).join(
                SectionModel,
                SectionModel.id == LessonModel.section_id,
            ).join(
                CourseModel,
                CourseModel.id == SectionModel.course_id,
            ).where(
                LessonModel.id == lesson_id,
                CourseModel.teacher_id == teacher_id,
                CourseModel.status.in_([CourseStatus.DRAFT, CourseStatus.REJECTED]),
                CourseModel.deleted_at.is_(None),
            ).with_for_update(of=CourseModel)
            lesson = (await self.db_session.execute(stmt)).scalar()
            if lesson is None:
                raise HTTPException(status_code=404, detail="Lesson not found")

            lesson_content_id = await self.db_session.scalar(
                select(LessonContentModel.id)
                .where(LessonContentModel.lesson_id == lesson.id)
                .limit(1)
            )
            if lesson_content_id is not None:
                raise HTTPException(
                    status_code=409,
                    detail="Cannot delete a lesson that still contains lesson content",
                )

            await self.db_session.delete(lesson)
            await self.db_session.commit()
            return MessageResponse(message="Lesson deleted")
        except Exception as e:
            await self.db_session.rollback()
            raise e

    async def create_reading_content(self, lesson_id: int, teacher_id: int, data: ReadingContentCreateRequest) -> ReadingContentCreateResponse:
        try:
            stmt = select(LessonModel).join(
                SectionModel,
                SectionModel.id == LessonModel.section_id,
            ).join(
                CourseModel,
                CourseModel.id == SectionModel.course_id,
            ).where(
                LessonModel.id == lesson_id,
                CourseModel.teacher_id == teacher_id,
                CourseModel.status.in_([CourseStatus.DRAFT, CourseStatus.REJECTED]),
                CourseModel.deleted_at.is_(None),
            ).with_for_update(of=CourseModel)
            lesson = (await self.db_session.execute(stmt)).scalar()
            if lesson is None:
                raise HTTPException(status_code=404, detail="Lesson not found")

            max_position = await self.db_session.scalar(
                select(func.coalesce(func.max(LessonContentModel.position), -1)).where(
                    LessonContentModel.lesson_id == lesson.id,
                )
            )
            next_position: int = int(max_position) + 1 if max_position is not None else 0

            reading = ReadingContentModel(title=data.title, content=data.content)
            self.db_session.add(reading)
            await self.db_session.flush()

            lesson_content = LessonContentModel(
                lesson_id=lesson.id,
                content_type=LessonContentType.READING,
                content_id=reading.id,
                position=next_position,
            )
            self.db_session.add(lesson_content)
            await self.db_session.flush()
            await self.db_session.commit()
            await self.db_session.refresh(reading)
            await self.db_session.refresh(lesson_content)
            return ReadingContentCreateResponse(
                reading=ReadingContentView.model_validate(reading),
                lesson_content=LessonContentView.model_validate(lesson_content),
            )
        except Exception as e:
            await self.db_session.rollback()
            raise e

    async def update_reading_content(self, lesson_content_id: int, teacher_id: int, data: ReadingContentUpdateRequest) -> ReadingContentView:
        try:
            stmt = select(LessonContentModel).join(
                LessonModel,
                LessonModel.id == LessonContentModel.lesson_id,
            ).join(
                SectionModel,
                SectionModel.id == LessonModel.section_id,
            ).join(
                CourseModel,
                CourseModel.id == SectionModel.course_id,
            ).where(
                LessonContentModel.id == lesson_content_id,
                LessonContentModel.content_type == LessonContentType.READING,
                CourseModel.teacher_id == teacher_id,
                CourseModel.status.in_([CourseStatus.DRAFT, CourseStatus.REJECTED]),
                CourseModel.deleted_at.is_(None),
            ).with_for_update(of=CourseModel)
            lesson_content = (await self.db_session.execute(stmt)).scalar()
            if lesson_content is None:
                raise HTTPException(status_code=404, detail="Reading lesson content not found")

            reading = await self.db_session.scalar(
                select(ReadingContentModel).where(
                    ReadingContentModel.id == lesson_content.content_id
                )
            )
            if reading is None:
                raise HTTPException(status_code=409, detail="Reading content not found")
            if data.title is not None:
                reading.title = data.title
            if data.content is not None:
                reading.content = data.content

            await self.db_session.flush()
            await self.db_session.commit()
            await self.db_session.refresh(reading)
            return ReadingContentView.model_validate(reading)
        except Exception as e:
            await self.db_session.rollback()
            raise e

    async def bind_lesson_content(self, lesson_id: int, teacher_id: int, data: LessonContentBindRequest) -> LessonContentView:
        try:
            stmt = select(LessonModel, CourseModel).join(
                SectionModel,
                SectionModel.id == LessonModel.section_id,
            ).join(
                CourseModel,
                CourseModel.id == SectionModel.course_id,
            ).where(
                LessonModel.id == lesson_id,
                CourseModel.teacher_id == teacher_id,
                CourseModel.status.in_([CourseStatus.DRAFT, CourseStatus.REJECTED]),
                CourseModel.deleted_at.is_(None),
            ).with_for_update(of=CourseModel)
            row = (await self.db_session.execute(stmt)).one_or_none()
            if row is None:
                raise HTTPException(status_code=404, detail="Lesson not found")
            lesson, course = row

            max_position = await self.db_session.scalar(
                select(func.coalesce(func.max(LessonContentModel.position), -1)).where(
                    LessonContentModel.lesson_id == lesson.id,
                )
            )
            next_position: int = int(max_position) + 1 if max_position is not None else 0

            await self._validate_content_for_course(
                data.content_type,
                data.content_id,
                teacher_id,
                course.id,
            )

            await self._ensure_content_is_not_already_bound(
                lesson.id,
                data.content_type,
                data.content_id,
            )

            lesson_content = LessonContentModel(
                lesson_id=lesson.id,
                content_type=data.content_type,
                content_id=data.content_id,
                media_url=data.media_url,
                position=next_position,
            )
            self.db_session.add(lesson_content)
            await self.db_session.flush()
            await self.db_session.commit()
            await self.db_session.refresh(lesson_content)
            return LessonContentView.model_validate(lesson_content)
        except IntegrityError as e:
            await self.db_session.rollback()
            raise HTTPException(
                status_code=409,
                detail="Lesson content conflicts with an existing item",
            ) from e
        except Exception as e:
            await self.db_session.rollback()
            raise

    async def update_lesson_content(self, lesson_content_id: int, teacher_id: int, data: LessonContentUpdateRequest) -> LessonContentView:
        try:
            stmt = select(LessonContentModel, CourseModel).join(
                LessonModel,
                LessonModel.id == LessonContentModel.lesson_id,
            ).join(
                SectionModel,
                SectionModel.id == LessonModel.section_id,
            ).join(
                CourseModel,
                CourseModel.id == SectionModel.course_id,
            ).where(
                LessonContentModel.id == lesson_content_id,
                CourseModel.teacher_id == teacher_id,
                CourseModel.status.in_([CourseStatus.DRAFT, CourseStatus.REJECTED]),
                CourseModel.deleted_at.is_(None),
            ).with_for_update(of=CourseModel)
            row = (await self.db_session.execute(stmt)).one_or_none()
            if row is None:
                raise HTTPException(status_code=404, detail="Lesson content not found")
            lesson_content, course = row

            if data.position is not None and data.position != lesson_content.position:
                replaced = await self.db_session.scalar(
                    select(LessonContentModel).where(
                        LessonContentModel.lesson_id == lesson_content.lesson_id,
                        LessonContentModel.position == data.position,
                        LessonContentModel.id != lesson_content.id,
                    )
                )
                if replaced is None:
                    lesson_content.position = data.position
                else:
                    await self._swap_positions(lesson_content, replaced, data.position)

            if data.content_id is not None and data.content_id != lesson_content.content_id:
                await self._ensure_content_is_not_already_bound(
                    lesson_content.lesson_id,
                    lesson_content.content_type,
                    data.content_id,
                    excluded_lesson_content_id=lesson_content.id,
                )
                await self._validate_content_for_course(
                    lesson_content.content_type,
                    data.content_id,
                    teacher_id,
                    course.id,
                )
                lesson_content.content_id = data.content_id

            if data.media_url is not None:
                lesson_content.media_url = data.media_url
            await self.db_session.flush()
            await self.db_session.commit()
            await self.db_session.refresh(lesson_content)
            return LessonContentView.model_validate(lesson_content)
        except IntegrityError as e:
            await self.db_session.rollback()
            raise HTTPException(
                status_code=409,
                detail="Lesson content conflicts with an existing item",
            ) from e
        except Exception as e:
            await self.db_session.rollback()
            raise

    async def delete_lesson_content(self, lesson_content_id: int, teacher_id: int) -> MessageResponse:
        try:
            stmt = select(LessonContentModel).join(
                LessonModel,
                LessonModel.id == LessonContentModel.lesson_id,
            ).join(
                SectionModel,
                SectionModel.id == LessonModel.section_id,
            ).join(
                CourseModel,
                CourseModel.id == SectionModel.course_id,
            ).where(
                LessonContentModel.id == lesson_content_id,
                CourseModel.teacher_id == teacher_id,
                CourseModel.status.in_([CourseStatus.DRAFT, CourseStatus.REJECTED]),
                CourseModel.deleted_at.is_(None),
            ).with_for_update(of=CourseModel)
            lesson_content = (await self.db_session.execute(stmt)).scalar()
            if lesson_content is None:
                raise HTTPException(status_code=404, detail="Lesson content not found")

            comment_id = await self.db_session.scalar(
                select(CommentModel.id)
                .where(CommentModel.lesson_content_id == lesson_content.id)
                .limit(1)
            )
            if comment_id is not None:
                raise HTTPException(
                    status_code=409,
                    detail="Cannot delete lesson content that has comments",
                )

            progress_id = await self.db_session.scalar(
                select(LessonContentProgressModel.id)
                .where(LessonContentProgressModel.lesson_content_id == lesson_content.id)
                .limit(1)
            )
            if progress_id is not None:
                raise HTTPException(
                    status_code=409,
                    detail="Cannot delete lesson content that has student progress",
                )

            await self.db_session.delete(lesson_content)
            await self.db_session.commit()
            return MessageResponse(message="Lesson content deleted")
        except IntegrityError as e:
            await self.db_session.rollback()
            raise HTTPException(
                status_code=409,
                detail="Lesson content cannot be deleted while it has student progress",
            ) from e
        except Exception as e:
            await self.db_session.rollback()
            raise e

    async def reorder_curriculum(self, course_id: int, teacher_id: int, data: CurriculumReorderRequest) -> CurriculumReorderResponse:
        try:
            course = await self.db_session.scalar(
                select(CourseModel).where(
                    CourseModel.id == course_id,
                    CourseModel.teacher_id == teacher_id,
                    CourseModel.status.in_([CourseStatus.DRAFT, CourseStatus.REJECTED]),
                    CourseModel.deleted_at.is_(None),
                ).with_for_update()
            )
            if course is None:
                raise HTTPException(status_code=404, detail="Course not found")

            sections = list((await self.db_session.scalars(
                select(SectionModel).where(SectionModel.course_id == course.id)
            )).all())
            lessons = list((await self.db_session.scalars(
                select(LessonModel)
                .join(SectionModel, SectionModel.id == LessonModel.section_id)
                .where(SectionModel.course_id == course.id)
            )).all())
            lesson_contents = list((await self.db_session.scalars(
                select(LessonContentModel)
                .join(LessonModel, LessonModel.id == LessonContentModel.lesson_id)
                .join(SectionModel, SectionModel.id == LessonModel.section_id)
                .where(SectionModel.course_id == course.id)
            )).all())

            sections_by_id = {section.id: section for section in sections}
            lessons_by_id = {lesson.id: lesson for lesson in lessons}
            lesson_contents_by_id = {content.id: content for content in lesson_contents}
            section_positions = {section.id: section.position for section in sections}
            lesson_targets = {lesson.id: (lesson.section_id, lesson.position) for lesson in lessons}
            content_targets = {content.id: (content.lesson_id, content.position) for content in lesson_contents}
            reordered_section_ids: set[int] = set()
            reordered_lesson_ids: set[int] = set()
            reordered_content_ids: set[int] = set()

            for item in data.items:
                if item.item_type == CurriculumItemType.SECTION:
                    if item.parent_id is not None or item.id not in sections_by_id or item.id in reordered_section_ids:
                        raise HTTPException(status_code=400, detail="Invalid section reorder item")
                    section_positions[item.id] = item.position
                    reordered_section_ids.add(item.id)
                elif item.item_type == CurriculumItemType.LESSON:
                    lesson = lessons_by_id.get(item.id)
                    parent_section_id = item.parent_id if item.parent_id is not None else lesson.section_id if lesson else None
                    if lesson is None or parent_section_id not in sections_by_id or item.id in reordered_lesson_ids:
                        raise HTTPException(status_code=400, detail="Invalid lesson reorder item")
                    lesson_targets[item.id] = (parent_section_id, item.position)
                    reordered_lesson_ids.add(item.id)
                else:
                    lesson_content = lesson_contents_by_id.get(item.id)
                    parent_lesson_id = item.parent_id if item.parent_id is not None else lesson_content.lesson_id if lesson_content else None
                    if lesson_content is None or parent_lesson_id not in lessons_by_id or item.id in reordered_content_ids:
                        raise HTTPException(status_code=400, detail="Invalid lesson content reorder item")
                    content_targets[item.id] = (parent_lesson_id, item.position)
                    reordered_content_ids.add(item.id)

            if len(section_positions.values()) != len(set(section_positions.values())):
                raise HTTPException(status_code=409, detail="Reorder would duplicate a section position")
            lesson_positions: dict[int, set[int]] = {}
            for parent_section_id, position in lesson_targets.values():
                if parent_section_id not in lesson_positions:
                    lesson_positions[parent_section_id] = set()
                if position in lesson_positions[parent_section_id]:
                    raise HTTPException(status_code=409, detail="Reorder would duplicate a lesson position")
                lesson_positions[parent_section_id].add(position)
            content_positions: dict[int, set[int]] = {}
            for parent_lesson_id, position in content_targets.values():
                if parent_lesson_id not in content_positions:
                    content_positions[parent_lesson_id] = set()
                if position in content_positions[parent_lesson_id]:
                    raise HTTPException(status_code=409, detail="Reorder would duplicate a lesson content position")
                content_positions[parent_lesson_id].add(position)

            for section_id in reordered_section_ids:
                sections_by_id[section_id].position = -section_id
            for lesson_id in reordered_lesson_ids:
                lessons_by_id[lesson_id].position = -lesson_id
            for content_id in reordered_content_ids:
                lesson_contents_by_id[content_id].position = -content_id
            await self.db_session.flush()

            for section_id in reordered_section_ids:
                sections_by_id[section_id].position = section_positions[section_id]
            for lesson_id in reordered_lesson_ids:
                lesson = lessons_by_id[lesson_id]
                lesson.section_id, lesson.position = lesson_targets[lesson_id]
            for content_id in reordered_content_ids:
                lesson_content = lesson_contents_by_id[content_id]
                lesson_content.lesson_id, lesson_content.position = content_targets[content_id]

            await self.db_session.flush()
            await self.db_session.commit()
            return CurriculumReorderResponse(
                sections=[SectionView.model_validate(section) for section in sorted(sections, key=lambda item: item.position)],
                lessons=[LessonView.model_validate(lesson) for lesson in sorted(lessons, key=lambda item: (item.section_id, item.position))],
                lesson_contents=[LessonContentView.model_validate(content) for content in sorted(lesson_contents, key=lambda item: (item.lesson_id, item.position))],
            )
        except IntegrityError as e:
            await self.db_session.rollback()
            raise HTTPException(
                status_code=409,
                detail="Reorder conflicts with the current curriculum",
            ) from e
        except Exception as e:
            await self.db_session.rollback()
            raise e
