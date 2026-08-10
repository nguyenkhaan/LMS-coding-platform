# PAY02 Checkout

- **Tên màn hình:** Checkout
- **Đường dẫn:** `VERIFY: /checkout`
- **Asset:** [PAY02Checkout.svg](../../screen/payment/PAY02Checkout.svg)
- **Viewport nguồn:** `1600x1915`

## Wireframe

~~~text
DESKTOP 1600x1915
+==================================================================================================+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us                 [secure]      |
+==================================================================================================+
|                                      CHECKOUT                                                    |
|                                   Home - Checkout                                                |
+==================================================================================================+
| +------------------------------------------------------+  +-------------------------------+ |
| | Billing information                                   |  | Order summary                | |
| | Full name [________________________]                  |  | [thumb] Python Foundations   | |
| | Email [____________________________]                  |  | $49.00                      | |
| | Phone [____________________________]                  |  | [thumb] React & TypeScript  | |
| | Address [__________________________]                  |  | $59.00                      | |
| +------------------------------------------------------+  | Subtotal              $108.00| |
| | Payment method                                       |  | Discount                -$0  | |
| | ( ) Credit/Debit card                                |  | Total                 $108.00| |
| | ( ) PayPal                                            |  | [Pay securely]               | |
| | ( ) Bank transfer                                     |  +-------------------------------+ |
| | Card number [________________________]               |                                |
| | [QR/payment panel]                                   |                                |
| +------------------------------------------------------+                                |
+==================================================================================================+
| Footer: Dreams LMS | For Instructor | For Student | Newsletter | Copyright                |
+==================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [Dreams LMS]                    [secure] |
+--------------------------------------------+
|                CHECKOUT                  |
|              Home - Checkout              |
+--------------------------------------------+
| Billing information                      |
| Full name [____________________]         |
| Email [________________________]         |
| Phone [________________________]         |
| Address [______________________]         |
| Payment method                           |
| ( ) Credit/Debit card                    |
| ( ) PayPal                               |
| Card number [__________________]         |
| +--------------------------------------+   |
| | ORDER SUMMARY                        |   |
| | Python Foundations          $49.00   |   |
| | React & TypeScript           $59.00  |   |
| | Total                       $108.00  |   |
| | [Pay securely]                      |   |
| +--------------------------------------+   |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Billing | Customer form | Name, email, phone, address | Required validation |
| Payment | Payment selector | Card, PayPal, bank transfer, card/QR fields | Switches payment fields |
| Summary | Order summary | Items, subtotal, discount, total | Updates with payment/cart |
| Action | Pay securely | Primary payment action | Opens gateway/confirmation |

## States

- Invalid billing field: inline error without losing entered values.
- Payment processing: disable payment controls and show progress.
- Payment success: confirmation and enrolled-course link.
- Payment failure: preserve form and show retry/change method.
