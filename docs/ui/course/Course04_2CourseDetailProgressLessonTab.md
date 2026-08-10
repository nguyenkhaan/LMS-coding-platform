# COURSE04.2 Course Detail - Progress Lessons

- **Tên màn hình:** Course Detail - Progress / Lessons
- **Đường dẫn:** `VERIFY: /courses/:courseId?tab=progress`
- **Asset:** [Course04_2CourseDetailProgressLessonTab.svg](../../screen/course/Course04_2CourseDetailProgressLessonTab.svg)
- **Viewport nguồn:** `1892x4481`

## Wireframe

~~~text
DESKTOP 1892x4481
+================================================================================================+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us     [search] [cart] [Sign in] |
+================================================================================================+
| [hero image] Data Structures & Algorithms             Progress 40% [===========-------]       |
+================================================================================================+
| [Overview] [Progress active] [Instructor] [Comments]                                           |
| 4 modules - 24 lessons                                                                        |
| +------------------------------------------------------------------------------------------+ |
| | Module 1: Foundations                                                    [40%] [v]       | |
| | [done] Introduction                         12:30                         Completed       | |
| | [done] Complexity analysis                   18:40                         Completed       | |
| | Module 2: Patterns                                                        [v]             | |
| | [>] Two-pointer patterns                 22:10                         Continue        | |
| | [ ] Sliding window                       25:00                         Locked         | |
| | Module 3: Practice                                                        [collapsed]    | |
| +------------------------------------------------------------------------------------------+ |
+================================================================================================+
~~~

~~~text
MOBILE 390x844
+-------------------------------------------+
| [hamburger] [Dreams LMS]      [cart]     |
+-------------------------------------------+
| Data Structures & Algorithms             |
| Progress 40% [===========-------]         |
| [Overview] [Progress active]             |
| [Instructor] [Comments]                  |
| 4 modules - 24 lessons                   |
| Module 1: Foundations [v]                |
| [done] Introduction 12:30   Completed    |
| [done] Complexity 18:40     Completed    |
| Module 2: Patterns [v]                   |
| [>] Two-pointer 22:10       [Continue]   |
| [ ] Sliding window 25:00    Locked       |
| Module 3: Practice [collapsed]           |
+-------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Progress | Course progress | Percentage and progress bar | Updates after lesson completion |
| Tabs | Detail navigation | Progress active | Switch tab |
| Lesson list | Module/lesson rows | Completed, current Continue, locked states, duration | Expand/open/lock |

## States

- Completed lesson: check marker and Completed label.
- Current lesson: accent marker and Continue action.
- Locked lesson: disabled row with Locked label.
