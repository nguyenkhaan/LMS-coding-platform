# AUTH03 Forgot Password

- **Tên màn hình:** AUTH03 Forgot Password
- **Đường dẫn:** `/auth/forgot-password`
- **Asset:** [auth/AUTH03ForgotPassword.svg](../../screen/auth/AUTH03ForgotPassword.svg)
- **Trạng thái verify:** Wireframe suy luận từ tên file và nhóm chức năng; cần đối chiếu screenshot Figma khi MCP có quota.

## Wireframe

~~~text
DESKTOP 1600x1000
+--------------------------------------+--------------------------------------+
| BRAND PANEL 800px                    | RECOVERY FORM 800px                 |
| [SkillBoost logo]                    | Forgot your password?               |
| [illustration / gradient]             | Enter email to receive reset code.   |
|                                      | Email address                        |
|                                      | [you@example.com_________________]   |
|                                      | [       Send reset link       ]      |
|                                      | Remembered your password?            |
|                                      | [Back to sign in]                    |
+--------------------------------------+--------------------------------------+

MOBILE 390x844
+--------------------------------------+
| [SkillBoost logo]                    |
| Forgot your password?                |
| Email address                        |
| [you@example.com_________________]   |
| [       Send reset link       ]      |
| Remembered? [Back to sign in]        |
+--------------------------------------+
~~~

## Components and behavior

- Email required; success gửi người dùng tới `/auth/otp` hoặc flow reset tương ứng.
- Không hiển thị mật khẩu mới trên màn hình này.

## States

- Default: email input and reset CTA.
- Error: email không tồn tại hoặc format không hợp lệ.
- Success: thông báo đã gửi email, CTA resend có cooldown.
