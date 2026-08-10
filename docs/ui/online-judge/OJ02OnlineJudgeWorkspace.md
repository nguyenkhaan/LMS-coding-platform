# OJ02 Online Judge Workspace

- **Tên màn hình:** Online Judge Workspace
- **Đường dẫn:** `VERIFY: /online-judge/problems/:problemId`
- **Asset:** [OJ02OnlineJudgeWorkspace.svg](../../screen/online-judge/OJ02OnlineJudgeWorkspace.svg)
- **Viewport nguồn:** `1920x1200`

## Wireframe

~~~text
DESKTOP 1920x1200
+================================================================================================+
| [Dreams LMS] Online Judge                         [Run] [Submit] [timer 00:24:18] [profile]   |
+================================================================================================+
| +------------------------------------------------------+  +--------------------------------+ |
| | PROBLEM: Two Sum                                     |  | CODE EDITOR                    | |
| | Given an array of integers, return indices of the    |  | [Python v] [format] [settings] | |
| | two numbers that add up to a target.                 |  | 1  def two_sum(nums, target):  | |
| |                                                      |  | 2      # write solution        | |
| | Examples:                                            |  | 3      return []               | |
| | Input: nums=[2,7,11,15], target=9                    |  |                                | |
| | Output: [0,1]                                        |  |                                | |
| | Constraints: 2 <= nums.length <= 10^4               |  |                                | |
| +------------------------------------------------------+  +--------------------------------+ |
| | TEST CASES                                            |  | CONSOLE                        | |
| | [1] Custom input [Run code]                          |  | > Ready                       | |
| | Input [2,7,11,15]  Target [9]                        |  | Output:                       | |
| | Output: [0,1]                                        |  | Test cases passed: 0/3        | |
| +------------------------------------------------------+  +--------------------------------+ |
+================================================================================================+
~~~

~~~text
MOBILE 390x844
+-------------------------------------------+
| [< Problems] Two Sum      [Run] [Submit] |
+-------------------------------------------+
| [Problem] [Code] [Console]              |
| Problem: Two Sum                         |
| Given an array, return indices of two    |
| numbers that add up to target.            |
| Examples: [2,7,11,15], target 9 -> [0,1] |
| [Code]                                   |
| [Python v]                               |
| 1 def two_sum(nums, target):             |
| 2     # write solution                   |
| 3     return []                          |
| +--------------------------------------+  |
| | CONSOLE: Ready                      |  |
| | Test cases passed: 0/3              |  |
| +--------------------------------------+  |
| [Custom input] [Run code]               |
+-------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Header | Judge actions | Run, Submit, timer, profile | Run/submit state |
| Problem pane | Statement | Description, examples, constraints | Scroll independently |
| Editor | Code editor | Language selector, line numbers, code area, format/settings | Editable, dirty state |
| Console | Test output | Custom input, output, passed count | Shows run result |

## States

- Running: Run disabled, console shows execution state.
- Compile error: console shows error and line reference.
- Accepted: Submit result shows Accepted and score.
- Wrong answer/time limit: result badge and test summary shown.
- Mobile: panes become Problem, Code, Console tabs.
