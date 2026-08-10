# AUTH04 Set Password

- **Tên màn hình:** AUTH04 Set Password
- **Đường dẫn:** `/auth/set-password`
- **Asset:** [auth/AUTH04SetPassword.svg](../../screen/auth/AUTH04SetPassword.svg)
- **Trạng thái verify:** Wireframe suy luận từ tên file và nhóm chức năng; cần đối chiếu screenshot Figma khi MCP có quota.

## Wireframe

~~~text
DESKTOP 1600x1000
+--------------------------------------+--------------------------------------+
| BRAND PANEL 800px                    | RESET PASSWORD 800px                |
| [SkillBoost logo]                    | Set a new password                   |
| [illustration / gradient]             | Choose a strong password.            |
|                                      | New password             [show]      |
|                                      | [_______________________________]    |
|                                      | Confirm password          [show]      |
|                                      | [_______________________________]    |
|                                      | Password rules / strength meter       |
|                                      | [          Save password       ]     |
+--------------------------------------+--------------------------------------+

MOBILE 390x844
+--------------------------------------+
| [SkillBoost logo]                    |
| Set a new password                   |
| New password             [show]      |
| [_______________________________]    |
| Confirm password          [show]      |
| [_______________________________]    |
| [weak ---- medium ---- strong]       |
| [          Save password       ]     |
+--------------------------------------+
~~~

## Components and behavior

- Save chỉ enabled khi hai password khớp và đạt rule tối thiểu.
- Sau success quay về login; token reset hết hạn hiển thị form-level error.

## States

- Default: hai password field và helper rule.
- Error: mismatch, quá yếu hoặc token không hợp lệ.
- Success: password saved, chuyển về `/auth/login`.
