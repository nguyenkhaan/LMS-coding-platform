# OJ01 Problem List

- **Tên màn hình:** Problem List
- **Đường dẫn:** `VERIFY: /online-judge/problems`
- **Asset:** [OJ01ProblemList.svg](../../screen/online-judge/OJ01ProblemList.svg)
- **Viewport nguồn:** `1920x1715`

## Wireframe

~~~text
DESKTOP 1920x1715
+==================================================================================================+
| [Dreams LMS] Home Courses Classroom Online Judge              [search] [bell] [profile]        |
+==================================================================================================+
|                                      PROBLEM LIST                                               |
|                              Practice coding problems and challenges                            |
+==================================================================================================+
| [Search problem________________] [Difficulty v] [Topic v] [Status v] [Sort v]                  |
| +------------------------------------------------------------------------------------------+ |
| | ID       | Problem title                    | Difficulty | Acceptance | Status | Action   | |
| | OJ-001   | Two Sum                          | Easy       | 82%        | Solved | [Solve]   | |
| | OJ-002   | Longest Substring Without Repeat  | Medium     | 64%        | Open   | [Solve]   | |
| | OJ-003   | Sliding Window Maximum             | Hard       | 41%        | Open   | [Solve]   | |
| | OJ-004   | Merge Intervals                   | Medium     | 58%        | Solved | [Review]  | |
| +------------------------------------------------------------------------------------------+ |
| [1] [2] [3] [>]                                                                              |
+==================================================================================================+
| Footer: Dreams LMS | For Student | Practice | Newsletter | Copyright                       |
+==================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [hamburger] [Dreams LMS]      [profile]  |
+--------------------------------------------+
|              PROBLEM LIST                |
|         Practice coding problems          |
+--------------------------------------------+
| [Search problem____________]              |
| [Difficulty v] [Topic v] [Filter]         |
| +--------------------------------------+   |
| | OJ-001  Two Sum                     |   |
| | Easy | Acceptance 82% | Solved      |   |
| | [Review]                            |   |
| +--------------------------------------+   |
| | OJ-002  Longest Substring           |   |
| | Medium | Acceptance 64% | Open      |   |
| | [Solve]                             |   |
| +--------------------------------------+   |
| | OJ-003  Sliding Window Maximum      |   |
| | Hard | Acceptance 41% | Open        |   |
| | [Solve]                             |   |
| +--------------------------------------+   |
| [1] [2] [3] [>]                         |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Toolbar | Problem filters | Search, difficulty, topic, status, sort | Filters list |
| Table | Problem rows | ID, title, difficulty, acceptance, solved/open state, action | Solve or review |
| Pagination | Page controls | Active page and next | Preserve filters |

## States

- Solved row: status `Solved`, action `Review`.
- Open row: status `Open`, action `Solve`.
- Empty filters: retain toolbar and show no problems message.
