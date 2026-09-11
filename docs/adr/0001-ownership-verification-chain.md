# ADR 0001: Ownership verification qua chuỗi helper method (_verify_course -> _verify_section -> _verify_lesson -> _verify_content)

## Bối cảnh (Context)
Module 3 (Teacher Course & Curriculum Creator) yêu cầu quản lý phân tầng sâu: Course -> Section -> Lesson -> Content. Theo tài liệu đặc tả, tất cả các endpoint của teacher thao tác trên những tài nguyên này (kể cả thao tác ở các lớp lá như Lesson Content) đều yêu cầu:
1. Đảm bảo tài nguyên đang thao tác phải tồn tại (trả về 404 tùy theo cấp bị thiếu).
2. Đảm bảo tính sở hữu tài nguyên: Giáo viên (Teacher) chỉ được phép thao tác nếu họ là người tạo ra Course gốc chứa tài nguyên đó (trả về 403 nếu cố tình thao tác lên tài nguyên của người khác).

Do tính phân cấp này, một thao tác sâu (ví dụ cập nhật Lesson Content) đòi hỏi việc kiểm tra qua tất cả các lớp trung gian (Content -> Lesson -> Section -> Course) để xác nhận Teacher ID khớp với Course gốc. Nếu viết lặp lại cho toàn bộ 11 endpoint, mã nguồn của Course Service sẽ phình to ra cực độ (nhiều lớp `if not entity:` / `if course["teacher_id"] != teacher_id:`) gây trùng lặp mã nghiêm trọng (vi phạm nguyên tắc DRY).

## Quyết định (Decision)
Thay vì kiểm tra toàn bộ chuỗi theo cách tuyến tính trong mỗi endpoint, chúng tôi đã tạo một chuỗi helper method theo cấu trúc gọi liên kết (cascading dependency) trong `CourseService`:

- `_verify_course`: Trích xuất và kiểm tra quyền sở hữu đối với Course (ném HTTPException 404/403).
- `_verify_section`: Trích xuất Section, đồng thời gọi `_verify_course` lên course gốc của section này.
- `_verify_lesson`: Trích xuất Lesson, đồng thời gọi `_verify_section` lên section gốc của lesson này.
- `_verify_content`: Trích xuất Content, đồng thời gọi `_verify_lesson` lên lesson gốc của content này.

## Lý do (Rationale)
1. **DRY (Don't Repeat Yourself)**: Tất cả logic liên kết cây và thẩm định quyền sở hữu được gói gọn ở một chỗ. Các service endpoint (tạo, cập nhật, xóa) chỉ cần gọi một hàm `_verify_<entity_name>` tương ứng và không cần bận tâm đến việc xác minh phân cấp nữa.
2. **Fail-fast & Atomicity**: Nếu bất kỳ nút nào trong chuỗi bị lỗi (như xóa parent section mà vẫn cố truy cập lesson thuộc section đó), hệ thống sẽ chủ động ném ra `404 Not Found` ngay lập tức tại cấp độ đó với error code tường minh (`LESSON_NOT_FOUND`, `SECTION_NOT_FOUND`) trước khi đánh giá 403.
3. **Mở rộng dễ dàng**: Nếu sau này quy mô quyền thay đổi (như thêm Co-author cho một course), chỉ cần thay đổi điều kiện bên trong helper `_verify_course`.

## Đánh đổi (Consequences)
**Nhược điểm nhỏ**:
Việc thiết kế hàm "verify" ném Exception trực tiếp làm hàm bị phụ thuộc vào HTTPException của FastAPI. Điều này khiến `CourseService` bị buộc chặt với HTTP context thay vì hoàn toàn là pure Business Logic. Tuy nhiên, trong bối cảnh Framework FastAPI và để tối giản số dòng mã skeleton, điều này được coi là chấp nhận được để đạt được Code Clean (Boy-scout rule).
