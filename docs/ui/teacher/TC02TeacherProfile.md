# TC02 Teacher Profile

- **Tên màn hình:** My Profile
- **Đường dẫn:** `VERIFY: /teacher/profile`
- **Asset:** [TC02TeacherProfile.svg](../../screen/teacher/TC02TeacherProfile.svg)
- **Viewport nguồn:** `1920x2418`

## Wireframe

~~~text
DESKTOP 1920x2418
+=====================================================================================================+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us          [search] [bell] [user] |
+=====================================================================================================+
|                                      MY PROFILE                                                   |
|                                    Home - My Profile                                             |
+=====================================================================================================+
| +----------------------------------------------------------------------------------------------+ |
| | (avatar)  Edythe Andrew   Teacher                         [Become a Student] [Teacher Dashboard]| |
| +----------------------------------------------------------------------------------------------+ |
| +-----------------------------+  +----------------------------------------------------------+ |
| | MAIN MENU                   |  | My Profile                                      [edit] | |
| | [ ] Dashboard               |  | First Name: Edythe       Last Name: Andrew             | |
| | [>] My Profile             |  | User Name: edythe       Email: teacher@example.com    | |
| | [ ] My Courses             |  | Phone: +1 123 456 7890   Gender: Female              | |
| | [ ] Course Enrollment      |  | Date of Birth: 16 Jan 1990   Age: 34              | |
| | [ ] Students               |  | Registration Date: 16 Jan 2024, 11:15 AM             | |
| | [ ] Earnings               |  | Bio: Experienced coding instructor and mentor.       | |
| | [ ] Messages               |  |------------------------------------------------------| |
| | ACCOUNT SETTINGS            |  | Education / Experience                              | |
| | [ ] Settings               |  | [qualification row........................] [edit]  | |
| | [ ] Logout                 |  | [experience row.........................] [edit]   | |
| +-----------------------------+  +----------------------------------------------------------+ |
+=====================================================================================================+
| Footer: Dreams LMS | For Instructor | For Student | Newsletter | Copyright                   |
+=====================================================================================================+
~~~

~~~text
MOBILE 390x844
+----------------------------------------------+
| [hamburger] [Dreams LMS]     [bell] [user]|
+----------------------------------------------+
|               MY PROFILE                 |
|             Home - My Profile             |
+----------------------------------------------+
| (avatar) Edythe Andrew        [edit]      |
| Teacher                                    |
| [Become a Student] [Teacher Dashboard]    |
| MAIN MENU                                 |
| [ ] Dashboard  [>] My Profile             |
| [ ] My Courses [ ] Enrollment             |
| [ ] Students   [ ] Earnings               |
| [ ] Messages                               |
| ACCOUNT SETTINGS [ ] Settings [ ] Logout  |
| +--------------------------------------+   |
| | My Profile                         [edit]|
| | First Name: Edythe                    |   |
| | Last Name: Andrew                     |   |
| | User Name: edythe                     |   |
| | Email: teacher@example.com             |   |
| | Phone: +1 123 456 7890                |   |
| | Gender: Female   Age: 34              |   |
| | DOB: 16 Jan 1990                      |   |
| | Bio: Experienced coding instructor... |   |
| | Education / Experience                |   |
| +--------------------------------------+   |
+----------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Header/hero | Teacher shell | Global nav, title, breadcrumb | Responsive collapse |
| Profile banner | Identity | Avatar, teacher name, role, actions | Edit profile entry |
| Sidebar | Navigation | My Profile active; account settings below divider | Section navigation |
| Content | Profile detail card | Identity grid, contact, DOB/age, bio, education/experience rows | Pencil opens editable form |

## States

- Read-only: values rendered as text with edit pencil.
- Edit: inputs replace values without changing field order.
- Validation: email/phone/date inline error.
- `VERIFY`: exact teacher profile values are sample data from asset.
