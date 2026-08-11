# TC14 Course Approval Status

- **Tên màn hình:** Course Submission and Approval Status
- **Đường dẫn:** `VERIFY: /teacher/courses/:courseId/review-status`
- **Asset:** New screen derived from `TC11TeacherCourseBuilder.svg` and Admin review flow.

## Wireframe

~~~text
DESKTOP 1600x1100
+================================================================================================+
| [Dreams LMS] Teacher Dashboard                         [notifications] [profile] [Logout]     |
+================================================================================================+
| COURSE REVIEW STATUS                  Course: Data Structures & Algorithms                     |
+================================================================================================+
| +-----------------------------+  +----------------------------------------------------------+ |
| | STATUS TIMELINE             |  | Course summary                                            | |
| | [done] Draft                |  | Title: Data Structures & Algorithms                       | |
| | [now] Pending review       |  | Price: 79,000 VND   Sections: 4   Lessons: 24            | |
| | [ ] Published               |  | [Open course builder]                                     | |
| +-----------------------------+  +----------------------------------------------------------+ |
| | Admin decision              |  | Submission checklist                                      | |
| | Status: Pending             |  | [x] Course information  [x] Curriculum                   | |
| | Submitted: 16 Jan 2024     |  | [x] Lesson content      [x] Price                       | |
| | Note: --                   |  | [Submit for review] [Withdraw submission]               | |
| +-----------------------------+  +----------------------------------------------------------+ |
+================================================================================================+
~~~

~~~text
MOBILE 390x844
+------------------------------------------+
| [Dreams LMS] Teacher Dashboard           |
+------------------------------------------+
| COURSE REVIEW STATUS                     |
| Data Structures & Algorithms             |
| [done] Draft                             |
| [now] Pending review                     |
| [ ] Published                            |
| Status: Pending                          |
| Submitted: 16 Jan 2024                   |
| Checklist:                               |
| [x] Information [x] Curriculum           |
| [x] Content    [x] Price                 |
| [Open builder] [Withdraw]                |
+------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Timeline | Course status | Draft, Pending, Published, Rejected | Reflects Admin decision |
| Summary | Course metadata | Title, price, section/lesson count | Opens builder |
| Checklist | Submission readiness | Required course/curriculum/content/price checks | Blocks incomplete submit |
| Action | Submit/withdraw | Sends course to Admin or withdraws pending request | Audit event |

## States

- Rejected: Admin note visible, Edit course and Resubmit actions enabled.
- Published: status timeline complete; course public.
- Draft: Submit for review disabled until checklist passes.
