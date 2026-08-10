# OJ03 Submission History

- **Tên màn hình:** OJ03 Submission History
- **Đường dẫn:** `/online-judge/submissions`
- **Asset:** [online-judge/OJ03SubmissionHistory.svg](../../screen/online-judge/OJ03SubmissionHistory.svg)
- **Trạng thái verify:** Wireframe suy luận từ tên file và nhóm chức năng; cần đối chiếu screenshot Figma khi MCP có quota.

## Wireframe

~~~text
[Dark coding toolbar: problem title, language, run, submit]
[Problem statement / constraints] | [code editor with line numbers]
[examples and hints]             | [console/output + test result]
                                  | [submission status/actions]
~~~

## Components and behavior

- Header/navigation và action chính dùng token trong [theme.md](../theme.md).
- Các panel, card, input và table giữ đúng thứ tự từ trái sang phải, trên xuống dưới như sơ đồ; trên mobile chuyển thành một cột khi có nhiều cột.
- Trạng thái tải rỗng, lỗi hoặc pending hiển thị trong đúng vùng nội dung, không thay đổi shell của màn hình.

