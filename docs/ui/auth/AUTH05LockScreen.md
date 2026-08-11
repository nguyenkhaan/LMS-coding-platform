# AUTH05 Lock Screen

- **Tên màn hình:** Welcome Back / locked session
- **Đường dẫn:** `/auth/lock` (suy luận)
- **Asset:** [AUTH05LockScreen.svg](../../screen/auth/AUTH05LockScreen.svg)
- **Viewport nguồn:** `1600x1000`
- **Mức độ chắc chắn:** Layout đã đối chiếu từ render; asset dùng centered shell, không dùng split-screen.

## Wireframe

~~~text
DESKTOP 1600x1000
+---------------------------------------------------------------------------------+
| pale pink -> pale lavender full viewport                                        |
|                                                                                 |
|                         [Dreams LMS logo]                                       |
|                                                                                 |
|                              Welcome Back                                       |
|                         +----------------+                                      |
|                         | circular avatar|                                      |
|                         | Ronald Richard  |                                     |
|                         +----------------+                                      |
|                         Password *                              [eye]           |
|                         [________________________________________]              |
|                         [              Sign in ->                ]              |
|                                                                                 |
+---------------------------------------------------------------------------------+

~~~

~~~text
MOBILE 390x844
+------------------------------------------+
|                                          |
|             [Dreams LMS logo]            |
|                                          |
|             Welcome Back                 |
|             [avatar]                     |
|             Ronald Richard               |
| Password *                    [eye]      |
| [____________________________]           |
| [          Sign in ->          ]         |
|                                          |
+------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Shell | Centered auth canvas | Full 1600x1000 gradient background | No sidebar/brand split |
| Identity | Logo + avatar | Dreams LMS logo, avatar, `Ronald Richard` | Read-only account identity |
| Form | Password field | 409px source width, eye icon | Unlock validation |
| Action | Sign in | 410px coral pill | Restore session |

## States

- Default: known account identity and empty password.
- Error: wrong password displayed below field.
- Loading: button disabled while unlock request runs.
- Success: return to previously locked route.
