# TC06 Lesson Content Builder

- **Tên màn hình:** Lesson Builder
- **Đường dẫn:** `VERIFY: /teacher/lesson-builder`
- **Asset:** [TC06TeacherLessonContentBuilder.svg](../../screen/teacher/TC06TeacherLessonContentBuilder.svg)
- **Viewport nguồn:** `1920x2204`

## Wireframe

~~~text
DESKTOP 1920x2204
+=====================================================================================================+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us          [search] [bell] [user] |
+=====================================================================================================+
|                                    LESSON BUILDER                                                |
|                                  Home - Lesson Builder                                           |
+=====================================================================================================+
| +----------------------------------------------------------------------------------------------+ |
| | (avatar) Edythe Andrew  Teacher                           [Become a Student] [Teacher Dashboard]| |
| +----------------------------------------------------------------------------------------------+ |
| +-----------------------------+  +-------------------------------+  +-------------------------+ |
| | MAIN MENU                   |  | Lesson Content Component       |  | Lesson Module            | |
| | [ ] Dashboard               |  | Lesson title                    |  | [1] Introduction         | |
| | [ ] My Profile             |  | [Two-pointer patterns_______]  |  | [2] Hash tables           | |
| | [ ] My Courses             |  | Content type [Text v]          |  | [3] Two-pointer patterns | |
| | [ ] Course Enrollment      |  | [ rich text editor............] |  | [4] Sliding window        | |
| | [ ] Students               |  | [ toolbar: B I link list ]     |  | [5] Judge problem set     | |
| | [ ] Earnings               |  | [content body................]  |  |                           | |
| | [ ] Messages               |  | Add component [+ Add content] |  | [Save draft] [Publish]    | |
| +-----------------------------+  +-------------------------------+  +-------------------------+ |
+=====================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [hamburger] [Dreams LMS]     [bell] [user]|
+--------------------------------------------+
|              LESSON BUILDER               |
|            Home - Lesson Builder           |
+--------------------------------------------+
| Lesson Content Component                  |
| Lesson title                              |
| [Two-pointer patterns____________]        |
| Content type [Text v]                     |
| [ B I link list ]                         |
| +--------------------------------------+   |
| | content body                         |   |
| |                                      |   |
| +--------------------------------------+   |
| [+ Add content]                         |
| Lesson Module                            |
| [1] Introduction                         |
| [2] Hash tables                          |
| [3] Two-pointer patterns                 |
| [4] Sliding window                       |
| [Save draft] [Publish]                   |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Editor | Lesson metadata | Title, content type, rich text toolbar/body | Dirty state while editing |
| Editor | Add component | Adds text/content component below current block | Focus new block |
| Right rail | Lesson module | Ordered lesson list; current lesson highlighted | Select lesson |
| Actions | Save/Publish | Draft and publish actions | Publish confirmation |

## States

- Draft: Save draft enabled when dirty.
- Publish validation: missing title/content shown beside field.
- Published: publish action changes to update/unpublish affordance.
- Mobile: module rail follows editor, actions remain at bottom.
