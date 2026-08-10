# TC11 Course Curriculum Builder

- **Tên màn hình:** Course Curriculum Builder
- **Đường dẫn:** `VERIFY: /teacher/course-builder`
- **Asset:** [TC11TeacherCourseBuilder.svg](../../screen/teacher/TC11TeacherCourseBuilder.svg)
- **Viewport nguồn:** `1600x1486`

## Wireframe

~~~text
DESKTOP 1600x1486
+====================================================================================================+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us          [search] [bell] [user] |
+====================================================================================================+
|                               COURSE CURRICULUM BUILDER                                           |
|                              Home - Course Curriculum Builder                                     |
+====================================================================================================+
| +-----------------------------+  +-------------------------------+  +-------------------------+ |
| | TEACHER MENU                |  | Course Information             |  | Curriculum Preview      | |
| | [ ] Dashboard               |  | Course title                    |  | Course: Algorithms       | |
| | [ ] My Profile             |  | [Data Structures & Algorithms_] |  | [1] Foundations          | |
| | [>] My Courses             |  | Category [Programming v]        |  | [2] Hash tables          | |
| | [ ] Students               |  | Description [................]  |  | [3] Two-pointer patterns | |
| | [ ] Earnings               |  | Price [$99______________]      |  | [4] Sliding window       | |
| | [ ] Settings               |  | Thumbnail [Upload image]       |  | [edit] [delete]           | |
| +-----------------------------+  | [Save draft] [Publish course]  |  | [+ Add section]           | |
|                                  +-------------------------------+  +-------------------------+ |
+====================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [hamburger] [Dreams LMS]     [bell] [user]|
+--------------------------------------------+
|         COURSE CURRICULUM BUILDER         |
|       Home - Course Curriculum Builder     |
+--------------------------------------------+
| Course Information                        |
| Course title                              |
| [Data Structures & Algorithms____]        |
| Category [Programming v]                  |
| Description                               |
| [......................................]  |
| Price [$99______________]                 |
| [Upload image]                            |
| Curriculum Preview                       |
| [1] Foundations       [edit] [delete]     |
| [2] Hash tables       [edit] [delete]     |
| [3] Two-pointer       [edit] [delete]     |
| [+ Add section]                           |
| [Save draft] [Publish course]             |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Information | Course form | Title, category, description, price, thumbnail | Validation before save/publish |
| Preview | Curriculum list | Numbered sections, edit/delete, add section | Updates builder state |
| Actions | Save/Publish | Draft and publish course actions | Publish confirmation |

## States

- Draft with unsaved changes: save action enabled.
- Missing required title/category: inline validation.
- Publish success: show published status and course link.
- Mobile: information precedes curriculum preview.
