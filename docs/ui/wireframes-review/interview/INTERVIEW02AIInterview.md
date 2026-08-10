# INTERVIEW02 AI Interview

- **Tên màn hình:** INTERVIEW02 AI Interview
- **Đường dẫn:** `/interviews/new`
- **Asset:** [interview/INTERVIEW02AIInterview.svg](../../screen/interview/INTERVIEW02AIInterview.svg)
- **Trạng thái verify:** Wireframe suy luận từ tên file và nhóm chức năng; cần đối chiếu screenshot Figma khi MCP có quota.

## Wireframe

~~~text
[Header: interview topic, level, session status]
[Conversation transcript / report content]
[AI prompt or score summary panel]
[answer input or strengths/weaknesses/suggestions]
[primary next action]
~~~

## Components and behavior

- Header/navigation và action chính dùng token trong [theme.md](../theme.md).
- Các panel, card, input và table giữ đúng thứ tự từ trái sang phải, trên xuống dưới như sơ đồ; trên mobile chuyển thành một cột khi có nhiều cột.
- Trạng thái tải rỗng, lỗi hoặc pending hiển thị trong đúng vùng nội dung, không thay đổi shell của màn hình.

