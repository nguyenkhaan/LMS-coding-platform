# AUTH01 Login

- **Tên màn hình:** AUTH01 Login
- **Đường dẫn:** `/auth/login`
- **Asset:** [auth/AUTH01Login.svg](../../screen/auth/AUTH01Login.svg)
- **Trạng thái verify:** Wireframe suy luận từ tên file và nhóm chức năng; cần đối chiếu screenshot Figma khi MCP có quota.

## Wireframe

~~~text
DESKTOP 1600x1000
+--------------------------------------+--------------------------------------+
| BRAND PANEL 800px                    | AUTH FORM PANEL 800px               |
|                                      |                                      |
| [SkillBoost logo]                    | [Sign in]                            |
| Learn. Build. Get hired.             | Welcome back                         |
|                                      | Sign in to continue learning.        |
| [coding illustration / gradient]     |                                      |
|                                      | Email address                        |
|                                      | [you@example.com_________________]   |
|                                      | Password                 [show]      |
|                                      | [_______________________________]    |
|                                      | [Forgot password?]                  |
|                                      | [          Sign in          ]        |
|                                      |                                      |
|                                      | -------- or continue with --------   |
|                                      | [ Google ]       [ GitHub ]          |
|                                      | New to SkillBoost? [Create account] |
+--------------------------------------+--------------------------------------+

MOBILE 390x844
+--------------------------------------+
| [SkillBoost logo]                    |
| Sign in                              |
| Welcome back                         |
| Email address                        |
| [you@example.com_________________]   |
| Password                 [show]      |
| [_______________________________]    |
| [Forgot password?]                   |
| [          Sign in          ]        |
| -------- or continue with --------   |
| [ Continue with Google ]             |
| [ Continue with GitHub ]             |
| New user? [Create account]           |
+--------------------------------------+
~~~

## Components and behavior

- Form submit bị khóa khi email/password rỗng hoặc đang loading.
- Sai thông tin hiển thị error text ngay dưới field liên quan; không đẩy brand panel trên desktop.
- `Forgot password?` đi tới `/auth/forgot-password`; `Create account` đi tới `/auth/register`.

## Component map

| Vùng | Component | Nội dung | Hành vi |
| --- | --- | --- | --- |
| Brand | Brand panel | Logo, tagline, illustration | Ẩn trên mobile |
| Form | Email/password fields | Label, placeholder, show password | Validate inline |
| Action | Primary button | Sign in | Submit, loading |
| Secondary | OAuth buttons and links | Google, GitHub, register, forgot password | Navigate/authenticate |

## States

- Default: form rỗng hoặc có placeholder.
- Loading: button hiển thị loading, field/action không cho submit lại.
- Error: error message dưới field hoặc form-level auth error.
- Success: chuyển tới dashboard.
