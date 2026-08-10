# INS03 Instructor Detail

- **Tên màn hình:** INS03 Instructor Detail
- **Đường dẫn:** `/instructors/:instructorId`
- **Asset:** [instructor/INS03InstructorDetail.png](../../screen/instructor/INS03InstructorDetail.png)
- **Trạng thái verify:** PNG dùng để đối chiếu raster export với SVG cùng tên; layout dưới đây là wireframe review chung cho cùng màn hình.

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

