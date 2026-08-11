# Database Proposal - UI/Business/API Mapping

`docs/DATABASE.txt` là schema proposal canonical. `docs/database.txt` được giữ lại như legacy pointer và không phải một schema thứ hai.

Các route chưa có trong `api_spec.md` được ghi `VERIFY`; bảng này chỉ chứng minh consumer từ UI/nghiệp vụ, không tự chốt route implementation.

| Bảng mới | Gap/nghiệp vụ | API consumer | UI consumer |
| --- | --- | --- | --- |
| `teacher_register_history` | Lưu từng lần submit/review và resubmit của teacher application | Teacher application submit/resubmit/history; Admin review (`VERIFY`) | `STD04TeacherApplication.md`, `AD01TeacherRegistrationReview.md`, `AUTH07TeacherRegistration.md` |
| `teacher_education` | Lưu học vấn của teacher profile | Teacher profile/application read/update (`VERIFY`) | `AUTH07TeacherRegistration.md`, `STD04TeacherApplication.md` |
| `teacher_experience` | Lưu kinh nghiệm của teacher profile | Teacher profile/application read/update (`VERIFY`) | `AUTH07TeacherRegistration.md`, `STD04TeacherApplication.md` |
| `course_moderation_review` | Lưu queue decision, note, reviewer và lịch sử course moderation | Course submit/resubmit, Admin approve/reject/history (`VERIFY`) | `TC11TeacherCourseBuilder.md`, `AD02CourseApprovalReview.md`, `TC14CourseApprovalStatus.md` |
| `cart` | Cart hiện tại của Student | Cart list/add/remove (`VERIFY`) | `PAY01ShoppingCart.md` |
| `cart_item` | Course trong cart và unique cart/course | Cart item mutation (`VERIFY`) | `PAY01ShoppingCart.md` |
| `orders` | Order lifecycle, expiry và idempotency | Checkout/order create/status (`VERIFY`) | `PAY02Checkout.md`, `PAY03PaymentResult.md` |
| `order_item` | Price snapshot cho từng course; hỗ trợ mở rộng khi order cardinality được chốt | Checkout/order detail (`VERIFY`) | `PAY02Checkout.md`, `PAY03PaymentResult.md` |
| `course_favorite` | Persistence favorite theo Student/course | Favorite list/add/remove (`VERIFY`) | `COURSE01CourseCatalog.md`, `STD03StudentFavorites.md`, `COURSE02CourseDetail.md` |
| `course_review` | Review/rating course từ Student đã enrollment | Course review list/create/update (`VERIFY`) | `COURSE02CourseDetail.md`, `Course04_1CourseDetailCommentTab.md` |
| `wallet` | Available/pending balance của Teacher | Teacher wallet summary (`VERIFY`) | `TC04TeacherEarning.md`, `TC15TeacherWalletPayout.md` |
| `wallet_ledger` | Immutable revenue split, reserve, release và refund | Wallet ledger/revenue projection (`VERIFY`) | `TC04TeacherEarning.md`, `TC15TeacherWalletPayout.md` |
| `payout_request` | Payout lifecycle, reviewer, settlement và failure reason | Payout create/review/status (`VERIFY`) | `TC15TeacherWalletPayout.md` |
| `problem_tag_mapping` | Quan hệ Problem–Tag cho filter và weakest-topic recommendation | Problem tag/recommendation projection (`VERIFY`) | `OJ01ProblemList.md`, `STD01StudentDashboard.md` |
| `student_daily_activity` | Nguồn contribution, streak, study time và solved count theo ngày | Student dashboard activity projection (`VERIFY`) | `STD01StudentDashboard.md` |

## Các bảng hiện tại được mở rộng

| Bảng | Thay đổi chính | Consumer |
| --- | --- | --- |
| `teacher_register` | Trạng thái mới, submitted time và review metadata | Teacher application/Admin review |
| `teacher_profile` | Field profile chuyên môn và thông tin payout | Teacher application/profile |
| `courses` | Review metadata, price chính xác và status proposal | Course builder/moderation/catalog |
| `lesson_content` | Giữ ba content type và ghi rõ polymorphic service validation | Lesson builder/progress |
| `lesson_content_progress` | Unique theo enrollment/content | Student workspace/progress |
| `quiz_submission` | Attempt number, status, start/submit time | Quiz attempt/preview |
| `transaction` | Payment status, expiry, currency, order link và idempotency | Checkout/PayOS/payment result |
| `enrollment` | Unique Student/course | Payment success/course access |
| `interview_session` | Lifecycle, max/question count và report timestamps | Interview setup/session/report |
| `interview_reports` | One report/session và projection cho score/feedback | Interview report |
| `notification` | Event type và target reference | Notification UI |
| `audit_log` | Action chuẩn hóa, target và correlation | Admin/audit |

## Quyết định giữ mở

- Course status: `APPROVED` hay `PUBLISHED` là tên canonical cho trạng thái public sau review.
- Currency, amount precision, rounding và minimum payout.
- Một order có một course hay nhiều order item.
- Một Student có được viết nhiều review cho cùng course hay không.
- Các route `VERIFY` sẽ được chốt trong phase API sau khi coverage matrix được duyệt.
