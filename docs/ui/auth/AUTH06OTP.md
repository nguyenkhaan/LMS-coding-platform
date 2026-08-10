# AUTH06 OTP Verification

- **Tên màn hình:** Email OTP
- **Đường dẫn:** `/auth/otp` (suy luận)
- **Asset:** [AUTH06OTP.png](../../screen/auth/AUTH06OTP.png)
- **Viewport nguồn:** `3200x2000` (render tỷ lệ 1600x1000)
- **Mức độ chắc chắn:** Layout đã đối chiếu trực tiếp PNG.

## Wireframe

~~~text
DESKTOP 1600x1000
+======================================================================+
| BRAND 800px                     | OTP FORM 800px                     |
| pale pink gradient              | white                              |
|                                 | [Dreams LMS]       Back to Home    |
|        [phone/person/lock]      |                                    |
|                                 | Email OTP                          |
|        Welcome to Dreams LMS    | OTP sent to your Email address     |
|        Courses.                 | ending ******doe@example.com.      |
|        -- o o                    |                                   |
|                                 | [ 8 ] [   ] [   ] [   ]            |
|                                 |           [ 09:59 ]                |
|                                 | [       Verify & Proceed ->    ]   |
|                                 | Didn't get OTP? [Resend OTP]       |
+======================================================================+

~~~

~~~text
MOBILE 390x844
+------------------------------------------+
| [Dreams LMS]              Back Home      |
| Email OTP                                |
| OTP sent to your email ending ...        |
| [ 8 ] [   ] [   ] [   ]                  |
|             [ 09:59 ]                    |
| [       Verify & Proceed ->      ]       |
| Didn't get OTP? [Resend OTP]             |
+------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Brand | Shared illustration panel | Same auth artwork and slogan | Hidden on mobile |
| Header | Logo + back link | Right panel top | Navigate home |
| Verification | Four OTP cells | First cell contains `8` in source; 4-cell layout | Auto-focus next cell, paste support |
| Timer | Countdown pill | `09:59` under cells | Disable resend until cooldown |
| Action | Verify & Proceed | Coral full-width pill | Verify 4-digit code |
| Secondary | Resend OTP | Inline coral link | Restart timer and send code |

## States

- Default: first cell active, remaining cells empty.
- Partial: code cells filled left to right.
- Error: invalid/expired OTP under cells.
- Resend cooldown: timer visible and resend disabled.
- Success: continue to password reset or registration completion.
