# QUIZ01 Quiz Attempt

- **Tên màn hình:** Quiz Attempt
- **Đường dẫn:** `VERIFY: /quiz/:quizId/attempt`
- **Asset:** [QUIZ01QuizAttempt.svg](../../screen/quiz/QUIZ01QuizAttempt.svg)
- **Viewport nguồn:** `1912x2922`
- **Shared shell:** Tuân theo [LEARNING00 Unified Lesson Workspace](../class/LEARNING00UnifiedLessonWorkspace.md); question navigator nằm trong content body.

## Wireframe

~~~text
DESKTOP 1912x2922
+================================================================================================+
| [Dreams LMS] Quiz: Control Flow                 Question 1 of 10       [timer 14:32] [Exit]    |
+================================================================================================+
| +------------------------------------------------------+  +-------------------------------+ |
| | What does the following program print?               |  | QUESTION NAVIGATION           | |
| |                                                      |  | [1] [2] [3] [4] [5]          | |
| | ```python                                             |  | [6] [7] [8] [9] [10]         | |
| | for i in range(3):                                   |  | [1 active] [2 answered]      | |
| |     print(i)                                         |  | Legend: answered/current     | |
| | ```                                                  |  +-------------------------------+ |
| | ( ) 0 1 2                                           |                                |
| | ( ) 1 2 3                                           |                                |
| | ( ) 0 1 2 3                                         |                                |
| | ( ) Error                                            |                                |
| | [Previous]                                  [Next]   |                                |
| +------------------------------------------------------+                                |
| [Save and exit]                                                       [Submit quiz]       |
+================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| Quiz: Control Flow  Q1/10  [14:32] [Exit]|
+--------------------------------------------+
| [1] [2] [3] [4] [5] [6] [7] [8] [9] [10] |
| What does the program print?              |
| ```python                                 |
| for i in range(3): print(i)               |
| ```                                       |
| ( ) 0 1 2                                 |
| ( ) 1 2 3                                 |
| ( ) 0 1 2 3                               |
| ( ) Error                                 |
| [Previous]             [Next]              |
| [Save and exit]       [Submit quiz]       |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Header | Quiz status | Quiz title, question index, timer, exit | Timer persists attempt |
| Question | Prompt/code | Question statement and code block | Read-only |
| Answers | Radio options | One choice per option | Selects answer |
| Navigation | Question map/actions | Number grid, Previous, Next, Save/Submit | Jumps/saves/submits |

## States

- Unanswered: current question highlighted, no selected radio.
- Answered: question number marked answered.
- Timer warning: accent timer when near limit.
- Submit confirmation: show answered/unanswered count before final submit.

## Business rules

- The Teacher-defined `passing_score` and `max_attempts` control completion and retry availability.
- A submitted attempt increments attempt count; a student cannot submit after the configured limit.
- Passing the quiz marks its lesson content progress completed; failing preserves the attempt history.
