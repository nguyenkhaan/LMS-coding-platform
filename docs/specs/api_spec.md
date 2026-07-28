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
     *   *Response*: `message` (confirmation that a verification email/sms was sent). For security the OTP is not returned in the response; the user must verify via the `GET /api/v1/auth/verify` route.
*   **`GET /api/v1/auth/verify?code={otp_code}`**
    *   *Description*: Verify the email OTP to activate the user account. On success, update `user.account_status` from `UNVERIFIED` to `ACTIVE`.
    *   *Response*: `message` (Success verification message).
*   **`GET /api/v1/auth/code?code=`**
    *   *Description*: Exchanges authorization `code` from `auth-provider` to obtain the token pair (`access_token`, `refresh_token`). Sets HttpOnly secure cookies.
    *   *Request Query*: `code` 
    *   *Response*: `access_token`, `refresh_token`
*   **`POST /api/v1/auth/google`**
    *   *Description*: Handles login/registration via Google OAuth.
    *   *Request Body*: `credential_token`.
    *   *Response*: `access_token`, `refresh_token`.
    *   *Note*: `roles` is derived from the `user_role` table, similar to the token exchange route.
*   **`POST /api/v1/auth/logout`**
    *   *Description*: Clear access/refresh tokens cookies from user's browser.
    *   *Response*: `message`.
*   **`POST /api/v1/auth/refresh`**
    *   *Description*: Exchange a valid refresh token cookie for a new access token without requiring the user to log in again.
    *   *Request Body*: none; the refresh token is read from an HttpOnly cookie.
    *   *Response*: `access_token`.
*   **`POST /api/v1/auth/forgot-password`**
    *   *Description*: Request a password reset link or code sent to the user's email.
    *   *Request Body*: `email`.
    *   *Response*: `verify_reset_password_token`.
*   **`POST /api/v1/auth/reset-password`**
    *   *Description*: Reset password using the token sent by the forgot-password flow.
    *   *Request Body*: `new_password`, `verify_reset_password_token`.
    *   *Response*: `token`.
*   **`POST /api/v1/auth/resend-otp`**
    *   *Description*: Resend the email OTP when the previous one expired before verification.
    *   *Request Body*: `email`.
    *   *Response*: `message`.
*   **`GET /api/v1/users/me`**
    *   *Description*: Retrieves current user account information and profile details.
    *   *Response*: `id`, `full_name`, `email`, `avatar_url`, `account_status`, `roles`, `student_profile` (optional), `teacher_profile` (optional).
*   **`PUT /api/v1/users/me/profile`**
    *   *Description*: Update student's specific profile info.
    *   *Request Body*: `bio`, `school`, `major`, `github_url`, `facebook_url`, `linkedin_url`, `avatar_url`.
    *   *Response*: `message`, `profile` updated details.
    *   *Note*: `linkedin_url` should be mapped to the database field `student_profile.linkedln_url`.
*   **`PUT /api/v1/users/me/teacher-profile`**
    *   *Description*: Update teacher's specific profile info.
    *   *Request Body*: `bio`, `school_address`, `cv_url`.
    *   *Response*: `message`, `profile` updated details.
*   **`POST /api/v1/teacher-register`**
    *   *Description*: Submit a new teacher registration application.
    *   *Request Body*: `motivation`, `cccd`, `cccd_front_url`, `cccd_back_url`.
    *   *Response*: `id`, `status` (`PENDING`), `message`.
*   **`PUT /api/v1/admin/teacher-register/{id}`**
    *   *Description*: Admin reviews and approves or rejects a teacher registration application.
    *   *Request Body*: `status` (`AGREE`, `REJECT`), `reviewed_note`.
    *   *Response*: `id`, `status`, `reviewed_by`, `reviewed_at`, `message`.
*   **`POST /api/v1/auth/forgot-password`**
     *   *Description*: Initiate password reset flow. Sends a short-lived verification code to the user's email (or configured recovery channel). For security the verification code is not returned in the API response.
     *   *Request Body*: `email`.
     *   *Response*: `message`, `verify_reset_password_token` (e.g. "If the email exists a verification code has been sent").

*   **`POST /api/v1/auth/verify-reset-password`**
     *   *Description*: Verify the password-reset verification code sent to the user's email. On success the server issues a one-time `reset_token` that can be used to perform the password update.
     *   *Request Body*: `email`, `verify_reset_password_token`.
     *   *Response*: `message` (short-lived, single-use token) and `message`.

*   **`POST /api/v1/auth/forgot-email`**
     *   *Description*: Initiate email-change/verification flow for updating a user's email. Sends a verification code to the *new* email address to confirm ownership.
     *   *Request Body*: `new_email`.
     *   *Response*: `message`, `verify_reset_email_token` (confirmation that verification code was sent to `new_email`).

*   **`POST /api/v1/auth/verify-reset-email`**
     *   *Description*: Verify the code that was sent to the new email address. On success the server updates the user's email (or issues a one-time token to authorize the change) and returns confirmation.
     *   *Request Body*: `new_email`, `verify_reset_email_token` (or `verify_reset_email_token` depending on implementation).
     *   *Response*: `message` and `updated_email`
     
### 2. Student Course Directory & Study Mode (`/api/v1/courses`, `/api/v1/student`)
*   **`GET /api/v1/courses`**
    *   *Description*: Public catalog retrieval with filters and pagination.
    *   *Query Parameters*: `page` (default 1), `size` (default 10), `q` (search text), `price_type` (`FREE`, `PAID`).
    *   *Response*: `total_items`, `total_pages`, `current_page`, `items` (Array of courses, each including `thumbnail_url`).
    *   *Note*: `price_type` should be derived from `courses.price` (`0` = `FREE`, `> 0` = `PAID`). The `difficulty` filter is not stored on `courses` in the current database model.
*   **`GET /api/v1/courses/{slug}`**
    *   *Description*: Public course landing overview information (ratings, description, sections overview).
    *   *Response*: `id`, `title`, `slug`, `description`, `price`, `rating`, `teacher_name`, `sections` (overview details).
    *   *Note*: `teacher_name` is derived by joining `courses.teacher_id` to the `user` table.
*   **`POST /api/v1/courses/{slug}/enroll`**
    *   *Description*: Enroll in a course (works instantly for FREE courses, redirects to payment creation for PAID courses).
    *   *Response*: `status` (`ENROLLED` or `PENDING_PAYMENT`), `checkout_url` (if PAID).
    *   *Note*: For PAID courses, the endpoint should create a `transaction` record before responding; `checkout_url` should be taken from `transaction.payos_link`.
*   **`GET /api/v1/student/courses`**
    *   *Description*: Retrieve courses currently enrolled by the current user.
    *   *Response*: List of courses including progress percentages.
    *   *Note*: Progress percentage should be computed from `lesson_content_progress` records versus the total lesson content in the course.
*   **`GET /api/v1/student/courses/{slug}/study`**
    *   *Description*: Get detailed curriculum syllabus with lock/completion ticks for the classroom workspace.
    *   *Response*: Sections, lessons, and content list with completed and locked states.
    *   *Note*: The `locked` state is computed dynamically based on prior lesson completion and ordering, not a dedicated database column.
*   **`POST /api/v1/student/progress/lesson-content/{id}/complete`**
    *   *Description*: Mark a reading or video lesson content as complete.
    *   *Response*: `message`, `completed_at`.
*   **`GET /api/v1/student/quizzes/{quizId}`**
    *   *Description*: Get quiz questions for the student test interface (omits `is_correct` field).
    *   *Response*: `id`, `title`, `attempts_left`, `questions` (Array of questions, each with `id`, `content`, `points`, `options`).
    *   *Note*: The response field `content` maps to `quiz_questions.content` in the database schema.
*   **`POST /api/v1/student/quizzes/{quizId}/submit`**
    *   *Description*: Submit quiz answers. Score is checked automatically against the database.
    *   *Request Body*: `answers` (Map of question_id -> option_id).
    *   *Response*: `submission_id`, `submitted_at`, `score`, `passed` (score >= `passing_score`), `passing_score`, `attempts_left`, `correct_answers` (detail options mapping).
*   **`POST /api/v1/webhooks/payos`**
    *   *Description*: Callback endpoint for PayOS payment notifications. Updates `transaction.status` and activates enrollment when payment succeeds.
    *   *Request Body*: PayOS notification payload containing transaction details and signature.
    *   *Response*: `message`.
*   **`POST /api/v1/courses/{slug}/unenroll`**
    *   *Description*: Cancel a student's enrollment in a course.
    *   *Response*: `message`.

### 3. Teacher Course & Curriculum Creator (`/api/v1/teacher/courses`)
*   **`GET /api/v1/teacher/courses`**
    *   *Description*: List courses owned/created by the teacher.
    *   *Response*: List of courses with FE-required metadata (`id`, `title`, `slug`, `thumbnail_url`, `price`, `status`, `created_at`, `updated_at`) and course status (`DRAFT`, `PENDING_REVIEW`, `PUBLISHED`, `ARCHIVED`).
*   **`POST /api/v1/teacher/courses`**
    *   *Description*: Create a new course workspace.
    *   *Request Body*: `title`, `description`, `price`, `thumbnail_url`, `field`, `tags`.
    *   *Response*: Course details with newly generated `id` and `slug`.
*   **`PUT /api/v1/teacher/courses/{id}`**
    *   *Description*: Edit metadata of a course.
    *   *Request Body*: `title`, `description`, `price`, `thumbnail_url`, `status`, `field`, `tags`.
    *   *Response*: Updated course details.
*   **`POST /api/v1/teacher/courses/{courseId}/sections`**
    *   *Description*: Add a new chapter section under a course.
    *   *Request Body*: `title`, `position`.
    *   *Response*: Section object details.
*   **`PUT /api/v1/teacher/sections/{sectionId}`**
    *   *Description*: Update section title or position.
    *   *Request Body*: `title`, `position`.
    *   *Response*: Updated section details.
*   **`DELETE /api/v1/teacher/sections/{sectionId}`**
    *   *Description*: Delete a section and cascade-delete its dependent lessons and lesson contents.
    *   *Response*: `message`.
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
    *   *Description*: Modify a content item binding.
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
    *   *Request Body*: `title`, `statement`, `input_description`, `output_description`, `constraints`, `sample_input`, `sample_output`, `explanation`, `difficulty`, `public`.
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

### 7. Lesson Interactions & Comments (`/api/v1/lessons`, `/api/v1/comments`)
*   **`GET /api/v1/lessons/{lessonId}/comments`**
    *   *Description*: Get comments for the lesson-content units under a lesson. Each comment is stored against a `lesson_content_id` in the database.
    *   *Response*: List of comments, each containing `id`, `lesson_content_id`, `parent_id`, `content`, `created_at`, `updated_at`, and nested replies.
*   **`POST /api/v1/lessons/{lessonId}/comments`**
    *   *Description*: Post a new comment or reply to an existing one for a lesson-content unit.
    *   *Request Body*: `lesson_content_id` (optional if the client already resolved the target content), `content`, `parent_id` (optional, for 2nd-level replies).
    *   *Response*: Created comment details.
*   **`DELETE /api/v1/comments/{commentId}`**
    *   *Description*: Delete own comment.
    *   *Response*: `message`.

### 8. Admin Moderation & CCCD Verification (`/api/v1/admin`, `/api/v1/teacher-register`)
*   **`POST /api/v1/teacher-register`**
    *   *Description*: Submit a new teacher registration application.
    *   *Request Body*: `motivation`, `cccd`, `cccd_front_url`, `cccd_back_url`.
    *   *Response*: `id`, `status` (`PENDING`), `message`.
*   **`GET /api/v1/admin/teacher-registers`**
    *   *Description*: List teacher registration requests for review.
    *   *Response*: List of requests (`id`, `teacher_id`, `motivation`, `cccd`, `cccd_front_url`, `cccd_back_url`, `status`, `reviewed_note`, `reviewed_by`, `reviewed_at`, `created_at`, `updated_at`, plus user details).
*   **`PUT /api/v1/admin/teacher-registers/{id}`**
    *   *Description*: Approve or reject a registration request. If approved, update related teacher-profile and role state accordingly.
    *   *Request Body*: `status` (`AGREE`, `REJECT`), `reviewed_note`.
    *   *Response*: `message`, `register_id`, `new_status`.
*   **`GET /api/v1/admin/reports`**
    *   *Description*: List reported courses.
    *   *Response*: List of flags (`course_id`, `reporter_name`, `content_reason`, `status`).
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
