# INS02 Instructor List

- **Tên màn hình:** Instructor List
- **Đường dẫn:** `VERIFY: /instructors?view=list`
- **Asset:** [INS02InstructorList.svg](../../screen/instructor/INS02InstructorList.svg)
- **Viewport nguồn:** `1600x2550`

## Wireframe

~~~text
DESKTOP 1600x2550
+==================================================================================================+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us     [search] [cart] [Sign in] |
+==================================================================================================+
|                                   INSTRUCTOR LIST                                               |
|                                  Home - Instructors                                              |
+==================================================================================================+
| [Search instructor____________] [Expertise v] [Rating v] [grid] [list active]                  |
| +------------------------------------------------------------------------------------------+ |
| | [photo] | Edythe Andrew | Coding Instructor | [star] 4.9 | 24 Courses | [View profile]  | |
| | [photo] | Ronald Richard| Algorithms Expert | [star] 4.8 | 18 Courses | [View profile]  | |
| | [photo] | Jenny Wilson  | React Instructor  | [star] 4.7 | 14 Courses | [View profile]  | |
| | [photo] | Patricia Brown| Python Instructor | [star] 4.6 | 12 Courses | [View profile]  | |
| +------------------------------------------------------------------------------------------+ |
|                                      [1] [2] [3] [>]                                           |
+==================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [hamburger] [Dreams LMS]      [search]   |
+--------------------------------------------+
|             INSTRUCTOR LIST              |
|            Home - Instructors             |
+--------------------------------------------+
| [Search instructor____________]           |
| [Expertise v] [Rating v] [list]           |
| +--------------------------------------+   |
| | [photo] Edythe Andrew               |   |
| | Coding Instructor | [star] 4.9      |   |
| | 24 Courses                 [View]    |   |
| +--------------------------------------+   |
| | [photo] Ronald Richard              |   |
| | Algorithms Expert | [star] 4.8      |   |
| | 18 Courses                 [View]    |   |
| +--------------------------------------+   |
| | [photo] Jenny Wilson                |   |
| | React Instructor | [star] 4.7       |   |
| | 14 Courses                 [View]    |   |
| +--------------------------------------+   |
| [1] [2] [3] [>]                         |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Toolbar | Search/filter/view toggle | Search, expertise/rating filters, grid/list controls | Changes presentation |
| List | Instructor row | avatar_url, display_name, headline, rating (tổng hợp), course count (tổng hợp), View profile | Opens detail |
| Pagination | Page controls | Pages and next | Preserve view/filter |

## States

- Grid/list toggle retains current filters and page.
- No result: clear filters action.
- Mobile list keeps View action visible per row.
