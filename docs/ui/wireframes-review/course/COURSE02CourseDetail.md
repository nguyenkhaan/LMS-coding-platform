# COURSE02 Course Detail

- **Tên màn hình:** COURSE02 Course Detail
- **Đường dẫn:** `/courses/:courseId`
- **Asset:** [course/COURSE02CourseDetail.svg](../../screen/course/COURSE02CourseDetail.svg)
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

