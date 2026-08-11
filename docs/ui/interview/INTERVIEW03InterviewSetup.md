# INTERVIEW03 AI Interview Setup

- **Tên màn hình:** AI Interview Setup
- **Đường dẫn:** `VERIFY: /interview/setup`
- **Asset:** New screen derived from INTERVIEW02 and confirmed interview rules.

## Wireframe

~~~text
DESKTOP 1200x900
+========================================================================================+
| [Dreams LMS] Home Courses Classroom AI Interview                         [profile]   |
+========================================================================================+
|                                  AI INTERVIEW SETUP                                    |
| +----------------------------------------+  +----------------------------------------+ |
| | Choose topic                           |  | Session rules                          | |
| | ( ) JavaScript                         |  | Maximum questions: 12                 | |
| | ( ) React                              |  | AI may finish early when sufficient   | |
| | ( ) Algorithms                         |  | Text chat is saved; media is not      | |
| | Level [Junior v]                       |  | [microphone] [camera] permission      | |
| | [Start interview]                      |  | [Continue without media]              | |
| +----------------------------------------+  +----------------------------------------+ |
+========================================================================================+
~~~

~~~text
MOBILE 390x844
+------------------------------------------+
| [Dreams LMS]                 [profile]  |
+------------------------------------------+
|          AI INTERVIEW SETUP             |
| Topic                                    |
| ( ) JavaScript                           |
| ( ) React                                |
| ( ) Algorithms                           |
| Level [Junior v]                         |
| Maximum questions: 12                   |
| AI may finish early.                    |
| Chat is saved; media is not saved.      |
| [Allow microphone] [Allow camera]       |
| [Start interview]                       |
+------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Setup | Topic/level selector | Topic and Intern/Fresher/Junior/Senior | Required before start |
| Rules | Session policy | Max 12, early finish, storage notice | Read-only policy |
| Permission | Media permissions | Microphone/camera permission; no recording persistence | Optional fallback |
| Action | Start interview | Creates active session and opens chat | Requires valid setup |

## States

- Permission denied: text-only session remains available.
- Existing active session: Resume instead of Start.
- Start failure: preserve selections and show retry.
