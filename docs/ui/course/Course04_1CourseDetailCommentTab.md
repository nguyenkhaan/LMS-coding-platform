# COURSE04.1 Course Detail - Comments

- **Tên màn hình:** Course Detail - Comments
- **Đường dẫn:** `VERIFY: /courses/:courseId?tab=comments`
- **Asset:** [Course04_1CourseDetailCommentTab.svg](../../screen/course/Course04_1CourseDetailCommentTab.svg)
- **Viewport nguồn:** `1892x4481`

## Wireframe

~~~text
DESKTOP 1892x4481
+================================================================================================+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us     [search] [cart] [Sign in] |
+================================================================================================+
| [hero image] Data Structures & Algorithms                [star] 4.8  [favorite]               |
+================================================================================================+
| [Overview] [Curriculum] [Instructor] [Comments active]                                      |
| Comments and reviews                                      [Write a review]                  |
| +------------------------------------------------------------------------------------------+ |
| | [avatar] Ronald Richard  [star][star][star][star][star]  2 days ago                     | |
| | Great explanations of the two-pointer pattern.                                           | |
| +------------------------------------------------------------------------------------------+ |
| | [avatar] Jenny Wilson   [star][star][star][star]         1 week ago                     | |
| | The practice problems helped me prepare for interviews.                                  | |
| +------------------------------------------------------------------------------------------+ |
| [Load more comments]                                                                        |
+================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [hamburger] [Dreams LMS]      [cart]     |
+--------------------------------------------+
| Data Structures & Algorithms             |
| [Overview] [Curriculum]                  |
| [Instructor] [Comments active]           |
| Comments and reviews                     |
| [Write a review]                         |
| +--------------------------------------+   |
| | [avatar] Ronald Richard             |   |
| | [star][star][star][star][star]      |   |
| | Great explanations...               |   |
| +--------------------------------------+   |
| | [avatar] Jenny Wilson              |   |
| | [star][star][star][star]            |   |
| | Practice helped my interviews.      |   |
| +--------------------------------------+   |
| [Load more comments]                     |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Tabs | Detail navigation | Comments active | Switch detail tabs |
| Review list | Review item | Avatar, author, stars, date, text | Paginated/load more |
| Action | Write review | Opens review form for eligible user | Auth/enrollment check |

## States

- No comments: empty message and Write a review if eligible.
- Review submission: pending status until moderation.
