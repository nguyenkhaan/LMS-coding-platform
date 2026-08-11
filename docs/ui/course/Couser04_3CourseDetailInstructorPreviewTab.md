# COURSE04.3 Course Detail - Instructor Preview

- **Tên màn hình:** Course Detail - Instructor Preview
- **Đường dẫn:** `VERIFY: /courses/:courseId?tab=instructor`
- **Asset:** [Couser04_3CourseDetailInstructorPreviewTab.svg](../../screen/course/Couser04_3CourseDetailInstructorPreviewTab.svg)
- **Viewport nguồn:** `1892x5071`

## Wireframe

~~~text
DESKTOP 1892x5071
+================================================================================================+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us     [search] [cart] [Sign in] |
+================================================================================================+
| [hero image] Data Structures & Algorithms             [star] 4.8  [favorite]                 |
+================================================================================================+
| [Overview] [Curriculum] [Instructor active] [Comments]                                         |
| +------------------------------------------------------------------------------------------+ |
| | (avatar)  Edythe Andrew                         [star] 4.9  24 courses  12k students      | |
| |            Senior Coding Instructor | Follow [button]                                    | |
| +------------------------------------------------------------------------------------------+ |
| | About the instructor                                                                      | |
| | Edythe teaches practical algorithms and coding interview preparation.                    | |
| +------------------------------------------------------------------------------------------+ |
| | Professional experience                                                                    | |
| | [Senior Engineer] 2018-2024                                      [certificate]            | |
| | [Coding Instructor] 2015-2018                                    [certificate]            | |
| +------------------------------------------------------------------------------------------+ |
| | Achievements [12 courses] [12k students] [98% rating] [4.9 reviews]                      | |
| | Certificates [AWS] [Google Educator]                                                      | |
+================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [hamburger] [Dreams LMS]      [cart]     |
+--------------------------------------------+
| Data Structures & Algorithms             |
| [Overview] [Curriculum]                  |
| [Instructor active] [Comments]           |
| +--------------------------------------+   |
| | (avatar) Edythe Andrew              |   |
| | Senior Coding Instructor             |   |
| | [star] 4.9  24 courses  12k students |   |
| | [Follow]                             |   |
| +--------------------------------------+   |
| About the instructor                     |
| Edythe teaches practical algorithms and  |
| coding interview preparation.            |
| Professional experience                 |
| [Senior Engineer] 2018-2024              |
| [Coding Instructor] 2015-2018            |
| Achievements: 12 courses, 12k students  |
| Certificates: AWS, Google Educator       |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Profile | Instructor identity | Avatar, role, rating, course/student counts, Follow | Follow toggle |
| Content | About/experience | Bio, experience rows, certificate markers | Expandable content if needed |
| Summary | Achievements/certificates | Four metrics and certificate chips | Static/linked credentials |

## States

- Followed: Follow changes to Following.
- Missing instructor data: preserve card and show unavailable fields.
