# PROG02 Problem Preview

- **Tên màn hình:** Problem Preview
- **Đường dẫn:** `VERIFY: /programming/:problemId/preview`
- **Asset:** [PROG02ProblemPreview.svg](../../screen/programming/PROG02ProblemPreview.svg)
- **Viewport nguồn:** `1912x3089`

## Wireframe

~~~text
DESKTOP 1912x3089
+================================================================================================+
| [Dreams LMS] Courses Classroom Programming                         [progress 40%] [profile]   |
+================================================================================================+
| +----------------------+  +---------------------------------------------------------------+ |
| | COURSE CONTENT       |  | Sum of Two Numbers                                           | |
| | [>] Introduction     |  | Problem statement: Given two integers, return their sum.      | |
| | [>] Variables        |  | Input: two integers a, b                                    | |
| | [>] Data types       |  | Output: a + b                                               | |
| | [>] Operators        |  | Examples: 2 3 -> 5                                         | |
| | [>] Sum exercise     |  | Constraints: -10^9 <= a,b <= 10^9                         | |
| +----------------------+  | [Open in Online Judge]                                      | |
|                           | Starter code                                               | |
|                           | +---------------------------------------------------------+ | |
|                           | | def solve(a, b):                                       | | |
|                           | |     return a + b                                       | | |
|                           | +---------------------------------------------------------+ | |
|                           | [Mark complete]                          [Next lesson >] | |
|                           +---------------------------------------------------------------+ |
+================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [menu] Sum of Two Numbers       [40%]    |
+--------------------------------------------+
| [Course content] [>] Sum exercise        |
| Problem statement                         |
| Given two integers, return their sum.    |
| Input: a, b   Output: a + b              |
| Example: 2 3 -> 5                        |
| Constraints: -10^9 <= a,b <= 10^9       |
| [Open in Online Judge]                   |
| Starter code                             |
| +--------------------------------------+   |
| | def solve(a, b):                    |   |
| |     return a + b                    |   |
| +--------------------------------------+   |
| [Mark complete] [Next lesson >]         |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Left rail | Lesson tree | Course modules and current exercise | Select content |
| Problem | Statement | Input/output, examples, constraints | Read-only |
| Code | Starter code block | Language-specific starter function | Copy/open judge |
| Actions | Judge/completion | Open Online Judge, mark complete, next | Links to practice |

## States

- Not started: Mark complete available after preview.
- Completed: completion marker and next lesson emphasis.
- Mobile: lesson tree condensed to current breadcrumb.
