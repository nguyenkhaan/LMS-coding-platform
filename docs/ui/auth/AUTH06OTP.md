# AUTH06 OTP Verification

- **Tên màn hình:** AUTH06 OTP Verification
- **Đường dẫn:** `/auth/otp`
- **Asset:** [auth/AUTH06OTP.png](../../screen/auth/AUTH06OTP.png)
- **Trạng thái verify:** PNG dùng để đối chiếu raster export với SVG cùng tên; layout dưới đây là wireframe review chung cho cùng màn hình.

## Wireframe

~~~text
DESKTOP 1600x1000
+--------------------------------------+--------------------------------------+
| BRAND PANEL 800px                    | VERIFICATION 800px                  |
| [SkillBoost logo]                    | Verify your email                    |
| [illustration / gradient]             | Enter the 6-digit code we sent.      |
|                                      | [0] [0] [0] [0] [0] [0]              |
|                                      | Code expires in 09:59                |
|                                      | [Resend code]                        |
|                                      | [      Verify and continue      ]    |
+--------------------------------------+--------------------------------------+

MOBILE 390x844
+--------------------------------------+
| [SkillBoost logo]                    |
| Verify your email                    |
| Enter the 6-digit code.              |
| [0] [0] [0] [0] [0] [0]              |
| Code expires in 09:59                |
| [Resend code]                        |
| [      Verify and continue      ]    |
+--------------------------------------+
~~~

## Components and behavior

- Sáu ô OTP được focus tuần tự; paste đủ 6 ký tự phải phân bổ vào cả sáu ô.
- Resend bị cooldown; verify disabled nếu chưa đủ 6 ký tự.

## States

- Default: six empty OTP cells and countdown.
- Error: invalid/expired code, giữ nguyên input để người dùng sửa.
- Success: chuyển sang set password hoặc dashboard tùy flow.
