# COURSE02 Course Detail

- **Tên màn hình:** Course Detail
- **Đường dẫn:** `VERIFY: /courses/:courseId`
- **Asset:** [COURSE02CourseDetail.svg](../../screen/course/COURSE02CourseDetail.svg)
- **Viewport nguồn:** `1892x4505`

## Wireframe

~~~text
DESKTOP 1892x4505
+================================================================================================+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us     [search] [cart] [Sign in] |
+================================================================================================+
| [hero image]  Data Structures & Algorithms                  [star] 4.8  [favorite]             |
|                Learn problem solving for coding interviews                                   |
+================================================================================================+
| +------------------------------------------------------+  +-------------------------------+ |
| | Data Structures & Algorithms                         |  | [preview image/play]         | |
| | [star] 4.8  120 reviews   [Beginner]                 |  | $79.00                       | |
| | What you'll learn: algorithms, complexity, patterns   |  | [Enroll now]                 | |
| | Course description................................... |  | Includes: 24 lessons         | |
| +------------------------------------------------------+  | Lifetime access [heart]      | |
|                                                        +-------------------------------+ |
| [Overview] [Curriculum] [Instructor] [Reviews]                                        |
| Course content                                                                    |
| +----------------------------------------------------------------------------------+ |
| | Module 1: Foundations [v]                                                       | |
| | [play] Introduction                         12:30                         [free] | |
| | [play] Complexity analysis                   18:40                              | |
| | Module 2: Patterns [v]                                                           | |
| | [play] Two-pointer patterns                 22:10                              | |
| | [play] Sliding window                       25:00                              | |
| +----------------------------------------------------------------------------------+ |
| This course is for you if... | Requirements | Frequently asked questions               |
+================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [hamburger] [Dreams LMS]      [cart]     |
+--------------------------------------------+
| [hero image]                             |
| Data Structures & Algorithms             |
| [star] 4.8  120 reviews      [favorite]  |
| Learn problem solving for interviews      |
| +--------------------------------------+   |
| | $79.00                              |   |
| | [Enroll now]                        |   |
| | Includes: 24 lessons               |   |
| +--------------------------------------+   |
| [Overview] [Curriculum] [Instructor]     |
| Course content                           |
| Module 1: Foundations [v]               |
| [play] Introduction              12:30   |
| [play] Complexity analysis       18:40   |
| Module 2: Patterns [v]                  |
| [play] Two-pointer patterns     22:10   |
| [play] Sliding window            25:00   |
| This course is for you if...             |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Hero | Course identity | Image, title, rating, level, favorite | Favorite toggle |
| Summary | Description | Learning outcomes and description | Static content |
| Purchase card | Price/enrollment | Price, Enroll now, lesson/access metadata | Auth/payment flow |
| Tabs | Detail tabs | Overview, Curriculum, Instructor, Reviews | Switch tab variant |
| Curriculum | Module/lesson list | Expandable modules, play icon, duration/free marker | Open lesson |

## States

- Enrolled: purchase card becomes Continue learning.
- Unauthenticated: Enroll now redirects to auth/payment.
- Module collapsed: lesson rows hidden, heading remains.
