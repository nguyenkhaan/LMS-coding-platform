# TC03 View Student

- **Tên màn hình:** TC03 View Student
- **Đường dẫn:** `/teacher/students/:studentId`
- **Asset:** [teacher/TC03ViewStudent.svg](../../screen/teacher/TC03ViewStudent.svg)
- **Trạng thái verify:** Wireframe suy luận từ tên file và nhóm chức năng; cần đối chiếu screenshot Figma khi MCP có quota.

## Wireframe

~~~text
[Teacher sidebar] | [Top bar: breadcrumb, search, avatar]
                   | [Page title + primary action]
                   | [summary cards / filters]
                   | [main table, builder or progress content]
                   | [pagination / save actions]
~~~

## Components and behavior

- Header/navigation và action chính dùng token trong [theme.md](../theme.md).
- Các panel, card, input và table giữ đúng thứ tự từ trái sang phải, trên xuống dưới như sơ đồ; trên mobile chuyển thành một cột khi có nhiều cột.
- Trạng thái tải rỗng, lỗi hoặc pending hiển thị trong đúng vùng nội dung, không thay đổi shell của màn hình.

