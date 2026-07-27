# Rà soát API Spec vs Database — Module 1 & Module 2

> Phạm vi: đối chiếu field/route trong `api-spec.md` với schema trong `database.txt`. Không đánh giá code hiện tại (code sẽ được sửa lại theo spec sau khi hoàn thiện tài liệu này).

---

## 1. Authentication & Profile Module (`/api/v1/auth`, `/api/v1/users`)

### 1.1
```text
   POST /api/v1/auth/register
   Request: full_name, email, password, address
   Response: verify_code, message
```
* Về mặt database: Phù hợp — khớp trực tiếp các cột `user.full_name/email/password/address`.

**Đề xuất:** Giữ nguyên, không sửa gì.

---

### 1.2
```text
   GET /api/v1/auth/verify?code={otp_code}
   Response: message
```
* Về mặt database: Phù hợp — route này cập nhật trạng thái tài khoản, tương ứng cột `user.account_status` (enum `AccountStatus`: UNVERIFIED → ACTIVE).
* Về mặt mô tả: spec không nói rõ field nào bị đổi. Bảng `user` có 2 cột dễ gây nhầm là `status` (string) và `account_status` (enum) — nếu không ghi rõ, dễ bị cập nhật nhầm cột.

**Đề xuất thêm mô tả (giữ nguyên field, chỉ bổ sung):**
```text
   GET /api/v1/auth/verify?code={otp_code}
   Description: Verify the email OTP. On success, updates 
   `user.account_status` from UNVERIFIED → ACTIVE.
   Response: message
```

---

### 1.3
```text
   POST /api/v1/auth/token
   Request: code, redirect_uri
   Response: message, user_info (id, email, roles)
```
* Về mặt database: Phù hợp về mặt dữ liệu tồn tại, nhưng `roles` không phải cột trực tiếp — phải join `user` với `user_role` (quan hệ 1-nhiều: 1 user có thể có nhiều role).

**Đề xuất thêm mô tả:**
```text
   Note: `roles` is an aggregate field, joined from `user_role` 
   table, not a direct column.
```

---

### 1.4
```text
   POST /api/v1/auth/google
   Response: message, user_info (id, email, roles)
```
* Về mặt database: Phù hợp, cùng lưu ý `roles` là field join như mục 1.3.

**Đề xuất thêm mô tả:** áp dụng note tương tự mục 1.3.

---

### 1.5
```text
   POST /api/v1/auth/logout
   Response: message
```
* Về mặt database: Phù hợp — không động tới bảng nào, chỉ xoá cookie.

**Đề xuất:** Giữ nguyên, không sửa gì.

---

### 1.6
```text
   GET /api/v1/users/me
   Response: id, full_name, email, avatar_url, account_status, 
   roles, student_profile (optional), teacher_profile (optional)
```
* Về mặt database: Phù hợp — `id/full_name/email/avatar_url/account_status` khớp trực tiếp bảng `user`. `student_profile`/`teacher_profile` join theo `user_id` (PK của 2 bảng này), trả `null` nếu không có record tương ứng — đúng vì user có thể không phải student/teacher.

**Đề xuất:** Giữ nguyên, chỉ cần lưu ý `roles` vẫn là field join như trên.

---

### 1.7
```text
   PUT /api/v1/users/me/profile
   Request: bio, school, major, github_url, facebook_url, linkedin_url
   Response: message, profile
```
* Về mặt database: **Mâu thuẫn nhẹ** — spec/FE dùng `linkedin_url`, nhưng cột DB là `student_profile.linkedln_url` (lỗi chính tả, thiếu chữ "i").
* Về mặt database: thiếu chỗ cập nhật `avatar_url` — cột này nằm ở bảng `user`, không phải `student_profile`, nên route hiện tại không có cách nào cho user tự đổi avatar.

**Đề xuất sửa:** map alias `linkedin_url` (spec) ↔ `linkedln_url` (cột DB) ở tầng serializer/DTO, không đổi tên cột DB để tránh ảnh hưởng đến các bảng đang được thành viên khác sử dụng.

**Đề xuất thêm field** — thêm `avatar_url` vào request/response:
* Cần thiết vì: hiện không có route nào cho user cập nhật ảnh đại diện.
* Mặt trái: nếu avatar là upload file (không chỉ URL text), nên tách thành route riêng `PUT /users/me/avatar` để xử lý multipart, tránh làm phức tạp route update field text thông thường.

**API spec sau khi sửa:**
```text
   PUT /api/v1/users/me/profile
   Description: Update student's specific profile info.
   Request Body: bio, school, major, github_url, facebook_url, 
   linkedin_url, avatar_url.
   Response: message, profile updated details.
```

---

### 1.8
```text
   PUT /api/v1/users/me/teacher-profile
   Request: bio, school_address, cv_url
   Response: message, profile
```
* Về mặt database: Phù hợp — khớp bảng `teacher_profile`. Cột `verified` không có trong request là đúng, vì đây là field chỉ admin duyệt được qua `teacher_register.status`, không nên cho user tự sửa.

**Đề xuất:** Giữ nguyên, không sửa gì.

---

### 1.9 — Route mới đề xuất thêm

**`POST /api/v1/auth/refresh`**
```text
   POST /api/v1/auth/refresh
   Description: Exchange a valid refresh_token cookie for a new 
   access_token, without requiring the user to log in again.
   Request Body: (none — refresh_token read from HttpOnly cookie).
   Response: message.
```
* Cần thiết vì: bảng `user` đã có cột `refresh_token`, ngụ ý thiết kế theo cặp access/refresh token, nhưng spec chưa có route dùng refresh_token để cấp lại access_token khi hết hạn.
* Mặt trái: cần thêm cơ chế kiểm tra refresh_token còn hợp lệ/chưa bị thu hồi (revoke) khi logout, nếu bỏ sót sẽ tạo lỗ hổng bảo mật.

**`POST /api/v1/auth/forgot-password`**
```text
   POST /api/v1/auth/forgot-password
   Description: Request a password reset link/code sent to the 
   user's email.
   Request Body: email.
   Response: message.
```

**`POST /api/v1/auth/reset-password`**
```text
   POST /api/v1/auth/reset-password
   Description: Reset password using the token from the forgot-
   password email.
   Request Body: token, new_password.
   Response: message.
```
* Cần thiết vì: user đăng ký bằng email/password thật (cột `user.password`), nhưng không có luồng nào để lấy lại mật khẩu khi quên.
* Mặt trái: cần rate-limit gửi email để tránh bị lạm dụng spam.

**`POST /api/v1/auth/resend-otp`**
```text
   POST /api/v1/auth/resend-otp
   Description: Resend the email OTP if the previous one expired 
   before verification.
   Request Body: email.
   Response: message.
```
* Cần thiết vì: OTP verify thường có hạn dùng ngắn, nếu hết hạn mà chưa verify thì user bị kẹt, không có cách xin gửi lại.
* Mặt trái: cần rate-limit tương tự để tránh spam email.

**`POST /api/v1/teacher-register`**
```text
   POST /api/v1/teacher-register
   Description: Submit an application to upgrade a student 
   account to teacher.
   Request Body: motivation, cccd, cccd_front_url, cccd_back_url.
   Response: id, status (PENDING), message.
```

**`PUT /api/v1/admin/teacher-register/{id}`**
```text
   PUT /api/v1/admin/teacher-register/{id}
   Description: Admin reviews and approves/rejects a teacher 
   registration application.
   Request Body: status (AGREE, REJECT), reviewed_note.
   Response: id, status, reviewed_by, reviewed_at, message.
```
* Cần thiết vì: bảng `teacher_register` đã có đầy đủ cột (`motivation, cccd, cccd_front_url, cccd_back_url, status, reviewed_by, reviewed_at`) nhưng không route nào trong spec sử dụng — cả luồng nghiệp vụ đăng ký nâng cấp giảng viên bị bỏ sót hoàn toàn.
* Mặt trái: cần kiểm soát quyền chặt (chỉ ADMIN được duyệt), tránh thiếu kiểm tra quyền khi implement.

---

## 2. Student Course Directory & Study Mode (`/api/v1/courses`, `/api/v1/student`)

### 2.1
```text
   GET /api/v1/courses
   Query: page, size, q, difficulty (EASY/MEDIUM/HARD), 
   price_type (FREE/PAID)
   Response: total_items, total_pages, current_page, items
```
* Về mặt database: **Mâu thuẫn** — bảng `courses` không có cột `difficulty`. Enum `ProblemDifficulty` chỉ tồn tại ở bảng `problem` (bài tập code), khả năng cao là nhầm domain khi viết spec.
* Về mặt database: `price_type` không có cột enum riêng, nhưng có thể suy ra từ `courses.price` (0 = FREE, > 0 = PAID).
* Về mặt database: response thiếu field `thumbnai_url` — cột này đã có sẵn trong bảng `courses` nhưng spec chưa liệt kê.

**Đề xuất sửa:** xác nhận lại với FE có thực sự cần lọc course theo độ khó không, hay nhầm với lọc bài tập lập trình; nếu cần thật, phải thêm cột `difficulty` vào bảng `courses` (migration). `price_type` giữ nguyên spec, chỉ cần BE tự convert thành điều kiện `price = 0`/`price > 0`.

**Đề xuất thêm field** — thêm `thumbnai_url` vào response:
* Cần thiết vì: danh sách khóa học cần ảnh thumbnail để hiển thị, thiếu field này FE sẽ không có ảnh.
* Mặt trái: không đáng kể, chỉ cần map đúng tên cột khi serialize (lưu ý tên cột DB đang bị lỗi chính tả).

**API spec sau khi sửa:**
```text
   GET /api/v1/courses
   Description: Public catalog retrieval with filters and 
   pagination.
   Query Parameters: page (default 1), size (default 10), 
   q (search text), price_type (FREE, PAID).
   Response: total_items, total_pages, current_page, 
   items (Array of courses, each including thumbnail_url).
```
*(Query `difficulty` tạm thời bỏ khỏi spec vì không có cột tương ứng ở bảng `courses` — chờ xác nhận lại với FE trước khi thêm cột mới hoặc khôi phục field này.)*

---

### 2.2
```text
   GET /api/v1/courses/{slug}
   Response: id, title, slug, description, price, rating, 
   teacher_name, sections
```
* Về mặt database: Phù hợp về sự tồn tại dữ liệu, nhưng `teacher_name` không phải cột trực tiếp — bảng `courses` chỉ có `teacher_id`, phải join sang bảng `user` lấy `full_name`. `sections` join theo `sections.course_id`, sắp xếp theo `position` — phù hợp.

**Đề xuất thêm mô tả:**
```text
   Note: teacher_name is derived by joining courses.teacher_id 
   → user.id, not a direct column.
```

---

### 2.3
```text
   POST /api/v1/courses/{slug}/enroll
   Response: status (ENROLLED/PENDING_PAYMENT), checkout_url
```
* Về mặt database: `enrollment.status` là cột string tự do (default "active"), không có ràng buộc enum ở tầng DB để đảm bảo chỉ nhận đúng các giá trị `ENROLLED`/`PENDING_PAYMENT`.
* Về mặt database: `checkout_url` không có cột nào trong bảng `enrollment` — thực chất phải lấy từ `transaction.payos_link`, nghĩa là route này phải tạo thêm 1 record `transaction` (course_id, user_id, amount = courses.price, status = PENDING) khi course là PAID.

**Đề xuất sửa:** validate giá trị `status` ở tầng ứng dụng (enum Pydantic), không đổi kiểu cột DB để tránh ảnh hưởng migration của thành viên khác.

**Đề xuất thêm mô tả:**
```text
   Note: For PAID courses, this endpoint must create a new 
   `transaction` record (course_id, user_id, amount = 
   courses.price, status = PENDING) before responding. 
   `checkout_url` is taken from `transaction.payos_link`.
```

---

### 2.4
```text
   GET /api/v1/student/courses
   Response: List of courses including progress percentages
```
* Về mặt database: "progress percentage" không tồn tại như 1 cột nào trong DB — phải tính bằng cách đếm `lesson_content_progress.completed = true` (theo `enrollment_id`) chia cho tổng số `lesson_content` thuộc course đó (qua chuỗi join `sections → lesson → lesson_content`).

**Đề xuất thêm mô tả:**
```text
   Note: progress % = COUNT(lesson_content_progress WHERE 
   enrollment_id=... AND completed=true) / total lesson_content 
   of that course (via sections → lesson → lesson_content).
```

---

### 2.5
```text
   GET /api/v1/student/courses/{slug}/study
   Response: Sections, Lessons, Content list with lock/completion 
   ticks
```
* Về mặt database: đủ bảng để join 4 tầng (`sections → lesson → lesson_content → lesson_content_progress`) lấy trạng thái hoàn thành. Riêng trạng thái "lock" (khóa bài học chưa mở) **không có cột nào lưu trong DB**.

**Đề xuất thêm mô tả:**
```text
   Note: "locked" state is computed dynamically based on the 
   previous lesson's completed status and position order, not 
   a DB column.
```

---

### 2.6
```text
   GET /api/v1/student/quizzes/{quizId}
   Response: id, title, questions (id, statement, points, options)
```
* Về mặt database: `id, title` khớp bảng `quizzes`. Field `statement` trong spec không khớp tên cột `quiz_questions.content` (DB gọi là `content`, spec gọi là `statement`). Cột `quiz_questions.title` có trong DB nhưng không thấy nhắc trong response spec.
* `options` (ẩn `is_correct`) khớp bảng `quiz_options`, đúng logic bảo mật khi chưa nộp bài.

**Đề xuất thêm field:** bổ sung `attempts_left` vào response — hiển thị số lượt còn lại **trước khi làm bài**.
* Cần thiết vì: hiện spec chỉ trả field này sau khi submit, học viên không biết trước khi bắt đầu làm còn bao nhiêu lượt.
* Mặt trái: không đáng kể, chỉ cần thêm 1 phép đếm `COUNT(quiz_submission)` so với `quizzes.attempts`.

**API spec sau khi sửa:**
```text
   GET /api/v1/student/quizzes/{quizId}
   Description: Get quiz questions for SvelteKit test interface 
   (omits `is_correct` field).
   Response: id, title, attempts_left, questions (Array of 
   questions, each with id, content, points, options).
```

---

### 2.7
```text
   POST /api/v1/student/quizzes/{quizId}/submit
   Request: answers (Map question_id -> option_id)
   Response: score, passed (requires >= 80%), passing_score, 
   attempts_left, correct_answers
```
* Về mặt database: `answers` lưu ở cột `quiz_submission.answers` kiểu `string` — không sai, nhưng cần serialize/deserialize JSON thủ công ở tầng code vì cột không phải kiểu JSON/JSONB.
* Về mặt database: **Mâu thuẫn logic** — spec hard-code ngưỡng đậu "≥ 80%", trong khi DB đã thiết kế sẵn cột `quizzes.passing_score` cho phép mỗi quiz có ngưỡng đậu riêng. Hard-code 80% làm phí thiết kế cột này và sai với các quiz có ngưỡng khác 80%.
* `attempts_left` không có cột đếm trực tiếp, phải tính từ `quizzes.attempts` trừ số bản ghi `quiz_submission` hiện có của user.

**Đề xuất sửa mô tả:** thay hard-code 80% bằng so sánh `score >= quizzes.passing_score`.

**Đề xuất thêm field** — thêm `submission_id`, `submitted_at` vào response:
* Cần thiết vì: dữ liệu đã có sẵn ở `quiz_submission.id`/`submitted_at`, cần thiết để sau này có route xem lại lịch sử làm quiz.
* Mặt trái: không đáng kể.

**API spec sau khi sửa:**
```text
   POST /api/v1/student/quizzes/{quizId}/submit
   Description: Submit quiz answers. Score is checked 
   automatically against DB. Passing is determined by 
   comparing score against this quiz's own `passing_score`.
   Request Body: answers (Map of question_id -> option_id).
   Response: submission_id, submitted_at, score, passed 
   (score >= passing_score), passing_score, attempts_left, 
   correct_answers (detail options mapping).
```

---

### 2.8 — Route mới đề xuất thêm

**`POST /api/v1/webhooks/payos`**
```text
   POST /api/v1/webhooks/payos
   Description: Callback endpoint for PayOS to notify payment 
   result. Verifies PayOS signature, then updates `transaction.
   status` to COMPLETE or FAILED and activates the related 
   `enrollment` if payment succeeded.
   Request Body: payos_code, transaction_code, status, signature 
   (payload defined by PayOS).
   Response: message.
```
* Cần thiết vì: route `enroll` tạo `transaction` với `status = PENDING`, nhưng không có route nào nhận callback từ PayOS để cập nhật `transaction.status → COMPLETE/FAILED` và kích hoạt `enrollment`. Thiếu route này thì mọi giao dịch PAID sẽ mãi mãi ở trạng thái PENDING dù user đã thanh toán xong.
* Mặt trái: cần verify chữ ký webhook từ PayOS kỹ lưỡng, nếu không sẽ tạo lỗ hổng bảo mật (giả mạo callback đánh dấu thanh toán khống).

**`POST /api/v1/courses/{slug}/unenroll`**
```text
   POST /api/v1/courses/{slug}/unenroll
   Description: Cancel a student's enrollment in a course.
   Response: message.
```
* Cần thiết vì: không có cách huỷ đăng ký nếu enroll nhầm khóa FREE.
* Mặt trái: cần quyết định dữ liệu tiến độ đã học (`lesson_content_progress`) có bị xóa theo không hay chỉ đổi trạng thái — quyết định sai có thể làm mất dữ liệu học tập của user.

---

## Tổng kết ưu tiên xử lý

| Mức độ | Việc cần làm |
|---|---|
| **Sửa field/logic sai trong spec** | Bỏ/định nghĩa lại `difficulty` filter cho `courses` (nhầm domain); dùng `passing_score` thay vì hard-code 80%; đồng bộ tên field `statement` ↔ `content` cho quiz question |
| **Chỉ cần thêm mô tả (không đổi field)** | 5 note derived-field: `account_status` update khi verify, `roles` là join field, `teacher_name` là join field, `checkout_url`/`transaction` flow khi enroll, `progress %` cách tính, `"locked"` là tính động |
| **Chỉ cần thêm field** | `avatar_url` (update profile), `thumbnai_url` (course list), `attempts_left` (trước khi làm quiz), `submission_id`/`submitted_at` (sau khi submit) |
| **Route mới cần code thêm** | `POST /auth/refresh`, `POST /auth/forgot-password` + `reset-password`, `POST /auth/resend-otp`, `POST /teacher-register` + `PUT /admin/teacher-register/{id}`, `POST /webhooks/payos`, `POST /courses/{slug}/unenroll` |
