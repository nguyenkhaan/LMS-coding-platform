# COURSE03 Course Empty State

- **Tên màn hình:** COURSE03 Course Empty State
- **Đường dẫn:** `/courses/empty`
- **Asset:** [course/Course03EmptyState.svg](../../screen/course/Course03EmptyState.svg)
- **Trạng thái verify:** Wireframe suy luận từ tên file và nhóm chức năng; cần đối chiếu screenshot Figma khi MCP có quota.

## Wireframe

~~~text
[Global header]
[Course hero: title, instructor, rating, progress/enroll CTA]
[Tabs: Overview | Comments | Progress | Instructor]
[Main lesson/content column] | [Course curriculum/sidebar]
[reviews, comments or empty state according to tab]
~~~

## Components and behavior

- Header/navigation và action chính dùng token trong [theme.md](../theme.md).
- Các panel, card, input và table giữ đúng thứ tự từ trái sang phải, trên xuống dưới như sơ đồ; trên mobile chuyển thành một cột khi có nhiều cột.
- Trạng thái tải rỗng, lỗi hoặc pending hiển thị trong đúng vùng nội dung, không thay đổi shell của màn hình.

