# Module 2: Catalog, Instructor, Favorite, Course Review

Tài liệu này ghi nhận trạng thái phát triển, cách cài đặt, và các thay đổi gần nhất cho Module 2 (Student Course Directory & Study Mode).

## 1. Mục đích & Thay đổi gần nhất (PR Feedback Fixes)
Trong đợt review code gần nhất, các thay đổi sau đã được áp dụng để đảm bảo tính chặt chẽ, an toàn và chuẩn mực Clean Code:
- **Xóa logic hard-code business rule**: Sửa rule tính điểm đỗ bài quiz từ `passed = score >= 5.0` thành logic đọc linh hoạt từ `quiz.passing_score`.
- **Chuẩn hóa ngôn ngữ**: Chuyển toàn bộ message báo lỗi/thành công từ tiếng Việt sang tiếng Anh.
- **Dọn dẹp code rác**: Loại bỏ toàn bộ `print()` debug, comment AI dev-note và các comment giải thích code thừa thãi.
- **Type Safety**: Khởi tạo và áp dụng `UserPayload` TypedDict trong toàn bộ luồng Auth để thay thế kiểu `dict` lỏng lẻo, chống lỗi runtime.

## 2. Cách chạy (Run & Setup)
Luồng ứng dụng kinh doanh phụ thuộc chặt chẽ vào cơ sở hạ tầng (Database, Message Queue).

- **Yêu cầu hạ tầng**: Bật Docker Desktop và chạy lệnh sau ở thư mục gốc để khởi động PostgreSQL, RabbitMQ, Redis:
  ```bash
  docker compose up -d
  ```
  *(Lưu ý: Nếu RabbitMQ không chạy ở port 5672, server sẽ crash lập tức vì lỗi kết nối trong lifespan event).*

- **Chạy server (Business Application)**:
  ```bash
  cd src/backend/business-application
  uv run uvicorn src.app:app --port 4000 --reload
  ```

## 3. Cách test (Testing via /docs)
Truy cập Swagger UI tại: [http://localhost:4000/docs](http://localhost:4000/docs)

- **Luồng Public (`/api/courses`)**:
  - `GET /api/courses`: Verify trả về list khóa học có pagination.
  - `GET /api/courses/{slug}`: Verify chi tiết khóa học, thử với slug sai để nhận 404 "Course not found".

- **Luồng Student (`/api/student/...`)**:
  - Dùng Bearer token chứa JWT payload giả lập có `roles: ["STUDENT"]`.
  - Endpoint `POST /api/student/quizzes/1/submit`:
    - Gửi body đúng hoàn toàn (`{"answers": {"1": 2, "2": 3, "3": 1}}`): Trả về `score=10.0`, `passed=True`.
    - Gửi body sai hoàn toàn (`{"answers": {"1": 1, "2": 1, "3": 2}}`): Trả về `score=0.0`, `passed=False`.
    - Gửi body rỗng (`{"answers": {}}`): Báo lỗi HTTP 400 `"At least one answer is required"`.

- **Luồng Teacher (`/api/teacher/...`)**:
  - Test Role Middleware: Gọi thử `POST /api/teacher/courses/1/sections` bằng token của `STUDENT`.
  - Kết quả đúng: API lập tức chặn và trả về lỗi `403 You do not have permission to access this resource`.
  - Thử lại với token của `TEACHER`: API lọt qua được lớp auth (sẽ trả về 422 do body truyền lên thiếu trường, nhưng xác nhận middleware hoạt động hoàn hảo).

## 4. Changelog (Cụ thể các sửa đổi theo PR feedback)

Dưới đây là chi tiết các file đã được chỉnh sửa:

1. **`course_service.py`**:
   - Thêm `passing_score=5.0` vào mock data `_MOCK_QUIZZES[1]` (khoảng dòng 520).
   - Sửa logic hardcode thành `passed = score >= quiz.passing_score` (khoảng dòng 714).
   - Đổi 10 error/success message sang tiếng Anh ở các hàm `get_course_detail`, `enroll_course`, `unenroll_course`, `get_study_content`, `complete_lesson_content`, `get_quiz`, `submit_quiz` (khoảng dòng 602, 630, 655, 668, 671, 684, 696, 700, 730).

2. **`course_dto.py`**:
   - Xóa dòng 1 chứa comment nhắc nhở của AI dev-tool.
   - Bổ sung field `passing_score: float` vào schema `QuizResponse`.

3. **`auth_middleware.py`**:
   - Thêm định nghĩa class `UserPayload(TypedDict)` (khoảng 10 dòng) để định hình JWT payload.
   - Ép kiểu return type của `get_current_user` thành `-> UserPayload`.
   - Xóa `print(public_key)` và comment tiếng Việt thừa.

4. **`role_middleware.py`**:
   - Cập nhật annotation sang `UserPayload`, sửa logic lặp kiểm tra role cồng kềnh thành hàm `any()` ngắn gọn.
   - Xóa dòng `print(roles)` debug.
   - Đổi message sai ngữ pháp: `"User don't have permission..."` thành `"You do not have permission to access this resource"`.

5. **`teacher_service.py`**:
   - Xóa sạch 10 dòng `print("... error:", e)` nằm rải rác khắp các khối `except Exception` của mọi hàm (các dòng 187, 237, 269, 308, 354, 391, 440, 483, 545, 612, 669, 780).
   - Xóa 4 comment thừa tiếng Việt giải thích logic DB (ví dụ: `# Dong bo du lieu xuong database`).

6. **`course_router.py` & `student_router.py` & `teacher_router.py`**:
   - Chuyển toàn bộ Dependency Injection của biến `user` từ `dict` (ẩn dụ) sang `UserPayload` rõ ràng minh bạch. 
   - Dọn dẹp một vài comment `# payload from get_current_user:` thừa thãi.
