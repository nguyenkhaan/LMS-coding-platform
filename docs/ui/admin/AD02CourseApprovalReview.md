# AD02 Course Approval Review

- **Tên màn hình:** Course Approval Review
- **Đường dẫn:** `VERIFY: /admin/course-review/:courseId`
- **Asset:** New screen derived from `TC14CourseApprovalStatus.md` and Admin moderation workflow.

## Wireframe

~~~text
DESKTOP 1600x1300
+================================================================================================+
| [Dreams LMS] Admin Console                         [notifications] [admin profile] [Logout]   |
+================================================================================================+
| COURSE APPROVAL REVIEW                                  [Approve] [Reject] [Request changes] |
+================================================================================================+
| +-----------------------------+  +----------------------------------------------------------+ |
| | PENDING COURSES             |  | Course information                                        | |
| | [search________________]    |  | Data Structures & Algorithms                              | |
| | [thumbnail] Course A [new]  |  | Teacher: Edythe Andrew   Price: 79,000 VND              | |
| | [thumbnail] Course B [new]  |  | Status: Pending review                                  | |
| +-----------------------------+  +----------------------------------------------------------+ |
|                                  | Curriculum/content preview                               | |
|                                  | [Section 1 v] [Lesson 1] [Reading] [Video]             | |
|                                  | [Section 2 v] [Lesson 2] [Quiz] [Problem]              | |
|                                  | [Open student preview]                                  | |
|                                  +----------------------------------------------------------+ |
|                                  | Decision note [____________________________________]     | |
|                                  | [Approve] [Reject] [Request changes]                    | |
|                                  +----------------------------------------------------------+ |
+================================================================================================+
~~~

~~~text
MOBILE 390x844
+------------------------------------------+
| [Dreams LMS] Admin Console               |
+------------------------------------------+
| COURSE APPROVAL REVIEW                   |
| [Approve] [Reject] [Changes]             |
| Pending courses                           |
| [search________________]                 |
| Course A [new]                           |
| Course B [new]                           |
| Course information                       |
| Data Structures & Algorithms             |
| Teacher: Edythe  Price: 79,000 VND       |
| Status: Pending review                   |
| Curriculum/content preview               |
| [Section 1] [Reading] [Video]             |
| [Section 2] [Quiz] [Problem]              |
| Decision note [____________________]     |
| [Approve] [Reject] [Request changes]     |
+------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Queue | Pending courses | Searchable course review queue | Opens selected course |
| Preview | Course/content preview | Teacher, price, section, lesson and content types | Student-view preview |
| Decision | Moderation actions | Approve, reject, request changes, note | Updates status and audit |

## States

- Pending: decision actions enabled.
- Rejected/request changes: note required; Teacher receives notification.
- Approved: course becomes Published according to policy and appears in catalog.
