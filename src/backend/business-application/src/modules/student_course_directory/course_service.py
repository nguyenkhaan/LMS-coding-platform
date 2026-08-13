from datetime import datetime, timezone

from fastapi import HTTPException

from src.models.base_model import LessonContentType
from src.modules.student_course_directory.course_dto import (
    CourseCatalogResponse,
    CourseDetailResponse,
    CourseItemResponse,
    CompleteContentResponse,
    EnrolledCourseResponse,
    EnrollResponse,
    EnrollStatus,
    LessonContentStudyResponse,
    LessonStudyResponse,
    PriceType,
    QuizOptionResponse,
    QuizQuestionResponse,
    QuizResponse,
    QuizSubmitRequest,
    QuizSubmitResponse,
    SectionOverviewResponse,
    SectionStudyResponse,
    StudentCoursesResponse,
    StudyResponse,
    UnenrollResponse,
)

from src.modules.student_course_directory.course_mock import (
    _MOCK_COURSES,
    _MOCK_COURSE_SECTIONS,
    _MOCK_ENROLLED_COURSES,
    _MOCK_STUDY_DATA,
    _VALID_LESSON_CONTENT_IDS,
    _MOCK_QUIZ_ANSWER_KEY,
    _MOCK_QUIZZES,
)



class CourseService:
    """
    Service layer for Module 2: Student Course Directory & Study Mode.
    All methods use mock data — DB integration is deferred until API contract is stable.
    """

    # ------------------------------------------------------------------
    # Endpoint 1 — GET /courses
    # ------------------------------------------------------------------

    async def get_course_catalog(
        self,
        page: int,
        size: int,
        q: str | None,
        price_type: PriceType | None,
    ) -> CourseCatalogResponse:
        filtered = list(_MOCK_COURSES)

        if q:
            q_lower = q.lower()
            filtered = [c for c in filtered if q_lower in c.title.lower()]

        if price_type:
            filtered = [c for c in filtered if c.price_type == price_type]

        total_items = len(filtered)
        total_pages = max(1, (total_items + size - 1) // size)
        start = (page - 1) * size
        page_items = filtered[start : start + size]

        return CourseCatalogResponse(
            total_items=total_items,
            total_pages=total_pages,
            current_page=page,
            items=page_items,
        )

    # ------------------------------------------------------------------
    # Endpoint 2 — GET /courses/{slug}
    # ------------------------------------------------------------------

    async def get_course_detail(self, slug: str) -> CourseDetailResponse:
        course = next((c for c in _MOCK_COURSES if c.slug == slug), None)
        if course is None:
            raise HTTPException(status_code=404, detail="Course not found")

        sections = _MOCK_COURSE_SECTIONS.get(slug, [])
        return CourseDetailResponse(
            id=course.id,
            slug=course.slug,
            title=course.title,
            description=(
                f"Khoá học {course.title} cung cấp kiến thức nền tảng "
                f"trong lĩnh vực {course.field}, phù hợp cho người mới bắt đầu."
            ),
            price=course.price,
            price_type=course.price_type,
            field=course.field,
            tags=course.tags,
            enrolled_count=course.enrolled_count,
            rating=course.rating,
            sections=sections,
        )

    # ------------------------------------------------------------------
    # Endpoint 3 — POST /courses/{slug}/enroll  → 201
    # ------------------------------------------------------------------

    async def enroll_course(self, slug: str, user_id: int) -> EnrollResponse:
        course = next((c for c in _MOCK_COURSES if c.slug == slug), None)
        if course is None:
            raise HTTPException(status_code=404, detail="Course not found")

        if course.price_type == PriceType.PAID:
            return EnrollResponse(
                status=EnrollStatus.PENDING_PAYMENT,
                checkout_url=f"https://pay.cloudian.dev/checkout/{slug}",
            )

        return EnrollResponse(status=EnrollStatus.ENROLLED, checkout_url=None)

    # ------------------------------------------------------------------
    # Endpoint 4 — GET /student/courses
    # ------------------------------------------------------------------

    async def get_enrolled_courses(self, user_id: int) -> StudentCoursesResponse:
        return StudentCoursesResponse(items=_MOCK_ENROLLED_COURSES)

    # ------------------------------------------------------------------
    # Endpoint 5 — GET /student/courses/{slug}/study
    # ------------------------------------------------------------------

    async def get_study_content(self, slug: str, user_id: int) -> StudyResponse:
        study = _MOCK_STUDY_DATA.get(slug)
        if study is None:
            raise HTTPException(
                status_code=404,
                detail="Course not found or you are not enrolled",
            )
        return study

    # ------------------------------------------------------------------
    # Endpoint 6 — POST /student/progress/lesson-content/{id}/complete
    # ------------------------------------------------------------------

    async def complete_lesson_content(
        self, lesson_content_id: int, user_id: int
    ) -> CompleteContentResponse:
        if lesson_content_id not in _VALID_LESSON_CONTENT_IDS:
            raise HTTPException(
                status_code=404, detail="Lesson content not found"
            )
        return CompleteContentResponse(
            message="Lesson content marked as completed",
            completed_at=datetime.now(timezone.utc),
        )

    # ------------------------------------------------------------------
    # Endpoint 7 — GET /student/quizzes/{quizId}
    # NOTE: QuizResponse never exposes is_correct — answer key is kept in
    #       _MOCK_QUIZ_ANSWER_KEY (internal dict, never part of any response schema)
    # ------------------------------------------------------------------

    async def get_quiz(self, quiz_id: int) -> QuizResponse:
        quiz = _MOCK_QUIZZES.get(quiz_id)
        if quiz is None:
            raise HTTPException(status_code=404, detail="Quiz not found")
        return quiz

    # ------------------------------------------------------------------
    # Endpoint 8 — POST /student/quizzes/{quizId}/submit
    # ------------------------------------------------------------------

    async def submit_quiz(
        self, quiz_id: int, payload: QuizSubmitRequest, user_id: int
    ) -> QuizSubmitResponse:
        quiz = _MOCK_QUIZZES.get(quiz_id)
        if quiz is None:
            raise HTTPException(status_code=404, detail="Quiz not found")

        if not payload.answers:
            raise HTTPException(
                status_code=400, detail="At least one answer is required"
            )

        answer_key = _MOCK_QUIZ_ANSWER_KEY.get(quiz_id, {})
        total_count = len(quiz.questions)
        correct_count = sum(
            1
            for q_id, chosen_option_id in payload.answers.items()
            if answer_key.get(q_id) == chosen_option_id
        )
        score = round((correct_count / total_count) * 10, 2) if total_count else 0.0
        passed = score >= 5.0

        return QuizSubmitResponse(
            submission_id=1001,
            score=score,
            passed=passed,
            correct_answers=correct_count,
            total_count=total_count,
        )

    # ------------------------------------------------------------------
    # Endpoint 9 — POST /courses/{slug}/unenroll
    # ------------------------------------------------------------------

    async def unenroll_course(self, slug: str, user_id: int) -> UnenrollResponse:
        course = next((c for c in _MOCK_COURSES if c.slug == slug), None)
        if course is None:
            raise HTTPException(status_code=404, detail="Course not found")

        return UnenrollResponse(message=f"Successfully unenrolled from course '{course.title}'")
