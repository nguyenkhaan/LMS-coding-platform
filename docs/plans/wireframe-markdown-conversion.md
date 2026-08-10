# Kế hoạch chuyển đổi screen sang Markdown UI wireframe

## Task tracker

- [x] Task 1: Chuẩn hóa inventory, quy ước ký hiệu và template wireframe
- [x] Task 2: Chuyển đổi nhóm auth
- [ ] Task 3: Chuyển đổi nhóm student
- [ ] Task 4: Chuyển đổi nhóm teacher
- [ ] Task 5: Chuyển đổi nhóm course, instructor và admin
- [ ] Task 6: Chuyển đổi nhóm online-judge, programming, quiz và class
- [ ] Task 7: Chuyển đổi nhóm payment và interview
- [ ] Task 8: Xử lý needs-review, kiểm tra liên kết và nghiệm thu toàn bộ

Trạng thái lượt hiện tại: đã hoàn tất Task 1 và Task 2; Task 3 (`student`) là batch tiếp theo.

## 1. Mục tiêu

Chuyển toàn bộ asset trong `docs/screen` thành wireframe UI có thể đọc như một bản vẽ giao diện bằng ký hiệu Markdown/ASCII, lưu tương ứng trong `docs/ui/wireframes-review`.

Wireframe sau chuyển đổi phải thể hiện được:

- Khung nhìn và tỷ lệ bố cục chính của màn hình.
- Vị trí tương đối của header, sidebar, content, panel, card, table, form và footer.
- Tên component, nội dung hiển thị chính, action và trạng thái quan trọng.
- Quan hệ giữa các vùng bằng connector hoặc thứ tự thao tác.
- Sự khác nhau giữa desktop và mobile khi bố cục thay đổi.

Không coi các dòng như `[main content]`, `[card]` hoặc `[filters]` là wireframe đạt yêu cầu nếu không có component con, kích thước tương đối, nội dung và vị trí cụ thể.

## 2. Phạm vi

### Asset nguồn

- Thư mục nguồn: `docs/screen`.
- Số lượng hiện tại: 49 asset SVG/PNG.
- Nhóm cần xử lý: `admin`, `auth`, `class`, `course`, `instructor`, `interview`, `online-judge`, `payment`, `programming`, `quiz`, `student`, `teacher`.
- `needs-review/STD03.svg` là ngoại lệ: phải giữ cờ cần xác nhận tên màn hình và route trước khi chốt wireframe.

### Đầu ra

- Một file `.md` cho mỗi màn hình logic.
- Với asset SVG và PNG cùng biểu diễn một màn hình, dùng một wireframe logic và ghi thêm phần đối chiếu raster; chỉ tạo file riêng khi hai asset có bố cục khác nhau.
- Giữ cấu trúc nhóm thư mục tương ứng với `docs/screen`.
- Cập nhật `docs/ui/theme.md` nếu trong quá trình vẽ phát hiện token màu, typography hoặc component mới có bằng chứng từ asset.

### Không thuộc phạm vi

- Không tạo HTML, CSS, React component hoặc prototype chạy được.
- Không sửa nội dung SVG/PNG nguồn.
- Không tự xác nhận route, font hoặc hành vi không thể suy ra từ asset, PRD hoặc Figma.
- Không dùng screenshot nguyên bản thay cho wireframe ký hiệu.

## 3. Định dạng chuẩn của mỗi file

Mỗi file phải có đúng các phần sau:

```markdown
# <Mã màn hình> <Tên màn hình>

- Tên màn hình:
- Đường dẫn:
- Asset nguồn:
- Viewport tham chiếu:
- Mức độ chắc chắn:

## Wireframe

```text
<bản vẽ desktop>
```

## Responsive

```text
<bản vẽ mobile hoặc quy tắc reflow>
```

## Component map

| Vùng | Component | Nội dung | Hành vi |
| --- | --- | --- | --- |

## States

- Default:
- Loading:
- Empty:
- Error:
- Success/Pending:

## Verification notes
```

Các route chưa có bằng chứng phải ghi `VERIFY route`, không được dùng route giả như route chính thức.

## 4. Ngôn ngữ vẽ Markdown bắt buộc

### 4.1. Canvas và vùng layout

- Dùng code fence `text` để giữ monospace và khoảng trắng.
- Dòng đầu ghi viewport, ví dụ `DESKTOP 1440x900` hoặc `MOBILE 390x844`.
- Dùng `+---+`, `|   |`, `+===+` để vẽ khung; không dùng một dòng mô tả thay cho khung.
- Dùng `#` cho vùng nền/header lớn, `=` cho thanh điều hướng hoặc section header, `-` cho divider/list.
- Căn các cột bằng khoảng trắng; mọi thành phần cùng hàng phải nằm trong cùng một hệ cột.

Ví dụ tối thiểu đạt yêu cầu:

```text
DESKTOP 1440x900
+--------+---------------------------------------------------------------+
| SIDEBAR| TOPBAR  Logo   Search [________________]  Bell  Avatar        |
| 240px  +---------------------------------------------------------------+
| [Home] | H1 My Dashboard                         [Create course]      |
| [Course]|---------------------------------------------------------------|
| [Quiz] | [Stat: 12 courses] [Stat: 84% progress] [Stat: 03 pending]  |
|        |                                                               |
|        | CONTINUE LEARNING                                             |
|        | +------------------+ +------------------+ +------------------+|
|        | | thumbnail 16:9   | | thumbnail 16:9   | | thumbnail 16:9   ||
|        | | Course title     | | Course title     | | Course title     ||
|        | | progress ======  | | progress ===     | | progress =====   ||
|        | | [Continue]       | | [Continue]       | | [Continue]       ||
|        | +------------------+ +------------------+ +------------------+|
+--------+---------------------------------------------------------------+
```

### 4.2. Ký hiệu component

- `[Label]` là button, tab, chip hoặc icon action; phải ghi rõ tên action.
- `[________________]` là input; thêm label, placeholder và trạng thái nếu có.
- `+----------------+` là card/panel; phải đặt các field bên trong card.
- `=====` là progress hoặc active indicator; ghi phần trăm nếu asset thể hiện được.
- `(*)` là radio/selected option; `[x]` là checkbox checked.
- `v` là select/dropdown; `...` là overflow action, không dùng để che nội dung quan trọng.
- `A --> B` chỉ dùng cho flow/action, đặt ngay dưới vùng liên quan.
- Icon không được vẽ thành ký tự ngẫu nhiên nếu không có nhãn; dùng `[bell]`, `[search]`, `[edit]` có nghĩa.

### 4.3. Mức độ chi tiết

Mỗi màn hình phải mô tả tối thiểu:

- Header/navigation: logo, nav item hoặc breadcrumb, search/notification/profile nếu nhìn thấy.
- Main title: eyebrow, heading, supporting text và primary action nếu có.
- Tất cả vùng nhìn thấy: card, table, list row, form field, tabs, editor, chart, empty state.
- Một mẫu đầy đủ của từng loại card/row, không chỉ ghi tên loại component.
- Label/nội dung đọc được từ SVG hoặc tên màn hình; text không đọc được ghi `[text unreadable]` và đánh dấu verify.
- Các trạng thái trực tiếp có trong asset như active tab, pending badge, score, progress, error hoặc empty state.

## 5. Quy trình thực hiện theo nhóm

### Bước 1: Inventory và chuẩn hóa mapping

- Đọc kích thước SVG (`width`, `height`, `viewBox`) và kiểm tra PNG dimensions.
- Lập bảng `asset -> wireframe file -> screen code -> inferred route -> certainty`.
- Gộp cặp SVG/PNG cùng màn hình, không làm mất liên kết tới cả hai asset.
- Đưa `STD03` vào danh sách blocker cần user xác nhận.

### Bước 2: Trích xuất cấu trúc hình học

- Xác định canvas, header, sidebar, content column, card grid và footer từ các khối lớn.
- Xác định thứ tự đọc bằng tọa độ và kích thước, không dựa riêng vào tên file.
- Nhận diện lặp lại: button, input, badge, tab, table row, progress bar, code panel.
- Ghi lại màu/font/spacing chỉ khi asset hoặc tài liệu local có bằng chứng.

### Bước 3: Vẽ theo template nhóm

- `auth`: split-screen hoặc centered auth shell, form field theo từng dòng, social/secondary link và validation area.
- `student`: global header, dashboard stats, course/activity grid, progress/favorites/empty state.
- `teacher`: sidebar, topbar, summary, bảng hoặc builder, filter/action bar và save/publish flow.
- `course`: catalog grid, course hero, curriculum sidebar và từng tab detail.
- `admin`: review shell, applicant detail, document checklist và approve/reject actions.
- `online-judge`: problem statement, editor, toolbar, console/test result và submission history.
- `programming`: problem content, difficulty/status, examples, video/preview và navigation.
- `quiz`: timer/progress, question body, answer controls, navigator và submit state.
- `payment`: stepper, cart/order line item, totals, discount/payment action và error state.
- `instructor`: grid/list/detail variants, filter/sort, profile summary và course list.
- `interview`: chat transcript hoặc report score, strengths/weaknesses/suggestions và next action.
- `class`: workspace/editor, participant/activity panel, toolbar và submission/output area.

### Bước 4: Responsive và trạng thái

- Với màn desktop có nhiều cột, vẽ thêm mobile view hoặc quy tắc chuyển cột rõ ràng.
- Mỗi file ghi các state có bằng chứng; nếu chưa có asset state thì ghi `Not represented in source asset`.
- Không invent dữ liệu nghiệp vụ; dùng placeholder có ngữ nghĩa như `[Course title from asset]`.

### Bước 5: Verification

- So sánh từng wireframe với asset ở ba cấp: shell, section order, component detail.
- Kiểm tra mọi asset nguồn có đúng một mapping logic.
- Kiểm tra link asset tương đối không bị hỏng.
- Kiểm tra code fence không lệch cột hoặc mất ký tự do formatter.
- Đánh dấu `PASS`, `NEEDS REVIEW` hoặc `BLOCKED` trong `Verification notes`.

## 6. Thứ tự triển khai

1. `auth`, `student`, `teacher`: tạo và duyệt component grammar chung.
2. `course`, `instructor`, `admin`: áp dụng shell, card, table, tab và detail layout.
3. `online-judge`, `programming`, `quiz`, `class`: áp dụng editor, console, timer và workspace layout.
4. `payment`, `interview`: hoàn thiện flow, status và report-specific layout.
5. `needs-review`: chỉ chốt sau khi xác nhận `STD03`; nếu chưa xác nhận, giữ `BLOCKED`.

## 7. Tiêu chí nghiệm thu

- Có đủ mapping cho 49 asset nguồn; các cặp định dạng được ghi rõ là cùng hoặc khác màn hình.
- Không còn wireframe chỉ gồm các nhãn tổng quát như `[main content]`, `[card]`, `[table]` mà không có nội dung con.
- Mỗi file có tên màn hình, route, asset, desktop wireframe, responsive rule, component map và state notes.
- Wireframe thể hiện được vị trí tương đối và chiều rộng tương đối của các vùng chính.
- Có ít nhất một mẫu row/card/field đầy đủ cho mỗi pattern lặp lại.
- Các màn chưa đủ thông tin được đánh dấu, không tự suy đoán thành yêu cầu đã xác nhận.
- `docs/ui/theme.md` chỉ chứa token có nguồn; mọi suy luận từ code hoặc tên file phải ghi rõ.

## 8. Rủi ro và quyết định cần xác nhận

- Figma MCP đang bị giới hạn Starter Plan nên chưa có node-level design context; khi có quota, ưu tiên đối chiếu node `311:27960` và các frame con.
- Route hiện tại phần lớn là suy luận từ tên asset/PRD; cần xác nhận trước khi coi là API/frontend contract.
- `STD03.svg` chưa có tên màn hình đủ rõ; không được đánh số lại hoặc đổi nhóm nếu chưa có thông tin.
- Nếu Figma và asset local khác nhau, ưu tiên bản Figma mới nhất nhưng phải ghi lại chênh lệch trong `Verification notes`.
