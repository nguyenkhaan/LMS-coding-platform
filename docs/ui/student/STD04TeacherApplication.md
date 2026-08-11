# STD04 Teacher Application

- **Tên màn hình:** Become a Teacher
- **Đường dẫn:** `VERIFY: /student/teacher-application`
- **Asset:** New screen derived from teacher registration flow and `AD01TeacherRegistrationReview.svg`
- **Mục đích:** Student tạo TeacherProfile và gửi hồ sơ để Admin duyệt.

## Wireframe

~~~text
DESKTOP 1600x1200
+================================================================================================+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us     [search] [cart] [profile] |
+================================================================================================+
|                                      BECOME A TEACHER                                            |
|                                Home - Become a Teacher                                          |
+================================================================================================+
| +------------------------------------------------------+  +-------------------------------+ |
| | Teacher profile                                      |  | APPLICATION STATUS           | |
| | Bio [____________________________________________]   |  | [PENDING]                    | |
| | School/address [_______________________________]    |  | Submitted: 16 Jan 2024       | |
| | CV [Upload PDF]                                     |  | Admin review required        | |
| | Motivation [____________________________________]    |  | [Withdraw application]       | |
| +------------------------------------------------------+  +-------------------------------+ |
| | Identity verification                               |                                |
| | CCCD number [____________________]                  |                                |
| | CCCD front [Upload]  CCCD back [Upload]             |                                |
| | [Save draft]                              [Submit]   |                                |
| +------------------------------------------------------+                                |
+================================================================================================+
~~~

~~~text
MOBILE 390x844
+------------------------------------------+
| [hamburger] [Dreams LMS]      [profile]  |
+------------------------------------------+
|           BECOME A TEACHER               |
|        Home - Become a Teacher            |
+------------------------------------------+
| APPLICATION STATUS: [PENDING]            |
| Admin review required                    |
| Bio [____________________________]       |
| School/address [_________________]       |
| CV [Upload PDF]                          |
| Motivation [______________________]      |
| CCCD number [_____________________]       |
| CCCD front [Upload]                      |
| CCCD back [Upload]                       |
| [Save draft] [Submit application]        |
+------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Profile | Teacher profile form | Bio, school/address, CV, motivation | Saves draft |
| Identity | CCCD upload | Number, front/back documents | Required before submit |
| Status | Application status | Pending/Approved/Rejected and reviewed note | Read-only after submit |
| Action | Submit/withdraw | Creates profile/application or withdraws pending request | Confirmation |

## States

- Draft: editable, Submit enabled when required fields valid.
- Pending: form read-only or editable according to policy; status visible.
- Rejected: reviewed note visible; Edit and Resubmit enabled.
- Approved: Teacher Dashboard CTA replaces application form.
