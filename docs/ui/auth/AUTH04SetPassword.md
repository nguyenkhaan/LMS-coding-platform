# AUTH04 Set Password

- **Tên màn hình:** Set Password
- **Đường dẫn:** `/auth/set-password` (suy luận)
- **Asset:** [AUTH04SetPassword.svg](../../screen/auth/AUTH04SetPassword.svg)
- **Viewport nguồn:** `1600x1000`
- **Mức độ chắc chắn:** Layout đã đối chiếu từ render và SVG coordinates.

## Wireframe

~~~text
DESKTOP 1600x1000
+======================================================================+
| BRAND 800px                     | PASSWORD FORM 800px                |
| pale pink gradient              | white                              |
| [phone/person/lock]             | [Dreams LMS]       Back to Home    |
| Welcome to Dreams LMS Courses.  | Set Password                       |
| tagline + 3-dot pager           | Your new password must be          |
|                                 | different from previous.           |
|                                 | Password *              [eye]      |
|                                 | [________________________]         |
|                                 | [====][====][====][====]           |
|                                 | Confirm Password *      [eye]      |
|                                 | [________________________]         |
|                                 | [       Reset Password ->     ]    |
+======================================================================+

~~~

~~~text
MOBILE 390x844
+------------------------------------------+
| [Dreams LMS]              Back Home      |
| Set Password                             |
| Your new password must be different.     |
| Password *                    [eye]      |
| [____________________________]           |
| [====][====][====][====]                 |
| Confirm Password *            [eye]      |
| [____________________________]           |
| [       Reset Password ->       ]        |
+------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Form | Password field | Required, eye toggle | Mask/unmask |
| Form | Strength meter | Four 96.5px segments in source | Update from password rules |
| Form | Confirm field | Required, eye toggle | Match validation |
| Action | Reset Password | Coral pill | Submit only when valid |

## States

- Default: both fields empty, strength segments neutral.
- Weak/medium/strong: meter segments update left to right.
- Error: mismatch, invalid reset token or password rule failure.
- Success: navigate to login.
