# PROG03 Problem Video

- **Tên màn hình:** Problem Video Lesson
- **Đường dẫn:** `VERIFY: /programming/:problemId/video`
- **Asset:** [PROG03ProblemVideo.svg](../../screen/programming/PROG03ProblemVideo.svg)
- **Viewport nguồn:** `1912x3089`

## Wireframe

~~~text
DESKTOP 1912x3089
+================================================================================================+
| [Dreams LMS] Courses Classroom Programming                         [progress 40%] [profile]   |
+================================================================================================+
| +----------------------+  +---------------------------------------------------------------+ |
| | COURSE CONTENT       |  | For Loops Explained                                            | |
| | [>] Introduction     |  | +---------------------------------------------------------+ | |
| | [>] Variables        |  | |                  [PLAY]                                  | | |
| | [>] Data types       |  | |             VIDEO PLAYER #151E37                         | | |
| | [>] For loops        |  | +---------------------------------------------------------+ | |
| | [ ] Exercises        |  | [0:00 ---------------------------- 12:35] [volume] [fullscreen]| |
| +----------------------+  | Lesson notes: A for loop iterates over a sequence.          | |
|                           | Key points: range, iterator, loop body.                     | |
|                           | [Notes] [Resources]                                         | |
|                           | [< Previous lesson]                    [Next lesson >]     | |
|                           +---------------------------------------------------------------+ |
+================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [menu] For Loops Explained      [40%]    |
+--------------------------------------------+
| [>] Introduction [>] Variables           |
| [>] For loops     [ ] Exercises          |
| +--------------------------------------+   |
| |              [PLAY]                 |   |
| |       VIDEO PLAYER #151E37          |   |
| +--------------------------------------+   |
| [0:00 ------------------ 12:35] [full]   |
| Lesson notes: A for loop iterates over  |
| a sequence.                              |
| Key points: range, iterator, loop body. |
| [Notes] [Resources]                     |
| [< Previous lesson] [Next lesson >]     |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Left rail | Course content | Current video lesson in tree | Select lesson |
| Video | Player | Play, progress, timestamp, volume, fullscreen | Keyboard/media controls |
| Content | Notes/resources | Text notes and resource tab | Switch content |
| Actions | Lesson navigation | Previous/next lesson | Boundary disabled |

## States

- Video paused/playing: play icon and timeline update.
- Video complete: completion marker and next lesson action.
- Loading/error: player area retains ratio and shows retry.
