# TC13 Coding Problem Management

- **Tên màn hình:** Coding Problem Management
- **Đường dẫn:** `VERIFY: /teacher/coding-problems`
- **Asset:** [TC13TeacherCodingProblemManagement.svg](../../screen/teacher/TC13TeacherCodingProblemManagement.svg)
- **Viewport nguồn:** `1920x1200`
- **Lưu ý:** Asset này dùng shell quản trị coding riêng, không dùng banner/sidebar Teacher Dashboard ở các màn TC01-TC12.

## Wireframe

~~~text
DESKTOP 1920x1200
+====================================================================================================+
| [Dreams LMS]  Coding Platform                         [search problems] [bell] [Teacher profile]|
+====================================================================================================+
| CODING PROBLEM MANAGEMENT                                      [Create problem]                 |
| [All difficulty v] [All status v] [Search title______________] [Filter]                        |
+----------------------------------------------------------------------------------------------------+
| Problem ID | Title                          | Difficulty | Test cases | Status | Updated | Action|
| OJ-001     | Two Sum                        | Easy       | 12          | Active | 16 Jan  | [Edit]|
| OJ-002     | Longest Substring              | Medium     | 18          | Draft  | 18 Jan  | [Edit]|
| OJ-003     | Sliding Window Maximum          | Hard       | 24          | Active | 22 Jan  | [Edit]|
|--------------------------------------------------------------------------------------------------|
| [ ] Select all   [Bulk publish] [Bulk archive]                         Page 1 [1] [2] [>]       |
+====================================================================================================+
~~~

~~~text
MOBILE 390x844
+---------------------------------------------+
| [hamburger] [Dreams LMS]     [profile]   |
+---------------------------------------------+
| CODING PROBLEM MANAGEMENT                |
| [Create problem]                         |
| [Search title____________]               |
| [Difficulty v] [Status v] [Filter]        |
| +--------------------------------------+   |
| OJ-001 | Two Sum                       |   |
| Easy | 12 tests | Active               |   |
| Updated 16 Jan             [Edit]       |   |
| +--------------------------------------+   |
| OJ-002 | Longest Substring             |   |
| Medium | 18 tests | Draft             |   |
| Updated 18 Jan             [Edit]       |   |
| +--------------------------------------+   |
| [Bulk publish] [Bulk archive]           |   |
| Page 1 [1] [2] [>]                      |   |
+---------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Header | Coding admin shell | Logo, search, notification, teacher profile | Separate from LMS teacher shell |
| Toolbar | Problem filters | Create, title search, difficulty/status dropdowns | Filters table |
| Table | Problem rows | ID, title, difficulty, test case count, status, updated date, Edit | Opens problem editor |
| Bulk actions | Selection/actions | Select all, bulk publish/archive | Confirmation before mutation |
| Pagination | Page controls | Page indicator and next | Preserve filters |

## States

- Draft row: Draft badge and publish action available in editor.
- Empty search: no-result message with clear filters action.
- Bulk action: disabled until at least one row selected.
- `VERIFY`: exact permission model and problem editor route are not present in the asset.
