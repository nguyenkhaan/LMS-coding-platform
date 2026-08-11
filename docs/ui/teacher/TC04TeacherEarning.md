# TC04 Teacher Earnings

- **Tên màn hình:** Earnings
- **Đường dẫn:** `VERIFY: /teacher/earnings`
- **Asset:** [TC04TeacherEarning.svg](../../screen/teacher/TC04TeacherEarning.svg)
- **Viewport nguồn:** `1920x2476`

## Wireframe

~~~text
DESKTOP 1920x2476
+=====================================================================================================+
| [Dreams LMS] Home Courses Instructors Classroom Blog Contact us          [search] [bell] [user] |
+=====================================================================================================+
|                                      EARNINGS                                                     |
|                                    Home - Earnings                                               |
+=====================================================================================================+
| +----------------------------------------------------------------------------------------------+ |
| | (avatar) Edythe Andrew  Teacher                           [Become a Student] [Teacher Dashboard]| |
| +----------------------------------------------------------------------------------------------+ |
| +-----------------------------+  +----------------------------------------------------------+ |
| | MAIN MENU                   |  | Earnings                                  [This Month v] | |
| | [ ] Dashboard               |  | [Total Revenue $1,240] [This Month $320] [Payout $890] | |
| | [ ] My Profile             |  | Revenue overview: [line chart with monthly points]       | |
| | [ ] My Courses             |  | Earnings                                             | |
| | [ ] Course Enrollment      |  | Date | Course | Student | Amount | Status             | |
| | [ ] Students               |  | 16 Jan | Python Foundations | Ronald | $48 | Paid      | |
| | [>] Earnings               |  | 18 Jan | React TypeScript   | Jenny  | $64 | Pending   | |
| | [ ] Messages               |  | 22 Jan | Algorithms          | Patricia| $52 | Paid     | |
| | [ ] Settings               |  |                              [1] [2] [>]          | |
| +-----------------------------+  +----------------------------------------------------------+ |
+=====================================================================================================+
~~~

~~~text
MOBILE 390x844
+---------------------------------------------+
| [hamburger] [Dreams LMS]     [bell] [user]|
+---------------------------------------------+
|                EARNINGS                  |
|              Home - Earnings              |
+---------------------------------------------+
| Teacher: Edythe Andrew                   |
| [ ] Dashboard [ ] Profile [ ] Courses    |
| [ ] Students  [>] Earnings [ ] Messages  |
| +--------------------------------------+   |
| | Earnings                 [This Month v]|  |
| | [Revenue $1,240] [Month $320]         |   |
| | [Payout $890]                         |   |
| | Revenue overview                     |   |
| | [line chart]                          |   |
| | Date | Course | Amount | Status       |   |
| | 16 Jan | Python | $48 | Paid         |   |
| | 18 Jan | React  | $64 | Pending      |   |
| | 22 Jan | Algo   | $52 | Paid         |   |
| | [1] [2] [>]                          |   |
| +--------------------------------------+   |
+---------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Toolbar | Period selector | This Month dropdown | Recalculates KPI/chart/table |
| KPI | Revenue cards | Total revenue, month revenue, payout | Dynamic currency values |
| Chart | Revenue overview | Line chart with monthly points | Loading/error state |
| Table | Earnings list | Date, course, student, amount, status, pagination | Sort/filter by period |
| Sidebar | Teacher navigation | Earnings active | Navigate |

## States

- Paid/pending status uses distinct badges.
- No earnings: KPI zeros, chart empty state, table explanation.
- Payout loading/error retains selected period.
- `VERIFY`: currency and payout rules need backend contract.
