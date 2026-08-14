# Kế hoạch triển khai tổng thể - LMS Coding Platform

## 1. Mục đích

Tài liệu này là kế hoạch triển khai mới cho LMS Coding Platform, được xây dựng theo nghiệp vụ trong `docs/prd-documents/prd.md`, khoảng cách hiện trạng trong `docs/prd-documents/gap-analysis.md`, schema đề xuất trong `docs/DATABASE.txt` và contract trong `docs/specs/api_spec.md`.

Kế hoạch được sắp xếp theo quan hệ phụ thuộc và theo lát cắt nghiệp vụ. Mỗi giai đoạn phải tạo ra một luồng có thể kiểm thử, thay vì triển khai toàn bộ database, toàn bộ API rồi mới kết nối frontend ở cuối dự án.

Ký hiệu đội phụ trách:

- `[BE]`: Backend, bao gồm Auth Provider, Business Application, Judge Service, database, worker và hạ tầng backend.
- `[FE]`: Frontend React, tích hợp API, giao diện, trạng thái tương tác và kiểm thử frontend.

## 2. Nguyên tắc triển khai bắt buộc

- `docs/DATABASE.txt` là schema proposal canonical; model và Alembic migration trong source mới phản ánh database hiện tại.
- API và UI không được sử dụng enum, field hoặc bảng mới trước khi migration và contract tương ứng được duyệt.
- `LessonContent` trong MVP chỉ gồm `READING`, `QUIZ`, `PROBLEM`. Không xây dựng Video content, video progress hoặc HLS transcoder.
- AI Interview là voice-first: client chuyển microphone sang text để người học xem/sửa, có typed fallback; camera chỉ preview tùy chọn. Backend chỉ lưu text và report tổng hợp, không lưu audio/video recording hay feedback từng câu.
- Quyền Teacher chỉ có hiệu lực khi teacher application ở trạng thái `APPROVED`; `teacher_profile` không tự cấp capability.
- Mọi query dữ liệu cá nhân phải lọc theo current user hoặc resource ownership ở phía server.
- Payment webhook, enrollment, quiz submit, judge result, interview report và payout settlement phải idempotent.
- Dữ liệu tiền dùng `decimal`/`numeric` hai chữ số thập phân với currency cố định `USD`; không dùng `float` cho persistence.
- Checkout trực tiếp chỉ tạo transaction cho một course. Có thể có nhiều lịch sử transaction, nhưng service chỉ cho tối đa một `PENDING` chưa hết hạn cho mỗi `(student_id, course_id)`.
- Hidden testcase, đáp án quiz, CCCD, token, secret và payment payload nhạy cảm không được trả sai đối tượng hoặc ghi vào log.
- Mỗi task chỉ được coi là hoàn thành khi đầu ra, migration/test liên quan và tài liệu contract đã đồng bộ.

## 3. Thứ tự và quan hệ phụ thuộc

```text
Phase 0: Chốt quyết định và contract
    -> Phase 1: Nền tảng, Auth, Notification/Audit foundation và khung FE
        -> Phase 2: Profile và Teacher Application
        -> Phase 3: Course, Catalog và Moderation
            -> Phase 4: Checkout trực tiếp, PayOS, Enrollment và Revenue Ledger
                -> Phase 5: Learning, Quiz, Comment và Daily Activity foundation
                    -> Phase 6: Online Judge
        -> Phase 7: AI Interview
            -> Phase 8: Wallet, Notification, Audit và Dashboard
                -> Phase 9: Hardening, E2E và Release
```

Các task FE và BE trong cùng một lát cắt có thể thực hiện song song sau khi request/response, error code và state transition của lát cắt đó đã được chốt.

### Bản đồ truy vết roadmap

Mỗi task trong nhóm dưới đây phải dùng các nguồn tương ứng; tài liệu được nêu là điểm kiểm tra bắt buộc khi task thay đổi contract hoặc schema.

| Task | PRD | API spec | `DATABASE.txt` / gate |
|---|---|---|---|
| BE-0.1–0.3, FE-0.1 | §3, §5–§7, §10 | §2, §4–§16 | Enum/tables canonical; open-gate revenue và activity; lowercase database path đã retired |
| BE-1.1–1.2, FE-1.1 | §8, FR-001 | §1–§2 | `user` và hạ tầng shared; không tự thêm persisted field |
| BE-1.3–1.5, FE-1.2 | §2, §6, FR-001/FR-010 | §3–§4, §12 | `user`, `user_role`, `notification`, `audit_log` |
| BE-2.1–2.4, FE-2.1–2.2 | §2 Teacher, §3 Teacher application, FR-004 | §4–§5, §15 | `teacher_profile`, `teacher_register`, `teacher_register_history` |
| BE-3.1–3.4, FE-3.1–3.3 | §2 Teacher/Student, §3 Course, FR-002–FR-004 | §6–§7, §15 | `courses`, `course_moderation_review`, `course_favorite`, `course_review`, curriculum tables |
| BE-4.1–4.4, FE-4.1–4.2 | §3 Payment, §5 Payment trực tiếp, FR-005 | §9, §15 | `transaction`, `enrollment`; PayOS mock signed webhook |
| BE-4.5, BE-8.1–8.2, FE-8.1 | §5 Wallet/payout, FR-009 | §10, §14–§15 | `wallet`, `wallet_ledger`, `payout_request`; revenue split/destination/settlement gate |
| BE-5.1–5.2, FE-5.1 | §4 Learning, FR-006 | §7 | `lesson_content`, `lesson_content_progress`, `enrollment` |
| BE-5.3, BE-8.4, FE-8.3 | §2 Student, FR-011 | §12, §14 | `student_daily_activity`; activity/timezone metric gate |
| BE-5.4, FE-5.2 | §4 Quiz, FR-006 | §8.1, §15 | `quizzes`, `quiz_attempt`, `quiz_submission` |
| BE-5.5, FE-5.3 | §6, FR-010 | §12 | Comment remains `GATED-SCHEMA` until canonical table is approved |
| BE-6.1–6.4, FE-6.1–6.3 | §4 Online Judge, FR-007 | §8.2, §15 | `problem`, `problem_config`, `testcase`, `submission`, result/tag tables |
| BE-7.1–7.3, FE-7.1–7.2 | §3/§6 AI Interview, FR-008 | §11, §15 | `interview_session`, text `interview_message`, aggregate `interview_reports` |
| BE-8.3, BE-8.5, FE-8.2/8.4 | §6, FR-010–FR-011 | §12 | `notification`, `audit_log`, payment/enrollment and authorized projections |
| BE-9.1–9.3, FE-9.1–9.3 | §8–§9 | §2, §15–§16 | Tất cả resource đã duyệt; không mở `GATED`/`GATED-SCHEMA` bằng test hoặc UI |

---

## Giai đoạn 0: Chốt quyết định nghiệp vụ và baseline contract

**Mục tiêu:** Loại bỏ các điểm mâu thuẫn giữa tài liệu, schema hiện tại và schema đề xuất trước khi tạo migration hoặc triển khai UI mới; cô lập rõ những policy còn mở vào workstream phụ thuộc của chúng.

### [BE] Task BE-0.1: Ghi nhận baseline quyết định Meeting 3

**Tên:** Baseline nghiệp vụ đã chốt và các policy thực sự còn mở.

**Mô tả:** Ghi nhận các quyết định đã duyệt làm baseline triển khai: Teacher Profile/Application 1-1, course lifecycle, USD, direct checkout một course, PayOS mock webhook ký, quiz attempt không save/resume, Problem passing score và AI Interview voice-first/text-only. Chỉ giữ revenue split/settlement và activity metrics là câu hỏi mở; `docs/database.txt` lowercase đã retired.

**Yêu cầu đầu ra:**

- Decision ledger có người duyệt, ngày duyệt, giá trị đã chốt và lý do; không giữ chúng như blocker.
- State machine canonical cho teacher application, course, payment, payout và interview; mapping legacy `PUBLISHED -> APPROVED`, `COMPLETE -> COMPLETED` được ghi rõ.
- Danh sách tách biệt các policy chưa chốt: revenue split/payout destination/settlement và activity day/timezone/streak/study time.
- Đồng bộ baseline vào PRD, gap analysis, `DATABASE.txt`, API spec và roadmap.

**Chú ý đặc biệt:** Không mở lại quyết định đã duyệt hoặc tự chọn giá trị cho các policy còn mở chỉ để tiếp tục coding.

### [BE] Task BE-0.2: Lập bản đồ schema hiện tại sang schema mục tiêu

**Tên:** Database migration mapping và chiến lược backfill.

**Mô tả:** Đối chiếu model/Alembic hiện tại với `DATABASE.txt`, xác định rõ bảng/cột mới, đổi tên, enum legacy, unique constraint, dữ liệu cần backfill và thứ tự migration an toàn.

**Yêu cầu đầu ra:**

- Mapping `AGREE -> APPROVED`, `REJECT -> REJECTED`, `PUBLISHED -> APPROVED`, `COMPLETE -> COMPLETED` và các enum canonical đã được duyệt.
- Danh sách migration theo thứ tự, kèm chiến lược upgrade, backfill, validation và rollback.
- Kế hoạch xử lý `Float -> Numeric`, `thumbnai_url -> thumbnail_url` và các foreign key/unique constraint mới.
- Ghi rõ `DATABASE.txt` là canonical; path lowercase lịch sử `docs/database.txt` đã retired, không tồn tại và không tạo nguồn schema song song.

**Chú ý đặc biệt:** Migration enum PostgreSQL và thay đổi kiểu tiền phải được thử trên bản sao dữ liệu; không sửa migration lịch sử đã chạy ở môi trường dùng chung.

### [BE] Task BE-0.3: Chuẩn hóa API contract và error contract

**Tên:** Baseline OpenAPI cho toàn bộ MVP.

**Mô tả:** Chốt route, payload, response envelope, pagination, authorization, ownership, error code và idempotency contract cho các luồng trong `api_spec.md`.

**Yêu cầu đầu ra:**

- API coverage matrix từ từng yêu cầu PRD và màn hình UI tới endpoint tương ứng.
- Request/response example cho happy path, validation error, forbidden và invalid state.
- Quy ước timestamp UTC, `decimal + currency`, snake_case và pagination thống nhất.
- Phân biệt rõ endpoint đang có, endpoint cần triển khai và endpoint bị loại khỏi MVP.

**Chú ý đặc biệt:** Không để FE phụ thuộc vào route còn mang nhãn `VERIFY`. Generated OpenAPI sau triển khai phải khớp contract đã duyệt.

### [FE] Task FE-0.1: Đồng bộ wireframe với phạm vi MVP

**Tên:** UI flow và màn hình theo contract mới.

**Mô tả:** Rà soát các wireframe theo PRD mới, gắn màn hình với route/API, state machine và trạng thái empty/loading/error/forbidden tương ứng.

**Yêu cầu đầu ra:**

- Danh sách màn hình theo Student, Teacher và Admin, kèm route frontend và API consumer.
- Loại bỏ Video khỏi LessonContent builder, workspace, preview và progress.
- Cập nhật các màn hình teacher application (profile JSON + edit lock), course moderation, checkout/payment trực tiếp, payout, quiz restart-only, interview voice-first và dashboard theo lifecycle mới.
- Danh sách asset còn thiếu hoặc chưa kiểm chứng, không mô tả chúng như thiết kế đã xác nhận.

**Chú ý đặc biệt:** Microphone/camera trong Interview chỉ là permission và fallback UI; không thiết kế chức năng recording/upload media.

### Điều kiện hoàn thành giai đoạn 0

- Các quyết định Meeting 3 đã chốt được dùng làm baseline, không còn nhãn blocker/GATED trong task triển khai; mỗi policy còn mở có một gate riêng, không chặn các workstream độc lập.
- Schema mapping, API coverage matrix và UI flow cùng dùng một bộ trạng thái.
- FE và BE có thể phát triển song song từ contract đã duyệt.

---

## Giai đoạn 1: Nền tảng kỹ thuật, Auth và khung Frontend

**Mục tiêu:** Ổn định nền tảng dùng chung trước khi triển khai các module nghiệp vụ.

### [BE] Task BE-1.1: Chuẩn hóa cấu trúc service và cấu hình môi trường

**Tên:** Backend service baseline.

**Mô tả:** Chuẩn hóa cấu hình của Auth Provider và Business Application, dependency injection, database session, Redis, RabbitMQ, gRPC, CORS và lifecycle resource.

**Yêu cầu đầu ra:**

- Mẫu `.env.example` đầy đủ nhưng không chứa secret thật.
- Health/liveness/readiness check cho database, Redis, RabbitMQ và kết nối Auth gRPC phù hợp từng service.
- Resource được khởi tạo và đóng đúng lifecycle; lỗi startup có thông báo có cấu trúc.
- Hướng dẫn chạy local bằng `uv` và hạ tầng Docker tùy chọn được đồng bộ.

**Chú ý đặc biệt:** Supabase/Upstash là cấu hình cloud hiện tại; Docker Compose local không được trở thành điều kiện bắt buộc ngoài môi trường test cần nó.

### [BE] Task BE-1.2: Chuẩn hóa response, validation và exception handling

**Tên:** API foundation và error handling.

**Mô tả:** Xây dựng response envelope, pagination model, domain error và exception handler dùng chung cho Business Application và các route Auth phù hợp.

**Yêu cầu đầu ra:**

- Response và error khớp `api_spec.md`, có `error_code`, `message`, `details` và HTTP status đúng.
- Validation error không trả raw exception hoặc dữ liệu nhạy cảm.
- Correlation ID được truyền qua request/log để phục vụ audit và troubleshooting.
- Unit test cho các exception handler và pagination helper.

**Chú ý đặc biệt:** Không giữ các message placeholder hoặc branding không liên quan đang có trong exception response hiện tại.

### [BE] Task BE-1.3: Hoàn thiện Auth Provider và token lifecycle

**Tên:** Registration, login, refresh, logout và password recovery.

**Mô tả:** Hoàn thiện các flow Auth hiện đang stub, bảo đảm JWT/JWK, OTP, refresh token, logout, Google identity và password reset hoạt động theo contract.

**Yêu cầu đầu ra:**

- Đăng ký local, xác minh OTP, login, đổi authorization code, refresh và logout hoạt động end-to-end.
- Google login liên kết identity an toàn, không tạo user trùng email ngoài policy.
- Forgot/reset password và change email dùng token một lần, có expiry và chống replay.
- Token chứa `sub`, role và thời hạn đúng; password được hash bằng Argon2.

**Chú ý đặc biệt:** Không trả OTP, reset code hoặc demo token trong production response. Trạng thái account phải được kiểm tra khi login và refresh.

### [BE] Task BE-1.4: Hoàn thiện xác thực liên service và authorization guard

**Tên:** JWT verification, RBAC và resource ownership foundation.

**Mô tả:** Chuẩn hóa việc Business Application nhận public key qua gRPC, verify access token, kiểm tra account status, role, capability và ownership.

**Yêu cầu đầu ra:**

- Public key cache có refresh/failure policy rõ ràng, không dùng fallback key giả.
- Guard dùng chung cho login, role, approved-teacher capability và owner/admin access.
- Admin override được quy định rõ, không áp dụng ngoài resource được phép.
- Test cho token hết hạn, sai chữ ký, user bị ban, thiếu role và sai ownership.

**Chú ý đặc biệt:** Role `TEACHER` không tự động đồng nghĩa với `can_teach`; guard phải kiểm tra application `APPROVED` theo contract.

### [BE] Task BE-1.5: Xây dựng Notification, Audit và domain-event foundation

**Tên:** Nền tảng ghi notification, audit và phát sự kiện dùng chung.

**Mô tả:** Tạo schema và write path tối thiểu để các module Teacher Application, Course Moderation, Payment, Judge, Interview và Payout có thể ghi notification/audit ngay khi triển khai, không chờ đến giai đoạn Dashboard.

**Yêu cầu đầu ra:**

- Migration cho `notification` với event type, target type/id, recipient, read state và timestamp.
- Migration cho `audit_log` với actor, action, target, note, correlation ID và timestamp.
- Service/interface dùng chung để ghi notification và audit trong transaction hoặc outbox strategy đã duyệt.
- Quy ước event ID/idempotency, redaction và test bảo đảm không ghi CCCD, JWT, secret hoặc raw payment token.

**Chú ý đặc biệt:** Task này chỉ xây nền tảng ghi sự kiện. API list/mark-read, Notification Center và màn hình tra cứu Audit vẫn được hoàn thiện tại giai đoạn 8. Audit log không thay thế domain history.

### [FE] Task FE-1.1: Xây dựng application shell và frontend foundation

**Tên:** React application architecture và design primitives.

**Mô tả:** Thay màn hình bootstrap hiện tại bằng application shell có router, layout theo role, API client, auth state, error boundary và component UI nền tảng.

**Yêu cầu đầu ra:**

- Router cho public, authenticated Student, approved Teacher và Admin.
- API client tự gắn access token, xử lý refresh một lần và chuẩn hóa lỗi.
- Layout, typography, color token, form control, modal, table, pagination, skeleton và toast tái sử dụng.
- Cấu trúc feature/module rõ ràng, không dồn logic vào `App.tsx`.

**Chú ý đặc biệt:** Chỉ thêm dependency UI/router/state-management sau khi team duyệt; không dựa vào dữ liệu mock như nguồn runtime lâu dài.

### [FE] Task FE-1.2: Triển khai toàn bộ luồng Auth

**Tên:** Login, register, OTP và account recovery UI.

**Mô tả:** Triển khai các màn hình Auth theo `AUTH01` đến `AUTH06`, tích hợp đầy đủ API và route guard.

**Yêu cầu đầu ra:**

- Form register/login có validation, loading, lỗi server và điều hướng đúng.
- OTP/resend có countdown và xử lý code hết hạn.
- Forgot password, set password, logout và lock screen hoạt động theo token lifecycle.
- Google login có trạng thái thành công, hủy và lỗi provider.

**Chú ý đặc biệt:** Không lưu refresh token trong nơi dễ bị JavaScript truy cập nếu contract chọn cookie bảo mật; UI không hiển thị raw token hoặc chi tiết lỗi nội bộ.

### Điều kiện hoàn thành giai đoạn 1

- Người dùng có thể đăng ký, xác minh, đăng nhập, refresh và logout end-to-end.
- Business Application từ chối token hoặc quyền không hợp lệ bằng error contract thống nhất.
- Các phase nghiệp vụ sau có thể ghi notification/audit qua interface đã kiểm thử, không tự tạo logic riêng ở từng module.
- Frontend build/lint thành công và có shell sẵn sàng cho feature modules.

---

## Giai đoạn 2: Hồ sơ người dùng và Teacher Application

**Mục tiêu:** Hoàn thiện quy trình Student đăng ký trở thành Teacher và Admin xét duyệt có lịch sử.

### [BE] Task BE-2.1: Migration profile và teacher application

**Tên:** Schema Teacher Profile, application và review history.

**Mô tả:** Tạo migration cho Teacher Profile/Application 1-1, profile JSON và lịch sử submit/review tách biệt.

**Yêu cầu đầu ra:**

- Enum `DRAFT -> PENDING -> APPROVED | REJECTED` và backfill dữ liệu legacy.
- `teacher_profile` có `education_entries` và `experience_entries` JSON; không tạo bảng `teacher_education` hoặc `teacher_experience`.
- `teacher_register.teacher_profile_id` là FK + unique tới profile, bảo đảm một application hiện hành cho một profile; history nằm ở `teacher_register_history`.
- Service/migration policy bảo đảm `PENDING` khóa profile/application, `REJECTED` mới được sửa và submit lại, `APPROVED` chỉ mở whitelist application không nhạy cảm.
- Migration test xác nhận upgrade và dữ liệu backfill.

**Chú ý đặc biệt:** CCCD là dữ liệu nhạy cảm; phải xác định chính sách mã hóa/masking và không ghi raw value vào log/audit.

### [BE] Task BE-2.2: API current user và profile

**Tên:** Current-user profile và capability projection.

**Mô tả:** Cung cấp API đọc/cập nhật hồ sơ Student/Teacher và projection capability của current user.

**Yêu cầu đầu ra:**

- `GET /users/me` trả user, profile, application status và `capabilities.can_teach`.
- API cập nhật Teacher Profile chỉ cho owner; `PENDING` bị khóa, còn `APPROVED` vẫn sửa các field profile nhưng không mở khóa identity/document của application.
- Upload avatar/CV/CCCD qua object storage với file validation và URL an toàn.
- Test chống đọc/sửa profile của user khác.

**Chú ý đặc biệt:** Capability Teacher chỉ true khi application `APPROVED`; không suy ra từ việc profile tồn tại.

### [BE] Task BE-2.3: API draft, submit và resubmit application

**Tên:** Teacher application owner workflow.

**Mô tả:** Triển khai save draft, update, submit, submit lại sau reject, current status và history cho Student.

**Yêu cầu đầu ra:**

- State transition được kiểm tra ở service, không nhận status tùy ý từ client.
- Submit kiểm tra đủ field bắt buộc và ghi history event.
- `DRAFT`/`REJECTED` được sửa và dùng cùng endpoint submit để chuyển sang `PENDING`; không có route resubmit riêng.
- `PENDING` từ chối mọi update profile/application; `APPROVED` chỉ cho `bio`, `date_of_birth`, `motivation` và application field không nhạy cảm được whitelist.
- API chỉ trả application của current user và mask dữ liệu nhạy cảm khi phù hợp.

**Chú ý đặc biệt:** Mỗi transition phải atomic; request lặp không được tạo history hoặc side effect trùng ngoài policy.

### [BE] Task BE-2.4: API Admin review Teacher Application

**Tên:** Admin review queue và quyết định application.

**Mô tả:** Triển khai danh sách chờ duyệt, chi tiết hồ sơ, approve/reject, reviewer note, history, audit và notification.

**Yêu cầu đầu ra:**

- Admin list có filter/status/pagination và không trả CCCD đầy đủ trong list.
- Chỉ application `PENDING` được approve/reject.
- Quyết định ghi reviewer, thời gian, note, history, audit và notification trong transaction nhất quán.
- Sau approve, capability Teacher có hiệu lực theo policy đã chốt.

**Chú ý đặc biệt:** Không cho Admin review application của chính mình nếu policy cấm; không cấp quyền trước khi transaction approve hoàn tất.

### [FE] Task FE-2.1: Hồ sơ cá nhân và Teacher Application UI

**Tên:** Profile, save draft, submit và resubmit.

**Mô tả:** Triển khai `STD03`, `STD04` và phần Teacher Registration cần thiết theo field mapping đã duyệt.

**Yêu cầu đầu ra:**

- Form Teacher Profile quản lý education/experience dạng JSON có validation; Application form quản lý PII/tài liệu xét duyệt tách biệt.
- Hiển thị rõ trạng thái `DRAFT`, `PENDING`, `APPROVED`, `REJECTED` và note của reviewer.
- Có save draft, validation trước submit và submit lại sau reject bằng cùng action; PENDING hiển thị read-only.
- Khi APPROVED, UI chỉ cho sửa Teacher Profile và whitelist application không nhạy cảm; identity/document fields luôn read-only.
- Lịch sử submit/review hiển thị theo thứ tự thời gian, không lộ dữ liệu nhạy cảm ngoài quyền.

**Chú ý đặc biệt:** UI không mở Teacher Dashboard chỉ vì user có role/profile; phải dựa vào capability từ API.

### [FE] Task FE-2.2: Admin Teacher Application Review UI

**Tên:** Review queue và chi tiết hồ sơ Teacher.

**Mô tả:** Triển khai màn hình `AD01` để Admin tìm, lọc, xem chi tiết và đưa ra quyết định.

**Yêu cầu đầu ra:**

- Bảng queue có filter, pagination, trạng thái và thời điểm submit.
- Chi tiết có Teacher Profile (education/experience JSON), application/tài liệu, history và reviewer note.
- Approve/reject có confirmation, loading, chống double-submit và cập nhật kết quả từ server.
- Trạng thái invalid/đã được reviewer khác xử lý hiển thị đúng.

**Chú ý đặc biệt:** Không cache hoặc log CCCD/tài liệu nhạy cảm ở client lâu hơn cần thiết.

### Điều kiện hoàn thành giai đoạn 2

- Luồng profile 1-1 + draft -> submit -> review -> reject/sửa/submit lại hoặc approve chạy end-to-end; PENDING không thể bị sửa.
- Chỉ application approved mới kích hoạt Teacher capability.
- History, notification và audit khớp với quyết định thực tế.

---

## Giai đoạn 3: Course Authoring, Moderation, Catalog và Instructor

**Mục tiêu:** Cho phép Teacher đã duyệt xây dựng course; Admin kiểm duyệt theo lifecycle canonical; người dùng xem catalog, favorite và review đúng policy.

### [BE] Task BE-3.1: Migration course moderation, favorite và review

**Tên:** Schema course lifecycle và catalog relations.

**Mô tả:** Nâng cấp course theo status canonical đã duyệt, bổ sung moderation metadata/history, favorite, course review và constraint curriculum.

**Yêu cầu đầu ra:**

- Backfill `PUBLISHED -> APPROVED`, đổi `thumbnail_url`, price decimal hai chữ số và `currency: USD`.
- Bảng `course_moderation_review`, `course_favorite`, `course_review` cùng index/constraint cần thiết.
- Unique position cho section, lesson, lesson content theo parent.
- Migration test và dữ liệu seed tối thiểu cho course lifecycle.

**Chú ý đặc biệt:** Course review của Student và moderation review của Admin là hai domain khác nhau, không dùng chung bảng.

### [BE] Task BE-3.2: API Teacher Course và Curriculum Builder

**Tên:** Course, section, lesson và LessonContent authoring.

**Mô tả:** Triển khai CRUD/reorder cho course curriculum của Teacher đã approved, gồm Reading, Quiz và Problem binding.

**Yêu cầu đầu ra:**

- Teacher chỉ thao tác course/problem/quiz/reading thuộc quyền của mình.
- Course chỉ editable ở `DRAFT`/`REJECTED`; client không thể tự đặt status, currency, approved hoặc public.
- Reorder atomic, không tạo position trùng hoặc chuyển item sang course khác.
- Binding `(content_type, content_id)` được kiểm tra tồn tại, đúng loại và đúng ownership/course.

**Chú ý đặc biệt:** Không nhận `VIDEO` hoặc tạo video model. `content_id` là polymorphic reference nên validation service là bắt buộc.

### [BE] Task BE-3.3: API Course Moderation

**Tên:** Submit, review, reject, resubmit và archive course.

**Mô tả:** Triển khai state machine moderation và queue dành cho Admin.

**Yêu cầu đầu ra:**

- Teacher submit/re-submit qua cùng action chỉ từ `DRAFT`/`REJECTED`, sau khi curriculum đạt validation tối thiểu; transition đến `PENDING_REVIEW`.
- Admin chỉ approve/reject course `PENDING_REVIEW`; quyết định có note, reviewer và history.
- Notification và audit được tạo cùng quyết định.
- Chỉ `APPROVED` xuất hiện ở catalog/bán được; `ARCHIVED` ẩn/ngừng bán nhưng learner đã enrollment vẫn truy cập được.

**Chú ý đặc biệt:** Dùng đúng enum `DRAFT`, `PENDING_REVIEW`, `APPROVED`, `REJECTED`, `ARCHIVED`; `PUBLISHED` chỉ còn mapping migration legacy.

### [BE] Task BE-3.4: API Catalog, Instructor, Favorite và Course Review

**Tên:** Public course discovery và Student engagement.

**Mô tả:** Triển khai catalog/search/filter, course detail, instructor projection, favorite và review.

**Yêu cầu đầu ra:**

- Catalog chỉ trả course `APPROVED`.
- Search/filter/tag/pagination ổn định và có index phù hợp.
- Favorite thuộc current user và idempotent theo `(student_id, course_id)`.
- Chỉ Student đã enrollment được review và unique `(student_id, course_id)`; rating tổng được tính từ review hoặc cache có thể tái tạo.

**Chú ý đặc biệt:** Không dùng lesson comment thay cho course review; mỗi Student chỉ có một review cho một course.

### [FE] Task FE-3.1: Catalog, Course Detail, Instructor và Favorite UI

**Tên:** Course discovery flow.

**Mô tả:** Triển khai catalog, course detail, instructor list/detail và danh sách favorite từ API thật.

**Yêu cầu đầu ra:**

- Search/filter/pagination đồng bộ query string và có loading/empty/error state.
- Course detail hiển thị metadata, instructor, curriculum overview, rating và trạng thái đã enrollment.
- Favorite có add/remove, optimistic state an toàn và rollback khi API lỗi.
- Instructor projection không dùng dữ liệu hard-code từ course card.

**Chú ý đặc biệt:** Chỉ hiển thị course `APPROVED`; không cho mua lại course đã enrollment.

### [FE] Task FE-3.2: Teacher Course Builder UI

**Tên:** Course metadata, curriculum và content builder.

**Mô tả:** Triển khai các màn hình Teacher tạo course, section, lesson, Reading/Quiz/Problem và reorder curriculum.

**Yêu cầu đầu ra:**

- Form lưu draft và hiển thị validation theo contract.
- Builder và preview chỉ có `READING`, `QUIZ`, `PROBLEM`.
- Reorder có trạng thái pending/error và đồng bộ lại dữ liệu server khi thất bại.
- Submit review, rejected note và resubmit được hiển thị theo state machine.

**Chú ý đặc biệt:** Không gửi status moderation tùy ý trong form update; các action transition dùng endpoint riêng.

### [FE] Task FE-3.3: Admin Course Moderation UI

**Tên:** Course review queue và preview.

**Mô tả:** Triển khai `AD02` và trạng thái approval để Admin xem đủ course/curriculum trước khi quyết định.

**Yêu cầu đầu ra:**

- Queue có status filter, pagination và thông tin submit.
- Preview thể hiện đúng ba loại LessonContent và dữ liệu Teacher.
- Approve/reject yêu cầu note theo policy, có confirmation và chống double-submit.
- History và kết quả race/invalid state được hiển thị rõ.

**Chú ý đặc biệt:** Course moderation không được gọi endpoint chỉnh sửa course của Teacher.

### Điều kiện hoàn thành giai đoạn 3

- Teacher approved có thể tạo `DRAFT`, gửi `PENDING_REVIEW`, sửa/re-submit `REJECTED`; Admin có thể approve/reject/archive với history.
- Catalog chỉ hiển thị/bán `APPROVED`; `ARCHIVED` vẫn mở cho learner đã enrollment.
- Favorite và một review duy nhất cho mỗi Student/course hoạt động theo current user/enrollment policy.

---

## Giai đoạn 4: Checkout trực tiếp, PayOS, Enrollment và Revenue Ledger

**Mục tiêu:** Xây dựng luồng thanh toán trực tiếp một course an toàn, chính xác và idempotent từ transaction tới quyền học; không có Cart hoặc Order trong MVP.

### [BE] Task BE-4.1: Migration commerce và enrollment constraint

**Tên:** Schema direct transaction và enrollment.

**Mô tả:** Migration commerce theo direct checkout đã chốt: transaction gắn trực tiếp Student/course, snapshot USD, expiry, provider state và idempotency.

**Yêu cầu đầu ra:**

- Không tạo hoặc loại bỏ `cart`, `cart_item`, `orders`, `order_item`; `transaction` trực tiếp có `student_id`, `course_id`.
- Payment status `PENDING`, `COMPLETED`, `FAILED`, `EXPIRED` cùng mapping legacy `COMPLETE -> COMPLETED`.
- Price snapshot USD decimal hai chữ số, expiry, PayOS reference, signature state và idempotency key.
- Unique `(student_id, course_id)` cho enrollment và migration test.
- Service workflow lock theo `(student_id, course_id)` để nhiều transaction lịch sử vẫn chỉ có một `PENDING` chưa hết hạn.

**Chú ý đặc biệt:** Quy tắc active-pending phụ thuộc thời gian không được mô hình hóa bằng static database `UNIQUE`; phải enforce trong transaction/service workflow.

### [BE] Task BE-4.2: API Direct Checkout

**Tên:** Tạo checkout một course cho current Student.

**Mô tả:** Triển khai `POST /courses/{course_id}/checkout`, validate course eligibility và tạo/reuse transaction `PENDING` từ snapshot giá server.

**Yêu cầu đầu ra:**

- Chỉ current Student checkout course `APPROVED` chưa enrollment; không có API Cart/Order.
- Checkout dùng giá USD từ server, lưu snapshot/currency/expiry và idempotency key.
- Request lặp với cùng key trả lại transaction cũ; request key khác khi đang có PENDING còn hạn phải trả/reuse active transaction, không tạo pending trùng.
- Free course tạo enrollment theo cùng policy idempotency.

**Chú ý đặc biệt:** Không tin amount, currency, course status hoặc ownership gửi từ client.

### [BE] Task BE-4.3: PayOS mock webhook và payment lifecycle

**Tên:** PayOS mô phỏng sát provider, status và verified webhook.

**Mô tả:** Mô phỏng luồng PayOS gần integration thật, xác thực test signature ở webhook backend và cập nhật payment lifecycle an toàn trước retry/race condition.

**Yêu cầu đầu ra:**

- API tạo checkout và API owner/Admin đọc payment status để frontend poll.
- Chỉ webhook test có chữ ký hợp lệ được chuyển transaction sang `COMPLETED`; verify signature, transaction reference, amount và currency USD.
- Webhook lặp dùng transaction/locking/idempotency; expiry worker chuyển pending quá hạn sang `EXPIRED`; failed/expired không tạo enrollment.
- Ghi audit correlation và notification mà không lưu raw secret/payment token.

**Chú ý đặc biệt:** Client polling chỉ đọc trạng thái; client không được tự xác nhận thanh toán thành công.

### [BE] Task BE-4.4: Enrollment creation và course access policy

**Tên:** Atomic payment-to-enrollment workflow.

**Mô tả:** Tạo enrollment đúng một lần sau payment thành công và cung cấp policy truy cập course đã mua.

**Yêu cầu đầu ra:**

- Payment `COMPLETED` tạo tối đa một enrollment cho Student/course.
- Enrollment, notification, audit và event doanh thu được tạo trong transaction/outbox strategy đã duyệt.
- Course archived vẫn truy cập được với enrollment hợp lệ theo policy.
- Test concurrent webhook và duplicate enrollment.

**Chú ý đặc biệt:** Không gọi nhiều side effect không thể rollback trong cùng DB transaction nếu chưa có outbox/retry strategy.

### [BE] Task BE-4.5: Wallet Ledger foundation và payment accounting

**Tên:** Ledger immutable trong luồng payment completed.

**Mô tả:** Tạo wallet/ledger USD và đường ghi idempotent từ payment completed. Revenue split, payout destination và settlement không được suy diễn trong task này; phần allocation/settlement chỉ mở sau policy được duyệt.

**Yêu cầu đầu ra:**

- Migration cho `wallet` và immutable `wallet_ledger`, currency USD, source `transaction` (không có order) và constraint idempotency.
- Mỗi payment `COMPLETED` tạo payment-accounting/ledger side effect đúng một lần theo revenue policy được duyệt; nếu policy chưa có, không credit hay split bằng giá trị tự suy ra.
- Enrollment, revenue ledger, notification và audit được điều phối bằng transaction/outbox strategy nhất quán.
- Có reconciliation query/test và concurrency test chứng minh webhook lặp không nhân đôi doanh thu.

**Chú ý đặc biệt:** Không cộng trực tiếp balance mà không có ledger entry. API wallet summary/ledger và payout workflow vẫn thuộc giai đoạn 8.

### [FE] Task FE-4.1: Direct Checkout UI

**Tên:** Course checkout trực tiếp và PayOS mock.

**Mô tả:** Thay `PAY01` Cart bằng action checkout trực tiếp từ course; triển khai `PAY02` theo transaction USD và PayOS mock.

**Yêu cầu đầu ra:**

- Không có Cart/add/remove/order summary; course đã enrollment không hiển thị action checkout.
- Checkout hiển thị price snapshot USD, expiry và QR/link từ server.
- Countdown dựa trên `expires_at`, không tự giả định thời gian cố định.
- Chống double-submit và mở lại active payment còn hạn do server trả về.

**Chú ý đặc biệt:** Tổng tiền hiển thị phải lấy từ response checkout, không tính như nguồn quyết định ở client; UI không có control đánh dấu thanh toán thành công.

### [FE] Task FE-4.2: Payment Result và Enrolled Course UI

**Tên:** Theo dõi trạng thái payment và mở khóa khóa học.

**Mô tả:** Triển khai `PAY03` và cập nhật danh sách course đã enrollment sau kết quả thanh toán.

**Yêu cầu đầu ra:**

- Hiển thị đầy đủ `PENDING`, `COMPLETED`, `FAILED`, `EXPIRED`.
- Polling có backoff/timeout và dừng khi trạng thái terminal hoặc component unmount.
- Khi completed, xác nhận enrollment từ server rồi mới điều hướng vào học.
- Reload trang vẫn khôi phục đúng trạng thái từ `transaction_code` của owner.

**Chú ý đặc biệt:** Không hiển thị thành công chỉ dựa vào redirect query hoặc dữ liệu từ client.

### Điều kiện hoàn thành giai đoạn 4

- Direct checkout/payment/enrollment chạy end-to-end với PayOS mock signed webhook; không có Cart/Order route hoặc UI.
- Webhook sai chữ ký bị từ chối; webhook lặp không nhân đôi enrollment, revenue ledger, notification hoặc audit; frontend không thể chuyển payment sang `COMPLETED`.
- Payment completed có payment-accounting/ledger side effect idempotent; không phát hành revenue split/settlement chưa được duyệt.
- UI khôi phục đúng payment state sau reload và không cho mua lại course.

---

## Giai đoạn 5: Learning Workspace, Progress, Quiz và Comment

**Mục tiêu:** Cho phép Student đã enrollment học Reading/Quiz/Problem theo đúng access và completion rule.

### [BE] Task BE-5.1: API Learning Workspace và access projection

**Tên:** Curriculum cho learner và content access.

**Mô tả:** Cung cấp course study projection gồm sections, lessons, LessonContent, lock state và completion cho current Student.

**Yêu cầu đầu ra:**

- Chỉ enrollment hợp lệ được đọc nội dung private.
- Projection chỉ gồm `READING`, `QUIZ`, `PROBLEM` và đúng thứ tự.
- Archived-course access áp dụng theo policy đã chốt.
- Test user chưa mua, user khác, content sai course và course archived.

**Chú ý đặc biệt:** Public course detail không được trả nội dung học private hoặc đáp án.

### [BE] Task BE-5.2: API LessonContent Progress

**Tên:** Completion và progress theo enrollment.

**Mô tả:** Triển khai đánh dấu Reading hoàn thành và cập nhật completion từ Quiz/OJ theo rule domain.

**Yêu cầu đầu ra:**

- Reading completion chỉ cho owner có access và idempotent.
- Quiz completion dựa vào terminal submission của `quiz_attempt` hợp lệ và `quizzes.passing_score`; Problem completion chỉ khi `ACCEPTED` đạt `problem.passing_score` do Teacher cấu hình.
- Progress unique theo `(enrollment_id, lesson_content_id)` và không tạo cho content ngoài course.
- API progress trả phần trăm/continue-learning có thể tái tính từ dữ liệu nguồn.

**Chú ý đặc biệt:** Không cho client tự gửi `completed=true` cho Quiz hoặc Problem.

### [BE] Task BE-5.3: Xây dựng Daily Activity foundation

**Tên:** Nguồn dữ liệu hoạt động hằng ngày cho Student Dashboard.

**Mô tả:** Chuẩn bị schema `student_daily_activity` và integration point cho Reading/Quiz/Judge. Chỉ mở aggregation/KPI sau khi activity day, timezone, streak, study time và solved-problem policy được duyệt.

**Yêu cầu đầu ra:**

- Migration cho `student_daily_activity` với unique `(student_id, activity_date)` và index phục vụ dashboard.
- Ghi rõ event contract đang chờ duyệt cho contribution, study seconds và solved problem; không phát hành metric giả trước gate này.
- Sau khi policy được duyệt, aggregation dùng timezone đã chốt, idempotent theo source event và chịu được retry.
- Reading completion, Quiz passed và Judge `ACCEPTED` đạt `problem.passing_score` có integration point rõ ràng; event không được tính lặp.

**Chú ý đặc biệt:** `user_history.problem_count` chỉ là aggregate legacy. Nếu policy/nguồn đo chưa được duyệt, field phải giữ 0/không khả dụng và dashboard không được diễn giải thành KPI thật.

### [BE] Task BE-5.4: API Quiz Authoring và Attempt Lifecycle

**Tên:** Quiz management, start/submit/history không save-resume.

**Mô tả:** Hoàn thiện Teacher quản lý quiz/question/option và Student thực hiện mỗi `quiz_attempt` từ đầu, nộp một đáp án cuối và xem history.

**Yêu cầu đầu ra:**

- Teacher ownership được kiểm tra cho quiz/question/option.
- Start tạo row `quiz_attempt` mới; Student không save/resume, chỉ submit final `answers` khi `IN_PROGRESS`.
- Không vượt attempt limit; mỗi attempt chỉ có một `quiz_submission` terminal; submit lặp trả kết quả đã có và cập nhật progress khi đạt điểm.
- Learner payload không chứa `is_correct` hoặc answer key trước submit.

**Chú ý đặc biệt:** Dùng `quiz_attempt` riêng và quan hệ terminal 1-1 `quiz_submission.quiz_attempt_id`; không tạo saved-answer endpoint hoặc resume flow.

### [BE] Task BE-5.5: Hoàn thiện Lesson Comment API

**Tên:** Comment/reply có access, ownership và pagination.

**Mô tả:** Nâng cấp module comment hiện có để kiểm tra course access, trả dữ liệu user cần thiết và tuân theo contract.

**Yêu cầu đầu ra:**

- List/create/reply/delete có pagination và response envelope thống nhất.
- Parent comment phải cùng LessonContent; content được trim/sanitize và giới hạn độ dài.
- Chỉ owner hoặc moderator đúng policy được xóa.
- Tạo notification phù hợp cho người nhận mà không nhầm với course review.

**Chú ý đặc biệt:** Endpoint hiện tại chưa kiểm tra enrollment khi đọc/tạo comment; phải đóng lỗ hổng này trước khi mở UI production.

### [FE] Task FE-5.1: Unified Learning Workspace UI

**Tên:** Reading/Quiz/Problem lesson workspace.

**Mô tả:** Triển khai workspace thống nhất từ curriculum projection và điều hướng theo lock/completion state.

**Yêu cầu đầu ra:**

- Sidebar section/lesson/content có trạng thái active, locked, completed.
- Renderer riêng cho Reading, Quiz và Problem; không có Video renderer.
- Reading complete action cập nhật progress và continue-learning.
- Unauthorized/archived/no-enrollment state hiển thị theo response server.

**Chú ý đặc biệt:** Không suy luận quyền truy cập chỉ từ dữ liệu router hoặc local storage.

### [FE] Task FE-5.2: Quiz Attempt UI

**Tên:** Quiz preview, attempt restart-only và result.

**Mô tả:** Triển khai `QUIZ01` và `QUIZ02` theo attempt contract.

**Yêu cầu đầu ra:**

- Preview hiển thị passing score, max attempts, attempts left và thông báo mỗi attempt mới bắt đầu lại từ đầu.
- Form giữ câu trả lời cục bộ trước khi submit; không gọi API save hay khôi phục/resume attempt sau reload.
- Submit có confirmation, chống double-submit và hiển thị score/passed/history.
- Attempt limit, expired/abandoned và invalid state có giao diện riêng.

**Chú ý đặc biệt:** Không lưu hoặc hiển thị answer key từ dữ liệu ngoài response sau submit được phép.

### [FE] Task FE-5.3: Lesson Comment UI

**Tên:** Comment và reply trong bài học.

**Mô tả:** Tích hợp danh sách comment/reply vào Learning Workspace.

**Yêu cầu đầu ra:**

- List có pagination/load-more, loading, empty và error state.
- Create/reply/delete có pending state, confirmation và cập nhật nhất quán.
- Quyền delete hiển thị theo current user/capability, server vẫn là nguồn quyết định.
- Content được render an toàn, không thực thi HTML độc hại.

**Chú ý đặc biệt:** UI course review và lesson comment phải là hai component/flow tách biệt.

### Điều kiện hoàn thành giai đoạn 5

- Student đã enrollment có thể học đúng ba loại content và thấy progress chính xác.
- Quiz dùng `quiz_attempt` restart-only và terminal submission duy nhất; client không thấy đáp án trước thời điểm cho phép.
- Comment không thể bị đọc hoặc tạo bởi user không có quyền truy cập course.
- Reading/Quiz có integration point idempotent vào `student_daily_activity`; không phát hành KPI/heatmap/streak cho đến khi activity policy được duyệt.

---

## Giai đoạn 6: Online Judge

**Mục tiêu:** Cung cấp môi trường chạy/chấm code an toàn, bất đồng bộ và không làm lộ testcase ẩn.

### [BE] Task BE-6.1: Hoàn thiện schema và API Problem Management

**Tên:** Problem, tag, language, config và testcase ownership.

**Mô tả:** Chuẩn hóa domain Problem và API Teacher quản lý đề, tag, language config và testcase.

**Yêu cầu đầu ra:**

- Dùng một relation Problem-Tag canonical, có unique composite và API filter.
- Teacher chỉ quản lý problem/testcase/config thuộc quyền mình và cấu hình `problem.passing_score` không âm.
- File testcase được kiểm tra định dạng/kích thước và lưu qua object storage hoặc cơ chế đã duyệt.
- Public problem projection không chứa hidden testcase input/output.

**Chú ý đặc biệt:** Không tạo đồng thời `problem_tag_map` và `problem_tag_mapping`; tên cuối phải theo migration mapping Phase 0.

### [BE] Task BE-6.2: Xây dựng Judge Service sandbox

**Tên:** Isolated code execution service.

**Mô tả:** Triển khai Judge Service nhận job run/submit và chạy code trong môi trường cô lập theo language config.

**Yêu cầu đầu ra:**

- Sandbox không có network, giới hạn CPU, memory, process, file size và execution time.
- Compiler/runtime image được pin version và có cleanup sau mỗi job.
- Kết quả chuẩn hóa theo các status trong PRD, kèm runtime/memory an toàn.
- Test cho compile error, runtime error, timeout, memory limit và malicious code cơ bản.

**Chú ý đặc biệt:** Không chạy source code trực tiếp trong process/container của Business Application.

### [BE] Task BE-6.3: Queue, Submission và Result Processing

**Tên:** Run/submit orchestration và idempotent judge result.

**Mô tả:** Kết nối Business Application với Judge qua queue, quản lý submission lifecycle và lưu result detail.

**Yêu cầu đầu ra:**

- Submit tạo `PENDING`, worker chuyển `RUNNING` rồi terminal state.
- Retry/duplicate result không cập nhật terminal submission sai hoặc tạo result detail trùng.
- Hidden testcase response chỉ có status/runtime/memory/score aggregate được phép.
- Chỉ submission `ACCEPTED` đạt `problem.passing_score` cập nhật LessonContent progress và activity theo policy.

**Chú ý đặc biệt:** Message phải có correlation/idempotency key; queue retry và dead-letter policy phải được tài liệu hóa.

### [BE] Task BE-6.4: API Run, Submit và Submission History

**Tên:** Learner Online Judge API.

**Mô tả:** Triển khai run custom input, submit, polling result và history theo ownership/access.

**Yêu cầu đầu ra:**

- Run và submit kiểm tra problem access, language active và rate limit.
- Submission detail/history chỉ cho owner, Teacher owner hoặc Admin theo policy.
- Source code và hidden result không bị lộ cho user khác.
- API trả trạng thái nhất quán để FE polling hoặc nhận event.

**Chú ý đặc biệt:** Run custom input không được sử dụng hidden testcase hoặc ghi nhận completion.

### [FE] Task FE-6.1: Problem List và Problem Preview UI

**Tên:** Problem discovery và reading experience.

**Mô tả:** Triển khai danh sách, filter tag/difficulty và trang đọc đề.

**Yêu cầu đầu ra:**

- Filter/pagination đồng bộ URL và API.
- Statement, constraints, sample input/output và supported languages hiển thị đúng.
- Trạng thái solved/attempted lấy từ current-user projection nếu có.
- Không có vị trí hiển thị hidden testcase.

**Chú ý đặc biệt:** Acceptance rate và recommendation là projection, không tự tính từ tập dữ liệu chưa đầy đủ trên client.

### [FE] Task FE-6.2: Online Judge Workspace UI

**Tên:** Code editor, run và submit.

**Mô tả:** Triển khai editor workspace với language selection, custom input, run output và submit.

**Yêu cầu đầu ra:**

- Source code được giữ riêng theo problem/language trong phạm vi client an toàn.
- Run và Submit là hai action rõ ràng, có pending/cancel/retry state phù hợp.
- Hiển thị compile/runtime error đã sanitize và giới hạn kích thước.
- Layout sử dụng tốt trên desktop theo wireframe, có fallback màn hình nhỏ hợp lý.

**Chú ý đặc biệt:** Không render raw HTML từ compiler output; không giả định submit hoàn tất ngay trong response đầu tiên.

### [FE] Task FE-6.3: Judge Result và Submission History UI

**Tên:** Theo dõi submission và lịch sử nộp bài.

**Mô tả:** Triển khai trạng thái chấm bất đồng bộ, testcase summary và history cho owner.

**Yêu cầu đầu ra:**

- Hiển thị đủ các submission status, runtime, memory và score được phép.
- Polling dừng ở terminal state, có backoff và cleanup.
- Hidden testcase chỉ hiển thị summary, không có raw input/output/expected output.
- Chỉ accepted result đạt `problem.passing_score` cập nhật completion/progress trong workspace.

**Chú ý đặc biệt:** FE không suy luận hidden testcase từ thứ tự hay metadata ngoài contract.

### Điều kiện hoàn thành giai đoạn 6

- Code không tin cậy luôn chạy ngoài Business Application và không có network.
- Submission lifecycle chịu được retry, worker failure và duplicate message.
- Hidden testcase được bảo vệ ở cả API và UI.
- Problem progress chỉ được cập nhật khi `ACCEPTED` đạt ngưỡng Teacher cấu hình.

---

## Giai đoạn 7: AI Interview

**Mục tiêu:** Cung cấp trải nghiệm phỏng vấn voice-first tối đa 12 câu, có typed fallback, camera preview-only và đúng một final aggregate report.

### [BE] Task BE-7.1: Migration và API Interview Session

**Tên:** Interview lifecycle, messages và owner access.

**Mô tả:** Chuyển session từ boolean sang lifecycle, chuẩn hóa sender và triển khai create/list/answer/end. API chỉ nhận answer text từ speech-to-text hoặc typed fallback.

**Yêu cầu đầu ra:**

- Status `ACTIVE`, `REPORT_GENERATING`, `COMPLETED`, `ABORTED`, `FAILED`.
- Lưu `max_questions`, `question_count`, timestamps và sender `AI/STUDENT/SYSTEM`.
- Chỉ session owner được answer/end/view; max 12 câu và early finish được enforce server-side.
- Endpoint answer từ chối audio/video/image payload; không có route hay state chatbot.
- End session idempotent và chuyển sang report generation đúng một lần.

**Chú ý đặc biệt:** Không thêm cột/storage cho audio/video recording hoặc camera analysis; chỉ persist `interview_message.content` text.

### [BE] Task BE-7.2: AI provider integration và conversation policy

**Tên:** Sinh câu hỏi phỏng vấn và quản lý answer flow AI.

**Mô tả:** Tích hợp AI provider theo topic/level, kiểm soát question/answer flow, prompt, timeout, retry, rate limit và fallback; không thiết kế chatbot UI.

**Yêu cầu đầu ra:**

- Prompt/version được quản lý bằng cấu hình, không hard-code rải rác trong router.
- Output được validate trước khi lưu; lỗi provider chuyển state/message phù hợp.
- Không gửi PII hoặc secret không cần thiết tới AI provider.
- Test bằng provider adapter/mock cho max question, early finish, timeout và malformed output.

**Chú ý đặc biệt:** Không dùng regex để biến output tùy ý thành dữ liệu tin cậy nếu structured output validation thất bại; phải có retry/failure policy rõ ràng.

### [BE] Task BE-7.3: Report worker và one-report guarantee

**Tên:** Idempotent interview report generation.

**Mô tả:** Tạo worker tổng hợp message text, sinh report cấu trúc và lưu một report duy nhất cho session.

**Yêu cầu đầu ra:**

- Unique `session_id` ở report và idempotency key cho report job.
- Report schema chỉ có `overall_score`, `strengths`, `weaknesses`, `suggestions`; không có skill score hoặc feedback theo từng câu.
- Success chuyển session `COMPLETED`; lỗi cuối chuyển `FAILED` nhưng vẫn cho phép policy retry có kiểm soát.
- Tạo notification `AI_REPORT_READY` đúng một lần.

**Chú ý đặc biệt:** Không ghi full prompt hoặc nội dung nhạy cảm vào application log.

### [FE] Task FE-7.1: Interview Setup và Voice-first Answer UI

**Tên:** Setup topic/level, microphone/camera preview và answer flow.

**Mô tả:** Triển khai setup và interview answer flow theo `INTERVIEW02/03`: microphone speech-to-text có thể xem/sửa, typed fallback và lifecycle server; không dùng UI chatbot.

**Yêu cầu đầu ra:**

- Chọn topic/level, hiển thị thông báo tối đa 12 câu và chính sách không lưu media.
- Microphone/camera permission có trạng thái allow/deny/unavailable; microphone chỉ tạo text local trước khi gửi và camera chỉ preview-only; typed text luôn là fallback.
- Hiển thị question count, early finish, end confirmation và session terminal states.
- Chống gửi nhiều answer đồng thời và xử lý rate limit/provider error.

**Chú ý đặc biệt:** Không upload/lưu stream microphone/camera lên backend, không gửi media tới AI provider và không dùng dữ liệu camera cho proctoring trong MVP.

### [FE] Task FE-7.2: Interview History và Report UI

**Tên:** Report generating, completed và failed states.

**Mô tả:** Triển khai lịch sử session và màn hình report theo dữ liệu API.

**Yêu cầu đầu ra:**

- Danh sách chỉ hiển thị session current user, có pagination/empty state.
- `REPORT_GENERATING` có polling/backoff; completed hiển thị report; failed/aborted có hướng dẫn phù hợp.
- Chỉ render final aggregate report; không render skill score hoặc feedback theo từng câu.
- Reload hoặc mở lại report không tạo job/report mới.

**Chú ý đặc biệt:** Không gọi endpoint end session chỉ để kiểm tra report status.

### Điều kiện hoàn thành giai đoạn 7

- Session owner hoàn thành được interview voice-first hoặc typed fallback tối đa 12 câu và nhận một aggregate report duy nhất.
- Provider lỗi/retry không tạo duplicate message/report.
- Không có audio/video/image được gửi, lưu trong database/object storage hoặc dùng để đánh giá; camera chỉ preview tại client.

---

## Giai đoạn 8: Wallet, Payout, Notification, Audit và Dashboard

**Mục tiêu:** Hoàn thiện các read model vận hành, tài chính Teacher và khả năng theo dõi sự kiện hệ thống.

### [BE] Task BE-8.1: Wallet projection và ledger query API

**Tên:** Teacher wallet summary và ledger read model.

**Mô tả:** Xây dựng API đọc wallet/ledger USD từ payment-accounting foundation ở giai đoạn 4, phục vụ Teacher xem số dư và lịch sử giao dịch trong phạm vi revenue policy đã duyệt.

**Yêu cầu đầu ra:**

- Reconcile `available_balance` và `pending_balance` từ ledger hoặc projection có thể tái tạo.
- Ledger query hỗ trợ filter type, thời gian và pagination ổn định.
- API wallet summary và ledger chỉ trả dữ liệu current Teacher.
- Test xác nhận summary khớp tổng ledger và không rò rỉ dữ liệu Teacher khác.

**Chú ý đặc biệt:** Task này không tạo lại revenue entry từ payment; write path duy nhất nằm ở BE-4.5. Balance không được tính từ riêng trang ledger hiện tại hoặc từ revenue split tự suy diễn.

### [BE] Task BE-8.2: Payout lifecycle và Admin settlement

**Tên:** Payout request, review và settlement.

**Mô tả:** Triển khai Teacher tạo payout request và Admin approve/reject/settle theo lifecycle, với USD/minimum đã chốt. Revenue split, payout destination và settlement mechanism là input còn mở; không tự suy ra từ Teacher Profile.

**Yêu cầu đầu ra:**

- Validate amount USD, minimum `0.00 USD` và available balance theo policy.
- Tạo reserve ledger atomically; chỉ payout `PENDING` được review.
- `APPROVED -> PROCESSING -> COMPLETED | FAILED`; reject/failure tạo compensating entry đúng một lần.
- Reviewer, settlement reference, failure reason, audit và notification được lưu; destination/transfer provider chỉ được tích hợp sau khi có canonical policy/source.

**Chú ý đặc biệt:** Không sửa/xóa ledger entry cũ để hoàn tiền; luôn dùng entry bù trừ. Không phát hành settlement thật hoặc credit arbitrary amount khi revenue split/destination chưa được duyệt.

### [BE] Task BE-8.3: Notification và Audit query API

**Tên:** Notification delivery, mark-read và Admin audit query.

**Mô tả:** Hoàn thiện API đọc trên nền tảng Notification/Audit đã có từ giai đoạn 1, hỗ trợ current user nhận thông báo và Admin tra cứu thao tác nhạy cảm.

**Yêu cầu đầu ra:**

- Chỉ recipient được list/mark read; mark-read idempotent.
- Notification query có filter unread/type, target hợp lệ và pagination ổn định.
- Admin audit query có filter actor/action/target/correlation/time và không trả dữ liệu đã redact.
- Contract test xác nhận mọi event bắt buộc từ PRD được ghi đúng type/target và điều hướng được ở FE.

**Chú ý đặc biệt:** Không tạo writer thứ hai ở giai đoạn này; mọi domain tiếp tục dùng interface BE-1.5 để tránh notification/audit không nhất quán.

### [BE] Task BE-8.4: Student Dashboard aggregate API

**Tên:** Current-user KPI, activity và recommendation.

**Mô tả:** Sau khi activity contract được duyệt, xây dựng dashboard projection từ enrollment, progress, interview, submission, daily activity và Problem-Tag. Trước gate này chỉ phát hành các projection không phụ thuộc metric.

**Yêu cầu đầu ra:**

- API chỉ trả current Student; KPI, heatmap, streak và study time chỉ xuất hiện khi metric/timezone contract đã duyệt; continue learning, recent interview và recommendation không được suy diễn sai từ metric thiếu.
- API đọc `student_daily_activity` đã được ghi từ giai đoạn 5/6, không tổng hợp lại side effect trong request dashboard.
- Recommendation có rule/fallback rõ ràng và không chỉ dựa vào `user_history.problem_count`.
- Query có index, pagination/limit và performance test hợp lý.

**Chú ý đặc biệt:** Không tự tạo metric nếu definition chưa được Phase 0 duyệt; timezone phải nhất quán khi ghi và đọc.

### [BE] Task BE-8.5: Teacher và Admin Dashboard API

**Tên:** Operational dashboard projections.

**Mô tả:** Cung cấp summary cho Teacher và công cụ quản trị user/payment/audit cho Admin.

**Yêu cầu đầu ra:**

- Teacher chỉ thấy doanh thu, course, Student và progress thuộc course mình.
- Admin quản lý account status, xem payment transaction/enrollment và audit theo filter/pagination; không có order resource.
- User bị ban bị từ chối ở request tiếp theo và refresh session bị vô hiệu hóa theo policy.
- Aggregate có cache/invalidation hoặc query optimization được đo trước khi áp dụng.

**Chú ý đặc biệt:** Không cache dữ liệu theo key thiếu user/role khiến rò rỉ dữ liệu giữa các Teacher.

### [FE] Task FE-8.1: Teacher Earning và Payout UI

**Tên:** Wallet summary, ledger và payout management.

**Mô tả:** Triển khai `TC04` và `TC15` từ wallet/ledger/payout API.

**Yêu cầu đầu ra:**

- Hiển thị available/pending balance USD và ledger có filter/pagination.
- Form payout validate sơ bộ nhưng hiển thị kết quả quyết định từ server.
- Hiển thị đầy đủ pending, approved, rejected, processing, completed, failed.
- Reject/failure reason và compensating balance được refresh chính xác.

**Chú ý đặc biệt:** Không tính balance bằng cách cộng danh sách trang hiện tại ở client hoặc suy diễn revenue split/payout destination.

### [FE] Task FE-8.2: Notification Center UI

**Tên:** Event notification và deep link.

**Mô tả:** Xây dựng notification list/badge/read state và điều hướng theo target.

**Yêu cầu đầu ra:**

- Chỉ hiển thị notification current user, có unread filter và pagination.
- Mark one/read state idempotent, cập nhật badge nhất quán.
- Mỗi NotificationType điều hướng tới route/resource được phép.
- Target đã xóa hoặc user mất quyền có fallback an toàn.

**Chú ý đặc biệt:** Không đưa nội dung nhạy cảm vào URL hoặc analytics event khi deep link.

### [FE] Task FE-8.3: Student Dashboard UI

**Tên:** KPI, activity, continue learning và recommendation.

**Mô tả:** Triển khai `STD01` từ current-user dashboard API, với trạng thái unavailable rõ ràng cho KPI/activity khi metric contract chưa được duyệt.

**Yêu cầu đầu ra:**

- Profile/capability và các metric đã duyệt đúng timezone/contract; KPI/heatmap/streak/study time chưa có policy phải hiển thị unavailable, không dùng mock.
- Continue Learning điều hướng tới LessonContent hợp lệ gần nhất.
- Interview history và recommended problems có empty/loading/error state.
- Không sử dụng mock data trong production flow.

**Chú ý đặc biệt:** Asset hiện có chỉ xác nhận desktop; responsive behavior ngoài asset phải theo design rule được team duyệt.

### [FE] Task FE-8.4: Teacher và Admin Dashboard UI

**Tên:** Course operations và system administration.

**Mô tả:** Triển khai Teacher dashboard/student progress và Admin user/payment/audit management.

**Yêu cầu đầu ra:**

- Teacher summary, course students và progress chỉ dùng data scoped từ API.
- Admin list có search/filter/pagination và account status action có confirmation.
- Audit/payment views không hiển thị secret hoặc payload nhạy cảm.
- Forbidden/stale-state/race condition được thông báo rõ và refresh từ server.

**Chú ý đặc biệt:** Chart library chỉ được thêm khi thực sự cần và sau khi duyệt dependency; ưu tiên bảng/summary dễ kiểm chứng cho MVP.

### Điều kiện hoàn thành giai đoạn 8

- Wallet/ledger USD có truy vết và chịu được retry/failure; payout settlement thật chỉ hoàn thành sau khi revenue split/destination/settlement policy được duyệt.
- Notification, dashboard và audit luôn đúng phạm vi current user/role.
- Các aggregate chỉ được phát hành khi có nguồn dữ liệu và định nghĩa metric rõ ràng.

---

## Giai đoạn 9: Bảo mật, kiểm thử toàn hệ thống và phát hành

**Mục tiêu:** Đưa toàn bộ MVP tới trạng thái có thể vận hành trên staging và sẵn sàng đánh giá release.

### [BE] Task BE-9.1: Security hardening và privacy review

**Tên:** Authorization, rate limiting, sanitization và secret protection.

**Mô tả:** Rà soát toàn bộ mutation/owner query, giới hạn request nhạy cảm, sanitize content và bảo vệ secret/PII.

**Yêu cầu đầu ra:**

- Authorization matrix có automated test cho cross-user/cross-role access.
- Rate limit cho login/OTP, direct checkout, signed payment webhook, judge submit và interview answer flow.
- Markdown/HTML được sanitize ở boundary phù hợp; upload có MIME/size validation.
- Secret scan, dependency audit và log redaction pass.

**Chú ý đặc biệt:** SQLAlchemy không thay thế authorization hoặc input validation; rate limit không được dùng làm biện pháp duy nhất chống duplicate side effect.

### [BE] Task BE-9.2: Backend test suite và migration verification

**Tên:** Unit, integration, contract và concurrency tests.

**Mô tả:** Hoàn thiện test cho Auth Provider, Business Application, worker và Judge theo các luồng rủi ro cao.

**Yêu cầu đầu ra:**

- Unit test cho state machine, permission, money calculation và projection.
- Integration test với database riêng, rollback/cleanup độc lập.
- Contract test so sánh generated OpenAPI với API spec đã duyệt.
- Concurrency/idempotency test cho payment, enrollment, quiz submit, judge result, report và payout.

**Chú ý đặc biệt:** Không đặt mục tiêu coverage như thay thế cho test nghiệp vụ; các nhánh bảo mật và tài chính phải được kiểm thử trực tiếp.

### [BE] Task BE-9.3: Observability và staging backend

**Tên:** Logging, metrics, tracing và deployment backend.

**Mô tả:** Chuẩn bị image/config production, migration job, worker health và observability cho staging.

**Yêu cầu đầu ra:**

- Structured log có correlation ID nhưng đã redact dữ liệu nhạy cảm.
- Metrics/alert cho API error, queue lag, judge failure, webhook failure và report failure.
- Staging deploy có Auth, Business, Judge, worker và các dependency cần thiết.
- Migration chạy theo job kiểm soát, có backup/rollback runbook và smoke test.

**Chú ý đặc biệt:** Không hard-code database, PayOS, AI, SMTP, Redis hoặc object-storage secret trong image/repository.

### [FE] Task FE-9.1: Frontend component, integration và E2E tests

**Tên:** Automated tests cho các critical user journeys.

**Mô tả:** Bổ sung test ở cấp component/integration và Playwright E2E cho các luồng chính.

**Yêu cầu đầu ra:**

- Test Auth, teacher application, course moderation, checkout/payment, learning/quiz, OJ, interview và payout.
- Test loading, empty, error, expired, forbidden và duplicate-submit state.
- API được mock ở component test; E2E staging/test env dùng dữ liệu seed kiểm soát được.
- Test có artifact screenshot/trace khi thất bại.

**Chú ý đặc biệt:** E2E payment/AI/Judge cần sandbox/fake adapter ổn định; không phụ thuộc ngẫu nhiên vào provider production.

### [FE] Task FE-9.2: Accessibility, responsive và production build

**Tên:** UI quality và release optimization.

**Mô tả:** Rà soát accessibility, keyboard navigation, responsive layout, bundle và runtime configuration.

**Yêu cầu đầu ra:**

- Form, modal, table, editor và status message có label/focus/keyboard behavior phù hợp.
- Các màn hình trọng yếu hoạt động trên viewport mục tiêu đã duyệt.
- `bun run lint` và `bun run build` thành công; bundle warning được xử lý hoặc ghi nhận.
- Runtime API URL/config không hard-code theo môi trường development.

**Chú ý đặc biệt:** Code editor và chart có yêu cầu accessibility riêng; phải có fallback text/table khi cần.

### [FE] Task FE-9.3: Staging smoke test và release acceptance

**Tên:** Xác nhận MVP end-to-end trên staging.

**Mô tả:** Chạy checklist release theo ba vai trò trên môi trường staging sau migration/deploy.

**Yêu cầu đầu ra:**

- Student: auth, mua course, học, quiz, submit code, interview, notification và dashboard.
- Teacher: application approved, authoring, moderation, xem Student/revenue và tạo payout.
- Admin: review application/course/payout, quản lý account và xem audit/payment.
- Danh sách defect có severity, owner, trạng thái; release chỉ được duyệt khi không còn blocker/critical.

**Chú ý đặc biệt:** Dữ liệu test staging không dùng PII thật; webhook/provider callback phải trỏ đúng staging.

### Điều kiện hoàn thành giai đoạn 9

- Automated test, migration verification, security review và production build đều đạt.
- Critical flows chạy end-to-end trên staging với dữ liệu kiểm soát được.
- Có runbook deploy, rollback, incident và danh sách quyết định/debt còn lại.

---

## 4. Definition of Done áp dụng cho mọi task

Một task chỉ được đánh dấu hoàn thành khi đáp ứng toàn bộ điều kiện phù hợp sau:

- Đầu ra của task và state/error/ownership rule đã được triển khai đúng contract.
- Có test tự động ở cấp phù hợp; các test liên quan đang pass.
- Migration đã được thử upgrade và kiểm tra dữ liệu nếu task thay đổi database.
- FE chạy `bun run lint` và `bun run build` thành công khi task thay đổi frontend.
- BE chạy test của service liên quan; generated OpenAPI không lệch contract khi task thay đổi API.
- Không đưa secret, dữ liệu cá nhân hoặc dữ liệu thanh toán nhạy cảm vào source/log/test fixture.
- Tài liệu PRD, database proposal, API spec và wireframe được cập nhật nếu quyết định hoặc contract thay đổi.
- Code được review về authorization, ownership, idempotency và error state nếu task thuộc luồng nhạy cảm.

## 5. Các mốc kiểm chứng liên đội

| Mốc | Phạm vi xác nhận | Điều kiện để đi tiếp |
|---|---|---|
| M0 | Quyết định, schema mapping, API/UI contract | Các quyết định đã chốt là baseline; chỉ revenue settlement và activity metrics còn gate workstream tương ứng |
| M1 | Auth và foundation | Login/token/guard hoạt động end-to-end |
| M2 | Teacher capability | Application lifecycle và Admin review hoàn chỉnh |
| M3 | Course supply | Authoring, moderation và catalog thống nhất trạng thái |
| M4 | Commerce | Direct checkout USD, signed PayOS mock webhook và enrollment idempotent |
| M5 | Learning | Reading/Quiz/Problem access và progress đúng rule |
| M6 | Judge | Sandbox an toàn, hidden testcase không bị lộ |
| M7 | Interview | Voice-first/typed fallback, một session tạo tối đa một aggregate report và không lưu media |
| M8 | Operations | Ledger/payout/dashboard/notification/audit có nguồn dữ liệu đúng; metric và settlement chỉ mở sau policy tương ứng |
| M9 | Release | Security, E2E, migration và staging acceptance đạt |

## 6. Ngoài phạm vi của kế hoạch MVP

- Video như một loại `LessonContent`, video progress, HLS transcoding hoặc lưu media recording.
- Live classroom/video conference.
- Cart, Order, Order Item hoặc checkout nhiều course.
- Payout tự động không qua Admin.
- Subscription, coupon engine phức tạp, multi-currency settlement, hoặc revenue split/payout destination chưa được duyệt.
- Giao diện chatbot cho AI Interview, xử lý/lưu media microphone-camera, camera proctoring hoặc feedback theo từng câu.
- Các tính năng chỉ xuất hiện trong wireframe cũ nhưng không có trong PRD/API contract đã chốt.
