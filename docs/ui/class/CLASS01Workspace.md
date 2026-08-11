# CLASS01 Classroom Workspace

- **Tên màn hình:** Workspace
- **Đường dẫn:** `VERIFY: /classroom/workspace`
- **Asset:** [CLASS01Workspace.svg](../../screen/class/CLASS01Workspace.svg)
- **Viewport nguồn:** `1939x2181`
- **Shared shell:** Tuân theo [LEARNING00 Unified Lesson Workspace](LEARNING00UnifiedLessonWorkspace.md); CLASS01 chỉ định nghĩa phần Video body và cohort interaction.

## Wireframe

~~~text
DESKTOP 1939x2181
+================================================================================================+
| phone: +1 123 456 7890 | support@example.com             English | USD | [social] [Sign in]    |
+------------------------------------------------------------------------------------------------+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us      [search] [cart] [profile] |
+================================================================================================+
|                                      WORKSPACE                                                 |
|                              Classroom - Workspace                                             |
+================================================================================================+
| [Search in lesson________________________________________]                                    |
| Data Structures & Algorithms              Module 2: Lesson 3 - Two-pointer patterns            |
|                                                        [Mark lesson complete]                 |
| +------------------------------------------------------+  +-------------------------------+ |
| |                                                      |  | COURSE CONTENT  Progress 40%  | |
| |                         [PLAY]                        |  | [ ] Hash tables from scratch | |
| |                    VIDEO PLAYER                       |  | [ ] Collision strategies     | |
| |                                                      |  | [>] Two-pointer patterns     | |
| +------------------------------------------------------+  | [ ] Sliding window lab        | |
| | Two-pointer patterns       12:35                    |  | [ ] Judge problem set B      | |
| | [< Previous lesson]                       [Next >]  |  +-------------------------------+ |
| +------------------------------------------------------+  | COHORT CHAT                    | |
| | [Notes] [Resources] [Assignment]                    |  | Ronald: Welcome to module 2 | |
| | Two-pointer patterns                               |  | [Type a message________] [send]| |
| | Use two indexes to scan the ordered collection.   |  +-------------------------------+ |
| +------------------------------------------------------+                                |
+================================================================================================+
| Footer: Dreams LMS | For Instructor | For Student | Newsletter | Copyright                |
+================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [hamburger] [Dreams LMS]      [search]   |
+--------------------------------------------+
|               WORKSPACE                 |
|          Classroom - Workspace           |
+--------------------------------------------+
| [Search in lesson____________]           |
| Data Structures & Algorithms             |
| Module 2: Lesson 3                       |
| [Mark lesson complete]                   |
| +--------------------------------------+   |
| |              [PLAY]                 |   |
| |         VIDEO PLAYER                |   |
| +--------------------------------------+   |
| Two-pointer patterns  12:35             |
| [< Previous lesson] [Next lesson >]     |
| [Notes] [Resources] [Assignment]       |
| Use two indexes to scan the collection. |
| +--------------------------------------+   |
| | COURSE CONTENT  Progress 40%         |   |
| | [ ] Hash tables from scratch         |   |
| | [ ] Collision strategies             |   |
| | [>] Two-pointer patterns             |   |
| | [ ] Sliding window lab               |   |
| +--------------------------------------+   |
| | COHORT CHAT                          |   |
| | Ronald: Welcome to module 2          |   |
| | [Type a message________] [send]      |   |
| +--------------------------------------+   |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Header/hero | Classroom shell | Utility bar, nav, Workspace hero, lesson search | Mobile collapse |
| Lesson | Video/content | Player, title, duration, previous/next, notes/resources/assignment | Tab and completion flow |
| Right rail | Course content | Progress and ordered lessons | Current lesson active |
| Right rail | Cohort chat | Messages, input, send | Sends lesson-group message |

## States

- Lesson incomplete: Mark lesson complete visible.
- Lesson complete: action becomes Completed.
- Chat send failure: preserve typed message and show retry.
- Mobile: right rail follows lesson content.
