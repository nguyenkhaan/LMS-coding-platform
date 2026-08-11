# AUTH01 Login

- **Tên màn hình:** Sign into Your Account
- **Đường dẫn:** `/auth/login` (suy luận từ tên asset)
- **Asset:** [AUTH01Login.svg](../../screen/auth/AUTH01Login.svg)
- **Viewport nguồn:** `1600x1000`
- **Mức độ chắc chắn:** Layout và component đã đối chiếu từ SVG render; route cần xác nhận với app contract.

## Wireframe

~~~text
DESKTOP 1600x1000
+======================================================================+
| LEFT AUTH BRAND 800px           | RIGHT AUTH FORM 800px              |
| background: pale pink gradient  | background: white                  |
|                                 |                                    |
|              (large circle)     |                    [Dreams LMS]    |
|          +----------------+     |                    Back to Home    |
|          | [phone]        |     |                                    |
|          | [person] [lock]|     |             Sign into Your         |
|          | [form screen]  |     |             Account                |
|          +----------------+     |                                    |
|                                 | Email *                            |
|                                 | [________________________] [mail]  |
|                                 |                                    |
|                                 | Password *              [eye]      |
|                                 | [________________________]         |
|                                 |                                    |
|                                 | [x] Remember Me       Forgot       |
|                                 |                         Password?  |
|                                 |                                    |
|                                 | [           Login ->           ]   |
|                                 |                                    |
|                 Welcome to     |                ---- OR ----         |
|                 Dreams LMS     | [ Google ]       [ Facebook ]       |
|                 Courses.       |                                     |
|                 Platform...    | Don't have an account? [Sign up]    |
|                 -- o o         |                                     |
+======================================================================+

~~~

~~~text
MOBILE 390x844
+------------------------------------------+
| [Dreams LMS]                             |
|                         Back to Home     |
|                                          |
| Sign into Your Account                   |
| Email *                                  |
| [____________________________] [mail]    |
| Password *                    [eye]      |
| [____________________________]           |
| [x] Remember Me       Forgot Password?   |
| [             Login ->              ]    |
|                 ---- OR ----             |
| [ Google ]             [ Facebook ]      |
| Don't have an account? [Sign up]         |
+------------------------------------------+
| Brand illustration hidden; form          |
| keeps the same vertical order.           |
+------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Left `0..800` | Brand hero | Gradient, circular backdrop, phone/person/lock illustration, slogan, 3-dot pager | Ẩn hoặc chuyển xuống dưới form trên mobile |
| Right top | Logo + home link | Dreams LMS logo, `Back to Home` | Navigate home |
| Form | Email input | Required label, email icon at right | Email format validation |
| Form | Password input | Required label, eye icon at right | Toggle masked/plain text |
| Options | Checkbox + forgot link | Checked `Remember Me`, `Forgot Password?` | Persist session / navigate reset |
| Actions | Login button | Coral full-width pill, arrow | Submit; loading disables repeat |
| Social | Google/Facebook buttons | Two equal gray pills | OAuth entry |
| Footer copy | Sign-up prompt | `Don't have an account? Sign up` | Navigate register |

## States

- Default: white inputs with subtle gray border, coral primary button.
- Focus: active input border/focus ring; icon remains inside the 409px form field.
- Error: inline error under the affected field; form width unchanged.
- Loading: Login/OAuth action disabled.
- Success: navigate to authenticated destination.
