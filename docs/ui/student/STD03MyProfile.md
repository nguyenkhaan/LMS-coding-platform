# STD03 My Profile (Needs Review)

- **Tên màn hình:** My Profile
- **Đường dẫn:** `VERIFY: /student/profile`
- **Asset:** [STD03.svg](../../screen/needs-review/STD03.svg)
- **Viewport nguồn:** `1600x1639`
- **Lưu ý:** Asset này nằm trong `needs-review`, tên mã trùng `STD03StudentFavorites` nhưng render thực tế là `My Profile`; cần xác nhận tên/mã nguồn trước khi đổi file asset.

## Wireframe

~~~text
DESKTOP 1600x1639
+==================================================================================================+
| phone: +1 123 456 7890 | support@example.com                 English | USD | [fb] [x] [in]   |
+--------------------------------------------------------------------------------------------------+
| [Dreams LMS] | Home | Courses | Instructors | Classroom | Blog | Contact us | [search] [cart] |
|                                                                            [Sign in] [Register] |
+==================================================================================================+
|                                      MY PROFILE                                                |
|                                Home  -  My Profile                                             |
+==================================================================================================+
| +--------------------------------------------------------------------------------------------+ |
| | (avatar)  Ronald Richard                         [Become a Teacher] [Teacher Dashboard]     | |
| |           Student                         [edit pencil]                                      | |
| +--------------------------------------------------------------------------------------------+ |
| +------------------------------+  +--------------------------------------------------------+ |
| | MAIN MENU                    |  | My Profile                                      [edit] | |
| | [ ] Dashboard                |  | First Name              Ronald                         | |
| | [>] My Profile              |  | Last Name               Richard                        | |
| | [ ] Enrolled Courses        |  | Registration Date       16 Jan 2024, 11:15 AM       | |
| | [ ] Favorites               |  | User Name               studentdemo                   | |
| | [ ] AI Interview            |  | Phone Number            90154-91036                  | |
| |------------------------------|  | Email                   studentdemo@example.com    | |
| | ACCOUNT SETTINGS             |  | Gender                  Male                         | |
| | [ ] Settings                |  | Date of Birth           16 Jan 2020                  | |
| | [ ] Logout                  |  | Age                     24                           | |
| +------------------------------+  | Bio                                                   | |
|                                  |  Ronald Richard is a student focused on practical     | |
|                                  |  coding skills and interview preparation.              | |
|                                  +--------------------------------------------------------+ |
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
|               MY PROFILE                 |
|             Home - My Profile             |
+--------------------------------------------+
| +--------------------------------------+   |
| | (avatar) Ronald Richard       [edit] |   |
| |          Student                     |   |
| | [Become a Teacher]                   |   |
| | [Teacher Dashboard]                  |   |
| +--------------------------------------+   |
| +--------------------------------------+   |
| | MAIN MENU                            |   |
| | [ ] Dashboard   [>] My Profile       |   |
| | [ ] Enrolled Courses  [ ] Favorites  |   |
| | [ ] AI Interview                    |   |
| | ACCOUNT SETTINGS                     |   |
| | [ ] Settings              [ ] Logout |   |
| +--------------------------------------+   |
| My Profile                         [edit] |
| First Name                  Ronald       |
| Last Name                   Richard      |
| Registration Date           16 Jan 2024 |
| User Name                   studentdemo  |
| Phone Number                90154-91036  |
| Email                       studentdemo@ |
|                             example.com  |
| Gender                      Male         |
| Date of Birth               16 Jan 2020  |
| Age                         24           |
| Bio                                      |
| Ronald Richard is a student focused on  |
| practical coding skills and interview   |
| preparation.                             |
+--------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Header/hero | Shell | Utility/nav, gradient banner, title/breadcrumb | Mobile collapse |
| Profile banner | Identity card | Avatar, Ronald Richard, Student, edit, teacher CTAs | Edit mở profile form |
| Sidebar | Dashboard menu | My Profile active; account settings phía dưới divider | Mobile đặt trước profile details |
| Content | Profile details | 9 field/value pairs và Bio paragraph; edit pencil ở heading | Read-only state trong asset; edit chuyển form |
| Footer | Footer | Logo/about, links, newsletter/contact, copyright | Xếp dọc mobile |

## States

- Read-only: value hiển thị dạng text, không có input border.
- Edit: pencil mở form cập nhật các field; cần preserve label/value mapping.
- Validation: email, phone và date báo lỗi inline, không làm đổi thứ tự field.
- `VERIFY`: route và tên/mã chính thức của asset vì file hiện còn ở `needs-review`.
