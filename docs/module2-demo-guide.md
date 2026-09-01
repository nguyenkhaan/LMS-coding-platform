# Hướng dẫn Demo Module 2: Catalog, Student & Phân quyền Teacher

Tài liệu này được thiết kế dành cho mọi người (kể cả không có nền tảng kỹ thuật) có thể tự chạy và thuyết trình demo tính năng của Module 2 trong các buổi họp (ví dụ: qua Google Meet). 

---

## Phần 1: Các bước chuẩn bị trước khi demo (Cầm tay chỉ việc)

### Bước 1.1: Bật Docker Desktop
- **Làm gì?** Tìm biểu tượng con cá voi (Docker Desktop) trên máy tính của bạn và mở nó lên. 
- **Giải thích:** Chúng ta cần phần mềm này để tạo ra một "máy chủ ảo" chứa cơ sở dữ liệu (Database) phục vụ cho dự án. Chờ đến khi góc dưới bên trái của Docker báo chữ **"Engine running"** màu xanh lá.

### Bước 1.2: Chạy hệ thống cơ sở dữ liệu
- Mở một phần mềm gõ lệnh trên máy bạn (Terminal, Command Prompt hoặc PowerShell).
- Gõ dòng lệnh sau để chuyển vào thư mục gốc của dự án:
  ```bash
  cd D:\LMS-coding-platform
  ```
  *(Thay thế đường dẫn trên bằng đường dẫn lưu code trên máy của bạn nếu khác).*
- Gõ tiếp lệnh khởi động Database:
  ```bash
  docker compose up -d
  ```
- **Kiểm tra:** Đợi khoảng 10 giây, nếu màn hình hiện lên một loạt chữ `Started` là thành công.

### Bước 1.3: Chạy server (Business Application) bằng Script Demo
- Vẫn ở màn hình gõ lệnh đó, bạn tiếp tục đi sâu vào thư mục ứng dụng kinh doanh bằng lệnh:
  ```bash
  cd src\backend\business-application
  ```
- Thay vì chạy lệnh khởi động thông thường, hãy chạy script demo (nó sẽ tự sinh token dùng 1 lần và nạp key bảo mật ảo vào RAM mà không làm bẩn code thật):
  ```bash
  uv run python scripts\demo_server.py
  ```
- **Kiểm tra:** Trên màn hình lệnh sẽ in ra 2 đoạn mã Token dài (một cho STUDENT, một cho TEACHER). Hãy để cửa sổ này mở để lát nữa chúng ta copy token đưa vào web. Phía dưới cùng báo dòng `Uvicorn running on http://0.0.0.0:4000` là thành công.

### Bước 1.4: Mở giao diện API (Swagger UI)
- Mở trình duyệt web (Chrome/Edge/Safari).
- Truy cập vào đường link: [http://localhost:4000/docs](http://localhost:4000/docs)
- **Swagger UI là gì?** Đây là một giao diện website tự động giúp chúng ta "bấm nút" dùng thử các tính năng của hệ thống thay vì phải viết code dài dòng.

---

## Phần 2: Kịch bản trình diễn tính năng (Demo Script)

Khi trình bày trên Google Meet, bạn hãy chia sẻ màn hình website Swagger UI và làm theo từng mục dưới đây. 

### 1. Tính năng xem danh sách khóa học (Browse Catalog)
- **Thao tác trên web:** Kéo xuống tìm dòng chữ màu xanh lá cây `GET /api/courses` (nhóm "Student Course Directory"). 
- Bấm vào nó -> Bấm nút **"Try it out"** ở góc phải -> Bấm nút xanh dương **"Execute"**.
- **Kết quả mong đợi:** Kéo xuống mục "Server response", bạn sẽ thấy `Code: 200` và một khung dữ liệu có danh sách các khóa học (ví dụ "Nhập môn Lập trình Python").
- 🗣️ **Lời thoại thuyết trình:** *"Tính năng đầu tiên là Danh sách khóa học (Catalog). Mọi người dùng dù chưa đăng nhập đều có thể vào đây để xem các khóa đang mở, kèm thông tin như giá tiền, số người đang học, và đánh giá sao."*

### 2. Tính năng xem chi tiết khóa học
- **Thao tác:** Kéo xuống dòng `GET /api/courses/{slug}` -> Bấm **"Try it out"**.
- Ở ô nhập chữ **`slug`**, hãy copy và dán vào: `nhap-mon-lap-trinh-python`
- Bấm **"Execute"**.
- **Kết quả mong đợi:** Mã `200` và một danh sách bài học nằm trong khóa học Python.
- 🗣️ **Lời thoại thuyết trình:** *"Khi học viên click vào một khóa học, hệ thống sẽ trả về chi tiết mô tả và dàn ý nội dung bài học để họ tham khảo trước khi mua."*

### 3. Đăng ký khóa học (Enroll)
- **Thao tác:** Khác với 2 API trước (Public), để đăng ký học bạn cần có danh tính. Hãy kéo lên trên cùng trang Swagger, bấm vào nút **"Authorize"** (có hình ổ khóa 🔒).
- Tại ô **Value**, hãy mở lại cửa sổ màn hình đen (terminal) ở Bước 1.3, copy toàn bộ đoạn mã bên dưới chữ **[HỌC VIÊN - STUDENT TOKEN]** và dán vào ô này.
- Bấm **"Authorize"** rồi bấm **"Close"**. Lúc này bạn đã "đăng nhập" với tư cách Học viên.
- Quay lại tìm dòng `POST /api/courses/{slug}/enroll` -> Bấm **"Try it out"**.
- Ở ô **`slug`**, dán: `nhap-mon-lap-trinh-python`
- Bấm **"Execute"**. *(Chú ý: không có ô `user` nào hiển thị ở đây vì hệ thống tự động trích xuất thông tin học viên từ token bạn vừa nhập ở trên).*
- **Kết quả mong đợi:** Mã `201` và thông báo `{"status": "enrolled"}`.
- 🗣️ **Lời thoại thuyết trình:** *"Tiếp theo là đăng ký học. Hệ thống tự động nhận diện danh tính học viên qua chuỗi JWT bảo mật ở nút Authorize và cấp quyền vào lớp ngay lập tức vì khóa Python đang miễn phí."*

### 4. Học viên làm bài tập (Quiz) và chấm điểm tự động
- **Thao tác:** Kéo xuống mục `POST /api/student/quizzes/{quiz_id}/submit` -> Bấm **"Try it out"**.
- Ở ô **`quiz_id`**, nhập: `1`
- Ở ô **`payload`** (bài làm của học viên), copy và dán đoạn chữ này (giả lập việc làm đúng hết 3 câu):
  ```json
  {
    "answers": {
      "1": 2,
      "2": 3,
      "3": 1
    }
  }
  ```
- Bấm **"Execute"**. *(Lưu ý: chúng ta vẫn đang dùng token Học viên đã nhập từ bước 3).*
- **Kết quả mong đợi:** Trả về `Code 200` với kết quả: `"score": 10.0` và `"passed": true`.
- 🗣️ **Lời thoại thuyết trình:** *"Khi học viên nộp bài trắc nghiệm, hệ thống sẽ tự động đối chiếu đáp án, tính điểm và quyết định đỗ hay trượt dựa trên một ngưỡng điểm pass linh hoạt (passing_score) được cài đặt riêng cho mỗi bài quiz thay vì đóng cứng một con số. Ví dụ bài này ngưỡng đỗ là 5 điểm, học viên đạt 10 điểm nên đã thi đậu."*

### 5. Điểm nhấn Kỹ thuật: Phân quyền bảo mật (Role Middleware)
- **Thao tác 1:** Kéo xuống mục "Teacher Curriculum Builder", tìm dòng `POST /api/teacher/courses/{course_id}/sections` -> Bấm **"Try it out"**.
- Ở ô **`course_id`**, nhập: `1`
- Ở ô **`data`**, giữ nguyên cấu trúc mặc định.
- Bấm **"Execute"** (vẫn đang dùng token Học viên).
- **Kết quả mong đợi 1:** Lỗi `Code 403` màu đỏ, thông báo chi tiết: `"You do not have permission to access this resource"`.
- 🗣️ **Lời thoại thuyết trình 1:** *"Cuối cùng, chúng tôi muốn demo lớp khiên bảo mật của hệ thống. Nếu một học viên bình thường cố tình gọi API của Giảng viên, bộ lọc phân quyền (Role Middleware) sẽ lập tức chặn lại bằng lỗi 403."*

- **Thao tác 2:** Cuộn lên trên cùng, bấm nút **"Authorize"** 🔒 -> bấm **"Logout"**.
- Dán chuỗi token **[GIẢNG VIÊN - TEACHER TOKEN]** (lấy từ màn hình đen terminal) vào ô Value và bấm **Authorize**.
- Kéo xuống lại API `POST /api/teacher/courses/{course_id}/sections`, bấm **Execute**.
- **Kết quả mong đợi 2:** Trả về lỗi `Code 422 Unprocessable Entity` (do body tự động sinh thiếu field, nhưng điều đó chứng tỏ Role Middleware đã bỏ qua luồng bảo mật 403 thành công). 
- 🗣️ **Lời thoại thuyết trình 2:** *"Nhưng khi chúng ta Logout và đăng nhập lại bằng Token của Giảng viên, hệ thống ngay lập tức cho phép vượt qua chốt chặn bảo mật 403 (trả về 422 nghĩa là đã đi sâu vào trong hệ thống thành công). Đây là cách hệ thống phân chia luồng dữ liệu an toàn tuyệt đối."*
