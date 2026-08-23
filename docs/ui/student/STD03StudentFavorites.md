# STD03 Student Favorites

- **Tên màn hình:** Favorites
- **Đường dẫn:** `VERIFY: /student/favorites`
- **Asset:** [STD03StudentFavorites.svg](../../screen/student/STD03StudentFavorites.svg)
- **Viewport nguồn:** `1600x1639`
- **Lưu ý:** Asset dùng shell Student Dashboard; trạng thái active của sidebar phải là `Favorites`, không suy ra từ file `needs-review/STD03.svg`.

## Wireframe

~~~text
DESKTOP 1600x1639
+==================================================================================================+
| phone: +1 123 456 7890 | support@example.com                 English | USD | [fb] [x] [in]   |
+--------------------------------------------------------------------------------------------------+
| [Dreams LMS] | Home | Courses | Instructors | Classroom | Blog | Contact us | [search] [cart] |
|                                                                            [Sign in] [Register] |
+==================================================================================================+
|                                      FAVORITES                                                 |
|                                Home  -  Favorites                                              |
+==================================================================================================+
| +--------------------------------------------------------------------------------------------+ |
| | (avatar)  Ronald Richard                         [Become a Teacher] [Teacher Dashboard]     | |
| |           Student                         [edit pencil]                                      | |
| +--------------------------------------------------------------------------------------------+ |
| +------------------------------+  +--------------------------------------------------------+ |
| | MAIN MENU                    |  | Favorites                                  [search]   | |
| | [ ] Dashboard                |  | +----------------------+  +----------------------+      | |
| | [ ] My Profile              |  | | [course image/play]  |  | [course image/play]  |      | |
| | [ ] Enrolled Courses        |  | | [heart] Course title |  | [heart] Course title |      | |
| | [>] Favorites               |  | | Instructor / category |  | Instructor / category |      | |
| | [ ] AI Interview            |  | | Rating 4.8   [View]  |  | Rating 4.6   [View]  |      | |
| |------------------------------|  | +----------------------+  +----------------------+      | |
| | ACCOUNT SETTINGS             |  |                                                        | |
| | [ ] Settings                |  | No pagination controls visible in source viewport.  | |
| | [ ] Logout                  |  +--------------------------------------------------------+ |
| +------------------------------+                                                               |
+==================================================================================================+
| [Dreams LMS]  Learn coding through structured courses and practice.                          |
| For Instructor              For Student                    Newsletter                         |
| Become an instructor        My Profile                     [Email address____________] [>]     |
| Instructor dashboard        Enrolled Courses                Phone: +1 123 456 7890              |
|                              Favorites                      Email: support@example.com           |
+--------------------------------------------------------------------------------------------------+
| © 2024 Dreams LMS. All rights reserved.      Terms & Conditions | Privacy Policy              |
+==================================================================================================+
~~~

~~~text
MOBILE 390x844
+--------------------------------------------+
| [hamburger] [Dreams LMS]      [search]   |
+--------------------------------------------+
|               FAVORITES                  |
|             Home - Favorites              |
+--------------------------------------------+
| +--------------------------------------+   |
| | (avatar) Ronald Richard       [edit] |   |
| |          Student                     |   |
| | [Become a Teacher]                   |   |
| | [Teacher Dashboard]                  |   |
| +--------------------------------------+   |
| +--------------------------------------+   |
| | MAIN MENU                            |   |
| | [ ] Dashboard   [ ] My Profile       |   |
| | [ ] Enrolled Courses  [>] Favorites |   |
| | [ ] AI Interview                    |   |
| | ACCOUNT SETTINGS                     |   |
| | [ ] Settings              [ ] Logout |   |
| +--------------------------------------+   |
| Favorites                     [search]   |
| +--------------------------------------+   |
| | [course image/play]          [heart] |   |
| | Course title                         |   |
| | Instructor / category                |   |
| | Rating 4.8                 [View]    |   |
| +--------------------------------------+   |
| +--------------------------------------+   |
| | [course image/play]          [heart] |   |
| | Course title                         |   |
| | Instructor / category                |   |
| | Rating 4.6                 [View]    |   |
| +--------------------------------------+   |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Header/hero | Shell | Utility bar, nav, gradient hero, title/breadcrumb | Mobile dùng hamburger |
| Profile banner | Student identity | avatar_url, full_name, role, edit, two teacher CTAs | Giữ card riêng trên mobile |
| Sidebar | Main Menu | Favorites active; Dashboard, My Profile, Enrolled Courses, AI Interview | Navigate dashboard subsections |
| Sidebar | Account Settings | Settings, Logout | Logout cần confirm |
| Content | Favorites list | Search, course thumbnail/play, heart, title, instructor/category, rating (tổng hợp từ courses/teacher_profile — join qua course_id), created_at (ngày lưu), View | Heart toggle/remove favorite |
| Footer | Footer | 4 information areas và copyright bar | Xếp dọc mobile |

## States

- Favorite mặc định: heart filled/active trên card.
- Remove favorite: card biến mất sau confirm hoặc hiển thị undo.
- Empty favorites: giữ heading/search và hiển thị empty state thay grid.
- Search: lọc danh sách, không thay đổi sidebar active.
- `VERIFY`: tên course, số lượng card và pagination cần đối chiếu khi asset render đầy đủ.
