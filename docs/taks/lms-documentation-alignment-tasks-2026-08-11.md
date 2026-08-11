# Task Breakdown: Đồng bộ tài liệu LMS Coding Platform

## Phạm vi

Task list này dùng để chỉnh sửa tài liệu, không triển khai code backend/frontend. Tất cả task phải giữ nguyên thay đổi hiện có của người dùng và chỉ sửa các file nằm trong phạm vi task.

## Quy ước trạng thái

- `TODO`: Chưa thực hiện.
- `IN PROGRESS`: Đang thực hiện.
- `BLOCKED`: Bị chặn bởi open question hoặc thiếu dữ liệu.
- `DONE`: Đã đạt acceptance criteria và verification.

## Đã hoàn thành

### Task 0: Đồng bộ STD01 với SVG Student Dashboard

**Status:** DONE.

**Description:** Wireframe workspace cũ đã được thay bằng dashboard desktop theo `docs/ui/student/studentDashboard.svg`.

**Acceptance criteria:**

- [x] Asset, viewport, heading, profile banner, KPI, heatmap, Continue learning, interview history và recommended problems khớp SVG render.
- [x] Video Player, cohort chat và lesson workspace không còn nằm trong STD01.
- [x] Các business rule không thể suy ra trực tiếp từ SVG được gắn rõ là cần contract/domain definition.

**Verification:**

- [x] Render SVG sau khi thay embedded images bằng placeholder tạm thời để kiểm tra layout.
- [x] Kiểm tra asset path `studentDashboard.svg` tồn tại và wireframe không còn từ khóa workspace/video cũ.

**Dependencies:** None.

**Files likely touched:** `docs/ui/student/STD01StudentDashboard.md`.

**Estimated scope:** S.

## Phase 0: Kiểm kê nguồn

### Task 1: Chụp baseline và xác nhận file trong phạm vi

**Status:** DONE.

**Description:** Ghi nhận trạng thái worktree và danh sách file nguồn trước khi chỉnh tài liệu.

**Acceptance criteria:**

- [x] Xác nhận các file đích là `docs/prd-documents/gap-analysis.md`, `docs/prd-documents/prd.md`, `docs/DATABASE.txt` và `docs/specs/api_spec.md`.
- [x] Ghi nhận `docs/plans/overall-plan.md`, các thay đổi hiện có và các file untracked không được ghi đè ngoài phạm vi.
- [x] Xác nhận `docs/ui/**/*.md` là nguồn wireframe hiện tại.

**Verification:**

- [x] Chạy `git status --short`.
- [x] Chạy `rg --files docs/ui docs/prd-documents docs/specs | sort`.

**Dependencies:** None.

**Files likely touched:** Không sửa file; chỉ đọc `git status` và danh sách tài liệu.

**Estimated scope:** XS.

### Task 2: Lập ma trận nguồn sự thật

**Status:** DONE.

**Description:** Map từng nhóm nghiệp vụ tới wireframe, PRD, schema hiện tại, API spec và tài liệu verify.

**Acceptance criteria:**

- [x] Có mapping cho teacher application, course, catalog/review, commerce, learning, quiz, OJ, interview, notification/audit.
- [x] Mỗi finding có nguồn cụ thể hoặc được đánh dấu `Assumption`.
- [x] Các finding của AI khác được tách khỏi requirement đã xác nhận.

**Verification:**

- [x] Review bảng mapping theo từng module.
- [x] Không có finding quan trọng chỉ dựa trên tên file hoặc suy đoán.

**Dependencies:** Task 1.

**Files likely touched:** `docs/ui/**/*.md`, `docs/prd-documents/prd.md`, `docs/DATABASE.txt`, `docs/specs/api_spec.md`, `docs/specs/verify/*.md`.

**Estimated scope:** M.

### Task 3: Lập conflict register

**Status:** DONE.

**Description:** Ghi lại các điểm mâu thuẫn phải giải quyết trước khi cập nhật tài liệu.

**Acceptance criteria:**

- [x] Có mục cho LessonContent Video.
- [x] Có mục cho course status, teacher status, payment status và currency.
- [x] Có mục cho một order/một course so với checkout nhiều course.
- [x] Có mục cho `PROG03ProblemVideo` và các asset `VERIFY/BLOCKED`.

**Verification:**

- [x] Mỗi conflict có trạng thái `Resolved`, `Open Question` hoặc `Assumption`.
- [x] Không tự chọn giá trị cuối nếu chưa có nguồn xác nhận.

**Dependencies:** Task 2.

**Files likely touched:** File plan; sau đó nội dung tương ứng trong `gap-analysis.md`.

**Estimated scope:** S.

## Phase 1: Kiểm chứng wireframe Markdown

Task numbering `21-23` được giữ nguyên để không làm mất tham chiếu trong kế hoạch cũ. Tuy nhiên, các task này là cổng thực hiện đầu tiên sau Phase 0; không được sửa `gap-analysis.md` trước khi Task 22 hoàn thành.

### Task 21: Lập manifest wireframe và nguồn bằng chứng

**Status:** DONE.

**Description:** Tạo inventory cho toàn bộ file Markdown trong `docs/ui`. Manifest ghi metadata có trong file và phân biệt wireframe màn hình với tài liệu structural; SVG/raster chỉ là nguồn bổ sung, không phải điều kiện để audit wireframe Markdown.

**Acceptance criteria:**

- [x] Mỗi wireframe có một row manifest với đường dẫn file, route, viewport nếu file có khai báo, và loại bằng chứng.
- [x] Màn hình thiết kế bổ sung và tài liệu structural được phân loại để không bị kiểm tra như một SVG screen.
- [x] Manifest nêu rõ SVG/raster thiếu không ngăn việc kiểm tra metadata với wireframe Markdown nội bộ.

**Verification:**

- [x] Kiểm kê `docs/ui/**/*.md` và đọc metadata đầu mỗi file.
- [x] Review manifest để xác định screen, design-only và structural document.

**Dependencies:** Tasks 1-3 and Task 0.

**Files likely touched:** `docs/ui/wireframe-manifest.md`, `docs/ui/verification/wireframe-audit.md`.

**Estimated scope:** M.

### Task 22: Kiểm chứng metadata với wireframe ASCII/Markdown trong cùng file

**Status:** DONE.

**Description:** Đọc wireframe được vẽ bằng ký hiệu Markdown trong từng file, rồi đối chiếu với metadata, component map và states của chính file đó. Đây là kiểm chứng tài liệu nội bộ, không phải đối chiếu pixel với SVG/raster.

**Acceptance criteria:**

- [x] Mỗi file màn hình được kiểm tra mã/tên màn hình, route, viewport nếu có, wireframe, component map và states.
- [x] Mỗi mismatch có evidence trích dẫn section trong cùng file, severity và hướng sửa metadata/wireframe.
- [x] Component map không mô tả vùng không tồn tại trong wireframe trừ khi được ghi rõ là rule hoặc assumption ngoài layout.
- [x] Màn hình thiếu section bắt buộc, metadata hoặc wireframe được ghi finding; không tự điền giá trị chưa có bằng chứng.

**Verification:**

- [x] Review theo checklist: heading/metadata -> khối wireframe Markdown -> component map -> states -> business rules.
- [x] Ghi kết quả vào `docs/ui/verification/wireframe-audit.md`; SVG/raster chỉ được ghi nhận như bằng chứng bổ sung nếu có.

**Dependencies:** Task 21.

**Files likely touched:** `docs/ui/**/*.md`, `docs/ui/verification/wireframe-audit.md`.

**Estimated scope:** M per screen group.

### Task 23: Xác minh semantics UI và business rules

**Status:** TODO.

**Description:** Sau audit metadata, phân biệt thông tin được wireframe thể hiện với state, authorization và business rule cần nguồn PRD/schema/API.

**Acceptance criteria:**

- [ ] Mỗi business rule được nêu trong wireframe có source hoặc nhãn `VERIFY`/`Assumption`.
- [ ] Các màn hình dashboard, payment, moderation, learning, quiz, OJ và interview được kiểm tra theo actor/action/state.
- [ ] STD01 có rule xác nhận cho dashboard ownership, teacher capability, metric, resume learning và recommendation.

**Verification:**

- [ ] Ghi matrix `UI action -> actor -> expected state -> source evidence`.
- [ ] Review các label có thể gây hiểu nhầm, ví dụ `Teacher Dashboard`, `Open`, score ring và contribution heatmap.

**Dependencies:** Task 22.

**Files likely touched:** `docs/ui/verification/wireframe-audit.md`, `docs/prd-documents/gap-analysis.md`.

**Estimated scope:** M per domain group.

## Checkpoint 1: Wireframe Markdown verified

- [x] Task 22 đã hoàn thành với audit report có evidence cho mọi file màn hình.
- [x] Mọi mismatch metadata/wireframe có hướng sửa hoặc open question rõ ràng.
- [x] Chỉ finding đã có evidence trong file Markdown mới được dùng làm input cho gap analysis.

## Phase 2: Gap Analysis

### Task 4: Xác định cấu trúc một section cấp cao

**Status:** DONE.

**Description:** Chuẩn hóa cấu trúc `gap-analysis.md` thành một file có duy nhất `# Gap Analysis`.

**Acceptance criteria:**

- [x] Phần AI tham khảo không còn là section cấp `#` riêng.
- [x] Các nội dung hợp lệ được chuyển vào nhóm nghiệp vụ tương ứng.
- [x] Các nhóm có đủ bảng `Database cũ / UI-nghiệp vụ mới / Vấn đề`.

**Verification:**

- [x] `rg -n '^# ' docs/prd-documents/gap-analysis.md` chỉ trả về một dòng.
- [x] Review headings cấp `##` và `###`.

**Dependencies:** Task 3 and Checkpoint 1.

**Files likely touched:** `docs/prd-documents/gap-analysis.md`.

**Estimated scope:** M.

### Task 5: Viết gap Teacher Registration và Course Moderation

**Status:** DONE.

**Description:** Đối chiếu teacher profile, teacher application, course status, review note và resubmit flow.

**Acceptance criteria:**

- [x] Phân biệt profile, application status và quyền Teacher.
- [x] Mô tả được pending, approved, rejected và resubmit theo dữ liệu đã xác nhận.
- [x] Mô tả được course submission, admin review, review note và lịch sử quyết định.
- [x] Ghi rõ enum/bảng/cột/API/authorization impact.

**Verification:**

- [x] Đối chiếu với `AUTH07TeacherRegistration.md`, `AD01TeacherRegistrationReview.md`, `AD02CourseApprovalReview.md`.
- [x] Đối chiếu với `docs/DATABASE.txt` và API review hiện tại.

**Dependencies:** Task 4.

**Files likely touched:** `docs/prd-documents/gap-analysis.md`.

**Estimated scope:** M.

### Task 6: Viết gap Catalog, Favorite và Review

**Status:** DONE.

**Description:** Phân tích các UI catalog, course detail, favorite, comments/reviews và instructor preview.

**Acceptance criteria:**

- [x] Xác định điều kiện course xuất hiện trong catalog.
- [x] Xác định favorite persistence và unique rule.
- [x] Xác định enrolled-only review và nguồn tính rating.
- [x] Phân biệt comment lesson với review course.

**Verification:**

- [x] Đối chiếu `COURSE01`, `COURSE02`, `Course04_1`, `STD03StudentFavorites`, `INS01-INS03`.
- [x] Mọi endpoint còn thiếu được đưa vào mục API gap.

**Dependencies:** Task 4.

**Files likely touched:** `docs/prd-documents/gap-analysis.md`.

**Estimated scope:** M.

### Task 7: Viết gap Commerce, Payment và Enrollment

**Status:** DONE.

**Description:** Phân tích cart, order, transaction, PayOS, payment result và enrollment idempotency.

**Acceptance criteria:**

- [x] Ghi rõ mâu thuẫn một course/order và nhiều item trong checkout.
- [x] Xác định price snapshot, payment lifecycle, expiry và webhook idempotency.
- [x] Xác định rule không mua lại course đã enrollment.
- [x] Không chốt currency nếu chưa có quyết định.

**Verification:**

- [x] Đối chiếu `PAY01`, `PAY02`, `PAY03`, schema transaction/enrollment và payment API review.
- [x] Tách lỗi wireframe khỏi requirement đã xác nhận.

**Dependencies:** Task 4.

**Files likely touched:** `docs/prd-documents/gap-analysis.md`.

**Estimated scope:** M.

### Task 8: Viết gap LessonContent và Progress không có Video

**Status:** DONE.

**Description:** Viết lại toàn bộ gap learning theo ba loại Reading, Quiz và Problem.

**Acceptance criteria:**

- [x] `LessonContentType` chỉ có Reading, Quiz, Problem.
- [x] Không đề xuất `video_content`, `watched_percent` hoặc video progress.
- [x] Mô tả completion rule cho Reading, Quiz và Problem.
- [x] Ghi rõ giới hạn của `content_id` polymorphic và validation tại service.
- [x] Liệt kê wireframe phải chỉnh do còn mô tả Video.

**Verification:**

- [x] Chạy `rg -n -i 'video|watched_percent|video_content' docs/ui docs/prd-documents/gap-analysis.md`.
- [x] Mỗi kết quả còn lại phải được phân loại là media ngoài LessonContent, open question hoặc cần chỉnh.

**Dependencies:** Task 4.

**Files likely touched:** `docs/prd-documents/gap-analysis.md`.

**Estimated scope:** M.

### Task 9: Viết gap Quiz và Online Judge

**Status:** DONE.

**Description:** Đối chiếu Quiz attempt/retry với Problem submission/result/testcase và lesson progress.

**Acceptance criteria:**

- [x] Mô tả attempt active, resume, submit, score và max attempts.
- [x] Xác định có cần bảng attempt riêng hay mở rộng submission hiện tại.
- [x] Mô tả hidden testcase projection và submission history.
- [x] Xác định rule Problem completion khi dùng trong LessonContent.

**Verification:**

- [x] Đối chiếu `QUIZ01`, `QUIZ02`, `OJ01-OJ03`, `PROG01`, `PROG02` và schema OJ.
- [x] Không biến `PROG03ProblemVideo` thành requirement nếu chưa xác minh.

**Dependencies:** Task 8.

**Files likely touched:** `docs/prd-documents/gap-analysis.md`.

**Estimated scope:** M.

### Task 10: Viết gap Interview, Notification, Audit, UI và migration

**Status:** DONE.

**Description:** Hoàn tất các nhóm còn lại và kết nối gap database với UI, API, authorization và thứ tự migration.

**Acceptance criteria:**

- [x] Interview status boolean, sender, max question và one-report rule được phân tích.
- [x] Notification event và audit target được phân tích.
- [x] Có bảng UI cần thêm/chỉnh sửa theo file cụ thể.
- [x] Có bảng API cần thêm/chỉnh sửa.
- [x] Có validation/authorization và migration order.
- [x] Có assumption/open question ở cuối file.

**Verification:**

- [x] Review toàn bộ `gap-analysis.md` theo checklist Definition of Done trong plan.
- [x] Xác nhận chỉ còn một `#` section.

**Dependencies:** Tasks 5-9.

**Files likely touched:** `docs/prd-documents/gap-analysis.md`.

**Estimated scope:** L, cần chia thành các commit/phiên nhỏ nếu triển khai.

## Checkpoint 2: Gap Analysis

- [x] User flow ban đầu vẫn là luồng chính của tài liệu.
- [x] Finding AI chỉ được giữ khi có bằng chứng hoặc nhãn rõ ràng.
- [x] Không có Video là LessonContent.
- [x] Conflict register đã được cập nhật.
- [ ] Người dùng duyệt các open question ảnh hưởng tới schema.

## Phase 3: PRD

### Task 11: Sửa phạm vi và vai trò trong PRD

**Status:** DONE.

**Description:** Đồng bộ mục tiêu, Student, Teacher và Admin với gap analysis.

**Acceptance criteria:**

- [x] Phạm vi lesson chỉ có Reading, Quiz, Problem.
- [x] Teacher builder không tạo Video.
- [x] Student completion rules không nhắc Video lesson.
- [x] Quyền Teacher phụ thuộc trạng thái application đã được mô tả rõ.

**Verification:**

- [x] `rg -n -i 'video|reading|quiz|problem|teacher|approval' docs/prd-documents/prd.md`.
- [x] So sánh từng kết quả với gap analysis.

**Dependencies:** Task 10.

**Files likely touched:** `docs/prd-documents/prd.md`.

**Estimated scope:** M.

### Task 12: Sửa state machine, functional requirements và non-goals

**Status:** DONE.

**Description:** Đồng bộ các flow course, payment, payout, interview, learning và nguồn sự thật.

**Acceptance criteria:**

- [x] State machine dùng tên đã chốt hoặc gắn open question.
- [x] Payment/enrollment/payout có idempotency và authorization rule.
- [x] FR learning không có Video content.
- [x] Non-goals không mâu thuẫn với tính năng MVP.
- [x] Links tới DB và gap analysis đúng path.

**Verification:**

- [x] Kiểm tra headings và cross-reference.
- [x] Search các enum trong PRD rồi đối chiếu với bảng mapping.

**Dependencies:** Task 11.

**Files likely touched:** `docs/prd-documents/prd.md`.

**Estimated scope:** M.

## Phase 4: Database Proposal

### Task 13: Chuẩn hóa enum trong DATABASE.txt

**Status:** DONE.

**Description:** Cập nhật enum theo state mapping và loại bỏ Video khỏi LessonContent.

**Acceptance criteria:**

- [x] `LessonContentType` chỉ gồm `READING`, `QUIZ`, `PROBLEM`.
- [x] Teacher, course, payment, payout, interview, notification và audit enum thống nhất với PRD.
- [x] Không thêm enum không có nguồn hoặc không được ghi assumption.

**Verification:**

- [x] Liệt kê enum bằng `rg -n '^enum ' docs/DATABASE.txt`.
- [x] So sánh từng enum với `prd.md`, `gap-analysis.md`, `api_spec.md`.

**Dependencies:** Task 12.

**Files likely touched:** `docs/DATABASE.txt`.

**Estimated scope:** M.

### Task 14: Sửa các bảng hiện tại

**Status:** DONE.

**Description:** Cập nhật bảng teacher, course, lesson, progress, quiz, problem, interview, notification, audit, transaction và enrollment.

**Acceptance criteria:**

- [x] Field mới có nguồn từ gap analysis.
- [x] Field không còn sử dụng được đánh dấu loại bỏ hoặc migration note.
- [x] Tiền, timestamp, status và ownership có kiểu phù hợp.
- [x] Polymorphic content được mô tả đúng giới hạn.

**Verification:**

- [x] Review từng bảng theo danh sách schema hiện tại.
- [x] Không còn `VIDEO`, `video_content`, `watched_percent` trong DB proposal.

**Dependencies:** Task 13.

**Files likely touched:** `docs/DATABASE.txt`.

**Estimated scope:** L.

### Task 15: Thêm bảng mới đã được xác minh

**Status:** DONE.

**Description:** Thêm các bảng commerce, finance, favorite, review và attempt khi có yêu cầu hợp lệ.

**Acceptance criteria:**

- [x] Mỗi bảng mới có mục đích và API consumer.
- [x] Có primary key, reference fields và lifecycle status khi cần.
- [x] Không thêm bảng Video.
- [x] Không thêm bảng chỉ vì AI đề xuất nếu không có UI/business/API evidence.

**Verification:**

- [x] Tạo bảng mapping `new table -> gap -> API -> UI` trong `database-ui-business-review.md`.
- [x] Kiểm tra tên bảng nhất quán giữa DB và API consumer mapping.

**Dependencies:** Task 14.

**Files likely touched:** `docs/DATABASE.txt`.

**Estimated scope:** L.

### Task 16: Ghi constraint và xử lý database duplicate

**Status:** DONE.

**Description:** Hoàn thiện comment constraint và quyết định quan hệ giữa `DATABASE.txt` với `database.txt`.

**Acceptance criteria:**

- [x] Unique và not null được ghi bằng comment theo cú pháp hiện tại.
- [x] Có rule cho duplicate enrollment, favorite, review, order/payment idempotency và one-report/session.
- [x] Xác định `docs/DATABASE.txt` là canonical; `docs/database.txt` được giữ như legacy pointer.
- [x] Không xóa file nào nếu chưa được yêu cầu.

**Verification:**

- [x] `diff -u docs/database.txt docs/DATABASE.txt` được review.
- [x] Search `unique`, `not null`, `PK` và `FK` trong schema.

**Dependencies:** Tasks 14-15.

**Files likely touched:** `docs/DATABASE.txt`, có thể `docs/database.txt` nếu quyết định đồng bộ.

**Estimated scope:** M.

## Checkpoint 3: Database Proposal

- [x] DB proposal không chứa Video LessonContent.
- [x] Tất cả bảng mới có consumer hợp lệ.
- [x] Constraint quan trọng đã được ghi bằng comment.
- [ ] Tên enum/table/field khớp gap analysis và PRD.
- [ ] Currency và order cardinality đã được chốt hoặc để open question nhất quán.

## Phase 5: API Contract

### Task 17: Cập nhật Auth, Teacher và Course API

**Status:** `DONE`

**Description:** Cập nhật application, moderation, course catalog, favorite, review và course builder endpoints.

**Acceptance criteria:**

- [x] Có route cho create/update/submit/resubmit teacher application khi cần.
- [x] Admin review có status, note và authorization.
- [x] Course catalog chỉ trả course đủ điều kiện public.
- [x] Favorite/review có ownership, enrollment và duplicate validation.
- [x] Course builder có submit/reject/resubmit contract.

**Verification:**

- [x] Đối chiếu response fields với wireframe.
- [x] Đối chiếu resource với `DATABASE.txt`.

**Dependencies:** Task 16.

**Files likely touched:** `docs/specs/api_spec.md`.

**Estimated scope:** L.

### Task 18: Cập nhật Learning, Quiz và Problem API

**Status:** `DONE`

**Description:** Cập nhật content binding, progress, quiz attempt và OJ submission contract.

**Acceptance criteria:**

- [x] `content_type` chỉ nhận `READING`, `QUIZ`, `PROBLEM`.
- [x] Có validation content type/id và resource ownership.
- [x] Quiz contract có start/resume/save/submit/history nếu được chốt.
- [x] Problem contract có hidden testcase projection và submission history.
- [x] Completion rule khớp PRD và gap analysis.

**Verification:**

- [x] `rg -n -i 'video|VIDEO|video_content' docs/specs/api_spec.md` không còn kết quả thuộc LessonContent.
- [x] Đối chiếu `QUIZ01/02`, `OJ01/02/03`, `PROG01/02`.

**Dependencies:** Task 17.

**Files likely touched:** `docs/specs/api_spec.md`.

**Estimated scope:** L.

### Task 19: Cập nhật Payment, Wallet, Payout, Interview và Notification API

**Status:** `DONE`

**Description:** Hoàn thiện các API có lifecycle và side effect quan trọng.

**Acceptance criteria:**

- [x] Payment create/status/webhook/result có status, expiry, signature verification và idempotency.
- [x] Enrollment chỉ được tạo một lần sau payment success.
- [x] Wallet ledger và payout có role, minimum amount và state transition.
- [x] Interview có max question, end/report generation và one-report rule.
- [x] Notification event response không phụ thuộc field không tồn tại trong DB.

**Verification:**

- [x] Review error cases cho duplicate webhook, expired payment, payout reject/fail và report generating.
- [x] Đối chiếu `PAY01-03`, `TC15`, `INTERVIEW01-03`.

**Dependencies:** Task 18.

**Files likely touched:** `docs/specs/api_spec.md`.

**Estimated scope:** L.

### Task 20: Chuẩn hóa API validation, authorization và error contract

**Status:** `DONE`

**Description:** Bổ sung rule dùng chung cho các endpoint đã cập nhật.

**Acceptance criteria:**

- [x] Mỗi mutation có role và ownership rule.
- [x] Teacher chưa approved không được tạo/publish course.
- [x] Course chưa approved không xuất hiện public catalog.
- [x] Quiz attempts, review, favorite, enrollment và payout có duplicate/limit validation.
- [x] Error response có mã và message đủ để UI xử lý state.

**Verification:**

- [x] Review endpoint matrix `route -> actor -> resource -> validation -> error`.
- [x] Không có endpoint mới thiếu authorization description.

**Dependencies:** Tasks 17-19.

**Files likely touched:** `docs/specs/api_spec.md`.

**Estimated scope:** M.

## Phase 6: Database and business verification

### Task 24: Đối chiếu DATABASE.txt với schema hiện tại

**Description:** So sánh từng enum, bảng, field và constraint trong `docs/DATABASE.txt` với models/migrations hiện tại để phân biệt database cũ, proposal mới và sai lệch tài liệu.

**Acceptance criteria:**

- [ ] Có matrix `documented schema -> current schema -> required change -> migration impact`.
- [ ] Mọi unique/not null/foreign-key ghi bằng comment được kiểm chứng là DB constraint hay chỉ là proposal.
- [ ] `docs/DATABASE.txt` và `docs/database.txt` được so sánh, xác định canonical file mà không xóa file nào.

**Verification:**

- [ ] Đọc migration/model và dùng `diff -u docs/database.txt docs/DATABASE.txt`.
- [ ] Kiểm tra enum/table/field bằng search có line reference trong report.

**Dependencies:** Tasks 13-16 and Checkpoint 3.

**Files likely touched:** `docs/DATABASE.txt`, `docs/specs/verify/database-ui-business-review.md`.

**Estimated scope:** M.

### Task 25: Xác minh database với logic nghiệp vụ và UI

**Description:** Map UI field/action và PRD rule tới database source, relation, lifecycle status, validation và authorization; xác định field/bảng thiếu.

**Acceptance criteria:**

- [ ] Mọi action quan trọng có nguồn dữ liệu hoặc required schema change rõ ràng.
- [ ] Student Dashboard được chốt cần `student_daily_activity` và `problem_tag_mapping`; `user_history.problem_count` không được dùng cho streak/study-time/heatmap.
- [ ] Các gap phải được phân loại thành database change, API projection, service validation hoặc open question.

**Verification:**

- [ ] Tạo matrix `UI -> PRD -> DB table/field -> lifecycle/constraint -> authorization`.
- [ ] Kiểm tra riêng course progress, unique solved problem, AI interview score/status, recommendation topic và teacher application capability.

**Dependencies:** Task 24.

**Files likely touched:** `docs/prd-documents/gap-analysis.md`, `docs/DATABASE.txt`, `docs/specs/verify/database-ui-business-review.md`.

**Estimated scope:** M.

### Task 26: Chốt tài liệu domain Student Dashboard

**Description:** Cập nhật gap analysis, PRD và database proposal cho metric activity theo ngày, Continue learning, interview history và problem recommendation.

**Acceptance criteria:**

- [ ] PRD định nghĩa contribution, streak, study time, timezone, problem solved và recommendation input.
- [ ] Database proposal có `student_daily_activity` và `problem_tag_mapping` cùng comment constraint cần thiết.
- [ ] Gap analysis phân biệt dữ liệu có thể derive với bảng mới bắt buộc và API cần bổ sung sau.

**Verification:**

- [ ] Đối chiếu STD01 với ba tài liệu và không còn metric không có nguồn dữ liệu.
- [ ] Search `user_history`, `problem_tag`, `student_daily_activity`, `problem_tag_mapping` trong documentation set.

**Dependencies:** Task 25.

**Files likely touched:** `docs/prd-documents/gap-analysis.md`, `docs/prd-documents/prd.md`, `docs/DATABASE.txt`.

**Estimated scope:** M.

## Checkpoint 4: Database verified

- [ ] Schema proposal có traceable source từ UI/PRD.
- [ ] Database change, API projection, service validation và open question không bị trộn lẫn.
- [ ] Student Dashboard không còn dependency dữ liệu chưa được ghi nhận.

## Phase 7: API contract coverage

### Task 27: Lập API coverage matrix

**Description:** Liệt kê resource, read model và command cần cho mọi wireframe trước khi sửa `api_spec.md`.

**Acceptance criteria:**

- [ ] Mỗi UI action có route/method hoặc ghi rõ endpoint còn thiếu.
- [ ] Mỗi UI field có response source hoặc ghi rõ projection/aggregate cần bổ sung.
- [ ] Mỗi mutation có validation, authorization, ownership và error case dự kiến.

**Verification:**

- [ ] Tạo matrix `UI -> endpoint -> request/response -> DB -> authorization`.
- [ ] Review coverage theo domain: student, teacher, admin, payment, learning, OJ và interview.

**Dependencies:** Tasks 23 and 26.

**Files likely touched:** `docs/specs/verify/api-ui-coverage.md`, `docs/specs/api_spec.md`.

**Estimated scope:** M.

### Task 28: Bổ sung contract Student Dashboard vào API spec

**Description:** Sau khi Task 27 được duyệt, mô tả `GET /student/dashboard` và các response projection liên quan mà không thay đổi API implementation.

**Acceptance criteria:**

- [ ] Response có profile/capability, KPI, activity series, continue-learning, recent interviews và recommended problems.
- [ ] Contract định nghĩa period/timezone, empty states, pagination/limit và authorization current-user-only.
- [ ] Contract không lộ dữ liệu của user khác và không dựa vào field chưa có trong database proposal.

**Verification:**

- [ ] Đối chiếu response với mọi component của STD01.
- [ ] Đối chiếu source field với Task 26 và error states với wireframe.

**Dependencies:** Task 27 and Checkpoint 4.

**Files likely touched:** `docs/specs/api_spec.md`.

**Estimated scope:** S.

### Task 29: Hoàn thiện API spec cho các domain còn lại

**Description:** Áp dụng coverage matrix vào Auth/Teacher/Course, Learning/Quiz/OJ, Payment/Payout và Interview/Notification.

**Acceptance criteria:**

- [ ] API chỉ dùng enum, table và state đã được chốt trong PRD/DATABASE.txt.
- [ ] Mọi endpoint có request, response, validation, authorization và error contract đủ cho UI.
- [ ] API không có `VIDEO` trong LessonContent payload.

**Verification:**

- [ ] So sánh từng section API với coverage matrix và DB proposal.
- [ ] Chạy keyword/enum audit trên `api_spec.md`.

**Dependencies:** Task 28.

**Files likely touched:** `docs/specs/api_spec.md`.

**Estimated scope:** M per API domain group.

## Phase 8: Final documentation readiness

### Task 30: Kiểm tra thuật ngữ, enum và cross-reference

**Description:** Tìm các từ khóa, enum, table, field, route và link bị lệch giữa documentation set.

**Acceptance criteria:**

- [ ] LessonContent chỉ có `READING`, `QUIZ`, `PROBLEM` trong requirement/schema/API.
- [ ] Không có tên trạng thái, currency, table hoặc field mâu thuẫn mà thiếu mapping/open question.
- [ ] Link asset và document path trong wireframe/PRD/gap/API đều tồn tại.

**Verification:**

- [ ] Chạy keyword audit bằng `rg` và kiểm tra path bằng `test -f`.
- [ ] Review mọi match không chỉ số lượng match.

**Dependencies:** Tasks 24-29.

**Files likely touched:** Toàn bộ documentation set khi phát hiện mismatch.

**Estimated scope:** M.

### Task 31: Review diff và bàn giao

**Description:** Kiểm tra scope thay đổi, trạng thái task, open question và readiness trước khi chuyển sang migration/API/frontend implementation.

**Acceptance criteria:**

- [ ] Chỉ file trong scope hoặc finding có liên quan bị thay đổi; thay đổi người dùng có trước được bảo toàn.
- [ ] Mọi open question còn lại có owner/decision cần thiết.
- [ ] Bộ tài liệu đủ để tạo migration, API implementation và UI implementation mà không cần suy đoán nghiệp vụ.

**Verification:**

- [ ] Chạy `git status --short` và `git diff --check`.
- [ ] Đọc theo dependency order: wireframe audit -> gap -> PRD -> DB -> API coverage/spec.

**Dependencies:** Task 30.

**Files likely touched:** Các file tài liệu trong scope và hai file plan/task nếu cần cập nhật trạng thái.

**Estimated scope:** S.

## Checkpoint 5: Hoàn tất tài liệu

- [ ] Wireframe Markdown có evidence từ asset hoặc blocker rõ ràng.
- [ ] `gap-analysis.md` là nguồn mô tả gap đã xác minh.
- [ ] `prd.md`, `DATABASE.txt` và `api_spec.md` cùng mô tả một nghiệp vụ.
- [ ] Matrix UI-PRD-DB-API hoàn chỉnh và không có gap vô chủ.
- [ ] Sẵn sàng cho migration, API và frontend implementation.

## Các blocker cần người dùng quyết định

- [ ] Chọn canonical Course status.
- [ ] Chọn canonical Teacher application status.
- [ ] Chọn currency lưu trữ và hiển thị.
- [ ] Chọn order một course hay nhiều course.
- [ ] Xác nhận xử lý `PROG03ProblemVideo`.
- [ ] Xác nhận có triển khai payout trong MVP không.
- [ ] Xác nhận có cần lưu Quiz draft attempt không.
- [ ] Chốt activity definition, timezone và study-time measurement cho Student Dashboard.
