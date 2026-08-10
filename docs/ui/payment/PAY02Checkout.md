# PAY02 Checkout

- **Tên màn hình:** PAY02 Checkout
- **Đường dẫn:** `/checkout`
- **Asset:** [payment/PAY02Checkout.svg](../../screen/payment/PAY02Checkout.svg)
- **Trạng thái verify:** Wireframe suy luận từ tên file và nhóm chức năng; cần đối chiếu screenshot Figma khi MCP có quota.

## Wireframe

~~~text
[Header]
[Checkout step indicator: Cart > Details > Payment]
[Line-item/cart list] | [Order summary, discount, total]
[quantity/remove controls] | [primary checkout action]
~~~

## Components and behavior

- Header/navigation và action chính dùng token trong [theme.md](../theme.md).
- Các panel, card, input và table giữ đúng thứ tự từ trái sang phải, trên xuống dưới như sơ đồ; trên mobile chuyển thành một cột khi có nhiều cột.
- Trạng thái tải rỗng, lỗi hoặc pending hiển thị trong đúng vùng nội dung, không thay đổi shell của màn hình.

