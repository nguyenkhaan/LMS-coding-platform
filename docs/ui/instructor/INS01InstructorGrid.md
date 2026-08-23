# INS01 Instructor Grid

- **Tên màn hình:** Instructor Grid
- **Đường dẫn:** `VERIFY: /instructors`
- **Asset:** [INS01InstructorGrid.svg](../../screen/instructor/INS01InstructorGrid.svg)
- **Viewport nguồn:** `1600x2550`

## Wireframe

~~~text
DESKTOP 1600x2550
+==================================================================================================+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us     [search] [cart] [Sign in] |
+==================================================================================================+
|                                   INSTRUCTOR GRID                                               |
|                                  Home - Instructors                                              |
+==================================================================================================+
| [Search instructor____________] [Expertise v] [Rating v]                                        |
| +-------------------+ +-------------------+ +-------------------+                              |
| | (photo)           | | (photo)           | | (photo)           |                              |
| | Edythe Andrew     | | Ronald Richard    | | Jenny Wilson      |                              |
| | Coding Instructor | | Algorithms Expert | | React Instructor  |                              |
| | [star] 4.9  [View]| | [star] 4.8  [View]| | [star] 4.7  [View]|                              |
| +-------------------+ +-------------------+ +-------------------+                              |
| +-------------------+ +-------------------+ +-------------------+                              |
| | (photo) Patricia  | | (photo) Marvin    | | (photo) Theresa   |                              |
| | Python Instructor | | Web Instructor    | | Data Instructor   |                              |
| | [star] 4.6 [View] | | [star] 4.8 [View] | | [star] 4.9 [View] |                              |
| +-------------------+ +-------------------+ +-------------------+                              |
|                                      [1] [2] [3] [>]                                           |
+==================================================================================================+
| Footer: Dreams LMS | For Instructor | For Student | Newsletter | Copyright                |
+==================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [hamburger] [Dreams LMS]      [search]   |
+--------------------------------------------+
|             INSTRUCTOR GRID              |
|            Home - Instructors             |
+--------------------------------------------+
| [Search instructor____________]           |
| [Expertise v] [Rating v]                 |
| +--------------------------------------+   |
| | (photo) Edythe Andrew               |   |
| | Coding Instructor                   |   |
| | [star] 4.9                 [View]    |   |
| +--------------------------------------+   |
| | (photo) Ronald Richard              |   |
| | Algorithms Expert                   |   |
| | [star] 4.8                 [View]    |   |
| +--------------------------------------+   |
| | (photo) Jenny Wilson                |   |
| | React Instructor                    |   |
| | [star] 4.7                 [View]    |   |
| +--------------------------------------+   |
| [1] [2] [3] [>]                         |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Toolbar | Search/filter | Instructor search, expertise, rating | Filters grid |
| Grid | Instructor card | avatar_url, display_name, headline, rating (tổng hợp), View | Opens detail |
| Pagination | Page controls | Page numbers and next | Preserve filters |

## States

- Empty search: no instructor result with clear filters.
- Loading: card photo/name skeletons.
- Pagination active page uses coral accent.
