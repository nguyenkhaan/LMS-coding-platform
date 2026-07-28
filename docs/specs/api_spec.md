# Spec: API Contracts (OpenAPI / Swagger Spec) - Task BE/FE-0.2

## Objective
Define the API Contract (endpoints, request/response models, and error responses) between the Frontend (React) and the Backend (FastAPI).
- Implement Pydantic schemas in FastAPI to automatically generate the OpenAPI JSON spec and interactive Swagger UI at `/docs`.
- Standardize all API error responses to a consistent JSON schema across the entire application.
- Export the final OpenAPI specification as `docs/specs/api.json`.

---

## Error Response Structure
All error responses (400, 401, 403, 404, 422, 500) must return:
```json
{
  "message": "Chi tiết thông báo lỗi thân thiện với người dùng",
  "error_code": "RESOURCE_NOT_FOUND",
  "details": []
}
```

---

## Auth Provider Endpoints
Port: `4001`
Base path: `/auth`

| # | Endpoint | Method | Query | Path | Request Body | Response | Description |
|---|----------|--------|-------|------|--------------|----------|-------------|
| 1 | `/authorize` | GET | `redirect_uri` | - | - | JSON (`message`) or RedirectResponse | Checks session; redirects to login page if missing. |
| 2 | `/login` | GET | `redirect_uri` | - | - | HTML template (`login.html`) | Renders the login page with `redirect_uri`. |
| 3 | `/login` | POST | - | - | `application/x-www-form-urlencoded`: `email`, `password`, `redirect_uri` | JSON (`code`, `redirect_uri`, `identity`) | Validates credentials; returns authorization code. |
| 4 | `/code` | POST | - | - | JSON: `code` (str) | JSON (`access_token`, `refresh_token`) | Exchanges authorization code for JWT tokens. |
| 5 | `/public-key` | GET | - | - | - | PEM text | Returns the RSA public JWK for token verification. |

### Key Auth Provider Notes
- Endpoint 3 reads `session_id` from Cookie (`HttpOnly`) and `email`, `password`, `redirect_uri` from form data.
- Endpoint 4 reads `code` directly as a FastAPI dependency parameter (not JSON body), because it is sent as a plain query/form field from the BE caller.
- Endpoints 3 and 4 are consumed behind the scenes by the Business Application; the frontend never calls them directly.

---

## Business Application Endpoints
Port: `4000`
Base path: `/api/v1`

### 1. Authentication & Profile Module
Path prefix: `/auth`, `/users`, `/teacher-register`, `/admin`

| # | Endpoint | Method | Query | Path | Request Body | Response | Description |
|---|----------|--------|-------|------|--------------|----------|-------------|
| 1 | `/auth/register` | POST | - | - | JSON: `full_name` (str), `email` (email), `password` (str), `address` (str) | JSON: `verify_code` (str), `message` (str) | Registers a student and returns OTP. |
| 2 | `/auth/verify` | GET | `code` (str) | - | - | JSON: `message` (str) | Verifies email OTP and activates the user. |
| 3 | `/auth/code` | POST | - | - | JSON: `code` (str), `redirect_uri` (str) | JSON: `message` (str), `user_info` (object) | Exchanges auth-provider code for session cookie + user info. |
| 4 | `/auth/login` | POST | - | - | JSON: `email` (email), `password` (str), `redirect_uri` (str) | JSON: `authorization_code` (str) | Returns an authorization code from auth-provider. |
| 5 | `/auth/google` | POST | - | - | JSON: `credential_token` (str) | JSON: `message` (str), `user_info` (object) | Google OAuth login / registration. |
| 6 | `/auth/logout` | POST | - | - | - | JSON: `message` (str) | Clears auth cookies. |
| 7 | `/auth/refresh` | POST | - | - | - | JSON: `message` (str) | Issues new access token from refresh cookie. |
| 8 | `/auth/forgot-password` | POST | - | - | JSON: `email` (email) | JSON: `message` (str) | Sends password reset link / code. |
| 9 | `/auth/reset-password` | POST | - | - | JSON: `token` (str), `new_password` (str) | JSON: `message` (str) | Resets password using the token. |
| 10 | `/auth/resend-otp` | POST | - | - | JSON: `email` (email) | JSON: `message` (str) | Resends the account verification OTP. |
| 11 | `/auth/change-email` | POST | - | - | JSON: `new_email` (email), `password` (str) | JSON: `message` (str) | Requests an email change; backend validates password and queues verification. |
| 12 | `/auth/verify-reset-email` | POST | - | - | JSON: `token` (str) | JSON: `message` (str) | Confirms the new email address using the verification token. |
| 13 | `/users/me` | GET | - | - | - | JSON: profile object | Retrieves current logged-in user profile. |
| 14 | `/users/me/profile` | PUT | - | - | JSON: `bio` (str), `school` (str), `major` (str), `github_url` (str), `facebook_url` (str), `linkedin_url` (str), `avatar_url` (str) | JSON: `message`, `profile` | Updates student profile fields. |
| 15 | `/users/me/teacher-profile` | PUT | - | - | JSON: `bio` (str), `school_address` (str), `cv_url` (str) | JSON: `message`, `profile` | Updates teacher profile fields. |
| 16 | `/teacher-register` | POST | - | - | JSON: `motivation` (str), `cccd` (str), `cccd_front_url` (str), `cccd_back_url` (str) | JSON: `id` (int), `status` (PENDING), `message` | Submits a new teacher registration application. |
| 17 | `/admin/teacher-registers` | GET | - | - | - | JSON: array of registration requests | Lists teacher registration requests. |
| 18 | `/admin/teacher-registers/{id}` | PUT | - | `id` (int) | JSON: `status` (AGREE \| REJECT), `reviewed_note` (str) | JSON: `id`, `status`, `reviewed_by`, `reviewed_at`, `message` | Reviews and approves / rejects teacher registration. |
| 19 | `/admin/reports` | GET | - | - | - | JSON: array of reports | Lists reported courses. |
| 20 | `/admin/courses/{id}/status` | POST | - | `id` (str) | JSON: `status` (PUBLISHED / ARCHIVED / DRAFT) | JSON: `message`, `course_id`, `new_status` | Updates course moderation status. |
| 21 | `/admin/users/{userId}/status` | PUT | - | `userId` (int) | JSON: `account_status` (ACTIVE / BANNED) | JSON: `message`, `user_id`, `new_status` | Bans or reactivates a user. |

### 2. Student Course Directory & Study Mode
Path prefix: `/courses`, `/student`

| # | Endpoint | Method | Query | Path | Request Body | Response | Description |
|---|----------|--------|-------|------|--------------|----------|-------------|
| 1 | `/courses` | GET | `page` (int, default=1), `size` (int, default=10), `q` (str), `price_type` (FREE / PAID) | - | - | JSON: `total_items`, `total_pages`, `current_page`, `items` | Public course catalog with pagination and filters. |
| 2 | `/courses/{slug}` | GET | - | `slug` (str) | - | JSON: course details + `sections` overview | Public course landing information. |
| 3 | `/courses/{slug}/enroll` | POST | - | `slug` (str) | - | JSON: `status` (ENROLLED / PENDING_PAYMENT), `checkout_url`? | Enrolls user in a course. |
| 4 | `/student/courses` | GET | - | - | - | JSON: list of enrolled courses with progress | Retrieves the current user's enrollments. |
| 5 | `/student/courses/{slug}/study` | GET | - | `slug` (str) | - | JSON: sections, lessons, content with `completed` and `locked` | Detailed curriculum for the classroom workspace. |
| 6 | `/student/progress/lesson-content/{id}/complete` | POST | - | `id` (int) | - | JSON: `message`, `completed_at` | Marks a reading/video content as complete. |
| 7 | `/student/quizzes/{quizId}` | GET | - | `quizId` (int) | - | JSON: quiz object + questions (without `is_correct`) | Gets quiz questions for the test interface. |
| 8 | `/student/quizzes/{quizId}/submit` | POST | - | `quizId` (int) | JSON: `answers` (Map<int, int>) | JSON: `submission_id`, `score`, `passed`, `correct_answers`, ... | Submits quiz answers and returns score. |
| 9 | `/webhooks/payos` | POST | - | - | JSON: PayOS notification payload | JSON: `message` | PayOS payment notification callback. |
| 10 | `/courses/{slug}/unenroll` | POST | - | `slug` (str) | - | JSON: `message` | Cancels a student's enrollment. |

### 3. Teacher Course & Curriculum Creator
Path prefix: `/teacher/courses`, `/teacher/sections`, `/teacher/lessons`, `/teacher/lesson-contents`

| # | Endpoint | Method | Query | Path | Request Body | Response | Description |
|---|----------|--------|-------|------|--------------|----------|-------------|
| 1 | `/teacher/courses` | GET | - | - | - | JSON: list of course objects | Lists courses owned by the teacher. |
| 2 | `/teacher/courses` | POST | - | - | JSON: `title`, `description`, `price`, `thumbnail_url`, `field`, `tags` | JSON: created course object | Creates a new course workspace. |
| 3 | `/teacher/courses/{id}` | PUT | - | `id` (int) | JSON: `title`, `description`, `price`, `thumbnail_url`, `status`, `field`, `tags` | JSON: updated course object | Updates course metadata. |
| 4 | `/teacher/courses/{courseId}/sections` | POST | - | `courseId` (int) | JSON: `title`, `position` | JSON: section object | Adds a new chapter section. |
| 5 | `/teacher/sections/{sectionId}` | PUT | - | `sectionId` (int) | JSON: `title`, `position` | JSON: updated section object | Updates a section's title and position. |
| 6 | `/teacher/sections/{sectionId}` | DELETE | - | `sectionId` (int) | - | JSON: `message` | Deletes a section and cascades to lessons/content. |
| 7 | `/teacher/sections/{sectionId}/lessons` | POST | - | `sectionId` (int) | JSON: `title`, `summary`, `position` | JSON: lesson object | Creates a new lesson within a section. |
| 8 | `/teacher/lessons/{lessonId}` | PUT | - | `lessonId` (int) | JSON: `title`, `summary`, `position` | JSON: updated lesson object | Updates lesson metadata. |
| 9 | `/teacher/courses/{courseId}/curriculum/reorder` | PUT | - | `courseId` (int) | JSON: `reorder_data` (array of section/lesson reorder objects) | JSON: `message` | Batch reorders sections and lessons positions. |
| 10 | `/teacher/lessons/{lessonId}/contents` | POST | - | `lessonId` (int) | JSON: `content_type` (READING/QUIZ/PROBLEM), `content_id`, `media_url`?, `position` | JSON: content metadata object | Binds a reading/quiz/problem to a lesson. |
| 11 | `/teacher/lesson-contents/{contentId}` | PUT | - | `contentId` (int) | JSON: `media_url`, `position` | JSON: updated content object | Updates a lesson-content binding. |

#### Batch Reorder Payload Shape
```json
[
  { "item_type": "section", "id": 1, "position": 0, "parent_id": null },
  { "item_type": "lesson",  "id": 5, "position": 1, "parent_id": null }
]
```

### 4. Online Judge (OJ) Problem & Run/Submit Engine
Path prefix: `/problems`, `/submissions`, `/teacher/problems`

| # | Endpoint | Method | Query | Path | Request Body | Response | Description |
|---|----------|--------|-------|------|--------------|----------|-------------|
| 1 | `/problems` | GET | - | - | - | JSON: list of problems | Public OJ problem catalog. |
| 2 | `/problems/{slug}` | GET | - | `slug` (str) | - | JSON: problem detail object | Problem description, constraints, samples. |
| 3 | `/problems/{slug}/run` | POST | - | `slug` (str) | JSON: `source_code`, `language_id`, `stdin`? | JSON: `stdout`, `runtime_ms`, `memory_kb`, `compile_error`, `status` | Executes code against custom input in sandbox. |
| 4 | `/problems/{slug}/submit` | POST | - | `slug` (str) | JSON: `source_code`, `language_id` | JSON: `submission_id`, `status` (PENDING) | Queues final grading to RabbitMQ. |
| 5 | `/submissions/{submissionId}/status` | GET | - | `submissionId` (str) | - | JSON: `status`, `score`, `runtime_ms`, `memory_kb`, `details` | Polls execution progress and final result. |
| 6 | `/teacher/problems` | POST | - | - | JSON: `title`, `statement`, `input_description`, `output_description`, `constraints`, `sample_input`, `sample_output`, `explanation`, `difficulty`, `public` (bool) | JSON: created problem object | Teacher creates a new problem template. |
| 7 | `/teacher/problems/{problemId}/testcases/upload` | POST | - | `problemId` (int) | `multipart/form-data`: `file` (.zip) | JSON: `uploaded_count`, `message` | Uploads ZIP of testcase pairs. |

### 5. AI Mock Interview Module
Path prefix: `/interviews`

| # | Endpoint | Method | Query | Path | Request Body | Response | Description |
|---|----------|--------|-------|------|--------------|----------|-------------|
| 1 | `/interviews/sessions` | GET | - | - | - | JSON: sessions array (`id`, `topic`, `level`, `started_at`, `status`, `score`) | Lists the student's past interview sessions. |
| 2 | `/interviews/sessions` | POST | - | - | JSON: `topic` (str), `level` (INTERN / FRESHER / JUNIOR / SENIOR) | JSON: `session_id`, `first_question` | Initializes a new AI mock interview session. |
| 3 | `/interviews/sessions/{sessionId}/chat` | POST | - | `sessionId` (str) | JSON: `message` (str) | SSE stream of AI follow-up questions | Posts candidate answer; streams next AI response. |
| 4 | `/interviews/sessions/{sessionId}/report` | GET | - | `sessionId` (str) | - | JSON: `overall_score`, `strengths`, `weaknesses`, `suggestions`, `chat_transcript` | Retrieves evaluation report. |

### 6. PayOS Payments
Path prefix: `/payments`

| # | Endpoint | Method | Query | Path | Request Body | Response | Description |
|---|----------|--------|-------|------|--------------|----------|-------------|
| 1 | `/payments/payos/create` | POST | - | - | JSON: `course_id` (int) | JSON: `transaction_code`, `payos_link`, `qrcode`, `amount`, `expires_at` | Initiates PayOS VietQR checkout. |
| 2 | `/payments/payos-webhook` | POST | - | - | JSON: PayOS notification payload | JSON: `{ "status": "ok" }` | Handles PayOS payment verification hooks. |
| 3 | `/payments/transactions/{transactionCode}/status` | GET | - | `transactionCode` (str) | - | JSON: `status`, `amount`, `completed_at` | Checks payment completion state. |

### 7. Lesson Interactions & Comments
Path prefix: `/lessons`, `/comments`

| # | Endpoint | Method | Query | Path | Request Body | Response | Description |
|---|----------|--------|-------|------|--------------|----------|-------------|
| 1 | `/lessons/{lessonId}/comments` | GET | - | `lessonId` (int) | - | JSON: comments with nested replies, `lesson_content_id`, `created_at`, ... | Fetches comments for a lesson. |
| 2 | `/lessons/{lessonId}/comments` | POST | - | `lessonId` (int) | JSON: `lesson_content_id`?, `content` (str), `parent_id`? | JSON: created comment object | Posts a new comment or reply. |
| 3 | `/comments/{commentId}` | DELETE | - | `commentId` (int) | - | JSON: `message` | Deletes the user's own comment. |

### 8. Admin Moderation & CCCD Verification
Path prefix: `/admin`, `/teacher-register`

| # | Endpoint | Method | Query | Path | Request Body | Response | Description |
|---|----------|--------|-------|------|--------------|----------|-------------|
| 1 | `/teacher-register` | POST | - | - | JSON: `motivation`, `cccd`, `cccd_front_url`, `cccd_back_url` | JSON: `id`, `status` (PENDING), `message` | Submits a teacher registration application. |
| 2 | `/admin/teacher-registers` | GET | - | - | - | JSON: list of registration requests with user data | Lists requests pending admin review. |
| 3 | `/admin/teacher-registers/{id}` | PUT | - | `id` (int) | JSON: `status` (AGREE / REJECT), `reviewed_note` | JSON: `id`, `status`, `new_status`, `message` | Approves or rejects a teacher registration. |
| 4 | `/admin/reports` | GET | - | - | - | JSON: array of course report objects | Lists reported courses. |
| 5 | `/admin/courses/{id}/status` | POST | - | `id` (str) | JSON: `status` (PUBLISHED / ARCHIVED / DRAFT) | JSON: `message`, `course_id`, `new_status` | Updates course moderation status. |
| 6 | `/admin/users/{userId}/status` | PUT | - | `userId` (int) | JSON: `account_status` (ACTIVE / BANNED) | JSON: `message`, `user_id`, `new_status` | Bans or reactivates a user account. |

### 9. Notifications Module
Path prefix: `/notifications`

| # | Endpoint | Method | Query | Path | Request Body | Response | Description |
|---|----------|--------|-------|------|--------------|----------|-------------|
| 1 | `/notifications` | GET | - | - | - | JSON: list of notification objects | Fetches the current user's alert list. |
| 2 | `/notifications/{id}/read` | PUT | - | `id` (int) | - | JSON: `message` | Marks the notification as read. |

### 10. Teacher Analytics Dashboard
Path prefix: `/teacher/dashboard`

| # | Endpoint | Method | Query | Path | Request Body | Response | Description |
|---|----------|--------|-------|------|--------------|----------|-------------|
| 1 | `/teacher/dashboard/summary` | GET | - | - | - | JSON: `total_revenue`, `current_balance`, `enrolled_students_count`, `active_courses_count` | Financial summary metrics. |
| 2 | `/teacher/dashboard/revenue` | GET | `period` (DAILY / WEEKLY / MONTHLY) | - | - | JSON: list of revenue entries | Revenue analytics for charts. |
| 3 | `/teacher/dashboard/students` | GET | - | - | - | JSON: list of student records with course title, progress, ... | Lists students under teacher's courses. |

---

## Commands
```bash
# Auth Provider (port 4001)
cd src/backend/auth-provider
uv run main.py

# Business Application (port 4000)
cd src/backend/business-application
python main.py

# Export Business Application OpenAPI JSON spec
python -c "import json; from src.app import app; print(json.dumps(app.openapi()))" > docs/specs/api.json
```

---

## Project Structure
- `docs/specs/api_spec.md` -> This API specification document.
- `docs/specs/api.json` -> Generated OpenAPI 3.0 specification.
- `src/backend/auth-provider/` -> Authentication & User Service (FastAPI + uv), port 4001.
  - `src/modules/auth/` -> OAuth authorize, login, token exchange.
- `src/backend/business-application/` -> Core LMS API (FastAPI + uv), port 4000.
  - `src/modules/auth/` -> Local register, OTP verify, login wrapping auth-provider.
  - `src/modules/course/` -> Course catalog, enrollment, curriculum.
  - `src/modules/problem/` -> OJ problems, run, submit, submissions.
  - `src/modules/interview/` -> AI interview sessions, SSE chat, report.
  - `src/modules/payment/` -> PayOS transactions and webhooks.

---

## Code Style
All response and request models must inherit from `pydantic.BaseModel`.
Exceptions must be handled by FastAPI custom exception handlers to return the unified error structure.

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
