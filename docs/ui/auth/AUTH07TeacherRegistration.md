# AUTH07 Teacher Registration

- **Tên màn hình:** AUTH07 Teacher Registration
- **Đường dẫn:** `/auth/teacher-registration`
- **Asset:** [auth/AUTH07TeacherRegistration.svg](../../screen/auth/AUTH07TeacherRegistration.svg)
- **Trạng thái verify:** Wireframe suy luận từ tên file và nhóm chức năng; cần đối chiếu screenshot Figma khi MCP có quota.

## Wireframe

~~~text
DESKTOP 1600x1000
+--------------------------------------+--------------------------------------+
| BRAND PANEL 520px                    | INSTRUCTOR APPLICATION 1080px       |
| [SkillBoost logo]                    | Instructor onboarding                |
| Apply to teach on SkillBoost         | Teacher Registration                 |
| [illustration]                       | [Full name________] [Title________]  |
|                                      | Email [____________] Phone [________]|
|                                      | Short bio                            |
|                                      | [_________________________________]   |
|                                      | Category [Backend v] Years [5-8 v]   |
|                                      | Portfolio/GitHub/LinkedIn            |
|                                      | [https://_________________________]   |
|                                      | DOCUMENTS                            |
|                                      | [ID front upload] [ID back upload]   |
|                                      | [Selfie upload]   [Certificate opt.] |
|                                      | Bank [____________] Account [_______]|
|                                      | Account holder [__________________]  |
|                                      | [x] Accept instructor agreement       |
|                                      | [Back] [       Submit application ]   |
|                                      | Status: [Pending review]              |
+--------------------------------------+--------------------------------------+

MOBILE 390x844
+--------------------------------------+
| [SkillBoost logo]                    |
| Teacher Registration                 |
| Full name                            |
| [_______________________________]    |
| Professional title                  |
| [_______________________________]    |
| Email / Phone                        |
| [_______________________________]    |
| Short bio                            |
| [_______________________________]    |
| Category / Experience                |
| [__________] [__________]            |
| Documents                            |
| [ID front upload]                    |
| [ID back upload]                     |
| [Selfie upload]                      |
| [Certificate optional]               |
| Bank / Account / Holder fields       |
| [x] Accept agreement                 |
| [Back] [ Submit application ]         |
| Status: [Pending review]             |
+--------------------------------------+
~~~

## Components and behavior

- Desktop dùng grid hai cột cho các field ngắn và upload cards; mobile xếp tuần tự theo form order.
- Mỗi upload card có loại tài liệu, format `PNG/JPG`, giới hạn `5MB` và trạng thái upload.
- Submit tạo application pending; admin review là flow tiếp theo, không hiển thị approve trong form này.

## States

- Default: form chưa hoàn tất, status pending review chỉ hiển thị sau submit hoặc theo asset.
- Error: thiếu field bắt buộc, file sai format/kích thước hoặc account payout không hợp lệ.
- Uploading: từng document card có progress riêng.
- Success: application submitted, giữ lại application status.
