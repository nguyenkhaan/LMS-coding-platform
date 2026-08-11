# Kế hoạch đồng bộ tài liệu LMS Coding Platform

## 1. Mục tiêu

Đồng bộ bốn tài liệu nghiệp vụ và kỹ thuật sau với các wireframe mới, yêu cầu dự án và nhận xét của AI khác:

- `docs/prd-documents/gap-analysis.md`
- `docs/prd-documents/prd.md`
- `docs/DATABASE.txt`
- `docs/specs/api_spec.md`

Kết quả cuối cùng phải mô tả cùng một luồng nghiệp vụ, không mâu thuẫn về trạng thái, loại dữ liệu, quyền truy cập, payment flow hoặc lesson content.

Phạm vi lần này là chỉnh sửa tài liệu. Không tự động tạo migration, sửa model backend hoặc sửa frontend implementation khi chưa có task riêng được phê duyệt.

## 2. Nguồn thông tin và thứ tự ưu tiên

Khi các tài liệu không thống nhất, sử dụng thứ tự kiểm chứng sau:

1. Yêu cầu mới đã được Product Owner xác nhận trong task hiện tại.
2. Wireframe và business rules trong `docs/ui/**/*.md`.
3. PRD đã được xác nhận trước đó.
4. Schema thực tế trong source code và migration hiện tại.
5. `docs/specs/verify/*.md`.
6. Các đề xuất trong phần AI tham khảo của `gap-analysis.md`.

Nội dung ở mức đề xuất không được chuyển thành yêu cầu chính thức nếu chưa có bằng chứng từ wireframe, PRD, schema hoặc yêu cầu trực tiếp. Những điểm chưa đủ dữ liệu phải ghi vào `Assumption` hoặc `Open Question`.

## 3. Quyết định nghiệp vụ bắt buộc

### 3.1. LessonContent

LessonContent chỉ có ba loại:

- `READING`
- `QUIZ`
- `PROBLEM`

Không thêm hoặc giữ lại như một loại LessonContent:

- `VIDEO`
- `video_content`
- `watched_percent`
- Video completion policy

Các wireframe đang mô tả Video cần được đánh dấu là tài liệu phải chỉnh sửa, gồm `LEARNING00UnifiedLessonWorkspace.md`, `CLASS01Workspace.md`, `TC06TeacherLessonContentBuilder.md`, `TC12TeacherLessonContentPreview.md` và `PROG03ProblemVideo.md`. Không tự xóa file; trước hết xác định file nào cần đổi tên, file nào cần chuyển thành Problem Preview hoặc file nào chỉ là nội dung ngoài phạm vi LessonContent.

### 3.2. Một nguồn tên trạng thái

Gap analysis phải lập bảng mapping giữa tên hiện tại và tên đề xuất trước khi sửa PRD, DB và API. Các cặp đang có nguy cơ mâu thuẫn:

- Teacher application: `AGREE/REJECT/PENDING` so với `DRAFT/PENDING/APPROVED/REJECTED`.
- Course: `PENDING_REVIEW/PUBLISHED` so với `PENDING/APPROVED`.
- Payment: `COMPLETE/COMPLETED`, `FAILED`, `EXPIRED`.
- Currency: wireframe có `$`, payment result có `VND`, PRD có chỗ ghi `CAD`.

Chỉ sau khi mapping được chốt mới dùng tên đó trong `prd.md`, `DATABASE.txt` và `api_spec.md`.

### 3.3. Không suy đoán quan hệ database

`lesson_content.content_id` hiện có tính chất polymorphic. Nếu database không thể tạo foreign key tới nhiều bảng khác nhau, tài liệu phải ghi rõ:

- Database bảo vệ được gì.
- Service phải validate gì.
- Trường hợp content type và content id không khớp được xử lý ra sao.

Không ghi `content_id` là foreign key thật nếu schema không chứng minh được điều đó.

### 3.4. Commerce và checkout

Wireframe `PAY02Checkout.md` đang hiển thị nhiều item, trong khi business rule hiện tại ghi mỗi order chỉ có một course. Đây là open question cần chốt trước khi mô tả `order` và `order_item` trong database/API.

### 3.5. Phạm vi media

Microphone/camera của AI Interview là media permission của phiên phỏng vấn, không phải LessonContent Video. Tài liệu chỉ được ghi nhận việc không lưu media nếu đó là yêu cầu đã xác nhận.

### 3.6. Student Dashboard

SVG `docs/ui/student/studentDashboard.svg` đã được đối chiếu và wireframe `STD01StudentDashboard.md` đã được cập nhật thành dashboard desktop. Đây không phải lesson workspace và không có Video Player hoặc cohort chat.

Các quyết định đã xác nhận cho dashboard:

- Dashboard hiển thị profile, quyền Become a Teacher/Teacher Dashboard, KPI học tập, contribution heatmap, Continue learning, AI Interview History và Recommended problems của current user.
- Thêm dữ liệu activity theo ngày để làm nguồn cho streak, study time và heatmap; `user_history.problem_count` chỉ là aggregate cũ, không thể là nguồn cho ba component này.
- Thêm mapping Problem-Tag để tính weakest topics. Không lưu acceptance rate như field nguồn; API có thể trả projection được tính từ submission.
- API contract cho dashboard được cập nhật ở phase API, sau khi gap analysis, PRD và database proposal đã chốt.

Các định nghĩa vẫn phải được ghi rõ trong PRD/API: activity nào tạo contribution, timezone của activity day, cách cộng study time và điều kiện problem được tính là solved.

## 4. Dependency graph

```text
SVG/raster asset -> Wireframe Markdown -> business rules
                    |                    |
                    +---------+----------+
                              v
                    Gap analysis đã xác minh
                       /          |          \
                      v           v           v
                    PRD      DATABASE.txt   API spec
                      \          |          /
                       \         v         /
                  Verification matrix UI-DB-API
```

Thứ tự thực hiện bắt buộc là:

1. Kiểm kê nguồn và lập conflict register.
2. Kiểm chứng metadata của từng file wireframe với wireframe ASCII/Markdown nằm trong chính file đó.
3. Chốt các quyết định ảnh hưởng nhiều tài liệu từ finding đã được kiểm chứng.
4. Viết lại gap analysis.
5. Cập nhật PRD.
6. Cập nhật database proposal.
7. Cập nhật API contract.
8. Kiểm tra chéo và nghiệm thu.

## 5. Kế hoạch theo phase

### Phase 0: Chuẩn bị và kiểm kê

- Lập danh sách wireframe liên quan đến course, lesson, quiz, problem, payment, teacher và admin.
- Lập manifest cho mọi wireframe: asset nguồn, route, viewport, loại asset và mức độ chắc chắn.
- Đối chiếu từng business rule trong wireframe với schema hiện tại.
- Đọc các tài liệu verify API để phân biệt finding đã xác minh và đề xuất chưa xác minh.
- Ghi lại các xung đột vào conflict register, không giải quyết âm thầm.
- Bảo toàn các thay đổi hiện có trong worktree.

Output cua phase la [Phase 0 baseline](../prd-documents/phase0-specification-baseline.md), [wireframe asset manifest](../ui/wireframe-manifest.md), ma tran nguon su that va danh sach open question.

### Phase 1: Kiểm chứng wireframe Markdown

- Đối chiếu metadata của **từng file màn hình** với wireframe ASCII/Markdown được vẽ ngay trong file đó; đây là nguồn bắt buộc của phase này.
- Kiểm tra mã màn hình, tiêu đề, actor, route, viewport (nếu có), layout regions, component map, states và business rules có cùng ngữ cảnh với wireframe hay không.
- Với rule không thể nhìn thấy trực tiếp từ wireframe, kiểm tra nhãn provenance (`VERIFY`, `Assumption`, hoặc nguồn PRD/schema/API); không coi phần mô tả là requirement đã xác nhận nếu không có nhãn hoặc nguồn.
- Ghi mọi mismatch vào [wireframe audit](../ui/verification/wireframe-audit.md), gồm evidence trong Markdown, mức độ ảnh hưởng và hướng xử lý.
- SVG/raster/Figma chỉ là bằng chứng bổ sung cho visual-pixel audit. Việc thiếu các asset này không được chặn audit metadata-to-wireframe-Markdown.
- Sửa metadata hoặc mô tả wireframe ngay khi có mâu thuẫn rõ ràng; nếu chưa biết giá trị đúng, giữ `VERIFY` và ghi open question thay vì suy đoán.

Output của phase là wireframe audit đã xác định rõ metadata nào phù hợp, metadata nào cần sửa và finding nào được phép làm input cho gap analysis.

### Checkpoint 1: Wireframe Markdown verified

Chỉ được bắt đầu chỉnh sửa `gap-analysis.md` khi kiểm tra được:

- Mỗi file màn hình có đủ metadata tối thiểu hoặc có finding nêu rõ phần thiếu.
- Metadata không mâu thuẫn với wireframe Markdown trong cùng file, hoặc mismatch đã có owner/hướng sửa.
- Component map và states bám vào vùng/hành vi được vẽ; business rule ngoài wireframe được gắn nguồn hoặc nhãn `VERIFY`/`Assumption`.
- Wireframe audit đã tách finding có evidence ra khỏi open question, để gap analysis không phải suy đoán.

### Phase 2: Viết lại `gap-analysis.md`

- Giữ đúng luồng bảng do người dùng viết: `Database cũ / UI-nghiệp vụ mới / Vấn đề`.
- Gộp các finding hợp lệ từ phần AI tham khảo vào đúng nhóm nghiệp vụ.
- Xóa section cấp một riêng của AI tham khảo để file chỉ có một `# Gap Analysis`.
- Tách rõ enum, bảng, API, validation/authorization và UI impact.
- Ghi trạng thái xác minh cho từng đề xuất.
- Loại bỏ toàn bộ đề xuất Video khỏi LessonContent.
- Bổ sung migration order và acceptance criteria cho từng nhóm gap.

Output của phase là gap analysis có thể dùng làm đầu vào trực tiếp cho PRD, DB và API.

### Checkpoint 2: Duyệt gap analysis

Chỉ chuyển sang PRD khi kiểm tra được:

- Không còn `# Tài liệu tham khảo` hoặc section cấp một thứ hai.
- LessonContent chỉ còn Reading, Quiz, Problem.
- Mọi trạng thái và currency conflict đã được chốt hoặc ghi Open Question.
- Mọi yêu cầu mới đều có nguồn hoặc được đánh dấu assumption.

### Phase 3: Rà soát `prd.md`

- Sửa mục tiêu, vai trò và flow học tập.
- Sửa trạng thái teacher, course, payment, payout và interview theo gap analysis.
- Loại bỏ Video khỏi phạm vi LessonContent, progress rule và functional requirements.
- Giữ riêng các yêu cầu media của AI Interview nếu còn được xác nhận.
- Đồng bộ thuật ngữ với database proposal và API contract dự kiến.
- Sửa phần ngoài phạm vi để không mâu thuẫn với các tính năng đang được đưa vào MVP.

### Phase 4: Rà soát `DATABASE.txt`

- Chuẩn hóa enum trước.
- Sửa các bảng hiện tại trước khi thêm bảng mới.
- Thêm bảng chỉ khi có UI/business rule/API cần sử dụng.
- Ghi `unique` và `not null` bằng comment theo cú pháp file hiện tại.
- Không tạo Video table hoặc Video enum.
- Chốt cách lưu tiền, snapshot giá, idempotency và timestamp.
- Chốt các quan hệ có thể dùng foreign key thật và các quan hệ phải validate ở service.
- Bổ sung `student_daily_activity` cho contribution/streak/study time và `problem_tag_mapping` cho recommendation theo weakest topic.
- Đối chiếu `docs/DATABASE.txt` với `docs/database.txt` để tránh hai schema chuẩn cùng tồn tại mà khác nhau.

### Checkpoint 3: Duyệt schema đề xuất

- Mọi enum trong PRD đều có trong DB hoặc được ghi là application-level constant.
- Mọi bảng/API resource quan trọng đều có bảng tương ứng.
- Không có trường Video lesson.
- Constraint quan trọng đã được ghi bằng comment.
- Không còn tên bảng hoặc field sai chính tả chưa được quyết định.

### Phase 5: Rà soát `api_spec.md`

- Cập nhật endpoint theo schema mới.
- Bổ sung request/response cho các UI mới.
- Bổ sung validation, authorization, ownership và error response.
- Bổ sung payment webhook signature verification và idempotency.
- Bổ sung rule retry/pass score cho Quiz và Problem.
- Bổ sung `GET /student/dashboard` sau khi schema dashboard chốt: profile/capability, KPI, activity series, continue learning, interview history và recommended problems.
- Loại bỏ `VIDEO` khỏi mọi `content_type` và payload.
- Đánh dấu route `VERIFY` khi route chưa được xác nhận từ code hoặc yêu cầu.

### Phase 6: Kiểm tra chéo và nghiệm thu

- Audit metadata với wireframe ASCII/Markdown tương ứng trước; SVG/raster/Figma chỉ dùng cho visual-pixel audit bổ sung khi asset có mặt.
- Lập matrix `UI field/action -> PRD rule -> DB source -> API response/command -> authorization`.
- So sánh `DATABASE.txt` với schema/migration hiện tại và với logic business/UI; phân loại mỗi difference là existing, required change, assumption hoặc open question.
- Kiểm tra API spec bao phủ đầy đủ resource, query, command, error, validation và authorization cần để render/tương tác UI.
- Tìm toàn bộ thuật ngữ mâu thuẫn bằng `rg`, review diff và chỉ bàn giao khi matrix không còn ô thiếu chưa được gắn nhãn.

## 6. Chiến lược cập nhật theo vertical slice

Sau khi contract nền tảng được chốt, việc triển khai thực tế nên đi theo các vertical slice sau, thay vì sửa toàn bộ database rồi mới sửa API:

1. Teacher application và course moderation.
2. Course catalog, favorite và review.
3. Cart/order/payment/enrollment.
4. Lesson Reading/Quiz/Problem và progress.
5. Quiz attempt và Problem submission.
6. Wallet/ledger/payout.
7. AI interview/report/notification.
8. Student dashboard/activity/recommendation.

Mỗi slice cần có schema, API, UI rule, validation và test riêng. Phần này là định hướng cho task implementation tiếp theo, không mở rộng phạm vi chỉnh sửa tài liệu hiện tại.

## 7. Rủi ro và biện pháp giảm thiểu

| Rủi ro | Mức độ | Biện pháp |
|---|---|---|
| Wireframe và business rule checkout khác nhau | Cao | Đưa vào open question, không chốt order cardinality ngầm |
| Tên trạng thái khác nhau giữa PRD, DB và API | Cao | Lập mapping table trước khi sửa ba tài liệu |
| Video còn sót trong wireframe hoặc PRD | Cao | Chạy keyword audit cho `Video`, `VIDEO`, `video_content`, `watched_percent` |
| `docs/DATABASE.txt` và `docs/database.txt` bị lệch | Trung bình | Chọn file canonical và ghi rõ trạng thái file còn lại |
| Đề xuất của AI bị coi là requirement | Cao | Mỗi finding phải có source hoặc nhãn assumption |
| Polymorphic content bị mô tả sai là foreign key | Cao | Ghi rõ service validation và giới hạn của DB constraint |
| Currency `$`, VND và CAD không thống nhất | Cao | Chốt một đơn vị lưu trữ và một format hiển thị trước khi viết API |
| Asset UI bị `VERIFY` hoặc `BLOCKED` | Trung bình | Không suy ra route/geometry; giữ trong open question |
| Wireframe Markdown lệch SVG/raster đã cập nhật | Cao | Dùng manifest và audit render theo từng file, ghi evidence và mức độ chắc chắn |
| Dashboard metric không có định nghĩa domain | Cao | Chốt activity event, timezone, period và rule solved trước khi thiết kế DB/API |
| Recommendation không có relation Problem-Tag | Cao | Thêm mapping có constraint unique; chỉ mô tả thuật toán sau khi có dữ liệu đầu vào |

## 8. Definition of Done

- [ ] Có đúng một section cấp `#` trong `gap-analysis.md`.
- [ ] Gap analysis giữ cấu trúc và luồng do người dùng viết.
- [ ] Không còn Video là một loại LessonContent.
- [ ] PRD, DB và API dùng cùng tên enum và trạng thái.
- [ ] Database proposal dùng đúng cú pháp hiện tại và ghi constraint bằng comment.
- [ ] API spec mô tả request, response, validation và authorization cho các flow chính.
- [ ] Mỗi wireframe có asset path, viewport, component/state/business-rule description đã được xác minh hoặc gắn `VERIFY`/`BLOCKED`.
- [ ] Matrix UI-PRD-DB-API không còn field/action thiếu nguồn hoặc thiếu contract mà không có open question.
- [ ] Student Dashboard có định nghĩa metric, nguồn DB và API contract rõ ràng.
- [ ] Mọi assumption/open question được ghi rõ, không trình bày như dữ liệu đã xác nhận.
- [ ] Kiểm tra chéo bằng search và review diff hoàn tất.

## 9. Open Questions cần xác nhận

- Course status chuẩn là `PENDING_REVIEW/PUBLISHED` hay `PENDING/APPROVED`?
- Teacher application có cần lưu `DRAFT` trước khi submit không?
- Checkout MVP chứa một course hay nhiều course?
- Đơn vị tiền chuẩn là VND hay CAD? Ký hiệu `$` trong wireframe biểu thị gì?
- `PROG03ProblemVideo` là màn hình cần loại bỏ, đổi tên hay là nội dung không thuộc LessonContent?
- Review course có cần moderation status hay được publish ngay sau khi submit?
- Payout có thực sự thuộc MVP và có cần `PROCESSING/FAILED` không?
- Có cần lưu attempt đang dang dở của Quiz hay chỉ lưu submission sau khi nộp?
- `docs/database.txt` có phải bản legacy cần đồng bộ cùng `docs/DATABASE.txt` không?
- Activity nào tạo contribution: completed Reading, passed Quiz, accepted Problem, thời gian active hay tổ hợp các event này?
- Timezone nào dùng để chốt `activity_date`, streak và hiển thị heatmap?
- Study time được đo bằng timer client đã xác thực, heartbeat server hay session duration?
