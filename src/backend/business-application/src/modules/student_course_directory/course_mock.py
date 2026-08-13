from src.models.base_model import LessonContentType
from src.modules.student_course_directory.course_dto import (
    CourseItemResponse,
    EnrolledCourseResponse,
    LessonContentStudyResponse,
    LessonStudyResponse,
    PriceType,
    QuizOptionResponse,
    QuizQuestionResponse,
    QuizResponse,
    SectionOverviewResponse,
    SectionStudyResponse,
    StudyResponse,
)


_MOCK_COURSES = [
    CourseItemResponse(
        id=1,
        slug="nhap-mon-lap-trinh-python",
        title="Nhập môn Lập trình Python",
        thumbnail_url="https://cdn.cloudian.dev/courses/python-intro.jpg",
        price=0.0,
        price_type=PriceType.FREE,
        field="Lập trình",
        tags=["python", "beginner", "programming"],
        enrolled_count=3120,
        rating=4.8,
    ),
    CourseItemResponse(
        id=2,
        slug="cau-truc-du-lieu-va-giai-thuat",
        title="Cấu trúc Dữ liệu và Giải thuật",
        thumbnail_url="https://cdn.cloudian.dev/courses/dsa.jpg",
        price=299000.0,
        price_type=PriceType.PAID,
        field="Khoa học Máy tính",
        tags=["dsa", "algorithms", "intermediate"],
        enrolled_count=1845,
        rating=4.9,
    ),
    CourseItemResponse(
        id=3,
        slug="lap-trinh-web-voi-fastapi",
        title="Lập trình Web với FastAPI",
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
        title="Cơ sở Dữ liệu và SQL",
        thumbnail_url="https://cdn.cloudian.dev/courses/sql.jpg",
        price=0.0,
        price_type=PriceType.FREE,
        field="Cơ sở Dữ liệu",
        tags=["sql", "database", "beginner"],
        enrolled_count=2500,
        rating=4.6,
    ),
]

_MOCK_COURSE_SECTIONS = {
    "nhap-mon-lap-trinh-python": [
        SectionOverviewResponse(id=1, title="Giới thiệu Python", position=0, lesson_count=4),
        SectionOverviewResponse(id=2, title="Kiểu dữ liệu và Biến", position=1, lesson_count=5),
        SectionOverviewResponse(id=3, title="Cấu trúc điều kiện và vòng lặp", position=2, lesson_count=6),
    ],
    "cau-truc-du-lieu-va-giai-thuat": [
        SectionOverviewResponse(id=4, title="Mảng và Danh sách liên kết", position=0, lesson_count=5),
        SectionOverviewResponse(id=5, title="Stack và Queue", position=1, lesson_count=4),
        SectionOverviewResponse(id=6, title="Sắp xếp và Tìm kiếm", position=2, lesson_count=7),
    ],
    "lap-trinh-web-voi-fastapi": [
        SectionOverviewResponse(id=7, title="Cài đặt môi trường FastAPI", position=0, lesson_count=3),
        SectionOverviewResponse(id=8, title="Routing và Request Handling", position=1, lesson_count=5),
        SectionOverviewResponse(id=9, title="Pydantic và Validation", position=2, lesson_count=4),
    ],
    "co-so-du-lieu-sql": [
        SectionOverviewResponse(id=10, title="Giới thiệu cơ sở dữ liệu", position=0, lesson_count=3),
        SectionOverviewResponse(id=11, title="Câu lệnh SELECT nâng cao", position=1, lesson_count=5),
    ],
}

_MOCK_ENROLLED_COURSES = [
    EnrolledCourseResponse(
        id=1,
        slug="nhap-mon-lap-trinh-python",
        title="Nhập môn Lập trình Python",
        thumbnail_url="https://cdn.cloudian.dev/courses/python-intro.jpg",
        progress_percent=65.0,
    ),
    EnrolledCourseResponse(
        id=4,
        slug="co-so-du-lieu-sql",
        title="Cơ sở Dữ liệu và SQL",
        thumbnail_url="https://cdn.cloudian.dev/courses/sql.jpg",
        progress_percent=20.0,
    ),
]

_MOCK_STUDY_DATA = {
    "nhap-mon-lap-trinh-python": StudyResponse(
        course_slug="nhap-mon-lap-trinh-python",
        sections=[
            SectionStudyResponse(
                id=1,
                title="Giới thiệu Python",
                position=0,
                lessons=[
                    LessonStudyResponse(
                        id=1,
                        title="Python là gì? Tại sao nên học Python?",
                        position=0,
                        locked=False,
                        contents=[
                            LessonContentStudyResponse(
                                id=1,
                                content_type=LessonContentType.READING,
                                media_url=None,
                                completed=True,
                            ),
                        ],
                    ),
                    LessonStudyResponse(
                        id=2,
                        title="Cài đặt Python và môi trường lập trình",
                        position=1,
                        locked=False,
                        contents=[
                            LessonContentStudyResponse(
                                id=2,
                                content_type=LessonContentType.READING,
                                media_url="https://cdn.cloudian.dev/videos/python-setup.mp4",
                                completed=True,
                            ),
                        ],
                    ),
                    LessonStudyResponse(
                        id=3,
                        title="Chương trình Python đầu tiên",
                        position=2,
                        locked=True,
                        contents=[
                            LessonContentStudyResponse(
                                id=3,
                                content_type=LessonContentType.READING,
                                media_url=None,
                                completed=False,
                            ),
                            LessonContentStudyResponse(
                                id=4,
                                content_type=LessonContentType.QUIZ,
                                media_url=None,
                                completed=False,
                            ),
                        ],
                    ),
                    LessonStudyResponse(
                        id=4,
                        title="Bài tập thực hành: Hello World",
                        position=3,
                        locked=True,
                        contents=[
                            LessonContentStudyResponse(
                                id=5,
                                content_type=LessonContentType.PROBLEM,
                                media_url=None,
                                completed=False,
                            ),
                        ],
                    ),
                ],
            ),
            SectionStudyResponse(
                id=2,
                title="Kiểu dữ liệu và Biến",
                position=1,
                lessons=[
                    LessonStudyResponse(
                        id=5,
                        title="Biến và kiểu dữ liệu cơ bản",
                        position=0,
                        locked=False,
                        contents=[
                            LessonContentStudyResponse(
                                id=6,
                                content_type=LessonContentType.READING,
                                media_url=None,
                                completed=False,
                            ),
                        ],
                    ),
                    LessonStudyResponse(
                        id=6,
                        title="Số nguyên, số thực và chuỗi ký tự",
                        position=1,
                        locked=False,
                        contents=[
                            LessonContentStudyResponse(
                                id=23,
                                content_type=LessonContentType.READING,
                                media_url=None,
                                completed=False,
                            ),
                        ],
                    ),
                    LessonStudyResponse(
                        id=7,
                        title="Kiểu boolean và toán tử",
                        position=2,
                        locked=True,
                        contents=[
                            LessonContentStudyResponse(
                                id=24,
                                content_type=LessonContentType.READING,
                                media_url=None,
                                completed=False,
                            ),
                        ],
                    ),
                    LessonStudyResponse(
                        id=8,
                        title="Ép kiểu dữ liệu",
                        position=3,
                        locked=True,
                        contents=[
                            LessonContentStudyResponse(
                                id=25,
                                content_type=LessonContentType.READING,
                                media_url=None,
                                completed=False,
                            ),
                        ],
                    ),
                    LessonStudyResponse(
                        id=9,
                        title="Bài tập thực hành: Kiểu dữ liệu",
                        position=4,
                        locked=True,
                        contents=[
                            LessonContentStudyResponse(
                                id=26,
                                content_type=LessonContentType.PROBLEM,
                                media_url=None,
                                completed=False,
                            ),
                        ],
                    ),
                ],
            ),
            SectionStudyResponse(
                id=3,
                title="Cấu trúc điều kiện và vòng lặp",
                position=2,
                lessons=[
                    LessonStudyResponse(
                        id=10,
                        title="Câu lệnh if/elif/else",
                        position=0,
                        locked=False,
                        contents=[
                            LessonContentStudyResponse(
                                id=30,
                                content_type=LessonContentType.READING,
                                media_url=None,
                                completed=False,
                            ),
                        ],
                    ),
                    LessonStudyResponse(
                        id=11,
                        title="Vòng lặp for và range()",
                        position=1,
                        locked=False,
                        contents=[
                            LessonContentStudyResponse(
                                id=31,
                                content_type=LessonContentType.READING,
                                media_url=None,
                                completed=False,
                            ),
                        ],
                    ),
                    LessonStudyResponse(
                        id=12,
                        title="Vòng lặp while",
                        position=2,
                        locked=True,
                        contents=[
                            LessonContentStudyResponse(
                                id=32,
                                content_type=LessonContentType.READING,
                                media_url=None,
                                completed=False,
                            ),
                        ],
                    ),
                    LessonStudyResponse(
                        id=13,
                        title="break, continue và pass",
                        position=3,
                        locked=True,
                        contents=[
                            LessonContentStudyResponse(
                                id=33,
                                content_type=LessonContentType.READING,
                                media_url=None,
                                completed=False,
                            ),
                        ],
                    ),
                    LessonStudyResponse(
                        id=14,
                        title="Nested loop và list comprehension",
                        position=4,
                        locked=True,
                        contents=[
                            LessonContentStudyResponse(
                                id=34,
                                content_type=LessonContentType.READING,
                                media_url=None,
                                completed=False,
                            ),
                        ],
                    ),
                    LessonStudyResponse(
                        id=15,
                        title="Bài tập thực hành: Vòng lặp",
                        position=5,
                        locked=True,
                        contents=[
                            LessonContentStudyResponse(
                                id=35,
                                content_type=LessonContentType.PROBLEM,
                                media_url=None,
                                completed=False,
                            ),
                        ],
                    ),
                ],
            ),
        ],
    ),
    "co-so-du-lieu-sql": StudyResponse(
        course_slug="co-so-du-lieu-sql",
        sections=[
            SectionStudyResponse(
                id=10,
                title="Giới thiệu cơ sở dữ liệu",
                position=0,
                lessons=[
                    LessonStudyResponse(
                        id=20,
                        title="Cơ sở dữ liệu là gì?",
                        position=0,
                        locked=False,
                        contents=[
                            LessonContentStudyResponse(
                                id=20,
                                content_type=LessonContentType.READING,
                                media_url=None,
                                completed=True,
                            ),
                        ],
                    ),
                    LessonStudyResponse(
                        id=21,
                        title="Các loại cơ sở dữ liệu phổ biến",
                        position=1,
                        locked=False,
                        contents=[
                            LessonContentStudyResponse(
                                id=21,
                                content_type=LessonContentType.READING,
                                media_url=None,
                                completed=False,
                            ),
                        ],
                    ),
                    LessonStudyResponse(
                        id=22,
                        title="Cài đặt PostgreSQL",
                        position=2,
                        locked=True,
                        contents=[
                            LessonContentStudyResponse(
                                id=22,
                                content_type=LessonContentType.READING,
                                media_url="https://cdn.cloudian.dev/videos/postgres-setup.mp4",
                                completed=False,
                            ),
                        ],
                    ),
                ],
            ),
            SectionStudyResponse(
                id=11,
                title="Câu lệnh SELECT nâng cao",
                position=1,
                lessons=[
                    LessonStudyResponse(
                        id=30,
                        title="SELECT với WHERE và điều kiện lọc",
                        position=0,
                        locked=False,
                        contents=[
                            LessonContentStudyResponse(
                                id=40,
                                content_type=LessonContentType.READING,
                                media_url=None,
                                completed=False,
                            ),
                        ],
                    ),
                    LessonStudyResponse(
                        id=31,
                        title="ORDER BY và LIMIT",
                        position=1,
                        locked=False,
                        contents=[
                            LessonContentStudyResponse(
                                id=41,
                                content_type=LessonContentType.READING,
                                media_url=None,
                                completed=False,
                            ),
                        ],
                    ),
                    LessonStudyResponse(
                        id=32,
                        title="GROUP BY và HAVING",
                        position=2,
                        locked=True,
                        contents=[
                            LessonContentStudyResponse(
                                id=42,
                                content_type=LessonContentType.READING,
                                media_url=None,
                                completed=False,
                            ),
                        ],
                    ),
                    LessonStudyResponse(
                        id=33,
                        title="JOIN các bảng",
                        position=3,
                        locked=True,
                        contents=[
                            LessonContentStudyResponse(
                                id=43,
                                content_type=LessonContentType.READING,
                                media_url=None,
                                completed=False,
                            ),
                        ],
                    ),
                    LessonStudyResponse(
                        id=34,
                        title="Bài tập thực hành: SELECT nâng cao",
                        position=4,
                        locked=True,
                        contents=[
                            LessonContentStudyResponse(
                                id=44,
                                content_type=LessonContentType.PROBLEM,
                                media_url=None,
                                completed=False,
                            ),
                        ],
                    ),
                ],
            ),
        ],
    ),
}

_VALID_LESSON_CONTENT_IDS = {
    1, 2, 3, 4, 5, 6, 20, 21, 22,
    23, 24, 25, 26,
    30, 31, 32, 33, 34, 35,
    40, 41, 42, 43, 44
}

# Mock quiz data — is_correct stored internally, NEVER exposed in QuizResponse
_MOCK_QUIZ_ANSWER_KEY: dict[int, dict[int, int]] = {
    # quiz_id -> {question_id -> correct_option_id}
    1: {1: 2, 2: 3, 3: 1},
}

_MOCK_QUIZZES: dict[int, QuizResponse] = {
    1: QuizResponse(
        id=1,
        title="Kiểm tra kiến thức Python cơ bản",
        questions=[
            QuizQuestionResponse(
                id=1,
                question_text="Python là ngôn ngữ lập trình thuộc loại nào?",
                options=[
                    QuizOptionResponse(id=1, text="Ngôn ngữ biên dịch (Compiled)"),
                    QuizOptionResponse(id=2, text="Ngôn ngữ thông dịch (Interpreted)"),
                    QuizOptionResponse(id=3, text="Ngôn ngữ hợp ngữ (Assembly)"),
                    QuizOptionResponse(id=4, text="Ngôn ngữ máy (Machine code)"),
                ],
            ),
            QuizQuestionResponse(
                id=2,
                question_text="Hàm nào dùng để in ra màn hình trong Python?",
                options=[
                    QuizOptionResponse(id=1, text="echo()"),
                    QuizOptionResponse(id=2, text="console.log()"),
                    QuizOptionResponse(id=3, text="print()"),
                    QuizOptionResponse(id=4, text="write()"),
                ],
            ),
            QuizQuestionResponse(
                id=3,
                question_text="Kết quả của biểu thức 3 ** 2 trong Python là?",
                options=[
                    QuizOptionResponse(id=1, text="9"),
                    QuizOptionResponse(id=2, text="6"),
                    QuizOptionResponse(id=3, text="32"),
                    QuizOptionResponse(id=4, text="Lỗi cú pháp"),
                ],
            ),
        ],
    ),
}
