# PROG01 Problem Reading

- **Tên màn hình:** Problem Reading
- **Đường dẫn:** `VERIFY: /programming/:problemId/reading`
- **Asset:** [PROG01ProblemReading.svg](../../screen/programming/PROG01ProblemReading.svg)
- **Viewport nguồn:** `1912x4304`
- **Shared shell:** Tuân theo [LEARNING00 Unified Lesson Workspace](../class/LEARNING00UnifiedLessonWorkspace.md); rail trái trong asset nguồn được chuẩn hóa thành rail phải.

## Wireframe

~~~text
DESKTOP 1912x4304
+================================================================================================+
| [Dreams LMS] Courses Classroom Programming                         [progress 40%] [profile]   |
+================================================================================================+
| +----------------------+  +---------------------------------------------------------------+ |
| | COURSE CONTENT       |  | Variables and Data Types                                      | |
| | [>] Introduction     |  | [lesson progress]                                          | |
| | [>] Variables        |  | [diagram / lesson image]                                    | |
| | [ ] Data types       |  | Variables store values. A type defines how a value is used.| |
| | [ ] Operators        |  | ```python                                                  | |
| | [ ] Practice         |  | name = "Ada"                                               | |
| |                      |  | age = 24                                                   | |
| | Progress [====----]  |  | ```                                                        | |
| +----------------------+  | [Tip] Use descriptive variable names.                      | |
|                           | [Example] [Try it] [Exercise result: Passed]               | |
|                           | [< Previous lesson]                   [Mark complete >]   | |
|                           +---------------------------------------------------------------+ |
+================================================================================================+
~~~

~~~text
MOBILE 390x844
+---------------------------------------------+
| [menu] Variables and Data Types [40%]    |
+---------------------------------------------+
| [Course content]                         |
| [>] Introduction  [>] Variables          |
| [ ] Data types     [ ] Operators         |
| +--------------------------------------+   |
| | Variables and Data Types             |   |
| | [lesson image/diagram]               |   |
| | Variables store values. A type        |   |
| | defines how a value is used.          |   |
| | ```python                            |   |
| | name = "Ada"                         |   |
| | age = 24                             |   |
| | ```                                  |   |
| | [Tip] Use descriptive names.          |   |
| | [Try it] [Exercise result: Passed]   |   |
| | [< Previous] [Mark complete >]        |   |
| +--------------------------------------+   |
+---------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Left rail | Course content | Lesson tree and progress | Select lesson |
| Lesson | Reading content | Diagram, explanation, code block, tip/example | Scroll reading |
| Lesson actions | Exercise/completion | Try it, result, previous, mark complete | Updates progress |

## States

- Current lesson highlighted in tree.
- Exercise passed: result badge and completion action.
- Locked lesson: disabled tree row until prerequisite complete.
- Mobile: course tree collapses above lesson content.
