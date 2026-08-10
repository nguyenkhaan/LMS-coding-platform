# AUTH02 Register

- **Tên màn hình theo filename:** Register
- **Tên màn hình theo asset render:** Forgot Password?
- **Đường dẫn:** `VERIFY route`
- **Asset:** [AUTH02Register.svg](../../screen/auth/AUTH02Register.svg)
- **Viewport nguồn:** `1600x1000`
- **Mức độ chắc chắn:** BLOCKED. SVG có SHA-256 giống hệt `AUTH03ForgotPassword.svg`; không được tự dựng Register từ tên file.

## Wireframe thực tế của asset

~~~text
DESKTOP 1600x1000
+======================================================================+
| LEFT BRAND 800px                | RIGHT RECOVERY FORM 800px          |
| pale pink gradient              | white                              |
|                                 | [Dreams LMS]       Back to Home    |
|        [phone/person/lock]      |                                    |
|                                 | Forgot Password?                   |
|       Welcome to Dreams LMS     | Enter your email to reset          |
|       Courses.                  | your password.                     |
|                                 | Email *                            |
|                                 | [________________________] [mail]  |
|                                 | [          Submit ->          ]    |
|                                 |                                    |
|                                 | Remember Password? [Sign in]       |
|                                 |                                    |
+======================================================================+

~~~

~~~text
MOBILE 390x844
+------------------------------------------+
| [Dreams LMS]              Back Home      |
|                                          |
| Forgot Password?                         |
| Enter your email to reset password.      |
| Email *                                  |
| [____________________________] [mail]    |
| [           Submit ->             ]      |
| Remember Password? [Sign in]             |
+------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Left | Shared auth brand | Same illustration/slogan as other split auth screens | Hidden on mobile |
| Right top | Logo + Back to Home | Fixed top row | Navigate home |
| Form | Email input | One required email field | Validate and submit reset request |
| Action | Submit | Coral full-width pill | Send reset email |
| Footer | Sign in link | `Remember Password? Sign in` | Navigate login |

## States

- Default: email field trống, Submit enabled theo validation cơ bản.
- Error: email sai format hoặc request reset thất bại.
- Loading: Submit disabled trong lúc gửi request.
- Success: hiển thị xác nhận đã gửi email và chuyển sang OTP/reset flow.

## Verification notes

- `AUTH02Register.svg` và `AUTH03ForgotPassword.svg` identical byte-for-byte theo SHA-256.
- Cần cung cấp asset Register đúng hoặc xác nhận đổi tên `AUTH02` thành Forgot Password trước khi sinh UI.
