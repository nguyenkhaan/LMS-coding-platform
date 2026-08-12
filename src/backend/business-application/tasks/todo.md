# Task List — Module 2: Student Course Directory & Study Mode

## Phase 0 — Foundation (sequential, must complete first)
- [ ] Task: Tao `course_dto.py` voi toan bo Pydantic schemas
  - Acceptance: Import thanh cong, FastAPI khoi dong khong loi
  - Verify: `python -c "from src.modules.student_course_directory.course_dto import *; print('OK')"`
  - Files: `src/modules/student_course_directory/course_dto.py`

- [ ] Task: Tao `course_service.py` voi mock data cho 9 endpoint
  - Acceptance: Moi method tra dung Pydantic response object, khong co placeholder "string"
  - Verify: Unit import check
  - Files: `src/modules/student_course_directory/course_service.py`

- [ ] Task: Tao `course_dependency.py`
  - Acceptance: `get_course_service` injectable qua `Depends()`
  - Verify: Import check
  - Files: `src/modules/student_course_directory/course_dependency.py`

## Phase 1 — Routers (sau Phase 0)
- [ ] Task: Tao `course_router.py` cho /courses prefix (Endpoint 1, 2, 3, 9)
  - Acceptance: 4 route dang ky, response_model khai bao, GET /courses co pagination query params
  - Verify: TestClient GET /courses -> 200, POST enroll -> 201
  - Files: `src/modules/student_course_directory/course_router.py`

- [ ] Task: Tao `student_router.py` cho /student prefix (Endpoint 4, 5, 6, 7, 8)
  - Acceptance: 5 route dang ky, tat ca co Depends(get_current_user)
  - Verify: TestClient GET /student/courses -> 200
  - Files: `src/modules/student_course_directory/student_router.py`

- [ ] Task: Dang ky 2 router vao `app.py` (v1_router)
  - Acceptance: /docs hien thi du 9 endpoint Module 2
  - Verify: `uv run python -c "from src.app import app; print(len(app.routes))"`
  - Files: `src/app.py`

## Phase 2 — Tests (co the viet song song voi Phase 1)
- [ ] Task: Tao `tests/module2/conftest.py` voi TestClient + auth override
  - Acceptance: SEED_STUDENT duoc dinh nghia, dependency_overrides ap dung
  - Verify: `uv run pytest tests/module2/conftest.py`
  - Files: `tests/module2/__init__.py`, `tests/module2/conftest.py`

- [ ] Task: Viet `test_course_catalog.py` (Endpoint 1, 2)
  - Acceptance: GET /courses 200 + pagination fields; GET /courses/{slug} 200 + 404
  - Verify: `uv run pytest tests/module2/test_course_catalog.py -v`
  - Files: `tests/module2/test_course_catalog.py`

- [ ] Task: Viet `test_enrollment.py` (Endpoint 3, 9)
  - Acceptance: POST enroll 201 + 404; POST unenroll 200 + 404
  - Verify: `uv run pytest tests/module2/test_enrollment.py -v`
  - Files: `tests/module2/test_enrollment.py`

- [ ] Task: Viet `test_student_courses.py` (Endpoint 4, 5)
  - Acceptance: GET /student/courses 200 + 401; GET /student/courses/{slug}/study 200 + 404
  - Verify: `uv run pytest tests/module2/test_student_courses.py -v`
  - Files: `tests/module2/test_student_courses.py`

- [ ] Task: Viet `test_progress.py` (Endpoint 6)
  - Acceptance: POST complete 200 + 404 + 401
  - Verify: `uv run pytest tests/module2/test_progress.py -v`
  - Files: `tests/module2/test_progress.py`

- [ ] Task: Viet `test_quiz.py` (Endpoint 7, 8)
  - Acceptance: GET quiz 200 (khong co is_correct); POST submit 200 + 400 (answers rong); 404 quiz khong ton tai
  - Verify: `uv run pytest tests/module2/test_quiz.py -v`
  - Files: `tests/module2/test_quiz.py`

## Phase 3 — Full run
- [ ] Task: Chay toan bo test suite
  - Acceptance: Tat ca pass, 0 fail, 0 error
  - Verify: `uv run pytest tests/module2/ -v`
  - Files: (khong chinh sua them)
