# TC03 Students Grid

- **Tên màn hình:** Students Grid
- **Đường dẫn:** `VERIFY: /teacher/students`
- **Asset:** [TC03ViewStudent.svg](../../screen/teacher/TC03ViewStudent.svg)
- **Viewport nguồn:** `1920x2298`

## Wireframe

~~~text
DESKTOP 1920x2298
+=====================================================================================================+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us          [search] [bell] [user] |
+=====================================================================================================+
|                                    STUDENTS GRID                                                  |
|                                   Home - Students                                                |
+=====================================================================================================+
| +----------------------------------------------------------------------------------------------+ |
| | (avatar) Edythe Andrew  Teacher                           [Become a Student] [Teacher Dashboard]| |
| +----------------------------------------------------------------------------------------------+ |
| +-----------------------------+  +----------------------------------------------------------+ |
| | MAIN MENU                   |  | Students                                      [search] | |
| | [ ] Dashboard               |  | [All Courses v] [Search student____________] [Filter] | |
| | [ ] My Profile             |  | +-------------+ +-------------+ +-------------+          | |
| | [ ] My Courses             |  | | (avatar)    | | (avatar)    | | (avatar)    |          | |
| | [ ] Course Enrollment      |  | | Ronald      | | Jenny       | | Patricia    |          | |
| | [>] Students               |  | | Python      | | React       | | Algorithms  |          | |
| | [ ] Earnings               |  | | Progress 64%| | Progress 42%| | Progress 28%|          | |
| | [ ] Messages               |  | | [View]      | | [View]      | | [View]      |          | |
| | ACCOUNT SETTINGS            |  | +-------------+ +-------------+ +-------------+          | |
| | [ ] Settings               |  | +-------------+ +-------------+ +-------------+          | |
| | [ ] Logout                 |  | | (avatar)    | | (avatar)    | | (avatar)    |          | |
| +-----------------------------+  | | Student card| | Student card| | Student card|          | |
|                                  | | Course      | | Course      | | Course      |          | |
|                                  | | [View]      | | [View]      | | [View]      |          | |
|                                  | +-------------+ +-------------+ +-------------+          | |
|                                  |                     [1] [2] [3] [>]                       | |
|                                  +----------------------------------------------------------+ |
+=====================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [hamburger] [Dreams LMS]     [bell] [user]|
+--------------------------------------------+
|               STUDENTS GRID               |
|              Home - Students              |
+--------------------------------------------+
| Teacher: Edythe Andrew                    |
| [ ] Dashboard [ ] Profile [ ] Courses     |
| [>] Students  [ ] Earnings [ ] Messages   |
| +--------------------------------------+   |
| | Students                             |   |
| | [All Courses v]                     |   |
| | [Search student____________] [Filter]|   |
| | +----------------------------------+ |   |
| | | (avatar) Ronald                 | |   |
| | | Python | Progress 64%            | |   |
| | |                         [View]   | |   |
| | +----------------------------------+ |   |
| | +----------------------------------+ |   |
| | | (avatar) Jenny                  | |   |
| | | React | Progress 42%             | |   |
| | |                         [View]   | |   |
| | +----------------------------------+ |   |
| | [1] [2] [3] [>]                    |   |
| +--------------------------------------+   |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Sidebar | Teacher navigation | Students active | Navigate sections |
| Toolbar | Course filter/search | Course dropdown, student search, filter action | Updates grid |
| Content | Student cards | Avatar, name, course, progress, View action | Opens student detail |
| Footer | Footer | Shared teacher footer | Stack mobile |

## States

- Search/filter loading: card grid skeleton.
- Empty result: retain filters and show no-student message.
- Pagination: active page coral; card order stable.
- `VERIFY`: exact student names/course labels are asset sample data.
