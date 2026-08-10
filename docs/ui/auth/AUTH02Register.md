# AUTH02 Register

- **Tên màn hình:** AUTH02 Register
- **Đường dẫn:** `/auth/register`
- **Asset:** [auth/AUTH02Register.svg](../../screen/auth/AUTH02Register.svg)
- **Trạng thái verify:** Wireframe suy luận từ tên file và nhóm chức năng; cần đối chiếu screenshot Figma khi MCP có quota.

## Wireframe

~~~text
DESKTOP 1600x1000
+--------------------------------------+--------------------------------------+
| BRAND PANEL 800px                    | CREATE ACCOUNT 800px                |
| [SkillBoost logo]                    | Create your SkillBoost account      |
| Start learning and coding.           | Set up access to courses and tools.  |
| [illustration / gradient]             | [First name_______] [Last name____] |
|                                      | Email address                        |
|                                      | [you@example.com_________________]   |
|                                      | [Password________] [Confirm________] |
|                                      | [x] Agree to Terms and Privacy       |
|                                      | [        Create account        ]     |
|                                      | -------- or continue with --------   |
|                                      | [ Google ]       [ GitHub ]          |
|                                      | Already have account? [Sign in]      |
+--------------------------------------+--------------------------------------+

MOBILE 390x844
+--------------------------------------+
| [SkillBoost logo]                    |
| Create your SkillBoost account       |
| First name                           |
| [Jane____________________________]    |
| Last name                            |
| [Doe_____________________________]   |
| Email address                        |
| [you@example.com_________________]   |
| Password                             |
| [_______________________________]    |
| Confirm password                     |
| [_______________________________]    |
| [x] Agree to Terms and Privacy       |
| [      Create account       ]        |
| [Google] [GitHub]                    |
| Already registered? [Sign in]        |
+--------------------------------------+
~~~

## Components and behavior

- Desktop dùng grid 2 cột cho name và password pair; mobile chuyển tất cả field thành một cột.
- Checkbox Terms bắt buộc trước khi submit; password pair phải khớp.
- `Sign in` đi tới `/auth/login`.

## Component map

| Vùng | Component | Nội dung | Hành vi |
| --- | --- | --- | --- |
| Form | Name/email/password fields | 5 field có label và placeholder | Inline validation |
| Consent | Checkbox | Terms and Privacy | Required |
| Action | Create account | Submit registration | Loading/error/success |
| Secondary | OAuth and sign-in link | Google, GitHub, Sign in | Alternate auth |

## States

- Default: field trống, CTA enabled theo validation cơ bản.
- Error: email đã tồn tại, password mismatch hoặc Terms chưa chọn.
- Loading: CTA disabled và hiển thị progress.
- Success: chuyển sang OTP verification.
