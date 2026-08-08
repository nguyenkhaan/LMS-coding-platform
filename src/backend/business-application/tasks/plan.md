# Spec: Module 2 — Student Course Directory & Study Mode
# Task: BE-0.2 / api_spec.md Section 2
# Author: Execution Agent (agy) | Date: 2026-08-07

---

## Objective

Trien khai skeleton + implement 9 endpoint thuoc Module 2 trong Business Application (FastAPI, port 4000).

- **User:** FE team dung de rap UI, BE team dung de on dinh API contract
- **Why now:** `src/modules/student_course_directory/` hien rong, FE dang cho contract
- **Success:** Tat ca 9 endpoint tra dung HTTP status + dung Pydantic shape, test pass, `/docs` render khong loi

---

## Assumptions (da xac nhan tai Buoc [1])

1. Auth: `Authorization: Bearer <JWT RS256>` — dung `get_current_user` tu `src/middlewares/auth_middleware.py`
2. Service layer: mock data co cau truc dung Pydantic shape, khong query DB that
3. `locked` field: mock co dinh hop ly (2 lesson dau `false`, con lai `true`), khong viet business rule
4. `POST /courses/{slug}/enroll` thanh cong -> `201 Created`
5. `checkout_url` -> `Optional[str]`, chi co khi `status = PENDING_PAYMENT`
6. Seed test account: `student@gmail.com` / `student123` / role `STUDENT`
7. Khong cai them package moi ngoai pyproject.toml hien co

---

## Tech Stack

- **Runtime:** Python 3.14, FastAPI 0.139+, Pydantic v2
- **Auth:** PyJWT 2.13+, RS256, `HTTPBearer` dependency
- **Test:** `fastapi.testclient.TestClient` (dong bo), `pytest`
- **Package manager:** `uv` (uv sync da pass, 64 packages resolved)

---

## Endpoints — Module 2

| # | Method | Path | Auth | Status codes |
|---|--------|------|------|-------------|
| 1 | GET | `/courses` | public | 200, 400, 500 |
| 2 | GET | `/courses/{slug}` | public | 200, 404, 500 |
| 3 | POST | `/courses/{slug}/enroll` | student | 201, 401, 404, 500 |
| 4 | GET | `/student/courses` | student | 200, 401, 500 |
| 5 | GET | `/student/courses/{slug}/study` | student | 200, 401, 404, 500 |
| 6 | POST | `/student/progress/lesson-content/{id}/complete` | student | 200, 401, 404, 500 |
| 7 | GET | `/student/quizzes/{quizId}` | student | 200, 401, 404, 500 |
| 8 | POST | `/student/quizzes/{quizId}/submit` | student | 200, 400, 401, 404, 500 |
| 9 | POST | `/courses/{slug}/unenroll` | student | 200, 401, 404, 500 |

---

## Project Structure (sau khi implement)

```
src/backend/business-application/
├── src/
│   └── modules/
│       └── student_course_directory/
│           ├── __init__.py
│           ├── course_router.py          <- Routes /courses + /courses/{slug} + enroll/unenroll
│           ├── student_router.py         <- Routes /student/*
│           ├── course_dto.py             <- Pydantic request/response schemas
│           ├── course_service.py         <- Business logic (mock data)
│           └── course_dependency.py      <- FastAPI Depends wiring
├── tasks/
│   ├── plan.md                           <- This file
│   └── todo.md                           <- Task checklist
└── tests/
    └── module2/
        ├── __init__.py
        ├── conftest.py                   <- TestClient + seed account setup
        ├── test_course_catalog.py        <- Endpoint 1, 2
        ├── test_enrollment.py            <- Endpoint 3, 9
        ├── test_student_courses.py       <- Endpoint 4, 5
        ├── test_progress.py              <- Endpoint 6
        └── test_quiz.py                  <- Endpoint 7, 8
```

---

## DTO Schemas (Pydantic v2)

Dinh nghia trong `course_dto.py`:

```
# Public Course Catalog
CourseItemResponse          (id, slug, title, thumbnail_url, price, price_type, field, tags, enrolled_count, rating)
CourseCatalogResponse       (total_items, total_pages, current_page, items: list[CourseItemResponse])

# Course Detail
SectionOverviewResponse     (id, title, position, lesson_count)
CourseDetailResponse        (id, slug, title, description, price, price_type, sections: list[SectionOverviewResponse])

# Enroll / Unenroll
EnrollStatus                Enum: ENROLLED | PENDING_PAYMENT  (dinh nghia trong course_dto.py)
EnrollResponse              (status: EnrollStatus, checkout_url: Optional[str])
UnenrollResponse            (message: str)

# Student Enrolled Courses
EnrolledCourseResponse      (id, slug, title, thumbnail_url, progress_percent: float)
StudentCoursesResponse      (items: list[EnrolledCourseResponse])

# Study Mode
LessonContentStudyResponse  (id, content_type, media_url: Optional[str], completed: bool)
LessonStudyResponse         (id, title, position, locked: bool, contents: list[LessonContentStudyResponse])
SectionStudyResponse        (id, title, position, lessons: list[LessonStudyResponse])
StudyResponse               (course_slug: str, sections: list[SectionStudyResponse])

# Progress
CompleteContentResponse     (message: str, completed_at: datetime)

# Quiz (NO is_correct field)
QuizOptionResponse          (id, text)
QuizQuestionResponse        (id, question_text, options: list[QuizOptionResponse])
QuizResponse                (id, title, questions: list[QuizQuestionResponse])

# Quiz Submit
QuizSubmitRequest           (answers: dict[int, int])  <- Map<question_id, option_id>
QuizSubmitResponse          (submission_id: int, score: float, passed: bool, correct_count: int, total_count: int)
```

---

## Layer Architecture

```
Router (path + method + Depends)
  -> goi Service truc tiep (khong tach Controller rieng — theo pattern lesson_comment)
  -> Service tra Pydantic response object voi mock data
```

Pattern: follow `lesson_comment` — Router goi thang Service, consistent voi codebase hien tai.

---

## Code Style

Theo pattern cua `lesson_comment_router.py`:
- `snake_case` cho function, bien, file
- `PascalCase` cho Pydantic model, class
- `Annotated[type, Path()]` / `Annotated[type, Query(...)]` cho path/query params
- `Depends(get_current_user)` cho auth endpoint
- `ConfigDict(from_attributes=True)` tren moi response schema

```python
# Vi du pattern Router:
@router.get("/{slug}", response_model=CourseDetailResponse)
async def get_course_detail(
    slug: Annotated[str, Path()],
    service: CourseService = Depends(get_course_service),
) -> CourseDetailResponse:
    return await service.get_course_detail(slug)
```

---

## Testing Strategy

- **Framework:** `pytest` + `fastapi.testclient.TestClient`
- **Test location:** `tests/module2/`
- **Seed account:** `student@gmail.com` / `student123` / role `STUDENT` (ghi trong `conftest.py`)
- **Auth mock:** override `get_current_user` dependency trong TestClient, khong can gRPC live
- **Coverage per endpoint:** it nhat 1 happy path + 1 error case (404 / 401)
- **Khong** test DB that o giai doan nay

```python
# conftest.py pattern:
SEED_STUDENT = {"sub": 1, "email": "student@gmail.com", "roles": ["student"]}

def override_get_current_user():
    return SEED_STUDENT

app.dependency_overrides[get_current_user] = override_get_current_user
client = TestClient(app)
```

---

## Boundaries

- **Always do:** Dung `get_current_user` import tu `src.middlewares.auth_middleware`; wrap error thanh ErrorResponse shape; khai bao `response_model=` tren moi route
- **Ask first:** Them package moi; thay doi path parameter name; thay doi enum value trong `base_model.py`
- **Never do:** Tu viet JWT decode logic moi; commit; merge; tra raw string cho HTTP error; de `is_correct` lo trong quiz response

---

## Success Criteria

- [ ] 9 endpoint dang ky trong router, prefix dung (`/courses`, `/student`)
- [ ] Router duoc `include_router` vao `app.py` (v1_router)
- [ ] Moi response co `response_model=` khai bao
- [ ] Moi Pydantic schema co `ConfigDict(from_attributes=True)`
- [ ] Mock data khong co placeholder `"string"` / `0` vo nghia
- [ ] `GET /courses` tra dung pagination fields: `total_items`, `total_pages`, `current_page`, `items`
- [ ] `POST /courses/{slug}/enroll` tra `201`
- [ ] Quiz response KHONG co `is_correct` field
- [ ] Test: it nhat 1 happy + 1 error case cho moi endpoint (18 test cases toi thieu)
- [ ] `uv run pytest tests/module2/ -v` -> all pass

---

## Open Questions (ghi de sync sau)

1. **[Nghi - cookie vs Bearer]** `api_spec.md` ghi cookie, code thuc dung Bearer RS256 qua gRPC. Module 2 follow code thuc. Spec can cap nhat?
2. **[Leader - locked rule]** Rule `locked` lesson se chot sau Figma review — mock tam tra `false` cho 2 lesson dau, `true` cho phan con lai.
3. **[Nghi - EnrollStatus]** `base_model.py` chua co enum `EnrollStatus` (ENROLLED/PENDING_PAYMENT) — se dinh nghia trong `course_dto.py` thay vi `base_model.py` de tranh conflict.
