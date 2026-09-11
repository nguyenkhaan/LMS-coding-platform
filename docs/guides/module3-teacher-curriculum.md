# Module 3: Teacher Course Curriculum (Backend)

This document describes the current implementation state of the Teacher Course Curriculum module (Module 3).

## Current Status Overview

### Task 1: Core Curriculum (Course, Section, Lesson, Reading, LessonContent, Reorder)
- **Status**: **Fully Migrated to PostgreSQL/SQLAlchemy**. No more in-memory mocks.
- **Ownership Validation Pattern**: Standardized across all endpoints:
  - `404 NOT_FOUND`: Resource does not exist (or belongs to another entity).
  - `403 FORBIDDEN`: Resource exists but belongs to a different teacher.
  - `409 INVALID_STATE`: Resource exists and belongs to the teacher, but the course is not in a modifiable state (`DRAFT` or `REJECTED`).
- **Tests**: 52/53 passing for the core API (`test_course_api.py`, `test_section_api.py`, `test_lesson_api.py`).

### Task 2: Quiz Management
- **Status**: **Fixed and Fully Functional**. 
- **Details**: `TeacherQuizService` now uses the real DB via a dedicated ownership check (`_verify_lesson_ownership`).
- **Business Rule Note**: Quiz creation/editing KHÔNG bị chặn bởi course status (không bị lỗi 409 INVALID_STATE ngay cả khi course đã published). Đây là quyết định đã "confirmed with team lead" trước đây (được ghi nhận trong comment tại `teacher_quiz_service.py::create_quiz`), và quy định này KHÔNG có mặt trong `api_spec.md`.
- **Tests**: 12/12 tests pass in `test_quiz_api.py`.

### Task 3: Teacher Problem Management
- **Status**: 5 endpoints implemented. No changes made during the recent DB migration.

---

## ⚠️ PENDING DECISION

**Behavior of `delete_section` when it contains `Lesson`s**

Currently, the system is configured to **BLOCK** the deletion of a section if it contains lessons (returns `409 SECTION_HAS_LESSONS`).

However, the original test suite (`test_cascade_delete_section`) was designed to expect a **Cascade-Delete** behavior (deleting a section automatically deletes all its lessons and their contents, returning `200 OK`). 

The test has been reverted to its original state (expecting `200 OK`) and is currently the ONLY failing test in the entire module suite. 

**Official Spec Evidence**: `api_spec.md` mới nhất trên `origin/dev` (commit `f4db17c`) CŨNG xác nhận đây là điểm chưa chốt: nguyên văn spec ghi `"Cascade/content policy phải được duyệt"`. Đây không phải giả định của dev team module3, mà là trạng thái pending chính thức trong spec.

**Tổng số test Module 3 hiện tại:** **92/93 passing** (chỉ có 1 lỗi duy nhất là `test_cascade_delete_section` do đang đợi quyết định).

---

## Ghi chú ngoài phạm vi Module 3
Qua việc rà soát `api_spec.md` mới nhất trên `origin/dev` (commit `f4db17c`), có một số thay đổi nhỏ không ảnh hưởng đến Module 3 nhưng cần lưu ý cho các module khác:
- **Judge progress**: Ở endpoint `POST /problems/{slug}/submit`, spec bổ sung rule: "Judge trả progress theo từng testcase". Output testcase sẽ so khớp tuyệt đối theo byte UTF-8.
- **PayOS webhook**: Bổ sung mới hoàn toàn Section 9 về Checkout trực tiếp và webhook PayOS.

---

## Local Development Guide

### 1. Database and External Services
- Ensure PostgreSQL is running.
- **Bypass RabbitMQ**: For local development, RabbitMQ checks can be bypassed. Ensure you do not commit any bypassing code in your final PR.

### 2. API Prefix
- All routes use the `/api` prefix (no `/v1`). This was synced with `origin/dev` in commit `7635158`, matching the change made to the rest of the codebase in commit `3f9aad5` (24/08/2026).

### 3. Authentication (Obtaining JWT Token)
To test the Teacher API, you must obtain a valid JWT token representing a teacher user.
1. Make sure the **Auth Provider** service is running on port `4001`.
2. Ensure you have the proper `.env` variables for the Auth Provider (e.g., `JWT_EMAIL_CHANGE_SECRET`, valid Supabase/PostgreSQL connections). Note: Avoid using meaningless fallback keys if it causes validation issues.
3. Follow the OAuth/Login flow to get an access code:
   - Call the authorize endpoint.
   - Login.
   - Exchange the code for a JWT token.
4. Pass this token in the `Authorization` header as a Bearer token.

---

## Testing via Swagger UI & cURL

1. Start the server (ensure Auth Provider is also running):
   ```bash
   uv run main.py
   ```
2. Navigate to [http://localhost:4000/docs](http://localhost:4000/docs) in your browser.
3. Click the **Authorize** button and input your Bearer token.
4. Test the endpoints sequentially:
   - **POST** `/api/teacher/courses` to create a course.
   - **POST** `/api/teacher/courses/{course_id}/sections` to create a section.
   - **POST** `/api/teacher/sections/{section_id}/lessons` to create a lesson.
   - **POST** `/api/teacher/lessons/{lesson_id}/readings` to add reading content.
   - **PUT** `/api/teacher/courses/{course_id}/curriculum/reorder` to reorder items.

Example `curl` for creating a course:
```bash
curl -X POST "http://localhost:4000/api/teacher/courses" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title": "My New Course", "description": "Course description", "price": 0, "field": "IT", "tags": []}'
```
