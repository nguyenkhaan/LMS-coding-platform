from datetime import UTC, datetime

from sqlalchemy.ext.asyncio import AsyncSession

from src.models.base_model import LessonContentType
from src.modules.teacher.teacher_dto import (
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

    async def create_course_section(self, course_id: int, data: SectionWriteRequest) -> SectionView:
        return SectionView(
            id=1,
            course_id=course_id,
            title="Python Foundations",
            position=1,
        )

    async def update_course_section(self, section_id: int, data: SectionUpdateRequest) -> SectionView:
        return SectionView(
            id=section_id,
            course_id=10,
            title="Python Foundations",
            position=1,
        )

    async def delete_course_section(self, section_id: int) -> MessageResponse:
        return MessageResponse(message="Section deleted")

    async def create_lesson(self, section_id: int, data: LessonWriteRequest) -> LessonView:
        return LessonView(
            id=1,
            section_id=section_id,
            title="Variables and data types",
            summary="Learn the core Python data types.",
            score=10,
            position=1,
            created_at=datetime(2026, 1, 1, tzinfo=UTC),
            updated_at=datetime(2026, 1, 1, tzinfo=UTC),
        )

    async def update_lesson(self, lesson_id: int, data: LessonUpdateRequest) -> LessonView:
        return LessonView(
            id=lesson_id,
            section_id=1,
            title="Variables and data types",
            summary="Learn the core Python data types.",
            score=10,
            position=1,
            created_at=datetime(2026, 1, 1, tzinfo=UTC),
            updated_at=datetime(2026, 1, 1, tzinfo=UTC),
        )

    async def delete_lesson(self, lesson_id: int) -> MessageResponse:
        return MessageResponse(message="Lesson deleted")

    async def create_reading_content(self, lesson_id: int, data: ReadingContentCreateRequest) -> ReadingContentCreateResponse:
        return ReadingContentCreateResponse(
            reading=ReadingContentView(
                id=1,
                title="Python variables",
                content="Variables store values that can be reused in a program.",
                created_at=datetime(2026, 1, 1, tzinfo=UTC),
                updated_at=datetime(2026, 1, 1, tzinfo=UTC),
            ),
            lesson_content=LessonContentView(
                id=1,
                lesson_id=lesson_id,
                content_type=LessonContentType.READING,
                content_id=1,
                media_url=None,
                position=1,
                created_at=datetime(2026, 1, 1, tzinfo=UTC),
            ),
        )

    async def update_reading_content(self, lesson_content_id: int, data: ReadingContentUpdateRequest) -> ReadingContentView:
        return ReadingContentView(
            id=1,
            title="Python variables",
            content="Variables store values that can be reused in a program.",
            created_at=datetime(2026, 1, 1, tzinfo=UTC),
            updated_at=datetime(2026, 1, 1, tzinfo=UTC),
        )

    async def bind_lesson_content(self, lesson_id: int, data: LessonContentBindRequest) -> LessonContentView:
        return LessonContentView(
            id=1,
            lesson_id=lesson_id,
            content_type=LessonContentType.READING,
            content_id=1,
            media_url=None,
            position=1,
            created_at=datetime(2026, 1, 1, tzinfo=UTC),
        )

    async def update_lesson_content(self, lesson_content_id: int, data: LessonContentUpdateRequest) -> LessonContentView:
        return LessonContentView(
            id=lesson_content_id,
            lesson_id=1,
            content_type=LessonContentType.READING,
            content_id=1,
            media_url=None,
            position=1,
            created_at=datetime(2026, 1, 1, tzinfo=UTC),
        )

    async def delete_lesson_content(self, lesson_content_id: int) -> MessageResponse:
        return MessageResponse(message="Lesson content deleted")

    async def reorder_curriculum(self, course_id: int, data: CurriculumReorderRequest) -> CurriculumReorderResponse:
        return CurriculumReorderResponse(
            sections=[
                SectionView(
                    id=1,
                    course_id=course_id,
                    title="Python Foundations",
                    position=1,
                )
            ],
            lessons=[
                LessonView(
                    id=1,
                    section_id=1,
                    title="Variables and data types",
                    summary="Learn the core Python data types.",
                    score=10,
                    position=1,
                    created_at=datetime(2026, 1, 1, tzinfo=UTC),
                    updated_at=datetime(2026, 1, 1, tzinfo=UTC),
                )
            ],
            lesson_contents=[
                LessonContentView(
                    id=1,
                    lesson_id=1,
                    content_type=LessonContentType.READING,
                    content_id=1,
                    media_url=None,
                    position=1,
                    created_at=datetime(2026, 1, 1, tzinfo=UTC),
                )
            ],
        )
