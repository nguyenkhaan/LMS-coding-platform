# STD03 Student Favorites

- **Tên màn hình:** STD03 Student Favorites
- **Đường dẫn:** `/dashboard/favorites`
- **Asset:** [student/STD03StudentFavorites.svg](../../screen/student/STD03StudentFavorites.svg)
- **Trạng thái verify:** Wireframe suy luận từ tên file và nhóm chức năng; cần đối chiếu screenshot Figma khi MCP có quota.

## Wireframe

~~~text
[Global header: logo, nav, search, notification, avatar]

[Greeting + page title + quick actions]
[progress/stat cards] [course/activity cards in responsive grid]

[secondary list or empty state]
~~~

## Components and behavior

- Header/navigation và action chính dùng token trong [theme.md](../theme.md).
- Các panel, card, input và table giữ đúng thứ tự từ trái sang phải, trên xuống dưới như sơ đồ; trên mobile chuyển thành một cột khi có nhiều cột.
- Trạng thái tải rỗng, lỗi hoặc pending hiển thị trong đúng vùng nội dung, không thay đổi shell của màn hình.

