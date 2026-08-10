# TC05 Course Enrollment Requests

- **Tên màn hình:** Enrollment Requests
- **Đường dẫn:** `VERIFY: /teacher/course-enrollment`
- **Asset:** [TC05TeacherCourseEnrollment.svg](../../screen/teacher/TC05TeacherCourseEnrollment.svg)
- **Viewport nguồn:** `1914x2090`

## Wireframe

~~~text
DESKTOP 1914x2090
+=====================================================================================================+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us          [search] [bell] [user] |
+=====================================================================================================+
|                                  ENROLLMENT REQUESTS                                              |
|                                Home - Enrollment Requests                                        |
+=====================================================================================================+
| +----------------------------------------------------------------------------------------------+ |
| | (avatar) Edythe Andrew  Teacher                           [Become a Student] [Teacher Dashboard]| |
| +----------------------------------------------------------------------------------------------+ |
| +-----------------------------+  +----------------------------------------------------------+ |
| | MAIN MENU                   |  | Enrollment Requests                            [search] | |
| | [ ] Dashboard               |  | [All Courses v] [Pending] [Approved] [Rejected]       | |
| | [ ] My Profile             |  | Student | Course | Date | Status | Action              | |
| | [ ] My Courses             |  | Ronald | Python Foundations | 16 Jan | Pending | [Approve][x]|
| | [>] Course Enrollment      |  | Jenny  | React TypeScript   | 18 Jan | Approved| [View]      |
| | [ ] Students               |  | Patricia | Algorithms        | 22 Jan | Pending | [Approve][x]|
| | [ ] Earnings               |  |                                                             | |
| | [ ] Messages               |  |                            [1] [2] [>]                  | |
| | ACCOUNT SETTINGS            |  +----------------------------------------------------------+ |
| | [ ] Settings               |                                                               |
| | [ ] Logout                 |                                                               |
| +-----------------------------+                                                               |
+=====================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [hamburger] [Dreams LMS]     [bell] [user]|
+--------------------------------------------+
|            ENROLLMENT REQUESTS            |
|          Home - Enrollment Requests       |
+--------------------------------------------+
| Teacher: Edythe Andrew                   |
| [ ] Dashboard [ ] Profile [ ] Courses    |
| [>] Enrollment [ ] Students [ ] Earnings  |
| +--------------------------------------+   |
| | Enrollment Requests                  |   |
| | [All Courses v]                     |   |
| | [Pending] [Approved] [Rejected]     |   |
| | Ronald | Python | 16 Jan | Pending  |   |
| | [Approve] [Reject]                  |   |
| | Jenny | React | 18 Jan | Approved  |   |
| | [View]                              |   |
| | Patricia | Algorithms | Pending     |   |
| | [Approve] [Reject]                  |   |
| | [1] [2] [>]                        |   |
| +--------------------------------------+   |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Toolbar | Course/status filters | Course dropdown, Pending/Approved/Rejected tabs | Filters table |
| Table | Request rows | Student, course, date, status, approve/reject/view actions | Confirmation before mutation |
| Pagination | Page controls | 1, 2, next | Preserves filters |
| Sidebar | Teacher navigation | Course Enrollment active | Navigate |

## States

- Pending row: Approve and Reject actions visible.
- Approved/rejected row: action replaced by View/status.
- Empty filter: table headers remain and empty message appears.
- Approval failure: row remains pending and inline error appears.
