# NỘI DUNG BUỔI HỌP 

## 1. Thực hiện Manual Testing và tiếp tục bổ sung các API còn thiếu 
**Hnhi** 
- Thực hiện manual testing cho các API mới phát hiện lỗi 
    + Teacher course / admin 
    + Student / student_course: Tìm cụm từ `Test Student 123`. 

- Bị thiếu API: POST /courses/{slug}/enroll. Thực hiện copy từ student_course_directory vào bên trong module payment để đông bộ với tài liệu api_spec.md 

**Đức** 
- API payment hiện tại phần route + response chưa được khớp so với yêu cầu của tài liệu. 

**An** 
- Triển khai các API còn lại trên oddo

## 2. Thực hiện nối API từ FE vào bên trong BE 
- Đăng ký / Đăng nhập -> Đăng xuất: **Thảo Nguyên**
- Râu ria liên quan tới auth: **Trâm Anh** 


- Thực hiện nối API cho phần Xác thực tài khoản và phân quyền dự án. 
    + Hướng dẫn mọi người thao tác API với Backend => Research cách thức để nối API cho hệ thống SSO 

    + Chỉnh sửa lại trang hệ thống đăng nhập cho phù hợp. Hiện tại vì đang sử dụng một service riêng dành cho việc đăng nhập. Nên trang đăng nhập hệ thống này cũng phải được design lại cho phù hợp. 

    + Nối các API liên quan đến Authentication khác: Forgot password, forgot email... 
- Kéo giao diện từ bên FE về cho phần auth service (Kéo được hay không thôi?)

- Đường link: http://localhost:8025
