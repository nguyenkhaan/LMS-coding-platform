# LEARNING00 Unified Lesson Workspace

- **Phạm vi:** Reading, Video, Quiz và Programming Lesson Content.
- **Mục tiêu:** Giữ nguyên cấu trúc điều hướng và tiến trình khi người học chuyển loại nội dung.
- **Nguồn chuẩn:** Wireframe này ghi đè bố cục shell khác nhau trong `CLASS01`, `PROG01-PROG03` và `QUIZ01-QUIZ02`; nội dung đặc thù của từng màn vẫn lấy từ wireframe tương ứng.

## Desktop wireframe

~~~text
+================================================================================================+
| DATA STRUCTURES & ALGORITHMS                                      [40% complete] [Main action] |
| Module 2 · Lesson 3 of 5                                                                 |
| Two-pointer patterns                                                     [Video/Completed] |
+--------------------------------------------------------------------------+---------------------+
|                                                                          | COURSE CONTENT      |
| +----------------------------------------------------------------------+ | Progress 40%        |
| |                                                                      | | [✓] Hash tables    |
| |                       LESSON CONTENT BODY                            | | [✓] Collisions     |
| |                                                                      | | [>] Two pointers   |
| | Reading / Video / Quiz / Problem-specific content only               | | [🔒] Quiz          |
| |                                                                      | | [🔒] Problem       |
| +----------------------------------------------------------------------+ |                     |
| [← Previous]                    Lesson 3 of 5                  [Next →] | Sticky sidebar      |
+--------------------------------------------------------------------------+---------------------+
~~~

## Mobile wireframe

~~~text
+----------------------------------------------+
| DATA STRUCTURES & ALGORITHMS                 |
| Module 2 · Lesson 3 of 5                     |
| Two-pointer patterns [Video]                 |
| [40% complete] [Main action]                 |
+----------------------------------------------+
| [Course content                         40%] | <- sticky toggle
+----------------------------------------------+
|                                              |
|          LESSON CONTENT BODY                 |
|                                              |
+----------------------------------------------+
| Lesson 3 of 5                                |
| [← Previous]                     [Next →]    |
+----------------------------------------------+

COURSE CONTENT DRAWER
+----------------------------------------------+
| [Close]                                      |
| Progress 40%                                 |
| [✓] Hash tables                              |
| [✓] Collision strategies                     |
| [>] Two-pointer patterns                     |
| [🔒] Sliding window lab                      |
+----------------------------------------------+
~~~

## Shell invariants

| Vùng | Quy tắc cố định |
| --- | --- |
| Course identity | Luôn hiển thị tên khóa học, module và vị trí lesson |
| Lesson header | Title, content type/completed badge, overall progress và main action giữ cùng vị trí |
| Content body | Chỉ vùng này thay đổi theo Reading, Video, Quiz hoặc Problem |
| Course content | Desktop dùng rail phải sticky; mobile dùng sticky toggle mở drawer |
| Lesson navigation | Previous, lesson index và Next nằm sau content body trên mọi loại nội dung |
| Progress | Dùng cùng progress store; chuyển route không reset trạng thái |
| Locked content | Rail và Next cùng disabled cho tới khi prerequisite hoàn thành |

## Content variants

- **Reading:** Markdown, code block, callout; main action là `Mark reading complete`.
- **Video:** Player, watched percent, Notes/Resources/Assignment; main action là `Mark video watched`.
- **Quiz preview:** Rules và sample question; main action là `Start quiz`.
- **Quiz attempt:** Question/timer/navigation nằm trong body; hoàn thành theo passing score.
- **Programming:** Reading/Preview/Video là tab nội bộ trong body; main action phản ánh completion rule.

## UX acceptance criteria

- Chuyển giữa mọi Lesson Content không làm Course Content sidebar, course header hoặc lesson pager đổi vị trí.
- Chiều rộng Reading không thu hẹp riêng so với Video/Quiz/Problem.
- Trên mobile, người dùng mở Course Content từ bất kỳ vị trí scroll nào mà không cần xuống cuối bài.
- Focus, `aria-expanded`, disabled/locked state và progress label phải truy cập được bằng bàn phím và screen reader.
