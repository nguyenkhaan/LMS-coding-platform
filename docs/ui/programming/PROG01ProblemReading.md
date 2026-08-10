# PROG01 Problem Reading

- **Tên màn hình:** PROG01 Problem Reading
- **Đường dẫn:** `/practice/problems/:problemId`
- **Asset:** [programming/PROG01ProblemReading.svg](../../screen/programming/PROG01ProblemReading.svg)
- **Trạng thái verify:** Wireframe suy luận từ tên file và nhóm chức năng; cần đối chiếu screenshot Figma khi MCP có quota.

## Wireframe

~~~text
[Global header]
[Problem title + difficulty/status + action]
[Left: statement, constraints, examples, hints]
[Right: preview/video/editor panel]
[Bottom: related problems or navigation]
~~~

## Components and behavior

- Header/navigation và action chính dùng token trong [theme.md](../theme.md).
- Các panel, card, input và table giữ đúng thứ tự từ trái sang phải, trên xuống dưới như sơ đồ; trên mobile chuyển thành một cột khi có nhiều cột.
- Trạng thái tải rỗng, lỗi hoặc pending hiển thị trong đúng vùng nội dung, không thay đổi shell của màn hình.

