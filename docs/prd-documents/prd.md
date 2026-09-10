# PRD - LMS Coding Platform

## 1. Mục tiêu và phạm vi

LMS Coding Platform là nền tảng học lập trình kết hợp:

- Bán và học khóa học online.
- Lesson gồm Reading, Quiz và Coding Problem.
- Online Judge chạy và chấm code theo testcase trong môi trường an toàn.
- AI Interview voice-first: microphone được speech-to-text thành câu trả lời, có fallback nhập text; camera chỉ preview tùy chọn tại client. Hệ thống chỉ lưu message text và một report tổng hợp, không lưu recording media.
- Dashboard cho Student, Teacher và Admin.

Các nhóm chức năng trên thuộc phạm vi MVP. Video không phải là một loại `LessonContent` trong MVP. Các wireframe còn có Video cần được chỉnh lại ở phần FE, không tạo thêm Video model, enum hoặc progress trong database.

Database proposal được ghi trong [DATABASE.txt](../DATABASE.txt). Các khoảng cách giữa schema hiện tại và yêu cầu được ghi trong [gap-analysis.md](gap-analysis.md).

## 2. Vai trò và quyền

### Student

- Đăng ký/đăng nhập bằng local account hoặc Google.
- Gửi hồ sơ đăng ký trở thành Teacher, lưu nháp, submit và resubmit sau khi bị reject.
- Xem catalog, course detail, instructor, favorite course và review course đã học.
- Mua trực tiếp từng course qua PayOS mô phỏng; frontend không tự xác nhận thanh toán.
- Không mua lại course đã enrollment. Payment success chỉ tạo một enrollment cho một Student/course.
- Học Reading, Quiz và Problem theo thứ tự lesson.
- Đánh dấu Reading hoàn thành; hoàn thành Quiz theo passing score và attempt hợp lệ; hoàn thành Problem theo rule Accepted/pass score đã chốt.
- Submit code, xem kết quả testcase an toàn và lịch sử submission.
- Thực hiện AI Interview tối đa 12 câu; AI có thể kết thúc sớm.
- Xem notification, progress, transaction, enrollment và interview report của chính mình.

### Teacher

- Một User có thể đồng thời là Student và Teacher.
- Student có thể tạo `teacher_profile` và application, nhưng chưa có quyền Teacher chỉ vì có role hoặc profile.
- Capability Teacher chỉ active khi application đạt `APPROVED`.
- Mỗi `teacher_profile` có một application hiện hành; dữ liệu học vấn/kinh nghiệm lưu JSON trong profile, còn application giữ dữ liệu xét duyệt và PII.
- Application `PENDING` khóa profile/application; `REJECTED` mở lại để sửa và submit. Khi `APPROVED`, Teacher vẫn sửa các field của `teacher_profile`; trong application chỉ whitelist field không nhạy cảm (như bio, ngày sinh, motivation) được sửa, còn giấy tờ định danh vẫn khóa.
- Sau khi được duyệt, Teacher tạo course, section, lesson và LessonContent gồm Reading, Quiz, Problem.
- Teacher submit course để Admin review. Course bị reject có thể sửa và resubmit.
- Teacher cấu hình giá course, passing score và số lần retry của Quiz/Problem theo contract.
- Teacher xem học viên, progress, submission, comment và doanh thu thuộc course của mình.
- Teacher quản lý coding problem, quiz, testcase và language config thuộc quyền của mình.
- Teacher nhận phần doanh thu theo policy revenue split đã được duyệt.
- Teacher tạo payout request khi đạt minimum payout; Admin là người duyệt payout.

### Admin

- Quản lý User, Role, account status và audit log.
- Duyệt/reject teacher application, kèm note và lịch sử quyết định.
- Duyệt/reject course được Teacher submit, kèm note và lịch sử review.
- Duyệt hoặc reject payout request theo lifecycle payout.
- Theo dõi transaction, enrollment, PayOS webhook và notification.
- Quản lý nội dung vi phạm và review theo policy vận hành.

## 3. Trạng thái nghiệp vụ

### Teacher application

Luồng chuẩn:

`DRAFT -> PENDING -> APPROVED | REJECTED`

Sau khi bị `REJECTED`, Student được mở quyền sửa profile/application và submit lại về `PENDING`; `PENDING` khóa dữ liệu đang xét duyệt. Sau `APPROVED`, chỉ field không nhạy cảm trong whitelist được sửa, còn giấy tờ định danh vẫn khóa. Quyền Teacher chỉ được cấp ở `APPROVED`. Dữ liệu cũ `AGREE` cần map thành `APPROVED`, `REJECT` map thành `REJECTED` khi migration.

### Course moderation

Luồng review được mô tả như sau:

`DRAFT -> PENDING_REVIEW -> APPROVED | REJECTED`

`APPROVED` là trạng thái public duy nhất. `ARCHIVED` ngừng bán và ẩn khỏi catalog mới nhưng giữ quyền truy cập cho Student đã enrollment; `PUBLISHED` chỉ là giá trị legacy cần map sang `APPROVED` khi migration.

### Payment và enrollment

Luồng chính:

1. Student tạo checkout trực tiếp cho một course `APPROVED` chưa enrollment.
2. Hệ thống snapshot giá `USD` hai chữ số thập phân và tạo transaction `PENDING` có expiry.
3. Mỗi Student/course có thể có nhiều transaction lịch sử, nhưng service chỉ cho một `PENDING` còn hạn tại một thời điểm.
4. Webhook PayOS mô phỏng có chữ ký test hợp lệ là nơi duy nhất chuyển transaction sang `COMPLETED`.
5. Hệ thống tạo enrollment một lần theo transaction idempotency.
6. Hệ thống ghi nhận doanh thu vào wallet ledger và gửi notification.

Payment có các trạng thái `PENDING`, `COMPLETED`, `FAILED`, `EXPIRED`. `COMPLETE` là tên legacy cần map sang `COMPLETED` khi migration. Payment failed hoặc expired không tạo enrollment; frontend chỉ đọc/poll trạng thái sau khi mở trang PayOS mô phỏng.

### Payout

`PENDING -> APPROVED | REJECTED`

Sau `APPROVED`, payout chuyển:

`PROCESSING -> COMPLETED | FAILED`

Nếu settlement thất bại, hệ thống tạo ledger entry hoàn lại khoản reserve. Admin chỉ reject payout đang `PENDING`; Teacher không tự thay đổi payout status.

### AI Interview

Session dùng lifecycle:

`ACTIVE -> REPORT_GENERATING -> COMPLETED | FAILED`

Session có thể chuyển `ABORTED` khi Student kết thúc sớm hoặc phiên bị dừng theo policy. Một session có tối đa 12 câu và chỉ có một final report. Report worker phải idempotent.

## 4. Learning và Online Judge

### LessonContent

Một lesson có nhiều `lesson_content`, mỗi item có `content_type` và `position`. `content_type` chỉ nhận:

- `READING`
- `QUIZ`
- `PROBLEM`

`content_id` là polymorphic reference. Database không thể tạo một foreign key tới nhiều bảng content, vì vậy service phải kiểm tra:

- Cặp `content_type/content_id` có tồn tại.
- Content đúng loại.
- Content thuộc đúng course/lesson.
- Teacher có quyền tạo hoặc sửa binding.

Không thêm `VIDEO`, `video_content`, `watched_percent` hoặc video completion policy.

### Completion và progress

- Reading hoàn thành khi Student có quyền truy cập và thực hiện action đánh dấu hoàn thành.
- Quiz hoàn thành khi terminal `quiz_submission.score` đạt `quizzes.passing_score` trong một `quiz_attempt` hợp lệ; attempt đang làm không save/resume.
- Problem hoàn thành khi submission đạt `ACCEPTED` và score đạt `problem.passing_score` do Teacher cấu hình.
- Progress được lưu theo `enrollment_id` và `lesson_content_id`; dữ liệu score/attempt có thể lấy từ Quiz/OJ theo contract.

### Online Judge

Student gửi source code, language và problem. Business Application lưu submission `PENDING`, gọi Judge Service và cập nhật kết quả. Các status gồm `PENDING`, `RUNNING`, `ACCEPTED`, `WRONG_ANSWER`, `TIME_LIMIT_EXCEEDED`, `MEMORY_LIMIT_EXCEEDED`, `RUNTIME_ERROR` và `COMPILE_ERROR`.

Output của testcase được so khớp tuyệt đối theo byte UTF-8, bao gồm whitespace và newline cuối. Với Submit, Judge chạy testcase tuần tự, gửi kết quả ngay sau mỗi testcase đã chạy, và dừng ở testcase lỗi đầu tiên. Chỉ submission pass toàn bộ testcase mới có status `ACCEPTED`; mọi kết quả trước đó chỉ là progress hoặc partial result, không được coi là accepted.

Hidden testcase không trả raw input/output cho Student. Submission history chỉ hiển thị cho owner hoặc role được cấp quyền. Teacher chỉ quản lý problem thuộc quyền của mình.

Problem recommendation cần quan hệ Problem–Tag. `user_history.problem_count` không được dùng làm nguồn duy nhất cho contribution, streak hoặc recommendation.

## 5. Commerce và Teacher Finance

### Payment trực tiếp và enrollment

- MVP không có Cart, Order hoặc Order Item; một checkout tạo transaction cho đúng một course.
- Transaction phải lưu price snapshot `USD`, expiry, provider reference và idempotency key.
- Payment webhook PayOS mô phỏng phải verify chữ ký test và idempotent theo provider/transaction code.
- Enrollment creation phải atomic và idempotent.
- Student không được tạo checkout mới cho course đã enrollment; chỉ một transaction `PENDING` còn hạn được tồn tại cho mỗi Student/course.
- Amount persistence dùng decimal hai chữ số thập phân với currency `USD`.

### Wallet và payout

- Wallet ledger là immutable; không sửa trực tiếp các entry đã ghi nhận.
- Mỗi payment thành công tạo các entry revenue theo revenue split được duyệt.
- Payout có owner, amount, status, reviewer, settlement reference và failure reason.
- Currency là `USD`, amount dùng decimal hai chữ số thập phân và minimum payout là `0.00 USD`; revenue split và settlement mechanism vẫn cần được duyệt.

## 6. AI Interview, Notification và Audit

### AI Interview data

Database lưu topic, level, status, question count, timestamps, message text và một final report tổng hợp. Sender message được giới hạn ở `AI`, `STUDENT`, `SYSTEM`; message của Student đến từ speech-to-text hoặc text fallback. Microphone/camera chỉ là permission của UI, camera preview-only, không lưu audio/video recording hoặc feedback theo từng câu.

### Notification

Notification cần hỗ trợ tối thiểu các event:

- Payment success/failure.
- Teacher application approval/rejection.
- Course approval/rejection.
- Judge result.
- AI report ready.
- Payout approval/rejection.

Notification chỉ trả về cho user nhận notification và cần có event type/target để UI điều hướng.

### Audit

Audit log ghi actor, action, target type/id, note và thời gian cho các thao tác nhạy cảm như teacher review, course review, payout, payment webhook và account status. Không ghi raw secret, CCCD hoặc payment token.

## 7. Yêu cầu chức năng

- **FR-001 Auth/RBAC:** xác thực, role, account status và capability Teacher theo application approval.
- **FR-002 Catalog:** search, filter, detail, instructor, favorite và course review.
- **FR-003 Course authoring:** course, section, lesson, Reading/Quiz/Problem content, reorder và submit review.
- **FR-004 Moderation:** Admin review teacher application và course, note, history, approve/reject/resubmit.
- **FR-005 Commerce:** direct checkout cho một course, PayOS mô phỏng có webhook ký, transaction lifecycle và enrollment idempotency.
- **FR-006 Learning:** Reading/Quiz/Problem progress, passing score, retry policy và content access.
- **FR-007 Online Judge:** editor, run, submit, hidden testcase projection, testcase result và submission history.
- **FR-008 AI Interview:** setup voice-first, speech-to-text/text fallback, camera preview tùy chọn, tối đa 12 câu, end/abort và aggregate report.
- **FR-009 Teacher finance:** revenue ledger, payout lifecycle và Admin approval; currency `USD`, revenue split theo policy cần được chốt.
- **FR-010 Communication:** lesson comments/replies, notifications và audit.
- **FR-011 Student dashboard:** profile/capability, KPI, activity, Continue learning, interview history và recommended problems của current user.

## 8. Yêu cầu phi chức năng

- Password phải được hash; JWT/JWK do Auth Provider quản lý.
- Payment webhook phải verify signature và idempotent.
- Frontend không được chuyển transaction sang `COMPLETED`; chỉ webhook backend đã xác thực mới được tạo enrollment.
- Judge sandbox không có network, giới hạn CPU/RAM/time.
- File upload lưu qua object storage; URL lưu database.
- Mutation nhạy cảm phải có authorization theo role và resource ownership.
- Dữ liệu tiền dùng kiểu số chính xác, không dùng Float cho persistence khi currency đã được chốt.
- PII, CCCD và payment secret phải được bảo vệ; không ghi raw secret vào log.
- Dashboard, notification, progress, enrollment, submission và interview chỉ được trả dữ liệu của current user, trừ khi role có quyền xem resource đó.

## 9. Ngoài phạm vi hiện tại

- Video là một loại LessonContent.
- Lưu video/audio recording của AI Interview.
- Live classroom hoặc video conference.
- Payout tự động không qua Admin.
- Subscription hoặc coupon engine phức tạp.
- Cart, Order, Order Item và checkout nhiều course.
- Giao diện chatbot cho AI Interview, lưu/đánh giá camera và microphone, hoặc feedback theo từng câu.

## 10. Nguồn sự thật và open questions

### Nguồn sự thật

- Nghiệp vụ và phạm vi: tài liệu này cùng các quyết định đã được Product Owner xác nhận.
- Khoảng cách cần xử lý: [gap-analysis.md](gap-analysis.md).
- Schema proposal: [DATABASE.txt](../DATABASE.txt).
- `docs/DATABASE.txt` là nguồn schema proposal duy nhất; path lowercase lịch sử `docs/database.txt` đã retired và không được đồng bộ.
- API hiện tại: [api_spec.md](../specs/api_spec.md).
- UI: các wireframe Markdown trong `docs/ui`.

### Open questions

- Revenue split, payout destination và settlement mechanism chính thức là gì?
- Activity event, timezone, streak và study-time được định nghĩa như thế nào?
