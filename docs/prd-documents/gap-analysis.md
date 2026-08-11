# Gap Analysis

Các vấn đề liên quan để tang tính đồng bộ của database và UI 

## 1. Các vấn đề liên quan đến Database

### teacher_register

| Database hiện tại | Nghiệp vụ cần hỗ trợ | Cần chỉnh sửa |
| --- | --- | --- |
| `teacher_register.status`: `AGREE`, `REJECT`, `PENDING` | Người dùng lưu nháp, nộp hồ sơ, bị từ chối thì sửa và nộp lại | Chuẩn hóa luồng thành `DRAFT -> PENDING -> APPROVED | REJECTED`; map `AGREE -> APPROVED`, `REJECT -> REJECTED`. |
| `teacher_profile.verified` là boolean | Chỉ Teacher có hồ sơ được duyệt mới được tạo/gửi course | Không dùng role hoặc boolean đơn lẻ để cấp quyền; service phải kiểm tra application `APPROVED`. |
| `teacher_register` mới có motivation, CCCD và file CCCD | Form có thông tin cá nhân, chuyên môn, kinh nghiệm, học vấn, portfolio | Xác định field nào thuộc profile lâu dài, field nào thuộc từng lần đăng ký; bổ sung field/bảng còn thiếu sau khi chốt. |
| Chỉ lưu review hiện tại | Admin cần xem reviewer, note, thời điểm và lịch sử resubmit | Cần lịch sử submit/review hoặc version cho application. |

**Cần bổ sung**

- Chuẩn hóa enum trạng thái application.
- Bổ sung dữ liệu hồ sơ còn thiếu và lịch sử review.
- Tách dữ liệu CCCD/tài liệu nhạy cảm khỏi dữ liệu hiển thị công khai.
- API cần có save draft, update, submit, resubmit, status/history và Admin approve/reject.

### course_moderation

| Database hiện tại | Nghiệp vụ cần hỗ trợ | Cần chỉnh sửa |
| --- | --- | --- |
| `courses.status`: `DRAFT`, `PENDING_REVIEW`, `PUBLISHED`, `ARCHIVED` | Teacher gửi course để Admin review; Admin approve/reject kèm note; Teacher sửa và gửi lại | Thiếu `REJECTED`. Cần chốt tên trạng thái thống nhất giữa review và public course. |
| Không có submitted time, reviewer hoặc review history | Admin cần queue, preview, note và lịch sử quyết định | Thêm các field review hoặc bảng lịch sử moderation. |
| Course chỉ có `teacher_id` | Chỉ Teacher đã được duyệt mới quản lý course của mình | API phải kiểm tra application approved và ownership course. |

**Cần bổ sung**

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

- Thêm bảng favorite theo một tên thống nhất.
- Thêm bảng course review: course, student, rating, nội dung, thời gian.
- Chốt rule một Student được viết một hay nhiều review cho một course.
- API cần có favorite list/add/remove và course review create/update/list; chỉ Student đã enrollment được review.

### cart_payment_enrollment

| Database hiện tại | Nghiệp vụ cần hỗ trợ | Cần chỉnh sửa |
| --- | --- | --- |
| `transaction` gắn trực tiếp user và course | Cart, checkout, payment result | Chưa có cart, order, order item và lifecycle order. |
| `transaction.amount` là `double` | Thanh toán cần giá tại thời điểm mua | Cần kiểu tiền chính xác và price snapshot sau khi chốt currency. |
| Payment status có `COMPLETE`, `PENDING`, `FAILED` | Payment result có pending, failed, expired, completed | Cần thống nhất tên trạng thái và thêm `EXPIRED` nếu được duyệt. |
| `enrollment` chưa có unique constraint rõ ràng | Không mua lại course đã enrollment; payment success chỉ tạo enrollment một lần | Thêm unique `(student_id, course_id)` và idempotency ở service. |
| `transaction_code` và `payos_code` có unique | PayOS webhook có thể gửi lại nhiều lần | Cần verify signature và xử lý webhook lặp an toàn. |

**Cần bổ sung**

- Thêm cart/cart item và order/order item sau khi chốt số course trong một order.
- Lưu price snapshot, expiry và idempotency reference cho payment/order.
- Chuẩn hóa payment status và thêm enrollment unique.
- API cần có cart, checkout, payment status, webhook, Payment Result và tạo enrollment idempotent.
- Payment failed/expired không tạo enrollment.

### wallet_payout

| Database hiện tại | Nghiệp vụ cần hỗ trợ | Cần chỉnh sửa |
| --- | --- | --- |
| Không có wallet hoặc ledger | Teacher xem số dư, doanh thu và lịch sử giao dịch | Cần wallet projection và ledger không sửa trực tiếp. |
| Không lưu revenue split | Teacher nhận 80%, Platform nhận 20% | Cần record từng khoản chia doanh thu theo payment hoàn tất. |
| Không có payout request | Teacher gửi yêu cầu rút tiền; Admin duyệt hoặc từ chối | Cần bảng payout, status, reviewer và settlement reference. |
| Minimum payout và currency chưa thống nhất | UI hiển thị điều kiện tối thiểu để rút | Chỉ thêm validation sau khi chốt currency, amount type và ngưỡng. |

**Cần bổ sung**

- Thêm wallet ledger với nguồn payment/order, loại entry và thời gian.
- Thêm payout request với luồng `PENDING -> APPROVED -> PROCESSING -> COMPLETED | FAILED`; chỉ được reject khi đang `PENDING`.
- Nếu settlement thất bại, hoàn khoản reserve bằng một ledger entry mới.
- API phải giới hạn Teacher vào wallet của mình; chỉ Admin được duyệt payout.

### lesson_content_progress

| Database hiện tại | Nghiệp vụ cần hỗ trợ | Cần chỉnh sửa |
| --- | --- | --- |
| `LessonContentType` đã có `READING`, `QUIZ`, `PROBLEM` | Lesson chỉ dùng ba loại content này | Giữ enum hiện tại; không thêm `VIDEO`, `video_content`, `watched_percent` hoặc video progress. |
| `lesson_content.content_id` là polymorphic, không có foreign key thật | Builder gắn Reading, Quiz hoặc Problem vào lesson | Service phải kiểm tra `content_type` và `content_id` có tồn tại, đúng loại và thuộc course phù hợp. |
| `lesson_content_progress` chỉ có `completed` | UI cần biết completion theo từng loại content | Xác định dữ liệu nào cần lưu, dữ liệu nào tính từ quiz/submission. |

**Rule completion**

- Reading: Student tự đánh dấu hoàn thành sau khi có quyền truy cập content.
- Quiz: hoàn thành khi `score >= quizzes.passing_score` và attempt hợp lệ.
- Problem: hoàn thành khi submission đạt điều kiện Accepted/pass score đã chốt.

**Cần bổ sung**

- API phải validate cặp `(content_type, content_id)`, ownership course và quyền Teacher trước khi gắn content.
- API progress chỉ cho Student đã enrollment; không tạo progress cho content không thuộc course của Student.

### quiz_online_judge

| Database hiện tại | Nghiệp vụ cần hỗ trợ | Cần chỉnh sửa |
| --- | --- | --- |
| `quiz_submission` có score, answers và submitted time | UI cần attempt number, resume, submit, score và history | Chưa có trạng thái attempt đang làm, số thứ tự attempt hoặc snapshot policy. |
| `quizzes.passing_score` và `attempts` đã có | Teacher đặt passing score và số lần làm | API dùng `passing_score`, không hard-code 80%; `attempts_left` tính từ số lần đã dùng. |
| Không có unique theo quiz/student/attempt | Không vượt số lần làm và không submit trùng | Chọn một mô hình: mở rộng `quiz_submission` hoặc thêm `quiz_attempt`. |
| Problem, language, testcase, submission và result detail đã có | List, editor, run, submit, result và history | Core schema cơ bản phù hợp; gap chính là API projection và authorization. |
| Testcase có `is_hidden` | Student xem sample, không xem raw hidden input/output | API chỉ trả status/runtime/memory/score cần thiết cho hidden testcase. |
| Có `problem_tag`, chưa có mapping problem-tag | Dashboard đề xuất problem theo weakest topics | Thêm bảng mapping problem-tag và unique `(problem_id, tag_id)`. |
| Submission có status, score, runtime, memory | Problem trong LessonContent cần cập nhật progress | Cần map submission Accepted về đúng enrollment/lesson content. |

**Cần bổ sung**

- Chốt mô hình quiz attempt rồi bổ sung API start, resume, save, submit và history.
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
| Report UI có skill score và feedback từng câu | Database mới có overall score, strengths, weaknesses, suggestions | Chốt cách lưu hoặc trả projection cho skill score/question feedback. |

**Cần bổ sung**

- API chỉ cho session owner chat, kết thúc session và xem report.
- End session và report worker phải idempotent để không tạo report thứ hai.
- Microphone/camera là permission của phiên phỏng vấn; không lưu recording media.

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

### Các vấn đề cần quyết định

1. Course dùng một enum hay tách trạng thái review khỏi trạng thái public/archive? Tên canonical là `PENDING_REVIEW/PUBLISHED` hay `PENDING/APPROVED`?
2. Currency chính thức là gì? Cần chốt đơn vị lưu trữ, format hiển thị, rounding và minimum payout.
3. Một order chỉ có một course hay checkout nhiều item được phép?
4. Tên bảng favorite dùng `course_favorite` hay `course_favourite`? Student được viết một hay nhiều review cho một course?
5. Field nào thuộc `teacher_profile`, field nào thuộc application và có cần application/review history riêng không?
6. Quiz mở rộng `quiz_submission` hay thêm `quiz_attempt`? Có bắt buộc save/resume không?
7. Problem completion trong lesson chỉ cần Accepted hay có pass score riêng theo lesson content?
8. Skill score và feedback từng câu của AI Interview được lưu thành dữ liệu riêng hay tạo từ report payload?
9. Các route đang ghi `VERIFY` trong wireframe sẽ được xác nhận theo frontend router/backend contract nào?

## 2. FE cần chỉnh sửa

### teacher_register

| File | Cần chỉnh sửa |
| --- | --- |
| `STD04TeacherApplication.md` | Hiển thị draft, submit, reject/resubmit và lịch sử review. |
| `AD01TeacherRegistrationReview.md` | Hiển thị application status, note, reviewer và history. |
| `AUTH07TeacherRegistration.md` | Đồng bộ field form với quyết định field profile/application; không hiển thị capability Teacher khi application chưa approved. |

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

### cart_payment_enrollment

| File | Cần chỉnh sửa |
| --- | --- |
| `PAY01ShoppingCart.md` | Cart thuộc current user; chặn course đã enrollment; thêm empty state. |
| `PAY02Checkout.md` | Đồng bộ số course trong order sau khi có quyết định; hiển thị expiry/payment pending. |
| `PAY03PaymentResult.md` | Hiển thị pending, failed, expired, completed và kết quả enrollment. |
| `STD02StudentDashboardEnrolledCourse.md` | Hiển thị course sau payment thành công và progress theo enrollment. |

### wallet_payout

| File | Cần chỉnh sửa |
| --- | --- |
| `TC04TeacherEarning.md` | Dùng dữ liệu wallet/ledger thay vì số tổng không có nguồn. |
| `TC15TeacherWalletPayout.md` | Hiển thị available/pending balance, payout status, reject/fail và minimum rule sau khi chốt currency. |

### lesson_content_progress

| File | Cần chỉnh sửa |
| --- | --- |
| `LEARNING00UnifiedLessonWorkspace.md` | Chỉ giữ Reading, Quiz, Problem; bỏ Video player/progress. |
| `CLASS01Workspace.md` | Bỏ Video nếu đó là LessonContent; xác định lại scope nếu là media ngoài LessonContent. |
| `TC06TeacherLessonContentBuilder.md` | Builder chỉ tạo Reading, Quiz, Problem. |
| `TC12TeacherLessonContentPreview.md` | Preview chỉ hiển thị ba loại LessonContent. |
| `PROG03ProblemVideo.md` | Không dùng làm requirement Video; đổi scope, đổi tên hoặc để out-of-scope sau quyết định owner. |
| `AD02CourseApprovalReview.md` | Bỏ label Video nếu label đang đại diện cho LessonContent. |

### quiz_online_judge

| File | Cần chỉnh sửa |
| --- | --- |
| `QUIZ01QuizAttempt.md` | Hiển thị attempts left, resume, passing score và limit state. |
| `QUIZ02QuizPreview.md` | Hiển thị passing score, max attempts và Resume khi có attempt active. |
| `OJ01ProblemList.md`, `OJ02OnlineJudgeWorkspace.md`, `OJ03SubmissionHistory.md` | Hiển thị đúng hidden testcase policy, submission history và trạng thái result. |
| `PROG01ProblemReading.md`, `PROG02ProblemPreview.md` | Thể hiện Problem completion và requirement Accepted theo policy đã chốt. |

### ai_interview

| File | Cần chỉnh sửa |
| --- | --- |
| `INTERVIEW01InterviewReport.md` | Hiển thị report generating, one-report rule, skill score và feedback theo dữ liệu API. |
| `INTERVIEW02AIInterview.md` | Hiển thị max 12, early finish, pause/end state và text-only fallback. |
| `INTERVIEW03InterviewSetup.md` | Hiển thị topic, level, permission microphone/camera và thông báo không lưu media. |

### notification_audit

| File | Cần chỉnh sửa |
| --- | --- |
| Các màn hình payment, teacher application, course moderation, OJ, interview và payout | Hiển thị notification đúng event/target; không hiển thị dữ liệu nhạy cảm trong thông báo hoặc lịch sử thao tác. |

### student_dashboard

| File | Cần chỉnh sửa |
| --- | --- |
| `STD01StudentDashboard.md` | Chỉ hiển thị dữ liệu current user; chốt nguồn activity, streak, study time, Continue learning và recommendation trước khi triển khai. |
