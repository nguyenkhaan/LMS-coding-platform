# OJ02 Online Judge Workspace

- **Tên màn hình:** OJ02 Online Judge Workspace
- **Đường dẫn:** `/online-judge/problems/:problemId`
- **Asset:** [online-judge/OJ02OnlineJudgeWorkspace.svg](../../screen/online-judge/OJ02OnlineJudgeWorkspace.svg)
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

