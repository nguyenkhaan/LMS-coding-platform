# Student Course Directory & Study Mode (Module 2)

Mục đích module: Xử lý hiển thị danh sách khoá học, chi tiết khoá học, đăng ký tham gia (enroll) và cung cấp dữ liệu cho luồng học tập thực tế (Study Mode), bao gồm cả bài kiểm tra (quizzes) và đánh dấu tiến độ bài học.

## Kiến trúc
Theo mô hình: **Router → Service → DTO**
- **`course_router.py` / `student_router.py`**: Xử lý routing, mapping HTTP methods/paths, nhận Dependencies (như auth).
- **`course_service.py`**: Xử lý logic nghiệp vụ.
- **`course_dto.py`**: Định nghĩa Pydantic request/response schemas.
- **`course_dependency.py`**: Cung cấp Dependency Injection cho service.

## Danh sách 9 Endpoint

| # | Method | Path | Auth |
|---|--------|------|------|
| 1 | GET | `/courses` | Không |
| 2 | GET | `/courses/{slug}` | Không |
| 3 | POST | `/courses/{slug}/enroll` | Có |
| 4 | GET | `/student/courses` | Có |
| 5 | GET | `/student/courses/{slug}/study` | Có |
| 6 | POST | `/student/progress/lesson-content/{id}/complete` | Có |
| 7 | GET | `/student/quizzes/{quizId}` | Có |
| 8 | POST | `/student/quizzes/{quizId}/submit` | Có |
| 9 | POST | `/courses/{slug}/unenroll` | Có |

## Trạng thái hiện tại
- Toàn bộ đang dùng **mock data**, chưa tích hợp database thật.
- Rule khóa lesson (`locked`) là tạm thời (mock cứng: 2 lesson đầu mỗi section mở, còn lại khóa).

## Cách chạy test
Để chạy toàn bộ 48 test case (đã bao gồm các edge case 400, 401, 404):
```bash
uv run pytest tests/module2/ -v
```

## Ghi chú
Hiện tại có 3 quyết định đang chờ sync:
1. Xác nhận phương thức xác thực: HttpOnly Cookie (spec) hay Bearer token (thực tế code).
2. Chốt logic cho rule `locked` của Study Mode sau khi duyệt Figma.
3. Vị trí chính thức của enum `EnrollStatus`.

Xem chi tiết thảo luận trong PR #<để trống, tôi tự điền số PR sau khi tạo>
