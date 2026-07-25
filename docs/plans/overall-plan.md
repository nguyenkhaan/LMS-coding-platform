# Kế hoạch phát triển tổng thể: SkillBoost - LMS Coding Platform

Tài liệu này đặc tả toàn bộ vòng đời phát triển dự án từ giai đoạn thiết kế UI/UX (Figma), định nghĩa API Contract, phát triển nền tảng, xây dựng các module nghiệp vụ phức tạp (Online Judge, AI Interview, PayOS), đến khâu tối ưu bảo mật, kiểm thử E2E và triển khai Staging. 

---

## MỤC LỤC
1. [Giai đoạn 0: Thiết kế UI/UX & Đặc tả giao tiếp (Phase 0: Design & Specs)](#giai-doan-0-thiet-ke-uiux--dac-ta-giao-tiep-phase-0-design--specs)
2. [Giai đoạn 1: Khởi tạo hạ tầng & Cấu hình Core (Phase 1: Base Setup & Infrastructure)](#giai-doan-1-khoi-tao-ha-tang--cau-hinh-core-phase-1-base-setup--infrastructure)
3. [Giai đoạn 2: Quản lý Định danh & Phân quyền (Phase 2: Authentication & Identity Verification)](#giai-doan-2-quan-ly-dinh-danh--phan-quyen-phase-2-authentication--identity-verification)
4. [Giai đoạn 3: Soạn thảo Học liệu & Lớp học lý thuyết (Phase 3: Courses & Curriculum Management)](#giai-doan-3-soan-thao-hoc-lieu--lop-hoc-ly-thuyet-phase-3-courses--curriculum-management)
5. [Giai đoạn 4: Hệ thống thực hành giải thuật & Chấm bài (Phase 4: Exercises & Evaluation Engines)](#giai-doan-4-he-thong-thuc-hanh-giai-thuat--cham-bai-phase-4-exercises--evaluation-engines)
6. [Giai đoạn 5: Tương tác AI Interview & Tích hợp cổng PayOS (Phase 5: AI Interview & PayOS Checkout)](#giai-doan-5-tuong-tac-ai-interview--tich-hop-cong-payos-phase-5-ai-interview--payos-checkout)
7. [Giai đoạn 6: Tương tác Cộng đồng & Dashboard Quản trị (Phase 6: Moderation, Interactions & Analytics)](#giai-doan-6-tuong-tac-cong-dong--dashboard-quan-tri-phase-6-moderation-interactions--analytics)
8. [Giai đoạn 7: Bảo mật, Kiểm thử E2E & Triển khai Staging (Phase 7: Hardening, E2E Testing & Staging Release)](#giai-doan-7-bao-mat-kiem-thu-e2e--trien-khai-staging-phase-7-hardening-e2e-testing--staging-release)

---

## Giai đoạn 0: Thiết kế UI/UX & Đặc tả giao tiếp (Phase 0: Design & Specs)
Mục tiêu: Đảm bảo hai đội FE và BE thống nhất hoàn toàn về luồng trải nghiệm người dùng, cấu trúc dữ liệu và phương thức giao tiếp trước khi viết code.

### [FE] Task FE-0.1: Thiết kế giao diện Figma & Xây dựng Design System Chi Tiết
*   **Mô tả:** Thiết kế các màn hình UI trên Figma bao gồm: Trang chủ học viên (Student Home), Classroom Workspace, Code Editor Workspace, AI Mock Interview Chat, Teacher Dashboard và Admin CCCD Verification.
*   **Yêu cầu đảm bảo:**
    *   **Thống nhất Design System & Color Tokens (HSL):**
        *   *Sleek Dark Mode (Mặc định cho Coding & AI Chat):* Main Background (`hsl(220, 20%, 8%)`), Card Background (`hsl(220, 16%, 12%)`), Border (`hsl(220, 12%, 18%)`), Text Primary (`hsl(220, 10%, 95%)`), Text Secondary (`hsl(220, 8%, 65%)`).
        *   *Harmonious Light Mode:* Main Background (`hsl(210, 20%, 98%)`), Card Background (`hsl(0, 0%, 100%)`), Border (`hsl(210, 14%, 90%)`), Text Primary (`hsl(220, 20%, 12%)`), Text Secondary (`hsl(220, 12%, 45%)`).
        *   *Brand / Accents:* Primary Indigo (`hsl(235, 75%, 55%)`), Accent Purple (`hsl(275, 90%, 60%)`), Cyan Accent (`hsl(190, 95%, 50%)`).
        *   *Status Colors:* Success green (`hsl(142, 70%, 45%)`), Warning yellow (`hsl(38, 92%, 50%)`), Error red (`hsl(0, 84%, 60%)`).
    *   **Mô tả chi tiết các màn hình cần thiết kế:**
        1.  *Student Home / Dashboard:* Lưới Course Cards (có thanh tiến độ progress bar dạng đường nằm ngang và phần trăm hoàn thành), biểu đồ hoạt động (Github-like activity heatmap), panel AI Interview history (điểm số radial gauge, chủ đề, thời gian).
        2.  *Classroom Workspace (Chia đôi màn hình dọc):* Sidebar lộ trình học bên trái (accordion danh sách chương, các item bài học hiển thị kèm tick xanh completed / lock xám / half-tick in progress). Cột chính bên phải có các tab chuyển đổi: Bài đọc lý thuyết (Markdown viewer), Trình phát Video (HLS player tích hợp menu tốc độ phát), Làm bài Quiz (các thẻ trắc nghiệm, radio button đáp án, nút submit), Hỏi đáp (comment phân cấp 2 tầng hiển thị avatar, thời gian dạng "5 phút trước").
        3.  *Online Judge Code Editor Workspace:* Cột trái hiển thị đề bài (đề bài Markdown, định dạng input/output, sample testcases, giới hạn thời gian/bộ nhớ). Cột phải trên là Monaco Code Editor (dropdown chọn ngôn ngữ, theme dark/light, reset code). Cột phải dưới là Console Panel gồm tab Stdin (nhập testcase tự chọn) và tab Stdout/Kết quả (hiển thị trạng thái AC/WA/TLE/MLE, thời gian chạy, dung lượng RAM, diff giữa output thực tế và output mong muốn).
        4.  *AI Mock Interview Chat Workspace:* Khung chat bong bóng (tin nhắn AI Recruiter màu tím nhẹ, tin nhắn học viên màu xám đậm). Sidebar bên trái hiển thị chủ đề phỏng vấn, số thứ tự câu hỏi (ví dụ: "Câu 3 / 8"), nút dừng phỏng vấn sớm. Khung chat hiển thị hiệu ứng ba dấu chấm nhấp nháy khi AI đang sinh câu trả lời và tự động cuộn xuống cuối (auto-scroll). Ô nhập liệu bị disable trong lúc chờ AI phản hồi.
        5.  *AI Mock Interview Report View:* Radial gauge thể hiện điểm tổng quát trên thang 10, hai cột chi tiết Điểm Mạnh (Strengths - màu xanh) và Điểm Cần Cải Thiện (Weaknesses - màu đỏ), danh sách Gợi Ý Lộ Trình (Suggestions), transcript chat đính kèm các feedback annotations của AI dưới mỗi câu trả lời.
        6.  *PayOS Checkout Page:* Panel thông tin đơn hàng, tổng tiền, đồng hồ đếm ngược 15 phút. Khung hiển thị VietQR Code động (có ảnh quét QR, logo ngân hàng, số tài khoản nhận, số tiền và nội dung chuyển khoản tự động kèm nút copy nhanh). Thanh thông báo quét sóng trạng thái "Đang đợi giao dịch..." tự động chuyển thành màn hình "Thanh toán thành công" khi nhận được webhook qua SSE.
        7.  *Become Teacher Registration:* Form điền thông tin (Họ tên thật, CCCD number, motivation), khung kéo thả file upload CCCD mặt trước, CCCD mặt sau và file PDF CV. Hiển thị thumbnail preview của ảnh CCCD ngay sau khi chọn file.
        8.  *Teacher Dashboard & Analytics:* Khung thống kê tài chính (doanh thu, số dư), biểu đồ đường thẳng ApexCharts (Doanh thu theo ngày/tuần/tháng), bảng danh sách học viên kèm theo cột tiến độ bài học cuối cùng.
        9.  *Admin Identity Verification Panel:* Bảng danh sách đơn PENDING. Giao diện đối chiếu hiển thị ảnh CCCD mặt trước/sau bên cạnh thông tin điền form, hiển thị so sánh chữ AI OCR (trích xuất tự động) và ô nhập ghi chú từ chối (reject note).
    *   **Thư viện component dùng chung (Design Tokens):** Buttons (Primary, Secondary, Ghost, Danger), Inputs (Text, Password, Textarea, Select), Cards (Course Card, Transaction Card, Comment Card), Alert Modals (Confirm purchase, Terminate interview), Spinners/Loaders (Shimmer skeletons).
    *   **Trạng thái tương tác:** Trạng thái hover tăng nhẹ độ sáng border, focus hiển thị ring màu primary, disabled mờ 50% và chặn pointer-events.
*   **Acceptance Criteria:** Toàn bộ các màn hình UI trên Figma được phê duyệt bởi Product Owner, có đầy đủ Design Spec cho từng component để FE dev cắt CSS.
*   **Verification:** Kiểm tra Figma file có link chia sẻ và tài liệu hướng dẫn kích thước chi tiết (Figma Inspect).

### [BE] Task BE-0.1: Đặc tả Cấu trúc DB & Hoàn thiện Kịch bản Migration
*   **Mô tả:** Rà soát lại conceptual schema trong PRD đối chiếu với các file models hiện tại. Viết tài liệu mô tả quan hệ (ERD) và chuẩn bị các script dữ liệu mẫu (Seed Data) cho database.
*   **Yêu cầu đảm bảo:**
    *   Định nghĩa SQLAlchemy ORM Models đầy đủ các cột và kiểu dữ liệu tương ứng:
        *   `user`: id (int), email (str, unique), password (str), account_status (enum AccountStatus: ACTIVE, BANNED, UNVERIFIED), created_at (datetime).
        *   `user_role`: user_id (int, FK), role (enum Role: STUDENT, TEACHER, ADMIN).
        *   `teacher_profile`: user_id (int, FK), bio (str), verified (bool), cv_url (str).
        *   `teacher_register`: id (int), teacher_id (int, FK), motivation (str), cccd (str, unique), cccd_front_url (str), cccd_back_url (str), status (enum TeacherRegisterStatus: PENDING, AGREE, REJECT), reviewed_note (str), reviewed_by (int, FK).
        *   `courses`: id (int), title (str), teacher_id (int, FK), slug (str, unique), price (double), status (enum CourseStatus: DRAFT, PENDING_REVIEW, PUBLISHED, ARCHIVED).
        *   `enrollment`: id (int), student_id (int, FK), course_id (int, FK), enrolled_at (datetime).
        *   `sections`: id (int), course_id (int, FK), title (str), position (int).
        *   `lesson`: id (int), section_id (int, FK), title (str), position (int).
        *   `lesson_content`: id (int), lesson_id (int, FK), content_type (enum LessonContentType: READING, QUIZ, PROBLEM), content_id (int), position (int).
        *   `lesson_content_progress`: enrollment_id (int, FK), lesson_content_id (int, FK), completed (bool), completed_at (datetime) -> UniqueConstraint(enrollment_id, lesson_content_id).
        *   `reading_content`: id (int), title (str), content (text).
        *   `quizzes`: id (int), title (str), passing_score (double), attempts (int).
        *   `quiz_submission`: id (int), quiz_id (int, FK), student_id (int, FK), score (double), submitted_at (datetime), answers (JSON).
        *   `problem`: id (int), title (str), slug (str, unique), statement (text), input_description (text), output_description (text), constraints (text), difficulty (enum ProblemDifficulty: EASY, MEDIUM, HARD), public (bool).
        *   `testcase`: id (int), problem_id (int, FK), input_file (str), output_file (str), score (double), is_hidden (bool).
        *   `submission`: id (int), problem_id (int, FK), student_id (int, FK), language_id (int, FK), source_code (text), status (enum ProblemSubmissionStatus: PENDING, RUNNING, ACCEPTED, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, MEMORY_LIMIT_EXCEEDED, RUNTIME_ERROR, COMPILE_ERROR), score (double), runtime_ms (double), memory_kb (double).
        *   `interview_session`: id (int), student_id (int, FK), topic (str), level (enum InterviewLevel: INTERN, FRESHER, JUNIOR, SENIOR), status (bool), started_at (datetime), ended_at (datetime).
        *   `interview_message`: id (int), session_id (int, FK), sender (str: "AI" | "HUMAN"), content (str).
        *   `interview_reports`: id (int), session_id (int, FK), overall_score (double), strengths (str), weaknesses (str), suggestions (str).
        *   `transaction`: id (int), user_id (int, FK), course_id (int, FK), amount (double), status (enum PaymentStatus: COMPLETE, PENDING, FAILED), transaction_code (str, unique), payos_code (str, unique), payos_link (str), created_at (datetime).
    *   **Tạo Database Indexes tối ưu:** Thiết lập index trên các trường: `user.email`, `courses.slug`, `courses.status`, `enrollment.student_id`, `enrollment.course_id`, `submission.student_id`, `submission.problem_id`, `interview_message.session_id`, `transaction.transaction_code`, `transaction.payos_code`.
    *   Cấu hình Alembic chính xác để tự động sinh migration script thông qua metadata của SQLAlchemy models.
*   **Acceptance Criteria:** Chạy thành công script khởi tạo bảng và chèn dữ liệu mẫu (users, courses, languages) mà không gặp lỗi ràng buộc.
*   **Verification:** Run `alembic current` hiển thị head migration, kiểm tra các bảng được tạo đầy đủ trong postgres.

### [BE/FE] Task BE/FE-0.2: Định nghĩa API Contracts (OpenAPI / Swagger Spec)
*   **Mô tả:** Thiết kế các endpoint giao tiếp giữa Frontend và Backend. Định nghĩa rõ URL, Method, Request Body, Response JSON, và các Error Code (400, 401, 403, 404, 422, 500).
*   **Yêu cầu đảm bảo:**
    *   Sử dụng Pydantic schemas trong FastAPI để sinh ra Swagger UI tự động tại `/docs`.
    *   Mọi response lỗi của API đều được chuẩn hóa theo định dạng JSON thống nhất:
        ```json
        {
          "message": "Chi tiết thông báo lỗi thân thiện với người dùng",
          "error_code": "RESOURCE_NOT_FOUND",
          "details": []
        }
        ```
    *   Định nghĩa rõ cấu trúc dữ liệu cho các đầu vào và ra của từng endpoint nghiệp vụ chính (OAuth2 login token, course catalog pagination, quiz scoring submit body, OJ problem run/submit body, AI chat stream payload, PayOS transaction creation body).
*   **Acceptance Criteria:** File JSON định dạng OpenAPI 3.0 được cam kết vào repository tại thư mục `docs/specs/api.json`.
*   **Verification:** Nhập file JSON vào Swagger Editor hoặc Postman chạy thành công không có cảnh báo cú pháp.

---

## Giai đoạn 1: Khởi tạo hạ tầng & Cấu hình Core (Phase 1: Base Setup & Infrastructure)
Mục tiêu: Xây dựng nền tảng hạ tầng, sửa lỗi hiện tại và thiết lập cơ chế kiểm soát chất lượng mã nguồn.

### [FE] Task FE-1.1: Khởi tạo base React & Cấu hình Tailwind v4
*   **Mô tả:** Khởi tạo cấu trúc dự án React với Vite, cấu hình Tailwind CSS v4 toàn cục.
*   **Yêu cầu đảm bảo:**
    *   Tải ảnh favicon.svg hợp lệ vào thư mục `public/` để trình duyệt tải tĩnh thành công, loại bỏ cảnh báo lỗi đỏ trong console log của Vite server.
    *   Cấu hình global CSS (`layout.css` hoặc `index.css`) import Tailwind CSS v4 chính xác, thiết lập font Outfit/Inter làm mặc định cho body và font JetBrains Mono cho các khối code snippet.
    *   Cài đặt cấu trúc thư mục rõ ràng: `src/components/` (chứa các Design Tokens dùng chung), `src/hooks/`, `src/pages/`, `src/services/`, `src/utils/`.
*   **Acceptance Criteria:** Trang web khởi động bình thường ở cổng `5173`, hiển thị chữ "Hello world" không có lỗi đỏ ở console trình duyệt.
*   **Verification:** Chạy lệnh `bun run build` báo thành công.

### [BE] Task BE-1.1: Cấu hình Middleware, CORS & Định dạng Response
*   **Mô tả:** Thiết lập cấu hình CORS trong `business-application` để giao tiếp với frontend. Tạo lớp Handler xử lý lỗi tập trung để chuyển các lỗi ngoại lệ (Exceptions) thành response JSON chuẩn hóa.
*   **Yêu cầu đảm bảo:**
    *   Cấu hình `CORSMiddleware` của FastAPI: chỉ cho phép origin của frontend (cổng `http://localhost:5173` hoặc domain production/staging) được phép gửi request, cấu hình `allow_credentials=True` để hỗ trợ truyền cookies.
    *   Đăng ký exception handlers tùy chỉnh trong FastAPI để bắt lỗi validation của Pydantic (`RequestValidationError`) và lỗi DB (`SQLAlchemyError`), tự động chuyển đổi thành response JSON chuẩn hóa có status code tương ứng (400, 422, 500).
*   **Acceptance Criteria:** Frontend gọi API không bị lỗi Blocked by CORS.
*   **Verification:** Gửi request OPTIONS đến cổng 4000 bằng curl và kiểm tra headers `Access-Control-Allow-Origin`.

### [BE] Task BE-1.2: Thiết lập SMTP Email Client & Cấu hình RabbitMQ Queue
*   **Mô tả:** Thiết lập SMTP client (chạy local bằng Mailpit) và cấu hình RabbitMQ (được thiết lập qua Docker) để sẵn sàng cho các tiến trình xử lý bất đồng bộ (chấm bài, transcode video).
*   **Yêu cầu đảm bảo:**
    *   SMTP Client đọc các tham số kết nối (`SMTP_HOST=localhost`, `SMTP_PORT=1025`, `SMTP_USER`, `SMTP_PASSWORD`) từ `.env`, hỗ trợ kết nối bảo mật TLS nếu cấu hình trên production.
    *   Sử dụng thư viện `aio-pika` để kết nối RabbitMQ từ FastAPI. Viết lớp quản lý kết nối RabbitMQ (RabbitMQ Connection Manager) tích hợp cơ chế tự động kết nối lại (auto-reconnect) bằng decorator retry (thử lại tối đa 5 lần với thời gian trễ tăng dần exponential backoff nếu RabbitMQ broker tạm thời mất tín hiệu).
    *   Khai báo sẵn các queue: `submission_queue` (để gửi tác vụ chấm bài OJ), `transcode_queue` (để gửi tác vụ cắt nhỏ video bài giảng HLS), `email_queue` (để gửi tác vụ gửi mail xác thực/hóa đơn).
*   **Acceptance Criteria:** Gửi thử mail thành công đến hòm thư nhận dạng test, kiểm tra ứng dụng nhận được kết nối ping/xác thực tới RabbitMQ thành công.
*   **Verification:** Chạy test script gửi email mẫu và kiểm tra kết nối tới RabbitMQ.

---

## Giai đoạn 2: Quản lý Định danh & Phân quyền (Phase 2: Authentication & Identity Verification)
Mục tiêu: Đảm bảo an toàn thông tin đăng nhập, xác minh CCCD để nâng cấp học viên lên giảng viên.

### [FE] Task FE-2.1: Giao diện Auth & Tích hợp Luồng OAuth2 (Đăng ký, Kích hoạt & Đăng nhập)
*   **Mô tả:** Thiết kế màn hình đăng ký tài khoản học viên và nhập mã xác minh gửi qua Email (gọi tới API của `business-application`). Tích hợp nút Đăng nhập kết nối với hệ thống `auth-provider` bằng luồng OAuth2 Authorization Code.
*   **Yêu cầu đảm bảo:**
    *   **Giao diện Đăng ký (`/auth/register`):** Form nhập Họ Tên, Email (kiểm tra định dạng email bằng regex), Mật khẩu (độ dài >= 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường và 1 ký số), nút bấm "Đăng Ký". Khi gửi request thành công, chuyển hướng đến trang OTP.
    *   **Giao diện Nhập OTP (`/auth/verify-otp`):** 6 ô nhập mã OTP độc lập, tự động focus chuyển sang ô kế tiếp khi gõ chữ (auto tab focus) và tự động gọi API submit khi điền đủ 6 ô. Nút "Gửi lại OTP" có đồng hồ đếm ngược (countdown) 60 giây trước khi cho phép bấm lại.
    *   **Tích hợp Luồng OAuth2 Google/Auth-Server:**
        *   Khi nhấn "Đăng nhập Google/SkillBoost", trình duyệt redirect sang `/auth/authorize?client_id=frontend&response_type=code&redirect_uri=http://localhost:5173/auth/callback`.
        *   Xây dựng page callback `/auth/callback`. Frontend-side trích xuất mã query parameter `code`, gửi request POST ở backend-side sang cổng `auth-provider` endpoint `/api/auth/token` để đổi mã lấy cặp tokens (`access_token`, `refresh_token`).
        *   Lưu trữ cặp token này vào cookie của trình duyệt dạng `HttpOnly`, `Secure`, `SameSite=Strict` để phòng chống đánh cắp token bằng tấn công XSS. Redirect người dùng sang `/student/dashboard`.
*   **Acceptance Criteria:** Đăng ký thành công và người dùng nhập được mã verify để kích hoạt tài khoản. Flow đăng nhập -> chuyển sang `auth-provider` -> đăng nhập thành công -> chuyển về frontend callback -> tự động trao đổi và lưu token vào cookies -> chuyển sang trang chủ trơn tru.
*   **Verification:** Kiểm tra quy trình đăng ký/kích hoạt tài khoản; sử dụng Browser DevTools kiểm tra xem các token (`access_token`, `refresh_token`) có được lưu trữ đúng cấu hình HttpOnly/Secure trong Cookies sau khi đăng nhập thành công không.

### [BE] Task BE-2.1: JWT Verification Middleware, Guard Phân quyền & OTP Mailer
*   **Mô tả:** Viết decorator hoặc Depends function `require_role(allowed_roles)` trong FastAPI để kiểm soát truy cập dựa trên Role (`STUDENT`, `TEACHER`, `ADMIN`). Đồng thời, tích hợp SMTP Mailer để gửi liên kết xác minh đăng ký tài khoản học viên.
*   **Yêu cầu đảm bảo:**
    *   **Middleware Xác thực JWT:** Viết hàm dependency `get_current_user` giải mã JWT token. Token được đọc từ HTTP header `Authorization: Bearer <token>` hoặc trực tiếp từ cookie `access_token`.
    *   **Public Key Caching:** Load public cert dạng JWK công khai từ `auth-provider` tại endpoint `/oauth/certs` để giải mã signature của JWT. Thực hiện caching JWK vào Redis (TTL 24 giờ) để tránh việc gọi HTTP request qua lại giữa các service trên mỗi API request.
    *   **Guard Phân Quyền:** Hàm `require_role(allowed_roles: List[Role])` trả về mã lỗi `403 Forbidden` nếu vai trò hiện tại của người dùng nằm ngoài danh sách được cho phép.
    *   **OTP Verification Service:** Khi học viên mới đăng ký, tạo mã OTP 6 chữ số ngẫu nhiên lưu vào Redis (TTL 10 phút), sau đó đẩy một job chứa `{ "email": ..., "otp": ... }` vào queue `email_queue` của RabbitMQ. Background worker sẽ lấy job ra và sử dụng thư viện `emails` gửi email xác thực kích hoạt tài khoản.
*   **Acceptance Criteria:** Trả về lỗi 401 Unauthorized nếu token hết hạn hoặc không hợp lệ; khi đăng ký tài khoản mới, hệ thống tự động gửi email đến người dùng để họ có thể verify được tài khoản của mình. 
*   **Verification:** Kiểm tra hòm thư nhận để xem mail verify được gửi đến đúng lúc.

### [FE] Task FE-2.2: Giao diện Yêu cầu Làm Giảng viên (Become Teacher Form)
*   **Mô tả:** Thiết kế form cho phép học viên điền thông tin cá nhân, động lực và tải lên ảnh CCCD mặt trước/sau cùng CV file PDF.
*   **Yêu cầu đảm bảo:**
    *   **Giao diện (`/student/become-teacher`):** Ô nhập Họ Tên, Động lực giảng dạy (textarea), Số CCCD (validate đúng 12 chữ số).
    *   **Khung Kéo Thả File Uploader:** 3 khu vực kéo thả để chọn file (Ảnh CCCD mặt trước, Ảnh CCCD mặt sau, CV PDF). Giới hạn kích thước file tải lên < 5MB trên client.
    *   **Preview Ảnh:** Hiển thị thumbnail của ảnh thẻ CCCD đã chọn trực tiếp trên giao diện và hiển thị thanh tiến trình tải lên (progress bar) cho từng tệp tin khi gọi API.
*   **Acceptance Criteria:** Gửi toàn bộ form dữ liệu và nhận phản hồi đơn hàng ở trạng thái `PENDING`.
*   **Verification:** Thử tải lên file ZIP hoặc file ảnh quá nặng (>5MB), giao diện phải hiển thị cảnh báo lỗi định dạng/kích thước.

### [BE] Task BE-2.2: API Đăng ký làm Giảng viên & Tích hợp MinIO Storage
*   **Mô tả:** API nhận file upload ảnh CCCD và CV từ học viên, lưu trữ chúng vào bucket riêng tư trên MinIO và tạo bản ghi trạng thái `PENDING` trong bảng `teacher_register`.
*   **Yêu cầu đảm bảo:**
    *   **MinIO Bucket Key Structure:** Lưu trữ tệp tin vào private bucket tên là `identity-documents`. Quy chuẩn đường dẫn lưu file: `cccd/{user_id}/front_{timestamp}.png`, `cccd/{user_id}/back_{timestamp}.png`, và `cv/{user_id}/cv_{timestamp}.pdf`.
    *   **Xác thực đơn trùng lặp:** Chỉ cho phép đăng ký nếu người dùng chưa có đơn nào ở trạng thái `PENDING` hoặc `AGREE` trong bảng `teacher_register`. Nếu có, trả lời lỗi `400 Bad Request` kèm message "Yêu cầu đăng ký của bạn đang được xử lý hoặc tài khoản đã là giảng viên".
    *   Mã hóa tên tệp tin trước khi lưu trữ để bảo mật thông tin cá nhân.
*   **Acceptance Criteria:** Bản ghi trong cơ sở dữ liệu lưu chính xác đường dẫn file lưu trữ trên MinIO.
*   **Verification:** Kiểm tra dữ liệu trong MinIO Console xem tệp tin tải lên có tồn tại đúng bucket không.

### [FE] Task FE-2.3: Dashboard Admin Duyệt Hồ Sơ & Đối Chiếu CCCD
*   **Mô tả:** Giao diện cho Admin hiển thị danh sách đơn đăng ký giảng viên chờ xử lý. Thiết kế khung đối chiếu thông tin điền trong đơn và tệp ảnh CCCD đính kèm. Tích hợp công cụ OCR để (Cloudflare AI Worker) để có thể so sánh sự giống nhau giữa thông tin người dùng nhập vào và thông tin trên cccd.
*   **Yêu cầu đảm bảo:**
    *   **Giao diện (`/admin/verifications`):** Bảng danh sách đơn hàng `PENDING` phân trang.
    *   **Khung Xem Chi Tiết Đối Chiếu:** Click vào dòng đơn hiển thị popup/detail. Hiển thị song song hai ảnh CCCD phóng to (hỗ trợ xoay ảnh, zoom) bên cạnh thông tin điền form.
    *   **Tích hợp AI OCR:** Hiển thị phần tự động trích xuất chữ từ ảnh CCCD (Họ tên, Số CCCD từ OCR). Nổi bật bằng màu vàng các trường thông tin không trùng khớp giữa dữ liệu người dùng nhập và OCR (ví dụ: gõ sai một ký tự trong họ tên).
    *   Nút Reject bắt buộc Admin nhập ghi chú lý do để gửi mail phản hồi cho học viên.
*   **Acceptance Criteria:** Admin có thể hoàn thành việc duyệt hoặc từ chối đơn chỉ với tối đa 3 thao tác click chuột.
*   **Verification:** Kiểm tra độ responsive của bảng danh sách đơn duyệt trên màn hình nhỏ.

### [BE] Task BE-2.3: API Duyệt Đơn Đăng Ký Giảng Viên & Transactional Role Promotion
*   **Mô tả:** API tiếp nhận quyết định duyệt/từ chối từ Admin. Nếu đồng ý, cập nhật trạng thái đơn thành `AGREE`, chèn vai trò `TEACHER` vào bảng `user_role`, khởi tạo thông tin bảng `teacher_profile` trong cùng một Database Transaction.
*   **Yêu cầu đảm bảo:**
    *   **API Endpoint:** `POST /api/admin/teacher-registers/{id}/verify` (Chỉ cho phép tài khoản có vai trò `ADMIN` gọi).
    *   **PostgreSQL Transaction Scope:** Đảm bảo toàn bộ câu lệnh SQL (cập nhật bảng `teacher_register` thành `AGREE`/`REJECT`, thêm quyền `TEACHER` vào `user_role`, khởi tạo dòng trống trong `teacher_profile`) chạy trong một Session Transaction duy nhất. Bất cứ lỗi nào xảy ra sẽ rollback toàn bộ.
    *   **Notification:** Đẩy một job gửi email thông báo kết quả duyệt đơn (đã duyệt / bị từ chối kèm lý do) vào queue `email_queue`.
*   **Acceptance Criteria:** Tài khoản học viên được tự động đổi phân quyền ngay lập tức sau khi Admin duyệt đơn thành công.
*   **Verification:** Sử dụng database client kiểm tra vai trò mới của user sau khi Admin phê duyệt.

---

## Giai đoạn 3: Soạn thảo Học liệu & Lớp học lý thuyết (Phase 3: Courses & Curriculum Management)
Mục tiêu: Giảng viên có thể biên soạn lộ trình và học viên có thể học lý thuyết mượt mà.

### [FE] Task FE-3.1: Trang Tìm kiếm & Danh mục Khóa học (Course Catalog)
*   **Mô tả:** Giao diện cho phép học viên duyệt danh sách các khóa học hiện có. Hỗ trợ tìm kiếm theo từ khóa, lọc theo tag chuyên ngành, lọc theo giá tiền (Miễn phí/Trả phí).
*   **Yêu cầu đảm bảo:**
    *   **Bộ Lọc Phản Hồi Nhanh:** Search input, bộ chọn lọc checkbox cho chuyên ngành (Frontend, Backend, AI,...), bộ lọc trượt chọn khoảng giá, toggle Miễn phí/Trả phí.
    *   **Debounce Search:** Input tìm kiếm có delay debounce 300ms trước khi gửi request API lên backend.
    *   **Lưới Khóa Học:** Thẻ Course Card hiển thị đầy đủ thông tin: Ảnh thumbnail, Tiêu đề khóa học, Tên giảng viên, Điểm đánh giá trung bình (sao), Giá tiền định dạng VND (ví dụ: "299,000 đ") hoặc nhãn "Miễn Phí".
*   **Acceptance Criteria:** Tốc độ lọc kết quả dưới 300ms kể từ khi người dùng thay đổi lựa chọn bộ lọc.
*   **Verification:** Kiểm thử giao diện hiển thị khi không tìm thấy khóa học nào phù hợp (Empty State).

### [BE] Task BE-3.1: API Lấy Danh sách Khóa học & Lọc Dữ liệu Tối ưu
*   **Mô tả:** API truy vấn danh sách khóa học có hỗ trợ phân trang và tìm kiếm toàn văn bản (Full-Text Search) hoặc tìm kiếm theo mẫu trên các trường `title`, `description`.
*   **Yêu cầu đảm bảo:**
    *   **Endpoint:** `GET /api/courses?q={query}&field={field}&difficulty={difficulty}&price_type={price_type}&page={page}&size={size}`.
    *   **Phân Quyền:** Chỉ trả về các khóa học ở trạng thái `PUBLISHED` cho người dùng công cộng. Trả về cả các khóa học `DRAFT`, `PENDING_REVIEW` của chính giảng viên nếu giảng viên gọi API studio.
    *   **Cấu trúc dữ liệu trả về:** JSON chuẩn chứa danh sách `items`, tổng số bản ghi `total`, trang hiện tại `page`, số trang `pages`.
*   **Acceptance Criteria:** Dữ liệu trả về đầy đủ các thông tin cấu trúc phân trang (`total_pages`, `current_page`, `page_size`).
*   **Verification:** Đo thời gian phản hồi của API bằng Postman/Swagger khi DB có hơn 1000 bản ghi mẫu.

### [FE] Task FE-3.2: Trang Chi tiết Khóa học & Lộ trình Học thử
*   **Mô tả:** Thiết kế trang xem chi tiết khóa học: Xem bio giảng viên, mô tả nội dung khóa học bằng Markdown và danh sách các chương/bài học bên dưới.
*   **Yêu cầu đảm bảo:**
    *   **Giao diện (`/courses/[courseSlug]`):** Accordion hiển thị danh sách Chương học. Dưới mỗi Chương học là danh sách các Bài học (có biểu tượng ổ khóa xám cho các bài bắt buộc mua khóa học mới xem được, và biểu tượng mắt xanh cho các bài được giảng viên cho phép "Học thử miễn phí").
    *   **CTA Nút Bấm:** Hiển thị nút "Mua khóa học" (gọi API sinh link checkout PayOS) nếu khóa học trả phí và học viên chưa sở hữu. Hiển thị nút "Vào học ngay" (redirect tới classroom bài 1.1) nếu đã sở hữu hoặc là khóa miễn phí.
*   **Acceptance Criteria:** Hiển thị rõ ràng cấu trúc bài học phân cấp (Chương 1 -> Bài học 1.1, Bài học 1.2).
*   **Verification:** Đảm bảo học viên chưa mua khóa học không thể bấm vào các bài học chính thức bị khóa.

### [BE] Task BE-3.2: API CRUD Khóa học & Xác thực Sở hữu của Giảng viên
*   **Mô tả:** Các API tạo mới, chỉnh sửa thông tin chi tiết và gửi yêu cầu phê duyệt khóa học dành riêng cho giảng viên sở hữu.
*   **Yêu cầu đảm bảo:**
    *   **Xác thực Quyền Sở Hữu:** Kiểm tra JWT token để xác định giảng viên. Chỉ cho phép gọi API chỉnh sửa (`PUT /api/teacher/courses/{id}`) nếu giảng viên hiện tại trùng với `teacher_id` của khóa học đó trong database.
    *   **Upload Thumbnail:** Nhận ảnh tệp tin và lưu trữ lên MinIO bucket `course-assets` dưới key `thumbnails/{course_id}_{timestamp}.png`.
*   **Acceptance Criteria:** Giảng viên có thể chuyển trạng thái khóa học sang `PENDING_REVIEW` để gửi Admin kiểm duyệt.
*   **Verification:** Thử dùng tài khoản giảng viên A chỉnh sửa khóa học của giảng viên B, API phải trả về lỗi 403 Forbidden.

### [FE] Task FE-3.3: Classroom Workspace Layout & Trình phát Video HLS Bảo mật
*   **Mô tả:** Giao diện học tập chia làm 2 cột: Sidebar trái chứa danh sách bài giảng với icon trạng thái; main panel phải hiển thị trình xem Markdown lý thuyết và trình phát video hỗ trợ định dạng HLS (`.m3u8`) thông qua thư viện `hls.js` hoặc `video.js`.
*   **Yêu cầu đảm bảo:**
    *   **Bố Cục Workspace:** Sidebar trái hiển thị accordion giáo trình kèm theo tick xanh (đã hoàn thành), xám (chưa học), in-progress (đang học). Main panel bên phải hiển thị nội dung bài học.
    *   **Trình phát Video HLS:** Tích hợp `hls.js` để phát file stream phân đoạn `.m3u8` sinh từ backend. Ẩn menu chuột phải mặc định, ẩn tag download video để chống copy link trực tiếp MP4. Hỗ trợ lưu thời gian xem video hiện tại (ví dụ: đang xem ở phút thứ 5:30) để khi reload trang học viên có thể xem tiếp.
    *   **Markdown Viewer:** Render nội dung Markdown lý thuyết sử dụng thư viện renderer (như `marked` hoặc `mdsvex`) tích hợp Syntax Highlighting (như PrismJS hoặc Shiki) cho các block code.
*   **Acceptance Criteria:** Giao diện co giãn responsive tốt, phát video HLS mượt mà không bị trễ tải phân đoạn (.ts).
*   **Verification:** Mở một video bài giảng và kiểm tra trong tab Network của trình duyệt xem các file phân đoạn (.ts) có được tải thay vì file MP4 dung lượng lớn không.

### [BE] Task BE-3.3: API Curriculum Position & Tích hợp Bộ chuyển đổi HLS Video Transcoder
*   **Mô tả:** API quản lý chương học, bài học có batch update sắp xếp vị trí bài học. Đồng thời, tích hợp dịch vụ transcode video bất đồng bộ (RabbitMQ worker + FFmpeg) để tự động cắt nhỏ video bài giảng tải lên thành định dạng HLS.
*   **Yêu cầu đảm bảo:**
    *   **API Batch Update Vị Trí:** `PUT /api/teacher/courses/{courseId}/curriculum/reorder` nhận body chứa danh sách các chương và bài học kèm vị trí `{ id, position, section_id }` để cập nhật đồng thời trong DB bằng một transaction.
    *   **Video HLS Transcoding Engine:** Khi giảng viên upload video `.mp4` lên MinIO, đẩy job chứa đường dẫn file vào RabbitMQ `transcode_queue`. Background worker sẽ lấy job ra, dùng `ffmpeg` chia video thành các segment `.ts` có độ dài 10 giây và file playlist `.m3u8`, upload các tệp này lên MinIO bucket `course-assets` dưới folder `/videos/{lesson_id}/`.
*   **Acceptance Criteria:** Lưu thứ tự vị trí chính xác trong DB; video bài giảng upload lên được chuyển đổi tự động sang HLS và cập nhật đường dẫn phát trực tuyến HLS.
*   **Verification:** Gọi API upload video, kiểm tra log của RabbitMQ background worker xem tiến trình FFmpeg có chạy thành công và tạo các tệp `.m3u8`, `.ts` trên MinIO.

### [FE] Task FE-3.4: Trình hiển thị Tiến độ học tập & Check hoàn thành
*   **Mô tả:** Giao diện hiển thị tỷ lệ % hoàn thành khóa học của học viên ở sidebar và tự động tích dấu xanh hoàn thành bài học mỗi khi học viên đọc xong hoặc giải xong bài tập đi kèm.
*   **Yêu cầu đảm bảo:**
    *   **Reactivity Progress:** Sử dụng React state hoặc custom store quản lý tiến độ khóa học hiện tại.
    *   Khi nhận kết quả Quiz passed hoặc Coding accepted thành công từ API, tự động cập nhật store tiến độ, lập tức tích dấu xanh cho bài học hiện tại và cập nhật thanh tiến độ % hiển thị ở header lớp học mà không cần reload lại trang.
*   **Acceptance Criteria:** Hiển thị thanh tiến độ (Progress Bar) sinh động có hiệu ứng chuyển động nhẹ.
*   **Verification:** Kiểm tra giao diện hiển thị khi tiến độ đạt 100% (hiển thị thông báo chúc mừng hoàn thành khóa học).

### [BE] Task BE-3.4: API Đánh giá & Ghi nhận Tiến độ học tập của Học viên
*   **Mô tả:** API kiểm tra và cập nhật bảng `lesson_content_progress` của học viên. Tự động kiểm tra trạng thái bài học lớn dựa trên các bài thực hành đi kèm.
*   **Yêu cầu đảm bảo:**
    *   **Quy trình ghi nhận hoàn thành:**
        *   Nếu là bài đọc (`READING`), API `POST /api/student/progress/lesson-content/{id}/complete` sẽ đánh dấu hoàn thành trực tiếp.
        *   Nếu là `QUIZ`, kiểm tra bảng `quiz_submission` xem học viên đã có bản ghi nào đạt điểm số >= `passing_score` (tối thiểu 80% câu đúng) hay chưa.
        *   Nếu là `PROBLEM` (coding), kiểm tra xem học viên đã có bản ghi `submission` nào có trạng thái `ACCEPTED` hay chưa.
        *   Một bài học lớn (`lesson`) được tự động cập nhật hoàn thành trong DB chỉ khi toàn bộ các `lesson_contents` nằm trong bài học đó đều có bản ghi completed = True trong `lesson_content_progress`.
*   **Acceptance Criteria:** Trả về trạng thái tiến độ mới của học viên sau mỗi lần nộp bài tập.
*   **Verification:** Viết unit test giả lập học viên nộp bài thi trắc nghiệm đạt 70% và 90% để kiểm tra việc ghi nhận hoàn thành bài học (AI viết cho nhanh). 

---

## Giai đoạn 4: Hệ thống thực hành giải thuật & Chấm bài (Phase 4: Exercises & Evaluation Engines)
Mục tiêu: Xây dựng trình soạn thảo code, ngân hàng đề bài và dịch vụ sandbox chấm bài lập trình an toàn.

### [FE] Task FE-4.1: Workspace Làm bài trắc nghiệm (Quiz Interface)
*   **Mô tả:** Giao diện hiển thị các câu hỏi trắc nghiệm dưới mỗi bài học. Học viên có thể chọn đáp án và bấm nút "Nộp bài".
*   **Yêu cầu đảm bảo:**
    *   **Giao Diện Quiz:** Khung hiển thị các câu hỏi trắc nghiệm được xếp lớp chồng lên nhau hoặc dạng danh sách dọc. Mỗi câu hỏi hiển thị nội dung câu hỏi và 4 lựa chọn (đáp án trắc nghiệm dạng radio button).
    *   **Bảo mật:** Không được tải thuộc tính `is_correct` của các phương án trả lời về trình duyệt để tránh việc inspect mã nguồn HTML/JS tìm đáp án đúng.
    *   **Trạng thái Kết Quả:** Sau khi nhấn "Nộp Bài", giao diện chuyển đổi sang trạng thái Review: khóa chọn đáp án, đổi màu đáp án học viên chọn (xanh lá nếu đúng, đỏ nếu sai), hiển thị dấu tick đáp án đúng thực tế và hiện khung text "Giải thích đáp án" từ giảng viên dưới chân câu hỏi.
*   **Acceptance Criteria:** Học viên có thể làm lại bài quiz nhiều lần nếu giảng viên không thiết lập giới hạn lượt thi.
*   **Verification:** Inspect element giao diện quiz khi đang làm bài để đảm bảo không tồn tại bất kỳ dấu vết nào của đáp án đúng.

### [BE] Task BE-4.1: API Quản lý đề thi trắc nghiệm & Chấm điểm tự động
*   **Mô tả:** API quản lý câu hỏi trắc nghiệm, đáp án và chấm bài trắc nghiệm của học viên. Tự động tính điểm dựa trên số câu trả lời chính xác và lưu vào `quiz_submission`.
*   **Yêu cầu đảm bảo:**
    *   **Endpoints:**
        *   `GET /api/student/quizzes/{quizId}`: Truy vấn cấu trúc đề thi. API này tuyệt đối không trả về cột `is_correct` của bảng `quiz_options` cho học viên.
        *   `POST /api/student/quizzes/{quizId}/submit`: Tiếp nhận bài làm của học viên.
    *   **Logic Chấm Điểm:**
        *   So sánh danh sách các `option_id` học viên đã chọn với đáp án đúng lưu ở cơ sở dữ liệu.
        *   Tính điểm số = `(Số câu trả lời đúng / Tổng số câu hỏi) * 10`. Lưu thông tin chi tiết các câu đã chọn và điểm số vào cột `answers` (định dạng JSONB) và cột `score` trong bảng `quiz_submission`.
        *   Kiểm tra số lượt làm bài của học viên trong bảng `quiz_submission` so với giới hạn `attempts` trong bảng `quizzes` để trả về lỗi 400 nếu vượt quá giới hạn.
*   **Acceptance Criteria:** Trả về kết quả điểm số và đánh giá Đạt/Không đạt chính xác dựa trên cấu hình `passing_score`.
*   **Verification:** Test API chấm điểm trắc nghiệm với nhiều bộ câu hỏi khác nhau.

### [FE] Task FE-4.2: Tích hợp Trình Soạn thảo Code Monaco/CodeMirror & Phân tách Run Code/Submit Code
*   **Mô tả:** Tích hợp bộ gõ code chuyên nghiệp hỗ trợ đổi theme, chọn ngôn ngữ và template code. Đồng thời, thiết kế rõ ràng hai hành động: "Chạy thử" (Run Code với input tự nhập) và "Nộp bài" (Submit Code chấm điểm chính thức).
*   **Yêu cầu đảm bảo:**
    *   **Monaco Editor Integration:** Nhúng trình soạn thảo code hỗ trợ tô màu cú pháp (syntax highlighting) cho C++, Python, Javascript, Go. Hỗ trợ tự động căn lề (auto-indent), thu gọn dòng code và thay đổi theme (Dark/Light).
    *   **Auto-save Draft:** Cứ sau mỗi 5 giây không gõ phím (Debounce), tự động lưu mã nguồn hiện tại của học viên vào LocalStorage trình duyệt với key `draft_code_{problemSlug}_{languageId}` để tránh mất mát dữ liệu khi mất kết nối mạng.
    *   **Hai hành động riêng biệt:**
        *   *Nút Chạy thử (Run Code):* Gửi code kèm dữ liệu nhập vào ở ô Textarea Standard Input (stdin). Chạy đồng bộ, trả về output của code trực tiếp lên console.
        *   *Nút Nộp bài (Submit Code):* Gửi mã nguồn để chấm điểm toàn bộ bộ testcases. Giao diện hiển thị loading, disabled nút submit và bắt đầu tiến trình Polling kiểm tra trạng thái bài nộp.
*   **Acceptance Criteria:** Học viên có thể chạy thử code nhiều lần với dữ liệu testcase tự thiết lập và nhìn thấy kết quả ngay lập tức.
*   **Verification:** Nhập dữ liệu đầu vào tùy chỉnh, bấm "Chạy thử" xem panel output hiển thị đúng kết quả xử lý của chương trình.

### [BE] Task BE-4.2: API Đăng tải Đề Bài Code & Quản lý Testcase ZIP
*   **Mô tả:** API cho phép giảng viên đăng đề bài tập lập trình mới, tải lên file testcase dạng ZIP chứa các cặp tệp tin đầu vào và đầu ra mong muốn.
*   **Yêu cầu đảm bảo:**
    *   **API Endpoints:**
        *   `POST /api/teacher/problems`: Tạo mới đề bài (Tiêu đề, mô tả Markdown, định dạng input/output).
        *   `POST /api/teacher/problems/{problemId}/testcases/upload`: Tiếp nhận file `.zip`.
    *   **Xử lý Giải Nén ZIP:**
        *   Sử dụng thư viện `zipfile` của Python giải nén tệp tin trong bộ nhớ.
        *   Kiểm tra tính hợp lệ: file đầu vào phải kết thúc bằng đuôi `.in` hoặc `.inp` và phải có file đầu ra kết thúc bằng `.out` tương ứng có cùng tiền tố tên (ví dụ: `tc1.in` đi kèm `tc1.out`).
        *   Lưu trữ các tệp testcase lên private bucket của MinIO. Ghi nhận đường dẫn file và gán trọng số điểm (`score`) cho từng testcase vào bảng `testcase` trong Postgres.
*   **Acceptance Criteria:** Hỗ trợ giảng viên cấu hình giới hạn thời gian chạy (ms) và bộ nhớ (MB) cho từng ngôn ngữ lập trình cụ thể trong bảng `problem_config`.
*   **Verification:** Thử tải lên file ZIP testcase bị thiếu file đầu ra, API phải trả về lỗi validate 400.

### [BE] Task BE-4.3: Phát triển Judge Service Sandbox & Tích hợp RabbitMQ Task Queue
*   **Mô tả:** Xây dựng service chấm bài độc lập giao tiếp trực tiếp với Docker Daemon, tích hợp RabbitMQ để nhận các tác vụ chấm bài bất đồng bộ qua hàng đợi, tránh quá tải cho hệ thống khi nhiều người nộp bài cùng lúc.
*   **Yêu cầu đảm bảo:**
    *   **Docker Container Sandbox Engine:**
        *   Judge service lắng nghe RabbitMQ queue `submission_queue`. Khi có job, khởi chạy một Docker container từ image có sẵn tương ứng với ngôn ngữ lập trình (ví dụ: `gcc:13` cho C++, `python:3.11-slim` cho Python).
        *   *Tham số bảo mật container:* Chặn kết nối mạng hoàn toàn (`--network none`), giới hạn bộ nhớ RAM tối đa bằng tham số `--memory` (ví dụ: `256m`), giới hạn quyền truy cập bằng cách chạy dưới tài khoản non-root user có UID = 1000.
        *   Tải mã nguồn và dữ liệu testcase đầu vào của testcase hiện tại vào container thông qua biến môi trường hoặc ghi file trực tiếp trong container, không mount ổ đĩa host của server.
        *   Sử dụng lệnh `timeout` của Linux để khống chế thời gian chạy. Nếu container chạy quá giới hạn thời gian cấu hình, cưỡng bức tắt container và trả về trạng thái `TIME_LIMIT_EXCEEDED` (TLE).
        *   So sánh luồng Standard Output (stdout) của container với Expected Output để trả về trạng thái `ACCEPTED` hoặc `WRONG_ANSWER`.
*   **Acceptance Criteria:** Service chấm bài tự động kéo task từ hàng đợi RabbitMQ, trả về kết quả thời gian, bộ nhớ và các trạng thái lỗi.
*   **Verification:** Gửi 20 bài nộp code cùng một lúc và kiểm tra xem hàng đợi RabbitMQ có điều phối chấm bài ổn định không bị nghẽn hay sập container.

### [BE] Task BE-4.4: Phân tách API Chạy Thử (Run Code) & Nộp bài Chấm điểm (Submit Code Queue)
*   **Mô tả:** API tiếp nhận mã nguồn của học viên. Tách thành hai endpoint riêng biệt: Endpoint `/run` (chạy đồng bộ trực tiếp với Docker sandbox cho phản hồi nhanh, không lưu DB) và Endpoint `/submit` (đẩy job vào RabbitMQ queue, tạo bản ghi DB ở trạng thái `PENDING` và cập nhật bất đồng bộ).
*   **Yêu cầu đảm bảo:**
    *   **Endpoint `/run` (Đồng bộ):** Gọi trực tiếp Docker sandbox runner chạy mã nguồn với stdin do học viên nhập lên. Đợi container kết thúc (tối đa 5 giây) và trả về kết quả stdout/stderr trực tiếp cho HTTP request. Không lưu dữ liệu chạy thử vào database.
    *   **Endpoint `/submit` (Bất đồng bộ):**
        *   Tạo bản ghi mới trong bảng `submission` với trạng thái ban đầu là `PENDING`.
        *   Đẩy payload gồm `{ "submission_id": 9901, "source_code": "...", "language": "...", "testcases": [...] }` vào RabbitMQ queue `submission_queue`.
        *   Trả về phản hồi tức thì cho frontend chứa mã `submission_id` và trạng thái `PENDING`.
        *   Background worker sau khi nhận kết quả từ Docker sandbox sẽ cập nhật trạng thái cuối cùng (ACCEPTED/WRONG_ANSWER, stats) vào bảng `submission` và chèn các bản ghi kết quả chi tiết từng testcase vào bảng `submission_result_detail`.
*   **Acceptance Criteria:** Sự tách biệt rõ ràng giúp tiết kiệm tài nguyên hệ thống (Run Code không lưu DB, Submit Code chạy bất đồng bộ qua queue).
*   **Verification:** Gọi API `/run` xem kết quả trả về ngay lập tức, gọi API `/submit` xem DB ban đầu ghi nhận `PENDING` và sau đó tự cập nhật thành `ACCEPTED` hoặc lỗi.

### [FE] Task FE-4.3: Giao diện Trạng thái Chấm bài thời gian thực & Lịch sử Nộp bài
*   **Mô tả:** Thiết kế bảng điều khiển hiển thị trạng thái chấm bài với hiệu ứng chờ (loading spinner), đổi màu trực quan khi có kết quả: xanh cho `ACCEPTED`, đỏ cho `WRONG_ANSWER`/`COMPILE_ERROR`, cam cho `TLE`/`MLE`.
*   **Yêu cầu đảm bảo:**
    *   **Cơ chế Polling:** Khi nhận được status `PENDING` sau khi Submit, Frontend thiết lập chu kỳ gửi request `GET /api/submissions/{submissionId}/status` mỗi 1.5 giây một lần để hỏi kết quả chấm bài. Dừng chu kỳ polling khi nhận được trạng thái cuối cùng (ACCEPTED, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, MEMORY_LIMIT_EXCEEDED, RUNTIME_ERROR, COMPILE_ERROR).
    *   **Hiển thị kết quả:** Trực quan hóa kết quả:
        *   ACCEPTED: Màu xanh lá nổi bật kèm hiệu ứng checkmark.
        *   WRONG_ANSWER: Màu đỏ, hiển thị danh sách các testcase chạy sai và chỉ số input/expected output của testcase mẫu công khai.
        *   Hiển thị thông số: Thời gian thực thi tối đa (ms), Bộ nhớ RAM tiêu thụ (MB).
    *   **Tab Lịch Sử:** Hiển thị danh sách các bài nộp cũ của học viên đối với bài tập này. Click vào một dòng lịch sử sẽ hiển thị mã nguồn cũ trong một modal read-only code viewer.
*   **Acceptance Criteria:** Học viên nhận được phản hồi kết quả chấm bài trực quan trên giao diện trong vòng dưới 3 giây đối với các chương trình cơ bản.
*   **Verification:** Kiểm tra xem giao diện có hiển thị đầy đủ thông tin dung lượng RAM và thời gian chạy của bài code không.

---

## Giai đoạn 5: Tương tác AI Interview & Tích hợp cổng PayOS (Phase 5: AI Interview & PayOS Checkout)
Mục tiêu: Đưa các tính năng tạo nên sự khác biệt của hệ thống vào hoạt động (phỏng vấn giả lập AI và thanh toán QR Pay tự động).

### [FE] Task FE-5.1: Không gian Chat Phỏng vấn thử với AI (AI Recruiter UI)
*   **Mô tả:** Thiết kế giao diện mô phỏng phòng phỏng vấn xin việc: Khung chat giữa học viên và AI nhà tuyển dụng, ô nhập câu trả lời, bộ đếm số lượt câu hỏi đã trả lời và nút dừng phỏng vấn sớm.
*   **Yêu cầu đảm bảo:**
    *   **Bố Cục Giao Diện Chat (`/student/interview/[sessionId]`):** Khung chat messenger chiếm trọn màn hình phải.
    *   **Disabled Input while Generating:** Khi người dùng nhấn nút "Gửi câu trả lời" hoặc phím Enter, ô nhập liệu (Textarea) và nút gửi sẽ lập tức chuyển sang trạng thái disabled (mờ đi). Hiển thị hiệu ứng 3 chấm nhấp nháy động ("AI Recruiter đang phân tích câu trả lời...") để ngăn chặn học viên spam tin nhắn làm lỗi logic lịch sử chat.
    *   **Auto-scroll Viewport:** Khung chat tự động cuộn xuống dưới cùng (scroll-to-bottom) khi có tin nhắn mới xuất hiện.
*   **Acceptance Criteria:** Thiết kế thân thiện, hiển thị avatar AI Recruiter chuyên nghiệp và tin nhắn dạng bong bóng rõ ràng.
*   **Verification:** Chat liên tục xem giao diện có giữ được độ mượt mà và tự cuộn trang không.

### [BE] Task BE-5.1: Thiết lập cấu hình Prompt tối ưu & Tích hợp Gemini API
*   **Mô tả:** Thiết lập API khởi tạo buổi phỏng vấn thử, gửi system prompt định hình hành vi cho Gemini API làm nhà tuyển dụng công nghệ.
*   **Yêu cầu đảm bảo:**
    *   **Gemini System Prompt Design:** Viết prompt hệ thống chi tiết bắt buộc Gemini đóng vai là một nhà tuyển dụng kỹ thuật khó tính nhưng lịch sự. Hướng dẫn Gemini:
        1. Hỏi tuần tự từng câu hỏi một về chủ đề và cấp độ tương ứng (`topic`, `level`).
        2. Không tự động trả lời thay ứng viên, không nhận xét trực tiếp đúng sai sau mỗi câu trả lời trong lúc phỏng vấn mà chỉ ghi nhận và chuyển câu hỏi tiếp theo.
        3. Khống chế tổng số câu hỏi từ 5 đến 10 câu.
    *   **API Endpoint:** `POST /api/interviews/sessions` khởi tạo session trong database bảng `interview_session` ở trạng thái ACTIVE, gọi Gemini lấy câu hỏi số 1, lưu câu hỏi số 1 vào bảng `interview_message` và trả về cho frontend.
*   **Acceptance Criteria:** Lưu thông tin session mới vào bảng `interview_session` ở trạng thái hoạt động và trả về câu hỏi mở đầu.
*   **Verification:** Gọi API khởi tạo và kiểm tra nội dung câu hỏi đầu tiên có khớp với chủ đề đã cấu hình không.

### [BE] Task BE-5.2: API Giao tiếp & Quản lý Trạng thái Hội thoại AI (Conversational Chat State)
*   **Mô tả:** API tiếp nhận phản hồi của học viên, lưu trữ tin nhắn vào bảng `interview_message`, gửi lịch sử hội thoại lên Gemini API để lấy câu hỏi tiếp theo và khống chế giới hạn số lượt phỏng vấn (từ 5 đến 10 lượt câu hỏi).
*   **Yêu cầu đảm bảo:**
    *   **Giao tiếp Chat API:** `POST /api/interviews/sessions/{sessionId}/chat`.
    *   **Quản Lý Lịch Sử:** Truy vấn toàn bộ danh sách tin nhắn cũ trong bảng `interview_message` sắp xếp theo thời gian tăng dần để dựng lại ngữ cảnh chat gửi kèm trong API payload lên Gemini.
    *   **Khống chế lượt hỏi:** Kiểm tra số lượng tin nhắn AI đã gửi trong DB. Nếu đạt giới hạn câu hỏi cấu hình (ví dụ: đã hỏi đủ 8 câu), API sẽ tự động khóa không gửi request chat tiếp lên Gemini, cập nhật trạng thái session thành `PENDING_EVALUATION` và trả về tín hiệu yêu cầu frontend kết thúc buổi phỏng vấn.
*   **Acceptance Criteria:** Giao tiếp ổn định đúng logic, đảm bảo phiên chat duy trì được tính liên kết.
*   **Verification:** Thử chat đến câu thứ 11 xem hệ thống có tự động khóa gửi tin nhắn không.

### [FE] Task FE-5.2: Giao diện Báo cáo Đánh giá AI Sinh động & Lời khuyên cải thiện
*   **Mô tả:** Trang hiển thị báo cáo phỏng vấn thử của học viên sau khi kết thúc. Trực quan hóa điểm số tổng kết bằng đồ thị, phân chia rõ ràng các cột Ưu điểm, Nhược điểm, và Gợi ý cải thiện kỹ năng.
*   **Yêu cầu đảm bảo:**
    *   **Circular Progress Score:** Vẽ vòng tròn tiến trình hiển thị điểm tổng quan trên thang 10 (ví dụ: "7.5 / 10") sử dụng CSS gradients/animations hoặc thư viện đồ thị gọn nhẹ.
    *   **Cột Điểm Mạnh / Điểm Yếu:** Phân chia bố cục hiển thị danh sách dạng các thẻ collapsible card có màu sắc phân biệt (xanh lá cho điểm mạnh, đỏ/cam cho điểm yếu).
    *   **Transcript Review:** Dưới chân trang hiển thị toàn bộ nội dung transcript cuộc phỏng vấn. Dưới mỗi câu trả lời của học viên, hiển thị thêm bong bóng nhận xét nhỏ (AI Feedback Annotation) chỉ rõ lỗi và cách viết lại câu trả lời tốt hơn.
*   **Acceptance Criteria:** Bố cục chuyên nghiệp như một báo cáo đánh giá năng lực thực tế.
*   **Verification:** Kiểm thử xem giao diện hiển thị các đoạn văn bản dài của báo cáo đánh giá có bị tràn màn hình không.

### [BE] Task BE-5.3: API Tổng hợp & Đánh giá Phỏng vấn cấu trúc JSON bằng Gemini
*   **Mô tả:** API kết thúc buổi phỏng vấn, thu thập toàn bộ lịch sử hội thoại của session, gửi yêu cầu chấm điểm và nhận xét chi tiết lên Gemini API dưới định dạng JSON cấu trúc sẵn.
*   **Yêu cầu đảm bảo:**
    *   **Structured Output Prompting:** Gọi Gemini API đánh giá buổi phỏng vấn. Sử dụng tính năng Structured Outputs của Gemini hoặc viết prompt ràng buộc kỹ lưỡng để bắt buộc Gemini trả về đúng cấu trúc chuỗi JSON:
        ```json
        {
          "overall_score": 8.0,
          "strengths": "Học viên có kiến thức tốt về...",
          "weaknesses": "Cần cải thiện cách giải thích...",
          "suggestions": "Nên học thêm khóa học giải thuật nâng cao...",
          "annotations": [
            { "message_id": 105, "feedback": "Nên giải thích thêm về độ phức tạp bộ nhớ." }
          ]
        }
        ```
    *   **Fallback JSON Parser:** Viết khối lệnh try-except xử lý lỗi parse JSON. Nếu Gemini trả về chuỗi JSON lỗi hoặc định dạng text thuần, tự động gọi Regex parser trích xuất dữ liệu hoặc gán vào cấu trúc fallback mặc định để tránh làm crash API.
    *   Cập nhật trạng thái session thành `COMPLETED` và lưu báo cáo vào bảng `interview_reports`.
*   **Acceptance Criteria:** Trả về kết quả đánh giá chi tiết với định dạng JSON chuẩn.
*   **Verification:** Kiểm tra dữ liệu được chèn vào bảng `interview_reports` sau khi kết thúc phỏng vấn.

### [FE] Task FE-5.3: Giao diện Thanh toán QR Code & Đợi kết quả giao dịch tự động
*   **Mô tả:** Trang thanh toán mua khóa học hiển thị thông tin đơn hàng, số tiền, mã QR Code VietQR tương ứng được sinh tự động từ PayOS cùng đồng hồ đếm ngược thời gian thanh toán.
*   **Yêu cầu đảm bảo:**
    *   **Hiển thị VietQR:** Vẽ khung hiển thị ảnh mã QR VietQR sinh ra từ PayOS. Hiển thị rõ các thông tin text: Số tiền thanh toán định dạng VND, Ngân hàng nhận, Số tài khoản, Tên chủ tài khoản, Nội dung chuyển khoản kèm theo nút bấm "Copy nhanh" (sử dụng Clipboard API của trình duyệt).
    *   **Đồng Hồ Đếm Ngược:** Hiển thị đồng hồ đếm ngược thời gian hết hạn giao dịch (15 phút). Khi đếm ngược về 0, hiển thị thông báo "Giao dịch đã hết hạn" và khóa nút chuyển khoản.
    *   **Tự Động Nhận Diện Giao Dịch (SSE/Polling):** Frontend khởi tạo kết nối Server-Sent Events (SSE) tới API backend để lắng nghe sự kiện hoàn tất giao dịch. Khi nhận được event thanh toán thành công, tự động hiển thị modal chúc mừng và chuyển hướng học viên vào học mà không yêu cầu học viên click bất kỳ nút "Xác nhận đã chuyển khoản" nào.
*   **Acceptance Criteria:** Chuyển khoản thành công -> UI tự động chuyển hướng người dùng đến lớp học lý thuyết.
*   **Verification:** Thử nghiệm luồng thanh toán với môi trường sandbox của PayOS.

### [BE] Task BE-5.4: API Thanh toán PayOS, Webhook Đồng bộ & Gửi Hóa đơn Email
*   **Mô tả:** API tạo link thanh toán VietQR qua PayOS, endpoint nhận Webhook phản hồi kết quả thanh toán để mở khóa khóa học cho học viên, chia sẻ doanh thu giảng viên, đồng thời kích hoạt RabbitMQ worker gửi hóa đơn điện tử qua Email cho học viên.
*   **Yêu cầu đảm bảo:**
    *   **PayOS Integration:** Tích hợp SDK PayOS để gọi API tạo link thanh toán, nhận về URL QR Code và mã thanh toán duy nhất (`payos_code`). Lưu vào bảng `transaction` ở trạng thái `PENDING`.
    *   **Webhook Endpoint & Concurrency Lock (Idempotency):**
        *   Xây dựng endpoint `/api/payments/payos-webhook` tiếp nhận sự kiện từ PayOS.
        *   Xác thực chữ ký số (`signature`) gửi kèm webhook bằng API Key cấu hình trong `.env` để ngăn chặn request webhook giả mạo.
        *   Sử dụng cơ chế `SELECT FOR UPDATE` (Row Locking) trên bảng `transaction` đối với dòng giao dịch tương ứng để ngăn chặn hiện tượng tranh chấp tài nguyên (race condition) hoặc ghi nhận doanh thu trùng lặp khi PayOS gửi webhook nhiều lần.
    *   **Xử lý Giao dịch Thành công:** Cập nhật trạng thái transaction thành `COMPLETE`, ghi nhận doanh thu chia sẻ cho giảng viên (cộng 80% số tiền giao dịch vào trường ví số dư của giảng viên), tạo bản ghi mở khóa học tập trong bảng `enrollment` của học viên, và đẩy job gửi hóa đơn điện tử/email chào mừng vào queue `email_queue`.
*   **Acceptance Criteria:** Tạo link thanh toán thành công, mở khóa học tự động và gửi hóa đơn điện tử qua email cho người học.
*   **Verification:** Gửi request webhook giả mạo không có chữ ý số hoặc chữ ký sai (hệ thống phải từ chối 400); kiểm tra hòm thư của học viên nhận được thư chúc mừng và biên lai giao dịch.

---

## Giai đoạn 6: Tương tác Cộng đồng & Dashboard Quản trị (Phase 6: Moderation, Interactions & Analytics)
Mục tiêu: Đưa hệ thống đi vào vận hành thực tế bằng các công cụ tương tác cộng đồng và báo cáo kinh doanh cho Admin/Giảng viên.

### [FE] Task FE-6.1: Giao diện Bình luận phân cấp dưới bài học
*   **Mô tả:** Thiết kế component bình luận hiển thị phân cấp tối đa 2 cấp (bình luận gốc và trả lời bình luận) nằm ở phía dưới nội dung học lý thuyết.
*   **Yêu cầu đảm bảo:**
    *   **Bình luận 2 cấp:** Bình luận gốc thụt lề 0. Khi click nút "Trả lời", mở rộng form nhập bình luận phụ dưới bình luận gốc. Bình luận cấp 2 hiển thị lùi vào trong 24px so với bình luận gốc.
    *   **Soạn thảo Markdown:** Cho phép viết bình luận bằng Markdown đơn giản (bold, italic, code block).
    *   Nút gửi hiển thị spinner và disabled trong quá trình gọi API.
*   **Acceptance Criteria:** Bố cục rõ ràng, thụt lề chuẩn cho bình luận cấp 2 để người dùng dễ theo dõi luồng trao đổi.
*   **Verification:** Kiểm tra việc sửa đổi hoặc xóa bình luận trực tiếp trên giao diện.

### [BE] Task BE-6.1: API Bình luận lồng nhau & Đẩy thông báo tự động cho Giảng viên
*   **Mô tả:** API CRUD bình luận phân cấp, sử dụng trường `parent_id` tự liên kết đến chính bảng `comment`.
*   **Yêu cầu đảm bảo:**
    *   **Database Query:** Viết câu lệnh SQL truy vấn lồng ghép tối ưu để lấy cây bình luận 2 tầng nhanh chóng theo `lesson_content_id`.
    *   **Notification Dispatch:** Khi học viên gửi bình luận mới, tự động tạo một dòng ghi nhận thông báo (`notification`) cho giảng viên sở hữu khóa học để thông báo có bình luận mới cần hỗ trợ trả lời.
*   **Acceptance Criteria:** Trả về cây thư mục bình luận đầy đủ thông tin người dùng và thời gian viết bình luận dạng thân thiện (ví dụ: "5 phút trước").
*   **Verification:** Gửi bình luận và kiểm tra xem bảng `notification` có ghi nhận thông báo cho giảng viên không.

### [FE] Task FE-6.2: Giao diện Báo cáo Vi phạm & Trang Admin Kiểm duyệt khóa học
*   **Mô tả:** Thiết kế popup cho phép học viên gửi báo cáo vi phạm khóa học (lý do vi phạm, mô tả chi tiết). Thiết kế dashboard quản lý báo cáo dành riêng cho Admin để phê duyệt khóa học hoặc ẩn khóa học vi phạm.
*   **Yêu cầu đảm bảo:**
    *   **Popup Báo Cáo:** Hộp thoại cho phép chọn lý do (Vi phạm bản quyền, Nội dung nhạy cảm, Spam, Lỗi học liệu) và điền chi tiết mô tả.
    *   **Admin Review Board:** Bảng danh sách khóa học chờ phê duyệt (`PENDING_REVIEW`) hiển thị đầy đủ thông tin mô tả, đề bài, bài giảng để Admin duyệt chất lượng.
*   **Acceptance Criteria:** Admin có công cụ kiểm duyệt khóa học hiệu quả trước khi cho phép công khai trên catalog.
*   **Verification:** Thử gửi báo cáo vi phạm và kiểm tra xem danh sách báo cáo của Admin có cập nhật số lượng tăng lên không.

### [BE] Task BE-6.2: API Flagging System & Khóa Khóa Học Vi Phạm
*   **Mô tả:** API báo cáo vi phạm khóa học và API thay đổi trạng thái khóa học dành cho Admin (`ARCHIVED`/`DRAFT`).
*   **Yêu cầu đảm bảo:**
    *   **API Endpoints:**
        *   `POST /api/courses/{id}/report`: Nhận đơn báo cáo vi phạm từ học viên.
        *   `POST /api/admin/courses/{id}/status`: Admin thay đổi trạng thái khóa học (`PUBLISHED` sang `ARCHIVED` hoặc `DRAFT`).
    *   **DB Audit Log:** Mọi hành động kiểm duyệt của Admin phải được ghi nhận vào bảng `audit_log` (Admin ID, mã khóa học, hành động, lý do).
*   **Acceptance Criteria:** Bảo vệ người dùng khỏi các nội dung xấu/độc hại nhanh chóng.
*   **Verification:** Gọi API ẩn khóa học từ Admin và kiểm tra xem học viên có truy cập được link chi tiết khóa học đó nữa không (phải trả về lỗi 404).

### [FE] Task FE-6.3: Dashboard Giảng viên & Biểu đồ doanh thu trực quan
*   **Mô tả:** Xây dựng bảng điều khiển cho giảng viên hiển thị biểu đồ doanh thu theo thời gian, thống kê lượng học viên đăng ký mới, danh sách học viên theo học và tiến độ học tập chi tiết của từng người.
*   **Yêu cầu đảm bảo:**
    *   **ApexCharts/ChartJS Integration:** Vẽ biểu đồ doanh thu dạng đường thẳng (Line Chart) có hỗ trợ hover tooltip hiển thị số tiền doanh thu chi tiết của ngày đó. Hỗ trợ nút chuyển đổi nhanh khoảng thời gian biểu đồ (7 ngày gần nhất, 30 ngày gần nhất, năm hiện tại).
    *   **Bảng Tiến Độ Học Viên:** Bảng hiển thị danh sách học viên trong khóa học của mình, hiển thị cột tên bài học cuối cùng họ hoàn thành và thời gian hoạt động cuối cùng.
*   **Acceptance Criteria:** Giảng viên nắm bắt được tình hình tài chính và hỗ trợ kịp thời học viên đang bị kẹt ở bài học nào.
*   **Verification:** Hover chuột vào các điểm trên đồ thị xem thông tin chi tiết số tiền doanh thu hiển thị chính xác.

### [BE] Task BE-6.3: API Thống kê Doanh thu & Tiến độ Học viên cho Giảng viên
*   **Mô tả:** API thực hiện các truy vấn gom nhóm (`GROUP BY`) và tính tổng (`SUM`) doanh thu thực nhận của giảng viên theo mốc thời gian.
*   **Yêu cầu đảm bảo:**
    *   **SQL Optimization:** Tối ưu hóa truy vấn tính tổng doanh thu từ bảng `transaction` liên kết với bảng `courses` lọc theo `teacher_id` của giảng viên hiện tại. Caching kết quả thống kê doanh thu vào Redis (TTL 10 phút) để giảm thiểu tải cho database khi giảng viên reload trang dashboard nhiều lần.
    *   API trả về danh sách học viên kèm theo mã bài học hoàn thành cuối cùng bằng cách truy vấn bảng `lesson_content_progress` của học viên đó trong các khóa của giảng viên.
*   **Acceptance Criteria:** Trả về dữ liệu thống kê đầy đủ và nhanh chóng.
*   **Verification:** So sánh dữ liệu doanh thu trả về từ API dashboard với tổng số tiền giao dịch thành công trong database.

### [FE] Task FE-6.4: Admin Dashboard UI - Thống kê Hệ thống & Tra cứu Audit Log
*   **Mô tả:** Thiết kế giao diện Admin quản lý người dùng (Ban/Unban), xem danh sách giao dịch toàn hệ thống và tra cứu lịch sử thao tác của các tài khoản (Audit Log).
*   **Yêu cầu đảm bảo:**
    *   **Màn Hình Quản Lý Người Dùng:** Bảng danh sách người dùng, tích hợp thanh tìm kiếm theo email, nút toggle "Ban" / "Unban" bên cạnh mỗi người dùng.
    *   **Khung Tra Cứu Nhật Ký (Audit Log):** Bảng hiển thị nhật ký thời gian thực của hệ thống, sắp xếp thời gian giảm dần, có bộ lọc theo hành động kiểm duyệt của Admin.
*   **Acceptance Criteria:** Giao diện quản trị toàn diện giúp Admin kiểm soát hoạt động của toàn bộ nền tảng.
*   **Verification:** Thử ban một tài khoản học viên và đăng nhập bằng tài khoản đó xem hệ thống có hiển thị thông báo tài khoản bị khóa không.

### [BE] Task BE-6.4: API Dashboard Quản trị Admin & Tra cứu Audit Log
*   **Mô tả:** API quản lý người dùng, thay đổi `account_status` (`BANNED`/`ACTIVE`), tra cứu lịch sử audit log và đối soát toàn bộ các giao dịch tài chính.
*   **Yêu cầu đảm bảo:**
    *   **API Ban User:** `PUT /api/admin/users/{userId}/status` nhận body `{ "account_status": "BANNED" }`.
    *   **Token Revocation in Redis:** Khi cập nhật DB trạng thái `BANNED`, backend bắt buộc phải quét sạch và xóa bỏ các refresh token và access token hoạt động của user đó khỏi Redis cache. Điều này giúp ngăn chặn user bị ban tiếp tục gọi API bằng token cũ chưa hết hạn.
*   **Acceptance Criteria:** Bảo vệ hệ thống khỏi các tài khoản phá hoại hiệu quả.
*   **Verification:** Ban tài khoản đang đăng nhập và kiểm tra xem token của tài khoản đó có bị từ chối truy cập API ngay lập tức không.

---

## Giai đoạn 7: Bảo mật, Kiểm thử E2E & Triển khai Staging (Phase 7: Hardening, E2E Testing & Staging Release)
Mục tiêu: Đảm bảo chất lượng sản phẩm tốt nhất, an toàn trước các cuộc tấn công và sẵn sàng chạy trên môi trường Staging.

### [BE] Task BE-7.1: Bảo mật Hardening (SQL Injection, XSS, Rate Limiting)
*   **Mô tả:** Cài đặt các cơ chế bảo mật bổ sung cho API Backend: Xử lý làm sạch đầu vào (Input Sanitization) chống XSS, sử dụng SQLAlchemy ORM tránh SQL Injection, cấu hình Rate Limiting trên các endpoint nhạy cảm.
*   **Yêu cầu đảm bảo:**
    *   **Rate Limiting Middleware:** Cài đặt `fastapi-limiter` kết nối với Redis. Khống chế tần suất gọi API trên các endpoint nhạy cảm:
        *   `/api/auth/login`: Tối đa 5 lần đăng nhập sai/phút.
        *   `/api/problems/{slug}/submit`: Tối đa 5 lần nộp bài/phút.
        *   `/api/interviews/sessions/{id}/chat`: Tối đa 8 lần chat/phút.
    *   **Markdown Sanitization:** Khi lưu bài giảng Markdown của giảng viên hoặc bình luận của học viên, sử dụng thư viện làm sạch HTML (như `nh3` hoặc `bleach`) để loại bỏ hoàn toàn các thẻ `<script>`, `onload`, `onerror` để phòng chống tấn công XSS lưu trữ (Stored XSS).
    *   Đảm bảo toàn bộ câu lệnh truy vấn SQL đều được viết qua SQLAlchemy ORM để tự động escape các tham số đầu vào, loại bỏ nguy cơ SQL Injection.
*   **Acceptance Criteria:** Hệ thống đứng vững trước các công cụ quét bảo mật tự động cơ bản.
*   **Verification:** Sử dụng tool thử spam request liên tục lên API để kiểm tra xem hệ thống có trả về lỗi `429 Too Many Requests` không.

### [FE] Task FE-7.1: Viết kiểm thử E2E & Component Testing cho Frontend
*   **Mô tả:** Viết các ca kiểm thử tự động bằng Vitest và Playwright cho các luồng tương tác quan trọng của Frontend: Luồng Đăng nhập, Làm bài thi trắc nghiệm, Viết code trong Monaco Editor và gửi chấm bài.
*   **Yêu cầu đảm bảo:**
    *   **Playwright E2E Tests:** Viết kịch bản tự động mô phỏng:
        *   Học viên mở trang login -> Nhập credentials -> Login thành công -> Redirect về dashboard.
        *   Học viên vào lớp học -> Mở bài tập coding -> Nhập code sai -> Bấm Submit -> Chờ và nhận kết quả WRONG_ANSWER.
        *   Học viên nhập code đúng -> Bấm Submit -> Nhận kết quả ACCEPTED.
    *   **Component Testing:** Viết test case bằng Vitest kiểm tra hiển thị đúng trạng thái của các components dùng chung: nút button disabled khi click, input hiển thị thông báo lỗi khi validate sai định dạng.
*   **Acceptance Criteria:** Các kịch bản test tự động chạy thành công mà không gặp lỗi cấu hình.
*   **Verification:** Run `bun run test` và kiểm tra báo cáo kết quả kiểm thử.

### [BE] Task BE-7.2: Viết Integration Tests cho Business Application API
*   **Mô tả:** Xây dựng hệ thống unit/integration test sử dụng thư viện `pytest` và `pytest-asyncio` kiểm thử toàn bộ API Backend kết nối với database test riêng.
*   **Yêu cầu đảm bảo:**
    *   **Database Isolation:** Tạo database test riêng (`lms_test`). Sử dụng fixture của `pytest` để tự động chạy migrations khởi tạo bảng trên database test trước khi chạy các ca test.
    *   **Transactional Rollback:** Mỗi ca test chạy trong một transaction độc lập (`db_session`). Khi ca test hoàn tất, tự động gọi `db_session.rollback()` để đảm bảo dữ liệu test không bị ghi đè hay làm bẩn database cho các ca test sau.
*   **Acceptance Criteria:** Độ bao phủ kiểm thử API đạt trên 80%.
*   **Verification:** Chạy lệnh `pytest` trong thư mục backend và kiểm tra báo cáo độ bao phủ test.

### [BE/FE] Task BE/FE-7.3: Triển khai Staging & Tối ưu hóa Build Production
*   **Mô tả:** Viết file cấu hình docker-compose hoàn chỉnh cho môi trường Staging. Build bundle tối ưu hóa dung lượng Frontend cho production, tối ưu hóa các tệp static assets.
*   **Yêu cầu đảm bảo:**
    *   **Docker-compose Staging Setup:** Viết file `docker-compose.staging.yaml` chứa đầy đủ cấu hình khởi chạy các service: `auth-provider`, `business-application`, `judge-service`, `postgres`, `redis`, `rabbitmq`, `minio`, `mailpit`.
    *   **Frontend Production Optimization:** Cấu hình bundler của Vite kích hoạt nén file tĩnh (gzip/brotli), tối ưu hóa caching header cho static assets.
    *   **Backend Production Tuning:** Khởi chạy ứng dụng FastAPI bằng Uvicorn với tham số `--workers` tối ưu theo số lõi CPU của server staging.
    *   **Environment Configuration:** Đọc toàn bộ các thông tin bảo mật (Database Password, MinIO Secret Key, PayOS API Keys, Gemini API Key) từ biến môi trường của hệ thống host, không hardcode trong Dockerfile hay mã nguồn.
*   **Acceptance Criteria:** Hệ thống SkillBoost được deploy thành công lên server Staging và hoạt động ổn định.
*   **Verification:** Truy cập domain staging, thực hiện mua thử khóa học, học thử và chấm bài trực tuyến xem có trơn tru không.
