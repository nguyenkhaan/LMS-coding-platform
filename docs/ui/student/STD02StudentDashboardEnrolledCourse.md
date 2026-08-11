# STD02 Student Enrolled Courses

- **Tên màn hình:** Enrolled Courses
- **Đường dẫn:** `VERIFY: /student/enrolled-courses`
- **Asset:** [STD02StudentDashboardEnrolledCourse.svg](../../screen/student/STD02StudentDashboardEnrolledCourse.svg)
- **Viewport nguồn:** `1600x1802`

## Wireframe

~~~text
DESKTOP 1600x1802
+===================================================================================================+
| phone: +1 123 456 7890 | support@example.com                 English | USD | [fb] [x] [in]   |
+---------------------------------------------------------------------------------------------------+
| [Dreams LMS] | Home | Courses | Instructors | Classroom | Blog | Contact us | [search] [cart] |
|                                                                            [Sign in] [Register] |
+===================================================================================================+
|                                   ENROLLED COURSES                                              |
|                              Home  -  Enrolled Courses                                         |
+===================================================================================================+
| +--------------------------------------------------------------------------------------------+ |
| | (avatar)  Ronald Richard                         [Become a Teacher] [Teacher Dashboard]     | |
| |           Student                         [edit pencil]                                      | |
| +--------------------------------------------------------------------------------------------+ |
| +------------------------------+  +--------------------------------------------------------+ |
| | MAIN MENU                    |  | Enrolled Courses             [Enrolled (09)] [Active (06)]| |
| | [ ] Dashboard                |  |                              [Completed (03)]         | |
| | [ ] My Profile              |  | +----------------------+  +----------------------+      | |
| | [>] Enrolled Courses        |  | | [course image/play]  |  | [course image/play]  |      | |
| | [ ] Favorites               |  | | Python Foundations   |  | Production React &   |      | |
| | [ ] AI Interview            |  | | for Problem Solving  |  | TypeScript           |      | |
| |------------------------------|  | | 64%  [=======-----]    |  | 12%  [=-----------]    |      | |
| | ACCOUNT SETTINGS             |  | | Last accessed: Today |  | Last accessed: 2 days |      | |
| | [ ] Settings                |  | | Next: Hash tables    |  | Next: React hooks     |      | |
| | [ ] Logout                  |  | | [       Continue     ] |  | [       Continue     ] |      | |
| +------------------------------+  | +----------------------+  +----------------------+      | |
|                                  | +----------------------+  +----------------------+      | |
|                                  | | [course image/play]  |  | [course image/play]  |      | |
|                                  | | Data Structures &    |  | Data Structures &    |      | |
|                                  | | Algorithms Interview |  | Algorithms Interview |      | |
|                                  | | 28%  [===---------]    |  | 28%  [===---------]    |      | |
|                                  | | Last accessed: 5 days|  | Last accessed: 1 week |      | |
|                                  | | Next: Two pointers   |  | Next: Sliding window  |      | |
|                                  | | [       Continue     ] |  | [       Continue     ] |      | |
|                                  | +----------------------+  +----------------------+      | |
|                                  |                                                        | |
|                                  | Page 1 of 2       [1] [2] [3] [>]                      | |
|                                  +--------------------------------------------------------+ |
+===================================================================================================+
| [Dreams LMS]  Learn coding through structured courses and practice.                          |
| For Instructor              For Student                    Newsletter                         |
| Become an instructor        My Profile                     [Email address____________] [>]     |
| Instructor dashboard        Enrolled Courses                Phone: +1 123 456 7890              |
|                              Favorites                      Email: support@example.com           |
+---------------------------------------------------------------------------------------------------+
| © 2024 Dreams LMS. All rights reserved.      Terms & Conditions | Privacy Policy              |
+===================================================================================================+
~~~

~~~text
MOBILE 390x844
+---------------------------------------------+
| [hamburger] [Dreams LMS]      [search]   |
+---------------------------------------------+
|             ENROLLED COURSES             |
|          Home - Enrolled Courses          |
+---------------------------------------------+
| +--------------------------------------+   |
| | (avatar) Ronald Richard       [edit] |   |
| |          Student                     |   |
| | [Become a Teacher]                   |   |
| | [Teacher Dashboard]                  |   |
| +--------------------------------------+   |
| +--------------------------------------+   |
| | MAIN MENU                            |   |
| | [ ] Dashboard   [ ] My Profile       |   |
| | [>] Enrolled Courses [ ] Favorites   |   |
| | [ ] AI Interview                    |   |
| | ACCOUNT SETTINGS                     |   |
| | [ ] Settings              [ ] Logout |   |
| +--------------------------------------+   |
| Enrolled Courses                         |
| [Enrolled (09)] [Active (06)]            |
| [Completed (03)]                         |
| +--------------------------------------+   |
| | [course image/play]                 |   |
| | Python Foundations for Problem       |   |
| | Solving                              |   |
| | 64% [=======-------------]            |   |
| | Last accessed: Today                 |   |
| | Next: Hash tables       [Continue]   |   |
| +--------------------------------------+   |
| +--------------------------------------+   |
| | [course image/play]                 |   |
| | Production React & TypeScript        |   |
| | 12% [=-------------------]            |   |
| | Last accessed: 2 days ago            |   |
| | Next: React hooks       [Continue]   |   |
| +--------------------------------------+   |
| Page 1 of 2             [1] [2] [>]     |
+---------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Header | Utility/nav | Cùng shell Dreams LMS, nav desktop; hamburger mobile | Responsive collapse |
| Hero | Page banner | `ENROLLED COURSES`, breadcrumb | Không chứa CTA |
| Profile banner | Student identity | Avatar, Ronald Richard, Student, edit, Become a Teacher, Teacher Dashboard | CTA giữ hai action riêng |
| Left column | Dashboard menu | Main Menu và Account Settings; Enrolled Courses active coral | Mobile chuyển thành card trước danh sách |
| Right column | Filter tabs | Enrolled 09 active, Active 06, Completed 03 | Lọc course card |
| Right column | Course card | Thumbnail/play, title, progress, last accessed, next lesson, Continue | Continue mở lesson tiếp theo |
| Right column | Pagination | Page 1 of 2, pages 1/2/3, next | Active page coral |
| Footer | Footer | Link columns, newsletter, contact, copyright | Xếp dọc mobile |

## States

- Tab `Enrolled (09)` active mặc định; Active/Completed đổi tập dữ liệu.
- Progress bar phản ánh phần trăm từng course; không dùng cùng một phần trăm cho mọi card.
- Course loading: card giữ khung thumbnail và skeleton metadata.
- Empty filter: giữ heading/tab, hiển thị empty state trong vùng card.
- `VERIFY`: route và số lượng course động cần xác nhận với app contract.
