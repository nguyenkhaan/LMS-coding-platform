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

### [FE] Task FE-0.1: Thiết kế giao diện Figma & Xây dựng Design System
*   **Mô tả:** Thiết kế các màn hình UI trên Figma bao gồm: Trang chủ học viên, Classroom Workspace, Code Editor Workspace, AI Mock Interview Chat, Teacher Dashboard và Admin CCCD Verification.
*   **Yêu cầu đảm bảo:**
    *   Thống nhất bảng màu (Sleek Dark Mode & Harmonious Light Mode), font chữ Outfit/Inter, tỷ lệ lưới, khoảng cách (spacing), kiểu bo góc (border radius).
    *   Tạo thư viện Component tái sử dụng: Buttons, Inputs, Cards, Alert Modals, Spinners, Tooltips.
    *   Mô phỏng đầy đủ trạng thái tương tác (Hover, Focus, Disabled, Loading, Empty State).
*   **Acceptance Criteria:** Toàn bộ màn hình UI trên Figma được phê duyệt bởi Product Owner, có đầy đủ Design Spec cho từng component để FE dev cắt CSS.
*   **Verification:** Kiểm tra Figma file có link chia sẻ và tài liệu hướng dẫn kích thước chi tiết (Figma Inspect).

### [BE] Task BE-0.1: Đặc tả Cấu trúc DB & Hoàn thiện Kịch bản Migration
*   **Mô tả:** Rà soát lại conceptual schema trong PRD đối chiếu với các file models hiện tại. Viết tài liệu mô tả quan hệ (ERD) và chuẩn bị các script dữ liệu mẫu (Seed Data) cho database.
*   **Yêu cầu đảm bảo:**
    *   Các bảng phải tuân thủ chuẩn hóa dữ liệu, đảm bảo ràng buộc khóa ngoại (`Foreign Key`), chỉ mục (`Index`) trên các cột thường xuyên truy vấn (như `email`, `slug`, `course_id`, `student_id`).
    *   Cấu hình Alembic chính xác để tự động tạo migrations dựa trên các thay đổi của SQLAlchemy models.
*   **Acceptance Criteria:** Chạy thành công script khởi tạo bảng và chèn dữ liệu mẫu (users, courses, languages) mà không gặp lỗi ràng buộc.
*   **Verification:** Run `alembic current` hiển thị head migration, kiểm tra các bảng được tạo đầy đủ trong postgres.

### [BE/FE] Task BE/FE-0.2: Định nghĩa API Contracts (OpenAPI / Swagger Spec)
*   **Mô tả:** Thiết kế các endpoint giao tiếp giữa Frontend và Backend. Định nghĩa rõ URL, Method, Request Body, Response JSON, và các Error Code (400, 401, 403, 404, 422, 500).
*   **Yêu cầu đảm bảo:**
    *   Sử dụng Pydantic schemas trong FastAPI để sinh ra Swagger UI tự động tại `/docs`.
    *   Frontend team sử dụng Swagger JSON để viết trước các API Client SDK / Mock Service Worker (MSW) cho phép làm việc song song mà không cần đợi API thực tế xong.
*   **Acceptance Criteria:** File JSON định dạng OpenAPI 3.0 được cam kết vào repository tại thư mục `docs/specs/api.json`.
*   **Verification:** Nhập file JSON vào Swagger Editor hoặc Postman chạy thành công không có cảnh báo cú pháp.

---

## Giai đoạn 1: Khởi tạo hạ tầng & Cấu hình Core (Phase 1: Base Setup & Infrastructure)
Mục tiêu: Xây dựng nền tảng hạ tầng, sửa lỗi hiện tại và thiết lập cơ chế kiểm soát chất lượng mã nguồn.

### [FE] Task FE-1.1: Khởi tạo base SvelteKit & Khắc phục lỗi Favicon
*   **Mô tả:** Khởi tạo thư mục `$lib/assets` chứa logo favicon.svg để khắc phục lỗi import bị thiếu trong file [+layout.svelte](file:///home/cloud/workspace/python/LMS-coding-platform/src/frontend/src/routes/+layout.svelte). Cấu hình hệ thống global CSS dựa trên Tailwind CSS v4.
*   **Yêu cầu đảm bảo:**
    *   Cài đặt cấu trúc thư mục rõ ràng: `src/lib/components`, `src/lib/utils`, `src/lib/stores`, `src/routes`.
    *   Đảm bảo lệnh build chạy bình thường mà không bị crash do thiếu tệp tin.
*   **Acceptance Criteria:** Trang web khởi động bình thường ở cổng `5173`, hiển thị chữ "Hello world" không có lỗi đỏ ở console trình duyệt.
*   **Verification:** Chạy lệnh `bun run build` và `bun run check` báo thành công.

### [BE] Task BE-1.1: Cấu hình Middleware, CORS & Định dạng Response
*   **Mô tả:** Thiết lập cấu hình CORS trong `business-application` để giao tiếp với frontend. Tạo lớp Handler xử lý lỗi tập trung để chuyển các lỗi ngoại lệ (Exceptions) thành response JSON chuẩn hóa.
*   **Yêu cầu đảm bảo:**
    *   Chỉ cho phép origin của frontend (cổng 5173 hoặc domain staging) gọi API.
    *   Mọi response lỗi của API đều trả về dạng `{ "message": "...", "errors": [...] }`.
*   **Acceptance Criteria:** Frontend gọi API không bị lỗi Blocked by CORS.
*   **Verification:** Gửi request OPTIONS đến cổng 4000 bằng curl và kiểm tra headers `Access-Control-Allow-Origin`.

### [BE] Task BE-1.2: Thiết lập SMTP Email Client & Cấu hình RabbitMQ Queue
*   **Mô tả:** Thiết lập SMTP client (chạy local bằng Mailpit) và cấu hình RabbitMQ (được thiết lập qua Docker) để sẵn sàng cho các tiến trình xử lý bất đồng bộ (chấm bài, transcode video).
*   **Yêu cầu đảm bảo:**
    *   Cấu hình cổng kết nối SMTP client tới Mailpit chạy local. Đọc toàn bộ credentials từ `.env`.
    *   Xây dựng queue client kết nối tới RabbitMQ qua Docker (sử dụng thư viện kết nối trực tiếp như aio-pika) có cơ chế tự động kết nối lại (auto-reconnect) nếu RabbitMQ broker tạm thời mất tín hiệu.
*   **Acceptance Criteria:** Gửi thử mail thành công đến hòm thư nhận dạng test, kiểm tra ứng dụng nhận được kết nối ping/xác thực tới RabbitMQ thành công.
*   **Verification:** Chạy test script gửi email mẫu và kiểm tra kết nối tới RabbitMQ.

---

## Giai đoạn 2: Quản lý Định danh & Phân quyền (Phase 2: Authentication & Identity Verification)
Mục tiêu: Đảm bảo an toàn thông tin đăng nhập, xác minh CCCD để nâng cấp học viên lên giảng viên.

### [FE] Task FE-2.1: Giao diện Auth & Tích hợp Luồng OAuth2 (Đăng ký, Kích hoạt & Đăng nhập)
*   **Mô tả:** Thiết kế màn hình đăng ký tài khoản học viên và nhập mã xác minh gửi qua Email (gọi tới API của `business-application`). Tích hợp nút Đăng nhập kết nối với hệ thống `auth-provider` bằng luồng OAuth2 Authorization Code.
*   **Yêu cầu đảm bảo:**
    *   Form đăng ký và nhập OTP có xác thực định dạng dữ liệu (validation) trực tiếp tại Client.
    *   Tích hợp luồng Đăng nhập: Khi người dùng nhấn Đăng nhập, chuyển hướng sang cổng `auth-provider` (`/auth/authorize`). Xây dựng route `/auth/callback` trong SvelteKit để nhận `code`, gửi yêu cầu trao đổi mã lấy token từ `/api/auth/code` của `auth-provider` ở server-side và lưu trữ `access_token` cùng `refresh_token` vào HttpOnly, Secure Cookies.
*   **Acceptance Criteria:** Đăng ký thành công và người dùng nhập được mã verify để kích hoạt tài khoản. Flow đăng nhập -> chuyển sang `auth-provider` -> đăng nhập thành công -> chuyển về frontend callback -> tự động trao đổi và lưu token vào cookies -> chuyển sang trang chủ trơn tru.
*   **Verification:** Kiểm tra quy trình đăng ký/kích hoạt tài khoản; sử dụng Browser DevTools kiểm tra xem các token (`access_token`, `refresh_token`) có được lưu trữ đúng cấu hình HttpOnly/Secure trong Cookies sau khi đăng nhập thành công không.

### [BE] Task BE-2.1: JWT Verification Middleware, Guard Phân quyền & OTP Mailer
*   **Mô tả:** Viết decorator hoặc Depends function `require_role(allowed_roles)` trong FastAPI để kiểm soát truy cập dựa trên Role (`STUDENT`, `TEACHER`, `ADMIN`). Đồng thời, tích hợp SMTP Mailer để gửi liên kết xác minh đăng ký tài khoản học viên.
*   **Yêu cầu đảm bảo:**
    *   Giải mã JWT sử dụng khóa công khai được tải tự động từ `auth-provider` thông qua lớp `PublicKeyService`.
    *   Xác thực thời gian hết hạn (expiration time) và chữ ký (signature) của token.
    *   Gửi email xác thực tài khoản bất đồng bộ thông qua RabbitMQ task (đẩy job vào queue để background worker xử lý) để không làm nghẽn luồng xử lý chính của request đăng ký.
*   **Acceptance Criteria:** Trả về lỗi 401 Unauthorized nếu token hết hạn; khi đăng ký tài khoản mới, hệ thống tự động gửi email đến người dùng để họ có thể verify được tài khoản của mình. 
*   **Verification:** Kiểm tra hòm thư nhận để xem mail verify được gửi đến đúng lúc.

### [FE] Task FE-2.2: Giao diện Yêu cầu Làm Giảng viên (Become Teacher Form)
*   **Mô tả:** Thiết kế form cho phép học viên điền thông tin cá nhân, động lực và tải lên ảnh CCCD mặt trước/sau cùng CV file PDF. 
*   **Yêu cầu đảm bảo:**
    *   Sử dụng kéo thả (drag and drop) tải file, hiển thị thanh tiến trình khi file đang được upload.
    *   Có preview ảnh ngay sau khi chọn để người dùng kiểm tra độ sắc nét của CCCD.
*   **Acceptance Criteria:** Gửi toàn bộ form dữ liệu và nhận phản hồi đơn hàng ở trạng thái `PENDING`.
*   **Verification:** Thử tải lên file ZIP hoặc file ảnh quá nặng (>5MB), giao diện phải hiển thị cảnh báo lỗi định dạng/kích thước.

### [BE] Task BE-2.2: API Đăng ký làm Giảng viên & Tích hợp MinIO Storage
*   **Mô tả:** API nhận file upload ảnh CCCD và CV từ học viên, lưu trữ chúng vào bucket riêng tư trên MinIO và tạo bản ghi trạng thái `PENDING` trong bảng `teacher_register`.
*   **Yêu cầu đảm bảo:**
    *   Mã hóa tên tệp tin trước khi lưu trữ để bảo mật thông tin cá nhân.
    *   Chỉ tạo đơn đăng ký mới nếu người dùng hiện tại chưa có đơn ở trạng thái `PENDING` hay đã là `TEACHER`.
*   **Acceptance Criteria:** Bản ghi trong cơ sở dữ liệu lưu chính xác đường dẫn file lưu trữ trên MinIO.
*   **Verification:** Kiểm tra dữ liệu trong MinIO Console xem tệp tin tải lên có tồn tại đúng bucket không.

### [FE] Task FE-2.3: Dashboard Admin Duyệt Hồ Sơ & Đối Chiếu CCCD
*   **Mô tả:** Giao diện cho Admin hiển thị danh sách đơn đăng ký giảng viên chờ xử lý. Thiết kế khung đối chiếu thông tin điền trong đơn và tệp ảnh CCCD đính kèm. Tích hợp công cụ OCR để (Cloudflare AI Worker) để có thể so sánh sự giống nhau giữa thông tin người dùng nhập vào và thông tin trên cccd. 
*   **Yêu cầu đảm bảo:**
    *   Tích hợp được OCR để xác minh
    *   Nút Reject bắt buộc Admin nhập ghi chú lý do để gửi mail phản hồi cho học viên.
*   **Acceptance Criteria:** Admin có thể hoàn thành việc duyệt hoặc từ chối đơn chỉ với tối đa 3 thao tác click chuột.
*   **Verification:** Kiểm tra độ responsive của bảng danh sách đơn duyệt trên màn hình nhỏ.

### [BE] Task BE-2.3: API Duyệt Đơn Đăng Ký Giảng Viên & Transactional Role Promotion
*   **Mô tả:** API tiếp nhận quyết định duyệt/từ chối từ Admin. Nếu đồng ý, cập nhật trạng thái đơn thành `AGREE`, chèn vai trò `TEACHER` vào bảng `user_role`, khởi tạo thông tin bảng `teacher_profile` trong cùng một Database Transaction.
*   **Yêu cầu đảm bảo:**
    *   Chạy trong một Session Transaction duy nhất: Nếu bất kỳ bước nào thất bại, toàn bộ thay đổi phải được rollback để tránh lỗi mất đồng bộ dữ liệu.
    *   Chỉ Admin mới gọi được API này.
*   **Acceptance Criteria:** Tải khoản học viên được tự động đổi phân quyền ngay lập tức sau khi Admin duyệt đơn thành công.
*   **Verification:** Sử dụng database client kiểm tra vai trò mới của user sau khi Admin phê duyệt.

---

## Giai đoạn 3: Soạn thảo Học liệu & Lớp học lý thuyết (Phase 3: Courses & Curriculum Management)
Mục tiêu: Giảng viên có thể biên soạn lộ trình và học viên có thể học lý thuyết mượt mà.

### [FE] Task FE-3.1: Trang Tìm kiếm & Danh mục Khóa học (Course Catalog)
*   **Mô tả:** Giao diện cho phép học viên duyệt danh sách các khóa học hiện có. Hỗ trợ tìm kiếm theo từ khóa, lọc theo tag chuyên ngành, lọc theo giá tiền (Miễn phí/Trả phí).
*   **Yêu cầu đảm bảo:**
    *   Áp dụng kỹ thuật Lazy Loading hoặc phân trang (Pagination) để tối ưu hiệu năng tải trang ban đầu.
    *   Thiết kế thẻ khóa học (Course Card) hiện đại: Hiển thị tên giảng viên, điểm đánh giá trung bình, giá bán, ảnh thumbnail.
*   **Acceptance Criteria:** Tốc độ lọc kết quả dưới 300ms kể từ khi người dùng thay đổi lựa chọn bộ lọc.
*   **Verification:** Kiểm thử giao diện hiển thị khi không tìm thấy khóa học nào phù hợp (Empty State).

### [BE] Task BE-3.1: API Lấy Danh sách Khóa học & Lọc Dữ liệu Tối ưu
*   **Mô tả:** API truy vấn danh sách khóa học có hỗ trợ phân trang và tìm kiếm toàn văn bản (Full-Text Search) hoặc tìm kiếm theo mẫu trên các trường `title`, `description`.
*   **Yêu cầu đảm bảo:**
    *   Chỉ trả về các khóa học ở trạng thái `PUBLISHED` cho người dùng phổ thông.
    *   Tối ưu hóa câu lệnh SQL (sử dụng Index trên cột `status` và `field`) để đảm bảo thời gian truy vấn nhanh.
*   **Acceptance Criteria:** Dữ liệu trả về đầy đủ các thông tin cấu trúc phân trang (`total_pages`, `current_page`, `page_size`).
*   **Verification:** Đo thời gian phản hồi của API bằng Postman/Swagger khi DB có hơn 1000 bản ghi mẫu.

### [FE] Task FE-3.2: Trang Chi tiết Khóa học & Lộ trình Học thử
*   **Mô tả:** Thiết kế trang xem chi tiết khóa học: Xem bio giảng viên, mô tả nội dung khóa học bằng Markdown và danh sách các chương/bài học bên dưới.
*   **Yêu cầu đảm bảo:**
    *   Nút mua khóa học sẽ sinh yêu cầu thanh toán (nếu là khóa trả phí) hoặc nút "Vào lớp ngay" (nếu là khóa miễn phí).
*   **Acceptance Criteria:** Hiển thị rõ ràng cấu trúc bài học phân cấp (Chương 1 -> Bài học 1.1, Bài học 1.2).
*   **Verification:** Đảm bảo học viên chưa mua khóa học không thể bấm vào các bài học chính thức bị khóa.

### [BE] Task BE-3.2: API CRUD Khóa học & Xác thực Sở hữu của Giảng viên
*   **Mô tả:** Các API tạo mới, chỉnh sửa thông tin chi tiết và gửi yêu cầu phê duyệt khóa học dành riêng cho giảng viên sở hữu.
*   **Yêu cầu đảm bảo:**
    *   Sử dụng JWT để xác định giảng viên hiện tại. Chỉ cho phép chỉnh sửa nếu `user_id` khớp với trường `teacher_id` trong khóa học.
    *   Xử lý lưu trữ ảnh thumbnail khóa học lên MinIO.
*   **Acceptance Criteria:** Giảng viên có thể chuyển trạng thái khóa học sang `PENDING_REVIEW` để gửi Admin kiểm duyệt.
*   **Verification:** Thử dùng tài khoản giảng viên A chỉnh sửa khóa học của giảng viên B, API phải trả về lỗi 403 Forbidden.

### [FE] Task FE-3.3: Classroom Workspace Layout & Trình phát Video HLS Bảo mật
*   **Mô tả:** Giao diện học tập chia làm 2 cột: Sidebar trái chứa danh sách bài giảng với icon trạng thái; main panel phải hiển thị trình xem Markdown lý thuyết và trình phát video hỗ trợ định dạng HLS (`.m3u8`) thông qua thư viện `hls.js` hoặc `video.js`.
*   **Yêu cầu đảm bảo:**
    *   Tích hợp trình xem Markdown chuyên nghiệp hỗ trợ hiển thị code mẫu đẹp mắt (ví dụ: Prism.js hoặc Shiki).
    *   Sử dụng trình phát HLS thay vì đường dẫn trực tiếp MP4 để tránh học viên tải chùa toàn bộ tài nguyên video của khóa học trả phí.
    *   Trình phát video hỗ trợ chỉnh tốc độ phát (0.75x, 1x, 1.5x, 2x) và ghi nhớ thời gian phát cuối cùng.
*   **Acceptance Criteria:** Giao diện co giãn responsive tốt, phát video HLS mượt mà không bị trễ tải phân đoạn (.ts).
*   **Verification:** Mở một video bài giảng và kiểm tra trong tab Network của trình duyệt xem các file phân đoạn (.ts) có được tải thay vì file MP4 dung lượng lớn không.

### [BE] Task BE-3.3: API Curriculum Position & Tích hợp Bộ chuyển đổi HLS Video Transcoder
*   **Mô tả:** API quản lý chương học, bài học có batch update sắp xếp vị trí bài học. Đồng thời, tích hợp dịch vụ transcode video bất đồng bộ (RabbitMQ worker + FFmpeg) để tự động cắt nhỏ video bài giảng tải lên thành định dạng HLS.
*   **Yêu cầu đảm bảo:**
    *   Viết API Batch Update vị trí nhận vào danh sách `{ id, position }` để cập nhật đồng loạt trường `position` trong database.
    *   Khi giảng viên tải lên file video bài giảng (`.mp4`), hệ thống đẩy một task transcode vào RabbitMQ queue. Worker sẽ khởi chạy FFmpeg để chuyển đổi tệp tin thành file index `.m3u8` và các file segment `.ts` tương ứng, lưu trữ trên MinIO.
*   **Acceptance Criteria:** Lưu thứ tự vị trí chính xác trong DB; video bài giảng upload lên được chuyển đổi tự động sang HLS và cập nhật đường dẫn phát trực tuyến HLS.
*   **Verification:** Gọi API upload video, kiểm tra log của RabbitMQ background worker xem tiến trình FFmpeg có chạy thành công và tạo các tệp `.m3u8`, `.ts` trên MinIO.

### [FE] Task FE-3.4: Trình hiển thị Tiến độ học tập & Check hoàn thành
*   **Mô tả:** Giao diện hiển thị tỷ lệ % hoàn thành khóa học của học viên ở sidebar và tự động tích dấu xanh hoàn thành bài học mỗi khi học viên đọc xong hoặc giải xong bài tập đi kèm.
*   **Yêu cầu đảm bảo:**
    *   Cập nhật thời gian thực (Reactive update): Khi giải xong bài tập, dấu tick xanh của bài học phải sáng lên ngay lập tức mà không cần reload trang.
*   **Acceptance Criteria:** Hiển thị thanh tiến độ (Progress Bar) sinh động có hiệu ứng chuyển động nhẹ.
*   **Verification:** Kiểm tra giao diện hiển thị khi tiến độ đạt 100% (hiển thị thông báo chúc mừng hoàn thành khóa học).

### [BE] Task BE-3.4: API Đánh giá & Ghi nhận Tiến độ học tập của Học viên
*   **Mô tả:** API kiểm tra và cập nhật bảng `lesson_content_progress` của học viên. Tự động kiểm tra trạng thái bài học lớn dựa trên các bài thực hành đi kèm.
*   **Yêu cầu đảm bảo:**
    *   Học viên phải đạt ít nhất 80% điểm số quiz đính kèm bài học để hoàn thành mục quiz.
    *   Học viên phải đạt trạng thái `ACCEPTED` cho bài tập coding đính kèm.
    *   Tự động ghi nhận hoàn thành bài học khi toàn bộ bài giảng lý thuyết + bài thực hành đi kèm đều được đánh dấu hoàn thành.
*   **Acceptance Criteria:** Trả về trạng thái tiến độ mới của học viên sau mỗi lần nộp bài tập.
*   **Verification:** Viết unit test giả lập học viên nộp bài thi trắc nghiệm đạt 70% và 90% để kiểm tra việc ghi nhận hoàn thành bài học (AI viết cho nhanh). 

---

## Giai đoạn 4: Hệ thống thực hành giải thuật & Chấm bài (Phase 4: Exercises & Evaluation Engines)
Mục tiêu: Xây dựng trình soạn thảo code, ngân hàng đề bài và dịch vụ sandbox chấm bài lập trình an toàn.

### [FE] Task FE-4.1: Workspace Làm bài trắc nghiệm (Quiz Interface)
*   **Mô tả:** Giao diện hiển thị các câu hỏi trắc nghiệm dưới mỗi bài học. Học viên có thể chọn đáp án và bấm nút "Nộp bài".
*   **Yêu cầu đảm bảo:**
    *   Không gửi thông tin đáp án đúng về trình duyệt trong lúc học viên đang làm bài để chống hack/inspect.
    *   Hiển thị bảng tổng hợp kết quả chi tiết sau khi nộp: Câu trả lời của bạn, câu trả lời đúng, điểm số đạt được và giải thích đáp án (nếu có).
*   **Acceptance Criteria:** Học viên có thể làm lại bài quiz nhiều lần nếu giảng viên không thiết lập giới hạn lượt thi.
*   **Verification:** Inspect element giao diện quiz khi đang làm bài để đảm bảo không tồn tại bất kỳ dấu vết nào của đáp án đúng.

### [BE] Task BE-4.1: API Quản lý đề thi trắc nghiệm & Chấm điểm tự động
*   **Mô tả:** API quản lý câu hỏi trắc nghiệm, đáp án và chấm bài trắc nghiệm của học viên. Tự động tính điểm dựa trên số câu trả lời chính xác và lưu vào `quiz_submission`.
*   **Yêu cầu đảm bảo:**
    *   Sử dụng cấu trúc lưu trữ câu trả lời của học viên dưới dạng JSON trong cột `answers` của bảng `quiz_submission`.
    *   Khống chế thời gian làm bài thi và số lượt thi của học viên theo cấu hình trong bảng `quizzes`.
*   **Acceptance Criteria:** Trả về kết quả điểm số và đánh giá Đạt/Không đạt chính xác dựa trên cấu hình `passing_score`.
*   **Verification:** Test API chấm điểm trắc nghiệm với nhiều bộ câu hỏi khác nhau.

### [FE] Task FE-4.2: Tích hợp Trình Soạn thảo Code Monaco/CodeMirror & Phân tách Run Code/Submit Code
*   **Mô tả:** Tích hợp bộ gõ code chuyên nghiệp hỗ trợ đổi theme, chọn ngôn ngữ và template code. Đồng thời, thiết kế rõ ràng hai hành động: "Chạy thử" (Run Code với input tự nhập) và "Nộp bài" (Submit Code chấm điểm chính thức).
*   **Yêu cầu đảm bảo:**
    *   Tự động lưu tạm code (Auto-save) vào Local Storage của trình duyệt.
    *   Có panel nhập Standard Input (stdin) thủ công và hiển thị kết quả output tương ứng của lệnh Run Code.
*   **Acceptance Criteria:** Học viên có thể chạy thử code nhiều lần với dữ liệu testcase tự thiết lập và nhìn thấy kết quả ngay lập tức.
*   **Verification:** Nhập dữ liệu đầu vào tùy chỉnh, bấm "Chạy thử" xem panel output hiển thị đúng kết quả xử lý của chương trình.

### [BE] Task BE-4.2: API Đăng tải Đề Bài Code & Quản lý Testcase ZIP
*   **Mô tả:** API cho phép giảng viên đăng đề bài tập lập trình mới, tải lên file testcase dạng ZIP chứa các cặp tệp tin đầu vào và đầu ra mong muốn.
*   **Yêu cầu đảm bảo:**
    *   Tự động giải nén file ZIP khi upload, kiểm tra tính trùng khớp về tên của các cặp file đầu vào/đầu ra.
    *   Lưu thông tin testcase vào bảng `testcase` và đẩy file lên MinIO.
*   **Acceptance Criteria:** Hỗ trợ giảng viên cấu hình giới hạn thời gian chạy (ms) và bộ nhớ (MB) cho từng ngôn ngữ lập trình cụ thể trong bảng `problem_config`.
*   **Verification:** Thử tải lên file ZIP testcase bị thiếu file đầu ra, API phải trả về lỗi validate 400.

### [BE] Task BE-4.3: Phát triển Judge Service Sandbox & Tích hợp RabbitMQ Task Queue
*   **Mô tả:** Xây dựng service chấm bài độc lập giao tiếp trực tiếp với Docker Daemon, tích hợp RabbitMQ để nhận các tác vụ chấm bài bất đồng bộ qua hàng đợi, tránh quá tải cho hệ thống khi nhiều người nộp bài cùng lúc.
*   **Yêu cầu đảm bảo:**
    *   Sử dụng thư viện `docker-py` (Docker SDK) để tương tác với Docker. Chạy container non-root, không kết nối mạng (`--network none`).
    *   Cấu hình RabbitMQ consumer để lắng nghe các tác vụ từ queue `submission_queue`. Khi nhận tác vụ, tiến hành chấm bài tuần tự hoặc song song có kiểm soát luồng (concurrency limit).
    *   Khống chế chặt chẽ giới hạn thời gian chạy (timeout) và bộ nhớ tối đa.
*   **Acceptance Criteria:** Service chấm bài tự động kéo task từ hàng đợi RabbitMQ, trả về kết quả thời gian, bộ nhớ và các trạng thái lỗi.
*   **Verification:** Gửi 20 bài nộp code cùng một lúc và kiểm tra xem hàng đợi RabbitMQ có điều phối chấm bài ổn định không bị nghẽn hay sập container.

### [BE] Task BE-4.4: Phân tách API Chạy Thử (Run Code) & Nộp bài Chấm điểm (Submit Code Queue)
*   **Mô tả:** API tiếp nhận mã nguồn của học viên. Tách thành hai endpoint riêng biệt: Endpoint `/run` (chạy đồng bộ trực tiếp với Docker sandbox cho phản hồi nhanh, không lưu DB) và Endpoint `/submit` (đẩy job vào RabbitMQ queue, tạo bản ghi DB ở trạng thái `PENDING` và cập nhật bất đồng bộ).
*   **Yêu cầu đảm bảo:**
    *   Endpoint `/run` chỉ chạy mã nguồn với dữ liệu stdin do học viên nhập lên hoặc sample testcase công khai.
    *   Endpoint `/submit` thực hiện đẩy payload chứa bài nộp sang RabbitMQ. Cập nhật kết quả chi tiết từng testcase vào bảng `submission_result_detail` sau khi RabbitMQ worker xử lý xong.
*   **Acceptance Criteria:** Sự tách biệt rõ ràng giúp tiết kiệm tài nguyên hệ thống (Run Code không lưu DB, Submit Code chạy bất đồng bộ qua queue).
*   **Verification:** Gọi API `/run` xem kết quả trả về ngay lập tức, gọi API `/submit` xem DB ban đầu ghi nhận `PENDING` và sau đó tự cập nhật thành `ACCEPTED` hoặc lỗi.

### [FE] Task FE-4.3: Giao diện Trạng thái Chấm bài thời gian thực & Lịch sử Nộp bài
*   **Mô tả:** Thiết kế bảng điều khiển hiển thị trạng thái chấm bài với hiệu ứng chờ (loading spinner), đổi màu trực quan khi có kết quả: xanh cho `ACCEPTED`, đỏ cho `WRONG_ANSWER`/`COMPILE_ERROR`, cam cho `TLE`/`MLE`.
*   **Yêu cầu đảm bảo:**
    *   Sử dụng Server-Sent Events (SSE) hoặc Polling thông minh (tần suất 1s/lần) để kiểm tra kết quả chấm bài từ backend.
    *   Hiển thị danh sách lịch sử nộp bài cũ của học viên đối với bài tập này để họ có thể xem lại code cũ đã nộp.
*   **Acceptance Criteria:** Học viên nhận được phản hồi kết quả chấm bài trực quan trên giao diện trong vòng dưới 3 giây đối với các chương trình cơ bản.
*   **Verification:** Kiểm tra xem giao diện có hiển thị đầy đủ thông tin dung lượng RAM và thời gian chạy của bài code không.

---

## Giai đoạn 5: Tương tác AI Interview & Tích hợp cổng PayOS (Phase 5: AI Interview & PayOS Checkout)
Mục tiêu: Đưa các tính năng tạo nên sự khác biệt của hệ thống vào hoạt động (phỏng vấn giả lập AI và thanh toán QR Pay tự động).

### [FE] Task FE-5.1: Không gian Chat Phỏng vấn thử với AI (AI Recruiter UI)
*   **Mô tả:** Thiết kế giao diện mô phỏng phòng phỏng vấn xin việc: Khung chat giữa học viên và AI nhà tuyển dụng, ô nhập câu trả lời, bộ đếm số lượt câu hỏi đã trả lời và nút dừng phỏng vấn sớm.
*   **Yêu cầu đảm bảo:**
    *   Vô hiệu hóa (disable) ô nhập liệu và nút gửi tin nhắn khi đang chờ AI trả lời để ngăn học viên spam request.
    *   Giao diện thiết kế gọn gàng, tự động cuộn xuống tin nhắn mới nhất (auto-scroll).
*   **Acceptance Criteria:** Thiết kế thân thiện, hiển thị avatar AI Recruiter chuyên nghiệp và tin nhắn dạng bong bóng rõ ràng.
*   **Verification:** Chat liên tục xem giao diện có giữ được độ mượt mà và tự cuộn trang không.

### [BE] Task BE-5.1: Thiết lập cấu hình Prompt tối ưu & Tích hợp Gemini API
*   **Mô tả:** Thiết lập API khởi tạo buổi phỏng vấn thử, gửi system prompt định hình hành vi cho Gemini API làm nhà tuyển dụng công nghệ.
*   **Yêu cầu đảm bảo:**
    *   System Prompt được tối ưu hóa: Bắt buộc Gemini hỏi từng câu một, đi đúng chủ đề được chọn (`Topic` như Backend/Frontend/Data, `Level` như Intern/Junior/Senior), không được đánh giá trực tiếp trong lúc chat.
    *   Sử dụng thư viện `google-generativeai` để giao tiếp trực tiếp với Gemini API.
*   **Acceptance Criteria:** Lưu thông tin session mới vào bảng `interview_session` ở trạng thái hoạt động và trả về câu hỏi mở đầu.
*   **Verification:** Gọi API khởi tạo và kiểm tra nội dung câu hỏi đầu tiên có khớp với chủ đề đã cấu hình không.

### [BE] Task BE-5.2: API Giao tiếp & Quản lý Trạng thái Hội thoại AI (Conversational Chat State)
*   **Mô tả:** API tiếp nhận phản hồi của học viên, lưu trữ tin nhắn vào bảng `interview_message`, gửi lịch sử hội thoại lên Gemini API để lấy câu hỏi tiếp theo và khống chế giới hạn số lượt phỏng vấn (từ 5 đến 10 lượt câu hỏi).
*   **Yêu cầu đảm bảo:**
    *   Tự động lưu lịch sử hội thoại dưới dạng danh sách tin nhắn để làm ngữ cảnh gửi kèm cho Gemini API.
    *   Nếu buổi phỏng vấn đạt giới hạn số câu hỏi, tự động chặn không cho học viên chat tiếp và chuyển sang bước đánh giá.
*   **Acceptance Criteria:** Giao tiếp ổn định đúng logic, đảm bảo phiên chat duy trì được tính liên kết.
*   **Verification:** Thử chat đến câu thứ 11 xem hệ thống có tự động khóa gửi tin nhắn không.

### [FE] Task FE-5.2: Giao diện Báo cáo Đánh giá AI Sinh động & Lời khuyên cải thiện
*   **Mô tả:** Trang hiển thị báo cáo phỏng vấn thử của học viên sau khi kết thúc. Trực quan hóa điểm số tổng kết bằng đồ thị, phân chia rõ ràng các cột Ưu điểm, Nhược điểm, và Gợi ý cải thiện kỹ năng.
*   **Yêu cầu đảm bảo:**
    *   Giao diện hiển thị gọn gàng, hỗ trợ Responsive Layout cho cả điện thoại di động.
    *   Cho phép người dùng bấm nút chia sẻ hoặc tải báo cáo về máy (optional).
*   **Acceptance Criteria:** Bố cục chuyên nghiệp như một báo cáo đánh giá năng lực thực tế.
*   **Verification:** Kiểm thử xem giao diện hiển thị các đoạn văn bản dài của báo cáo đánh giá có bị tràn màn hình không.

### [BE] Task BE-5.3: API Tổng hợp & Đánh giá Phỏng vấn cấu trúc JSON bằng Gemini
*   **Mô tả:** API kết thúc buổi phỏng vấn, thu thập toàn bộ lịch sử hội thoại của session, gửi yêu cầu chấm điểm và nhận xét chi tiết lên Gemini API dưới định dạng JSON cấu trúc sẵn.
*   **Yêu cầu đảm bảo:**
    *   Prompt yêu cầu Gemini trả về JSON đúng cấu trúc: `{ "overall_score": 8.5, "strengths": "...", "weaknesses": "...", "suggestions": "..." }`.
    *   Nếu Gemini trả về chuỗi không đúng định dạng JSON, hệ thống phải có cơ chế xử lý lỗi (fallback parser) để đảm bảo không bị crash API.
    *   Cập nhật trạng thái session thành `COMPLETED` và lưu báo cáo vào bảng `interview_reports`.
*   **Acceptance Criteria:** Trả về kết quả đánh giá chi tiết với định dạng JSON chuẩn.
*   **Verification:** Kiểm tra dữ liệu được chèn vào bảng `interview_reports` sau khi kết thúc phỏng vấn.

### [FE] Task FE-5.3: Giao diện Thanh toán QR Code & Đợi kết quả giao dịch tự động
*   **Mô tả:** Trang thanh toán mua khóa học hiển thị thông tin đơn hàng, số tiền, mã QR Code VietQR tương ứng được sinh tự động từ PayOS cùng đồng hồ đếm ngược thời gian thanh toán.
*   **Yêu cầu đảm bảo:**
    *   Hiển thị màn hình chờ thanh toán trực quan với hiệu ứng quét sóng.
    *   Tự động mở khóa khóa học và hiển thị màn hình mua thành công ngay khi nhận được tín hiệu thanh toán thành công từ backend mà không bắt người dùng phải reload trang.
*   **Acceptance Criteria:** Chuyển khoản thành công -> UI tự động chuyển hướng người dùng đến lớp học lý thuyết.
*   **Verification:** Thử nghiệm luồng thanh toán với môi trường sandbox của PayOS.

### [BE] Task BE-5.4: API Thanh toán PayOS, Webhook Đồng bộ & Gửi Hóa đơn Email
*   **Mô tả:** API tạo link thanh toán VietQR qua PayOS, endpoint nhận Webhook phản hồi kết quả thanh toán để mở khóa khóa học cho học viên, chia sẻ doanh thu giảng viên, đồng thời kích hoạt RabbitMQ worker gửi hóa đơn điện tử qua Email cho học viên.
*   **Yêu cầu đảm bảo:**
    *   Sử dụng cơ chế locking trong DB (Idempotency) đối với mã giao dịch để chống hiện tượng ghi nhận trùng lặp giao dịch khi PayOS gửi nhiều Webhook.
    *   Xác thực chữ ký số (`signature`) của webhook bằng API Key cấu hình trong `.env`.
    *   Tự động gửi email biên lai thanh toán và thư chào mừng gia nhập khóa học cho học viên ngay sau khi giao dịch thành công.
    *   Chia sẻ doanh thu tự động: Cộng 80% số tiền giao dịch vào ví số dư của giảng viên, 20% giữ lại hệ thống.
*   **Acceptance Criteria:** Tạo link thanh toán thành công, mở khóa học tự động và gửi hóa đơn điện tử qua email cho người học.
*   **Verification:** Gửi request webhook giả mạo không có chữ ký số hoặc chữ ký sai (hệ thống phải từ chối 400); kiểm tra hòm thư của học viên nhận được thư chúc mừng và biên lai giao dịch.

---

## Giai đoạn 6: Tương tác Cộng đồng & Dashboard Quản trị (Phase 6: Moderation, Interactions & Analytics)
Mục tiêu: Đưa hệ thống đi vào vận hành thực tế bằng các công cụ tương tác cộng đồng và báo cáo kinh doanh cho Admin/Giảng viên.

### [FE] Task FE-6.1: Giao diện Bình luận phân cấp dưới bài học
*   **Mô tả:** Thiết kế component bình luận hiển thị phân cấp tối đa 2 cấp (bình luận gốc và trả lời bình luận) nằm ở phía dưới nội dung học lý thuyết.
*   **Yêu cầu đảm bảo:**
    *   Cho phép viết bình luận bằng Markdown đơn giản, hiển thị ảnh avatar người dùng sắc nét.
    *   Nút gửi bình luận hiển thị spinner khi đang gửi.
*   **Acceptance Criteria:** Bố cục rõ ràng, thụt lề chuẩn cho bình luận cấp 2 để người dùng dễ theo dõi luồng trao đổi.
*   **Verification:** Kiểm tra việc sửa đổi hoặc xóa bình luận trực tiếp trên giao diện.

### [BE] Task BE-6.1: API Bình luận lồng nhau & Đẩy thông báo tự động cho Giảng viên
*   **Mô tả:** API CRUD bình luận phân cấp, sử dụng trường `parent_id` tự liên kết đến chính bảng `comment`.
*   **Yêu cầu đảm bảo:**
    *   Khi học viên gửi bình luận mới, hệ thống tự động tạo bản ghi thông báo (`notification`) gửi tới tài khoản giảng viên sở hữu khóa học đó.
*   **Acceptance Criteria:** Trả về cây thư mục bình luận đầy đủ thông tin người dùng và thời gian viết bình luận dạng thân thiện (ví dụ: "5 phút trước").
*   **Verification:** Gửi bình luận và kiểm tra xem bảng `notification` có ghi nhận thông báo cho giảng viên không.

### [FE] Task FE-6.2: Giao diện Báo cáo Vi phạm & Trang Admin Kiểm duyệt khóa học
*   **Mô tả:** Thiết kế popup cho phép học viên gửi báo cáo vi phạm khóa học (lý do vi phạm, mô tả chi tiết). Thiết kế dashboard quản lý báo cáo dành riêng cho Admin để phê duyệt khóa học hoặc ẩn khóa học vi phạm.
*   **Yêu cầu đảm bảo:**
    *   Màn hình kiểm duyệt của Admin hiển thị danh sách khóa học kèm theo số lượng báo cáo vi phạm tích lũy.
    *   Nút "Ẩn khóa học" và "Cảnh cáo Giảng viên" hoạt động trực quan.
*   **Acceptance Criteria:** Admin có công cụ kiểm duyệt khóa học hiệu quả trước khi cho phép công khai trên catalog.
*   **Verification:** Thử gửi báo cáo vi phạm và kiểm tra xem danh sách báo cáo của Admin có cập nhật số lượng tăng lên không.

### [BE] Task BE-6.2: API Flagging System & Khóa Khóa Học Vi Phạm
*   **Mô tả:** API báo cáo vi phạm khóa học và API thay đổi trạng thái khóa học dành cho Admin (`ARCHIVED`/`DRAFT`).
*   **Yêu cầu đảm bảo:**
    *   Nếu một khóa học bị Admin chuyển sang trạng thái ẩn, các API tìm kiếm công khai lập tức loại bỏ khóa học này ra khỏi danh sách trả về.
    *   Lưu lịch sử hành động kiểm duyệt vào bảng `audit_log`.
*   **Acceptance Criteria:** Bảo vệ người dùng khỏi các nội dung xấu/độc hại nhanh chóng.
*   **Verification:** Gọi API ẩn khóa học từ Admin và kiểm tra xem học viên có truy cập được link chi tiết khóa học đó nữa không (phải trả về lỗi 404).

### [FE] Task FE-6.3: Dashboard Giảng viên & Biểu đồ doanh thu trực quan
*   **Mô tả:** Xây dựng bảng điều khiển cho giảng viên hiển thị biểu đồ doanh thu theo thời gian, thống kê lượng học viên đăng ký mới, danh sách học viên theo học và tiến độ học tập chi tiết của từng người.
*   **Yêu cầu đảm bảo:**
    *   Tích hợp thư viện đồ thị vẽ biểu đồ cột/đường đẹp mắt (như Chart.js hoặc ApexCharts).
    *   Hỗ trợ chuyển đổi chế độ xem biểu đồ theo Ngày/Tuần/Tháng.
*   **Acceptance Criteria:** Giảng viên nắm bắt được tình hình tài chính và hỗ trợ kịp thời học viên đang bị kẹt ở bài học nào.
*   **Verification:** Hover chuột vào các điểm trên đồ thị xem thông tin chi tiết số tiền doanh thu hiển thị chính xác.

### [BE] Task BE-6.3: API Thống kê Doanh thu & Tiến độ Học viên cho Giảng viên
*   **Mô tả:** API thực hiện các truy vấn gom nhóm (`GROUP BY`) và tính tổng (`SUM`) doanh thu thực nhận của giảng viên theo mốc thời gian.
*   **Yêu cầu đảm bảo:**
    *   Tối ưu hóa câu lệnh SQL truy vấn tổng hợp để tránh làm chậm hệ thống khi dữ liệu giao dịch lớn.
    *   API trả về danh sách học viên kèm theo tên bài học cuối cùng họ hoàn thành và thời gian hoạt động cuối cùng.
*   **Acceptance Criteria:** Trả về dữ liệu thống kê đầy đủ và nhanh chóng.
*   **Verification:** So sánh dữ liệu doanh thu trả về từ API dashboard với tổng số tiền giao dịch thành công trong database.

### [FE] Task FE-6.4: Admin Dashboard UI - Thống kê Hệ thống & Tra cứu Audit Log
*   **Mô tả:** Thiết kế giao diện Admin quản lý người dùng (Ban/Unban), xem danh sách giao dịch toàn hệ thống và tra cứu lịch sử thao tác của các tài khoản (Audit Log).
*   **Yêu cầu đảm bảo:**
    *   Hỗ trợ tìm kiếm nhanh người dùng theo email và phân trang tiện lợi.
    *   Hiển thị rõ ràng danh sách audit log dạng bảng thời gian giảm dần.
*   **Acceptance Criteria:** Giao diện quản trị toàn diện giúp Admin kiểm soát hoạt động của toàn bộ nền tảng.
*   **Verification:** Thử ban một tài khoản học viên và đăng nhập bằng tài khoản đó xem hệ thống có hiển thị thông báo tài khoản bị khóa không.

### [BE] Task BE-6.4: API Dashboard Quản trị Admin & Tra cứu Audit Log
*   **Mô tả:** API quản lý người dùng, thay đổi `account_status` (`BANNED`/`ACTIVE`), tra cứu lịch sử audit log và đối soát toàn bộ các giao dịch tài chính.
*   **Yêu cầu đảm bảo:**
    *   Khi thay đổi trạng thái tài khoản thành `BANNED`, hệ thống phải vô hiệu hóa toàn bộ session hiện tại của người dùng đó trong Redis để buộc họ đăng xuất ngay lập tức.
*   **Acceptance Criteria:** Bảo vệ hệ thống khỏi các tài khoản phá hoại hiệu quả.
*   **Verification:** Ban tài khoản đang đăng nhập và kiểm tra xem token của tài khoản đó có bị từ chối truy cập API ngay lập tức không.

---

## Giai đoạn 7: Bảo mật, Kiểm thử E2E & Triển khai Staging (Phase 7: Hardening, E2E Testing & Staging Release)
Mục tiêu: Đảm bảo chất lượng sản phẩm tốt nhất, an toàn trước các cuộc tấn công và sẵn sàng chạy trên môi trường Staging.

### [BE] Task BE-7.1: Bảo mật Hardening (SQL Injection, XSS, Rate Limiting)
*   **Mô tả:** Cài đặt các cơ chế bảo mật bổ sung cho API Backend: Xử lý làm sạch đầu vào (Input Sanitization) chống XSS, sử dụng SQLAlchemy ORM tránh SQL Injection, cấu hình Rate Limiting trên các endpoint nhạy cảm.
*   **Yêu cầu đảm bảo:**
    *   Cấu hình Rate Limiting (ví dụ: tối đa 5 lần nộp code chấm bài/phút, 5 lần khởi tạo chat AI/phút, 5 lần thử đăng nhập/phút).
    *   Chặn các thẻ script HTML nguy hiểm trong nội dung bài viết Markdown được giảng viên soạn thảo.
*   **Acceptance Criteria:** Hệ thống đứng vững trước các công cụ quét bảo mật tự động cơ bản.
*   **Verification:** Sử dụng tool thử spam request liên tục lên API để kiểm tra xem hệ thống có trả về lỗi `429 Too Many Requests` không.

### [FE] Task FE-7.1: Viết kiểm thử E2E & Component Testing cho Frontend
*   **Mô tả:** Viết các ca kiểm thử tự động bằng Vitest và Playwright cho các luồng tương tác quan trọng của Frontend: Luồng Đăng nhập, Làm bài thi trắc nghiệm, Viết code trong Monaco Editor và gửi chấm bài.
*   **Yêu cầu đảm bảo:**
    *   Tỷ lệ bao phủ kiểm thử (Test Coverage) cho các component cốt lõi đạt trên 70%.
    *   Mô phỏng chính xác hành vi click chuột, nhập văn bản của người dùng thực tế.
*   **Acceptance Criteria:** Các kịch bản test tự động chạy thành công mà không gặp lỗi cấu hình.
*   **Verification:** Run `bun run test` và kiểm tra báo cáo kết quả kiểm thử.

### [BE] Task BE-7.2: Viết Integration Tests cho Business Application API
*   **Mô tả:** Xây dựng hệ thống unit/integration test sử dụng thư viện `pytest` và `pytest-asyncio` kiểm thử toàn bộ API Backend kết nối với database test riêng.
*   **Yêu cầu đảm bảo:**
    *   Mỗi ca test chạy trong một transaction tự động rollback sau khi test xong để không làm bẩn dữ liệu database test.
    *   Kiểm tra đầy đủ các trường hợp đầu vào hợp lệ và không hợp lệ.
*   **Acceptance Criteria:** Độ bao phủ kiểm thử API đạt trên 80%.
*   **Verification:** Chạy lệnh `pytest` trong thư mục backend và kiểm tra báo cáo độ bao phủ test.

### [BE/FE] Task BE/FE-7.3: Triển khai Staging & Tối ưu hóa Build Production
*   **Mô tả:** Viết file cấu hình docker-compose hoàn chỉnh cho môi trường Staging. Build bundle tối ưu hóa dung lượng Frontend cho production, tối ưu hóa các tệp static assets.
*   **Yêu cầu đảm bảo:**
    *   Frontend được build sang dạng tệp tĩnh và cấu hình CDN/caching hợp lý.
    *   Backend chạy uvicorn với số lượng worker tối ưu dựa trên cấu hình CPU của server host.
    *   Cấu hình biến môi trường an toàn: Tuyệt đối không để lộ mật khẩu DB hay API Key trong mã nguồn, toàn bộ phải đọc từ môi trường của server staging.
*   **Acceptance Criteria:** Hệ thống SkillBoost được deploy thành công lên server Staging và hoạt động ổn định.
*   **Verification:** Truy cập domain staging, thực hiện mua thử khóa học, học thử và chấm bài trực tuyến xem có trơn tru không.
