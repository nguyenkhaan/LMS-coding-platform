# AD01 Teacher Registration Review

- **Tên màn hình:** Teacher Registration Review
- **Đường dẫn:** `VERIFY: /admin/teacher-registration/:requestId`
- **Asset:** [AD01TeacherRegistrationReview.svg](../../screen/admin/AD01TeacherRegistrationReview.svg)
- **Viewport nguồn:** `1920x2699`

## Wireframe

~~~text
DESKTOP 1920x2699
+=================================================================================================+
| [Dreams LMS] Home Courses Instructors Blog                                  [admin] [Logout] |
+=================================================================================================+
| IDENTITY VERIFICATION                         [Approve request] [Reject] [Request changes]    |
| Home - Teacher Registration Review             Request #TR-0001  Status: Pending             |
+=================================================================================================+
| +---------------------------+  +------------------------------------------------------------+ |
| | Pending requests          |  | Applicant information                         [Pending]   | |
| | [search____________]      |  | Name: Edythe Andrew   Email: edythe@example.com            | |
| | [avatar] Edythe [Pending] |  | Phone: +1 123 456 7890  Applied: 16 Jan 2024              | |
| | [avatar] Ronald [Pending]  |  | Requested expertise: Programming, Algorithms                | |
| | [avatar] Jenny [Review]    |  | [View document] [Download]                                  | |
| +---------------------------+  +------------------------------------------------------------+ |
|                                  +-------------------------+  +-----------------------------+ |
|                                  | Identity documentation |  | Verification checklist      | |
|                                  | [ID front preview]    |  | [x] Email verified          | |
|                                  | [ID back preview]     |  | [x] Phone verified          | |
|                                  | [open full document]  |  | [ ] ID document reviewed   | |
|                                  +-------------------------+  | [ ] Background check        | |
|                                  | Additional information |  | [ ] Profile complete        | |
|                                  | Bio: ................ |  | [Save checklist]            | |
|                                  | Experience: ........  |  +-----------------------------+ |
|                                  | [Approve] [Reject]    |                               |
|                                  +-------------------------+                               |
+=================================================================================================+
| Footer: Admin help | Audit log | Privacy | Copyright                                          |
+=================================================================================================+
~~~

~~~text
MOBILE 390x844
+-------------------------------------------+
| [hamburger] [Dreams LMS]       [admin]   |
+-------------------------------------------+
| IDENTITY VERIFICATION                    |
| Request #TR-0001       Status: Pending   |
| [Approve] [Reject] [Request changes]      |
+-------------------------------------------+
| Pending requests                         |
| [search____________]                     |
| Edythe Andrew                  [Pending] |
| Ronald Richard                 [Pending] |
| Jenny Wilson                   [Review]  |
| Applicant information                     |
| Name: Edythe Andrew                       |
| Email: edythe@example.com                |
| Phone: +1 123 456 7890                   |
| Expertise: Programming, Algorithms       |
| [View document] [Download]               |
| Identity documentation                   |
| [ID front preview] [ID back preview]     |
| Verification checklist                   |
| [x] Email verified  [x] Phone verified   |
| [ ] ID reviewed     [ ] Background check |
| Additional information                   |
| Bio / Experience                         |
+-------------------------------------------+
~~~

## Component map

| Vùng | Component | Chi tiết | Hành vi |
| --- | --- | --- | --- |
| Header | Admin shell | Logo, admin identity, logout | Separate admin permission scope |
| Queue | Pending requests | Searchable request list and status | Selects review request |
| Applicant | Applicant information | Identity, contact, expertise, documents | Open/download evidence |
| Verification | Document/checklist panels | ID previews, verification checklist, save | Checklist drives review readiness |
| Decision | Approve/reject/request changes | Primary moderation actions | Confirmation and audit log |

## States

- Pending: all decision actions available according to checklist permissions.
- Approved/rejected: decision controls become read-only and status is immutable or audited.
- Missing document: checklist blocks approval and highlights document requirement.
- `VERIFY`: exact admin permission and audit-log route require backend contract.
