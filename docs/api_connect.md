# Kế hoạch tích hợp API Frontend – Backend

Tài liệu này ánh xạ các chức năng MVP trong [`prd.md`](prd-documents/prd.md) sang target API contract trong [`api_spec.md`](specs/api_spec.md). Phạm vi chỉ mô tả kế hoạch kết nối FE–BE theo tài liệu, không phản ánh trạng thái triển khai hiện tại.

## Quy ước tích hợp chung

- Auth Provider dùng base URL `http://localhost:4001/api/auth`; mọi route ở slice Auth bên dưới được ghép với base URL này.
- Business Application dùng base URL `http://localhost:4000/api`; các route còn lại được ghép với base URL này.
- FE gửi access token qua `Authorization: Bearer <access_token>` và dùng đúng response envelope, phân trang, `snake_case`, ISO 8601 UTC và decimal string cho tiền theo `api_spec.md`.
- FE không gửi các field do server quản lý như owner, role/capability, trạng thái workflow, reviewer, timestamp, balance hoặc audit data.
- Các màn hình cần xử lý thống nhất các lỗi `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `DUPLICATE_RESOURCE`, `INVALID_STATE`, `PAYMENT_EXPIRED`, `VALIDATION_ERROR` và `RATE_LIMITED`.

## FR-001 — Xác thực, tài khoản và phân quyền

Slice này kết nối đăng ký/đăng nhập local hoặc Google, xác minh tài khoản, khôi phục mật khẩu, quản lý phiên và tải identity/capability của người dùng. Phần Admin hỗ trợ quản lý trạng thái tài khoản và role; FE chỉ dùng capability do BE trả về để điều hướng, còn BE luôn là nơi thực thi authorization.

| API route | Chức năng khi tích hợp |
|---|---|
| `POST /register` | Đăng ký tài khoản Student local và chuyển UI sang bước xác minh OTP. |
| `GET /verify?otp={otp}` | Xác minh OTP một lần và kích hoạt tài khoản. |
| `POST /resend-otp` | Gửi lại OTP, đồng thời hiển thị thời gian chờ gửi lại mà không làm lộ email tồn tại hay không. |
| `POST /login` | Xác thực email/password dạng form và nhận authorization code để tiếp tục đổi token. |
| `POST /code` | Đổi authorization code một lần lấy access token và refresh token. |
| `POST /refresh` | Làm mới access token bằng refresh token hoặc secure cookie theo cơ chế Auth được chốt. |
| `POST /google` | Đăng nhập/đăng ký bằng Google credential đã được provider xác minh. |
| `POST /logout` | Thu hồi phiên refresh hiện tại và kết thúc phiên đăng nhập trên FE. |
| `POST /forgot-password` | Yêu cầu gửi hướng dẫn đặt lại mật khẩu với phản hồi không tiết lộ email tồn tại. |
| `POST /reset-password` | Đặt mật khẩu mới bằng reset code hợp lệ. |
| `POST /change-email` | Yêu cầu đổi email và khởi động bước xác minh email mới. |
| `GET /verify-reset-email?token={token}` | Xác minh token đổi email và hoàn tất cập nhật email. |
| `GET /public-key` | Lấy public key/JWK để phục vụ xác minh token khi client hoặc thành phần liên quan cần theo policy. |
| `GET /users/me` | Nạp identity, role, trạng thái tài khoản và dữ liệu nền cho auth guard/session bootstrap. |
| `GET /admin/users` | Hiển thị danh sách người dùng cho Admin với tìm kiếm, lọc role/trạng thái và phân trang. |
| `PUT /admin/users/{user_id}/status` | Cho Admin khóa hoặc kích hoạt tài khoản; FE cập nhật trạng thái theo response của server. |
| `PUT /admin/users/{user_id}/roles` | Cho Admin thay thế tập role; role Teacher không tự tạo capability nếu hồ sơ chưa được duyệt. |

## FR-002 — Catalog, giảng viên, yêu thích và đánh giá khóa học

Slice này phục vụ khám phá khóa học public, xem chi tiết và giảng viên, quản lý danh sách yêu thích, đồng thời cho học viên đã enrollment tạo hoặc sửa một review duy nhất cho mỗi khóa học.

| API route | Chức năng khi tích hợp |
|---|---|
| `GET /courses` | Tải catalog với tìm kiếm, lọc lĩnh vực/tag/loại giá và phân trang ổn định. |
| `GET /courses/{slug}` | Tải chi tiết khóa học, giảng viên, tổng quan curriculum và các trạng thái projected như đã thích/đã enrollment. |
| `GET /instructors` | Tải danh sách giảng viên đã được phê duyệt, hỗ trợ tìm kiếm và lọc. |
| `GET /instructors/{user_id}` | Tải hồ sơ công khai và các khóa học public của một giảng viên hợp lệ. |
| `GET /favorites` | Tải danh sách khóa học yêu thích của Student hiện tại. |
| `PUT /courses/{course_id}/favorite` | Thêm khóa học vào yêu thích theo thao tác idempotent. |
| `DELETE /courses/{course_id}/favorite` | Bỏ khóa học khỏi yêu thích theo thao tác idempotent. |
| `GET /courses/{course_id}/reviews` | Tải review và thống kê rating của khóa học, có lọc rating và phân trang. |
| `POST /courses/{course_id}/reviews` | Tạo review cho Student đã enrollment; FE xử lý xung đột khi đã tồn tại review. |
| `PATCH /courses/{course_id}/reviews/{review_id}` | Sửa rating/nội dung review do chính Student sở hữu. |

## FR-003 — Soạn khóa học và quản lý nội dung

Slice này cung cấp workspace cho Teacher đã được duyệt để tạo khóa học, xây dựng section/lesson, gắn đúng ba loại LessonContent `READING`, `QUIZ`, `PROBLEM`, sắp xếp curriculum và quản lý bài lập trình, testcase, ngôn ngữ chấm.

| API route | Chức năng khi tích hợp |
|---|---|
| `GET /teacher/courses` | Tải các khóa học thuộc Teacher hiện tại theo trạng thái và phân trang. |
| `POST /teacher/courses` | Tạo khóa học nháp; BE tự đặt owner, slug, currency `USD` và trạng thái `DRAFT`. |
| `GET /teacher/courses/{course_id}` | Tải chi tiết khóa học thuộc sở hữu cùng curriculum và thông tin moderation cần cho builder. |
| `PUT /teacher/courses/{course_id}` | Cập nhật các field khóa học được phép khi trạng thái còn chỉnh sửa được. |
| `POST /teacher/courses/{course_id}/sections` | Thêm section vào khóa học và lưu vị trí. |
| `PUT /teacher/sections/{section_id}` | Sửa tiêu đề/vị trí section thuộc khóa học của Teacher. |
| `DELETE /teacher/sections/{section_id}` | Xóa section theo policy cascade/content của BE. |
| `POST /teacher/sections/{section_id}/lessons` | Thêm lesson vào section. |
| `PUT /teacher/lessons/{lesson_id}` | Sửa nội dung mô tả, điểm và vị trí lesson. |
| `DELETE /teacher/lessons/{lesson_id}` | Xóa lesson khi course state cho phép. |
| `POST /teacher/lessons/{lesson_id}/readings` | Tạo Reading và LessonContent binding một cách atomic. |
| `PUT /teacher/lesson-contents/{lesson_content_id}/reading` | Cập nhật Reading đã gắn với lesson sau khi BE xác thực type và ownership. |
| `POST /teacher/lessons/{lesson_id}/contents` | Gắn content hiện có vào lesson bằng `content_type`, `content_id` và `position`; không gửi loại `VIDEO`. |
| `PUT /teacher/lesson-contents/{lesson_content_id}` | Sửa binding/vị trí LessonContent và để BE kiểm tra lại polymorphic reference. |
| `DELETE /teacher/lesson-contents/{lesson_content_id}` | Gỡ LessonContent khỏi curriculum khi trạng thái cho phép. |
| `PUT /teacher/courses/{course_id}/curriculum/reorder` | Lưu toàn bộ thao tác sắp xếp section, lesson và content atomically. |
| `POST /teacher/lessons/{lesson_id}/quizzes` | Tạo Quiz và binding vào lesson trong cùng giao dịch. |
| `PUT /teacher/quizzes/{quiz_id}` | Cập nhật cấu hình Quiz như passing score, thời gian và số attempt. |
| `PUT /teacher/quizzes/{quiz_id}/questions` | Thay/cập nhật bộ câu hỏi và đáp án; dữ liệu answer key chỉ dùng trong author view. |
| `POST /teacher/problems` | Tạo coding problem cùng tag, passing score và language configs. |
| `PUT /teacher/problems/{problem_id}` | Cập nhật problem, tag và cấu hình chấm thuộc quyền Teacher. |
| `POST /teacher/problems/{problem_id}/testcases/upload` | Upload cặp file input/output testcase cùng score và cờ hidden; FE không tự gửi storage path. |

## FR-004 — Đăng ký Teacher và kiểm duyệt

Slice này bao phủ vòng đời hồ sơ Teacher `DRAFT → PENDING → APPROVED | REJECTED`, khả năng sửa/resubmit đúng trạng thái, cùng luồng Teacher gửi course và Admin phê duyệt, từ chối hoặc archive. Ghi chú, lịch sử, notification và audit được BE tạo theo transition.

| API route | Chức năng khi tích hợp |
|---|---|
| `PUT /users/me/teacher-profile` | Tạo/cập nhật thông tin nghề nghiệp của Teacher candidate theo quyền sửa của trạng thái application. |
| `POST /teacher-applications` | Tạo application nháp duy nhất cho teacher profile hiện tại. |
| `GET /teacher-applications/me` | Tải profile, application, lịch sử và cờ `can_edit`/`can_submit` cho màn hình ứng tuyển. |
| `PUT /teacher-applications/me` | Lưu thay đổi application theo whitelist của từng trạng thái; FE không gửi status/reviewer. |
| `POST /teacher-applications/me/submit` | Submit lần đầu hoặc resubmit hồ sơ bị reject sang `PENDING`. |
| `GET /admin/teacher-applications` | Tải danh sách application đã được che dữ liệu nhạy cảm để Admin lọc và xét duyệt. |
| `GET /admin/teacher-applications/{application_id}` | Tải chi tiết application, profile và lịch sử cho Admin theo quyền xem PII. |
| `POST /admin/teacher-applications/{application_id}/review` | Admin approve/reject hồ sơ `PENDING` kèm note; BE cập nhật capability, history, notification và audit atomically. |
| `POST /teacher/courses/{course_id}/submit-review` | Teacher submit/resubmit course từ `DRAFT` hoặc `REJECTED` sang `PENDING_REVIEW`. |
| `GET /teacher/courses/{course_id}/moderation-history` | Hiển thị lịch sử xét duyệt của khóa học cho owner. |
| `GET /admin/courses` | Tải hàng đợi khóa học cần kiểm duyệt với tìm kiếm, trạng thái và phân trang. |
| `GET /admin/courses/{course_id}` | Tải chi tiết course, curriculum và lịch sử moderation cho Admin, không lộ hidden testcase. |
| `POST /admin/courses/{course_id}/review` | Admin approve/reject course đang chờ kèm note; BE tạo history, notification và audit. |
| `POST /admin/courses/{course_id}/archive` | Archive course, ngừng bán/ẩn khỏi catalog mới nhưng giữ access của học viên theo policy. |

## FR-005 — Thanh toán trực tiếp và enrollment

Slice này thực hiện checkout một course, điều hướng sang PayOS mô phỏng, poll trạng thái transaction và nhận enrollment do BE tạo. FE tuyệt đối không tự chuyển payment sang `COMPLETED`; webhook đã xác minh là nguồn duy nhất tạo enrollment và revenue.

| API route | Chức năng khi tích hợp |
|---|---|
| `POST /courses/{course_id}/checkout` | Tạo hoặc tái sử dụng transaction `PENDING` cho course trả phí; FE gửi `Idempotency-Key` và mở URL/QR do BE trả về. |
| `POST /courses/{slug}/enroll` | Enrollment idempotent cho khóa học miễn phí; course trả phí phải dùng checkout. |
| `GET /payments/transactions/{transaction_code}` | Poll trạng thái `PENDING/COMPLETED/FAILED/EXPIRED` và lấy enrollment nếu đã tạo. |
| `POST /payments/payos/webhook` | Endpoint PayOS mock/internal hoàn tất hoặc làm thất bại transaction; FE không gọi route này. |
| `GET /admin/payments` | Cho Admin theo dõi transaction theo trạng thái, mã giao dịch, Student hoặc course. |
| `GET /admin/enrollments` | Cho Admin tra cứu enrollment theo Student/course và phân trang. |

## FR-006 — Học tập, Quiz và tiến độ

Slice này tải khóa học đã enrollment, workspace học theo thứ tự content, đánh dấu Reading hoàn thành và theo dõi progress. Quiz dùng attempt terminal, không hỗ trợ save/resume; kết quả đạt passing score do BE tự cập nhật completion.

| API route | Chức năng khi tích hợp |
|---|---|
| `GET /student/courses` | Tải các khóa học Student đã enrollment cùng trạng thái và progress tổng hợp. |
| `GET /student/courses/{slug}/study` | Tải curriculum, nội dung được phép, trạng thái hoàn thành và `locked` cho learning workspace. |
| `POST /student/progress/lesson-contents/{lesson_content_id}/complete` | Đánh dấu Reading hoàn thành idempotently; FE không dùng route này cho Quiz/Problem. |
| `GET /student/progress` | Tải progress của current Student, có thể lọc theo course. |
| `POST /student/quizzes/{quiz_id}/attempts` | Bắt đầu attempt mới, nhận câu hỏi/option learner-safe và số lượt còn lại; attempt đang dở trước đó bị abandon theo contract. |
| `GET /student/quizzes/{quiz_id}/attempts/{attempt_id}` | Tải attempt thuộc Student mà không lộ đáp án đúng. |
| `POST /student/quizzes/{quiz_id}/attempts/{attempt_id}/submit` | Gửi toàn bộ đáp án cuối cùng, nhận score, `passed` và progress nếu đạt; retry cùng attempt nhận lại terminal result. |
| `GET /student/quizzes/{quiz_id}/attempts` | Tải lịch sử attempt Quiz của current Student. |

## FR-007 — Online Judge

Slice này cung cấp danh sách/chi tiết problem, editor Run/Submit, trạng thái chấm theo testcase và lịch sử submission. FE chỉ hiển thị projection an toàn: hidden testcase không được lộ raw input/output hoặc identifier nhạy cảm.

| API route | Chức năng khi tích hợp |
|---|---|
| `GET /problems` | Tải danh sách problem public/được phép với tag, difficulty, phân trang và solved-state. |
| `GET /problems/{slug}` | Tải đề bài, tag, ngôn ngữ active và cấu hình được phép cho editor. |
| `POST /problems/{slug}/run` | Chạy code với custom input để xem stdout/stderr/runtime/memory; không tạo submission hay progress. |
| `POST /problems/{slug}/submit` | Gửi bài chấm chính thức và nhận submission ban đầu ở trạng thái `PENDING`. |
| `GET /submissions/{submission_id}` | Poll/tải chi tiết submission và testcase-result projection theo quyền; dùng để cập nhật tiến trình đến trạng thái terminal. |
| `GET /problems/{slug}/submissions` | Tải lịch sử submission của current Student cho một problem. |
| `GET /teacher/courses/{course_id}/submissions` | Cho Teacher lọc và xem submission thuộc course/problem của mình theo Student hoặc status. |

## FR-008 — AI Interview

Slice này hỗ trợ phiên phỏng vấn voice-first tối đa 12 câu. Speech-to-text diễn ra ở client rồi gửi text có thể chỉnh sửa; typed fallback dùng cùng API, camera chỉ preview tại client và không có media nào được upload/lưu/chấm.

| API route | Chức năng khi tích hợp |
|---|---|
| `GET /interviews/sessions` | Tải lịch sử phiên phỏng vấn của current Student, có lọc trạng thái và phân trang. |
| `POST /interviews/sessions` | Tạo session từ topic/level và nhận câu hỏi AI đầu tiên. |
| `GET /interviews/sessions/{session_id}` | Tải session, toàn bộ message text và cờ `can_answer` để khôi phục UI. |
| `POST /interviews/sessions/{session_id}/answers` | Gửi `answer_text` từ STT hoặc typed fallback và nhận message tiếp theo/trạng thái mới. |
| `POST /interviews/sessions/{session_id}/end` | Kết thúc hợp lệ, chuyển sang `REPORT_GENERATING` và kích hoạt tạo report idempotently. |
| `POST /interviews/sessions/{session_id}/abort` | Hủy sớm session đang hoạt động; không mặc định tạo report. |
| `GET /interviews/sessions/{session_id}/report` | Poll/tải một báo cáo tổng hợp duy nhất; GET không kích hoạt job tạo report. |

## FR-009 — Doanh thu, ví và payout của Teacher

Slice này hiển thị số dư và immutable wallet ledger, cho Teacher tạo/theo dõi payout request, đồng thời cho Admin điều khiển lifecycle `PENDING → APPROVED/REJECTED → PROCESSING → COMPLETED/FAILED`. FE luôn hiển thị tiền bằng decimal string và currency `USD`.

| API route | Chức năng khi tích hợp |
|---|---|
| `GET /teacher/wallet` | Tải ví và số dư khả dụng/đang chờ của current Teacher. |
| `GET /teacher/wallet/ledger` | Tải ledger doanh thu/reserve/bù trừ với bộ lọc loại entry, thời gian và phân trang. |
| `POST /teacher/payout-requests` | Tạo yêu cầu payout bằng amount; BE kiểm tra số dư, đặt USD và reserve ledger atomically. |
| `GET /teacher/payout-requests` | Tải lịch sử payout request của current Teacher theo trạng thái. |
| `GET /admin/payout-requests` | Tải hàng đợi payout cho Admin theo trạng thái/Teacher. |
| `POST /admin/payout-requests/{payout_id}/review` | Admin approve/reject payout `PENDING` kèm audit note. |
| `POST /admin/payout-requests/{payout_id}/processing` | Chuyển payout đã approve sang `PROCESSING` và gắn settlement reference nếu có. |
| `POST /admin/payout-requests/{payout_id}/settle` | Kết thúc payout bằng `COMPLETED` hoặc `FAILED`; failure khiến BE tạo ledger bù trừ đúng một lần. |

## FR-010 — Bình luận, thông báo và audit

Slice này tích hợp comment/reply theo LessonContent, inbox notification theo người nhận và nhật ký thao tác nhạy cảm cho Admin. Notification được BE tạo từ các event nghiệp vụ; contract không có API để FE tự tạo notification hay audit log.

| API route | Chức năng khi tích hợp |
|---|---|
| `GET /lesson-contents/{lesson_content_id}/comments` | Tải các thread comment theo root, kèm toàn bộ reply dạng flat để FE hiển thị tối đa hai cấp và tombstone khi cần. |
| `POST /lesson-contents/{lesson_content_id}/comments` | Tạo comment hoặc reply bằng `content` và `parent_id`; BE kiểm tra access và quan hệ cùng LessonContent. |
| `DELETE /comments/{comment_id}` | Xóa comment theo quyền owner/moderator và policy hard-delete/soft-delete của thread. |
| `GET /notifications` | Tải notification của current user theo trạng thái chưa đọc, event type và phân trang để điều hướng tới target. |
| `PUT /notifications/{notification_id}/read` | Đánh dấu notification của người nhận là đã đọc theo thao tác idempotent. |
| `GET /admin/audit-logs` | Cho Admin lọc và xem audit log đã redact theo actor, action, target, correlation ID và thời gian. |

## FR-011 — Dashboard và hồ sơ người dùng

Slice này tổng hợp dữ liệu current user cho dashboard Student, dashboard Teacher và các màn hình Teacher theo dõi học viên, tiến độ, submission và comment của course. KPI, streak, activity, continue-learning và recommendation đều là projection do BE tính, FE không ghi ngược.

| API route | Chức năng khi tích hợp |
|---|---|
| `GET /users/me/profile` | Tải hồ sơ Student hiện tại cùng thông tin cá nhân được phép hiển thị. |
| `PUT /users/me/profile` | Cập nhật bio, learning preferences và social links của current user. |
| `GET /student/dashboard` | Tải profile/capability, KPI, activity, continue-learning, lịch sử interview và recommended problems của current Student. |
| `GET /teacher/dashboard/summary` | Tải tổng quan course, enrollment, doanh thu và wallet của current Teacher đã approved. |
| `GET /teacher/courses/{course_id}/students` | Tải danh sách học viên enrollment trong course của Teacher cùng progress projection. |
| `GET /teacher/courses/{course_id}/students/{student_id}/progress` | Tải tiến độ LessonContent và submission summary của một học viên trong course. |
| `GET /teacher/courses/{course_id}/comments` | Tải comment của course, hỗ trợ lọc câu hỏi chưa được Teacher trả lời. |

## Trình tự tích hợp đề xuất

1. Hoàn thiện lớp API client dùng chung: base URL theo service, token/refresh, response envelope, error mapping, pagination và request cancellation.
2. Tích hợp FR-001 trước để có session, account-state guard, role/capability guard và ownership context cho các slice còn lại.
3. Tích hợp các luồng đọc public và nền tảng người dùng: FR-002, FR-011, sau đó FR-004 để mở capability Teacher.
4. Tích hợp authoring/moderation theo chuỗi FR-003 → FR-004, bảo đảm FE render action theo trạng thái nhưng không tự suy diễn transition.
5. Tích hợp commerce và learning theo chuỗi FR-005 → FR-006 → FR-007; payment dùng polling sau redirect, Judge dùng polling/progress projection theo contract hiện có.
6. Tích hợp các slice độc lập FR-008, FR-009 và FR-010; cuối cùng kiểm thử chéo notification, audit, ownership và các side effect idempotent.

## Điểm kiểm thử tích hợp bắt buộc

- Kiểm thử role/capability cho Student, Teacher chưa approved, Teacher approved và Admin; ẩn action trên FE không thay thế authorization của BE.
- Kiểm thử các state machine Teacher application, course moderation, payment, Quiz attempt, Judge submission, interview và payout, gồm cả thao tác lặp/idempotent.
- Kiểm thử dữ liệu chỉ thuộc current user cho dashboard, notification, progress, enrollment, transaction, submission và interview.
- Kiểm thử không lộ password/token bí mật, OTP/reset code, CCCD đầy đủ, raw hidden testcase, raw payment payload hoặc interview media.
- Kiểm thử course `ARCHIVED` vẫn truy cập được với Student đã enrollment nhưng không còn xuất hiện trong catalog bán mới.
- Kiểm thử FE không gửi hoặc persist các projection/server-managed field và không có luồng `VIDEO`, Cart/Order, multi-course checkout hoặc media recording ngoài phạm vi MVP.
