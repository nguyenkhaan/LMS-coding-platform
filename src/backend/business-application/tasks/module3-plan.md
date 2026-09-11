# Module 3 - Teacher Course & Curriculum Creator (Spec & Plan)

## 1. Quyết định Kiến trúc & Clarifications
1. **Kiến trúc Layer (Đã chốt):** Sử dụng convention **Router -> Service -> DTO** (Router gọi trực tiếp Service, không có layer Controller). Quyết định này đồng nhất với toàn bộ project hiện tại (Module 2).
2. **Package Redis:** Cần cài thêm thư viện `redis` (hoặc `aioredis`) vào `pyproject.toml` để phục vụ luồng SSE.
3. **Ảnh hưởng của Redis Pub/Sub đến Module 2:** Việc chuyển sang Redis Pub/Sub chỉ thay đổi cơ chế định tuyến nội bộ (internal delivery mechanism) giữa các service instance khi truyền kết quả chấm bài. API contract giao tiếp với Client (như `GET /events` hay `POST /result`) sẽ được giữ nguyên 100%. Luồng hiện tại của học viên không bị phá vỡ (no breaking changes).

## 2. Objective
Hoàn thiện Module 3 bao gồm các API quản lý khóa học (Course), nội dung khóa học (Curriculum), tạo đề trắc nghiệm (Quiz Authoring), tạo bài tập lập trình (Problem Builder) và nâng cấp luồng Online Judge SSE sang kiến trúc Redis Pub/Sub để hỗ trợ scale đa instance.

## 3. Tech Stack
- **Framework:** FastAPI, Pydantic v2
- **Auth:** JWT (`get_current_user` từ auth_middleware)
- **Message Broker & Pub/Sub:** RabbitMQ (đã có), Redis (mới thêm vào luồng SSE)

## 4. Commands
- Run test: `uv run pytest tests/module3/ -v`

## 5. Project Structure
- `src/modules/teacher_course/`: Quản lý Course, Section, Lesson, LessonContent (đã có skeleton, cần bổ sung các endpoint còn thiếu).
- `src/modules/teacher_quiz/`: Quản lý Quiz Authoring.
- `src/modules/teacher_problem/`: Quản lý Problem Builder, Testcases, Submissions của học viên.
- `src/modules/submission/`: Refactor lại file `submission_route.py` và consumer.

## 6. Code Style & Testing Strategy
- Sử dụng `APIRouter` với prefix `/teacher`.
- Pydantic schema nằm ở file `*_dto.py`, Service ở `*_service.py`.
- Response luôn có type hint và dùng `response_model` trong decorator.
- Bắt buộc phải có mock data chuẩn HTTP Status (200/201/400/401/404) cho mọi API.
- Test bằng `fastapi.testclient.TestClient` cho các endpoint.

## 7. Boundaries
- **Always:**
  - Verify JWT token cho mọi API `/teacher/*`; validate DTO.
  - **Quyền Ownership:** Mọi API tạo/sửa/xóa (course, quiz, problem...) PHẢI lấy `teacher_id` trực tiếp từ JWT của người dùng hiện tại (thông qua `get_current_user`). Tuyệt đối không nhận `teacher_id` hoặc `owner_id` từ request body hay query param do client gửi lên.
- **Ask first:** Bổ sung bất kỳ dependency Python mới nào vào `pyproject.toml` (ví dụ `redis`).
- **Never:** Cấu trúc lại DB (schema) mà chưa được duyệt.
