import logging
logger = logging.getLogger(__name__)
from datetime import UTC

from fastapi import HTTPException
from sqlalchemy import func, select

from src.models.base_model import (
    CourseStatus,
    LessonContentType,
    ProblemSubmissionStatus,
)
from src.models.course_model import CourseModel
from src.models.lesson_content_model import LessonContentModel
from src.models.lesson_model import LessonModel
from src.models.reading_content_model import ReadingContentModel
from src.models.section_model import SectionModel
from src.models.submission_model import SubmissionModel
from src.modules.teacher_course.teacher_course_dto import (
    SubmissionListResponse,
    SubmissionView,
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

_courses: dict[int, dict[str, object]] = {}
_sections: dict[int, dict[str, object]] = {}
_readings: dict[int, dict[str, object]] = {}
_reading_id_counter = 1
_lessons: dict[int, dict[str, object]] = {}
_contents: dict[int, dict[str, object]] = {}
_course_id_counter = 1
_section_id_counter = 1
_lesson_id_counter = 1
_content_id_counter = 1

class TeacherCourseService:
    def __init__(self, db=None):
        self.db = db

    from pydantic import BaseModel
    def _partial_update(self, record: dict, data: BaseModel) -> dict:
        updates = data.model_dump(exclude_unset=True, exclude_none=True)
        record.update(updates)
        return record

    def _get_course_or_404(self, course_id: int, teacher_id: int) -> dict:
        course = _courses.get(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="COURSE_NOT_FOUND")
        if course["teacher_id"] != teacher_id:
            raise HTTPException(status_code=403, detail="FORBIDDEN")
        return course

    def _get_section_or_404(self, section_id: int, teacher_id: int) -> dict:
        section = _sections.get(section_id)
        if not section:
            raise HTTPException(status_code=404, detail="SECTION_NOT_FOUND")
        self._get_course_or_404(section["course_id"], teacher_id)
        return section

    def _get_lesson_or_404(self, lesson_id: int, teacher_id: int) -> dict:
        lesson = _lessons.get(lesson_id)
        if not lesson:
            raise HTTPException(status_code=404, detail="LESSON_NOT_FOUND")
        self._get_section_or_404(lesson["section_id"], teacher_id)
        return lesson

    def _get_content_or_404(self, content_id: int, teacher_id: int) -> dict:
        content = _contents.get(content_id)
        if not content:
            raise HTTPException(status_code=404, detail="CONTENT_NOT_FOUND")
        self._get_lesson_or_404(content["lesson_id"], teacher_id)
        return content

    async def get_teacher_courses(self, teacher_id: int) -> list[TeacherCourseResponse]:
        import json
        stmt = select(CourseModel).where(
            CourseModel.teacher_id == teacher_id,
            CourseModel.deleted_at.is_(None)
        ).order_by(CourseModel.created_at.desc())
        
        result = await self.db.execute(stmt)
        courses = result.scalars().all()
        
        return [
            TeacherCourseResponse(
                id=c.id,
                title=c.title,
                description=c.description,
                price=c.price,
                thumbnail_url=c.thumbnail_url,
                field=c.field,
                tags=json.loads(c.tags) if c.tags else [],
                status=c.status,
                teacher_id=c.teacher_id,
                created_at=c.created_at.isoformat() if c.created_at else None,
                updated_at=c.updated_at.isoformat() if c.updated_at else None,
                slug=c.slug,
                rating=0.0,
                currency="USD"
            ) for c in courses
        ]

    async def create_course(self, teacher_id: int, data: TeacherCourseCreateRequest) -> TeacherCourseResponse:
        import json
        import uuid
        tags_str = json.dumps(data.tags) if data.tags is not None else "[]"
        
        new_course = CourseModel(
            title=data.title,
            description=data.description,
            price=data.price,
            thumbnail_url=data.thumbnail_url,
            field=data.category,
            tags=tags_str,
            teacher_id=teacher_id,
            status=CourseStatus.DRAFT,
            slug=str(uuid.uuid4())
        )
        self.db.add(new_course)
        await self.db.flush()
        
        new_course.slug = f"course-{new_course.id}"
        await self.db.flush()
        
        await self.db.commit()
        await self.db.refresh(new_course)
        
        return TeacherCourseResponse(
            id=new_course.id,
            title=new_course.title,
            description=new_course.description,
            price=new_course.price,
            thumbnail_url=new_course.thumbnail_url,
            field=new_course.field,
            tags=json.loads(new_course.tags) if new_course.tags else [],
            status=new_course.status,
            teacher_id=new_course.teacher_id,
            created_at=new_course.created_at.isoformat() if new_course.created_at else None,
            updated_at=new_course.updated_at.isoformat() if new_course.updated_at else None,
            slug=new_course.slug,
            rating=0.0,
            currency="USD"
        )

    async def update_course(self, teacher_id: int, course_id: int, data: TeacherCourseUpdateRequest) -> TeacherCourseResponse:
        import json
        try:
            stmt = select(CourseModel).where(
                CourseModel.id == course_id,
                CourseModel.deleted_at.is_(None)
            ).with_for_update()
            
            db_course = (await self.db.execute(stmt)).scalar_one_or_none()
            if db_course is None:
                raise HTTPException(status_code=404, detail="COURSE_NOT_FOUND")
            if db_course.teacher_id != teacher_id:
                raise HTTPException(status_code=403, detail="FORBIDDEN")
            if db_course.status not in [CourseStatus.DRAFT, CourseStatus.REJECTED]:
                raise HTTPException(status_code=409, detail="INVALID_STATE")
            
            update_data = data.model_dump(exclude_unset=True)
            if "category" in update_data:
                db_course.field = update_data.pop("category")
            if "tags" in update_data:
                db_course.tags = json.dumps(update_data.pop("tags"))
                
            for key, value in update_data.items():
                if hasattr(db_course, key):
                    setattr(db_course, key, value)
            
            await self.db.commit()
            await self.db.refresh(db_course)
            
            return TeacherCourseResponse(
                id=db_course.id,
                title=db_course.title,
                description=db_course.description,
                price=db_course.price,
                thumbnail_url=db_course.thumbnail_url,
                field=db_course.field,
                tags=json.loads(db_course.tags) if db_course.tags else [],
                status=db_course.status,
                teacher_id=db_course.teacher_id,
                created_at=db_course.created_at.isoformat() if db_course.created_at else None,
                updated_at=db_course.updated_at.isoformat() if db_course.updated_at else None,
                slug=db_course.slug,
                rating=0.0,
                currency="USD"
            )
        except HTTPException:
            raise
        except Exception:
            await self.db.rollback()
            logger.exception("Error updating course")
            raise

    async def get_course_detail(self, teacher_id: int, course_id: int) -> TeacherCourseResponse:
        import json
        stmt = select(CourseModel).where(
            CourseModel.id == course_id,
            CourseModel.deleted_at.is_(None)
        )
        
        db_course = (await self.db.execute(stmt)).scalar_one_or_none()
        if db_course is None:
            raise HTTPException(status_code=404, detail="COURSE_NOT_FOUND")
        if db_course.teacher_id != teacher_id:
            raise HTTPException(status_code=403, detail="FORBIDDEN")
            
        return TeacherCourseResponse(
            id=db_course.id,
            title=db_course.title,
            description=db_course.description,
            price=db_course.price,
            thumbnail_url=db_course.thumbnail_url,
            field=db_course.field,
            tags=json.loads(db_course.tags) if db_course.tags else [],
            status=db_course.status,
            teacher_id=db_course.teacher_id,
            created_at=db_course.created_at.isoformat() if db_course.created_at else None,
            updated_at=db_course.updated_at.isoformat() if db_course.updated_at else None,
            slug=db_course.slug,
            rating=0.0,
            currency="USD"
        )

    async def submit_course_review(self, teacher_id: int, course_id: int) -> TeacherCourseResponse:
        import json
        from datetime import datetime, UTC
        stmt = select(CourseModel).where(
            CourseModel.id == course_id,
            CourseModel.deleted_at.is_(None)
        ).with_for_update()
        
        db_course = (await self.db.execute(stmt)).scalar_one_or_none()
        if db_course is None:
            raise HTTPException(status_code=404, detail="COURSE_NOT_FOUND")
        if db_course.teacher_id != teacher_id:
            raise HTTPException(status_code=403, detail="FORBIDDEN")
            
        if db_course.status not in (CourseStatus.DRAFT, CourseStatus.REJECTED):
            raise HTTPException(status_code=409, detail="INVALID_STATE")
            
        db_course.status = CourseStatus.PENDING_REVIEW
        await self.db.commit()
        await self.db.refresh(db_course)
        
        return TeacherCourseResponse(
            id=db_course.id,
            title=db_course.title,
            description=db_course.description,
            price=db_course.price,
            thumbnail_url=db_course.thumbnail_url,
            field=db_course.field,
            tags=json.loads(db_course.tags) if db_course.tags else [],
            status=db_course.status,
            teacher_id=db_course.teacher_id,
            created_at=db_course.created_at.isoformat() if db_course.created_at else None,
            updated_at=db_course.updated_at.isoformat() if db_course.updated_at else None,
            slug=db_course.slug,
            rating=0.0,
            currency="USD"
        )

    @classmethod
    def _reset_mock_data(cls):
        global _course_id_counter, _section_id_counter, _lesson_id_counter, _content_id_counter, _reading_id_counter
        _courses.clear()
        _sections.clear()
        _lessons.clear()
        _contents.clear()
        _readings.clear()
        _course_id_counter = 1
        _section_id_counter = 1
        _lesson_id_counter = 1
        _content_id_counter = 1
        _reading_id_counter = 1

    async def create_section(self, teacher_id: int, course_id: int, data: TeacherCourseSectionCreateRequest) -> TeacherCourseSectionResponse:
        try:
            course = await self.db.scalar(
                select(CourseModel).where(
                    CourseModel.id == course_id,
                    CourseModel.deleted_at.is_(None),
                ).with_for_update()
            )
            if course is None:
                raise HTTPException(status_code=404, detail="COURSE_NOT_FOUND")
            if course.teacher_id != teacher_id:
                raise HTTPException(status_code=403, detail="FORBIDDEN")
            if course.status not in [CourseStatus.DRAFT, CourseStatus.REJECTED]:
                raise HTTPException(status_code=409, detail="INVALID_STATE")
            
            max_position = await self.db.scalar(
                select(func.coalesce(func.max(SectionModel.position), -1)).where(
                    SectionModel.course_id == course_id,
                )
            )
            next_position = int(max_position) + 1 if max_position is not None else 0

            new_section = SectionModel(
                course_id=course_id,
                title=data.title,
                position=next_position,
            )
            self.db.add(new_section)

            await self.db.flush()
            await self.db.commit()
            await self.db.refresh(new_section)

            return TeacherCourseSectionResponse(
                id=new_section.id,
                course_id=new_section.course_id,
                title=new_section.title,
                order=new_section.position,
            )
        except HTTPException:
            raise
        except Exception:
            await self.db.rollback()
            logger.exception("Error creating section")
            raise

    async def update_section(self, teacher_id: int, section_id: int, data: TeacherCourseSectionUpdateRequest) -> TeacherCourseSectionResponse:

        try:
            stmt = select(SectionModel).where(
                SectionModel.id == section_id
            )
            db_section = (await self.db.execute(stmt)).scalar_one_or_none()
            if db_section is None:
                raise HTTPException(status_code=404, detail="SECTION_NOT_FOUND")
                
            course_stmt = select(CourseModel).where(
                CourseModel.id == db_section.course_id,
                CourseModel.deleted_at.is_(None)
            ).with_for_update()
            course = (await self.db.execute(course_stmt)).scalar_one_or_none()
            if course is None:
                raise HTTPException(status_code=404, detail="COURSE_NOT_FOUND")
            if course.teacher_id != teacher_id:
                raise HTTPException(status_code=403, detail="FORBIDDEN")
            if course.status not in [CourseStatus.DRAFT, CourseStatus.REJECTED]:
                raise HTTPException(status_code=409, detail="INVALID_STATE")
                
            update_data = data.model_dump(exclude_unset=True)
            if "order" in update_data:
                db_section.position = update_data.pop("order")
                
            for key, value in update_data.items():
                if hasattr(db_section, key):
                    setattr(db_section, key, value)
            
            await self.db.commit()
            await self.db.refresh(db_section)
            
            return TeacherCourseSectionResponse(
                id=db_section.id,
                title=db_section.title,
                order=db_section.position,
                course_id=db_section.course_id
            )
        except HTTPException:
            raise
        except Exception:
            await self.db.rollback()
            logger.exception("Error updating section")
            raise

    async def delete_section(self, teacher_id: int, section_id: int) -> TeacherCourseDeleteResponse:
        try:
            stmt = select(SectionModel).where(
                SectionModel.id == section_id
            )
            db_section = (await self.db.execute(stmt)).scalar_one_or_none()
            if db_section is None:
                raise HTTPException(status_code=404, detail="SECTION_NOT_FOUND")
                
            course_stmt = select(CourseModel).where(
                CourseModel.id == db_section.course_id,
                CourseModel.deleted_at.is_(None)
            ).with_for_update()
            course = (await self.db.execute(course_stmt)).scalar_one_or_none()
            if course is None:
                raise HTTPException(status_code=404, detail="COURSE_NOT_FOUND")
            if course.teacher_id != teacher_id:
                raise HTTPException(status_code=403, detail="FORBIDDEN")
            if course.status not in [CourseStatus.DRAFT, CourseStatus.REJECTED]:
                raise HTTPException(status_code=409, detail="INVALID_STATE")
                
            has_lessons = await self.db.scalar(
                select(LessonModel.id).where(LessonModel.section_id == section_id).limit(1)
            )
            if has_lessons is not None:
                raise HTTPException(status_code=409, detail="SECTION_HAS_LESSONS")
                
            await self.db.delete(db_section)
            await self.db.commit()
            return TeacherCourseDeleteResponse(message="Section deleted successfully")
            
        except HTTPException:
            raise
        except Exception:
            await self.db.rollback()
            logger.exception("Error deleting section")
            raise

    async def create_lesson(self, teacher_id: int, section_id: int, data: TeacherCourseLessonCreateRequest) -> TeacherCourseLessonResponse:

        try:
            stmt = select(SectionModel).where(
                SectionModel.id == section_id
            )
            db_section = (await self.db.execute(stmt)).scalar_one_or_none()
            if db_section is None:
                raise HTTPException(status_code=404, detail="SECTION_NOT_FOUND")
                
            course_stmt = select(CourseModel).where(
                CourseModel.id == db_section.course_id,
                CourseModel.deleted_at.is_(None)
            ).with_for_update()
            course = (await self.db.execute(course_stmt)).scalar_one_or_none()
            if course is None:
                raise HTTPException(status_code=404, detail="COURSE_NOT_FOUND")
            if course.teacher_id != teacher_id:
                raise HTTPException(status_code=403, detail="FORBIDDEN")
            if course.status not in [CourseStatus.DRAFT, CourseStatus.REJECTED]:
                raise HTTPException(status_code=409, detail="INVALID_STATE")
                
            new_lesson = LessonModel(
                title=data.title,
                position=data.order,
                section_id=section_id
            )
            self.db.add(new_lesson)
            await self.db.commit()
            await self.db.refresh(new_lesson)
            
            return TeacherCourseLessonResponse(
                id=new_lesson.id,
                title=new_lesson.title,
                order=new_lesson.position,
                section_id=new_lesson.section_id
            )
        except HTTPException:
            raise
        except Exception:
            await self.db.rollback()
            logger.exception("Error creating lesson")
            raise

    async def update_lesson(self, teacher_id: int, lesson_id: int, data: TeacherCourseLessonUpdateRequest) -> TeacherCourseLessonResponse:

        try:
            stmt = select(LessonModel).where(LessonModel.id == lesson_id)
            db_lesson = (await self.db.execute(stmt)).scalar_one_or_none()
            if db_lesson is None:
                raise HTTPException(status_code=404, detail="LESSON_NOT_FOUND")
                
            section_stmt = select(SectionModel).where(SectionModel.id == db_lesson.section_id)
            db_section = (await self.db.execute(section_stmt)).scalar_one_or_none()
            
            course_stmt = select(CourseModel).where(
                CourseModel.id == db_section.course_id,
                CourseModel.deleted_at.is_(None)
            ).with_for_update()
            course = (await self.db.execute(course_stmt)).scalar_one_or_none()
            if course is None:
                raise HTTPException(status_code=404, detail="COURSE_NOT_FOUND")
            if course.teacher_id != teacher_id:
                raise HTTPException(status_code=403, detail="FORBIDDEN")
            if course.status not in [CourseStatus.DRAFT, CourseStatus.REJECTED]:
                raise HTTPException(status_code=409, detail="INVALID_STATE")
                
            update_data = data.model_dump(exclude_unset=True)
            if "order" in update_data:
                db_lesson.position = update_data.pop("order")
                
            for key, value in update_data.items():
                if hasattr(db_lesson, key):
                    setattr(db_lesson, key, value)
            
            await self.db.commit()
            await self.db.refresh(db_lesson)
            
            return TeacherCourseLessonResponse(
                id=db_lesson.id,
                title=db_lesson.title,
                summary=db_lesson.summary,
                order=db_lesson.position,
                section_id=db_lesson.section_id
            )
        except HTTPException:
            raise
        except Exception:
            await self.db.rollback()
            logger.exception("Error updating lesson")
            raise

    async def delete_lesson(self, teacher_id: int, lesson_id: int) -> TeacherCourseDeleteResponse:
        try:
            stmt = select(LessonModel).where(LessonModel.id == lesson_id)
            db_lesson = (await self.db.execute(stmt)).scalar_one_or_none()
            if db_lesson is None:
                raise HTTPException(status_code=404, detail="LESSON_NOT_FOUND")
                
            section_stmt = select(SectionModel).where(SectionModel.id == db_lesson.section_id)
            db_section = (await self.db.execute(section_stmt)).scalar_one_or_none()
            
            course_stmt = select(CourseModel).where(
                CourseModel.id == db_section.course_id,
                CourseModel.deleted_at.is_(None)
            ).with_for_update()
            course = (await self.db.execute(course_stmt)).scalar_one_or_none()
            if course is None:
                raise HTTPException(status_code=404, detail="COURSE_NOT_FOUND")
            if course.teacher_id != teacher_id:
                raise HTTPException(status_code=403, detail="FORBIDDEN")
            if course.status not in [CourseStatus.DRAFT, CourseStatus.REJECTED]:
                raise HTTPException(status_code=409, detail="INVALID_STATE")
                
            await self.db.delete(db_lesson)
            await self.db.commit()
            return TeacherCourseDeleteResponse(message="Deleted successfully")
            
        except HTTPException:
            raise
        except Exception:
            await self.db.rollback()
            logger.exception("Error deleting lesson")
            raise

    async def create_reading_content(self, teacher_id: int, lesson_id: int, data: TeacherCourseReadingCreateRequest) -> TeacherCourseReadingCreateResponse:
        stmt = select(LessonModel).where(LessonModel.id == lesson_id)
        db_lesson = (await self.db.execute(stmt)).scalar_one_or_none()
        if db_lesson is None:
            raise HTTPException(status_code=404, detail="LESSON_NOT_FOUND")
            
        section_stmt = select(SectionModel).where(SectionModel.id == db_lesson.section_id)
        db_section = (await self.db.execute(section_stmt)).scalar_one_or_none()
        
        course_stmt = select(CourseModel).where(
            CourseModel.id == db_section.course_id,
            CourseModel.deleted_at.is_(None)
        ).with_for_update()
        course = (await self.db.execute(course_stmt)).scalar_one_or_none()
        
        if course is None:
            raise HTTPException(status_code=404, detail="COURSE_NOT_FOUND")
        if course.teacher_id != teacher_id:
            raise HTTPException(status_code=403, detail="FORBIDDEN")
        if course.status not in [CourseStatus.DRAFT, CourseStatus.REJECTED]:
            raise HTTPException(status_code=409, detail="INVALID_STATE")
            
        db_reading = ReadingContentModel(
            title=data.title,
            content=data.content
        )
        self.db.add(db_reading)
        await self.db.flush()
        
        db_lesson_content = LessonContentModel(
            lesson_id=lesson_id,
            content_type="READING",
            content_id=db_reading.id,
            position=data.order
        )
        self.db.add(db_lesson_content)
        await self.db.flush()
        await self.db.commit()
        await self.db.refresh(db_reading)
        await self.db.refresh(db_lesson_content)
        
        return TeacherCourseReadingCreateResponse(
            reading_content={
                "id": db_reading.id,
                "title": db_reading.title,
                "content": db_reading.content,
                "created_at": db_reading.created_at.isoformat() + "Z" if db_reading.created_at else None,
                "updated_at": db_reading.updated_at.isoformat() + "Z" if db_reading.updated_at else None
            },
            lesson_content={
                "id": db_lesson_content.id,
                "lesson_id": db_lesson_content.lesson_id,
                "content_type": db_lesson_content.content_type.value if hasattr(db_lesson_content.content_type, 'value') else db_lesson_content.content_type,
                "content_id": db_lesson_content.content_id,
                "media_url": db_lesson_content.media_url,
                "order": db_lesson_content.position,
                "created_at": db_lesson_content.created_at.isoformat() + "Z" if db_lesson_content.created_at else None
            }
        )

    async def create_lesson_content(self, teacher_id: int, lesson_id: int, data: TeacherCourseLessonContentCreateRequest) -> TeacherCourseLessonContentResponse:
        stmt = select(LessonModel).where(LessonModel.id == lesson_id)
        db_lesson = (await self.db.execute(stmt)).scalar_one_or_none()
        if db_lesson is None:
            raise HTTPException(status_code=404, detail="LESSON_NOT_FOUND")
            
        section_stmt = select(SectionModel).where(SectionModel.id == db_lesson.section_id)
        db_section = (await self.db.execute(section_stmt)).scalar_one_or_none()
        
        course_stmt = select(CourseModel).where(
            CourseModel.id == db_section.course_id,
            CourseModel.deleted_at.is_(None)
        ).with_for_update()
        course = (await self.db.execute(course_stmt)).scalar_one_or_none()
        
        if course is None:
            raise HTTPException(status_code=404, detail="COURSE_NOT_FOUND")
        if course.teacher_id != teacher_id:
            raise HTTPException(status_code=403, detail="FORBIDDEN")
        if course.status not in [CourseStatus.DRAFT, CourseStatus.REJECTED]:
            raise HTTPException(status_code=409, detail="INVALID_STATE")
            
        db_lesson_content = LessonContentModel(
            lesson_id=lesson_id,
            content_type=data.content_type,
            content_id=data.content_id,
            media_url=data.media_url,
            position=data.order
        )
        self.db.add(db_lesson_content)
        await self.db.flush()
        await self.db.commit()
        await self.db.refresh(db_lesson_content)
        
        return TeacherCourseLessonContentResponse(
            id=db_lesson_content.id,
            lesson_id=db_lesson_content.lesson_id,
            content_type=db_lesson_content.content_type.value if hasattr(db_lesson_content.content_type, 'value') else db_lesson_content.content_type,
            content_id=db_lesson_content.content_id,
            media_url=db_lesson_content.media_url,
            order=db_lesson_content.position,
            created_at=db_lesson_content.created_at.isoformat() + "Z" if db_lesson_content.created_at else None
        )

    async def update_reading_content(self, teacher_id: int, content_id: int, data: TeacherCourseReadingUpdateRequest) -> TeacherCourseReadingResponse:
        stmt = select(LessonContentModel).where(LessonContentModel.id == content_id)
        db_lesson_content = (await self.db.execute(stmt)).scalar_one_or_none()
        if db_lesson_content is None:
            raise HTTPException(status_code=404, detail="CONTENT_NOT_FOUND")
            
        lesson_stmt = select(LessonModel).where(
            LessonModel.id == db_lesson_content.lesson_id
        )
        db_lesson = (await self.db.execute(lesson_stmt)).scalar_one_or_none()
        if db_lesson is None:
            raise HTTPException(status_code=404, detail="LESSON_NOT_FOUND")
            
        section_stmt = select(SectionModel).where(
            SectionModel.id == db_lesson.section_id
        )
        db_section = (await self.db.execute(section_stmt)).scalar_one_or_none()
        if db_section is None:
            raise HTTPException(status_code=404, detail="SECTION_NOT_FOUND")
            
        course_stmt = select(CourseModel).where(
            CourseModel.id == db_section.course_id,
            CourseModel.deleted_at.is_(None)
        ).with_for_update()
        course = (await self.db.execute(course_stmt)).scalar_one_or_none()
        
        if course is None:
            raise HTTPException(status_code=404, detail="COURSE_NOT_FOUND")
        if course.teacher_id != teacher_id:
            raise HTTPException(status_code=403, detail="FORBIDDEN")
        if course.status not in [CourseStatus.DRAFT, CourseStatus.REJECTED]:
            raise HTTPException(status_code=409, detail="INVALID_STATE")
            
        ctype = db_lesson_content.content_type.value if hasattr(db_lesson_content.content_type, 'value') else db_lesson_content.content_type
        if ctype != "READING":
            raise HTTPException(status_code=400, detail="INVALID_REQUEST")
            
        reading_stmt = select(ReadingContentModel).where(ReadingContentModel.id == db_lesson_content.content_id)
        db_reading = (await self.db.execute(reading_stmt)).scalar_one_or_none()
        if db_reading is None:
            raise HTTPException(status_code=404, detail="READING_NOT_FOUND")
            
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            if hasattr(db_reading, key):
                setattr(db_reading, key, value)
                
        await self.db.commit()
        await self.db.refresh(db_reading)
        
        return TeacherCourseReadingResponse(
            id=db_reading.id,
            title=db_reading.title,
            content=db_reading.content,
            created_at=db_reading.created_at.isoformat() + "Z" if db_reading.created_at else None,
            updated_at=db_reading.updated_at.isoformat() + "Z" if getattr(db_reading, 'updated_at', None) else None
        )

    async def update_lesson_content(self, teacher_id: int, content_id: int, data: TeacherCourseLessonContentUpdateRequest) -> TeacherCourseLessonContentResponse:
        stmt = select(LessonContentModel).where(LessonContentModel.id == content_id)
        db_lesson_content = (await self.db.execute(stmt)).scalar_one_or_none()
        if db_lesson_content is None:
            raise HTTPException(status_code=404, detail="CONTENT_NOT_FOUND")
            
        lesson_stmt = select(LessonModel).where(
            LessonModel.id == db_lesson_content.lesson_id
        )
        db_lesson = (await self.db.execute(lesson_stmt)).scalar_one_or_none()
        if db_lesson is None:
            raise HTTPException(status_code=404, detail="LESSON_NOT_FOUND")
            
        section_stmt = select(SectionModel).where(
            SectionModel.id == db_lesson.section_id
        )
        db_section = (await self.db.execute(section_stmt)).scalar_one_or_none()
        if db_section is None:
            raise HTTPException(status_code=404, detail="SECTION_NOT_FOUND")
            
        course_stmt = select(CourseModel).where(
            CourseModel.id == db_section.course_id,
            CourseModel.deleted_at.is_(None)
        ).with_for_update()
        course = (await self.db.execute(course_stmt)).scalar_one_or_none()
        
        if course is None:
            raise HTTPException(status_code=404, detail="COURSE_NOT_FOUND")
        if course.teacher_id != teacher_id:
            raise HTTPException(status_code=403, detail="FORBIDDEN")
        if course.status not in [CourseStatus.DRAFT, CourseStatus.REJECTED]:
            raise HTTPException(status_code=409, detail="INVALID_STATE")
            
        update_data = data.model_dump(exclude_unset=True)
        if "order" in update_data:
            db_lesson_content.position = update_data.pop("order")
            
        for key, value in update_data.items():
            if hasattr(db_lesson_content, key):
                setattr(db_lesson_content, key, value)
                
        await self.db.commit()
        await self.db.refresh(db_lesson_content)
        
        return TeacherCourseLessonContentResponse(
            id=db_lesson_content.id,
            lesson_id=db_lesson_content.lesson_id,
            content_type=db_lesson_content.content_type.value if hasattr(db_lesson_content.content_type, 'value') else db_lesson_content.content_type,
            content_id=db_lesson_content.content_id,
            media_url=db_lesson_content.media_url,
            order=db_lesson_content.position,
            created_at=db_lesson_content.created_at.isoformat() + "Z" if getattr(db_lesson_content, 'created_at', None) else None
        )

    async def delete_lesson_content(self, teacher_id: int, content_id: int) -> TeacherCourseDeleteResponse:
        stmt = select(LessonContentModel).where(LessonContentModel.id == content_id)
        db_lesson_content = (await self.db.execute(stmt)).scalar_one_or_none()
        if db_lesson_content is None:
            raise HTTPException(status_code=404, detail="CONTENT_NOT_FOUND")
            
        lesson_stmt = select(LessonModel).where(
            LessonModel.id == db_lesson_content.lesson_id
        )
        db_lesson = (await self.db.execute(lesson_stmt)).scalar_one_or_none()
        if db_lesson is None:
            raise HTTPException(status_code=404, detail="LESSON_NOT_FOUND")
            
        section_stmt = select(SectionModel).where(
            SectionModel.id == db_lesson.section_id
        )
        db_section = (await self.db.execute(section_stmt)).scalar_one_or_none()
        if db_section is None:
            raise HTTPException(status_code=404, detail="SECTION_NOT_FOUND")
            
        course_stmt = select(CourseModel).where(
            CourseModel.id == db_section.course_id,
            CourseModel.deleted_at.is_(None)
        ).with_for_update()
        course = (await self.db.execute(course_stmt)).scalar_one_or_none()
        
        if course is None:
            raise HTTPException(status_code=404, detail="COURSE_NOT_FOUND")
        if course.teacher_id != teacher_id:
            raise HTTPException(status_code=403, detail="FORBIDDEN")
        if course.status not in [CourseStatus.DRAFT, CourseStatus.REJECTED]:
            raise HTTPException(status_code=409, detail="INVALID_STATE")
            
        ctype = db_lesson_content.content_type.value if hasattr(db_lesson_content.content_type, 'value') else db_lesson_content.content_type
        
        if ctype == "READING":
            reading_stmt = select(ReadingContentModel).where(ReadingContentModel.id == db_lesson_content.content_id)
            db_reading = (await self.db.execute(reading_stmt)).scalar_one_or_none()
            if db_reading:
                await self.db.delete(db_reading)
                
        await self.db.delete(db_lesson_content)
        await self.db.commit()
        
        return TeacherCourseDeleteResponse(message="Deleted successfully")

    async def reorder_curriculum(self, teacher_id: int, course_id: int, data: TeacherCourseReorderRequest) -> TeacherCourseReorderResponse:
        from sqlalchemy.exc import IntegrityError
        try:
            course = (await self.db.execute(
                select(CourseModel).where(
                    CourseModel.id == course_id,
                    CourseModel.deleted_at.is_(None)
                ).with_for_update()
            )).scalar_one_or_none()
            
            if course is None:
                raise HTTPException(status_code=404, detail="COURSE_NOT_FOUND")
            if course.teacher_id != teacher_id:
                raise HTTPException(status_code=403, detail="FORBIDDEN")
            if course.status not in [CourseStatus.DRAFT, CourseStatus.REJECTED]:
                raise HTTPException(status_code=409, detail="INVALID_STATE")

            sections = list((await self.db.scalars(
                select(SectionModel).where(SectionModel.course_id == course_id)
            )).all())
            lessons = list((await self.db.scalars(
                select(LessonModel)
                .join(SectionModel, SectionModel.id == LessonModel.section_id)
                .where(SectionModel.course_id == course_id)
            )).all())
            lesson_contents = list((await self.db.scalars(
                select(LessonContentModel)
                .join(LessonModel, LessonModel.id == LessonContentModel.lesson_id)
                .join(SectionModel, SectionModel.id == LessonModel.section_id)
                .where(SectionModel.course_id == course_id)
            )).all())

            sections_by_id = {section.id: section for section in sections}
            lessons_by_id = {lesson.id: lesson for lesson in lessons}
            lesson_contents_by_id = {c.id: c for c in lesson_contents}
            
            section_positions = {section.id: section.position for section in sections}
            lesson_targets = {lesson.id: (lesson.section_id, lesson.position) for lesson in lessons}
            content_targets = {c.id: (c.lesson_id, c.position) for c in lesson_contents}
            
            reordered_section_ids: set[int] = set()
            reordered_lesson_ids: set[int] = set()
            reordered_content_ids: set[int] = set()

            for item in data.items:
                if item.item_kind == "section":
                    if item.section_id is not None or item.id not in sections_by_id or item.id in reordered_section_ids:
                        raise HTTPException(status_code=400, detail="INVALID_REQUEST")
                    section_positions[item.id] = item.order
                    reordered_section_ids.add(item.id)
                elif item.item_kind == "lesson":
                    lesson = lessons_by_id.get(item.id)
                    parent_section_id = item.section_id if item.section_id is not None else lesson.section_id if lesson else None
                    if lesson is None or parent_section_id not in sections_by_id or item.id in reordered_lesson_ids:
                        raise HTTPException(status_code=400, detail="INVALID_REQUEST")
                    lesson_targets[item.id] = (parent_section_id, item.order)
                    reordered_lesson_ids.add(item.id)
                elif item.item_kind == "lesson_content":
                    lesson_content = lesson_contents_by_id.get(item.id)
                    parent_lesson_id = item.section_id if item.section_id is not None else lesson_content.lesson_id if lesson_content else None
                    if lesson_content is None or parent_lesson_id not in lessons_by_id or item.id in reordered_content_ids:
                        raise HTTPException(status_code=400, detail="INVALID_REQUEST")
                    content_targets[item.id] = (parent_lesson_id, item.order)
                    reordered_content_ids.add(item.id)

            if len(reordered_section_ids) != len(sections) or len(reordered_lesson_ids) != len(lessons) or len(reordered_content_ids) != len(lesson_contents):
                raise HTTPException(status_code=400, detail="INVALID_REQUEST")

            if len(section_positions.values()) != len(set(section_positions.values())):
                raise HTTPException(status_code=409, detail="INVALID_STATE")
                
            lesson_positions: dict[int, set[int]] = {}
            for parent_section_id, position in lesson_targets.values():
                if parent_section_id not in lesson_positions:
                    lesson_positions[parent_section_id] = set()
                if position in lesson_positions[parent_section_id]:
                    raise HTTPException(status_code=409, detail="INVALID_STATE")
                lesson_positions[parent_section_id].add(position)
                
            content_positions: dict[int, set[int]] = {}
            for parent_lesson_id, position in content_targets.values():
                if parent_lesson_id not in content_positions:
                    content_positions[parent_lesson_id] = set()
                if position in content_positions[parent_lesson_id]:
                    raise HTTPException(status_code=409, detail="INVALID_STATE")
                content_positions[parent_lesson_id].add(position)

            for section_id in reordered_section_ids:
                sections_by_id[section_id].position = -section_id
            for lesson_id in reordered_lesson_ids:
                lessons_by_id[lesson_id].position = -lesson_id
            for content_id in reordered_content_ids:
                lesson_contents_by_id[content_id].position = -content_id
            await self.db.flush()

            for section_id in reordered_section_ids:
                sections_by_id[section_id].position = section_positions[section_id]
            for lesson_id in reordered_lesson_ids:
                lesson = lessons_by_id[lesson_id]
                lesson.section_id, lesson.position = lesson_targets[lesson_id]
            for content_id in reordered_content_ids:
                lesson_content = lesson_contents_by_id[content_id]
                lesson_content.lesson_id, lesson_content.position = content_targets[content_id]

            await self.db.flush()
            
            # Form response BEFORE commit to avoid MissingGreenlet on expired attributes
            response = TeacherCourseReorderResponse(
                sections=[
                    TeacherCourseSectionResponse(
                        id=s.id,
                        course_id=s.course_id,
                        title=s.title,
                        order=s.position
                    ) for s in sorted(sections, key=lambda item: item.position)
                ],
                lessons=[
                    TeacherCourseLessonResponse(
                        id=l.id,
                        section_id=l.section_id,
                        title=l.title,
                        order=l.position
                    ) for l in sorted(lessons, key=lambda item: (item.section_id, item.position))
                ],
                lesson_contents=[
                    TeacherCourseLessonContentResponse(
                        id=c.id,
                        lesson_id=c.lesson_id,
                        content_type=c.content_type.value if hasattr(c.content_type, 'value') else c.content_type,
                        content_id=c.content_id,
                        media_url=c.media_url,
                        order=c.position,
                        created_at=c.created_at.isoformat() + "Z" if getattr(c, 'created_at', None) else None
                    ) for c in sorted(lesson_contents, key=lambda item: (item.lesson_id, item.position))
                ]
            )
            
            await self.db.commit()
            return response
        except IntegrityError as e:
            await self.db.rollback()
            raise HTTPException(status_code=409, detail="INVALID_STATE") from e
        except HTTPException:
            await self.db.rollback()
            raise
        except Exception as e:
            await self.db.rollback()
            raise e

    async def get_course_submissions(self, teacher_id: int, course_id: int, page: int, size: int, problem_id: int | None, student_id: int | None, status: ProblemSubmissionStatus | None) -> SubmissionListResponse:

        
        # 1. Check ownership
        stmt_course = select(CourseModel).where(CourseModel.id == course_id)
        course_res = await self.db.execute(stmt_course)
        course = course_res.scalar_one_or_none()
        
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        if course.teacher_id != teacher_id:
            raise HTTPException(status_code=403, detail="Not authorized")
            
        # 2. Get all problem_ids for this course
        stmt_probs = select(LessonContentModel.content_id).join(
            LessonModel, LessonContentModel.lesson_id == LessonModel.id
        ).join(
            SectionModel, LessonModel.section_id == SectionModel.id
        ).where(
            SectionModel.course_id == course_id,
            LessonContentModel.content_type == LessonContentType.PROBLEM
        )
        probs_res = await self.db.execute(stmt_probs)
        course_problem_ids = [p for p in probs_res.scalars().all()]
        
        if not course_problem_ids:
            # Course has no problems -> no submissions
            return SubmissionListResponse(total_items=0, total_pages=0, current_page=page, items=[])
            
        # 3. If problem_id is provided, it must be in course_problem_ids, else return empty
        if problem_id is not None:
            if problem_id not in course_problem_ids:
                return SubmissionListResponse(total_items=0, total_pages=0, current_page=page, items=[])
            filter_probs = [problem_id]
        else:
            filter_probs = course_problem_ids
            
        # 4. Query submissions
        stmt = select(SubmissionModel).where(SubmissionModel.problem_id.in_(filter_probs))
        
        if student_id is not None:
            stmt = stmt.where(SubmissionModel.student_id == student_id)
        if status is not None:
            stmt = stmt.where(SubmissionModel.status == status)
            
        # Get total count
        stmt_count = select(func.count()).select_from(stmt.subquery())
        count_res = await self.db.execute(stmt_count)
        total_items = count_res.scalar_one_or_none() or 0
        
        # Pagination
        import math
        total_pages = math.ceil(total_items / size) if total_items > 0 else 0
        
        stmt = stmt.offset((page - 1) * size).limit(size).order_by(SubmissionModel.submitted_at.desc())
        items_res = await self.db.execute(stmt)
        items = items_res.scalars().all()
        
        return SubmissionListResponse(
            total_items=total_items,
            total_pages=total_pages,
            current_page=page,
            items=[SubmissionView.model_validate(i) for i in items]
        )
