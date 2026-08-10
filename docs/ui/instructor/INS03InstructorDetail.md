# INS03 Instructor Detail

- **Tên màn hình:** Instructor Detail
- **Đường dẫn:** `VERIFY: /instructors/:instructorId`
- **Asset:** [INS03InstructorDetail.svg](../../screen/instructor/INS03InstructorDetail.svg)
- **Viewport nguồn:** `VERIFY` (SVG không có metadata kích thước hợp lệ)
- **Bản raster đối chiếu:** [INS03InstructorDetail.png](../../screen/instructor/INS03InstructorDetail.png)

## Wireframe

~~~text
DESKTOP 1600x2550
+================================================================================================+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us     [search] [cart] [Sign in] |
+================================================================================================+
| [hero image]  Edythe Andrew                         [star] 4.9  [Follow] [Message]             |
|                Senior Coding Instructor                                                        |
+================================================================================================+
| +------------------------------------------------------------------------------------------+ |
| | About Edythe                                                                            | |
| | Practical coding instructor focused on algorithms and interview preparation.             | |
| +------------------------------------------------------------------------------------------+ |
| | Professional experience                      | Achievements                               | |
| | Senior Engineer 2018-2024                    | [24 Courses] [12k Students]               | |
| | Coding Instructor 2015-2018                  | [98% Rating] [4.9 Reviews]                | |
| +------------------------------------------------------------------------------------------+ |
| | Courses by Edythe                         [search course____________]                    | |
| | [course card] [course card] [course card]                                             | |
| +------------------------------------------------------------------------------------------+ |
| | Certificates [AWS] [Google Educator]                                                  | |
+================================================================================================+
~~~

~~~text
MOBILE 390x844
+------------------------------------------+
| [hamburger] [Dreams LMS]      [search]   |
+------------------------------------------+
| [hero image]                             |
| Edythe Andrew                            |
| Senior Coding Instructor                 |
| [star] 4.9 [Follow] [Message]            |
| About Edythe                             |
| Practical coding instructor focused on   |
| algorithms and interview preparation.    |
| Professional experience                  |
| Senior Engineer 2018-2024                |
| Coding Instructor 2015-2018              |
| [24 Courses] [12k Students]              |
| Courses by Edythe                        |
| [course card]                            |
| [course card]                            |
| Certificates [AWS] [Google Educator]     |
+------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Hero | Instructor identity | Image, name, role, rating, Follow, Message | Follow/message action |
| Profile | About/experience | Bio, professional experience, metrics | Read-only details |
| Courses | Course cards | Instructor-owned course grid and search | Opens course detail |
| Credentials | Certificates | Credential chips/cards | Optional links |

## States

- Follow toggle changes label to Following.
- No courses: retain section heading and empty message.
- Missing raster/SVG geometry: verify exact hero dimensions before UI implementation.
