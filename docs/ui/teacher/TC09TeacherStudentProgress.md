# TC09 Student Progress

- **Tên màn hình:** Student Progress
- **Đường dẫn:** `VERIFY: /teacher/student-progress`
- **Asset:** [TC09TeacherStudentProgress.svg](../../screen/teacher/TC09TeacherStudentProgress.svg)
- **Viewport nguồn:** `1600x1473`

## Wireframe

~~~text
DESKTOP 1600x1473
+==================================================================================================+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us          [search] [bell] [user] |
+==================================================================================================+
|                                  STUDENT PROGRESS                                                |
|                                Home - Student Progress                                           |
+==================================================================================================+
| +-----------------------------+  +----------------------------------------------------------+ |
| | TEACHER MENU                |  | Student Progress                              [Export] | |
| | [ ] Dashboard               |  | Course [Data Structures v]  Student [All v]            | |
| | [ ] My Courses             |  | Student | Course | Completed | Score | Last active | View| |
| | [ ] Submissions            |  | Ronald  | Algorithms | 64% | 92% | Today | [View]    | |
| | [>] Student Progress       |  | Jenny   | Algorithms | 42% | 68% | 2 days | [View]   | |
| | [ ] Earnings               |  | Patricia| Algorithms | 28% | --  | 5 days | [View]   | |
| +-----------------------------+  +----------------------------------------------------------+ |
+==================================================================================================+
~~~

~~~text
MOBILE 390x844
+-------------------------------------------+
| [hamburger] [Dreams LMS]     [bell] [user]|
+-------------------------------------------+
|             STUDENT PROGRESS             |
|           Home - Student Progress         |
+-------------------------------------------+
| [Course: Algorithms v] [Student: All v]  |
| [Export]                                  |
| Ronald | Completed 64% | Score 92%        |
| Last active Today             [View]      |
| Jenny | Completed 42% | Score 68%         |
| Last active 2 days            [View]      |
| Patricia | Completed 28% | --             |
| Last active 5 days            [View]      |
+-------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Toolbar | Course/student selectors | Scope progress report | Re-query data |
| Toolbar | Export | Export current filtered progress | Loading/download state |
| Table | Progress rows | Student, course, completion, score, last active, View | Opens student progress |
| Sidebar | Teacher menu | Student Progress active | Navigate |

## States

- No score: show `--`, not zero.
- Export loading: disable export without clearing table.
- Empty course: retain selectors and show empty state.
