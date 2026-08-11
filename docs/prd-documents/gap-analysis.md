# Gap Analysis

Tài liệu trình bày sự khác nhau giữa UI và database hiện tại để tiến hành chỉnh sửa ở FE và BE. 

## 1. Vấn đề database 

### teacher profile  
| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| teacher_register.status | Teacher có thể tiến hành chỉnh sửa và nộp lại (Resubmit) | Không biểu diễn được luồng nộp lại -> Chuyển thành: DRAFT, PENDING, APPROVED, REJECTED |
| teacher personal information | Có thêm một số thông tin cá nhân mới khi submit: full_name, professional_title, phone, address, short_bio, primary_category, years_of_experience, portfolio_link, bank, bank_account, account_holder_name | Database chưa lưu trữ các thông tin này trên giao diện |
| teacher education & expierience | Chưa lưu trữ được thông tin education & expierience |

- Thêm status cho enum TeacherRegisterStatus: DRAFT, PENDING, APPROVED, REJECTED 
- Bổ sung thêm các trường thông tin cá nhân vào teacher_profile:  full_name, professional_title, phone, address, short_bio, primary_category, years_of_experience, portfolio_link, bank, bank_account, account_holder_name
- Bổ sung thêm 2 bảng: `teacher_experiece` và `teacher_education` lưu thông tin kinh nghiệm làm việc và học vấn của teacher. 

### course 

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| course.status có draft, pending, public, archived | Admin có thể từ chối khóa học | Không biểu diễn được luồng resubmit -> Chuyển thành: DRAFT, PENDING, APPROVED, REJECTED |
| submitted course | Biểu diễn thê nhiều trạng thái của course | Không biểu diễn được luồng nộp lại -> Chuyển thành: DRAFT, PENDING, APPROVED, REJECTED|
| Không có submitted_at, reviewed_by, reviewed_note, reviewed_at | Admin dashboard cần thêm các thông tin để biểu diễn lịch sử quyết định | Không có bảng để lưu được lịch sử quyết định của admin đối với course |
| course.rating là một số đơn | Người xem cần một bảng rating để có thể review, đánh giá khóa học | Chưa có bảng course_review để tính rating |
| Không có favorite| Student Favorites UI | Chưa có bảng favorite để lưu trữ khóa học yêu thích của student |

- Chỉnh sửa enum CourseStatus thành các giá trị: DRAFT, PENDING, APPROVED, REJECTED 
- Bổ sung thêm bảng couese_submit để lưu trữ thông tin phê duyệt của admin 
- Bổ sung thêm bảng course_review để ghi nhận review của người dùng về khóa học 
- Bổ sung thêm bảng course_favourite. Học sinh lưu trữ các khóa học yêu thích. 
### Commerce và enrollment

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| transaction gắn trực tiếp user_id/course_id | Cart, Order, OrderItem, Payment Result | Không có lifecycle Cart/Order |
| Không có Cart/CartItem | PAY01 Shopping Cart | Không lưu được cart hiện tại |
| Không có Order/OrderItem | Mỗi order một course, lưu giá tại thời điểm mua | Không có order idempotency và price snapshot |
| amount dùng Float | Thanh toán và chia doanh thu | Có rủi ro sai số tiền |
| enrollment chưa có unique constraint trong model | Không mua lại course đã enrollment | Có thể tạo duplicate enrollment nếu service không chặn |
| Không có trạng thái payment result đầy đủ | Pending/Failed/Expired/Completed UI | Không có lifecycle rõ ràng cho checkout |

- Bổ sung thêm các bảng để hỗ trợ luồng mua bán: cart, cart_item, order, order_item.
- Bổ sung unique vào enrollment, tránh lỗi mua lại khóa học đã mua 
- Bổ sung các PaymentResultStatus: PENDING, FALIED, EXPIRED, COMPLETED 


### Wallet, revenue và payout

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| Không có wallet | Teacher Wallet KPI | Không có available/pending balance |
| Không có ledger | Chia 80% Teacher/20% Platform | Không audit được từng khoản doanh thu |
| Không có payout request | Teacher gửi rút tiền, Admin duyệt | Không có workflow payout |
| Không có minimum payout rule | Tối thiểu 1.000 | Không có constraint nghiệp vụ |

- 
- Đơn vị giá tiền: CAD (Canada Dollar)

### lesson content & progress 

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| Có reading/quiz/problem | Có video | Chưa có lesson content dạng Video |
| lesson.content_id không phải FK | Phải đảm bảo content_id là hợp lệ | Chưa có khóa ngoại để quản lý sự nhất quán của content_id |
| Tiến độ lesson_content là kiểu bool | Video pass 100%, quiz/problem do teacher tự đặt | Không lưu được policy của từng lesson_content |
| Tiến độ lesson_content là kiểu bool | Video pass 100%, quiz/problem do teacher tự đặt | Không lưu được policy của từng lesson_content |

### quiz

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| quiz_submission.answers JSON | QUIZ01 cần attempt number và navigation state | Không có lifecycle attempt rõ ràng |
| quiz.attempts nullable | Teacher đặt số lần làm lại | Chưa có ràng buộc và counter theo Student |
| Không có unique theo quiz/student/attempt | Giới hạn retry | Có thể submit trùng hoặc vượt giới hạn |
| Chưa lưu snapshot đáp án/score policy | Review kết quả ổn định | Thay đổi quiz có thể ảnh hưởng lịch sử |

### online judge 

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| Result detail có status/runtime/memory | UI hiển thị testcase result | Cần output preview an toàn |
| Testcase có input/output file | Hidden testcase không lộ dữ liệu | Cần rule projection/service, không trả raw hidden data |
| testcase chưa có trường is_example | Hiển thị ra các testcase ví dụ | Chưa đánh dấu được testcase nào là testcase mẫu |

### ai interview 
| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| interview_session.status: bool | Active/Completed/Aborted/Failed | Bool không đủ trạng thái |
| Không có question count/max question | Tối đa 12 câu, có thể kết thúc sớm | Không lưu được giới hạn và tiến độ |
| sender: string tự do | AI/Student/System | Dễ phát sinh giá trị không chuẩn |
| Một session có thể có nhiều report | Nghiệp vụ chỉ có một report cuối | Cần unique session/report |
| UI có microphone/camera | Chỉ lưu chat/report, không lưu media | Cần thông báo permission và data policy ở UI |

### notification & audit 

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| Notification chỉ có content/is_read | Payment, Teacher, Course, Judge, AI, Payout events | Không phân loại event |
| Audit action có SOMETHING | Admin review, payout, payment webhook | Không có target actor rõ ràng |
| Audit chỉ có user/action/note | Cần truy vết course/order/payout | Thiếu target type/id |


## Giao diện

### Màn hình mới cần thêm 

| File | Nhóm | Lý do |
| --- | --- | --- |
| STD04TeacherApplication.md | Student (Dashboard) | Hỗ trợ nhaoaj Form đăng ký làm giáo viên: Form TeacherProfile, CCCD, CV, application status, resubmit 
| TC15TeacherWalletPayout.md | Teacher | Balance, 80/20, minimum 1.000 VND, payout request |
| AD02CourseApprovalReview.md | Admin (Dashboard) | Quản lý trạng thái, phê duyệt cho các khóa học |
| PAY03PaymentResult.md | Payment | Completed/Pending/Failed/Expired, enrollment result |
| INTERVIEW03InterviewSetup.md | Interview | Topic, level, max 12, media permission and storage notice |

### File UI hiện tại cần chỉnh sửa

| File | Nội dung cần bổ sung/chỉnh sửa |
| --- | --- |
| COURSE01CourseCatalog.md | Chỉ hiển thị course Published; trạng thái đã enrollment dùng Continue; favorite persistent |
| COURSE02CourseDetail.md | Chặn mua lại; enroll sau payment; archive vẫn truy cập; review chỉ cho enrolled student |
| TC11TeacherCourseBuilder.md | Thêm Submit for review, checklist, rejected note và resubmit |
| TC06TeacherLessonContentBuilder.md | Thêm Video, pass score, max attempts và reorder content |
| QUIZ01QuizAttempt.md | Hiển thị attempts còn lại, pass score, khóa submit khi hết lượt |
| QUIZ02QuizPreview.md | Hiển thị passing score, max attempts và Resume quiz nếu có attempt active |
| PROG02ProblemPreview.md | Hiển thị pass score, Accepted requirement và hidden testcase policy |
| PROG03ProblemVideo.md | Progress watched percent; chỉ completed ở 100% |
| PAY01ShoppingCart.md | Gắn cart với user; chặn course đã enrollment; xử lý empty/expired cart |
| PAY02Checkout.md | Một order một course; PayOS pending/webhook/idempotency; 80/20 ledger |
| INTERVIEW02AIInterview.md | Hiển thị max 12, early finish, microphone/camera permission, không lưu media |
| INTERVIEW01InterviewReport.md | Một report/session, report ready notification, skill scores |
| AD01TeacherRegistrationReview.md | Application status và resubmit history rõ ràng |
| TC04TeacherEarning.md | Liên kết số liệu wallet/ledger; thêm payout entry point |
| STD02StudentDashboardEnrolledCourse.md | Hiển thị payment/enrollment result và progress theo content |
| STD03StudentFavorites.md | Dữ liệu favorite từ course_favorite, empty/remove/undo state |
| Course04_1CourseDetailCommentTab.md | Review/rating course từ course_review, enrolled-only write rule |



---
# Tài liệu tham khảo 

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| teacher_profile.verified: bool | Student tạo profile trước, Admin duyệt sau | Không biểu diễn được Pending/Approved/Rejected |
| teacher_register.status = AGREE/REJECT/PENDING | Teacher có thể bị reject, sửa và resubmit | Enum cũ không thể hiện rõ application lifecycle |
| Không có quyền riêng gắn với trạng thái approval | Teacher chưa approved không được tạo course | Role Teacher đơn thuần là chưa đủ để authorize |
| user.active và account_status cùng tồn tại | UI cần phân biệt account bị ban và account chưa active | Chưa có quy tắc trạng thái rõ ràng |

### 1.2. Course và moderation

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| courses.status có Draft/Pending/Published/Archived | Teacher gửi Admin, Admin approve/reject, Teacher resubmit | Thiếu Rejected và dữ liệu reviewer |
| Không có submitted_at, reviewed_by, reviewed_note, reviewed_at | AD02 cần queue, preview, decision note | Không lưu được lịch sử quyết định |
| course.rating là một số đơn | Course detail/review/favorites | Không có bảng review làm nguồn tính rating |
| Không có favorites | Student Favorites UI | Không thể lưu trạng thái favorite |
| tags là chuỗi | Filter/tag UI | Không có cấu trúc tag/query ổn định |

### 1.3. Commerce và enrollment

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| transaction gắn trực tiếp user_id/course_id | Cart, Order, OrderItem, Payment Result | Không có lifecycle Cart/Order |
| Không có Cart/CartItem | PAY01 Shopping Cart | Không lưu được cart hiện tại |
| Không có Order/OrderItem | Mỗi order một course, lưu giá tại thời điểm mua | Không có order idempotency và price snapshot |
| amount dùng Float | Thanh toán và chia doanh thu | Có rủi ro sai số tiền |
| enrollment chưa có unique constraint trong model | Không mua lại course đã enrollment | Có thể tạo duplicate enrollment nếu service không chặn |
| Không có trạng thái payment result đầy đủ | Pending/Failed/Expired/Completed UI | Không có lifecycle rõ ràng cho checkout |

### 1.4. Wallet, revenue và payout

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| Không có wallet | Teacher Wallet KPI | Không có available/pending balance |
| Không có ledger | Chia 80% Teacher/20% Platform | Không audit được từng khoản doanh thu |
| Không có payout request | Teacher gửi rút tiền, Admin duyệt | Không có workflow payout |
| Không có minimum payout rule | Tối thiểu 1.000 VND | Không có constraint nghiệp vụ |

### 1.5. Lesson content và progress

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| Có Reading/Quiz/Problem, chưa có Video model | Lesson có Reading, Video, Quiz, Problem | Không có thực thể video |
| lesson_content.content_id polymorphic, không có FK | Builder phải bảo đảm content type/id hợp lệ | DB không bảo vệ được liên kết |
| Progress chỉ có completed: bool | Video 100%, Quiz/Problem theo score | Không lưu watched percent/best score |
| Không có pass_score, max_attempts ở content | Teacher cấu hình ngưỡng và retry | Không lưu được policy theo lesson content |
| Không có attempt history content-level | UI cần retry và progress | Không phân biệt lần thử và trạng thái hiện tại |

### 1.6. Quiz

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| quiz_submission.answers JSON | QUIZ01 cần attempt number và navigation state | Không có lifecycle attempt rõ ràng |
| quiz.attempts nullable | Teacher đặt số lần làm lại | Chưa có ràng buộc và counter theo Student |
| Không có unique theo quiz/student/attempt | Giới hạn retry | Có thể submit trùng hoặc vượt giới hạn |
| Chưa lưu snapshot đáp án/score policy | Review kết quả ổn định | Thay đổi quiz có thể ảnh hưởng lịch sử |

### 1.7. Online Judge

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| Đã có Problem, Language, Config, Testcase, Submission, Result Detail | OJ UI cần các thành phần này | Core schema tương đối khớp |
| problem.public: bool | UI cần Public/Private | Nên dùng enum visibility |
| Result detail có status/runtime/memory | UI hiển thị testcase result | Cần output preview an toàn |
| Testcase có input/output file | Hidden testcase không lộ dữ liệu | Cần rule projection/service, không trả raw hidden data |
| user_history.problem_count | Progress theo course content | Không thay thế được lesson content progress |

### 1.8. AI Interview

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| interview_session.status: bool | Active/Completed/Aborted/Failed | Bool không đủ trạng thái |
| Không có question count/max question | Tối đa 12 câu, có thể kết thúc sớm | Không lưu được giới hạn và tiến độ |
| sender: string tự do | AI/Student/System | Dễ phát sinh giá trị không chuẩn |
| Một session có thể có nhiều report | Nghiệp vụ chỉ có một report cuối | Cần unique session/report |
| UI có microphone/camera | Chỉ lưu chat/report, không lưu media | Cần thông báo permission và data policy ở UI |

### 1.9. Notification và audit

| Database cũ | UI/nghiệp vụ mới | Vấn đề |
| --- | --- | --- |
| Notification chỉ có content/is_read | Payment, Teacher, Course, Judge, AI, Payout events | Không phân loại event |
| Audit action có SOMETHING | Admin review, payout, payment webhook | Không có target actor rõ ràng |
| Audit chỉ có user/action/note | Cần truy vết course/order/payout | Thiếu target type/id |

### Chỉnh sửa database 

- Thêm TeacherApplicationStatus: DRAFT, PENDING, APPROVED, REJECTED.
- Mở rộng CourseStatus: thêm REJECTED.
- Thêm LessonContentType.VIDEO.
- Thêm ProgressStatus.
- Thêm OrderStatus, PaymentStatus đầy đủ.
- Thêm WalletEntryType, PayoutStatus (`PENDING`, `APPROVED`, `PROCESSING`, `REJECTED`, `COMPLETED`, `FAILED`).
- Thêm InterviewStatus (`ACTIVE`, `REPORT_GENERATING`, `COMPLETED`, `ABORTED`, `FAILED`) và InterviewMessageSender.
- Thêm NotificationType, ReviewStatus.
- Các enum cũ cần migration dữ liệu và compatibility mapping, không đổi trực tiếp khi chưa có migration plan.

### Bảng mới 

- Commerce: cart, cart_item, order, order_item.
- Finance: wallet, wallet_ledger, payout_request.
- Social commerce: course_favorite, course_review.
- Learning: video_content, quiz_attempt.
- Moderation support: các cột review/approval mới trong teacher_profile, teacher_register, courses.
- Interview support: report unique/session metadata mới.

### 2.4. Quy tắc dữ liệu quan trọng

- Một User có thể có nhiều role.
- TeacherProfile được tạo trước khi Admin approve, nhưng authorization phải chặn chức năng Teacher khi chưa approved.
- Một Order hiện chỉ chứa một course; order_item vẫn lưu price snapshot và giữ khả năng mở rộng.
- Payment webhook phải verify signature và idempotent theo transaction/PayOS code.
- Payment success tạo Enrollment đúng một lần.
- Course đã enrollment không được mua lại nhưng vẫn truy cập sau archive.
- Wallet ledger là immutable; payout tối thiểu 1.000 VND và do Admin duyệt. `REJECTED` là từ chối của Admin; `FAILED` là lỗi settlement sau approve và phải hoàn khoản reserve bằng ledger mới.
- Content polymorphic phải được validate tại service theo content_type/content_id.
- AI session tối đa 12 câu và chỉ có một report cuối. `REPORT_GENERATING` là state hợp lệ khi report chưa sẵn sàng, không phải lỗi UI.

## 3. UI cần bổ sung/chỉnh sửa để đồng bộ



### 3.3. Những UI không cần đổi schema lớn

- OJ01/OJ02/OJ03: core model đã đáp ứng; chỉ cần bổ sung authorization và hidden testcase projection ở service.
- TC03/TC09/TC10: dùng enrollment/progress hiện có sau khi bổ sung progress fields.
- TC08: dùng submission/result detail hiện có.
- Reading UI: dùng reading_content, chỉ cần content progress.
- Footer/header/auth: không có gap database nghiệp vụ mới ngoài role/notification.

## Migration và thứ tự triển khai đề xuất

1. Tạo enum/table mới và các cột nullable tương thích.
2. Backfill teacher/course approval status.
3. Backfill price từ Float sang VND integer/Decimal.
4. Tạo Cart/Order/Transaction idempotency và migrate payment service.
5. Tạo wallet ledger từ transaction đã completed.
6. Migrate quiz submission sang quiz attempt.
7. Migrate interview status/report constraint.
8. Bật unique/validation constraints sau khi dữ liệu sạch.
9. Cập nhật API contract rồi mới bật các UI mới.
10. Thêm integration test cho payment webhook, enrollment duplicate, approval flow, progress completion và payout minimum.
