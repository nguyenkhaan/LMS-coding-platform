# Wireframe Conversion Task Tracker

Phạm vi: chuyển các asset trong `docs/screen` thành UI wireframe Markdown cụ thể trong `docs/ui`.

## Status

| ID | Task | Phạm vi | Trạng thái | Kết quả |
| --- | --- | --- | --- | --- |
| T01 | Chuẩn hóa inventory và wireframe grammar | 49 asset: 48 asset trong nhóm chính + 1 asset `needs-review` | Done | Đã xác nhận inventory và quy ước wireframe; chưa tạo wireframe |
| T02 | Chuyển đổi nhóm auth | 7 màn hình trong `screen/auth` | Done | Đã tạo lại 7 wireframe chi tiết trong `docs/ui/auth`; `AUTH02` có blocker do asset trùng `AUTH03` |
| T03 | Chuyển đổi nhóm student | 3 màn hình trong `screen/student` + `needs-review/STD03.svg` | Done | Đã tạo 4 wireframe trong `docs/ui/student`; ghi nhận lệch tên `STD01` và `needs-review/STD03.svg` |
| T04 | Chuyển đổi nhóm teacher | 13 màn hình trong `screen/teacher` | Done | Đã tạo 13 wireframe chi tiết trong `docs/ui/teacher` |
| T05 | Chuyển đổi course, instructor và admin | Course, instructor, admin | Done | Đã tạo 10 wireframe trong `docs/ui/course`, `docs/ui/instructor`, `docs/ui/admin`; ghi nhận raster trùng màn hình |
| T06 | Chuyển đổi coding/workspace | Online Judge, programming, quiz, class | Done | Đã tạo 9 wireframe trong `docs/ui/online-judge`, `docs/ui/programming`, `docs/ui/quiz`, `docs/ui/class` |
| T07 | Chuyển đổi payment và interview | Payment, interview | Done | Đã tạo 4 wireframe trong `docs/ui/payment` và `docs/ui/interview`; ghi nhận lỗi XML của PAY01 |
| T08 | Review và nghiệm thu | Link, format, mapping, `needs-review` | Done | Đã kiểm tra 47 wireframe logic, 49 source asset, link/format/section và blocker |

## Task detail

### T01: Inventory và grammar

- [x] Liệt kê 49 asset theo thư mục hiện tại.
- [x] Xác nhận 12 nhóm chính và 1 asset còn ở `needs-review`.
- [x] Xác định mapping `asset nguồn -> file wireframe` trong `docs/ui/<group>/`.
- [x] Định nghĩa canvas desktop/mobile bằng code fence `text`.
- [x] Định nghĩa ký hiệu box, input, button, tab, status và connector.
- [x] Định nghĩa tiêu chí không chấp nhận mô tả tổng quát.
- [x] Xác nhận các wireframe cũ đã được xóa; các task chuyển đổi phải thực hiện lại.

### T02: Auth

- [x] `AUTH01Login`
- [x] `AUTH02Register` (wireframe theo asset thực tế; tên màn hình cần xác nhận)
- [x] `AUTH03ForgotPassword`
- [x] `AUTH04SetPassword`
- [x] `AUTH05LockScreen`
- [x] `AUTH06OTP`
- [x] `AUTH07TeacherRegistration`
- [x] Bổ sung desktop/mobile layout, component map và states.
- [x] Ghi nhận `AUTH02Register.svg` byte-identical với `AUTH03ForgotPassword.svg`.

### T03: Student

- [x] `STD01StudentDashboard` -> render thực tế là màn `Workspace`.
- [x] `STD02StudentDashboardEnrolledCourse`
- [x] `STD03StudentFavorites`
- [x] Xác định màn hình thật của `needs-review/STD03.svg` -> `My Profile`.
- [x] Bổ sung desktop/mobile wireframe, component map và states.
- [ ] Xác nhận route và mã/tên chính thức cho các asset có ghi `VERIFY`.

### T04: Teacher

- [x] `TC01` đến `TC13`.
- [x] Chuẩn hóa sidebar, topbar, table, builder và progress patterns.
- [x] Bổ sung responsive reflow cho màn builder/table.
- [ ] Xác nhận route và permission contract cho các màn Teacher đang ghi `VERIFY`.

### T05: Course, instructor và admin

- [x] Course catalog/detail và các tab detail.
- [x] Instructor grid/list/detail.
- [x] Admin teacher registration review.
- [x] Ghi rõ trường hợp SVG/PNG cùng một màn hình.
- [ ] Xác nhận route và permission contract cho các màn đang ghi `VERIFY`.

### T06: Coding/workspace

- [x] Online Judge: problem list, workspace, submission history.
- [x] Programming: reading, preview, video.
- [x] Quiz: attempt, preview.
- [x] Class workspace.
- [x] Mô tả editor, toolbar, console, timer và result state bằng khung cụ thể.
- [ ] Xác nhận route và permission contract cho các màn đang ghi `VERIFY`.

### T07: Payment và interview

- [x] Shopping cart và checkout.
- [x] AI interview và interview report.
- [x] Mô tả flow, status, summary và primary action.
- [ ] Xác nhận route, payment contract và interview session contract cho các màn đang ghi `VERIFY`.

### T08: Review và nghiệm thu

- [x] Kiểm tra đủ mapping cho 49 asset nguồn: 47 màn hình logic và 2 PNG duplicate.
- [x] Kiểm tra 47 link asset tương đối, không có link hỏng.
- [x] Kiểm tra mọi wireframe có desktop/mobile.
- [x] Kiểm tra placeholder tổng quát; đã sửa `[thumbnail]` thành `[course thumbnail]` trong PAY01.
- [x] Kiểm tra component map và states của từng file.
- [x] Giữ blocker đã xác định cho `AUTH02`, `STD03`, `PAY01` và các route `VERIFY`.
- [ ] Đối chiếu lại Figma node `311:27960` khi MCP khả dụng.

## Definition of done

Một task chỉ được đánh dấu `Done` khi:

1. Tất cả file thuộc phạm vi đã có wireframe bằng ký hiệu Markdown, không chỉ mô tả bằng chữ.
2. Wireframe thể hiện đúng thứ tự và quan hệ bố cục chính của asset.
3. Có component map, states và responsive rule.
4. Asset source link hợp lệ.
5. Các thông tin chưa xác định được đánh dấu `VERIFY` hoặc `BLOCKED`, không tự coi là đã xác nhận.

## Cập nhật gần nhất

- T01 đã hoàn tất.
- T01 và T02 đã hoàn tất.
- T03 đã hoàn tất; các file mới nằm trong `docs/ui/student`.
- T04 đã hoàn tất; 13 file mới nằm trong `docs/ui/teacher`.
- T05 đã hoàn tất; 10 file mới nằm trong `docs/ui/course`, `docs/ui/instructor` và `docs/ui/admin`.
- T06 đã hoàn tất; 9 file mới nằm trong `docs/ui/online-judge`, `docs/ui/programming`, `docs/ui/quiz` và `docs/ui/class`.
- T07 đã hoàn tất; 4 file mới nằm trong `docs/ui/payment` và `docs/ui/interview`.
- T08 đã hoàn tất phần review local: 47 wireframe logic, 49 source asset, 47 link hợp lệ, đủ desktop/mobile/component map/states.
- Hai source PNG `COURSE01CourseCatalog.png` và `INS03InstructorDetail.png` là bản raster duplicate, đã được mapping trong metadata của wireframe SVG tương ứng.
- Các điểm chưa thể nghiệm thu hoàn toàn: route/permission contract chưa có trong repository, Figma MCP chưa khả dụng, `PAY01ShoppingCart.svg` lỗi XML embedded image, `AUTH02Register.svg` trùng byte với `AUTH03ForgotPassword.svg`, và `needs-review/STD03.svg` lệch tên với Favorites.
- `PAY01ShoppingCart.svg` không render được do lỗi XML tại embedded image; đã tạo wireframe từ geometry và đánh dấu `BLOCKED` cho bước visual verification cuối.
- Payment wireframe đã mô tả cart item, quantity, coupon, checkout, billing, payment method và order summary.
- Interview wireframe đã mô tả conversation, progress, timer, pause/end và report score/feedback.
- OJ workspace được mô tả riêng với problem statement, code editor, console, test case và timer.
- Quiz attempt được mô tả riêng với question navigation, radio options, timer, save/submit.
- `COURSE01CourseCatalog.png` và `INS03InstructorDetail.png` được ghi là bản raster đối chiếu, không tạo wireframe trùng SVG.
- `INS03InstructorDetail.svg` không có metadata kích thước hợp lệ; wireframe dùng geometry từ bản render/raster và đánh dấu `VERIFY`.
- `TC13TeacherCodingProblemManagement.svg` dùng shell coding riêng, không gộp vào shell Teacher Dashboard.
- `STD01StudentDashboard.svg` render tiêu đề `Workspace`, nên wireframe được đặt tên hiển thị là `STD01 Student Workspace`.
- `needs-review/STD03.svg` render `My Profile`, khác với `STD03StudentFavorites.svg`; đã tạo `STD03MyProfile.md` riêng và chưa tự di chuyển/đổi tên asset nguồn.
- Route của nhóm Student chưa có app contract trong phạm vi hiện tại, được đánh dấu `VERIFY` trong từng wireframe.
- Các wireframe mới của T02 nằm trong `docs/ui/auth`.
- `AUTH02Register.svg` vẫn là blocker dữ liệu vì render là Forgot Password và trùng SHA-256 với `AUTH03ForgotPassword.svg`.
- `docs/screen/needs-review/STD03.svg` vẫn còn trong inventory hiện tại và cần xử lý ở task phù hợp.
- Figma MCP hiện chưa cung cấp node-level context do giới hạn Starter Plan.
