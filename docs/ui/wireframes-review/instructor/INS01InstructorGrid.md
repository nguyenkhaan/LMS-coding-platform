# INS01 Instructor Grid

- **Tên màn hình:** INS01 Instructor Grid
- **Đường dẫn:** `/instructors`
- **Asset:** [instructor/INS01InstructorGrid.svg](../../screen/instructor/INS01InstructorGrid.svg)
- **Trạng thái verify:** Wireframe suy luận từ tên file và nhóm chức năng; cần đối chiếu screenshot Figma khi MCP có quota.

## Wireframe

~~~text
[Global header + search/filter]
[Page title + view toggle]
[instructor card grid or data list]
[avatar, name, expertise, rating, course count, CTA]
[pagination / load more]
~~~

## Components and behavior

- Header/navigation và action chính dùng token trong [theme.md](../theme.md).
- Các panel, card, input và table giữ đúng thứ tự từ trái sang phải, trên xuống dưới như sơ đồ; trên mobile chuyển thành một cột khi có nhiều cột.
- Trạng thái tải rỗng, lỗi hoặc pending hiển thị trong đúng vùng nội dung, không thay đổi shell của màn hình.

