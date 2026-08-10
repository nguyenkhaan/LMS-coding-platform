# QUIZ02 Quiz Preview

- **Tên màn hình:** QUIZ02 Quiz Preview
- **Đường dẫn:** `/quizzes/:quizId`
- **Asset:** [quiz/QUIZ02QuizPreview.svg](../../screen/quiz/QUIZ02QuizPreview.svg)
- **Trạng thái verify:** Wireframe suy luận từ tên file và nhóm chức năng; cần đối chiếu screenshot Figma khi MCP có quota.

## Wireframe

~~~text
[Header: course/quiz title, timer, progress]
[Question number + question text]
[answer option cards / explanation area]
[Back] [question navigator] [Next / Submit]
~~~

## Components and behavior

- Header/navigation và action chính dùng token trong [theme.md](../theme.md).
- Các panel, card, input và table giữ đúng thứ tự từ trái sang phải, trên xuống dưới như sơ đồ; trên mobile chuyển thành một cột khi có nhiều cột.
- Trạng thái tải rỗng, lỗi hoặc pending hiển thị trong đúng vùng nội dung, không thay đổi shell của màn hình.

