# TC01 Teacher Dashboard

- **Tên màn hình:** Dashboard
- **Đường dẫn:** `VERIFY: /teacher/dashboard`
- **Asset:** [TC01TeacherDashboard.svg](../../screen/teacher/TC01TeacherDashboard.svg)
- **Viewport nguồn:** `1920x2202`

## Wireframe

~~~text
DESKTOP 1920x2202
+=====================================================================================================+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us          [search] [bell] [profile]|
+=====================================================================================================+
|                                      DASHBOARD                                                   |
|                                     Home - Dashboard                                             |
+=====================================================================================================+
| +----------------------------------------------------------------------------------------------+ |
| | (avatar)  Edythe Andrew   Teacher                         [Become a Student] [Teacher Dashboard]| |
| +----------------------------------------------------------------------------------------------+ |
| +-----------------------------+  +----------------------------------------------------------+ |
| | MAIN MENU                   |  | Welcome back, Edythe                                      | |
| | [>] Dashboard               |  | [Total Courses 08] [Total Students 120] [Reviews 4.8]     | |
| | [ ] My Profile             |  |                                                          | |
| | [ ] My Courses             |  | +----------------------------+  +----------------------+ | |
| | [ ] Course Enrollment      |  | | Revenue overview          |  | Course performance   | | |
| | [ ] Students               |  | | [bar/line chart]          |  | [progress chart]     | | |
| | [ ] Earnings               |  | +----------------------------+  +----------------------+ | |
| | [ ] Messages               |  | Recent students | Course | Progress | Status | Action     | | |
| |-----------------------------|  | Ronald Richard  | Python | 64% | Active | [View]       | | |
| | ACCOUNT SETTINGS            |  | Jenny Wilson   | React  | 42% | Active | [View]       | | |
| | [ ] Settings               |  +----------------------------------------------------------+ |
| | [ ] Logout                 |                                                               |
| +-----------------------------+                                                               |
+=====================================================================================================+
| Footer: Dreams LMS | For Instructor | For Student | Newsletter | Copyright                   |
+=====================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [hamburger] [Dreams LMS]     [bell] [user]|
+--------------------------------------------+
|               DASHBOARD                  |
|              Home - Dashboard             |
+--------------------------------------------+
| (avatar) Edythe Andrew                    |
| Teacher                     [profile edit]|
| [Become a Student]                        |
| +--------------------------------------+   |
| | MAIN MENU                            |   |
| | [>] Dashboard  [ ] My Profile        |   |
| | [ ] My Courses [ ] Enrollment        |   |
| | [ ] Students    [ ] Earnings         |   |
| | [ ] Messages                         |   |
| | ACCOUNT SETTINGS [ ] Settings [ ] Logout|
| +--------------------------------------+   |
| Welcome back, Edythe                     |
| [Courses 08] [Students 120]              |
| [Reviews 4.8]                            |
| Revenue overview                         |
| +--------------------------------------+   |
| | [line/bar chart]                     |   |
| +--------------------------------------+   |
| Course performance                      |
| [progress chart]                        |
| Recent students                         |
| Ronald Richard | Python | 64% [View]    |
| Jenny Wilson   | React  | 42% [View]    |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Header | Teacher shell | Logo, global nav, search, notification, profile | Mobile dùng hamburger |
| Hero | Breadcrumb banner | Dashboard title và breadcrumb | Static |
| Profile banner | Teacher identity | Avatar, name/role, teacher actions | Responsive card |
| Sidebar | Main/account menu | Dashboard active, course/student/earning links | Navigate sections |
| Main | KPI cards | Courses, students, reviews/revenue metrics | Values dynamic |
| Main | Charts/table | Revenue, course performance, recent students | Loading/empty states |
| Footer | Footer | Links, newsletter, copyright | Stack mobile |

## States

- Dashboard loading: KPI và chart giữ skeleton.
- Empty recent students: table header giữ nguyên, hiển thị empty message.
- Notification unread: bell có badge.
- `VERIFY`: route và metric labels động cần xác nhận.
