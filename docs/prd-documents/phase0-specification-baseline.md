# Phase 0 Specification Baseline

## 1. Muc dich

Tai lieu nay la diem bat dau bat buoc truoc khi sua `gap-analysis.md`, `prd.md`, `DATABASE.txt` hoac `api_spec.md`. No ghi lai nhung gi da duoc kiem chung trong workspace, nhung gi chi la de xuat, va nhung gi chua the xac minh do thieu asset hoac thieu quyet dinh nghiep vu.

Nguoi doc dung tai lieu nay nhu sau:

1. Kiem tra source of truth truoc khi ket luan mot UI field can them vao database.
2. Kiem tra conflict register truoc khi doi enum, status, currency hoac route.
3. Neu finding chua co bang chung, ghi `Assumption` hoac `Open Question`; khong viet thanh requirement da chot.
4. Khi asset SVG/raster duoc bo sung, cap nhat manifest va wireframe audit truoc, sau do moi sua gap/PRD/DB/API.

## 2. Pham vi va baseline worktree

Baseline duoc lap ngay sau khi `STD01StudentDashboard.md` duoc dong bo voi `studentDashboard.svg`.

| Muc | Trang thai tai baseline | Huong dan xu ly |
| --- | --- | --- |
| `docs/prd-documents/gap-analysis.md` | Da co thay doi chua commit cua nguoi dung | Bao toan y do va diff hien co; khong revert khi sua tai lieu. |
| `docs/prd-documents/prd.md` | Da co thay doi chua commit cua nguoi dung | Dung lam nguon nghiep vu dang de xuat; phai doi chieu voi conflict register. |
| `docs/DATABASE.txt` | File de xuat moi, chua track | Dung lam schema proposal; doi chieu voi model/migration truoc khi coi la schema hien tai. |
| `docs/database.txt` | File schema cu dang ton tai | Hien chi khac `DATABASE.txt` o newline cuoi file; van phai chon file canonical o phase database. |
| `docs/ui/` | Bo wireframe Markdown chua track | Day la nguon UI de phan tich, nhung khong dong nghia moi asset da co san de render. |
| `docs/screen/` | Khong ton tai trong workspace | Moi link asset tro den day la `ASSET_UNAVAILABLE`, khong phai asset da verify. |

## 3. Thu tu nguon su that

| Thu tu | Nguon | Dung de quyet dinh | Gioi han |
| --- | --- | --- | --- |
| 1 | Yeu cau duoc Product Owner xac nhan trong conversation/task | Pham vi, quy tac nghiep vu va cac decision moi | Can duoc ghi lai trong PRD/gap de khong mat context. |
| 2 | SVG/raster asset co mat trong workspace | Layout, text hien thi, viewport, component nhin thay | Asset khong the tu suy ra authorization, validation hoac database schema. |
| 3 | Wireframe Markdown da duoc audit | Component map, states, business rules co nguon | Rule co nhan `VERIFY`/`Assumption` chua phai requirement chot. |
| 4 | PRD va decision mapping | Flow nghiep vu va pham vi san pham | PRD hien dang co conflict voi yeu cau LessonContent va can duoc sua o phase sau. |
| 5 | Model va Alembic migration | Schema hien tai, enum, constraint, relation | Day la source ky thuat hien tai; khong phai schema de xuat cuoi cung. |
| 6 | `DATABASE.txt` | Schema proposal se trien khai | Chua duoc dung de ket luan database da ton tai. |
| 7 | `api_spec.md` va `docs/specs/verify/*.md` | Contract hien tai, route dang thieu, finding da review | API spec chua co Student Dashboard aggregate endpoint. |
| 8 | Figma report/Figma file | Doi chieu design bo sung | Figma MCP dang bi rate limit; khong duoc coi la node-level evidence trong baseline nay. |

## 4. Wireframe va asset inventory

Co `56` file Markdown trong `docs/ui`:

- `1` man hinh co asset cuc bo va da render: `STD01StudentDashboard.md` -> `studentDashboard.svg`.
- `46` man hinh tro toi `docs/screen/...`, nhung `docs/screen` hien khong co trong workspace.
- `6` man hinh duoc thiet ke tu flow nghiep vu, khong co source asset rieng: `AD02`, `INTERVIEW03`, `PAY03`, `STD04`, `TC14`, `TC15`.
- `3` file cau truc/huong dan, khong phai man hinh: `README.md`, `theme.md`, `LEARNING00UnifiedLessonWorkspace.md`.

Manifest chi tiet nam tai [wireframe-manifest.md](../ui/verification/wireframe-manifest.md). Truoc khi sua mot wireframe, doc trang thai asset cua no trong manifest.

### 4.1. Finding da xac minh tu STD01

- `STD01` la Student Dashboard, khong phai lesson workspace.
- Asset co viewport desktop `1561x2795`; khong co artboard mobile de viet layout mobile chinh xac.
- UI co profile banner, account navigation, learning KPI, contribution heatmap, Continue learning, AI Interview History va Recommended problems.
- UI khong co Video Player, cohort chat hoac lesson content body.
- Rule dashboard can them contract/domain definition: current-user ownership, activity day, streak, study time, recommendation va capability mo Teacher Dashboard.

## 5. Fact ky thuat da kiem chung

| ID | Fact hien tai | Bang chung | Tac dong tai lieu |
| --- | --- | --- | --- |
| DB-01 | `LessonContentType` trong code chi co `READING`, `QUIZ`, `PROBLEM`. | `src/models/base_model.py`, migration `cb4bb00b7555...` | Loai moi de xuat `VIDEO` khoi PRD, gap, database proposal va API payload. |
| DB-02 | Teacher registration enum hien tai la `AGREE`, `REJECT`, `PENDING`. | `base_model.py`, `teacher_register_model.py` | Doi chieu voi proposal `DRAFT/PENDING/APPROVED/REJECTED`; khong doi ten enum truoc khi co mapping/migration. |
| DB-03 | Course status hien tai la `DRAFT`, `PENDING_REVIEW`, `PUBLISHED`, `ARCHIVED`. | `base_model.py`, `course_model.py` | Khong dung lan `PENDING/APPROVED` neu chua co mapping chot. |
| DB-04 | `lesson_content_progress` co unique constraint `(enrollment_id, lesson_content_id)`. | migration va `lesson_content_progress_model.py` | `DATABASE.txt` va gap phai phan biet constraint hien co voi constraint con thieu. |
| DB-05 | `enrollment` chua co unique constraint `(student_id, course_id)`. | migration va `enrollment_model.py` | Day la gap hop le cho rule khong mua/enroll trung course. |
| DB-06 | Relation many-to-many Problem-Tag da ton tai duoi ten `problem_tag_map`. | migration va `problem_tag_model.py` | `DATABASE.txt` dang bo sot relation nay; sua tai lieu de phan anh schema hien tai, khong tu tao bang moi khac ten. |
| DB-07 | `user_history` chi luu `problem_count`, khong co activity theo ngay hay study time. | `user_history_model.py` | Student Dashboard can proposal moi cho activity daily neu heatmap/streak/study time la requirement. |
| DB-08 | Interview session dung `status: bool`; report la quan he mot-nhieu trong model. | `interview_session_model.py`, `interview_report_model.py` | Chua du cho state dashboard/report; gap existing ve enum status va one-report/session van hop le. |
| API-01 | API hien co `/student/courses`, `/interviews/sessions`, `/problems`; khong co `/student/dashboard`. | `docs/specs/api_spec.md` | API coverage phase phai them read model aggregate hoac ghi ro nhieu call client. |

## 6. Conflict register

| ID | Quan sat | Phan loai | Trang thai | Huong xu ly bat buoc |
| --- | --- | --- | --- | --- |
| C-01 | Yeu cau da xac nhan noi LessonContent chi co Reading, Quiz, Problem; mot so PRD/gap/wireframe cu van noi Video. | Business + document conflict | Resolved decision, chua cap nhat toan bo | Phase gap/PRD/DB/API phai loai Video LessonContent; giu media AI Interview tach biet. |
| C-02 | `46` wireframe co link asset toi `docs/screen`, nhung folder khong ton tai. | Evidence blocker | Open | Khong danh dau layout da verify; yeu cau cap asset hoac dung source asset khac. |
| C-03 | Nhieu route trong wireframe mang `VERIFY`. | Contract gap | Open | API coverage matrix phai chot route sau khi ownership va resource duoc xac minh. |
| C-04 | Teacher/Course/Payment status dung ten khac nhau giua code, PRD va gap. | State-machine conflict | Open | Tao mapping table, backfill/migration note, sau do moi sua enum contract. |
| C-05 | `$`, `VND` va `CAD` cung xuat hien trong UI/PRD/gap. | Currency conflict | Open | Chot currency persistence va display format; UI locale/currency selector khong tu dong quyet dinh settlement currency. |
| C-06 | PAY01/PAY02 co nhieu item, trong khi PRD MVP noi mot order/mot course. | Scope conflict | Open | Product Owner chot cardinality truoc khi thiet ke Cart/Order schema/API. |
| C-07 | `problem_tag_map` co trong code nhung khong co trong `DATABASE.txt`. | Documentation drift | Confirmed | Them dung ten relation va composite key vao schema proposal; khong tao `problem_tag_mapping` song song. |
| C-08 | STD01 can heatmap, streak, study time va recommendation; schema hien tai khong co activity daily. | Required design decision | Confirmed gap | Proposal `student_daily_activity` chi duoc them sau khi chot event, timezone va aggregation rule. |
| C-09 | `DATABASE.txt` va `database.txt` gan nhu trung nhau. | Canonical-source risk | Open | Chon mot file canonical; khong xoa file con lai khi chua duoc phep. |
| C-10 | Figma node-level context chua doc duoc do MCP rate limit. | External dependency blocker | Open | Dung SVG/raster va wireframe hien co lam evidence; danh dau `VERIFY-FIGMA` cho token/geometry chua xac nhan. |
| C-11 | `docs/ui/README.md` noi route map da chot, nhung phan lon route van `VERIFY`. | Documentation wording conflict | Resolved in Phase 0 | README phai noi route map chi duoc dung sau khi contract duoc chot. |
| C-12 | `docs/ui/README.md` tung tro toi `../theme.md` va `../../screen/`, la hai path sai tu vi tri README. | Documentation link conflict | Resolved in Phase 0 | Doi thanh `theme.md` va `../screen/`; `docs/screen` van la external asset blocker C-02. |

## 7. Assumption va open question

### Assumption duoc phep dung tam thoi

- Student Dashboard chi doc du lieu cua current authenticated user; server phai loc theo user identity trong token.
- Course progress co the derive tu enrollment va lesson content progress; khong tu them field progress snapshot neu chua co yeu cau performance.
- Problem acceptance rate la API projection tinh tu submission, khong phai field source bat buoc trong `problem`.

### Open question phai co quyet dinh truoc implementation

1. Event nao tao contribution cho heatmap: completed Reading, passed Quiz, Accepted Problem, study session hay tong hop?
2. Timezone nao dung de tinh `activity_date`, streak va month heatmap?
3. Study time do bang heartbeat server, client timer da xac thuc hay session duration?
4. Course status chuan la naming hien tai `PENDING_REVIEW/PUBLISHED` hay naming moi `PENDING/APPROVED`?
5. Teacher application co can `DRAFT` hay chi tao application luc submit?
6. Checkout MVP chua mot course hay nhieu course?
7. Currency luu tru va settlement chuan la gi; selector `USD` tren UI co y nghia display hay giao dich?
8. Asset `PROG03ProblemVideo` se bi loai, doi ten hay tro thanh noi dung ngoai LessonContent?
9. `docs/DATABASE.txt` hay `docs/database.txt` la schema canonical sau khi phase database hoan tat?

## 8. Dieu kien ket thuc Phase 0

Phase 0 duoc coi la hoan tat khi:

- Baseline nay va wireframe manifest ton tai, link tu `docs/ui/README.md` hop le.
- Source of truth, finding, conflict va open question da duoc phan loai ro rang.
- Task 1-3 va Task 21 trong task breakdown duoc danh dau `DONE`.
- Chua co core document nao bi sua dua tren asset unavailable hoac suy doan.

## 9. Dau vao cho phase tiep theo

1. Dung conflict C-01, C-04, C-05, C-06, C-07 va C-08 de viet lai gap analysis.
2. Dung DB-01 den DB-08 de doi chieu PRD va `DATABASE.txt` voi code hien tai.
3. Chay Task 22 va Task 23 khi asset SVG/raster duoc bo sung hoac co the render.
4. Chay Task 24-26 truoc khi sua API spec, vi API khong duoc tro toi enum/table chua chot.
