## 1. Một số vấn đề hệ thống 
- 
- mapping được cú pháp snake_case -> camelCase: alias_generator 

## 2. Verify API Spec 
Nhiệm vụ: Kiểm tra các API route trong file api-spec.md đã phù hợp với database hiện tại chưa? Các trường request - response có phù hợp với yêu cầu bên FE không? 

- Phần 1 + 2: Hoàng Nhi 
- Phần 3 + 4: Trâm Anh 
- Phần 5 + 6: Lý Thảo Nguyên -
- Phần 7 + 8: Khả An 
- Phần 9 + 10: Đức 

Sau khi hoàn thành, feedback lại phần nội dung để tiến hành chỉnh sửa file api-spec.md. 

**Deadline**: 25/7/2026 

## 3. Dựng base cho Backend 

- Tiến hành code Pydantic Model (Schema) cho từng API route trong file api-spec.md 

- **Mục tiêu**: 

    + Chỉ cần mock được data và gửi trả về bên FE, chưa cần thực hiện logic. 
    + Có thể handle thêm một số lỗi trước (Ví dụ: Không tìm thấy người dùng trong hệ thống -> Trả luôn lỗi 404). 

**Deadline**: 06/08/2026

## 4. Lưu ý khi chạy dự án: 
- Docker sử dụng extension Docker trong Vscode. Sau khi cài đặt thì 
- BE sử dụng uv để có thể chạy được: https://docs.astral.sh/uv/getting-started/installation/