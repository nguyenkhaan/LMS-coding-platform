# Spec: API Contracts (OpenAPI / Swagger Spec) - Task BE/FE-0.2

## Objective
Define the API Contract (endpoints, request/response models, and error responses) between the Frontend (React) and the Backend (FastAPI).
- Implement Pydantic schemas in FastAPI to automatically generate the OpenAPI JSON spec and interactive Swagger UI at `/docs`.
- Standardize all API error responses to a consistent JSON schema across the entire application.
- Export the final OpenAPI specification as `docs/specs/api.json`.

---

## Tech Stack
- **Backend Core**: Python 3.12, FastAPI, Pydantic v2
- **Frontend Core**: Bun / Node.js, React + Vite
- **Deployment & Testing Tools**: Swagger Editor, Postman

---

## Commands
```bash
# Start backend development server (hot reload active on port 4000)
cd src/backend/business-application
python main.py

# Export OpenAPI JSON spec from FastAPI server
python -c "import json; from src.app import app; print(json.dumps(app.openapi()))" > docs/specs/api.json
```

---

## Project Structure
- `docs/specs/api_spec.md` -> This API specification document.
- `docs/specs/api.json` -> [NEW] [api.json](file:///home/cloud/workspace/python/LMS-coding-platform/docs/specs/api.json) - Generated OpenAPI 3.0 specification.
- `src/backend/business-application/src/modules/` -> Router and DTO schema packages:
  - `auth/` (Login, registration, token exchange)
  - `course/` (Courses, lessons, quizzes, progress)
  - `problem/` (OJ Problems, run, submit, submissions)
  - `interview/` (AI interview sessions, message stream, report)
  - `payment/` (PayOS transactions, webhook)

---

## Code Style
All response and request models must inherit from `pydantic.BaseModel`.
Exceptions must be handled by FastAPI custom exception handlers to return the unified error structure.

### Standardized Error Response Structure:
All error responses (400, 401, 403, 404, 422, 500) must return the following JSON:
```json
{
  "message": "Chi tiết thông báo lỗi thân thiện với người dùng",
  "error_code": "RESOURCE_NOT_FOUND",
  "details": []
}
```

### Request/Response Model Example:
```python
from pydantic import BaseModel, Field
from typing import List, Optional

class ErrorResponse(BaseModel):
    message: str = Field(..., description="Chi tiết thông báo lỗi thân thiện với người dùng")
    error_code: str = Field(..., description="Mã lỗi phân loại, ví dụ: 'RESOURCE_NOT_FOUND'")
    details: List[dict] = Field(default=[], description="Thông tin chi tiết về lỗi (validation errors, field errors...)")
```

---

## Testing Strategy
1. **Syntax & Compliance Validation**: Import the generated `api.json` file into [Swagger Editor](https://editor.swagger.io/) or Postman. Ensure there are no warnings or errors.
2. **FastAPI Automated Test**: Write integration tests using `fastapi.testclient.TestClient` to verify endpoints respond with appropriate structures for both success and error cases.

---

## Boundaries
- **Always do**: Wrap all non-2xx responses in the unified `ErrorResponse` model.
- **Ask first**: Before renaming path parameters (e.g., changing `/{slug}` to `/{id}`).
- **Never do**: Return raw strings for HTTP error messages.

---

## Business Endpoints to Implement

### 1. Authentication & Profile Module (`/api/v1/auth`, `/api/v1/users`)
*   **`POST /api/v1/auth/register`**
    *   *Description*: Register a student account with details. Returns an OTP verification requirement.
    *   *Request Body*: `full_name`, `email`, `password`, `address`.
    *   *Response*: `verify_code` (OTP token), `message`.
*   **`GET /api/v1/auth/verify?code={otp_code}`**
    *   *Description*: Verify the email OTP to activate the user account.
    *   *Response*: `message` (Success verification message).
*   **`POST /api/v1/auth/token`**
    *   *Description*: Exchanges authorization `code` from `auth-provider` to obtain the token pair (`access_token`, `refresh_token`). Sets HttpOnly secure cookies.
    *   *Request Body*: `code`, `redirect_uri`.
    *   *Response*: `message` (Success), `user_info` (`id`, `email`, `roles`).
*   **`POST /api/v1/auth/google`**
    *   *Description*: Handles login/registration via Google OAuth.
    *   *Request Body*: `credential_token`.
    *   *Response*: `message`, `user_info` (`id`, `email`, `roles`).
*   **`POST /api/v1/auth/logout`**
    *   *Description*: Clear access/refresh tokens cookies from user's browser.
    *   *Response*: `message`.
*   **`GET /api/v1/users/me`**
    *   *Description*: Retrieves current user account information and profile details.
    *   *Response*: `id`, `full_name`, `email`, `avatar_url`, `account_status`, `roles`, `student_profile` (optional), `teacher_profile` (optional).
*   **`PUT /api/v1/users/me/profile`**
    *   *Description*: Update student's specific profile info.
    *   *Request Body*: `bio`, `school`, `major`, `github_url`, `facebook_url`, `linkedin_url`.
    *   *Response*: `message`, `profile` updated details.
*   **`PUT /api/v1/users/me/teacher-profile`**
    *   *Description*: Update teacher's specific profile info.
    *   *Request Body*: `bio`, `school_address`, `cv_url`.
    *   *Response*: `message`, `profile` updated details.

### 2. Student Course Directory & Study Mode (`/api/v1/courses`, `/api/v1/student`)
*   **`GET /api/v1/courses`**
    *   *Description*: Public catalog retrieval with filters and pagination.
    *   *Query Parameters*: `page` (default 1), `size` (default 10), `q` (search text), `difficulty` (`EASY`, `MEDIUM`, `HARD`), `price_type` (`FREE`, `PAID`).
    *   *Response*: `total_items`, `total_pages`, `current_page`, `items` (Array of courses).
*   **`GET /api/v1/courses/{slug}`**
    *   *Description*: Public course landing overview information (ratings, description, sections overview).
    *   *Response*: `id`, `title`, `slug`, `description`, `price`, `rating`, `teacher_name`, `sections` (overview details).
*   **`POST /api/v1/courses/{slug}/enroll`**
    *   *Description*: Enroll in a course (works instantly for FREE courses, redirects to payment creation for PAID courses).
    *   *Response*: `status` (`ENROLLED` or `PENDING_PAYMENT`), `checkout_url` (if PAID).
*   **`GET /api/v1/student/courses`**
    *   *Description*: Retrieve courses currently enrolled by the current user.
    *   *Response*: List of courses including progress percentages.
*   **`GET /api/v1/student/courses/{slug}/study`**
    *   *Description*: Get detailed curriculum syllabus with lock/completion ticks for React classroom workspace.
    *   *Response*: Sections, Lessons, and Content list with completed flags.
*   **`POST /api/v1/student/progress/lesson-content/{id}/complete`**
    *   *Description*: Mark a reading or video lesson content as complete.
    *   *Response*: `message`, `completed_at`.
*   **`GET /api/v1/student/quizzes/{quizId}`**
    *   *Description*: Get quiz questions for React test interface (omits `is_correct` field).
    *   *Response*: `id`, `title`, `questions` (Array of questions, each with ID, statement, points, options).
*   **`POST /api/v1/student/quizzes/{quizId}/submit`**
    *   *Description*: Submit quiz answers. Score is checked automatically against DB.
    *   *Request Body*: `answers` (Map of question_id -> option_id).
    *   *Response*: `score`, `passed` (requires >= 80%), `passing_score`, `attempts_left`, `correct_answers` (detail options mapping).

### 3. Teacher Course & Curriculum Creator (`/api/v1/teacher/courses`)
*   **`GET /api/v1/teacher/courses`**
    *   *Description*: List courses owned/created by the teacher.
    *   *Response*: List of courses with status (`DRAFT`, `PENDING_REVIEW`, `PUBLISHED`, `ARCHIVED`).
*   **`POST /api/v1/teacher/courses`**
    *   *Description*: Create a new course workspace.
    *   *Request Body*: `title`, `description`, `price`, `thumbnail_url`.
    *   *Response*: Course details with newly generated `id` and `slug`.
*   **`PUT /api/v1/teacher/courses/{id}`**
    *   *Description*: Edit metadata of a course.
    *   *Request Body*: `title`, `description`, `price`, `thumbnail_url`, `status`.
    *   *Response*: Updated course details.
*   **`POST /api/v1/teacher/courses/{courseId}/sections`**
    *   *Description*: Add a new chapter section under a course.
    *   *Request Body*: `title`, `position`.
    *   *Response*: Section object details.
*   **`PUT /api/v1/teacher/sections/{sectionId}`**
    *   *Description*: Edit or delete (cascade) section title or position.
    *   *Request Body*: `title`, `position`.
    *   *Response*: Updated section details.
*   **`POST /api/v1/teacher/sections/{sectionId}/lessons`**
    *   *Description*: Create a new lesson unit under a section.
    *   *Request Body*: `title`, `summary`, `position`.
    *   *Response*: Lesson object details.
*   **`PUT /api/v1/teacher/lessons/{lessonId}`**
    *   *Description*: Update lesson info.
    *   *Request Body*: `title`, `summary`, `position`.
    *   *Response*: Updated lesson details.
*   **`PUT /api/v1/teacher/courses/{courseId}/curriculum/reorder`**
    *   *Description*: Batch update positions of all chapters and lessons simultaneously.
    *   *Request Body*: `reorder_data` (List of `{ item_type: "section"|"lesson", id: int, position: int, parent_id: int }`).
    *   *Response*: `message` (Success).
*   **`POST /api/v1/teacher/lessons/{lessonId}/contents`**
    *   *Description*: Create and bind content item (Reading material, Quiz, or Coding problem) to a lesson.
    *   *Request Body*: `content_type` (`READING`, `QUIZ`, `PROBLEM`), `content_id`, `media_url` (optional), `position`.
    *   *Response*: Content metadata details.
*   **`PUT /api/v1/teacher/lesson-contents/{contentId}`**
    *   *Description*: Modify or delete a content item binding.
    *   *Request Body*: `media_url`, `position`.
    *   *Response*: Updated content details.

### 4. Online Judge (OJ) Problem & Run/Submit Engine (`/api/v1/problems`, `/api/v1/submissions`)
*   **`GET /api/v1/problems`**
    *   *Description*: Public list of coding problems (OJ catalog).
    *   *Response*: List of problems (title, slug, difficulty, public status).
*   **`GET /api/v1/problems/{slug}`**
    *   *Description*: Get detailed problem description statement and metadata.
    *   *Response*: `id`, `title`, `slug`, `statement`, `input_description`, `output_description`, `constraints`, `sample_input`, `sample_output`, `explanation`, `difficulty`.
*   **`POST /api/v1/problems/{slug}/run`**
    *   *Description*: Execute code in isolated sandbox against custom user input.
    *   *Request Body*: `source_code`, `language_id`, `stdin`.
    *   *Response*: `stdout`, `runtime_ms`, `memory_kb`, `compile_error`, `status` (`SUCCESS` or `ERROR`).
*   **`POST /api/v1/problems/{slug}/submit`**
    *   *Description*: Submit code for final grading. Queues execution task to RabbitMQ.
    *   *Request Body*: `source_code`, `language_id`.
    *   *Response*: `submission_id`, `status` (`PENDING`).
*   **`GET /api/v1/submissions/{submissionId}/status`**
    *   *Description*: Polling endpoint to check testcase execution progress and final results.
    *   *Response*: `status` (`PENDING`, `RUNNING`, `ACCEPTED`, `WRONG_ANSWER`, `TIME_LIMIT_EXCEEDED`, `MEMORY_LIMIT_EXCEEDED`, `RUNTIME_ERROR`, `COMPILE_ERROR`), `score`, `runtime_ms`, `memory_kb`, `details` (Array of testcase executions).
*   **`POST /api/v1/teacher/problems`**
    *   *Description*: Teacher creates a new problem template in the bank.
    *   *Request Body*: `title`, `statement`, `input_description`, `output_description`, `constraints`, `difficulty`, `public`.
    *   *Response*: Created problem details.
*   **`POST /api/v1/teacher/problems/{problemId}/testcases/upload`**
    *   *Description*: Upload testcase files in ZIP form (containing input/output pairs matching `input_xx.in` / `output_xx.out`).
    *   *Request Body*: Multipart Form Data with `.zip` file.
    *   *Response*: Count of uploaded testcases, confirmation message.

### 5. AI Mock Interview Module (`/api/v1/interviews`)
*   **`GET /api/v1/interviews/sessions`**
    *   *Description*: List past interview sessions of the student.
    *   *Response*: Session array (`id`, `topic`, `level`, `started_at`, `status` ACTIVE/COMPLETED, `score`).
*   **`POST /api/v1/interviews/sessions`**
    *   *Description*: Initialize a new Mock Interview session. Fetches the opening question from Gemini.
    *   *Request Body*: `topic`, `level` (`INTERN`, `FRESHER`, `JUNIOR`, `SENIOR`).
    *   *Response*: `session_id`, `first_question`.
*   **`POST /api/v1/interviews/sessions/{sessionId}/chat`**
    *   *Description*: Post candidate answer. System stores messages and streams the next AI response via SSE.
    *   *Request Body*: `message`.
    *   *Response Stream (SSE)*: Stream of text chunks containing the AI's follow-up question.
*   **`GET /api/v1/interviews/sessions/{sessionId}/report`**
    *   *Description*: Retrieve evaluation score report card.
    *   *Response*: `overall_score` (radial scale 1-10), `strengths` (List of points), `weaknesses` (List of points), `suggestions`, `chat_transcript` (messages array).

### 6. PayOS Payments (`/api/v1/payments`)
*   **`POST /api/v1/payments/payos/create`**
    *   *Description*: Initiate a checkout session. Generates PayOS VietQR payment details.
    *   *Request Body*: `course_id`.
    *   *Response*: `transaction_code`, `payos_link`, `qrcode` (VietQR image link), `amount`, `expires_at`.
*   **`POST /api/v1/payments/payos-webhook`**
    *   *Description*: Receive transaction verification hook from PayOS. Resolves concurrency using locking.
    *   *Request Body*: Standard PayOS notification schema.
    *   *Response*: `{ "status": "ok" }`.
*   **`GET /api/v1/payments/transactions/{transactionCode}/status`**
    *   *Description*: Check if the transaction payment is successfully completed.
    *   *Response*: `status` (`PENDING`, `COMPLETE`, `FAILED`), `amount`, `completed_at`.

### 7. Lesson Interactions & Comments (`/api/v1/lessons/{lessonId}/comments`)
*   **`GET /api/v1/lessons/{lessonId}/comments`**
    *   *Description*: Get comments for a lesson structured in a 2-level hierarchy.
    *   *Response*: List of comments, each containing parent_id, profile avatar, full name, post time, and child replies list.
*   **`POST /api/v1/lessons/{lessonId}/comments`**
    *   *Description*: Post a new comment or reply to an existing one.
    *   *Request Body*: `content`, `parent_id` (optional, for 2nd level replies).
    *   *Response*: Created comment details.
*   **`DELETE /api/v1/comments/{commentId}`**
    *   *Description*: Delete own comment.
    *   *Response*: `message`.

### 8. Admin Moderation & CCCD Verification (`/api/v1/admin`)
*   **`GET /api/v1/admin/teacher-registers`**
    *   *Description*: List pending teacher registration requests for CCCD verification.
    *   *Response*: List of requests (motivation, cccd_number, cccd_front_url, cccd_back_url, cv_pdf_url, user details).
*   **`POST /api/v1/admin/teacher-registers/{id}/verify`**
    *   *Description*: Approve or reject registration. Updates user role to `TEACHER` if approved.
    *   *Request Body*: `status` (`AGREE`, `REJECT`), `reviewed_note`.
    *   *Response*: `message`, `register_id`, `new_status`.
*   **`GET /api/v1/admin/reports`**
    *   *Description*: List reported courses.
    *   *Response*: List of flags (course_id, reporter_name, content_reason, status).
*   **`POST /api/v1/admin/courses/{id}/status`**
    *   *Description*: Update course state or hide/ban course contents.
    *   *Request Body*: `status` (`PUBLISHED`, `ARCHIVED`, `DRAFT`).
    *   *Response*: `message`, `course_id`, `new_status`.
*   **`PUT /api/v1/admin/users/{userId}/status`**
    *   *Description*: Ban or reactivate user account.
    *   *Request Body*: `account_status` (`ACTIVE`, `BANNED`).
    *   *Response*: `message`, `user_id`, `new_status`.

### 9. Notifications Module (`/api/v1/notifications`)
*   **`GET /api/v1/notifications`**
    *   *Description*: Fetch list of alerts (comment notifications, register results, payments).
    *   *Response*: List of notifications (id, content, is_read, created_at).
*   **`PUT /api/v1/notifications/{id}/read`**
    *   *Description*: Mark alert as read.
    *   *Response*: `message`.

### 10. Teacher Analytics Dashboard (`/api/v1/teacher/dashboard`)
*   **`GET /api/v1/teacher/dashboard/summary`**
    *   *Description*: Financial summary data metrics.
    *   *Response*: `total_revenue`, `current_balance`, `enrolled_students_count`, `active_courses_count`.
*   **`GET /api/v1/teacher/dashboard/revenue`**
    *   *Description*: Retrieves daily, weekly, or monthly course transaction logs.
    *   *Query Parameters*: `period` (`DAILY`, `WEEKLY`, `MONTHLY`).
    *   *Response*: List of transaction data entries for charts.
*   **`GET /api/v1/teacher/dashboard/students`**
    *   *Description*: Lists students registered under teacher's courses with progress.
    *   *Response*: List of student records (name, course_title, last_active_lesson, progress_percentage, enrolled_at).

---

## Success Criteria
- [ ] Pydantic Schemas implemented for all above Request/Response bodies in the Python backend.
- [ ] Endpoints registered in FastAPI Router with error handling middleware formatting error JSONs exactly as specified.
- [ ] `docs/specs/api.json` generated containing all endpoints, valid OpenAPI 3.0 specification.
- [ ] Swagger Editor has 0 syntax errors or structure warnings when parsing `docs/specs/api.json`.
- [ ] `/docs` page loading correctly inside the local server container.

---

## Open Questions
1. **Streaming protocol for AI Chat**: Use SSE (Server-Sent Events) since AI recruiter outputs are text streams (one-way server-to-client streaming), matching the Gemini turn-based interview flow perfectly.
2. **Authentication Cookie Storage**: Both `access_token` and `refresh_token` are kept strictly in HttpOnly, Secure cookies to prevent XSS-based theft.
