# AUTH07 Teacher Registration

- **Tên màn hình:** Teacher Registration
- **Đường dẫn:** `/auth/teacher-registration` (suy luận)
- **Asset:** [AUTH07TeacherRegistration.svg](../../screen/auth/AUTH07TeacherRegistration.svg)
- **Viewport nguồn:** `1939x4281`
- **Mức độ chắc chắn:** Layout đã đối chiếu SVG render; nội dung field đọc được từ hình.

## Wireframe

~~~text
DESKTOP 1939x4281
+---------------------------------------------------------------------------------------+
| UTILITY BAR 40px: address/phone                         language currency icons       |
+---------------------------------------------------------------------------------------+
| NAV 65px: [Dreams LMS] Home v  Courses v  Instructors v  Classroom v  Blog v          |
| Contact us v                                      [search] [cart] [Sign in] [Register]|
+---------------------------------------------------------------------------------------+
| HERO 160px: pale blue gradient                                                        |
|                             Teacher Registration                                      |
|                     Classroom > Teacher Registration                                  |
+---------------------------------------------------------------------------------------+
| MAIN 1296px centered                                                                  |
| [search courses/problems____________________________________] [user/avatar]           |
|                                                                                       |
| +------------------------------------------------------------------------+            |
| | STEPPER: (1) Profile ---- (2) Expertise ---- (3) Identity ---- (4) Payout           |
| | green completed             green/active       indigo active       gray             |
| +------------------------------------------------------------------------+            |
|                                                                                       |
| +------------------------------------------------------------------------+            |
| | PERSONAL INFORMATION                                                     |          |
| | Full name * [As printed on your ID________________]  Professional title *|          |
| | [e.g. Senior Backend Engineer____________________]                      |           |
| | Email * [you@example.com________________________]  Phone * [+84 ...___] |           |
| | Short bio *                                                               |         |
| | [Tell students about your experience and teaching style.______________] |           |
| | [_______________________________________________________________]       |           |
| +------------------------------------------------------------------------+            |
|                                                                                       |
| +------------------------------------------------------------------------+            |
| | TEACHING EXPERTISE                                                       |          |
| | Primary category * [Backend________________ v] Years [5-8 years______ v]|           |
| | Portfolio / GitHub / LinkedIn *                                          |          |
| | [https://___________________________________________________________]   |           |
| +------------------------------------------------------------------------+            |
|                                                                                       |
| +------------------------------------------------------------------------+            |
| | IDENTIFICATION                                                           |          |
| | Required before your first course goes live.                             |          |
| | +-----------------------+ +-----------------------+                     |           |
| | | [upload]              | | [upload]              |                     |           |
| | | National ID front     | | National ID back      |                     |           |
| | | PNG/JPG, max 5MB      | | PNG/JPG, max 5MB      |                     |           |
| | +-----------------------+ +-----------------------+                     |           |
| | +-----------------------+ +-----------------------+                     |           |
| | | [upload]              | | [upload]              |                     |           |
| | | Selfie holding ID     | | Teaching certificate  |                     |           |
| | | PNG/JPG, max 5MB      | | PNG/JPG, max 5MB opt. |                     |           |
| | +-----------------------+ +-----------------------+                     |           |
| +------------------------------------------------------------------------+            |
|                                                                                       |
| +------------------------------------------------------------------------+            |
| | PAYOUT DETAILS                                                           |          |
| | Bank * [e.g. Vietcombank________________] Account number * [000 000___] |           |
| | Account holder name * [Must match your ID_____________________________] |           |
| +------------------------------------------------------------------------+            |
|                                                                                       |
| +------------------------------------------------------------------------+            |
| | ( ) I confirm information is accurate and accept instructor agreement. |            |
| | [Back]                                      [Submit application]          |         |
| +------------------------------------------------------------------------+            |
+---------------------------------------------------------------------------------------+
| FOOTER: logo/about | For Instructor links | For Student links | Newsletter            |
| APP STORE / GOOGLE PLAY | contact info                                                |
+---------------------------------------------------------------------------------------+
| DARK FOOTER BAR: copyright                                      Terms | Privacy       |
+---------------------------------------------------------------------------------------+

~~~

~~~text
MOBILE 390x844 (vertical reflow)
+------------------------------------------+
| UTILITY: [language] [currency]           |
| NAV: [Dreams LMS] [menu]                 |
| HERO: Teacher Registration               |
| Breadcrumb: Classroom > Registration     |
| [search________________________]         |
| STEPPER: (1) Profile > (2) Expertise     |
|          > (3) Identity > (4) Payout     |
|                                          |
| PERSONAL INFORMATION                     |
| Full name [_______________________]      |
| Professional title [_______________]     |
| Email [___________________________]      |
| Phone [___________________________]      |
| Short bio                                |
| [_________________________________]      |
| TEACHING EXPERTISE                       |
| Category [_______________________ v]     |
| Years [__________________________ v]     |
| Portfolio [______________________]       |
| IDENTIFICATION                           |
| [ID front upload_________________]       |
| [ID back upload__________________]       |
| [Selfie upload___________________]       |
| [Certificate optional____________]       |
| PAYOUT DETAILS                           |
| Bank [___________________________]       |
| Account number [_________________]       |
| Account holder [__________________]      |
| ( ) Accept instructor agreement          |
| [Back] [Submit application]              |
| Footer columns stack vertically          |
+------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Shell | Utility/nav/hero/footer | Utility 40px, nav 65px, hero 160px, centered 1296px content | Responsive collapse on mobile |
| Progress | Four-step stepper | Profile, Expertise, Identity, Payout; green/indigo/gray states | Reflect current registration step |
| Form card 1 | Personal information | 2-column short fields, full-width bio | Required validation |
| Form card 2 | Teaching expertise | Category select, years select, portfolio URL | Select and URL validation |
| Form card 3 | Identification uploads | 2x2 upload cards, PNG/JPG max 5MB | Per-file upload/progress/error |
| Form card 4 | Payout details | Bank, account number, account holder | Required; holder must match identity |
| Submit card | Agreement + actions | Agreement checkbox, Back, Submit application | Submit only after valid form |

## States

- Default: stepper at Profile/initial form state; empty fields show placeholders.
- Uploading: each identification card shows its own progress/error, not one global state.
- Validation error: field-level error under input; invalid file stays attached to its card.
- Pending: after submit, application status becomes `Pending review`.
- Success: confirmation replaces submit action while preserving application summary.
