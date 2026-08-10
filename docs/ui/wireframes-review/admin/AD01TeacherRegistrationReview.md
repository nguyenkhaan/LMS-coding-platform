# AD01 Teacher Registration Review

- **Tên màn hình:** AD01 Teacher Registration Review
- **Đường dẫn:** `/admin/teacher-applications`
- **Asset:** [admin/AD01TeacherRegistrationReview.svg](../../screen/admin/AD01TeacherRegistrationReview.svg)
- **Trạng thái verify:** Wireframe suy luận từ tên file và nhóm chức năng; cần đối chiếu screenshot Figma khi MCP có quota.

## Wireframe

~~~text
[Admin sidebar] | [Top bar]
                | [Review page title + status filters]
                | [Applicant profile/details]
                | [documents and verification fields]
                | [Approve] [Reject] [Request changes]
~~~

## Components and behavior

- Header/navigation và action chính dùng token trong [theme.md](../theme.md).
- Các panel, card, input và table giữ đúng thứ tự từ trái sang phải, trên xuống dưới như sơ đồ; trên mobile chuyển thành một cột khi có nhiều cột.
- Trạng thái tải rỗng, lỗi hoặc pending hiển thị trong đúng vùng nội dung, không thay đổi shell của màn hình.

