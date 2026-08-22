from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import select, func, and_
from src.models.course_model import CourseModel
from src.models.base_model import CourseStatus
from src.models.enrollment_model import EnrollmentModel
from src.models.course_review_model import CourseReviewModel

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
    InstructorCatalogResponse,
    InstructorDetailResponse,
    InstructorItemResponse,
)

# ---------------------------------------------------------------------------
# Static mock catalogue â€” realistic data, no placeholder strings
# ---------------------------------------------------------------------------

_MOCK_COURSES = [
    CourseItemResponse(
        id=1,
        slug="nhap-mon-lap-trinh-python",
        title="Nháº­p mÃ´n Láº­p trÃ¬nh Python",
        thumbnail_url="https://cdn.cloudian.dev/courses/python-intro.jpg",
        price=0.0,
        price_type=PriceType.FREE,
        field="Láº­p trÃ¬nh",
        tags=["python", "beginner", "programming"],
        enrolled_count=3120,
        rating=4.8,
    ),
    CourseItemResponse(
        id=2,
        slug="cau-truc-du-lieu-va-giai-thuat",
        title="Cáº¥u trÃºc Dá»¯ liá»‡u vÃ  Giáº£i thuáº­t",
        thumbnail_url="https://cdn.cloudian.dev/courses/dsa.jpg",
        price=299000.0,
        price_type=PriceType.PAID,
        field="Khoa há»c MÃ¡y tÃ­nh",
        tags=["dsa", "algorithms", "intermediate"],
        enrolled_count=1845,
        rating=4.9,
    ),
    CourseItemResponse(
        id=3,
        slug="lap-trinh-web-voi-fastapi",
        title="Láº­p trÃ¬nh Web vá»›i FastAPI",
        thumbnail_url="https://cdn.cloudian.dev/courses/fastapi.jpg",
        price=399000.0,
        price_type=PriceType.PAID,
        field="Web Development",
        tags=["fastapi", "python", "backend", "api"],
        enrolled_count=972,
        rating=4.7,
    ),
    CourseItemResponse(
        id=4,
        slug="co-so-du-lieu-sql",
        title="CÆ¡ sá»Ÿ Dá»¯ liá»‡u vÃ  SQL",
        thumbnail_url="https://cdn.cloudian.dev/courses/sql.jpg",
        price=0.0,
        price_type=PriceType.FREE,
        field="CÆ¡ sá»Ÿ Dá»¯ liá»‡u",
        tags=["sql", "database", "beginner"],
        enrolled_count=2500,
        rating=4.6,
    ),
]

# Map slug -> detail-level data (sections overview)
_MOCK_COURSE_SECTIONS = {
    "nhap-mon-lap-trinh-python": [
        SectionOverviewResponse(id=1, title="Giá»›i thiá»‡u Python", position=0, lesson_count=4),
        SectionOverviewResponse(id=2, title="Kiá»ƒu dá»¯ liá»‡u vÃ  Biáº¿n", position=1, lesson_count=5),
        SectionOverviewResponse(id=3, title="Cáº¥u trÃºc Ä‘iá»u kiá»‡n vÃ  vÃ²ng láº·p", position=2, lesson_count=6),
    ],
    "cau-truc-du-lieu-va-giai-thuat": [
        SectionOverviewResponse(id=4, title="Máº£ng vÃ  Danh sÃ¡ch liÃªn káº¿t", position=0, lesson_count=5),
        SectionOverviewResponse(id=5, title="Stack vÃ  Queue", position=1, lesson_count=4),
        SectionOverviewResponse(id=6, title="Sáº¯p xáº¿p vÃ  TÃ¬m kiáº¿m", position=2, lesson_count=7),
    ],
    "lap-trinh-web-voi-fastapi": [
        SectionOverviewResponse(id=7, title="CÃ i Ä‘áº·t mÃ´i trÆ°á»ng FastAPI", position=0, lesson_count=3),
        SectionOverviewResponse(id=8, title="Routing vÃ  Request Handling", position=1, lesson_count=5),
        SectionOverviewResponse(id=9, title="Pydantic vÃ  Validation", position=2, lesson_count=4),
    ],
    "co-so-du-lieu-sql": [
        SectionOverviewResponse(id=10, title="Giá»›i thiá»‡u cÆ¡ sá»Ÿ dá»¯ liá»‡u", position=0, lesson_count=3),
        SectionOverviewResponse(id=11, title="CÃ¢u lá»‡nh SELECT nÃ¢ng cao", position=1, lesson_count=5),
    ],
}

# Mock enrolled courses for seed student (user_id=1)
_MOCK_ENROLLED_COURSES = []

# Study mode mock â€” slug -> full curriculum with locked/completed flags
# Rule (mock only): first 2 lessons locked=False, rest locked=True
_MOCK_STUDY_DATA = {}
_MOCK_QUIZZES: dict[int, QuizResponse] = {
    1: QuizResponse(
        id=1,
        title="Kiá»ƒm tra kiáº¿n thá»©c Python cÆ¡ báº£n",
        questions=[
            QuizQuestionResponse(
                id=1,
                question_text="Python lÃ  ngÃ´n ngá»¯ láº­p trÃ¬nh thuá»™c loáº¡i nÃ o?",
                options=[
                    QuizOptionResponse(id=1, text="NgÃ´n ngá»¯ biÃªn dá»‹ch (Compiled)"),
                    QuizOptionResponse(id=2, text="NgÃ´n ngá»¯ thÃ´ng dá»‹ch (Interpreted)"),
                    QuizOptionResponse(id=3, text="NgÃ´n ngá»¯ há»£p ngá»¯ (Assembly)"),
                    QuizOptionResponse(id=4, text="NgÃ´n ngá»¯ mÃ¡y (Machine code)"),
                ],
            ),
            QuizQuestionResponse(
                id=2,
                question_text="HÃ m nÃ o dÃ¹ng Ä‘á»ƒ in ra mÃ n hÃ¬nh trong Python?",
                options=[
                    QuizOptionResponse(id=1, text="echo()"),
                    QuizOptionResponse(id=2, text="console.log()"),
                    QuizOptionResponse(id=3, text="print()"),
                    QuizOptionResponse(id=4, text="write()"),
                ],
            ),
            QuizQuestionResponse(
                id=3,
                question_text="Káº¿t quáº£ cá»§a biá»ƒu thá»©c 3 ** 2 trong Python lÃ ?",
                options=[
                    QuizOptionResponse(id=1, text="9"),
                    QuizOptionResponse(id=2, text="6"),
                    QuizOptionResponse(id=3, text="32"),
                    QuizOptionResponse(id=4, text="Lá»—i cÃº phÃ¡p"),
                ],
            ),
        ],
    ),
}


class CourseService:
    """
    Service layer for Module 2: Student Course Directory & Study Mode.
    All methods use mock data â€” DB integration is deferred until API contract is stable.
    """

    def __init__(self, db_session):
        self.db_session = db_session

    # ------------------------------------------------------------------
    # Endpoint 1 â€” GET /courses
    # ------------------------------------------------------------------

    async def get_course_catalog(
        self,
        page: int,
        size: int,
        q: str | None,
        price_type: PriceType | None,
    ) -> CourseCatalogResponse:
        query = select(CourseModel).where(CourseModel.status == CourseStatus.APPROVED)

        if q:
            query = query.where(CourseModel.title.ilike(f"%{q}%"))

        if price_type == PriceType.FREE:
            query = query.where(CourseModel.price == 0)
        elif price_type == PriceType.PAID:
            query = query.where(CourseModel.price > 0)

        count_query = select(func.count()).select_from(query.subquery())
        total_items = await self.db_session.scalar(count_query) or 0
        total_pages = max(1, (total_items + size - 1) // size)
        
        start = (page - 1) * size
        query = query.offset(start).limit(size)
        
        result = await self.db_session.execute(query)
        courses = result.scalars().all()
        
        items = []
        if courses:
            course_ids = [c.id for c in courses]
            
            enr_query = select(EnrollmentModel.course_id, func.count(EnrollmentModel.id)).where(EnrollmentModel.course_id.in_(course_ids)).group_by(EnrollmentModel.course_id)
            enr_res = await self.db_session.execute(enr_query)
            enr_map = dict(enr_res.all())
            
            rating_query = select(CourseReviewModel.course_id, func.avg(CourseReviewModel.rating)).where(CourseReviewModel.course_id.in_(course_ids)).group_by(CourseReviewModel.course_id)
            rating_res = await self.db_session.execute(rating_query)
            rating_map = dict(rating_res.all())
            
            for course in courses:
                enr_count = enr_map.get(course.id, 0)
                avg_rating = rating_map.get(course.id, 0.0)
                tags_list = course.tags.split(",") if course.tags else []
                
                items.append(CourseItemResponse(
                    id=course.id,
                    slug=course.slug,
                    title=course.title,
                    thumbnail_url=course.thumbnail_url or "",
                    price=float(course.price),
                    price_type=PriceType.FREE if course.price == 0 else PriceType.PAID,
                    field=course.field or "",
                    tags=[t.strip() for t in tags_list if t.strip()],
                    enrolled_count=enr_count,
                    rating=round(float(avg_rating), 1) if avg_rating else 0.0,
                ))

        return CourseCatalogResponse(
            total_items=total_items,
            total_pages=total_pages,
            current_page=page,
            items=items,
        )

    # ------------------------------------------------------------------
    # Endpoint 2 â€” GET /courses/{slug}
    # ------------------------------------------------------------------

    async def get_course_detail(self, slug: str) -> CourseDetailResponse:
        query = select(CourseModel).where(and_(CourseModel.slug == slug, CourseModel.status == CourseStatus.APPROVED))
        result = await self.db_session.execute(query)
        course = result.scalar_one_or_none()
        if course is None:
            raise HTTPException(status_code=404, detail="KhoÃ¡ há»c khÃ´ng tá»“n táº¡i")
        
        # Enrolled count and rating
        enrolled_count = await self.db_session.scalar(select(func.count(EnrollmentModel.id)).where(EnrollmentModel.course_id == course.id))
        avg_rating = await self.db_session.scalar(select(func.avg(CourseReviewModel.rating)).where(CourseReviewModel.course_id == course.id))
        tags_list = course.tags.split(",") if course.tags else []

        # Fetch sections
        from src.models.section_model import SectionModel
        from src.models.lesson_model import LessonModel
        from src.models.section_model import SectionModel
        
        sections_query = select(SectionModel).where(SectionModel.course_id == course.id).order_by(SectionModel.position)
        sections_res = await self.db_session.execute(sections_query)
        sections = sections_res.scalars().all()
        
        section_responses = []
        if sections:
            sec_ids = [s.id for s in sections]
            lc_query = select(LessonModel.section_id, func.count(LessonModel.id)).where(LessonModel.section_id.in_(sec_ids)).group_by(LessonModel.section_id)
            lc_res = await self.db_session.execute(lc_query)
            lc_map = dict(lc_res.all())
            
            for sec in sections:
                lesson_count = lc_map.get(sec.id, 0)
                section_responses.append(SectionOverviewResponse(
                    id=sec.id,
                    title=sec.title,
                    position=sec.position,
                    lesson_count=lesson_count
                ))
            
        return CourseDetailResponse(
            id=course.id,
            slug=course.slug,
            title=course.title,
            description=course.description or "",
            price=float(course.price),
            price_type=PriceType.FREE if course.price == 0 else PriceType.PAID,
            field=course.field or "",
            tags=[t.strip() for t in tags_list if t.strip()],
            enrolled_count=enrolled_count or 0,
            rating=round(float(avg_rating), 1) if avg_rating else 0.0,
            sections=section_responses,
        )

    # ------------------------------------------------------------------
    # Endpoint 3 â€” GET /instructors
    # ------------------------------------------------------------------
    async def get_instructor_catalog(
        self,
        page: int,
        size: int,
        q: str | None,
    ) -> "InstructorCatalogResponse":
        from src.models.user_model import UserModel
        from src.models.teacher_profile_model import TeacherProfileModel
        from src.models.role_model import UserRoleModel
        from src.models.base_model import Role
        
        query = select(UserModel).join(UserModel.roles).where(UserRoleModel.role == Role.TEACHER)
        if q:
            query = query.where(UserModel.full_name.ilike(f"%{q}%"))
            
        count_query = select(func.count()).select_from(query.subquery())
        total_items = await self.db_session.scalar(count_query) or 0
        total_pages = max(1, (total_items + size - 1) // size)
        
        start = (page - 1) * size
        query = query.offset(start).limit(size)
        result = await self.db_session.execute(query)
        users = result.scalars().all()
        
        items = []
        if users:
            user_ids = [u.id for u in users]
            
            prof_query = select(TeacherProfileModel).where(TeacherProfileModel.user_id.in_(user_ids))
            prof_res = await self.db_session.execute(prof_query)
            prof_map = {p.user_id: p for p in prof_res.scalars().all()}
            
            cc_query = select(CourseModel.teacher_id, func.count(CourseModel.id)).where(and_(CourseModel.teacher_id.in_(user_ids), CourseModel.status == CourseStatus.APPROVED)).group_by(CourseModel.teacher_id)
            cc_res = await self.db_session.execute(cc_query)
            cc_map = dict(cc_res.all())
            
            enr_query = select(CourseModel.teacher_id, func.count(EnrollmentModel.id)).join(CourseModel).where(and_(CourseModel.teacher_id.in_(user_ids), CourseModel.status == CourseStatus.APPROVED)).group_by(CourseModel.teacher_id)
            enr_res = await self.db_session.execute(enr_query)
            enr_map = dict(enr_res.all())
            
            rating_query = select(CourseModel.teacher_id, func.avg(CourseReviewModel.rating)).join(CourseModel).where(and_(CourseModel.teacher_id.in_(user_ids), CourseModel.status == CourseStatus.APPROVED)).group_by(CourseModel.teacher_id)
            rating_res = await self.db_session.execute(rating_query)
            rating_map = dict(rating_res.all())
            
            for user in users:
                profile = prof_map.get(user.id)
                course_count = cc_map.get(user.id, 0)
                enrolled = enr_map.get(user.id, 0)
                avg_rating = rating_map.get(user.id, 0.0)
                
                items.append(InstructorItemResponse(
                    id=user.id,
                    full_name=user.full_name,
                    headline=profile.headline if profile else None,
                    avatar_url=profile.avatar_url if profile else None,
                    enrolled_students=enrolled,
                    course_count=course_count,
                    rating=round(float(avg_rating), 1) if avg_rating else 0.0,
                ))
            
        return InstructorCatalogResponse(
            total_items=total_items,
            total_pages=total_pages,
            current_page=page,
            items=items,
        )

    # ------------------------------------------------------------------
    # Endpoint 4 â€” GET /instructors/{user_id}
    # ------------------------------------------------------------------
    async def get_instructor_detail(
        self,
        user_id: int
    ) -> "InstructorDetailResponse":
        from src.models.user_model import UserModel
        from src.models.teacher_profile_model import TeacherProfileModel
        from src.models.role_model import UserRoleModel
        from src.models.base_model import Role
        import json
        import logging
        logger = logging.getLogger(__name__)
        
        query = select(UserModel).join(UserModel.roles).where(and_(UserModel.id == user_id, UserRoleModel.role == Role.TEACHER))
        result = await self.db_session.execute(query)
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="Giáº£ng viÃªn khÃ´ng tá»“n táº¡i")
            
        profile = await self.db_session.scalar(select(TeacherProfileModel).where(TeacherProfileModel.user_id == user.id))
        
        course_query = select(CourseModel).where(and_(CourseModel.teacher_id == user.id, CourseModel.status == CourseStatus.APPROVED))
        course_res = await self.db_session.execute(course_query)
        courses = course_res.scalars().all()
        
        course_items = []
        enrolled_total = 0
        rating_sum = 0
        rating_count = 0
        
        if courses:
            course_ids = [c.id for c in courses]
            enr_query = select(EnrollmentModel.course_id, func.count(EnrollmentModel.id)).where(EnrollmentModel.course_id.in_(course_ids)).group_by(EnrollmentModel.course_id)
            enr_res = await self.db_session.execute(enr_query)
            enr_map = dict(enr_res.all())
            
            rating_query = select(CourseReviewModel.course_id, func.avg(CourseReviewModel.rating)).where(CourseReviewModel.course_id.in_(course_ids)).group_by(CourseReviewModel.course_id)
            rating_res = await self.db_session.execute(rating_query)
            rating_map = dict(rating_res.all())
            
            for course in courses:
                enr_count = enr_map.get(course.id, 0)
                avg_rating = rating_map.get(course.id, 0.0)
                tags_list = course.tags.split(",") if course.tags else []
                enrolled_total += enr_count
                if avg_rating:
                    rating_sum += float(avg_rating)
                    rating_count += 1
                
                course_items.append(CourseItemResponse(
                    id=course.id,
                    slug=course.slug,
                    title=course.title,
                    thumbnail_url=course.thumbnail_url or "",
                    price=float(course.price),
                    price_type=PriceType.FREE if course.price == 0 else PriceType.PAID,
                    field=course.field or "",
                    tags=[t.strip() for t in tags_list if t.strip()],
                    enrolled_count=enr_count,
                    rating=round(float(avg_rating), 1) if avg_rating else 0.0,
                ))
            
        expertise_tags = []
        if profile and profile.expertise_tags:
            try:
                expertise_tags = json.loads(profile.expertise_tags)
            except json.JSONDecodeError as e:
                logger.warning(f"Failed to parse expertise_tags for user {user.id}: {e}")
                
        return InstructorDetailResponse(
            id=user.id,
            full_name=user.full_name,
            headline=profile.headline if profile else None,
            avatar_url=profile.avatar_url if profile else None,
            expertise_tags=expertise_tags,
            enrolled_students=enrolled_total,
            course_count=len(courses),
            rating=round(rating_sum / rating_count, 1) if rating_count > 0 else 0.0,
            courses=course_items,
        )

    # ------------------------------------------------------------------
    # Endpoint 5 â€” POST /courses/{slug}/enroll  â†’ 201
    # ------------------------------------------------------------------

    async def enroll_course(self, slug: str, user_id: int) -> EnrollResponse:
        course = next((c for c in _MOCK_COURSES if c.slug == slug), None)
        if course is None:
            raise HTTPException(status_code=404, detail="KhoÃ¡ há»c khÃ´ng tá»“n táº¡i")

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
        from src.models.lesson_content_progress_model import LessonContentProgressModel
        from src.models.lesson_content_model import LessonContentModel
        from src.models.lesson_model import LessonModel
        from src.models.section_model import SectionModel
        from src.models.base_model import LessonContentType
        
        enr_query = select(EnrollmentModel, CourseModel).join(CourseModel, EnrollmentModel.course_id == CourseModel.id).where(EnrollmentModel.student_id == user_id)
        enr_res = await self.db_session.execute(enr_query)
        enrollments = enr_res.all()
        
        items = []
        if enrollments:
            course_ids = [c.id for enr, c in enrollments]
            
            # progress_percent hiện chỉ tính trên nội dung READING; Quiz/Problem progress chưa được tính vào đây do nằm ngoài phạm vi Module 2 (xem gap quiz_attempt đã ghi trong ADR)
            total_content_query = select(SectionModel.course_id, func.count(LessonContentModel.id)).join(LessonModel, LessonModel.section_id == SectionModel.id).join(LessonContentModel, LessonContentModel.lesson_id == LessonModel.id).where(and_(SectionModel.course_id.in_(course_ids), LessonContentModel.content_type == LessonContentType.READING)).group_by(SectionModel.course_id)
            total_res = await self.db_session.execute(total_content_query)
            total_map = {row[0]: row[1] for row in total_res.all()}
            
            enr_ids = [enr.id for enr, c in enrollments]
            completed_query = select(LessonContentProgressModel.enrollment_id, func.count(LessonContentProgressModel.id)).where(and_(LessonContentProgressModel.enrollment_id.in_(enr_ids), LessonContentProgressModel.completed == True)).group_by(LessonContentProgressModel.enrollment_id)
            completed_res = await self.db_session.execute(completed_query)
            completed_map = {row[0]: row[1] for row in completed_res.all()}
            
            for enr, course in enrollments:
                total_c = total_map.get(course.id, 0)
                comp_c = completed_map.get(enr.id, 0)
                progress = round((comp_c / total_c) * 100, 1) if total_c > 0 else 0.0
                
                items.append(EnrolledCourseResponse(
                    id=course.id,
                    slug=course.slug,
                    title=course.title,
                    thumbnail_url=course.thumbnail_url or "",
                    progress_percent=progress
                ))
                
        return StudentCoursesResponse(items=items)

    # ------------------------------------------------------------------
    # Endpoint 5 — GET /student/courses/{slug}/study
    # ------------------------------------------------------------------
    async def get_study_content(self, slug: str, user_id: int) -> StudyResponse:
        from src.models.lesson_content_progress_model import LessonContentProgressModel
        from src.models.lesson_content_model import LessonContentModel
        from src.models.lesson_model import LessonModel
        from src.models.section_model import SectionModel
        from src.models.section_model import SectionModel
        from src.modules.student_course_directory.course_dto import LessonContentStudyResponse, LessonStudyResponse, SectionStudyResponse, CourseItemResponse
        
        course = await self.db_session.scalar(select(CourseModel).where(CourseModel.slug == slug))
        if not course:
            raise HTTPException(status_code=404, detail="Khoá học không tồn tại")
            
        enr = await self.db_session.scalar(select(EnrollmentModel).where(and_(EnrollmentModel.course_id == course.id, EnrollmentModel.student_id == user_id)))
        if not enr:
            raise HTTPException(status_code=404, detail="Khoá học không tồn tại hoặc bạn chưa đăng ký")
            
        sections_res = await self.db_session.execute(select(SectionModel).where(SectionModel.course_id == course.id).order_by(SectionModel.position))
        sections = sections_res.scalars().all()
        
        lessons_res = await self.db_session.execute(select(LessonModel).join(SectionModel, LessonModel.section_id == SectionModel.id).where(SectionModel.course_id == course.id).order_by(LessonModel.position))
        lessons = lessons_res.scalars().all()
        
        lesson_ids = [l.id for l in lessons]
        contents = []
        if lesson_ids:
            contents_res = await self.db_session.execute(select(LessonContentModel).where(LessonContentModel.lesson_id.in_(lesson_ids)).order_by(LessonContentModel.position))
            contents = contents_res.scalars().all()
            
        progress_res = await self.db_session.execute(select(LessonContentProgressModel).where(LessonContentProgressModel.enrollment_id == enr.id))
        progresses = progress_res.scalars().all()
        progress_map = {p.lesson_content_id: p for p in progresses}
        
        section_dtos = []
        for sec in sections:
            sec_lessons = [l for l in lessons if l.section_id == sec.id]
            lesson_dtos = []
            for l in sec_lessons:
                l_contents = [c for c in contents if c.lesson_id == l.id]
                content_dtos = []
                for c in l_contents:
                    prog = progress_map.get(c.id)
                    completed = prog.completed if prog else False
                    content_dtos.append(LessonContentStudyResponse(
                        id=c.id,
                        content_type=c.content_type,
                        media_url=c.media_url,
                        position=c.position,
                        locked=False,
                        completed=completed
                    ))
                lesson_dtos.append(LessonStudyResponse(
                    id=l.id,
                    title=l.title,
                    position=l.position,
                    locked=False,
                    contents=content_dtos
                ))
            section_dtos.append(SectionStudyResponse(
                id=sec.id,
                title=sec.title,
                position=sec.position,
                lessons=lesson_dtos
            ))
            
        enr_count_res = await self.db_session.scalar(select(func.count(EnrollmentModel.id)).where(EnrollmentModel.course_id == course.id))
        rating_res = await self.db_session.scalar(select(func.avg(CourseReviewModel.rating)).where(CourseReviewModel.course_id == course.id))
        tags_list = course.tags.split(",") if course.tags else []
        
        c_item = CourseItemResponse(
            id=course.id,
            slug=course.slug,
            title=course.title,
            thumbnail_url=course.thumbnail_url or "",
            price=float(course.price),
            price_type=PriceType.FREE if course.price == 0 else PriceType.PAID,
            field=course.field or "",
            tags=[t.strip() for t in tags_list if t.strip()],
            enrolled_count=enr_count_res or 0,
            rating=round(float(rating_res), 1) if rating_res else 0.0,
        )
        
        return StudyResponse(course=c_item, sections=section_dtos)

    # ------------------------------------------------------------------
    # Endpoint 6 — POST /student/progress/lesson-content/{id}/complete
    # ------------------------------------------------------------------
    async def complete_lesson_content(self, lesson_content_id: int, user_id: int) -> CompleteContentResponse:
        from src.models.lesson_content_progress_model import LessonContentProgressModel
        from src.models.lesson_content_model import LessonContentModel
        from src.models.base_model import LessonContentType
        from src.models.lesson_model import LessonModel
        from sqlalchemy.orm import joinedload
        
        content = await self.db_session.scalar(select(LessonContentModel).options(joinedload(LessonContentModel.lesson).joinedload(LessonModel.section)).where(LessonContentModel.id == lesson_content_id))
        if not content:
            raise HTTPException(status_code=404, detail="Nội dung bài học không tồn tại")
            
        if content.content_type != LessonContentType.READING:
            # TODO: Quiz/Problem completion will be handled by their respective submit endpoints
            raise HTTPException(status_code=400, detail="Chỉ có thể đánh dấu hoàn thành cho nội dung READING")
            
        enr = await self.db_session.scalar(select(EnrollmentModel).where(and_(EnrollmentModel.course_id == content.lesson.section.course_id, EnrollmentModel.student_id == user_id)))
        if not enr:
            raise HTTPException(status_code=403, detail="Chưa đăng ký khoá học này")
            
        prog = await self.db_session.scalar(select(LessonContentProgressModel).where(and_(LessonContentProgressModel.enrollment_id == enr.id, LessonContentProgressModel.lesson_content_id == lesson_content_id)))
        
        if not prog:
            prog = LessonContentProgressModel(
                enrollment_id=enr.id,
                lesson_content_id=lesson_content_id,
                completed=True,
                completed_at=datetime.now(timezone.utc)
            )
            self.db_session.add(prog)
        else:
            prog.completed = True
            prog.completed_at = datetime.now(timezone.utc)
            
        await self.db_session.flush()
        
        return CompleteContentResponse(
            id=prog.id,
            enrollment_id=prog.enrollment_id,
            lesson_content_id=lesson_content_id,
            completed=True,
            completed_at=prog.completed_at
        )

    # ------------------------------------------------------------------
    # Endpoint 6.5 — GET /student/progress
    # ------------------------------------------------------------------
    async def get_student_progress(self, user_id: int, course_id: int | None, page: int, size: int):
        from src.models.lesson_content_progress_model import LessonContentProgressModel
        from src.modules.student_course_directory.course_dto import ProgressListResponse, LessonContentProgressView
        
        query = select(LessonContentProgressModel).join(EnrollmentModel, LessonContentProgressModel.enrollment_id == EnrollmentModel.id).where(EnrollmentModel.student_id == user_id)
        if course_id:
            query = query.where(EnrollmentModel.course_id == course_id)
            
        count_query = select(func.count()).select_from(query.subquery())
        total_items = await self.db_session.scalar(count_query) or 0
        total_pages = max(1, (total_items + size - 1) // size)
        
        start = (page - 1) * size
        query = query.offset(start).limit(size)
        
        res = await self.db_session.execute(query)
        progs = res.scalars().all()
        
        items = []
        for p in progs:
            items.append(LessonContentProgressView(
                id=p.id,
                enrollment_id=p.enrollment_id,
                lesson_content_id=p.lesson_content_id,
                completed=p.completed,
                completed_at=p.completed_at
            ))
            
        return ProgressListResponse(
            items=items,
            total_items=total_items,
            total_pages=total_pages,
            current_page=page
        )

    # ------------------------------------------------------------------
    # Endpoint 7 â€” GET /student/quizzes/{quizId}
    # NOTE: QuizResponse never exposes is_correct â€” answer key is kept in
    #       _MOCK_QUIZ_ANSWER_KEY (internal dict, never part of any response schema)
    # ------------------------------------------------------------------

    async def get_quiz(self, quiz_id: int) -> QuizResponse:
        quiz = _MOCK_QUIZZES.get(quiz_id)
        if quiz is None:
            raise HTTPException(status_code=404, detail="BÃ i kiá»ƒm tra khÃ´ng tá»“n táº¡i")
        return quiz

    # ------------------------------------------------------------------
    # Endpoint 8 â€” POST /student/quizzes/{quizId}/submit
    # ------------------------------------------------------------------

    async def submit_quiz(
        self, quiz_id: int, payload: QuizSubmitRequest, user_id: int
    ) -> QuizSubmitResponse:
        quiz = _MOCK_QUIZZES.get(quiz_id)
        if quiz is None:
            raise HTTPException(status_code=404, detail="BÃ i kiá»ƒm tra khÃ´ng tá»“n táº¡i")

        if not payload.answers:
            raise HTTPException(
                status_code=400, detail="Cáº§n cung cáº¥p Ã­t nháº¥t má»™t cÃ¢u tráº£ lá»i"
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
            correct_count=correct_count,
            total_count=total_count,
        )

    # ------------------------------------------------------------------
    # Endpoint 9 â€” POST /courses/{slug}/unenroll
    # ------------------------------------------------------------------

    async def unenroll_course(self, slug: str, user_id: int) -> UnenrollResponse:
        course = next((c for c in _MOCK_COURSES if c.slug == slug), None)
        if course is None:
            raise HTTPException(status_code=404, detail="KhoÃ¡ há»c khÃ´ng tá»“n táº¡i")

        return UnenrollResponse(message=f"ÄÃ£ huá»· Ä‘Äƒng kÃ½ khoÃ¡ há»c '{course.title}' thÃ nh cÃ´ng")

    # ------------------------------------------------------------------
    # Endpoint 10 â€” GET /favorites
    # ------------------------------------------------------------------
    async def get_favorite_courses(self, user_id: int, page: int, size: int) -> "CourseFavoriteListResponse":
        from src.models.course_favorite_model import CourseFavoriteModel
        query = select(CourseFavoriteModel).where(CourseFavoriteModel.student_id == user_id)
        
        count_query = select(func.count()).select_from(query.subquery())
        total_items = await self.db_session.scalar(count_query) or 0
        total_pages = max(1, (total_items + size - 1) // size)
        
        start = (page - 1) * size
        query = query.offset(start).limit(size)
        
        result = await self.db_session.execute(query)
        favorites = result.scalars().all()
        
        items = []
        if favorites:
            course_ids = [fav.course_id for fav in favorites]
            course_query = select(CourseModel).where(CourseModel.id.in_(course_ids))
            course_res = await self.db_session.execute(course_query)
            course_map = {c.id: c for c in course_res.scalars().all()}
            
            enr_query = select(EnrollmentModel.course_id, func.count(EnrollmentModel.id)).where(EnrollmentModel.course_id.in_(course_ids)).group_by(EnrollmentModel.course_id)
            enr_res = await self.db_session.execute(enr_query)
            enr_map = dict(enr_res.all())
            
            rating_query = select(CourseReviewModel.course_id, func.avg(CourseReviewModel.rating)).where(CourseReviewModel.course_id.in_(course_ids)).group_by(CourseReviewModel.course_id)
            rating_res = await self.db_session.execute(rating_query)
            rating_map = dict(rating_res.all())
            
            for fav in favorites:
                course = course_map.get(fav.course_id)
                if not course:
                    continue
                enr_count = enr_map.get(course.id, 0)
                avg_rating = rating_map.get(course.id, 0.0)
                tags_list = course.tags.split(",") if course.tags else []
                
                course_item = CourseItemResponse(
                    id=course.id,
                    slug=course.slug,
                    title=course.title,
                    thumbnail_url=course.thumbnail_url or "",
                    price=float(course.price),
                    price_type=PriceType.FREE if course.price == 0 else PriceType.PAID,
                    field=course.field or "",
                    tags=[t.strip() for t in tags_list if t.strip()],
                    enrolled_count=enr_count,
                    rating=round(float(avg_rating), 1) if avg_rating else 0.0,
                )
                items.append({
                    "id": fav.id,
                    "student_id": fav.student_id,
                    "course_id": fav.course_id,
                    "created_at": fav.created_at,
                    "course": course_item
                })
        
        from src.modules.student_course_directory.course_dto import CourseFavoriteListResponse
        return CourseFavoriteListResponse(
            total_items=total_items,
            total_pages=total_pages,
            current_page=page,
            items=items,
        )

    # ------------------------------------------------------------------
    # Endpoint 11 â€” PUT /courses/{course_id}/favorite
    # ------------------------------------------------------------------
    async def add_favorite_course(self, course_id: int, user_id: int) -> "CourseFavoriteToggleResponse":
        from src.models.course_favorite_model import CourseFavoriteModel
        
        # Verify course exists
        course = await self.db_session.scalar(select(CourseModel).where(CourseModel.id == course_id))
        if not course:
            raise HTTPException(status_code=404, detail="KhoÃ¡ há»c khÃ´ng tá»“n táº¡i")
            
        # Check if already favorited
        query = select(CourseFavoriteModel).where(and_(CourseFavoriteModel.student_id == user_id, CourseFavoriteModel.course_id == course_id))
        result = await self.db_session.execute(query)
        fav = result.scalar_one_or_none()
        
        if not fav:
            fav = CourseFavoriteModel(student_id=user_id, course_id=course_id)
            self.db_session.add(fav)
            await self.db_session.flush()
            
        from src.modules.student_course_directory.course_dto import CourseFavoriteToggleResponse
        return CourseFavoriteToggleResponse(
            id=fav.id,
            student_id=fav.student_id,
            course_id=fav.course_id,
            created_at=fav.created_at,
            is_favorited=True
        )

    # ------------------------------------------------------------------
    # Endpoint 12 â€” DELETE /courses/{course_id}/favorite
    # ------------------------------------------------------------------
    async def remove_favorite_course(self, course_id: int, user_id: int) -> "CourseFavoriteToggleResponse":
        from src.models.course_favorite_model import CourseFavoriteModel
        
        query = select(CourseFavoriteModel).where(and_(CourseFavoriteModel.student_id == user_id, CourseFavoriteModel.course_id == course_id))
        result = await self.db_session.execute(query)
        fav = result.scalar_one_or_none()
        
        if fav:
            await self.db_session.delete(fav)
            await self.db_session.flush()
            
        from src.modules.student_course_directory.course_dto import CourseFavoriteToggleResponse
        return CourseFavoriteToggleResponse(
            course_id=course_id,
            is_favorited=False
        )
    # ------------------------------------------------------------------
    # Endpoint 13 â€” POST /courses/{course_id}/reviews
    # ------------------------------------------------------------------
    async def add_course_review(self, course_id: int, user_id: int, payload: "CourseReviewWrite") -> "CourseReviewView":
        from src.models.course_review_model import CourseReviewModel
        from src.models.user_model import UserModel
        
        # Check course exists
        course = await self.db_session.scalar(select(CourseModel).where(CourseModel.id == course_id))
        if not course:
            raise HTTPException(status_code=404, detail="KhoÃ¡ há»c khÃ´ng tá»“n táº¡i")
            
        # Check enrollment
        enr = await self.db_session.scalar(select(EnrollmentModel).where(and_(EnrollmentModel.course_id == course_id, EnrollmentModel.student_id == user_id)))
        if not enr:
            raise HTTPException(status_code=403, detail="Pháº£i Ä‘Äƒng kÃ½ khoÃ¡ há»c má»›i Ä‘Æ°á»£c Ä‘Ã¡nh giÃ¡")
            
        # Check duplicate
        existing = await self.db_session.scalar(select(CourseReviewModel).where(and_(CourseReviewModel.course_id == course_id, CourseReviewModel.student_id == user_id)))
        if existing:
            raise HTTPException(status_code=409, detail="Báº¡n Ä‘Ã£ Ä‘Ã¡nh giÃ¡ khoÃ¡ há»c nÃ y rá»“i")
            
        review = CourseReviewModel(
            course_id=course_id,
            student_id=user_id,
            rating=payload.rating,
            content=payload.content
        )
        self.db_session.add(review)
        await self.db_session.flush()
        
        # Get student name
        student = await self.db_session.scalar(select(UserModel).where(UserModel.id == user_id))
        
        from src.modules.student_course_directory.course_dto import CourseReviewView
        return CourseReviewView(
            id=review.id,
            course_id=review.course_id,
            student_id=review.student_id,
            student_name=student.full_name if student else None,
            rating=float(review.rating),
            content=review.content,
            created_at=review.created_at,
            updated_at=review.updated_at
        )

    # ------------------------------------------------------------------
    # Endpoint 14 â€” PATCH /courses/{course_id}/reviews/{review_id}
    # ------------------------------------------------------------------
    async def update_course_review(self, course_id: int, review_id: int, user_id: int, payload: "CourseReviewWrite") -> "CourseReviewView":
        from src.models.course_review_model import CourseReviewModel
        from src.models.user_model import UserModel
        
        review = await self.db_session.scalar(select(CourseReviewModel).where(and_(CourseReviewModel.id == review_id, CourseReviewModel.course_id == course_id)))
        if not review:
            raise HTTPException(status_code=404, detail="KhÃ´ng tÃ¬m tháº¥y Ä‘Ã¡nh giÃ¡")
            
        if review.student_id != user_id:
            raise HTTPException(status_code=403, detail="KhÃ´ng Ä‘á»§ quyá»n chá»‰nh sá»­a Ä‘Ã¡nh giÃ¡ nÃ y")
            
        if payload.rating is not None:
            review.rating = payload.rating
        if payload.content is not None:
            review.content = payload.content
            
        await self.db_session.flush()
        
        student = await self.db_session.scalar(select(UserModel).where(UserModel.id == user_id))
        
        from src.modules.student_course_directory.course_dto import CourseReviewView
        return CourseReviewView(
            id=review.id,
            course_id=review.course_id,
            student_id=review.student_id,
            student_name=student.full_name if student else None,
            rating=float(review.rating),
            content=review.content,
            created_at=review.created_at,
            updated_at=review.updated_at
        )

    # ------------------------------------------------------------------
    # Endpoint 15 â€” GET /courses/{course_id}/reviews
    # ------------------------------------------------------------------
    async def get_course_reviews(self, course_id: int, rating: int | None, page: int, size: int) -> "CourseReviewListResponse":
        from src.models.course_review_model import CourseReviewModel
        from src.models.user_model import UserModel
        
        course = await self.db_session.scalar(select(CourseModel).where(CourseModel.id == course_id))
        if not course:
            raise HTTPException(status_code=404, detail="KhoÃ¡ há»c khÃ´ng tá»“n táº¡i")
            
        query = select(CourseReviewModel).where(CourseReviewModel.course_id == course_id)
        if rating is not None:
            query = query.where(CourseReviewModel.rating == rating)
            
        count_query = select(func.count()).select_from(query.subquery())
        total_items = await self.db_session.scalar(count_query) or 0
        total_pages = max(1, (total_items + size - 1) // size)
        
        start = (page - 1) * size
        query = query.offset(start).limit(size).order_by(CourseReviewModel.created_at.desc())
        
        result = await self.db_session.execute(query)
        reviews = result.scalars().all()
        
        items = []
        if reviews:
            student_ids = [r.student_id for r in reviews]
            student_query = select(UserModel.id, UserModel.full_name).where(UserModel.id.in_(student_ids))
            student_res = await self.db_session.execute(student_query)
            student_map = dict(student_res.all())
            
            from src.modules.student_course_directory.course_dto import CourseReviewView
            for r in reviews:
                items.append(CourseReviewView(
                    id=r.id,
                    course_id=r.course_id,
                    student_id=r.student_id,
                    student_name=student_map.get(r.student_id),
                    rating=float(r.rating),
                    content=r.content,
                    created_at=r.created_at,
                    updated_at=r.updated_at
                ))
                
        # Calculate summary
        summary_query = select(CourseReviewModel.rating, func.count(CourseReviewModel.id)).where(CourseReviewModel.course_id == course_id).group_by(CourseReviewModel.rating)
        summary_res = await self.db_session.execute(summary_query)
        rating_counts = {int(row[0]): int(row[1]) for row in summary_res.all()}
        
        total_revs = sum(rating_counts.values())
        avg = 0.0
        if total_revs > 0:
            avg = sum(k * v for k, v in rating_counts.items()) / total_revs
            
        from src.modules.student_course_directory.course_dto import RatingSummary, CourseReviewListResponse
        summary = RatingSummary(
            average_rating=round(avg, 1),
            total_reviews=total_revs,
            five_stars=rating_counts.get(5, 0),
            four_stars=rating_counts.get(4, 0),
            three_stars=rating_counts.get(3, 0),
            two_stars=rating_counts.get(2, 0),
            one_stars=rating_counts.get(1, 0),
        )
        
        return CourseReviewListResponse(
            items=items,
            summary=summary,
            total_items=total_items,
            total_pages=total_pages,
            current_page=page
        )

