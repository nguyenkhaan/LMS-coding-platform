# Gap Analysis

Các vấn đề liên quan để tang tính đồng bộ của database và UI 

## 1. Các vấn đề liên quan đến Database

### teacher_register

| Database hiện tại | Nghiệp vụ cần hỗ trợ | Cần chỉnh sửa |
| --- | --- | --- |
| `teacher_register.status`: `AGREE`, `REJECT`, `PENDING` | Student lưu nháp, submit, bị từ chối thì sửa và resubmit | Chuẩn hóa thành `DRAFT -> PENDING -> APPROVED | REJECTED`; map `AGREE -> APPROVED`, `REJECT -> REJECTED`. |
| `teacher_profile.verified` là boolean, application gắn trực tiếp User | Chỉ profile có application `APPROVED` mới có capability Teacher | Dùng quan hệ 1-1 `teacher_register.teacher_profile_id -> teacher_profile.user_id`; không dùng role hoặc boolean đơn lẻ để cấp quyền. |
| Education/experience đang tách bảng, field Profile/Application chưa rõ owner | Profile chứa thông tin public/professional; application chứa dữ liệu xét duyệt và PII | Lưu `education_entries`/`experience_entries` JSON trong `teacher_profile`; bỏ bảng riêng. Application chỉ giữ bio/motivation, ngày sinh và giấy tờ/evidence. |
| Không có policy sửa theo trạng thái | Student không sửa dữ liệu đang được Admin xét duyệt hoặc giấy tờ đã duyệt | `DRAFT`/`REJECTED` cho sửa; `PENDING` khóa cả profile/application; `APPROVED` cho sửa field `teacher_profile` và chỉ whitelist field application không nhạy cảm, khóa identity/document fields. |
| Chỉ lưu review hiện tại | Admin cần xem reviewer, note, thời điểm và lịch sử resubmit | Dùng `teacher_register_history` cho mỗi submit/review/resubmit event. |

**Cần bổ sung**

- Migration profile/application 1-1, JSON field và trạng thái legacy.
- Validation/service guard theo policy edit, capability `APPROVED`, ownership và PII masking.
- API draft/update/submit/resubmit/status/history/Admin review không nhận status hoặc reviewer từ client.

### course_moderation

| Database hiện tại | Nghiệp vụ cần hỗ trợ | Cần chỉnh sửa |
| --- | --- | --- |
| `courses.status`: `DRAFT`, `PENDING_REVIEW`, `PUBLISHED`, `ARCHIVED` | Teacher gửi course để Admin review; Admin approve/reject kèm note; Teacher sửa và gửi lại | Canonical là `DRAFT -> PENDING_REVIEW -> APPROVED | REJECTED`; map `PUBLISHED -> APPROVED` và giữ `ARCHIVED` cho course ngừng bán. |
| Không có submitted time, reviewer hoặc review history | Admin cần queue, preview, note và lịch sử quyết định | Thêm các field review hoặc bảng lịch sử lưu các quyết định của admin. |
| Course chỉ có `teacher_id` | Chỉ Teacher đã được duyệt mới quản lý course của mình | API phải kiểm tra application approved và ownership course. |

**Cần bổ sung**
- `APPROVED` là trạng thái public duy nhất; `ARCHIVED` không xuất hiện trong catalog mới nhưng enrollment hợp lệ vẫn truy cập được.
- Lưu thời điểm submit, người review, note và quyết định review.
- Tách dữ liệu review của Admin khỏi `course_review` của Student.
- API cần có submit/resubmit course, admin queue, approve/reject và review history.
- Course chưa public/approved không xuất hiện trong catalog; course đã enrollment vẫn truy cập được sau archive.

### catalog_favorite_review

| Database hiện tại | Nghiệp vụ cần hỗ trợ | Cần chỉnh sửa |
| --- | --- | --- |
| `courses.rating` là một số tổng | Course detail hiển thị rating và review | Cần bảng review làm nguồn; rating là giá trị tính từ review hoặc cache. |
| Không có bảng favorite | Student lưu, xóa và xem danh sách course yêu thích | Thêm bảng favorite và unique `(student_id, course_id)`. |
| `tags` là string | Catalog cần search/filter/tag ổn định | Xác định có cần tách tag thành quan hệ riêng hay vẫn dùng chuỗi. |
| Comment gắn với `lesson_content` | Course detail có review course | Không dùng comment lesson thay cho review course. |

**Cần bổ sung**

- Thêm bảng favorite. 
- Thêm bảng course review: course, student, rating, nội dung, thời gian và unique `(course_id, student_id)`.
- API cần có favorite list/add/remove và course review create/update/list; chỉ Student đã enrollment được tạo hoặc sửa duy nhất một review của mình.

### payment_enrollment

| Database hiện tại | Nghiệp vụ cần hỗ trợ | Cần chỉnh sửa |
| --- | --- | --- |
| `transaction` gắn trực tiếp user và course | Checkout trực tiếp một course và Payment Result | Giữ transaction trực tiếp Student/course; Cart, Order và Order Item ngoài phạm vi MVP. |
| `transaction.amount` là `double` | Thanh toán cần giá tại thời điểm mua | Dùng snapshot `USD` bằng decimal 2 chữ số và expiry. |
| Payment status có `COMPLETE`, `PENDING`, `FAILED` | Payment Result có pending, failed, expired, completed | Dùng `PENDING`, `COMPLETED`, `FAILED`, `EXPIRED`; map `COMPLETE -> COMPLETED`. |
| `enrollment` chưa có unique constraint rõ ràng | Không mua lại course đã enrollment; payment success chỉ tạo enrollment một lần | Thêm unique `(student_id, course_id)` và idempotency ở service. |
| `transaction_code` và `payos_code` có unique | PayOS mock phải mô phỏng callback thật | Chỉ webhook backend có chữ ký test hợp lệ được chuyển `COMPLETED`; xử lý webhook lặp an toàn. |

**Cần bổ sung**

- Xóa/không tạo cart, cart item, order và order item trong canonical schema/API/UI MVP.
- Lưu price snapshot, `USD`, expiry và idempotency key trong transaction.
- Một Student/course có thể có nhiều transaction lịch sử, nhưng transactionally chỉ tồn tại một `PENDING` còn hạn tại một thời điểm.
- API cần có direct checkout, payment status, signed PayOS mock webhook, Payment Result và tạo enrollment idempotent; frontend không tự đánh dấu payment thành công.
- Payment failed/expired không tạo enrollment.

### wallet_payout

| Database hiện tại | Nghiệp vụ cần hỗ trợ | Cần chỉnh sửa |
| --- | --- | --- |
| Không có wallet hoặc  (Nơi ghi chép, tổng hợp giao dịch) | Teacher xem số dư, doanh thu và lịch sử giao dịch | Cần wallet projection và ledger (không cho sửa trực tiếp - readonly) |
| Không lưu revenue split | Teacher nhận 80%, Platform nhận 20% | Cần record từng khoản chia doanh thu theo payment hoàn tất. |
| Không có payout request | Teacher gửi yêu cầu rút tiền; Admin duyệt hoặc từ chối | Cần bảng payout, status, reviewer và settlement reference. |
| Minimum payout và currency chưa thống nhất | UI hiển thị điều kiện tối thiểu để rút | Dùng `USD`, decimal 2 chữ số và minimum `0.00 USD`; revenue split/settlement vẫn là policy cần chốt. |

**Cần bổ sung**

- Thêm wallet ledger với nguồn transaction, loại entry và thời gian.
- Thêm payout request với luồng `PENDING -> APPROVED -> PROCESSING -> COMPLETED | FAILED`; chỉ được reject khi đang `PENDING`.
- Nếu settlement thất bại, hoàn khoản reserve bằng một ledger entry mới.
- API phải giới hạn Teacher vào wallet của mình; chỉ Admin được duyệt payout.

### lesson_content_progress

| Database hiện tại | Nghiệp vụ cần hỗ trợ | Cần chỉnh sửa |
| --- | --- | --- |
| `lesson_content.content_id` là polymorphic, không có foreign key thật | Builder gắn Reading, Quiz hoặc Problem vào lesson | Service phải kiểm tra `content_type` và `content_id` có tồn tại, đúng loại và thuộc course phù hợp. |
| `lesson_content_progress` chỉ có `completed` | UI cần biết completion theo từng loại content | Xác định, chốt lại loại dữ liệu nào cần lưu, cần xử lý như thế nào khi hiển thị tiến độ học tập |

**Rule**

- Reading: Student tự đánh dấu hoàn thành sau khi có quyền truy cập content.
- Quiz: hoàn thành khi `quiz_submission` terminal của một `quiz_attempt` hợp lệ có `score >= quizzes.passing_score`.
- Problem: hoàn thành khi submission `ACCEPTED` có score đạt `problem.passing_score` do Teacher cấu hình.

**Cần bổ sung**

- API phải validate cặp `(content_type, content_id)`, ownership course và quyền Teacher trước khi gắn content.
- API progress chỉ cho Student đã enrollment; không tạo progress cho content không thuộc course của Student.

### quiz_online_judge

| Database hiện tại | Nghiệp vụ cần hỗ trợ | Cần chỉnh sửa |
| --- | --- | --- |
| `quiz_submission` có score, answers và submitted time | UI cần attempt number, start, submit, score và history | Tách `quiz_attempt` để lưu mỗi lần bắt đầu; `quiz_submission` là kết quả terminal 1-1 của attempt. Không hỗ trợ save/resume. |
| `quizzes.passing_score` và `attempts` đã có | Teacher đặt passing score và số lần làm | API dùng `passing_score`, không hard-code số điểm qua môn|
| Không có unique theo quiz/student/attempt | Không vượt số lần làm và không submit trùng | Unique `(quiz_id, student_id, attempt_no)` ở `quiz_attempt`; `quiz_submission.quiz_attempt_id` unique. |
| Testcase có `is_hidden` | Student xem sample, không xem raw hidden input/output | API chỉ trả status/runtime/memory/score cần thiết cho hidden testcase. |
| Có `problem_tag`, chưa có mapping problem-tag | Dashboard đề xuất problem theo weakest topics | Thêm bảng mapping problem-tag và unique `(problem_id, tag_id)`. |
| Submission có status, score, runtime, memory | Problem trong LessonContent cần cập nhật progress | Cần map submission Accepted về đúng enrollment/lesson content. |

**Cần bổ sung**

- Bổ sung API start, submit và history; bỏ endpoint/state save hoặc resume.
- Student chỉ làm quiz/problem có quyền truy cập; Teacher chỉ quản lý dữ liệu của mình.
- Không lộ đáp án quiz trước submit hoặc input/output của hidden testcase.
- Submission history chỉ hiển thị cho owner hoặc role có quyền.

### ai_interview

| Database hiện tại | Nghiệp vụ cần hỗ trợ | Cần chỉnh sửa |
| --- | --- | --- |
| `interview_session.status` là boolean | Active, report generating, completed, aborted, failed | Thay boolean bằng lifecycle rõ ràng. |
| Chưa có max question hoặc question count | Tối đa 12 câu, AI có thể kết thúc sớm | Lưu max questions, question count và thời điểm kết thúc. |
| `interview_message.sender` là string tự do | Sender là AI, Student hoặc System | Chuẩn hóa enum hoặc validation sender. |
| `interview_reports.session_id` chưa unique | Một session chỉ có một final report | Thêm unique session/report và report generation idempotent. |
| Report UI có skill score và feedback từng câu | MVP chỉ có final report tổng hợp | Giữ `overall_score`, strengths, weaknesses, suggestions; không lưu feedback theo từng câu hoặc skill score riêng. |

**Cần bổ sung**

- UI interview là voice-first; microphone speech-to-text có text fallback, camera chỉ preview tùy chọn. API chỉ nhận/lưu text của session owner, kết thúc session và xem report.
- End session và report worker phải idempotent để không tạo report thứ hai.
- Không lưu hoặc đánh giá audio/video; không triển khai chatbot UI.

### notification_audit

| Database hiện tại | Nghiệp vụ cần hỗ trợ | Cần chỉnh sửa |
| --- | --- | --- |
| Notification chỉ có sender, user, content, is_read | Payment, teacher/course review, judge, report và payout events | Thêm event type và target/reference để UI điều hướng đúng. |
| Audit action có `SOMETHING`; log chưa có target | Cần audit quyết định admin, webhook, payout và mutation nhạy cảm | Chuẩn hóa action; thêm actor, target type/id, note, time và correlation reference khi cần. |

**Cần bổ sung**

- Notification chỉ hiển thị cho current user.
- Audit log chỉ được đọc theo quyền Admin/service.
- Không ghi CCCD, token, raw secret hoặc payment token vào notification/audit log.

### student_dashboard

| Database hiện tại | Nghiệp vụ cần hỗ trợ | Cần chỉnh sửa |
| --- | --- | --- |
| `user_history.problem_count` chỉ là aggregate cũ | Dashboard cần contribution heatmap, streak, study time, Continue learning và recommended problems | `problem_count` không đủ làm nguồn cho activity/streak/heatmap. |
| Có `problem_tag`, chưa có mapping với problem | Recommendation theo weakest topics | Cần mapping problem-tag. |
| Có enrollment, progress, interview session và submission | Dashboard hiển thị KPI, progress, lịch sử interview | Cần API aggregate chỉ cho current user. |

**Cần bổ sung**

- Chốt definition cho activity day, timezone, streak, study time và problem solved.
- Thêm dữ liệu activity theo ngày và problem-tag mapping trước khi viết API dashboard.
- API dashboard chỉ trả dữ liệu của current authenticated user.


### Các chỉnh sửa đã thực hiện

- Chuẩn hóa `teacher_register.status` từ `AGREE/REJECT/PENDING` thành `DRAFT/PENDING/APPROVED/REJECTED`, đồng thời bổ sung `submitted_at`, quan hệ 1-1 tới `teacher_profile` và history theo transition.
- Chuẩn hóa `student_profile` và `teacher_profile` theo field ownership đã duyệt; `education_entries`/`experience_entries` dùng JSON trong profile, application giữ PII/evidence.
- Bổ sung policy edit: `PENDING` khóa profile/application, `REJECTED` mở sửa/resubmit; `APPROVED` cho sửa `teacher_profile` và chỉ whitelist field application không nhạy cảm.
- Bổ sung `submitted_at`, `reviewed_by`, `reviewed_note` và `reviewed_at` vào `courses`, đồng thời dùng lifecycle `DRAFT/PENDING_REVIEW/APPROVED/REJECTED/ARCHIVED`.
- Chuẩn hóa `courses.thumbnail_url`, `price` decimal và `currency` `USD` hai chữ số thập phân.
- Bổ sung các ràng buộc unique cho thứ tự section/lesson/content, nội dung lesson và progress theo enrollment.
- Giữ `LessonContentType` chỉ gồm `READING`, `QUIZ` và `PROBLEM`; `content_id` tiếp tục là liên kết polymorphic được kiểm tra ở service.
- Mở rộng `lesson_content_progress` với `completed_at` và unique `(enrollment_id, lesson_content_id)`.
- Bổ sung unique `(quiz_id, student_id)` cho `quiz_enrollment`, bảng `quiz_attempt` theo lần bắt đầu và `quiz_submission` terminal unique theo attempt; không có save/resume.
- Bổ sung bảng mapping cho `problem_tag`, đồng thời thêm unique theo cặp problem/tag và problem/language.
- Đổi các trường số tiền trong `transaction` sang `USD` decimal hai chữ số, bỏ liên kết Cart/Order, thêm snapshot, `idempotency_key`, `signature_verified`, `expires_at` và `completed_at`.
- Chuẩn hóa `PaymentMethod` chỉ có `PAYOS`, `PaymentStatus` có `COMPLETED`/`EXPIRED` thay cho `COMPLETE`, và webhook mock có chữ ký test là completion authority.
- Bổ sung unique `(student_id, course_id)` cho `enrollment` để ngăn enrollment trùng.
- Mở rộng `interview_session` từ trạng thái boolean thành lifecycle `ACTIVE/REPORT_GENERATING/COMPLETED/ABORTED/FAILED`, đồng thời thêm `max_questions`, `question_count` và `report_generated_at`.
- Chuẩn hóa `interview_message.sender` thành `AI/STUDENT/SYSTEM`.
- Giữ unique `session_id` cho `interview_reports` để bảo đảm một final aggregate report/session; không lưu `skill_scores` hoặc feedback theo câu.
- Mở rộng `notification` với `type`, `target_type` và `target_id` để hỗ trợ điều hướng theo sự kiện.
- Mở rộng `audit_log` với action chuẩn hóa, `target_type`, `target_id` và `correlation_id`.
- Bổ sung `UNVERIFIED` vào trạng thái tài khoản và chuẩn hóa các enum mới cho payout, quiz attempt, notification và audit.
- Giữ `user_history` như dữ liệu aggregate cũ, không dùng làm nguồn chính cho heatmap, streak và study time.

### Các bảng mới được bổ sung

- `teacher_register_history`: lưu lịch sử submit, review, resubmit và người thực hiện của hồ sơ teacher.
- `course_moderation_review`: lưu lịch sử approve/reject course, ghi chú, reviewer và thời điểm review.
- `problem_tag_mapping`: liên kết nhiều-nhiều giữa problem và problem tag để phục vụ lọc và recommendation.
- `quiz_attempt`: lưu mỗi lần Student bắt đầu Quiz, giới hạn bằng `(quiz_id, student_id, attempt_no)`.
- `course_favorite`: lưu course yêu thích của student.
- `course_review`: lưu rating và nội dung review course của student đã enrollment.
- `wallet`: lưu số dư khả dụng, số dư chờ xử lý và currency của teacher.
- `wallet_ledger`: lưu immutable ledger cho doanh thu, reserve, release và refund.
- `payout_request`: lưu yêu cầu rút tiền, trạng thái xử lý, reviewer và settlement reference.
- `student_daily_activity`: lưu hoạt động hằng ngày, thời gian học, số problem đã giải và dữ liệu contribution dashboard.

### Các vấn đề cần quyết định

`docs/DATABASE.txt` là schema proposal canonical duy nhất. Path lowercase lịch sử `docs/database.txt` đã retired/không tồn tại, không được đồng bộ và không là input migration.

1. Revenue split, payout destination và settlement mechanism chính thức là gì?
2. Activity event, timezone, streak, study time và problem solved cho Student Dashboard được định nghĩa như thế nào?

## 2. FE cần chỉnh sửa

- Đọc xem chỗ nào hợp lý thì làm, chỗ nào không hợp lý thì có thể note lại, sau đó kiểm tra lại. 

### teacher_register

| File | Cần chỉnh sửa |
| --- | --- |
| `STD04TeacherApplication.md` | Hiển thị relation profile/application, draft, submit, reject/resubmit, lịch sử review và trạng thái khóa field. |
| `AD01TeacherRegistrationReview.md` | Hiển thị application status, note, reviewer và history. |
| `AUTH07TeacherRegistration.md` | Đồng bộ JSON education/experience ở profile, PII/evidence ở application và policy editable theo status; không hiển thị capability Teacher khi application chưa approved. |

- **Student tạo profile và một application hiện hành. UI phải tách profile public/professional khỏi application review/PII, khóa đúng field ở `PENDING` và chỉ mở field không nhạy cảm sau `APPROVED`.**

### course_moderation

| File | Cần chỉnh sửa |
| --- | --- |
| `TC11TeacherCourseBuilder.md` | Thêm submit for review, rejected note và resubmit. |
| `AD02CourseApprovalReview.md` | Hiển thị queue, review note, approve/reject và lịch sử review. |
| `TC14CourseApprovalStatus.md` | Hiển thị trạng thái moderation và note theo lifecycle được chốt. |

### catalog_favorite_review

| File | Cần chỉnh sửa |
| --- | --- |
| `COURSE01CourseCatalog.md` | Chỉ hiển thị course public/approved; favorite phải persistent. |
| `COURSE02CourseDetail.md` | Chặn mua lại, review enrolled-only và cho course đã mua truy cập sau archive. |
| `Course04_1CourseDetailCommentTab.md` | Phân biệt course review với comment lesson. |
| `STD03StudentFavorites.md` | Dùng dữ liệu favorite, thêm empty state, remove và undo. |
| `INS01InstructorGrid.md`, `INS02InstructorList.md`, `INS03InstructorDetail.md` | Lấy dữ liệu instructor từ API projection, không dùng dữ liệu course hard-code. |

### payment_enrollment

| File | Cần chỉnh sửa |
| --- | --- |
| `PAY01ShoppingCart.md` | Loại khỏi MVP; không tạo Cart UI thay thế. |
| `PAY02Checkout.md` | Chuyển thành checkout trực tiếp một course; hiển thị USD snapshot, expiry và payment pending. |
| `PAY03PaymentResult.md` | Hiển thị pending, failed, expired, completed và enrollment từ transaction do webhook backend xác nhận. |
| `STD02StudentDashboardEnrolledCourse.md` | Hiển thị course sau payment thành công và progress theo enrollment. |

### wallet_payout

| File | Cần chỉnh sửa |
| --- | --- |
| `TC04TeacherEarning.md` | Dùng dữ liệu wallet/ledger thay vì số tổng không có nguồn. |
| `TC15TeacherWalletPayout.md` | Hiển thị available/pending balance `USD`, payout status, reject/fail và minimum `0.00 USD`; không tự suy ra revenue split. |

### lesson_content_progress

| File | Cần chỉnh sửa |
| --- | --- |
| `LEARNING00UnifiedLessonWorkspace.md` | Chỉ giữ Reading, Quiz, Problem; bỏ Video player/progress. |
| `CLASS01Workspace.md` | Bỏ Video nếu đó là LessonContent; (thảo luận lại nếu như phát sinh mong muốn làm LessonContent ngoài 3 dạng trên) |
| `TC06TeacherLessonContentBuilder.md` | Builder chỉ tạo Reading, Quiz, Problem. |
| `TC12TeacherLessonContentPreview.md` | Preview chỉ hiển thị ba loại LessonContent. |
| `PROG03ProblemVideo.md` | Không dùng làm requirement Video; đổi scope, đổi tên hoặc để out-of-scope sau quyết định owner. |
| `AD02CourseApprovalReview.md` | Bỏ label Video nếu label đang đại diện cho LessonContent. |

### quiz_online_judge

| File | Cần chỉnh sửa |
| --- | --- |
| `QUIZ01QuizAttempt.md` | Hiển thị attempts left, start/submit, passing score và limit state; không có resume/save. |
| `QUIZ02QuizPreview.md` | Hiển thị passing score, max attempts và trạng thái bắt đầu lại từ đầu cho attempt mới. |
| `OJ01ProblemList.md`, `OJ02OnlineJudgeWorkspace.md`, `OJ03SubmissionHistory.md` | Hiển thị đúng hidden testcase policy, submission history và trạng thái result. |
| `PROG01ProblemReading.md`, `PROG02ProblemPreview.md` | Thể hiện Problem completion khi `ACCEPTED` và đạt `problem.passing_score`. |

### ai_interview

| File | Cần chỉnh sửa |
| --- | --- |
| `INTERVIEW01InterviewReport.md` | Hiển thị report generating, one-report rule và final aggregate report; không có skill score/feedback từng câu. |
| `INTERVIEW02AIInterview.md` | Voice-first với speech-to-text, typed fallback, max 12, early finish và end state; không làm chatbot UI. |
| `INTERVIEW03InterviewSetup.md` | Hiển thị topic, level, microphone permission, camera preview-only và thông báo không lưu media. |

- FE chỉnh sửa lại giao diện micro và camera, không làm dạng chatbot. 

### notification_audit

| File | Cần chỉnh sửa |
| --- | --- |
| Các màn hình payment, teacher application, course moderation, OJ, interview và payout | Hiển thị notification đúng event/target; không hiển thị dữ liệu nhạy cảm trong thông báo hoặc lịch sử thao tác. |

### student_dashboard

| File | Cần chỉnh sửa |
| --- | --- |
| `STD01StudentDashboard.md` | Chỉ hiển thị dữ liệu current user; chốt nguồn activity, streak, study time, Continue learning và recommendation trước khi triển khai. |
