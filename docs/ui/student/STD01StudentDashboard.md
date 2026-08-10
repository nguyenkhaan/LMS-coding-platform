# STD01 Student Workspace

- **Tên màn hình:** Workspace / Data Structures & Algorithms
- **Đường dẫn:** `VERIFY: /classroom/workspace`
- **Asset:** [STD01StudentDashboard.svg](../../screen/student/STD01StudentDashboard.svg)
- **Viewport nguồn:** `1939x2181`
- **Lưu ý:** Tên file là `StudentDashboard`, nhưng tiêu đề render thực tế là `Workspace`; không tự đổi tên asset nguồn.

## Wireframe

~~~text
DESKTOP 1939x2181
+==========================================================================================================+
| phone: +1 123 456 7890 | support@example.com                 English | USD | [fb] [x] [in]   |
+----------------------------------------------------------------------------------------------------------+
| [Dreams LMS] | Home | Courses | Instructors | Classroom | Blog | Contact us | [search] [cart] |
|                                                                            [Sign in] [Register] |
+==========================================================================================================+
|                                      WORKSPACE                                                 |
|                              Classroom  -  Workspace                                           |
+==========================================================================================================+
| [ Search in lesson ________________________________________________ ]                         |
|                                                                                                |
| Data Structures & Algorithms                 [Mark lesson complete]                            |
| Module 2: Lesson 3 - Two-pointer patterns                                                     |
|                                                                                                |
| +------------------------------------------------------------+  +-----------------------------+ |
| |                                                            |  | COURSE CONTENT              | |
| |                                                            |  | Progress                         40% | |
| |                         [  PLAY  ]                         |  | [ ] Hash tables from scratch | |
| |                                                            |  | [ ] Collision strategies      | |
| |             VIDEO PLAYER - dark #151E37                  |  | [>] Two-pointer patterns    | |
| |                                                            |  | [ ] Sliding window lab       | |
| +------------------------------------------------------------+  | [ ] Judge problem set B      | |
| | Two-pointer patterns                                      |  +-----------------------------+ |
| | 12:35  |  Instructor: Ronald Richard        [Previous] [Next] |  +-----------------------------+ |
| +------------------------------------------------------------+  | COHORT CHAT                  | |
| | [ Notes ] [ Resources ] [ Assignment ]                     |  | Ronald: Welcome to module 2 | |
| |                                                            |  | You: Ready for the lab      | |
| | Two-pointer patterns                                      |  | [Type a message____________] | |
| | Use two indexes to scan the ordered collection from both   |  |                         [send] | |
| | sides. Move the pointer whose value cannot be part of the  |  +-----------------------------+ |
| | current answer, then repeat until the pointers meet.       |                                |
| +------------------------------------------------------------+                                |
|                                                                                                |
+==========================================================================================================+
| [Dreams LMS]  Learn coding through structured courses and practice.                          |
| For Instructor              For Student                    Newsletter                         |
| Become an instructor        My Profile                     [Email address____________] [>]     |
| Instructor dashboard        Enrolled Courses                Phone: +1 123 456 7890              |
|                              Favorites                      Email: support@example.com           |
+----------------------------------------------------------------------------------------------------------+
| © 2024 Dreams LMS. All rights reserved.      Terms & Conditions | Privacy Policy              |
+==========================================================================================================+
~~~

~~~text
MOBILE 390x844
+---------------------------------------------+
| [hamburger] [Dreams LMS]      [search]   |
+---------------------------------------------+
|                 WORKSPACE                 |
|          Classroom - Workspace            |
+---------------------------------------------+
| [ Search in lesson______________ ]        |
| Data Structures & Algorithms              |
| Module 2: Lesson 3 - Two-pointer patterns |
| [Mark lesson complete]                     |
| +--------------------------------------+   |
| |              [ PLAY ]                |   |
| |       VIDEO PLAYER #151E37           |   |
| +--------------------------------------+   |
| Two-pointer patterns                      |
| 12:35 | Instructor: Ronald Richard         |
| [< Previous lesson] [Next lesson >]       |
| [ Notes ] [ Resources ] [ Assignment ]    |
| Two-pointer patterns                      |
| Use two indexes to scan the ordered       |
| collection from both sides.               |
| +--------------------------------------+   |
| | COURSE CONTENT  Progress 40%         |   |
| | [ ] Hash tables from scratch         |   |
| | [ ] Collision strategies             |   |
| | [>] Two-pointer patterns             |   |
| | [ ] Sliding window lab               |   |
| | [ ] Judge problem set B              |   |
| +--------------------------------------+   |
| | COHORT CHAT                           |   |
| | Ronald: Welcome to module 2           |   |
| | [Type a message____________] [send]   |   |
| +--------------------------------------+   |
+---------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Header | Utility bar + main nav | Liên hệ, ngôn ngữ/USD, social, logo, 7 menu, search, cart, sign in/register | Mobile thu gọn thành hamburger |
| Hero | Page banner | Gradient nhạt, `WORKSPACE`, breadcrumb `Classroom - Workspace` | Giữ chiều cao ngắn trên mobile |
| Lesson header | Search + metadata | Search lesson, course title, module/lesson title, complete action | Complete đổi trạng thái khi submit |
| Main left | Video player | Khối dark, play icon trung tâm, title, duration, instructor, previous/next | Player giữ tỷ lệ, controls hiện khi focus |
| Main left | Lesson tabs/content | `Notes`, `Resources`, `Assignment`; note text cụ thể | Tab active đổi nội dung |
| Main right | Course content | Progress `40%`, 5 lesson rows, lesson hiện tại có marker | Mobile chuyển xuống dưới nội dung |
| Main right | Cohort chat | Message list, text input, send action | Mobile nằm sau course content |
| Footer | Footer columns | Logo/about, instructor/student links, newsletter, contact, copyright | Xếp dọc trên mobile |

## States

- Lesson chưa hoàn thành: action hiển thị `Mark lesson complete`.
- Lesson hiện tại: `Two-pointer patterns` có marker active trong Course Content.
- Tab: `Notes` active mặc định; Resources/Assignment thay vùng nội dung bên trái.
- Chat loading/error: giữ input, hiển thị trạng thái gửi cạnh nút `send`.
- `VERIFY`: route và nội dung chat cụ thể cần đối chiếu với app contract.
