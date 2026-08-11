# API Specification - LMS Coding Platform

## 1. Phạm vi và quy ước

Tài liệu này là contract API cho MVP. Nó ưu tiên các luồng đang có wireframe và yêu cầu trong [PRD](../prd-documents/prd.md), [gap analysis](../prd-documents/gap-analysis.md) và [DATABASE.txt](../DATABASE.txt). Đây không phải danh mục endpoint đầy đủ; route gắn nhãn `PROPOSED` cần được bổ sung khi triển khai.

| Thành phần | Base URL | Ghi chú |
|---|---|---|
| Auth Provider | `http://localhost:4001/auth` | Đăng nhập, token, OTP và mật khẩu. |
| Business Application | `http://localhost:4000/api/v1` | API nghiệp vụ LMS. |

- Route không có nhãn là endpoint đang có hoặc giữ tương thích với API hiện tại.
- `PROPOSED` là contract cần có để đáp ứng PRD nhưng có thể chưa được implement.
- `VERIFY` là điểm cần chốt trước khi frontend phụ thuộc, không phải một giá trị dữ liệu gửi lên API.
- Ngoại trừ upload và login form, request dùng `application/json`. API nhận access token qua `Authorization: Bearer <token>` hoặc cơ chế cookie do Auth Provider quản lý.
- Mọi thời gian dùng ISO 8601 UTC; tiền dùng `decimal` và phải đi cùng `currency` sau khi Product Owner chốt currency.

### Response dùng chung

| Mẫu | Cấu trúc |
|---|---|
| Một resource | `{ "data": { ... } }` |
| Danh sách phân trang | `{ "data": [...], "pagination": { "page": 1, "size": 10, "total": 42 } }` |
| Mutation thành công | `{ "data": { ... }, "message": "..." }` |
| Lỗi | `{ "message": "...", "error_code": "...", "details": [] }` |

Ví dụ lỗi validation:

```json
{
  "message": "Course đã được enrollment",
  "error_code": "ALREADY_ENROLLED",
  "details": [{ "field": "course_id", "reason": "duplicate enrollment" }]
}
```

Các mã lỗi dùng thường xuyên: `UNAUTHENTICATED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `VALIDATION_ERROR` (422), `DUPLICATE_RESOURCE` (409), `INVALID_STATE` (409), `PAYMENT_EXPIRED` (410), `RATE_LIMITED` (429). Không trả raw exception, token, CCCD hay payload thanh toán nhạy cảm.

## 2. Auth và hồ sơ người dùng

### Auth Provider

| Method | Route | Request | Response | Mô tả |
|---|---|---|---|---|
| `POST` | `/register` | `full_name`, `email`, `password`, `address` | `verify_code`, `message` | Tạo Student ở trạng thái chưa xác thực và gửi OTP. |
| `GET` | `/verify?otp={otp}` | Query `otp` | `message` | Xác thực email. |
| `POST` | `/login` | Form: `email`, `password`, `redirect_uri` | `code`, `redirect_uri`, `identity` | Đăng nhập và nhận authorization code. |
| `POST` | `/code?code={code}` | Query `code` | `access_token`, `refresh_token` | Đổi authorization code lấy token. |
| `POST` | `/refresh` | `refresh_token` | `access_token` | Làm mới access token. |
| `POST` | `/google` | `credential_code` | `access_token`, `refresh_token` | Đăng nhập/đăng ký Google. |
| `POST` | `/logout` | - | `message` | Hủy session/token cookie. |
| `POST` | `/resend-otp` | `email` | `message` | Gửi lại OTP. |
| `POST` | `/forgot-password` | `email` | `message`, `code` | Khởi tạo reset password. |
| `POST` | `/reset-password` | `code`, `new_password` | `message` | Đặt lại mật khẩu. |
| `POST` | `/change-email` | `new_email`, `password` | `message` | Yêu cầu đổi email và gửi xác nhận. |
| `GET` | `/verify-reset-email?token={token}` | Query `token` | `message` | Hoàn tất đổi email. |

### Current user và profile

| Method | Route | Actor | Request | Response | Quy tắc |
|---|---|---|---|---|---|
| `GET` | `/users/me` | User đăng nhập | - | `user`, `student_profile`, `teacher_profile`, `teacher_application_status`, `capabilities` | Chỉ trả dữ liệu current user. `capabilities.can_teach` chỉ true khi application là `APPROVED`. |
| `PUT` | `/users/me/profile` | User đăng nhập | `bio`, `school`, `major`, `github_url`, `facebook_url`, `linkedin_url`, `avatar_url` | Profile đã cập nhật | Chỉ sửa profile của chính mình. |
| `PUT` | `/users/me/teacher-profile` | User đăng nhập | `bio`, `school_address`, `cv_url` | Teacher profile đã cập nhật | Tạo/sửa hồ sơ, không tự cấp quyền Teacher. |

## 3. Teacher application và moderation

Teacher application dùng trạng thái `DRAFT`, `PENDING`, `APPROVED`, `REJECTED`. Giá trị cũ `AGREE/REJECT` không còn là input API.

| Method | Route | Actor | Request | Response | Quy tắc |
|---|---|---|---|---|---|
| `POST` | `/teacher-applications` `PROPOSED` | Student | `motivation`, `cccd`, `cccd_front_url`, `cccd_back_url`, `education[]`, `experience[]` | `id`, `status: "DRAFT"`, `updated_at` | Chỉ có một application đang làm việc cho mỗi user. CCCD/URL không ghi vào log. |
| `GET` | `/teacher-applications/me` `PROPOSED` | Student | - | Application, `history[]`, `can_submit`, `can_resubmit` | Chỉ owner xem được. |
| `PUT` | `/teacher-applications/me` `PROPOSED` | Student | Các field tạo application | Application đã cập nhật | Chỉ sửa khi `DRAFT` hoặc `REJECTED`; update sau reject đưa về `DRAFT`. |
| `POST` | `/teacher-applications/me/submit` `PROPOSED` | Student | - | `id`, `status: "PENDING"`, `submitted_at` | Bắt buộc đủ field; chỉ submit từ `DRAFT`. |
| `POST` | `/teacher-applications/me/resubmit` `PROPOSED` | Student | - | `id`, `status: "PENDING"`, `submitted_at` | Chỉ từ `REJECTED` sau khi đã chỉnh sửa. |
| `GET` | `/admin/teacher-applications` `PROPOSED` | Admin | `status`, `page`, `size` | Danh sách application, pagination | Không trả CCCD đầy đủ trong list; chỉ Admin. |
| `GET` | `/admin/teacher-applications/{id}` `PROPOSED` | Admin | - | Application và `history[]` | Chỉ Admin. |
| `POST` | `/admin/teacher-applications/{id}/review` `PROPOSED` | Admin | `decision: "APPROVED" \| "REJECTED"`, `note` | `id`, `status`, `reviewed_by`, `reviewed_at`, `note` | Chỉ review application `PENDING`; lưu `teacher_register_history`, audit và notification. |
| `PUT` | `/admin/users/{user_id}/status` | Admin | `account_status: "ACTIVE" \| "BANNED"` | `user_id`, `account_status` | Không cho user tự thay đổi account status. |

## 4. Catalog, favorite, review và course moderation

Course public chỉ là course đã được duyệt; tên canonical hiện là `APPROVED`. Việc map trạng thái legacy `PUBLISHED` cần được xác nhận trong migration.

| Method | Route | Actor | Request | Response | Quy tắc |
|---|---|---|---|---|---|
| `GET` | `/courses` | Public | `q`, `field`, `tag`, `price_type`, `page`, `size` | Course cards, pagination | Chỉ trả course `APPROVED` và thỏa visibility policy. |
| `GET` | `/courses/{slug}` | Public | - | Course detail, instructor, sections overview, `is_favorited`, review summary | Không lộ curriculum học hay nội dung private. |
| `POST` | `/courses/{course_id}/favorite` `PROPOSED` | Student | - | `course_id`, `is_favorited: true` | Unique `(user_id, course_id)`; gọi lặp trả state hiện tại hoặc `DUPLICATE_RESOURCE`. |
| `DELETE` | `/courses/{course_id}/favorite` `PROPOSED` | Student | - | `course_id`, `is_favorited: false` | Chỉ xóa favorite của owner; idempotent. |
| `GET` | `/courses/{course_id}/reviews` `PROPOSED` | Public | `page`, `size`, `rating` | Reviews công khai, pagination | Chỉ trả review chưa bị ẩn theo policy. |
| `POST` | `/courses/{course_id}/reviews` `PROPOSED` | Student | `rating` (1..5), `content` | Review mới | Bắt buộc enrollment của chính user; unique/multiplicity theo policy `VERIFY`; không dùng lesson comment thay course review. |
| `PUT` | `/courses/{course_id}/reviews/me` `PROPOSED` | Student | `rating`, `content` | Review đã cập nhật | Owner + enrollment. |
| `GET` | `/teacher/courses` | Teacher đã approved | `status`, `page`, `size` | Course của teacher, pagination | Chỉ course owned by current teacher. |
| `POST` | `/teacher/courses` | Teacher đã approved | `title`, `description`, `price`, `currency`, `thumbnail_url`, `field`, `tags` | Course mới: `id`, `slug`, `status: "DRAFT"` | Teacher chưa approved nhận `FORBIDDEN`. |
| `GET` | `/teacher/courses/{course_id}` `PROPOSED` | Teacher owner | - | Course workspace, moderation metadata | Ownership bắt buộc. |
| `PUT` | `/teacher/courses/{course_id}` | Teacher owner | Field metadata được phép sửa | Course đã cập nhật | Không tự set `APPROVED`; chỉ sửa khi state cho phép. |
| `POST` | `/teacher/courses/{course_id}/submit-review` `PROPOSED` | Teacher owner | - | `status: "PENDING_REVIEW"`, `submitted_at` | Validate metadata/curriculum tối thiểu; chỉ từ `DRAFT` hoặc `REJECTED`. |
| `POST` | `/teacher/courses/{course_id}/resubmit` `PROPOSED` | Teacher owner | - | `status: "PENDING_REVIEW"` | Chỉ course `REJECTED` sau khi sửa. |
| `GET` | `/admin/courses` `PROPOSED` | Admin | `status`, `page`, `size` | Courses chờ review, pagination | Chỉ Admin. |
| `POST` | `/admin/courses/{course_id}/review` `PROPOSED` | Admin | `decision: "APPROVED" \| "REJECTED"`, `note` | `course_id`, `status`, `reviewed_by`, `reviewed_at`, `note` | Chỉ review course `PENDING_REVIEW`; lưu `course_moderation_review`, audit và notification. |
| `POST` | `/admin/courses/{course_id}/archive` `PROPOSED` | Admin | `note` | `course_id`, `status: "ARCHIVED"` | Dùng policy riêng cho learner đã mua course. |

## 5. Course builder và learning

`lesson_content.content_type` chỉ nhận `READING`, `QUIZ`, `PROBLEM`. `content_id` là polymorphic reference nên service phải xác minh loại, tồn tại, ownership và course tương ứng trước khi bind.

| Method | Route | Actor | Request | Response | Quy tắc |
|---|---|---|---|---|---|
| `POST` | `/teacher/courses/{course_id}/sections` | Teacher owner | `title`, `position` | Section | Course phải editable. |
| `PUT` | `/teacher/sections/{section_id}` | Teacher owner | `title`, `position` | Section | Xác minh section thuộc course owner. |
| `DELETE` | `/teacher/sections/{section_id}` | Teacher owner | - | `message` | Không xóa course đã approved nếu policy không cho phép; cascade phải được xác nhận. |
| `POST` | `/teacher/sections/{section_id}/lessons` | Teacher owner | `title`, `summary`, `position` | Lesson | Section ownership bắt buộc. |
| `PUT` | `/teacher/lessons/{lesson_id}` | Teacher owner | `title`, `summary`, `position` | Lesson | Lesson ownership bắt buộc. |
| `PUT` | `/teacher/courses/{course_id}/curriculum/reorder` | Teacher owner | `items: [{item_type, id, position, parent_id}]` | `message` | Validate item thuộc đúng course, position không trùng. |
| `POST` | `/teacher/lessons/{lesson_id}/contents` | Teacher owner | `content_type`, `content_id`, `position` | Lesson content | Reject loại khác ba giá trị trên; không nhận media field ngoài model content tương ứng. |
| `PUT` | `/teacher/lesson-contents/{id}` | Teacher owner | `content_id?`, `position?` | Lesson content | Re-validate type/id và ownership khi đổi content. |
| `GET` | `/student/courses` | Student | `page`, `size` | Enrollment cards, progress | Chỉ enrollment của current user. |
| `GET` | `/student/courses/{slug}/study` | Student đã enrollment | - | Sections, lessons, content access, `completed`, `locked` | Bắt buộc enrollment hợp lệ; policy archive xác định quyền tiếp tục học. |
| `POST` | `/student/progress/lesson-contents/{id}/complete` `PROPOSED` | Student đã enrollment | - | `lesson_content_id`, `completed_at`, `progress` | Chỉ content `READING`; unlock/access và enrollment bắt buộc. |
| `GET` | `/student/progress` `PROPOSED` | Student | `course_id?` | Progress theo enrollment/course | Chỉ current user. |

## 6. Quiz và Online Judge

Quiz attempt dùng `IN_PROGRESS`, `SUBMITTED`, `ABANDONED`. Số retry, thời hạn attempt và rule pass lấy từ Quiz config; nếu chưa có quyết định, trả `VERIFY` trong config thay vì frontend tự đoán.

| Method | Route | Actor | Request | Response | Quy tắc |
|---|---|---|---|---|---|
| `POST` | `/student/quizzes/{quiz_id}/attempts` `PROPOSED` | Student đã enrollment | - | `attempt_id`, `status`, `questions`, `expires_at?` | Tạo attempt hoặc resume attempt hợp lệ; không trả `is_correct`. |
| `GET` | `/student/quizzes/{quiz_id}/attempts/{attempt_id}` `PROPOSED` | Attempt owner | - | Attempt, questions, saved answers | Owner + enrollment; không trả đáp án đúng. |
| `PUT` | `/student/quizzes/{quiz_id}/attempts/{attempt_id}/answers` `PROPOSED` | Attempt owner | `answers: [{question_id, option_id}]` | `attempt_id`, `saved_at` | Chỉ attempt `IN_PROGRESS`; option phải thuộc question/quiz. |
| `POST` | `/student/quizzes/{quiz_id}/attempts/{attempt_id}/submit` `PROPOSED` | Attempt owner | - | `submission_id`, `score`, `passed`, `status: "SUBMITTED"`, `completed_at?` | Idempotent; kiểm tra retry limit; completion chỉ khi đạt passing score. |
| `GET` | `/student/quizzes/{quiz_id}/attempts` `PROPOSED` | Student đã enrollment | `page`, `size` | Attempt history, pagination | Chỉ owner; không lộ answer key. |
| `GET` | `/problems` | Public/Student | `tag`, `difficulty`, `page`, `size` | Problem cards, pagination | Chỉ problem public/được cấp access. |
| `GET` | `/problems/{slug}` | Public/Student | - | Statement, constraints, samples, languages | Không trả hidden testcase. |
| `POST` | `/problems/{slug}/run` | Student | `source_code`, `language_id`, `stdin?` | `stdout`, `runtime_ms`, `memory_kb`, `compile_error?`, `status` | Chạy sandbox với input custom; rate limit và không ghi hidden data. |
| `POST` | `/problems/{slug}/submit` | Student | `source_code`, `language_id` | `submission_id`, `status: "PENDING"` | Tạo `problem_submission`; job queue xử lý async. |
| `GET` | `/submissions/{submission_id}` `PROPOSED` | Submission owner/Teacher owner/Admin | - | `status`, `score`, `runtime_ms`, `memory_kb`, `testcase_summary` | Chỉ aggregate hidden result, không raw input/output. |
| `GET` | `/problems/{slug}/submissions` `PROPOSED` | Submission owner | `page`, `size` | Submission history, pagination | Owner only; teacher xem qua course/problem ownership policy. |
| `POST` | `/teacher/problems` | Teacher đã approved | Problem metadata, `tags`, config | Problem | Teacher chỉ tạo/sửa problem của mình. |
| `PUT` | `/teacher/problems/{problem_id}` `PROPOSED` | Teacher owner | Problem metadata/config | Problem đã cập nhật | Ownership và validation language/testcase. |
| `POST` | `/teacher/problems/{problem_id}/testcases/upload` | Teacher owner | `multipart/form-data` file testcase | `uploaded_count`, `message` | File được kiểm tra; testcase hidden không được trả qua API learner. |

## 7. Cart, payment và enrollment

MVP checkout một course cho mỗi order. Cart có thể hiển thị nhiều item nhưng checkout nhiều course chưa thuộc phạm vi cho đến khi quyết định order cardinality được chốt.

| Method | Route | Actor | Request | Response | Quy tắc |
|---|---|---|---|---|---|
| `GET` | `/cart` `PROPOSED` | Student | - | `items`, `subtotal`, `currency` | Chỉ cart current user. |
| `POST` | `/cart/items` `PROPOSED` | Student | `course_id` | Cart item, totals | Course phải public/eligible và chưa enrollment; unique `(cart_id, course_id)`. |
| `DELETE` | `/cart/items/{course_id}` `PROPOSED` | Student | - | Cart totals | Chỉ item của current user's cart. |
| `POST` | `/courses/{slug}/enroll` | Student | - | Free: `enrollment`; paid: `order_id`, `transaction_code`, `checkout_url`, `expires_at` | Route tương thích: free tạo enrollment một lần; paid tạo checkout một course. |
| `POST` | `/payments/payos/create` | Student | `course_id` | `order_id`, `transaction_code`, `checkout_url`, `qrcode?`, `amount`, `currency`, `expires_at`, `status: "PENDING"` | Reject nếu đã enrollment hoặc payment active chưa hết hạn; snapshot price. |
| `GET` | `/payments/transactions/{transaction_code}/status` | Transaction owner/Admin | - | `transaction_code`, `status`, `amount`, `currency`, `expires_at`, `completed_at`, `enrollment?` | Owner or Admin only; expired payment trả `EXPIRED`. |
| `POST` | `/payments/payos-webhook` | PayOS | Provider payload + signature | `{ "data": { "accepted": true } }` | Verify signature, provider event và amount; idempotent bằng provider transaction/event code. Không tin status từ client. |
| `GET` | `/orders` `PROPOSED` | Student | `page`, `size` | Orders của current user, pagination | Chỉ owner. |
| `GET` | `/orders/{order_id}` `PROPOSED` | Order owner/Admin | - | Order, item snapshot, transaction status | Không trả payment secret. |

Webhook hợp lệ chuyển `PENDING -> COMPLETED` (hoặc `FAILED`/`EXPIRED`). Trong cùng transaction nghiệp vụ, service tạo tối đa một `enrollment` cho `(student_id, course_id)`, ghi wallet ledger, notification và audit. Webhook lặp lại phải trả thành công mà không nhân đôi các side effect.

## 8. Wallet và payout

| Method | Route | Actor | Request | Response | Quy tắc |
|---|---|---|---|---|---|
| `GET` | `/teacher/wallet` `PROPOSED` | Teacher đã approved | - | `balance`, `currency`, `pending_payout_amount` | Chỉ wallet của current teacher. |
| `GET` | `/teacher/wallet/ledger` `PROPOSED` | Teacher đã approved | `page`, `size`, `type?` | Ledger entries, pagination | Ledger immutable, owner only. |
| `POST` | `/teacher/payout-requests` `PROPOSED` | Teacher đã approved | `amount`, `currency`, `payout_destination` | `id`, `status: "PENDING"`, `amount`, `created_at` | Amount > 0, đạt minimum payout, không vượt available balance; reserve được ghi ledger. |
| `GET` | `/teacher/payout-requests` `PROPOSED` | Teacher đã approved | `page`, `size` | Payout requests, pagination | Owner only. |
| `GET` | `/admin/payout-requests` `PROPOSED` | Admin | `status`, `page`, `size` | Payout requests, pagination | Admin only. |
| `POST` | `/admin/payout-requests/{id}/review` `PROPOSED` | Admin | `decision: "APPROVED" \| "REJECTED"`, `note` | `id`, `status`, `reviewed_by`, `reviewed_at` | Chỉ payout `PENDING`; reject tạo reversal ledger khi đã reserve. |
| `POST` | `/admin/payout-requests/{id}/settle` `PROPOSED` | Admin/system | `result: "COMPLETED" \| "FAILED"`, `settlement_reference?`, `failure_reason?` | `id`, `status`, `settled_at` | Chỉ `APPROVED`/`PROCESSING`; failed tạo reversal ledger idempotently. |

## 9. AI Interview, notification, comment và dashboard

AI Interview có tối đa 12 câu và một final report cho mỗi session. Chat dùng text; API không lưu recording.

| Method | Route | Actor | Request | Response | Quy tắc |
|---|---|---|---|---|---|
| `GET` | `/interviews/sessions` | Student | `page`, `size` | Sessions, pagination | Chỉ session của current user. |
| `POST` | `/interviews/sessions` | Student | `topic`, `level` | `session_id`, `status: "ACTIVE"`, `question_count`, `first_question` | Validate level; tạo session mới theo policy active-session. |
| `POST` | `/interviews/sessions/{session_id}/chat` | Session owner | `message` | AI message/stream event, `question_count`, `status` | Reject khi không `ACTIVE` hoặc đạt max question; rate limit. |
| `POST` | `/interviews/sessions/{session_id}/end` `PROPOSED` | Session owner | - | `session_id`, `status: "REPORT_GENERATING"` | Idempotent; enqueue report generation. |
| `GET` | `/interviews/sessions/{session_id}/report` | Session owner | - | `status`, `report?`, `generated_at?` | Khi đang generate trả `REPORT_GENERATING`; chỉ một report per session. |
| `GET` | `/notifications` | User đăng nhập | `unread_only?`, `page`, `size` | `id`, `type`, `title`, `body`, `target_type`, `target_id`, `read_at`, pagination | Chỉ notification recipient; type khớp `NotificationType` trong DB. |
| `PUT` | `/notifications/{id}/read` | Notification recipient | - | `id`, `read_at` | Owner only, idempotent. |
| `GET` | `/lesson-contents/{id}/comments` | User có quyền access | `page`, `size` | Comments/replies, pagination | Kiểm tra access course; comment khác course review. |
| `POST` | `/lesson-contents/{id}/comments` | User có quyền access | `content`, `parent_id?` | Comment | Parent phải cùng lesson content; sanitize content. |
| `DELETE` | `/comments/{id}` | Comment owner/Moderator | - | `message` | Owner hoặc role được cấp policy. |
| `GET` | `/student/dashboard` `PROPOSED` | Student | - | `profile`, `kpis`, `daily_activity`, `continue_learning`, `recent_interviews`, `recommended_problems` | Chỉ current user; metric ngày lấy `student_daily_activity`, recommendation dùng Problem–Tag. |
| `GET` | `/teacher/dashboard/summary` | Teacher đã approved | - | `total_revenue`, `current_balance`, `enrolled_students_count`, `active_courses_count` | Chỉ data course/wallet của current teacher. |

## 10. Ma trận authorization và validation

Mọi mutation phải xác thực user, kiểm tra `account_status` và ghi audit khi là thao tác nhạy cảm. Ma trận sau là rule tối thiểu trước khi implement route.

| Nhóm route | Actor/resource | Validation bắt buộc | Lỗi chính |
|---|---|---|---|
| Teacher application | Student, application owner | State transition; đủ field trước submit; không review application của mình | `FORBIDDEN`, `INVALID_STATE`, `VALIDATION_ERROR` |
| Teacher/course builder | Teacher có application `APPROVED`, course/section/lesson owner | Ownership toàn chuỗi; course editable; `content_type/content_id` hợp lệ | `FORBIDDEN`, `NOT_FOUND`, `INVALID_CONTENT_REFERENCE` |
| Course moderation | Admin, course `PENDING_REVIEW` | Decision hợp lệ, note theo policy; transition hợp lệ | `FORBIDDEN`, `INVALID_STATE` |
| Catalog/favorite/review | Public hoặc Student, course eligible | Catalog chỉ approved; favorite unique; review cần enrollment và policy duplicate | `ALREADY_ENROLLED`, `DUPLICATE_RESOURCE`, `FORBIDDEN` |
| Learning/quiz | Enrollment owner, content accessible | Lock/progress order; attempt owner; retry limit; answer thuộc quiz | `FORBIDDEN`, `ATTEMPT_LIMIT_REACHED`, `INVALID_STATE` |
| OJ | Submission owner hoặc Teacher problem owner | Language/problem access; hidden testcase projection; sandbox limit | `FORBIDDEN`, `RATE_LIMITED` |
| Payment/enrollment | Student order owner, webhook provider | Không enrollment lại; expiry; signature; payment/event idempotency | `ALREADY_ENROLLED`, `PAYMENT_EXPIRED`, `INVALID_SIGNATURE` |
| Wallet/payout | Teacher wallet owner hoặc Admin | Amount/minimum/currency; available balance; lifecycle payout | `INSUFFICIENT_BALANCE`, `MINIMUM_PAYOUT_NOT_MET`, `INVALID_STATE` |
| Interview/notification/comment | Resource owner hoặc moderator policy | Session active/max question/one report; notification recipient; comment parent/access | `FORBIDDEN`, `QUESTION_LIMIT_REACHED`, `REPORT_GENERATING` |

## 11. Quyết định còn mở

| Nội dung | Contract hiện tại | Cần chốt trước khi mở rộng |
|---|---|---|
| Course status legacy | API dùng `PENDING_REVIEW` và `APPROVED`. | Map cuối cùng với `PENDING/PUBLISHED` trong dữ liệu cũ. |
| Currency và payout minimum | Response luôn có `currency`; validation minimum theo policy. | Mã tiền, rounding và giá trị minimum. |
| Order cardinality | Một course/checkout cho MVP. | Có cho checkout nhiều item từ cart hay không. |
| Course review multiplicity | Bắt buộc enrollment. | Một review/course hay cho phép nhiều review theo thời gian. |
| Quiz retry/expiry | API hỗ trợ attempt start/resume/save/history. | Số retry, timeout và quy tắc abandon. |
| Problem completion | Chỉ completed khi submission đạt rule lesson. | Có cần điểm pass ngoài Accepted hay không. |

Khi backend implement, Pydantic/OpenAPI generated spec tại `/docs` và `docs/specs/api.json` phải phản ánh các request/response trên; các route `PROPOSED` có thể được bổ sung dần mà không thay đổi lifecycle, quyền và error contract đã nêu.
