# BIÊN BẢN HỌP KHỞI ĐỘNG & TRIỂN KHAI DỰ ÁN
## HỆ THỐNG LMS CODING PLATFORM (SKILLBOOST)

### I. THÔNG TIN CHUNG
- **Thời gian:** `16/07/2026`
- **Địa điểm:** `https://meet.google.com/gsd-exjx-krb`
- **Thành viên tham dự:**
  - **Nhóm Frontend:** `[Điền tên]`
  - **Nhóm Backend:** `[Điền tên]`

---

### II. NỘI DUNG CUỘC HỌP

#### 1. Thống nhất về Tầm nhìn & Tóm tắt Dự án (PRD)
*Tóm tắt kiến trúc 4 dịch vụ chính:*
1. **Frontend:** SvelteKit + TailwindCSS v4 + Monaco/CodeMirror Editor.
2. **Auth Provider:** Đăng ký, đăng nhập qua Google OAuth2 / JWT.
3. **Business App:** FastAPI + PostgreSQL xử lý core LMS, PayOS, Gemini.
4. **Judge Service:** FastAPI + Docker SDK chấm điểm code an toàn.

**Ý kiến thảo luận / Ghi chú từ các thành viên:**
- `[Điền ý kiến đóng góp, phản hồi về mô hình phân chia dịch vụ và công nghệ ở đây]`

---

#### 2. Thống nhất các Luồng Nghiệp vụ Cốt lõi
*Các luồng nghiệp vụ chính:*
- **Luồng 1 (Thanh toán):** Học viên mua -> PayOS QR Code -> Webhook cập nhật đơn hàng thành COMPLETED -> Tự động chia sẻ doanh thu (80% cho Teacher, 20% cho Hệ thống) -> Mở khóa học.
- **Luồng 2 (Online Judge):** Viết code -> Submit -> Gửi sang Judge Service -> Chạy trong container Docker cô lập (chặn internet, giới hạn RAM/CPU) -> Đối chiếu expected output -> Trả về kết quả (AC/WA/TLE/MLE...).
- **Luồng 3 (AI Interview):** Chọn chủ đề/level -> Gemini đóng vai nhà tuyển dụng -> Chat turn-based 5-10 câu -> Kết thúc -> Chấm điểm, đánh giá chi tiết (JSON).

**Ý kiến thảo luận / Thay đổi luồng nghiệp vụ:**
- `[Điền ý kiến đóng góp về luồng thanh toán, cách thức hoạt động của Online Judge hay AI Interview ở đây]`

---

### III. THẢO LUẬN CHUYÊN ĐỀ & QUYẾT ĐỊNH (DISCUSSION & RESOLUTIONS)

#### Chủ đề 1: Bảo mật Docker Sandbox cho Online Judge
*Học viên có thể viết code phá hoại hệ thống (vòng lặp vô hạn, fork bomb, chiếm quyền host).*
- **Ý kiến thảo luận:**

  - `(Ví dụ: Giới hạn pids-limit=100, RAM 256MB, CPU 0.5, chế độ Read-only...)]`

#### Chủ đề 2: Lưu trữ và truyền tải Testcase lớn
*Testcase dung lượng lớn (hàng chục MB) có thể làm chậm database nếu query liên tục.*
- **Ý kiến thảo luận:**

  - `(Ví dụ: Lưu cache testcase cục bộ tại server Judge, chỉ tải lại khi có thông báo thay đổi từ Business App)]`

#### Chủ đề 3: Kiểm soát chi phí API Gemini (AI Interview)
*Học viên spam phòng phỏng vấn thử làm gia tăng chi phí Token API.*
- **Ý kiến thảo luận:**

  - `(Ví dụ: Giới hạn 3 phiên phỏng vấn/ngày/học viên, khống chế số lượng ký tự tối đa nhập vào)]`

#### Chủ đề 4: UI/UX cho Code Editor trên Web
*Chọn thư viện Code Editor phù hợp trên SvelteKit để có trải nghiệm mượt mà.*
- **Ý kiến thảo luận:**
  - `(Ví dụ: Monaco Editor hoặc CodeMirror và lý do chọn)]`

#### Chủ đề 5: Thiết kế luồng học bài giảng (Video/Hình ảnh + Nhiều Bài thực hành)
*Mỗi bài học sẽ gồm bài viết lý thuyết, video và hình ảnh tùy chọn kèm theo danh sách bài tập trắc nghiệm và bài tập coding.*
- **Ý kiến thảo luận:**
  - `[Ghi nhận ý kiến thảo luận về cách hiển thị video, danh sách bài tập dạng Tab hay cuộn trang ở đây]`
- **👉 Phương án chốt:**
  - `[Ghi nhận giải pháp thống nhất cuối cùng (Ví dụ: Dùng tab chuyển đổi giữa lý thuyết và bài thực hành)]`

#### Chủ đề 6: Quy trình xác minh căn cước công dân (CCCD) cho Giảng viên
*Làm thế nào để đảm bảo thông tin CCCD thật và khớp với hồ sơ người dùng?*
- **Ý kiến thảo luận:**
  - `[Ghi nhận ý kiến thảo luận ở đây]`
- **👉 Phương án chốt:**
  - `[Ghi nhận giải pháp thống nhất cuối cùng (Ví dụ: Admin kiểm tra thủ công ảnh chụp và số CCCD trên Dashboard Admin ở phiên bản đầu tiên)]`

---

### IV. BẢN PHÂN CHIA CÔNG VIỆC & TIẾN ĐỘ TRIỂN KHAI (TASK ASSIGNMENT)

| Stt | Đầu việc cụ thể | Người phụ trách | Hạn hoàn thành | Trạng thái | Ghi chú |
| :-- | :--- | :--- | :--- | :--- | :--- |
| **A** | **NHÓM FRONTEND (SVELTEKIT)** | | | | |
| 1 | Giao diện xem bài học (Video Player + Markdown + Danh sách bài thực hành) | `[Điền tên]` | `[Điền hạn]` | Chưa chạy | |
| 2 | Giao diện Dashboard Giảng viên (Biểu đồ doanh thu, Payout history, quản lý học viên) | `[Điền tên]` | `[Điền hạn]` | Chưa chạy | |
| 3 | Giao diện nộp đơn Become Teacher và upload ảnh CCCD (Mặt trước/sau) | `[Điền tên]` | `[Điền hạn]` | Chưa chạy | |
| 4 | Tích hợp Monaco/CodeMirror Code Editor & Kết quả OJ | `[Điền tên]` | `[Điền hạn]` | Chưa chạy | |
| 5 | Giao diện chat AI Interview & Trang bảng điểm | `[Điền tên]` | `[Điền hạn]` | Chưa chạy | |
| 6 | Giao diện mua khóa học PayOS | `[Điền tên]` | `[Điền hạn]` | Chưa chạy | |
| **B** | **NHÓM BACKEND CORE (FASTAPI + POSTGRESQL)** | | | | |
| 1 | Thiết kế và Migration Database bổ sung (`lesson_exercises`, `quiz_submissions`, CCCD fields) | `[Điền tên]` | `[Điền hạn]` | Chưa chạy | |
| 2 | API Bài giảng (Markdown + Video/Image) và CRUD bài thực hành đi kèm | `[Điền tên]` | `[Điền hạn]` | Chưa chạy | |
| 3 | API Dashboard Giảng viên (Thống kê doanh thu, tiến độ học viên) | `[Điền tên]` | `[Điền hạn]` | Chưa chạy | |
| 4 | API Thanh toán PayOS + Webhook đối soát tự động chia 80/20 | `[Điền tên]` | `[Điền hạn]` | Chưa chạy | |
| 5 | API Duyệt CCCD Giảng viên cho Admin và API AI Interview | `[Điền tên]` | `[Điền hạn]` | Chưa chạy | |
| **C** | **NHÓM JUDGE SERVICE (DOCKER SANDBOX)** | | | | |
| 1 | Viết ứng dụng `judge` độc lập chấm bài, Docker sandbox | `[Điền tên]` | `[Điền hạn]` | Chưa chạy | |
| 2 | Logic so khớp output, bắt lỗi TLE/MLE/RE | `[Điền tên]` | `[Điền hạn]` | Chưa chạy | |
| **D** | **NHÓM DEVOPS & INFRASTRUCTURE** | | | | |
| 1 | Thiết lập Docker Compose chạy toàn bộ services | `[Điền tên]` | `[Điền hạn]` | Chưa chạy | |
| 2 | Quản lý biến môi trường (.env) và CI/CD cơ bản | `[Điền tên]` | `[Điền hạn]` | Chưa chạy | |

---

### V. KẾ HOẠCH HÀNH ĐỘNG TIẾP THEO (ACTION ITEMS)
1. **DevOps:** Setup repo chung và Docker Compose khung trước ngày `[Điền hạn]`.
2. **Backend:** Hoàn thành thiết kế database vật lý nâng cấp trước ngày `[Điền hạn]`.
3. **Frontend:** Cung cấp bản thiết kế UI/UX trên Figma (đặc biệt là bài học có nhiều bài thực hành và Teacher Dashboard) trước ngày `[Điền hạn]`.
4. **Buổi họp tiếp theo (Demo & Sync):** Dự kiến vào lúc `[Điền ngày/tháng/năm]` để đánh giá tiến độ Sprint 1.

