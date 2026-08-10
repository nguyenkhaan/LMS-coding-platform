# COURSE03 Course Empty State

- **Tên màn hình:** Course Detail - Empty
- **Đường dẫn:** `VERIFY: /courses/:courseId`
- **Asset:** [Course03EmptyState.svg](../../screen/course/Course03EmptyState.svg)
- **Viewport nguồn:** `1620x2492`

## Wireframe

~~~text
DESKTOP 1620x2492
+================================================================================================+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us     [search] [cart] [Sign in] |
+================================================================================================+
|                                      COURSE DETAIL                                             |
|                                Home - Course Detail                                            |
+================================================================================================+
| +-----------------------------+  +----------------------------------------------------------+ |
| | Course menu                |  | [book icon]                                                | |
| | Overview                  |  | Cannot find the course                                     | |
| | Curriculum               |  | The course may have been removed or is not available.    | |
| | Instructor               |  | [Back to courses]                                        | |
| | Reviews                  |  +----------------------------------------------------------+ |
| +-----------------------------+                                                               |
+================================================================================================+
| Footer: Dreams LMS | For Instructor | For Student | Newsletter | Copyright                |
+================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [hamburger] [Dreams LMS]      [search]   |
+--------------------------------------------+
|              COURSE DETAIL               |
|            Home - Course Detail           |
+--------------------------------------------+
| +--------------------------------------+   |
| |              [book icon]            |   |
| |       Cannot find the course        |   |
| | The course is unavailable or removed|   |
| |          [Back to courses]          |   |
| +--------------------------------------+   |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Empty panel | Illustration/message | Book icon, unavailable title, explanation | No purchase CTA |
| Action | Back to courses | Primary navigation button | Returns catalog |
| Shell | Header/footer | Shared public LMS shell | Responsive |

## States

- Missing course: render empty state for 404/unavailable course.
- Loading: show placeholder before deciding empty state.
