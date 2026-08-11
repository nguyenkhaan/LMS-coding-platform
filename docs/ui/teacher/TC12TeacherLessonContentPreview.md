# TC12 Student-View Lesson Preview

- **Tên màn hình:** Student-View Lesson Preview
- **Đường dẫn:** `VERIFY: /teacher/lesson-preview`
- **Asset:** [TC12TeacherLessonContentPreview.svg](../../screen/teacher/TC12TeacherLessonContentPreview.svg)
- **Viewport nguồn:** `1600x1467`

## Wireframe

~~~text
DESKTOP 1600x1467
+==================================================================================================+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us          [search] [bell] [user] |
+==================================================================================================+
|                              STUDENT-VIEW LESSON PREVIEW                                         |
|                             Home - Lesson Preview                                                |
+==================================================================================================+
| +-----------------------------+  +----------------------------------------------------------+ |
| | TEACHER MENU                |  | [Course badge] Data Structures & Algorithms    [Publish] | |
| | [ ] Dashboard               |  | Module 2: Lesson 3 - Two-pointer patterns                | |
| | [ ] My Profile             |  | [Preview as Student]                                      | |
| | [ ] My Courses             |  | Two-pointer patterns                                      | |
| | [ ] Students               |  | Learn to scan an ordered collection with two pointers.     | |
| | [ ] Earnings               |  | +------------------------------------------------------+   | |
| | [>] Lesson Preview         |  | | CODE EXAMPLE / VIDEO PLAYER                        |   | |
| | [ ] Settings               |  | | [play]  const left = 0; const right = n - 1;      |   | |
| +-----------------------------+  | +------------------------------------------------------+   | |
|                                  | [Notes] [Resources] [Assignment]  [Previous] [Next] | |
|                                  +----------------------------------------------------------+ |
+==================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [hamburger] [Dreams LMS]     [bell] [user]|
+--------------------------------------------+
|          LESSON PREVIEW                  |
|         Home - Lesson Preview             |
+--------------------------------------------+
| [Course badge] Algorithms                 |
| Module 2: Lesson 3                        |
| Two-pointer patterns                      |
| [Preview as Student] [Publish]            |
| Learn to scan an ordered collection.      |
| +--------------------------------------+   |
| | [play] CODE / VIDEO                  |   |
| | const left = 0; const right = n - 1; |   |
| +--------------------------------------+   |
| [Notes] [Resources] [Assignment]          |
| [< Previous] [Next >]                     |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Lesson header | Course/lesson metadata | Course badge, module/lesson, preview and publish actions | Publish state transition |
| Content | Lesson body | Title, explanatory text, code/video block | Student rendering fidelity |
| Tabs | Notes/resources/assignment | Three content tabs | Switch content |
| Navigation | Previous/Next | Lesson sequence controls | Disabled at boundaries |

## States

- Preview: publish action remains available to teacher.
- Unpublished: badge/action indicates draft.
- Missing content: empty block with edit prompt.
- Mobile: tabs wrap or scroll horizontally without hiding labels.
