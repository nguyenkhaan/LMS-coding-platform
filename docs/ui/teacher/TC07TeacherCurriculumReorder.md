# TC07 Curriculum Reorder

- **Tên màn hình:** Curriculum Reorder
- **Đường dẫn:** `VERIFY: /teacher/curriculum/reorder`
- **Asset:** [TC07TeacherCurriculumReorder.svg](../../screen/teacher/TC07TeacherCurriculumReorder.svg)
- **Viewport nguồn:** `1920x2097`

## Wireframe

~~~text
DESKTOP 1920x2097
+=====================================================================================================+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us          [search] [bell] [user] |
+=====================================================================================================+
|                                  CURRICULUM REORDER                                               |
|                                Home - Curriculum Reorder                                         |
+=====================================================================================================+
| +----------------------------------------------------------------------------------------------+ |
| | (avatar) Edythe Andrew  Teacher                           [Become a Student] [Teacher Dashboard]| |
| +----------------------------------------------------------------------------------------------+ |
| +-----------------------------+  +----------------------------------------------------------+ |
| | MAIN MENU                   |  | Curriculum Drag & Drop Reorder               [Save order] | |
| | [ ] Dashboard               |  | Course: Data Structures & Algorithms [v]              | |
| | [ ] My Profile             |  | +--------------------------------------+               | |
| | [ ] My Courses             |  | | Module 1: Foundations              | [collapse]    | |
| | [ ] Course Enrollment      |  | | [drag] 1. Introduction       [edit] |               | |
| | [ ] Students               |  | | [drag] 2. Complexity            [edit] |               | |
| | [ ] Earnings               |  | +--------------------------------------+               | |
| | [ ] Messages               |  | | Module 2: Patterns                 | [collapse]    | |
| | [>] Course Curriculum      |  | | [drag] 3. Two-pointer patterns [edit]|               | |
| | [ ] Settings               |  | | [drag] 4. Sliding window       [edit]|               | |
| +-----------------------------+  | +--------------------------------------+               | |
|                                  | [+ Add module] [+ Add lesson]                         | |
|                                  +----------------------------------------------------------+ |
+=====================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [hamburger] [Dreams LMS]     [bell] [user]|
+--------------------------------------------+
|            CURRICULUM REORDER            |
|          Home - Curriculum Reorder        |
+--------------------------------------------+
| Course: Data Structures & Algorithms [v]  |
| [Save order]                              |
| +--------------------------------------+   |
| | Module 1: Foundations       [open]  |   |
| | [drag] 1. Introduction       [edit] |   |
| | [drag] 2. Complexity         [edit] |   |
| +--------------------------------------+   |
| | Module 2: Patterns           [open]  |   |
| | [drag] 3. Two-pointer        [edit] |   |
| | [drag] 4. Sliding window     [edit] |   |
| +--------------------------------------+   |
| [+ Add module] [+ Add lesson]            |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Toolbar | Course selector/actions | Course dropdown and Save order | Save only after reorder |
| Curriculum | Module groups | Collapsible module heading with ordered lessons | Expand/collapse |
| Lesson row | Drag handle/edit | Explicit drag marker, number, title, edit action | Keyboard reorder should be supported |
| Actions | Add module/lesson | Adds item at current curriculum level | Opens form |

## States

- Dragging: row placeholder preserves module height.
- Unsaved order: Save order highlighted; leaving prompts confirmation.
- Empty module: module remains visible with add lesson action.
- Save error: restore last persisted order and show error.
