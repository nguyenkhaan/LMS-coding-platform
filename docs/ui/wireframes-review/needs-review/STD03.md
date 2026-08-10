# STD03 Unidentified Student Screen

- **Tên màn hình:** STD03 Unidentified Student Screen
- **Đường dẫn:** `VERIFY route`
- **Asset:** [needs-review/STD03.svg](../../screen/needs-review/STD03.svg)
- **Trạng thái verify:** Cần verify: tên asset chỉ là STD03, chưa đủ thông tin xác định màn hình hoặc route.

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

