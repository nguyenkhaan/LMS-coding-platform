# Wireframe Markdown Audit

## 1. Muc dich va pham vi

Tai lieu nay la ket qua cua **Task 22**. Muc dich la kiem tra su nhat quan ben trong tung file `docs/ui/**/*.md`: metadata co mo ta dung wireframe duoc ve bang ky tu Markdown trong chinh file do hay khong.

Day **khong** phai la visual-pixel audit voi SVG, PNG hay Figma. Asset ben ngoai co the duoc dung sau nay de kiem tra giao dien trien khai, nhung khong phai dieu kien de ket luan metadata phu hop voi wireframe Markdown.

Pham vi da kiem tra:

- 53 file wireframe man hinh trong manifest: 46 man hinh co tham chieu asset, 6 man hinh `DESIGN_ONLY`, 1 man hinh co asset local.
- 1 tai lieu shell dung chung: `class/LEARNING00UnifiedLessonWorkspace.md`.
- `README.md`, `theme.md` va `wireframe-manifest.md` la tai lieu structural, khong danh gia nhu mot man hinh.

## 2. Cach kiem tra

Voi moi file man hinh, audit doc theo thu tu sau:

1. Doc heading va metadata: ma man hinh, ten, route, viewport neu co, va provenance.
2. Doc khung `Wireframe` ve bang text de xac dinh man hinh thuc su hien thi gi, actor nao dang thao tac, va cac vung layout chinh.
3. Doi chieu `Component map` voi cac vung da duoc ve trong wireframe.
4. Doi chieu `States` voi component/hang dong ma wireframe co the hien thi.
5. Tach `Business rules` ra khoi layout: rule khong the thay chi tu wireframe phai co nguon, `VERIFY`, hoac `Assumption`. Viec xac nhan nguon nghiep vu chi tiet la pham vi Task 23.

Quy uoc ket qua:

| Ket qua | Y nghia |
| --- | --- |
| `PASS` | Metadata va wireframe trong cung file cung mo ta mot man hinh; khong thay mismatch ro rang. |
| `PASS WITH FINDING` | Man hinh van doc duoc, nhung co mismatch, ten/ma trung lap, hoac semantic conflict can xu ly truoc khi dung lam requirement. |
| `STRUCTURAL` | Tai lieu dung chung, khong phai man hinh doc lap; khong bat buoc co route/viewport/component map/state. |

## 3. Ket qua tong hop

| Hang muc | Ket qua | Ket luan |
| --- | --- | --- |
| Wireframe bang text | 53/53 man hinh co wireframe bang Markdown; `AUTH02` dung heading dac thu `Wireframe thuc te cua asset`. | Dat. `AUTH02` da duoc ghi ro la identity `VERIFY`, khong bi hieu nham la Register. |
| Component map | 53/53 man hinh co `## Component map`. | Dat o muc metadata structure. |
| States | 53/53 man hinh co `## States`. | Dat o muc metadata structure. |
| Business rules | 11/53 man hinh co section `## Business rules`. | Khong phai loi layout. 42 man hinh con lai chi mo ta UI/state hoac can Task 23 xac dinh rule co can bo sung hay khong. |
| Route | 50 file dung `VERIFY` va 7 file dung `suy luan` cho route. | Khong dung route do trong gap analysis nhu route da ton tai; can xac nhan voi frontend/API truoc implementation. |
| Viewport | Chi kiem tra duoc khi file tu khai bao viewport. 6 `DESIGN_ONLY` khong bat buoc co viewport. | Khong suy ra kich thuoc tu asset trong phase nay. |

## 4. Ket qua theo nhom man hinh

| Nhom | File da doi chieu voi wireframe Markdown | Ket qua | Ghi chu |
| --- | --- | --- | --- |
| Admin | `AD01`, `AD02` | PASS WITH FINDING | `AD02` co label `Video` trong curriculum preview; day la xung dot LessonContent, khong phai mismatch layout. |
| Auth | `AUTH01` den `AUTH07` | PASS WITH FINDING | `AUTH02` co ma/filename Register nhung text wireframe la Forgot Password; metadata da gan `VERIFY`. |
| Classroom | `CLASS01` | PASS WITH FINDING | Wireframe va component map deu mo ta Video player/cohort chat; can xu ly xung dot pham vi LessonContent. |
| Course | `COURSE01`, `COURSE02`, `COURSE03`, `COURSE04.1`, `COURSE04.2`, `COURSE04.3` | PASS | Ten, tab va component map phu hop voi wireframe trong file. Route van la `VERIFY`. |
| Instructor | `INS01`, `INS02`, `INS03` | PASS | Grid, list va detail duoc tach thanh man hinh rieng ro rang. |
| Interview | `INTERVIEW01`, `INTERVIEW02`, `INTERVIEW03` | PASS | Setup la design-only; report va interview co state/component map tuong ung. |
| Online Judge | `OJ01`, `OJ02`, `OJ03` | PASS | List, workspace va submission history co pham vi khac nhau ro rang. |
| Payment | `PAY01`, `PAY02`, `PAY03` | PASS | Cart, checkout va result co wireframe/state ro rang; cardinality order la open question nghiep vu, khong phai mismatch metadata. |
| Programming | `PROG01`, `PROG02`, `PROG03` | PASS WITH FINDING | `PROG03` nhat quan noi bo, nhung la Video Lesson va xung dot voi pham vi LessonContent da chot. |
| Quiz | `QUIZ01`, `QUIZ02` | PASS | Attempt va preview co component/state rieng. |
| Student | `STD01`, `STD02`, `STD03MyProfile`, `STD03StudentFavorites`, `STD04` | PASS WITH FINDING | Hai file dung ma `STD03`; can chot ma duy nhat truoc implementation va API matrix. |
| Teacher | `TC01` den `TC15` | PASS WITH FINDING | `TC06` va `TC12` van mo ta Video; cac man hinh con lai nhat quan voi wireframe noi bo. |

## 5. Findings co evidence

| ID | Muc do | Evidence trong wireframe Markdown | Van de | Xu ly bat buoc truoc khi dung lam requirement |
| --- | --- | --- | --- | --- |
| WMD-01 | Cao, da khoanh vung | `AUTH02Register.md`: heading/filename la Register, nhung wireframe, component map va states deu ghi Forgot Password va email reset. | Ma/ten metadata va giao dien mo ta hai man hinh khac nhau. | Da them metadata `Trang thai dinh danh: VERIFY`. Can cung cap wireframe Register dung hoac doi ma/ten file sau khi Product Owner xac nhan. |
| WMD-02 | Cao | `LEARNING00`, `CLASS01`, `PROG03`, `TC06`, `TC12` mo ta Video player, `watched_percent`, hoac Video Lesson; `AD02` hien thi Video trong curriculum preview. | Xung dot voi quyet dinh du an: LessonContent chi co `READING`, `QUIZ`, `PROBLEM`. | Gap analysis phai liet ke day la UI can sua. Khong tao DB enum/table/API Video; khong tu xoa hay doi ten wireframe trong Task 22. |
| WMD-03 | Trung binh | `STD03MyProfile.md` va `STD03StudentFavorites.md` deu dung ma `STD03`, trong khi wireframe hien thi hai man hinh khac nhau. | Screen code khong duy nhat, de lam sai route map, test case va API coverage matrix. | Chon ma moi cho mot man hinh khi owner xac nhan; giu filename hien tai va ghi finding cho toi khi co quyet dinh. |
| WMD-04 | Trung binh | 50 metadata route co nhan `VERIFY`; 7 route duoc ghi `suy luan`. | Route khong duoc xac minh chi bang wireframe; co nguy co gap/API mo ta endpoint theo route chua ton tai. | Duy tri nhan provenance; Task API coverage phai doi chieu router/frontend va API contract truoc khi chot route. |
| WMD-05 | Thap | Chi 11 man hinh co `## Business rules`; 42 man hinh con lai co UI/state nhung khong co rule nghiep vu doc lap. | Khong phai moi man hinh deu can rule. Tuy nhien, khong duoc suy ra authorization, state transition, database constraint tu layout. | Task 23 phai quyet dinh theo tung flow rule nao can bo sung va gan nguon/`VERIFY`/`Assumption`. |

## 6. Tai lieu structural

| File | Ket qua | Ly do |
| --- | --- | --- |
| `class/LEARNING00UnifiedLessonWorkspace.md` | STRUCTURAL WITH FINDING WMD-02 | Day la shell dung chung, khong co route/viewport theo mot man hinh. No can duoc sua de chi con Reading, Quiz, Problem o phase nghiep vu. |
| `README.md` | STRUCTURAL | Chi la huong dan doc wireframe va link tai lieu lien quan. Link toi audit nay da duoc bo sung. |
| `theme.md` | STRUCTURAL | Chi la design token/guideline, khong co component map/state cua man hinh. |
| `wireframe-manifest.md` | STRUCTURAL | Chi la inventory/provenance, khong la wireframe UI. |

## 7. Ket luan va cong vao Gap Analysis

**Task 22 dat ket qua `DONE WITH FINDINGS`:** metadata-to-wireframe Markdown audit da hoan thanh cho toan bo man hinh trong scope. Cac finding co evidence da duoc tach khoi du lieu chua xac nhan.

`gap-analysis.md` chi duoc dung cac input sau tu audit nay:

- WMD-01: xu ly identity cua AUTH02 nhu mot open question, khong tao Register flow tu file nay.
- WMD-02: liet ke UI Video can sua va cam mo ta Video nhu LessonContent trong DB/API/PRD.
- WMD-03: dat open question cho screen code, route map va test case naming.
- WMD-04: giu route `VERIFY`; khong trinh bay route la contract da ton tai.
- WMD-05: chi them validation/authorization khi Task 23 tim thay nguon nghiep vu, khong suy tu component.

SVG/raster/Figma co the duoc audit o task rieng sau nay, nhung khong lam thay doi ket qua metadata-to-wireframe Markdown cua tai lieu nay.
