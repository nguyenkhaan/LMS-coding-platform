# INTERVIEW01 Interview Report

- **Tên màn hình:** AI Interview Report
- **Đường dẫn:** `VERIFY: /interview/report/:sessionId`
- **Asset:** [INTERVIEW01InterviewReport.svg](../../screen/interview/INTERVIEW01InterviewReport.svg)
- **Viewport nguồn:** `1920x2013`

## Wireframe

~~~text
DESKTOP 1920x2013
+==================================================================================================+
| [Dreams LMS] Home Courses Classroom AI Interview                         [profile] [Sign out]|
+==================================================================================================+
|                                   INTERVIEW REPORT                                               |
|                                Home - AI Interview Report                                        |
+==================================================================================================+
| [Interview: Frontend Developer] [Completed] [Download report]                                   |
| +-------------------------------+  +-------------------------------------------------------+ |
| | Overall score                 |  | Skill assessment                                      | |
| |          78 / 100             |  | JavaScript       [===========-----] 78%              | |
| | [radar chart]                 |  | React            [========--------] 64%              | |
| | Communication 82%             |  | Problem solving  [==========------] 72%              | |
| +-------------------------------+  +-------------------------------------------------------+ |
| +-------------------------------+  +-------------------------------------------------------+ |
| | Strengths                     |  | Areas to improve                                      | |
| | [check] Clear explanation     |  | [!] State management depth                            | |
| | [check] Good debugging flow  |  | [!] Testing edge cases                                | |
| +-------------------------------+  +-------------------------------------------------------+ |
| Interview feedback                                                                       |
| Question | Topic | Score | Feedback                                                   |
| Q1        | JS    | 8/10  | Clear answer and example                                  |
| Q2        | React | 6/10  | Explain trade-offs further                                |
+==================================================================================================+
| Footer: Dreams LMS | For Instructor | For Student | Newsletter | Copyright                |
+==================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [hamburger] [Dreams LMS]      [profile]  |
+--------------------------------------------+
|             INTERVIEW REPORT             |
|          Home - Interview Report          |
+--------------------------------------------+
| Frontend Developer       [Completed]     |
| [Download report]                         |
| +--------------------------------------+   |
| | Overall score: 78 / 100             |   |
| | [radar chart]                       |   |
| | Communication 82%                   |   |
| +--------------------------------------+   |
| Skill assessment                       |
| JavaScript [===========-----] 78%      |
| React      [========--------] 64%      |
| Problem solving [==========--] 72%     |
| Strengths                               |
| [check] Clear explanation              |
| [check] Good debugging flow            |
| Areas to improve                       |
| [!] State management depth             |
| [!] Testing edge cases                 |
| Interview feedback: Q1 8/10, Q2 6/10  |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Header | Report identity | Interview type, Completed status, Download | Download report |
| Score | Overall/radar | 78/100 and communication score | Read-only result |
| Skills | Skill bars | JavaScript, React, problem solving percentages | Visual comparison |
| Feedback | Strengths/improvements | Check and warning lists | Actionable summary |
| Detail | Question table | Question, topic, score, feedback | Review answer feedback |

## States

- Completed report: all scores and feedback visible.
- Report generating: show progress instead of final score.
- Download error: retain report and show retry.
