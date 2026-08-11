# QUIZ02 Quiz Preview

- **Tên màn hình:** Quiz Preview
- **Đường dẫn:** `VERIFY: /quiz/:quizId/preview`
- **Asset:** [QUIZ02QuizPreview.svg](../../screen/quiz/QUIZ02QuizPreview.svg)
- **Viewport nguồn:** `1912x3202`
- **Shared shell:** Tuân theo [LEARNING00 Unified Lesson Workspace](../class/LEARNING00UnifiedLessonWorkspace.md); chỉ Quiz Preview body thay đổi.

## Wireframe

~~~text
DESKTOP 1912x3202
+================================================================================================+
| [Dreams LMS] Courses Classroom Quiz                                  [progress] [profile]     |
+================================================================================================+
| +----------------------+  +---------------------------------------------------------------+ |
| | COURSE CONTENT       |  | Quiz: Control Flow                                            | |
| | [>] Introduction     |  | 10 questions | 20 minutes | Passing score 70%                  | |
| | [>] Variables        |  | [Start quiz]                                               | |
| | [>] Control Flow     |  | Question types: multiple choice, code reading                | |
| | [ ] Functions        |  | Instructions: answer every question before submitting.       | |
| | [ ] Practice         |  | +---------------------------------------------------------+ | |
| +----------------------+  | | Q1. What does this program print?                      | | |
|                           | | ( ) 0 1 2  ( ) 1 2 3  ( ) Error                      | | |
|                           | +---------------------------------------------------------+ | |
|                           | [Back to lesson]                         [Start quiz]   | |
|                           +---------------------------------------------------------------+ |
+================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [menu] Quiz: Control Flow       [profile]|
+--------------------------------------------+
| [Course content] [>] Control Flow        |
| Quiz: Control Flow                        |
| 10 questions | 20 minutes                |
| Passing score 70%                        |
| Question types: multiple choice, code    |
| Instructions: answer every question.     |
| +--------------------------------------+   |
| | Q1. What does the program print?    |   |
| | ( ) 0 1 2  ( ) 1 2 3  ( ) Error     |   |
| +--------------------------------------+   |
| [Back to lesson] [Start quiz]            |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Left rail | Course content | Current quiz in lesson tree | Select lesson |
| Summary | Quiz metadata | Question count, time limit, passing score, types | Read-only |
| Preview | Question sample | Sample question and answer options | Read-only |
| Action | Start quiz | Starts timed attempt | Creates attempt |

## States

- Not started: Start quiz enabled.
- Existing attempt: action changes to Resume quiz.
- Completed: preview shows result and Review answers.
