# PAY01 Shopping Cart

- **Tên màn hình:** Shopping Cart
- **Đường dẫn:** `VERIFY: /cart`
- **Asset:** [PAY01ShoppingCart.svg](../../screen/payment/PAY01ShoppingCart.svg)
- **Viewport nguồn:** `1920x2418`
- **Lưu ý:** SVG có embedded image làm XML parser lỗi; wireframe dựa trên geometry các panel đã đọc được và theme shell chung, cần đối chiếu lại khi asset được sửa.

## Wireframe

~~~text
DESKTOP 1920x2418
+=================================================================================================+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us     [search] [cart] [Sign in] |
+=================================================================================================+
|                                      SHOPPING CART                                              |
|                                   Home - Shopping Cart                                          |
+=================================================================================================+
| +----------------------------+  +----------------------------------------------------------+ |
| | CART SUMMARY               |  | Cart items                                               | |
| | Subtotal                   |  | [course thumbnail] Python Foundations                  | |
| | $147.00                    |  |              Ronald Richard   $49.00       [- 1 +]     | |
| |                            |  | [course thumbnail] React & TypeScript                  | |
| | [Continue shopping]        |  |              Jenny Wilson     $59.00       [- 1 +]     | |
| | [Proceed to checkout]      |  | [course thumbnail] Algorithms Interview Prep            | |
| +----------------------------+  |              Edythe Andrew    $39.00       [- 1 +]     | |
|                                +----------------------------------------------------------+ |
|                                | Coupon code [________________] [Apply]                    | |
|                                | Cart total                                    $147.00     | |
|                                | [Proceed to checkout]                                      | |
|                                +----------------------------------------------------------+ |
+=================================================================================================+
| Footer: Dreams LMS | For Instructor | For Student | Newsletter | Copyright                |
+=================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [hamburger] [Dreams LMS]      [cart]     |
+--------------------------------------------+
|             SHOPPING CART                |
|          Home - Shopping Cart             |
+--------------------------------------------+
| Cart items                                |
| +--------------------------------------+   |
| | [thumb] Python Foundations           |   |
| | Ronald Richard       $49.00 [- 1 +] |   |
| +--------------------------------------+   |
| | [thumb] React & TypeScript           |   |
| | Jenny Wilson         $59.00 [- 1 +] |   |
| +--------------------------------------+   |
| | [thumb] Algorithms Prep              |   |
| | Edythe Andrew        $39.00 [- 1 +] |   |
| +--------------------------------------+   |
| Coupon [________________] [Apply]        |
| Cart total                         $147  |
| [Proceed to checkout]                    |
| [Continue shopping]                      |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Cart list | Cart item | Thumbnail, course, instructor, price, quantity control | Update/remove item |
| Summary | Cart summary | Subtotal/total and checkout CTA | Recalculate on quantity change |
| Coupon | Coupon input | Code field and Apply | Validates discount |
| Navigation | Continue/checkout | Return catalog or proceed checkout | Route transition |

## States

- Empty cart: item list replaced by empty message and Browse courses.
- Coupon invalid: inline error below coupon field.
- Quantity update: disable checkout while total recalculates.
- `BLOCKED`: repair embedded image/XML before final visual comparison.
