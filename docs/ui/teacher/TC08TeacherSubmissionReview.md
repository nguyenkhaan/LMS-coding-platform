# TC08 Submission Review

- **Tên màn hình:** Submission History / Review
- **Đường dẫn:** `VERIFY: /teacher/submissions`
- **Asset:** [TC08TeacherSubmissionReview.svg](../../screen/teacher/TC08TeacherSubmissionReview.svg)
- **Viewport nguồn:** `1600x1473`

## Wireframe

~~~text
DESKTOP 1600x1473
+===================================================================================================+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us          [search] [bell] [user] |
+===================================================================================================+
|                                  SUBMISSION HISTORY                                               |
|                                Home - Submission History                                         |
+===================================================================================================+
| +-----------------------------+  +----------------------------------------------------------+ |
| | TEACHER MENU                |  | Submission History                         [Filter v]   | |
| | [ ] Dashboard               |  | Course [v]  Student [search________]  Status [v]       | |
| | [ ] My Courses             |  | Student | Problem | Submitted | Score | Status | Action  | |
| | [>] Submissions            |  | Ronald  | Two-pointer | 16 Jan | 92% | Passed | [Review]|
| | [ ] Students               |  | Jenny   | Hash table   | 18 Jan | 68% | Review | [Review]|
| | [ ] Earnings               |  | Patricia| Sliding wnd. | 22 Jan | --  | Pending| [Review]|
| +-----------------------------+  +----------------------------------------------------------+ |
+===================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [hamburger] [Dreams LMS]     [bell] [user]|
+--------------------------------------------+
|            SUBMISSION HISTORY             |
|          Home - Submission History         |
+--------------------------------------------+
| [Course v] [Status v]                     |
| [Student search____________]              |
| Ronald | Two-pointer | 92% | Passed      |
| [Review]                                  |
| Jenny | Hash table | 68% | Review         |
| [Review]                                  |
| Patricia | Sliding window | Pending       |
| [Review]                                  |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Toolbar | Filters | Course, student search, status | Filter submission table |
| Table | Submission rows | Student, problem, date, score, status, Review | Opens review detail |
| Sidebar | Teacher menu | Submissions active | Navigate |

## States

- Passed/Review/Pending badges are distinct.
- Empty filters retain filter controls and show no submissions.
- Mobile table reflows each row into a review card.
