# TC10 Course Students

- **Tên màn hình:** Course Students
- **Đường dẫn:** `VERIFY: /teacher/course-students`
- **Asset:** [TC10TeacherCourseStudent.svg](../../screen/teacher/TC10TeacherCourseStudent.svg)
- **Viewport nguồn:** `1600x1473`

## Wireframe

~~~text
DESKTOP 1600x1473
+===================================================================================================+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us          [search] [bell] [user] |
+===================================================================================================+
|                                   COURSE STUDENTS                                                 |
|                                  Home - Course Students                                           |
+===================================================================================================+
| +-----------------------------+  +----------------------------------------------------------+ |
| | TEACHER MENU                |  | Course Students                               [Export] | |
| | [ ] Dashboard               |  | Course: Data Structures & Algorithms [v]              | |
| | [ ] My Courses             |  | [Search student________________] [All status v]       | |
| | [>] Course Students        |  | Student | Email | Progress | Status | Action             | |
| | [ ] Submissions            |  | Ronald  | ronald@example.com | 64% | Active | [View]     | |
| | [ ] Earnings               |  | Jenny   | jenny@example.com  | 42% | Active | [View]     | |
| | [ ] Settings               |  | Patricia| patricia@example.com| 28% | Active | [View]     | |
| +-----------------------------+  |                                  [1] [2] [>]       | |
|                                  +----------------------------------------------------------+ |
+===================================================================================================+
~~~

~~~text
MOBILE 390x844
+-------------------------------------------+
| [hamburger] [Dreams LMS]     [bell] [user]|
+-------------------------------------------+
|              COURSE STUDENTS             |
|            Home - Course Students         |
+-------------------------------------------+
| Course: Algorithms [v]                   |
| [Search student____________]              |
| [All status v] [Export]                   |
| Ronald | ronald@example.com              |
| Progress 64% | Active         [View]     |
| Jenny | jenny@example.com                |
| Progress 42% | Active         [View]     |
| Patricia | patricia@example.com          |
| Progress 28% | Active         [View]     |
| [1] [2] [>]                              |
+-------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Toolbar | Course/search/status | Course selector, student search, status selector, export | Filters current course |
| Table | Student rows | Name, email, progress, status, View | Opens student detail |
| Pagination | Page controls | Page numbers and next | Preserve filters |

## States

- Active status badge is visible for enrolled students.
- Search empty state preserves course selector.
- Export uses current course/filter scope.
