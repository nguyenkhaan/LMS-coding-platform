# Tổng kết quá trình thực hiện 

## 1. Các thay đổi chính 

### Cập nhật tài liệu 
- Cập nhật / bổ sung các tài liệu trong dự án để phù hợp với giao diện Figma: 
    + gap-analysis.md: Mô tả các điểm, cần thay đổi để tạo ra được sự đồng bộ với giao diện 
    + prd.md: Mô tả kiến trúc dự án
    + api_spec.md: Tài liệu mô tả các API cần thiết và phù hợp 
    + ui/: Thư mục biểu diễn các wireframe hiện tại của Figma 

### Bổ sung các bảng 

- `teacher_register_history`: lưu lịch sử submit, review, resubmit và người thực hiện của hồ sơ teacher.
- `teacher_education`: lưu quá trình học vấn của teacher.
- `teacher_experience`: lưu kinh nghiệm làm việc của teacher.
- `course_moderation_review`: lưu lịch sử approve/reject course, ghi chú, reviewer và thời điểm review.
- `problem_tag_mapping`: liên kết nhiều-nhiều giữa problem và problem tag để phục vụ lọc và recommendation.
- `cart`: lưu giỏ hàng của từng student.
- `cart_item`: lưu các course trong giỏ hàng và ngăn course trùng trong cùng cart.
- `orders`: lưu thông tin order, subtotal, currency, thời hạn và idempotency key.
- `order_item`: lưu từng course trong order cùng giá và currency tại thời điểm mua.
- `course_favorite`: lưu course yêu thích của student.
- `course_review`: lưu rating và nội dung review course của student đã enrollment.
- `wallet`: lưu số dư khả dụng, số dư chờ xử lý và currency của teacher.
- `wallet_ledger`: lưu immutable ledger cho doanh thu, reserve, release và refund.
- `payout_request`: lưu yêu cầu rút tiền, trạng thái xử lý, reviewer và settlement reference.
- `student_daily_activity`: lưu hoạt động hằng ngày, thời gian học, số problem đã giải và dữ liệu contribution dashboard.


## 2. Các thay đổi FE 


## 3. Chi tiết công việc cần bàn 
- Giới thiệu về database và luồng logic mới 
- Trả lời các câu hỏi trong file gap-analysis.md 
