# Module 3 - Task List

- [ ] **Task 1: Hoàn thiện Teacher Course & Curriculum Builder (Phần còn thiếu)**
  - Acceptance: Hoàn tất các API chưa có trong skeleton: `GET /teacher/courses/{course_id}`, `POST /teacher/courses/{course_id}/submit-review`, `GET /teacher/courses/{course_id}/moderation-history`, `DELETE /teacher/lessons/{lesson_id}`, `POST /teacher/lessons/{lesson_id}/readings`, `PUT /teacher/lesson-contents/{lesson_content_id}/reading`, `DELETE /teacher/lesson-contents/{lesson_content_id}`.
  - Verify: Chạy test API, trả về HTTP status và mock data chính xác.
  - Files: `teacher_course_router.py`, `teacher_course_service.py`, `teacher_course_dto.py`.

- [ ] **Task 2: Triển khai Teacher Quiz Authoring**
  - Acceptance: Tạo các API: `POST /teacher/lessons/{lesson_id}/quizzes`, `PUT /teacher/quizzes/{quiz_id}`, `PUT /teacher/quizzes/{quiz_id}/questions`. Bao gồm DTO validation chặt chẽ (options, is_correct, passing_score).
  - Verify: Gọi API tạo quiz và thêm question thành công.
  - Files: Khởi tạo module mới `src/modules/teacher_quiz/*` và include vào `app.py`.

- [ ] **Task 3: Triển khai Teacher Problem Builder (Nghiệp vụ mới)**
  - Acceptance: Tạo API `POST /teacher/problems`, `PUT /teacher/problems/{problem_id}`, `POST /teacher/problems/{problem_id}/testcases/upload` (multipart/form-data), `GET /teacher/courses/{course_id}/submissions`.
  - Xử lý các logic: lưu `passing_score` làm ngưỡng đạt.
  - Quản lý Tags: Thêm endpoint `GET /teacher/problem-tags` để trả về danh sách các tag có sẵn (do schema có bảng `problem_tag` riêng biệt). Xử lý mapping khi tạo/sửa problem (`problem_tag_mapping`).
  - Verify: Mock API upload testcases thành công, trả về danh sách testcase hợp lệ.
  - Files: Khởi tạo module mới `src/modules/teacher_problem/*` và include vào `app.py`.

- [ ] **Task 4: Refactor Online Judge SSE sang Redis Pub/Sub (Infra-level, Độc lập)**
  - *Ghi chú quan trọng: Task này được thực hiện SAU CÙNG, review riêng và KHÔNG gộp chung PR với Task 1-3 do tính chất tác động đến core infrastructure của hệ thống.*
  - Acceptance:
    - API contract giao tiếp với FE được giữ nguyên, chỉ thay đổi logic xử lý Pub/Sub nội bộ.
    - `submission_route.py`: API `GET /submission/{id}/events` đổi sang `SUBSCRIBE` vào Redis channel `sse:submission:{id}` thay vì in-memory `sse_manager.subscribe`.
    - `submission_execution_result_consumer.py`: Consumer nhận kết quả từ RabbitMQ sẽ `PUBLISH` lên Redis channel `sse:submission:{id}` thay vì gọi `sse_manager.publish`.
  - Verify: Khởi động server (kèm Redis), mở kết nối SSE và giả lập pub/sub để đảm bảo message chảy đúng qua Redis channel tới các subscriber (không làm break luồng Module 2).
  - Files: `submission_route.py`, `submission_execution_result_consumer.py`, khởi tạo Redis client config.
