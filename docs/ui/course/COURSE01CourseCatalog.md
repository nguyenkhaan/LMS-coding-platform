# COURSE01 Course Catalog

- **Tên màn hình:** Course Catalog
- **Đường dẫn:** `VERIFY: /courses`
- **Asset:** [COURSE01CourseCatalog.svg](../../screen/course/COURSE01CourseCatalog.svg)
- **Viewport nguồn:** `1620x2492`
- **Bản raster đối chiếu:** [COURSE01CourseCatalog.png](../../screen/course/COURSE01CourseCatalog.png)

## Wireframe

~~~text
DESKTOP 1620x2492
+====================================================================================================+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us     [search] [cart] [Sign in] |
+====================================================================================================+
|                                  COURSES                                                       |
|                                Home - Courses                                                  |
+====================================================================================================+
| [Search courses________________] [Category v] [Level v] [Sort by v]                            |
| +------------------+  +----------------------------------+  +--------------------------------+ |
| | FILTERS          |  | [course thumbnail]                |  | [course thumbnail]              | |
| | Categories       |  | [heart] Python Foundations        |  | [heart] Production React        | |
| | [ ] Programming  |  | Instructor: Ronald Richard        |  | Instructor: Jenny Wilson        | |
| | [ ] Web           |  | [star] 4.8   $49.00              |  | [star] 4.7   $59.00              | |
| | Level            |  | [View course]                      |  | [View course]                    | |
| | [ ] Beginner     |  +----------------------------------+  +--------------------------------+ |
| | [ ] Intermediate |  | [course thumbnail]                |  | [course thumbnail]              | |
| | [ ] Advanced     |  | Data Structures & Algorithms     |  | Coding Interview Preparation    | |
| | Price            |  | Instructor: Edythe Andrew         |  | Instructor: Edythe Andrew        | |
| | [ ] Free         |  | [star] 4.9   $79.00              |  | [star] 4.6   $69.00              | |
| | [ ] Paid         |  | [View course]                     |  | [View course]                   | |
| +------------------+  +----------------------------------+  +--------------------------------+ |
|                                     [1] [2] [3] [>]                                         |
+====================================================================================================+
| Footer: Dreams LMS | For Instructor | For Student | Newsletter | Copyright                |
+====================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [hamburger] [Dreams LMS]      [search]   |
+--------------------------------------------+
|                 COURSES                  |
|               Home - Courses              |
+--------------------------------------------+
| [Search courses____________]              |
| [Category v] [Level v] [Sort v]           |
| [Filters]                                 |
| +--------------------------------------+   |
| | [course thumbnail]          [heart] |   |
| | Python Foundations                  |   |
| | Instructor: Ronald Richard          |   |
| | [star] 4.8                 $49.00   |   |
| | [View course]                       |   |
| +--------------------------------------+   |
| +--------------------------------------+   |
| | [course thumbnail]          [heart] |   |
| | Production React                   |   |
| | Instructor: Jenny Wilson            |   |
| | [star] 4.7                 $59.00   |   |
| | [View course]                       |   |
| +--------------------------------------+   |
| [1] [2] [3] [>]                         |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Toolbar | Search/filter/sort | Search, category, level, sort | Re-query catalog |
| Sidebar | Filters | Category, level, price checkboxes | Filter cards |
| Grid | Course card | Thumbnail, favorite, title, instructor, rating, price, View | Opens detail |
| Pagination | Page controls | Active page and next | Preserves filters |

## States

- Loading: preserve grid geometry with card skeletons.
- Favorite: heart toggles without navigating.
- Empty results: use `Course03EmptyState` layout.

## Business rules

- A course is listed for public purchase only when its status is `PUBLISHED` and its teacher application is approved.
- A student with an existing enrollment sees `Continue learning` instead of `View course`/purchase CTA.
- Favorite toggles persist in `course_favorite`; filtering never removes the favorite state.
