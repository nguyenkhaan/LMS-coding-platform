# Tổng kết quá trình thực hiện 

Deadline thực hiện các task: 17/08/2026

**BE:** 
- Research luồng Online Judge. Output: một file markdown có luồng bằng mermaid và nội dung bằng văn bản (Hnhi)
- Chỉnh sửa lại Database (An)
- Research luồng thanh toán khóa học (NNĐ) 
- Phân chia code tiếp các module đã chia trong Oddoo. 

**FE** 
- Thảo luận lại câu hỏi 
- Chỉnh sủa lại Figma UI theo database 
- Thực hiện research công nghệ sử dụng cho FE (deploy lên Vercel hoặc Cloudflare Worker): Những công nghệ, thư viện sử dụng không được conflict với môi trường. 

## 1. Các thay đổi chính 

### Cập nhật tài liệu 
- Cập nhật / bổ sung các tài liệu trong dự án để phù hợp với giao diện Figma: 
    + gap-analysis.md: Mô tả các điểm, cần thay đổi để tạo ra được sự đồng bộ với giao diện 
    + prd.md: Mô tả kiến trúc dự án
    + api_spec.md: Tài liệu mô tả các API cần thiết và phù hợp 
    + ui/: Thư mục biểu diễn các wireframe hiện tại của Figma 

### Bổ sung các bảng 

#### Teacher và khóa học 
- `teacher_register_history`: lưu lịch sử submit, review, resubmit và người thực hiện của hồ sơ teacher.
- `course_moderation_review`: lưu lịch sử approve/reject course, ghi chú, reviewer và thời điểm review. Teacher tạo ra course -> Đưa khóa học cho admin duyệt trước => Teacher mới được public khóa học. 
- `problem_tag_mapping`: liên kết nhiều-nhiều giữa problem và problem tag để phục vụ lọc và recommendation.
#### Thanh toán
- `cart`: lưu giỏ hàng của từng student.
- `cart_item`: lưu các course trong giỏ hàng và ngăn course trùng trong cùng cart.
- `orders`: lưu thông tin order, subtotal, currency, thời hạn và idempotency key.
- `order_item`: lưu từng course trong order cùng giá và currency tại thời điểm mua.
- Bỏ đi các bảng liên quan đến luồng thanh toán: `cart`, `cart_item`, `orders`, `order_item` trong database vì bây giờ sẽ không thực hiện luồng lưu trữ vào giỏ hàng cũng như thanh toán theo order. Chúng ta chỉ việc bấm để ddawg ký vào 1 khóa học, lúc đó sẽ tự động route người dung đến nơi thanh toán cho khóa học. 

#### Student 
- `course_favorite`: lưu course yêu thích của student.
- `course_review`: lưu rating và nội dung review course của student đã enrollment.
- `student_daily_activity`: lưu hoạt động hằng ngày, thời gian học, số problem đã giải và dữ liệu contribution dashboard.

#### Chiết khấu cho giáo viên và admin 
- `wallet`: lưu số dư khả dụng, số dư chờ xử lý và currency của teacher.
- `wallet_ledger`: lưu immutable ledger cho doanh thu, reserve, release và refund.
- `payout_request`: lưu yêu cầu rút tiền, trạng thái xử lý, reviewer và settlement reference.

### Thảo luận các câu hỏi 


1. Currency chính thức là gì? Cần chốt đơn vị lưu trữ, format hiển thị, rounding và minimum payout.
- Dollar 
- FE chỉnh sửa tiền khóa học thành dạng Dollar. 
- Làm tròn 2 chữ số thập phân 
- Số tiền tối thiểu trên là 0$ 

2. Student được viết một hay nhiều review cho một course?
- Một student được review khóa học duy nhất một lần 

3. Thảo luận lại các thông tin cần thiết cho teacher_profile và teacher_application khi tiến hành đăng ký làm giáo viên? Có cần application/review history riêng không?
- Bên FE nghiên cứu lại trang teacher_profile và teacher_register_form. 
- Student sẽ thực hiện đăng ký để lên làm teacher. student_profile (sẽ có 1 số data field). Student sẽ được nâng lên làm teacher => Thảo luận xem là những field mới đó là những field gì để tạo ra được sự đồng bộ giữa teacher_register_form và teacher_profile. Tạo được sự đồng bộ giữa teacher_profile, student_profile, teacher_register_form. 
- Cụ thể các thông tin cần thiết được thảo luận như sau: 
```md 
# student_profile

| Field |
|---|
| user_id |
| full_name |
| avatar_url |
| bio |
| learning_preferences |
| social_links |

---

# teacher_registered

| Field |
|---|
| teacher_profile_id (FK + UNIQUE -> teacher_profile.user_id) |
| bio |
| education_evidence_urls |
| legal_full_name |
| date_of_birth |
| identity_number |
| identity_front_url |
| identity_back_url |
| selfie_with_id_url |
| cv_url |
| motivation |
| status |
| review_note |
| submitted_at |
| reviewed_at |

---

# teacher_profile

| Field |
|---|
| user_id |
| avatar_url |
| display_name |
| headline |
| bio |
| expertise_tags |
| years_of_experience |
| education_entries |
| experience_entries |
| github_url |
| linkedin_url |
| website_url |
| email |
| phone |
| approved_at |
| is_active |
```

`teacher_profile` và `teacher_registered` có quan hệ 1-1: mỗi profile chỉ có một application hiện hành. Lịch sử submit, review và resubmit được lưu riêng trong `teacher_register_history`.

4. CÓ cần tách riêng ra thêm một bảng `quiz_attempt` để lưu chi tiết từng lần làm bài cho bảng `quiz_submission` không? Có cho phép học sinh `save/resume` bài quiz không? 
- Lưu trữ lịch sử của nhiều lần làm bài => Tách thêm 1 bảng quiz_attempt 
- Bắt làm lại từ đầu, không thực hiện lưu snapshot. 
5. Problem completion trong lesson chỉ cần Accepted hay có pass score riêng theo lesson content?
- Teacher có thể đặt passing_score để cho học sinh có thể chọn và qua môn. 

6. AI interview sẽ feedback từng câu hay feedback toàn bộ một lần? 
- FE chỉnh sửa lại giao diện micro và camera, không làm dạng AI chatbot (Quan trọng)
- Tổng hợp báo cáo chung chứ không thực hiện lưu ra và tiến hành feedback cho từng câu một. 
