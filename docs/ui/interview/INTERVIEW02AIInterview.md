# INTERVIEW02 AI Interview

- **Tên màn hình:** AI Interview
- **Đường dẫn:** `VERIFY: /interview`
- **Asset:** [INTERVIEW02AIInterview.svg](../../screen/interview/INTERVIEW02AIInterview.svg)
- **Viewport nguồn:** `1927x1710`

## Wireframe

~~~text
DESKTOP 1927x1710
+==================================================================================================+
| [Dreams LMS] Home Courses Classroom AI Interview                         [profile] [Sign out]|
+==================================================================================================+
|                                  AI MOCK INTERVIEW                                               |
|                                Home - AI Interview                                              |
+==================================================================================================+
| +------------------------------------------------------+  +-------------------------------+ |
| | Interview conversation                               |  | INTERVIEW PROGRESS            | |
| | AI: Welcome. Tell me about your experience.          |  | [1] Introduction       [done] | |
| | You: I have worked with React and TypeScript.        |  | [2] Technical questions [now]  | |
| | AI: How would you optimize a slow React page?        |  | [3] Behavioral          [ ]    | |
| | [AI is listening...]                                 |  | [4] Candidate questions [ ]    | |
| | [Type your answer________________________] [send]    |  | Time remaining 18:42           | |
| +------------------------------------------------------+  | [End interview]                | |
| [microphone] [camera] [speaker] [Pause interview]    |  +-------------------------------+ |
+==================================================================================================+
| Footer: Dreams LMS | For Instructor | For Student | Newsletter | Copyright                |
+==================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [hamburger] [Dreams LMS]      [profile]  |
+--------------------------------------------+
|             AI MOCK INTERVIEW            |
|           Home - AI Interview             |
+--------------------------------------------+
| [Technical questions]  Time 18:42        |
| [1] Intro [2 current] [3] Behavioral      |
| +--------------------------------------+   |
| | AI: Welcome. Tell me about your      |   |
| | experience.                          |   |
| | You: I worked with React and TS.     |   |
| | AI: How optimize a slow React page?  |   |
| | [AI is listening...]                 |   |
| +--------------------------------------+   |
| [Type your answer____________] [send]     |
| [microphone] [camera] [speaker]          |
| [Pause interview] [End interview]        |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Conversation | Chat transcript | AI and candidate messages, listening state | Scrolls to latest |
| Input | Answer composer | Text input, send, microphone/camera/speaker controls | Sends text/voice response |
| Progress | Interview steps | Four steps, current/done markers, remaining time | Updates by section |
| Session | Pause/end | Pause interview and end interview actions | Confirmation before end |

## States

- AI listening: composer shows listening/processing state.
- Sending answer: send disabled until response acknowledged.
- Paused: transcript retained, Resume replaces Pause.
- End interview: confirmation before report generation.

## Business rules

- A session has at most 12 questions and AI may finish earlier when enough data is collected.
- Text messages and the final report are persisted; microphone/camera streams are not recorded or persisted.
- Ending a session changes it to `COMPLETED` and generates one report for that session.
