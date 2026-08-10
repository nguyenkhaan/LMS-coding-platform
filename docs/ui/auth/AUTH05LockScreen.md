# AUTH05 Lock Screen

- **Tên màn hình:** AUTH05 Lock Screen
- **Đường dẫn:** `/auth/lock`
- **Asset:** [auth/AUTH05LockScreen.svg](../../screen/auth/AUTH05LockScreen.svg)
- **Trạng thái verify:** Wireframe suy luận từ tên file và nhóm chức năng; cần đối chiếu screenshot Figma khi MCP có quota.

## Wireframe

~~~text
DESKTOP 1600x1000
+--------------------------------------+--------------------------------------+
| BRAND PANEL 800px                    | LOCKED SESSION 800px                |
| [SkillBoost logo]                    | Session locked                       |
| [illustration / gradient]             | Unlock your session                  |
|                                      | [avatar 56x56] Rosalind Franklin      |
|                                      | ros...@example.com                   |
|                                      | Password                             |
|                                      | [_______________________________]    |
|                                      | [Locked]              [Forgot?]       |
|                                      | [       Unlock session       ]        |
|                                      | Use another account? [Sign in]       |
+--------------------------------------+--------------------------------------+

MOBILE 390x844
+--------------------------------------+
| [SkillBoost logo]                    |
| Session locked                       |
| [avatar] Rosalind Franklin            |
| ros...@example.com                   |
| Password                             |
| [_______________________________]    |
| [Locked] [Forgot password?]           |
| [       Unlock session       ]        |
| Use another account? [Sign in]       |
+--------------------------------------+
~~~

## Components and behavior

- Account summary is read-only; only password is editable.
- Unlock success returns to the previously locked page; failure keeps the locked shell and shows inline error.

## States

- Default: account identity, locked badge and password field.
- Error: wrong password.
- Success: session unlocked.
