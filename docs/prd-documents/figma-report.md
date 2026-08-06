# Figma Report

Tài liệu này dùng để đối chiếu Figma với PRD và database hiện tại.

Quy ước mã màn hình:
- `STD` = màn hình thuộc về Student
- `TC` = màn hình thuộc về Teacher
- `AD` = màn hình thuộc về Admin
- Màn hình tự do / dùng chung = mã theo chức năng, ví dụ `AUTH`, `COURSE`, `CLASS`, `OJ`, `INT`, `PAY`, `SUB`, `QUIZ`, `PROG`, `ORDER`, `NOTIF`

## 1. Các màn hình đã có
Danh sách các màn hình đã có. Hãy đọc ghi chú và verify lại với tình trạng màn hình hiện tại. 
| Mã | Tên màn hình | Mô tả | Ghi chú |
|---|---|---|---|
| `STD-01` | `Student Dashboard` | Trang tổng quan của học viên để theo dõi tiến độ học tập, hoạt động gần đây và các lộ trình học. | Nên gắn với `user`, `student_profile`, `enrollment`, `lesson_content_progress`, `interview_session`. |
| `STD-02` | `Student Dashboard Enrolled Course` | Danh sách các khóa học học viên đã đăng ký hoặc đang học. | Cần thể hiện trạng thái enrolled, progress, continue learning. |
| `STD-03` | `Student Dashboard Profile` | Trang hồ sơ cá nhân của học viên. | Nên map với `user` và `student_profile`. |
| `STD-04` | `Student Problem History` | Lịch sử làm bài và kết quả của học viên. | Nên map với `user_history`, `submission`, `quiz_submission`. |
| `TC-01` | `Teacher Dashboard` | Trang tổng quan của giảng viên. | Nên có revenue, enrolled students, course performance, quick actions. |
| `TC-02` | `Teacher Dashboard Profile` | Hồ sơ giảng viên và thông tin liên quan đến dạy học. | Cần đồng bộ với `teacher_profile`. |
| `TC-03` | `Teacher Dashboard View Students` | Xem chi tiết danh sách học viên đang học theo từng khóa học. Bấm vào Course Card để xem chi tiết danh sách học viên. | Nên thể hiện tiến độ, course, last activity, status. |
| `TC-04` | `Teacher Dashboard Earnings` | Trang thống kê doanh thu và số dư của giảng viên. | Cần mapping rõ với `transaction` và logic chia doanh thu. |
| `TC-05` | `Teacher Course Enrollment` | Danh sách đăng ký khóa học thuộc về giảng viên, kèm trạng thái xử lý. | Phục vụ quản lý enrollment và phê duyệt thông tin học viên trong course. |
| `TC-06` | `Teacher Lesson Content Builder` | Màn hình tạo và chỉnh sửa `lesson_content`. | Nên có 3 template con: reading, quiz, problem. |
| `TC-07` | `Teacher Curriculum Reorder` | Màn hình sắp xếp thứ tự `section`, `lesson`, `lesson_content` trong course. | Cần hỗ trợ reorder và lưu position. |
| `TC-08` | `Teacher Submission Review` | Màn hình xem chi tiết các lần nộp bài problem / quiz. | Cần map với `submission`, `submission_result_detail`, `quiz_submission`. |
| `TC-09` | `Teacher Student Progress` | Màn hình xem tiến độ học tập của một học viên trong một course. | Nên map với `enrollment`, `lesson_content_progress`. |
| `TC-10` | `Teacher Course Students` | Màn hình quản lý danh sách học viên đã đăng ký trong một course. | Phù hợp để xem danh sách enrolled, status, progress. |
| `OJ-01` | `Problem List` | Danh sách bài tập coding / OJ problems. | Nên có filter theo difficulty, public/private, tag, search. |
| `OJ-02` | `Online Judge Workspace` | Không gian làm bài coding trực tuyến. | Đây là flow quan trọng: editor, language, stdin/stdout, submit result. |
| `INT-01` | `AI Interview` | Workspace chat phỏng vấn AI theo lượt. | Nên thể hiện topic, level, current question, chat state. |
| `INT-02` | `Interview Report` | Báo cáo sau buổi phỏng vấn AI. | Nên thể hiện score, strengths, weaknesses, suggestions, transcript. |
| `PAY-01` | `Shopping Checkout` | Màn hình thanh toán khóa học trả phí. | Cần hiển thị QR, countdown, pending/success/failure state. |
| `AUTH-01` | `Teacher Registration` | Form đăng ký trở thành giảng viên. | Cần đủ fields: motivation, CCCD front/back, CV upload. |
| `AD-01` | `Admin Identity Verification` | Màn hình admin duyệt hồ sơ giảng viên. | Cần compare CCCD, OCR/notes, approve/reject flow. |
| `COURSE-01` | `Course Catalog` | Trang danh sách khóa học. | Search, filter tags, price type, pagination, card khóa học, empty state. |
| `COURSE-02` | `Course Detail` | Trang chi tiết một khóa học. | Mô tả khóa học, giảng viên, sections, lessons, CTA mua/enroll, trạng thái khóa học. |

## 2. Các màn hình cần bổ sung để hoàn thiện `prd.md`

| Mã | Tên màn hình | Mô tả | Ghi chú |
|---|---|---|---|
| `AUTH-02` | `Student Registration` | Cho phép học viên tạo tài khoản mới. | Form đăng ký riêng, cần có email/password/confirm password, điều khoản sử dụng, validation lỗi, CTA chuyển sang OTP verification. |
| `AUTH-03` | `OTP Verification` | Xác minh tài khoản sau đăng ký. | Màn nhập OTP hoặc resend OTP, hiển thị trạng thái đếm ngược, lỗi sai mã, xác minh thành công rồi mới vào app. |
| `CLASS-01` | `Classroom Workspace` | Không gian học bài chính. | Screen lõi của hành trình học: sidebar curriculum, header course/lesson, vùng nội dung trung tâm, progress hiện tại, next/prev lesson, trạng thái locked/completed, có thể mở comment hoặc note dưới dạng component. |
| `PROG-01` | `Lesson Content View` | Xem nội dung học theo từng lesson content. | Cần render theo loại content: reading, quiz, problem, media; thể hiện nội dung, trạng thái hoàn thành, CTA tiếp tục bài học và điều hướng sang content kế tiếp. |
| `QUIZ-01` | `Quiz Attempt` | Làm bài quiz trong lớp học. | Nên có phần câu hỏi, options, progress câu hỏi, timer nếu có, submit action, review state sau nộp; kết quả quiz có thể hiển thị ngay trong cùng flow thay vì tách page riêng. |
| `STD-05` | `Student Favorites` | Danh sách nội dung / khóa học học viên đã lưu hoặc yêu thích. | Nên là page riêng theo yêu cầu hiện tại của Figma; cần list card, filter/sort, remove favorite, empty state, và xác nhận lại source data vì DB hiện chưa thấy bảng favorite rõ ràng. |
| `TC-06` | `Teacher Lesson Content Builder` | Tạo và chỉnh sửa `lesson_content`. | Page riêng để teacher soạn nội dung theo template reading / quiz / problem, cấu hình media, nội dung text, thứ tự hiển thị và lưu draft/publish; cần preview nhanh nhưng không thay thế `TC-13`. |
| `TC-11` | `Teacher Course Builder` | Tạo và chỉnh sửa khóa học. | Page chính để quản lý course metadata, thumbnail, price, tags, publish status, section/lesson structure; các thao tác reorder, moderation, enrollment summary nên hiển thị trong builder dưới dạng tabs/panels thay vì tách thêm route. |
| `TC-13` | `Teacher Lesson Content Preview` | Xem trước trải nghiệm học như học viên cho từng lesson content. | Cần tách thành page riêng theo yêu cầu mới: mỗi lesson content được xem như một learning entry point, phải hiển thị đúng layout student-facing, bao gồm reading/quiz/problem state, locked/completed state, và chuyển nội dung kế tiếp. |
| `TC-14` | `Teacher Coding Problem Management` | Quản lý các bài problem đã tạo trong hệ thống. | Page riêng để teacher quản lý problem public/private, level, tags, testcase, input/output config, published status và lịch sử cập nhật; nên có table/list, filter, detail drawer hoặc editor. |
| `AD-02` | `Admin Dashboard` | Trang thống kê tổng quan hệ thống. | Hiển thị KPI tổng quan, pending tasks, user/course/payment/verification summary, shortcut tới các màn moderation. |
| `AD-03` | `Admin Account Management` | Quản lý tài khoản học viên và giảng viên. | Cần table quản lý user, filter theo role/status, search, detail drawer, active/inactive, ban/unban và audit trail. |
| `AD-04` | `Admin Course Management` | Quản lý khóa học trong hệ thống. | Cần danh sách course, trạng thái publish/private, teacher owner, revenue hoặc enrollment summary, action duyệt/ẩn/xóa mềm. |
| `AD-05` | `Admin Teacher Applications` | Quản lý các hồ sơ đăng ký giảng viên. | Cần luồng duyệt hồ sơ: thông tin ứng viên, CCCD front/back, CV, lý do đăng ký, compare notes, approve/reject và ghi chú xử lý. |
| `OJ-03` | `Submission History` | Xem lịch sử nộp bài và chi tiết từng lần nộp. | Nên là page riêng: phần danh sách submission theo problem, filter theo status/language/date, và phần chi tiết gồm source code, runtime, memory, testcase pass/fail, verdict, diff nếu có. |

## 3. Ghi chú đối chiếu với database

| Vấn đề | Nhận xét ngắn |
|---|---|
| Student progress | `STD-01`, `STD-02`, `CLASS-01`, `PROG-01` cần khớp `enrollment` và `lesson_content_progress`; `STD-04` nên là summary card trong dashboard thay vì route riêng nếu chỉ hiển thị lịch sử rút gọn. |
| Favorites / bookmarks | `STD-05` là page riêng theo yêu cầu Figma, nhưng DB hiện chưa thấy bảng favorite/bookmark rõ ràng nên cần xác nhận source of truth trước khi chốt UI chi tiết. |
| Course ownership | `COURSE-01`, `COURSE-02`, `TC-11`, `AD-04` cần map rõ với `course`, `teacher_profile`, `transaction`, `audit_log`. |
| OJ / submission | `OJ-01`, `OJ-02`, `OJ-03` phải khớp `problem`, `submission`, `submission_result_detail`, `testcase`; `OJ-03` cần tách rõ list history và detail view. |
| Quiz flow | `QUIZ-01` cần khớp `quizzes`, `quiz_questions`, `quiz_options`, `quiz_submission`; result state có thể hiển thị ngay trong cùng flow thay vì mở page riêng. |
| Lesson content flow | `PROG-01`, `TC-06`, `TC-13` cần đồng bộ với `lesson`, `lesson_content`, `lesson_content_progress` để đảm bảo teacher và student nhìn cùng một content model. |
| Interview flow | `INT-01`, `INT-02` cần khớp `interview_session`, `interview_message`, `interview_reports`. |
| Admin moderation | `AD-02` đến `AD-05` cần khớp `user`, `teacher_register`, `course`, `audit_log`, `notification`. |

## 4. Kết luận

Nếu dùng PRD làm chuẩn:
- Figma hiện đã có bộ màn hình nền tảng khá đúng hướng.
- Tuy nhiên vẫn cần bổ sung các màn để cover đủ các flow thật của LMS Coding Platform, nhất là progress, lesson content, submission, quiz results, course builder, admin management.
- Cách chia mã theo role `STD` / `TC` / `AD` là hợp lý và nên giữ nhất quán trong toàn bộ report.
