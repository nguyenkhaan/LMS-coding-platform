# ADR-001: Giải quyết các Gap và Quyết định kỹ thuật trong Module 2 (Student Course Directory)

## Status
Accepted

## Date
2026-08-22

## Context
Trong quá trình triển khai Module 2 (Student Course Directory & Study Mode), chúng tôi phát hiện một số sai lệch (gap) giữa thiết kế API Spec ban đầu và cấu trúc Database Schema thực tế, cũng như một số nghiệp vụ chưa được quy định rõ trong tài liệu. 
Cần đưa ra quyết định xử lý thống nhất để hoàn thành module này mà không gây side-effect đến các module/logic khác.

Các vấn đề chính bao gồm:
1. Thiếu field `bio` trong DB schema của `teacher_profile` (có trong API Spec).
2. Xử lý logic Quiz Attempt trong Study Mode (API Spec đề cập bảng `quiz_attempt`/`quiz_submission`, nhưng phần này nằm ở Module Quiz & Online Judge).
3. Cách tính `progress_percent` của Student trên một khóa học.
4. HTTP Status Code khi GET `/student/courses/{slug}/study` nhưng sinh viên chưa đăng ký khóa học.
5. Chuẩn định dạng JSON Response Envelope (API Spec bọc `{"data": ...}`, nhưng hiện trạng project không bọc).

## Decision & Consequences

### 1. Thiếu field `bio` trong Teacher Profile
*   **Vấn đề:** API Spec định nghĩa `TeacherProfileView` có field `bio`, nhưng `TeacherProfileModel` trong Database không có cột này (chỉ có `headline`).
*   **Quyết định:** Loại bỏ `bio` khỏi schema `InstructorDetailResponse` để phản ánh đúng thực trạng DB hiện tại. Không tự ý thêm cột vào DB (để tránh thay đổi file migration ngoài ý muốn).
*   **Hệ quả:** Leader/PO cần quyết định bổ sung cột `bio` vào DB ở Phase sau, hoặc thống nhất sửa lại Spec để xóa hẳn thuộc tính `bio`.

### 2. Logic Quiz/Problem (quiz_attempt)
*   **Vấn đề:** Bảng Spec Module 2 yêu cầu hiển thị tiến độ và xử lý bài học, nhưng Quiz/Problem liên quan đến bảng `quiz_submission` chưa có code ở Module 2.
*   **Quyết định:** Tạm thời bỏ qua toàn bộ logic ghi nhận vào bảng `quiz_attempt`, `quiz_submission` vì chúng thuộc phạm vi Module 2. API hoàn thành bài học (`POST .../complete`) chỉ hỗ trợ nội dung loại `READING`. Các request hoàn thành cho `QUIZ` hoặc `PROBLEM` từ client sẽ bị block trực tiếp (báo lỗi HTTP 400).
*   **Hệ quả:** Dữ liệu module Study Mode hiện tại chỉ map đầy đủ với tài liệu đọc (`READING`).

### 3. Công thức tính `progress_percent`
*   **Vấn đề:** Spec dòng 314 cho thấy API Submit Quiz dự kiến trả về `LessonContentProgressView`, ngụ ý Quiz khi submit xong cũng được ghi tiến độ vào bảng chung. Do mục 2 (ở trên) đã tách Quiz khỏi Module 2, nếu ta đếm toàn bộ content (Reading + Quiz + Problem) của khoá học làm mẫu số, tiến độ học tập (`progress_percent`) sẽ không bao giờ đạt 100%.
*   **Quyết định:** `progress_percent` hiện tại CHỈ tính riêng trên tổng các nội dung loại `READING` (Reading đã hoàn thành / Tổng số Reading của khóa học).
*   **Hệ quả:** Tiến độ hiển thị ra ngoài chỉ phản ánh phần Reading. Đây là "known limitation". Team làm Module "Quiz & Online Judge" sau này cần nối lại logic để cộng gộp điểm từ `quiz_submission` hoặc cập nhật bổ sung loại content đó vào mẫu số.

### 4. Status Code cho `/student/courses/{slug}/study` khi chưa đăng ký
*   **Vấn đề:** Bảng route Spec (dòng 297) chỉ ghi "Enrollment/access bắt buộc", không định nghĩa rõ 403 (Forbidden) hay 404 (Not Found) nếu chưa mua khóa học.
*   **Quyết định:** Trả về HTTP 404 Not Found (gộp chung message *"Khoá học không tồn tại hoặc bạn chưa đăng ký"*).
*   **Lý do:** Lựa chọn vì mục đích bảo mật, ẩn sự tồn tại của khóa học nếu sinh viên đó không có quyền truy cập, tránh việc do thám tài nguyên.

### 5. Chuẩn JSON Response Envelope
*   **Vấn đề:** Ban đầu định bọc Response trong `{ "data": ... }`. Tuy nhiên, toàn bộ service hiện hành trong base code (health_router, submission_router...) đều đang trả dữ liệu dạng Flat JSON.
*   **Quyết định:** Trả trực tiếp dữ liệu chuẩn theo Pydantic `response_model` của FastAPI, KHÔNG bọc envelope.
*   **Lý do:** Đảm bảo tính nhất quán kiến trúc trên toàn service, tuân thủ convention thực tế của dự án.

### 6. Known Limitation: Deadlock khi chạy chung Test Suite (Event Loop Conflict)
*   **Vấn đề:** Test suite Module 2 hiện chỉ chạy ổn định khi thực thi TỪNG FILE riêng lẻ. Chạy gộp toàn bộ `tests/module2/` cùng lúc gây deadlock (hiện tượng `idle in transaction` trên Postgres) do xung đột event loop giữa `pytest-asyncio` (session scope) và `asyncpg` khi tạo/seed database thông qua hàm đồng bộ `run_sync(Base.metadata.create_all)`.
*   **Quyết định:** Dừng điều tra và giữ nguyên trạng thái hiện tại (pass khi chạy từng file, không sửa thêm `conftest.py`).
*   **Quy trình chạy Test:** Trước khi chạy `pytest tests/module2/`, PHẢI chạy `uv run python seed.py` thủ công 1 lần để khởi tạo dữ liệu (setup tự động đã bị gỡ do gây deadlock).
*   **Khuyến nghị cho task sau:** Đây là vấn đề hạ tầng test chung, cần một task riêng để khắc phục. Khuyến nghị: tách logic `setup_database` ra một lần duy nhất ở cấp CI/pipeline thay vì dùng per-test-session fixture, hoặc dùng test database riêng biệt per-worker nếu muốn chạy song song.
