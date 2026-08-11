# AUTH03 Forgot Password

- **Tên màn hình:** Forgot Password?
- **Đường dẫn:** `/auth/forgot-password` (suy luận)
- **Asset:** [AUTH03ForgotPassword.svg](../../screen/auth/AUTH03ForgotPassword.svg)
- **Viewport nguồn:** `1600x1000`
- **Mức độ chắc chắn:** Layout đã đối chiếu; asset trùng với `AUTH02Register.svg`.

## Wireframe

~~~text
DESKTOP 1600x1000
+======================================================================+
| BRAND 800px                     | FORM 800px                         |
| pale pink gradient              | white                              |
|                                 | [Dreams LMS]       Back to Home    |
|        (circle)                 |                                    |
|        [phone/person/lock]      | Forgot Password?                   |
|                                 | Enter your email to reset          |
|        Welcome to Dreams LMS    | your password.                     |
|        Courses.                 | Email *                            |
|        Platform...              | [________________________] [mail]  |
|        -- o o                    | [          Submit ->          ]   |
|                                 | Remember Password? [Sign in]       |
+======================================================================+

~~~

~~~text
MOBILE 390x844
+------------------------------------------+
| [Dreams LMS]              Back Home      |
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
| Brand | Illustration hero | 800px left panel, centered illustration and slogan | Hide on mobile |
| Header | Logo/back link | Right panel top row | Home/login navigation |
| Form | Email field | 409px source width, required, mail icon | Validate email |
| Action | Submit button | 410px coral pill | Start reset flow |
| Footer | Sign in link | Under form | Navigate `/auth/login` |

## States

- Default: one empty email input.
- Invalid email: error under input.
- Unknown email: generic recovery error; do not reveal account existence.
- Success: confirmation and next step to OTP/reset flow.

## Verification notes

- This asset is byte-identical to `AUTH02Register.svg`; `AUTH02` remains a naming/data-quality blocker.
