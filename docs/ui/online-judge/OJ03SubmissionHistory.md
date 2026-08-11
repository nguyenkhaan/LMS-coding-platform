# OJ03 Submission History

- **Tên màn hình:** Submission History
- **Đường dẫn:** `VERIFY: /online-judge/submissions`
- **Asset:** [OJ03SubmissionHistory.svg](../../screen/online-judge/OJ03SubmissionHistory.svg)
- **Viewport nguồn:** `1920x1200`

## Wireframe

~~~text
DESKTOP 1920x1200
+=================================================================================================+
| [Dreams LMS] Online Judge                         Problems | Submissions       [profile]       |
+=================================================================================================+
|                                  SUBMISSION HISTORY                                             |
| [Problem v] [Language v] [Status v] [Date range v]                                             |
| +------------------------------------------------------------------------------------------+ |
| | Submitted             | Problem              | Language | Result       | Runtime | Action  | |
| | Today, 10:32 AM       | Two Sum              | Python   | Accepted     | 42 ms   | [View]  | |
| | Yesterday, 04:12 PM  | Longest Substring    | Java     | Wrong Answer | 88 ms   | [View]  | |
| | 16 Jan, 11:15 AM     | Sliding Window      | Python   | Time Limit   | 1000 ms | [View]  | |
| +------------------------------------------------------------------------------------------+ |
|                                      [1] [2] [>]                                             |
+=================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [< Problems] Submission History [profile]|
+--------------------------------------------+
| [Problem v] [Language v]                 |
| [Status v] [Date range v]                |
| +--------------------------------------+   |
| | Today 10:32 | Two Sum               |   |
| | Python | Accepted | 42 ms  [View]    |   |
| +--------------------------------------+   |
| | Yesterday | Longest Substring       |   |
| | Java | Wrong Answer | 88 ms [View]  |   |
| +--------------------------------------+   |
| | 16 Jan | Sliding Window             |   |
| | Python | Time Limit | 1000ms [View] |   |
| +--------------------------------------+   |
| [1] [2] [>]                             |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Toolbar | Submission filters | Problem, language, status, date range | Filters history |
| Table | Submission rows | Time, problem, language, result, runtime, View | Opens code/result |
| Pagination | Page controls | Page numbers and next | Preserve filters |

## States

- Result badges distinguish Accepted, Wrong Answer, Time Limit.
- No submissions: empty state with link to Problem List.
- View opens immutable source code and test result.
