# STD01 Student Dashboard

- **Tên màn hình:** Student Dashboard
- **Đường dẫn:** `VERIFY: /dashboard`
- **Asset:** [studentDashboard.svg](studentDashboard.svg)
- **Viewport nguồn:** `1561x2795` (desktop)
- **Mức độ chắc chắn:** Bố cục và nội dung được đối chiếu từ SVG render. SVG không có artboard mobile riêng, nên không tự suy diễn wireframe mobile.

## Wireframe

~~~text
DESKTOP 1561x2795
+=======================================================================================================+
| [address] 1442 Crosswind Drive Madisonville | [phone] +1 4588 777874      [ENG v] [USD v] [social] |
+-------------------------------------------------------------------------------------------------------+
| [Dreams LMS]  Home v  Courses v  Instructors v  Pages v  Blog v  Contact us   [theme] [cart: 1]     |
|                                                                           [Sign In] [Register]         |
+=======================================================================================================+
|                                         DASHBOARD                                                     |
|                                     Home  -  Dashboard                                                |
+=======================================================================================================+
| +---------------------------------------------------------------------------------------------------+ |
| | [avatar] Ronald Richard [edit]                                                                    | |
| |          Student                                              [Become a Teacher] [Teacher Dashboard] | |
| +---------------------------------------------------------------------------------------------------+ |
+=======================================================================================================+
| +---------------------------+  Welcome back, Ronald!                                                |
| | MAIN MENU                 |  Keep up the great work on your learning journey.                    |
| | [active] Dashboard        |                                                                       |
| | My Profile                |  Recently                                                             |
| | Enrolled Courses          |  +----------------+ +----------------+ +----------------+ +----------+ |
| | Favorites                 |  | Courses in      | | Problems       | | Current streak | | Study    | |
| | AI Interview              |  | progress: 3     | | solved: 128    | | 17 days        | | time: 42h| |
| |                           |  | 1 finishing/week| | +12 this week  | | Best: 31 days  | | Last 30d | |
| | ACCOUNT SETTINGS          |  +----------------+ +----------------+ +----------------+ +----------+ |
| | Settings                  |                                                                       |
| | Logout                    |  Number of contributions: 3,936                  [top 1% creators]  |
| +---------------------------+  Jan ... Dec contribution activity heatmap                             |
|                                Less [color scale] More                                               |
+=======================================================================================================+
| +---------------------------------------------------------------------------------------------------+ |
| | Continue learning                                                                  [All courses ->] | |
| | Pick up where you left off                                                                       | |
| | +-----------------------------------------------------------------------------------------------+ | |
| | | [course icon] Python Foundations for Problem Solving                              [Open]      | | |
| | |               Le Quang Huy    [==============================--------] 64%                  | | |
| | +-----------------------------------------------------------------------------------------------+ | |
| | | [course icon] Data Structures & Algorithms Interview Prep                        [Open]      | | |
| | |               Nguyen Thu Ha   [==============----------------------] 28%                    | | |
| | +-----------------------------------------------------------------------------------------------+ | |
| | | [course icon] Production React & TypeScript                                      [Open]      | | |
| | |               Tran Minh Duc   [======--------------------------------] 12%                    | | |
| | +-----------------------------------------------------------------------------------------------+ | |
| +---------------------------------------------------------------------------------------------------+ |
+=======================================================================================================+
| +----------------------------------------------+  +------------------------------------------------+ |
| | AI Interview History                         |  | Recommended problems                           | |
| | 03/08 19:00  AI mock interview - 1   [50%]   |  | Chosen from your weakest topics                | |
| | 03/08 06:30  AI mock interview - 2   [80%]   |  | [Problem list ->]                              | |
| | 02/08 22:00  AI mock interview - 3   [20%]   |  | OJ-204 Longest Substring Without Repeating     | |
| | [View All]                                   |  |        Sliding Window · 46% acceptance [Medium]| |
| |                                              |  | OJ-231 Course Schedule                         | |
| |                                              |  |        Graph · 41% acceptance [Medium]         | |
| |                                              |  | OJ-310 Median of Two Sorted Arrays             | |
| |                                              |  |        Binary Search · 24% acceptance [Hard]   | |
| |                                              |  | OJ-344 Word Ladder II                          | |
| |                                              |  |        BFS · 19% acceptance [Hard]             | |
| +----------------------------------------------+  +------------------------------------------------+ |
+=======================================================================================================+
| [Dreams LMS description] [App Store] [Google Play] | For Instructor | For Student | Newsletter     |
| Contact: address, email, phone                                                               |
+-------------------------------------------------------------------------------------------------------+
| © 2025 DreamsLMS. All rights reserved.                        Terms & Conditions | Privacy Policy     |
+=======================================================================================================+
~~~

## Component map

| Vùng | Component | Dữ liệu hiển thị | Hành vi |
| --- | --- | --- | --- |
| Utility header | Contact, locale, currency, social links | Address, phone, language, currency | Chọn locale/currency; mở liên kết ngoài |
| Main navigation | Public navigation and account actions | Menu, theme action, cart count, sign-in/register | Điều hướng; cart badge phản ánh số item |
| Page banner | Dashboard title and breadcrumb | `Dashboard`, `Home - Dashboard` | Breadcrumb quay lại trang chủ |
| Profile banner | Current user summary | Avatar, full name, role `Student` | Edit profile; mở luồng Become a Teacher hoặc Teacher Dashboard theo quyền |
| Sidebar | Student account navigation | Dashboard, Profile, Enrolled Courses, Favorites, AI Interview, Settings, Logout | Đổi trang; Dashboard active ở màn này |
| Recently | Four learning KPI cards | Courses in progress, problems solved, current streak, study time | Card là summary read-only; period ghi rõ trên từng card |
| Contribution chart | Learning activity heatmap | Total contribution, day cells, month labels, percentile badge | Hiển thị hoạt động theo ngày và color scale; không phải input editable |
| Continue learning | Enrolled course progress list | Course name, instructor, progress percent, Open action | Mở course workspace tại vị trí học gần nhất; All courses mở danh sách enrolled courses |
| AI Interview History | Recent interview sessions | Date/time, title, description, score/progress ring | View All mở danh sách session; từng row mở report hoặc session phù hợp status |
| Recommended problems | Personalized OJ suggestions | Problem id, title, topic, acceptance rate, difficulty | Problem list mở catalog; problem card mở chi tiết problem |
| Footer | Shared public footer | Product links, newsletter, contact, policies | Điều hướng và đăng ký newsletter |

## States

- Dashboard loading: giữ hình học của banner, KPI cards, course rows và problem cards bằng skeleton; không hiển thị số liệu cũ của user khác.
- Chưa đăng nhập: route yêu cầu authentication và điều hướng tới Sign In; không render dữ liệu dashboard rỗng như dữ liệu thật.
- Chưa có course đang học: Continue learning hiển thị empty state và CTA tới Course Catalog; `All courses` vẫn mở danh sách enrollment nếu có course đã hoàn thành.
- Chưa có AI Interview: khu vực history hiển thị empty state và CTA bắt đầu AI Interview; không render vòng điểm giả.
- Chưa có recommendation: giữ heading, mô tả và action `Problem list`; không tạo problem recommendation từ client-side placeholder.
- Teacher application chưa được approved: hiển thị `Become a Teacher`; không cho điều hướng vào Teacher Dashboard chỉ dựa trên việc user có role/label Teacher.
- Teacher application approved: `Teacher Dashboard` là action hợp lệ; `Become a Teacher` không được tạo application duplicate.
- Course progress: percent và thanh progress được lấy từ enrollment hiện tại; action `Open` phải tiếp tục từ content hợp lệ gần nhất.

## Business rules

- Dashboard chỉ hiển thị dữ liệu của current authenticated student; tất cả summary, history và recommendation phải được lọc theo `user_id` phía server.
- `Courses in progress` đếm enrollment đang active nhưng chưa completed; danh sách Continue learning chỉ gồm enrollment mà user còn quyền truy cập.
- `Problems solved` chỉ tính submission đã đạt kết quả hoàn thành theo rule Online Judge; không đếm lần Run code hoặc submission thất bại.
- `Current streak`, `Study time` và contribution heatmap cần một định nghĩa thống nhất về activity day, timezone và khoảng thời gian. SVG không thể hiện nguồn dữ liệu hoặc công thức tính, nên đây là yêu cầu API/domain cần xác nhận.
- Suggested problems là recommendation cho current user. Wireframe cho biết dựa trên `weakest topics`, nhưng không chỉ ra thuật toán hay dữ liệu đầu vào; không tự suy ra schema recommendation mới.
- Mỗi dòng AI Interview History phải hiển thị trạng thái phù hợp: report hoàn tất có thể mở report; session chưa hoàn tất phải dẫn tới resume hoặc trạng thái chờ, không gắn điểm cuối giả.
