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
- **Status**: **BROKEN** (Pending Migration/Fixes).
- **Issue**: The `TeacherQuizService` currently initializes `TeacherCourseService` without passing a database session (`db`). It still uses the legacy `_get_lesson_or_404` helper, which points to the old in-memory mock dictionary (`_lessons`). Because Task 1 now creates lessons in the real database, the quiz service cannot find them, resulting in `404 Not Found`. 
- **Tests**: Currently, 7 out of 12 tests fail in `test_quiz_api.py` due to this mismatch.

### Task 3: Teacher Problem Management
- **Status**: 5 endpoints implemented. No changes made during the recent DB migration.

---

## ⚠️ PENDING DECISION

**Behavior of `delete_section` when it contains `Lesson`s**

Currently, the system is configured to **BLOCK** the deletion of a section if it contains lessons (returns `409 SECTION_HAS_LESSONS`).

However, the original test suite (`test_cascade_delete_section`) was designed to expect a **Cascade-Delete** behavior (deleting a section automatically deletes all its lessons and their contents, returning `200 OK`). 

The test has been reverted to its original state (expecting `200 OK`) and is currently the ONLY failing test in the core curriculum suite (52/53 passing). We are pending a decision from the team leader on whether to implement cascade-delete in the database/service layer or officially change the business logic to block it.

---

## Local Development Guide

### 1. Database and External Services
- Ensure PostgreSQL is running.
- **Bypass RabbitMQ**: For local development, RabbitMQ checks can be bypassed. Ensure you do not commit any bypassing code in your final PR.

### 2. API Prefix Mismatch
- The current implementation routes might use `/api/v1` in some places and `/api` in others. Pay attention to the prefix differences between the backend code and the frontend client. (Rebase needed if this was fixed in `main`).

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
   - **POST** `/api/v1/teacher/courses` to create a course.
   - **POST** `/api/v1/teacher/courses/{course_id}/sections` to create a section.
   - **POST** `/api/v1/teacher/sections/{section_id}/lessons` to create a lesson.
   - **POST** `/api/v1/teacher/lessons/{lesson_id}/contents` to add reading content.
   - **PUT** `/api/v1/teacher/courses/{course_id}/curriculum/reorder` to reorder items.

Example `curl` for creating a course:
```bash
curl -X POST "http://localhost:4000/api/v1/teacher/courses" \\
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
     -H "Content-Type: application/json" \\
     -d '{"title": "My New Course", "description": "Course description", "price": 0, "field": "IT", "tags": []}'
```
