# Wireframe Conversion Task Tracker

Phạm vi: chuyển các asset trong `docs/screen` thành UI wireframe Markdown cụ thể trong `docs/ui/wireframes-review`.

## Status

| ID | Task | Phạm vi | Trạng thái | Kết quả |
| --- | --- | --- | --- | --- |
| T01 | Chuẩn hóa inventory và wireframe grammar | 49 asset, quy ước ASCII/Markdown, template file | Done | Quy ước đã ghi trong [wireframe-markdown-conversion.md](../plans/wireframe-markdown-conversion.md) |
| T02 | Chuyển đổi nhóm auth | 7 màn hình trong `screen/auth` | Done | Đã có desktop/mobile wireframe, component map và states |
| T03 | Chuyển đổi nhóm student | 3 màn hình trong `screen/student` + `STD03` cần review | In progress | Chưa hoàn tất |
| T04 | Chuyển đổi nhóm teacher | 13 màn hình trong `screen/teacher` | Todo | Chờ T03 |
| T05 | Chuyển đổi course, instructor và admin | Course, instructor, admin | Todo | Chờ T04 |
| T06 | Chuyển đổi coding/workspace | Online Judge, programming, quiz, class | Todo | Chờ T05 |
| T07 | Chuyển đổi payment và interview | Payment, interview | Todo | Chờ T06 |
| T08 | Review và nghiệm thu | Link, format, mapping, `needs-review` | Todo | Chờ T07 và xác nhận `STD03` |

## Task detail

### T01: Inventory và grammar

- [x] Liệt kê asset theo thư mục.
- [x] Xác định quy tắc tên file và mapping asset/wireframe.
- [x] Định nghĩa canvas desktop/mobile bằng code fence `text`.
- [x] Định nghĩa ký hiệu box, input, button, tab, status và connector.
- [x] Định nghĩa tiêu chí không chấp nhận mô tả tổng quát.

### T02: Auth

- [x] `AUTH01Login`
- [x] `AUTH02Register`
- [x] `AUTH03ForgotPassword`
- [x] `AUTH04SetPassword`
- [x] `AUTH05LockScreen`
- [x] `AUTH06OTP`
- [x] `AUTH07TeacherRegistration`
- [x] Bổ sung states và hành vi chính.

### T03: Student

- [ ] `STD01StudentDashboard`
- [ ] `STD02StudentDashboardEnrolledCourse`
- [ ] `STD03StudentFavorites`
- [ ] Xác định màn hình thật của `needs-review/STD03.svg`.
- [ ] Bổ sung desktop/mobile wireframe, component map và states.

### T04: Teacher

- [ ] `TC01` đến `TC13`.
- [ ] Chuẩn hóa sidebar, topbar, table, builder và progress patterns.
- [ ] Bổ sung responsive reflow cho màn builder/table.

### T05: Course, instructor và admin

- [ ] Course catalog/detail và các tab detail.
- [ ] Instructor grid/list/detail.
- [ ] Admin teacher registration review.
- [ ] Ghi rõ trường hợp SVG/PNG cùng một màn hình.

### T06: Coding/workspace

- [ ] Online Judge: problem list, workspace, submission history.
- [ ] Programming: reading, preview, video.
- [ ] Quiz: attempt, preview.
- [ ] Class workspace.
- [ ] Mô tả editor, toolbar, console, timer và result state bằng khung cụ thể.

### T07: Payment và interview

- [ ] Shopping cart và checkout.
- [ ] AI interview và interview report.
- [ ] Mô tả flow, status, summary và primary action.

### T08: Review và nghiệm thu

- [ ] Kiểm tra đủ mapping cho 49 asset nguồn.
- [ ] Kiểm tra link asset tương đối.
- [ ] Kiểm tra mọi wireframe có desktop/mobile hoặc responsive rule.
- [ ] Kiểm tra không còn placeholder tổng quát như `[main content]` hoặc `[card]` không có chi tiết.
- [ ] Kiểm tra component map và states của từng file.
- [ ] Xử lý hoặc giữ blocker cho `STD03` theo xác nhận của người dùng.
- [ ] Đối chiếu lại Figma node `311:27960` khi MCP khả dụng.

## Definition of done

Một task chỉ được đánh dấu `Done` khi:

1. Tất cả file thuộc phạm vi đã có wireframe bằng ký hiệu Markdown, không chỉ mô tả bằng chữ.
2. Wireframe thể hiện đúng thứ tự và quan hệ bố cục chính của asset.
3. Có component map, states và responsive rule.
4. Asset source link hợp lệ.
5. Các thông tin chưa xác định được đánh dấu `VERIFY` hoặc `BLOCKED`, không tự coi là đã xác nhận.

## Cập nhật gần nhất

- T01 và T02 đã hoàn tất.
- T03 là task đang thực hiện tiếp theo.
- Figma MCP hiện chưa cung cấp node-level context do giới hạn Starter Plan.
