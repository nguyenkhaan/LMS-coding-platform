# COURSE01 Course Catalog

- **Tên màn hình:** COURSE01 Course Catalog
- **Đường dẫn:** `/courses`
- **Asset:** [course/COURSE01CourseCatalog.png](../../screen/course/COURSE01CourseCatalog.png)
- **Trạng thái verify:** PNG dùng để đối chiếu raster export với SVG cùng tên; layout dưới đây là wireframe review chung cho cùng màn hình.

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

