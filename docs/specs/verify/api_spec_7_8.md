# Rà soát API Spec vs Database — Module 7 & Module 8


## 7. Lesson Interactions & Comments (`/api/v1/lessons`, `/api/v1/comments`)

### 7.1
```text
GET /api/v1/lessons/{lessonId}/comments
Response: List of comments, each containing parent_id, profile avatar, full name, post time, and child replies list.
```

- Về mặt database: bảng `comment` có các cột `id`, `lesson_content_id`, `user_id`, `parent_id`, `content`, `created_at`, `updated_at`.
- Về mặt FE: response nên gồm ít nhất `id`, `lesson_content_id`, `parent_id`, `content`, `created_at`, `updated_at`, và danh sách reply lồng nhau.
- Đề xuất: bổ sung `lesson_content_id` vào response và ghi rõ comment được gắn vào `lesson_content` chứ không phải `lesson` trực tiếp.

### 7.2
```text
POST /api/v1/lessons/{lessonId}/comments
Request: content, parent_id (optional)
Response: Created comment details.
```

- Về mặt database: cần có thêm `lesson_content_id` để biết comment thuộc nội dung bài học nào, vì bảng `comment` không lưu trực tiếp `lesson_id`.
- Đề xuất: thêm `lesson_content_id` vào request body (nếu client chưa xác định content trước đó thì BE sẽ resolve từ lessonId).

### 7.3
```text
DELETE /api/v1/comments/{commentId}
```

- Về mặt database: phù hợp với bảng `comment` vì có `id` làm khóa chính.
- Đề xuất: giữ nguyên, chỉ cần mô tả rõ là xóa comment của chính user hiện tại.

---

## 8. Admin Moderation & CCCD Verification (`/api/v1/admin`, `/api/v1/teacher-register`)

### 8.1
```text
POST /api/v1/teacher-register
Request: motivation, cccd, cccd_front_url, cccd_back_url
Response: id, status (PENDING), message
```

- Về mặt database: phù hợp với bảng `teacher_register` hiện có.
- Đề xuất: giữ nguyên route này và lưu ý status khởi tạo là `PENDING`.

### 8.2
```text
GET /api/v1/admin/teacher-registers
Response: List of requests (motivation, cccd_number, cccd_front_url, cccd_back_url, cv_pdf_url, user details)
```

- Về mặt database: có `teacher_register` và `teacher_profile`, nhưng `cccd_number` nên dùng `cccd`, còn `cv_pdf_url` không tồn tại trực tiếp trong DB (cột là `teacher_profile.cv_url`).
- Đề xuất: sửa response thành các field phù hợp với DB: `id`, `teacher_id`, `motivation`, `cccd`, `cccd_front_url`, `cccd_back_url`, `status`, `reviewed_note`, `reviewed_by`, `reviewed_at`, `created_at`, `updated_at`, và dữ liệu user liên quan.

### 8.3
```text
POST /api/v1/admin/teacher-registers/{id}/verify
Request: status (AGREE, REJECT), reviewed_note
Response: message, register_id, new_status
```

- Về mặt database: phù hợp, vì bảng `teacher_register` có `status`, `reviewed_note`, `reviewed_by`, `reviewed_at`.
- Đề xuất: đổi path từ `/verify` sang `/teacher-registers/{id}` hoặc giữ `/verify` nhưng thống nhất với route `PUT /api/v1/admin/teacher-register/{id}` trong review trước.
- Khuyến nghị: dùng `PUT /api/v1/admin/teacher-registers/{id}` để phù hợp với thao tác cập nhật trạng thái.

### 8.4
```text
GET /api/v1/admin/reports
Response: List of flags (course_id, reporter_name, content_reason, status)
```

- Về mặt database: hiện chưa thấy bảng report riêng trong `database.txt`.
- Đề xuất: nếu FE vẫn cần route này thì nên bổ sung bảng report/flag vào DB hoặc giữ route như một placeholder và xác nhận lại với BE/FE.

### 8.5
```text
POST /api/v1/admin/courses/{id}/status
Request: status (PUBLISHED, ARCHIVED, DRAFT)
```

- Về mặt database: phù hợp với enum `CourseStatus` trong bảng `courses`.
- Đề xuất: giữ nguyên.

### 8.6
```text
PUT /api/v1/admin/users/{userId}/status
Request: account_status (ACTIVE, BANNED)
```

- Về mặt database: phù hợp với enum `AccountStatus` trong bảng `user` (nếu có cột `account_status`).
- Đề xuất: giữ nguyên.
