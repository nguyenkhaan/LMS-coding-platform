# Wireframe Asset Manifest

## Cach doc manifest

Manifest nay chi ghi lai kha nang kiem chung asset tai workspace hien tai. No khong danh gia nghiep vu cua man hinh.

| Status | Y nghia | Viec duoc phep ket luan |
| --- | --- | --- |
| `VERIFIED_ASSET` | Asset cuc bo ton tai va da duoc render/doi chieu. | Layout/text/component nhin thay co evidence. Business rule van can PRD/API/DB evidence. |
| `ASSET_UNAVAILABLE` | Markdown tro toi asset nhung asset khong co trong workspace. | Chi dung metadata/ghi chu Markdown nhu evidence tam thoi; khong noi “trung khop hoan toan”. |
| `DESIGN_ONLY` | Man hinh bo sung tu flow nghiep vu, khong co source asset rieng. | Review flow va business rule; khong audit geometry voi SVG/raster. |
| `STRUCTURAL` | Huong dan, theme hoac shared shell, khong phai mot screen asset. | Kiem tra cross-reference va rule dung chung. |

Baseline hien tai: `docs/screen/` khong ton tai. Vi vay, toan bo status `ASSET_UNAVAILABLE` can doi asset truoc khi Task 22 co the ket luan layout trung khop hoan toan.

## Man hinh va metadata

| Code | Markdown | Route metadata | Viewport metadata | Asset status | Viec tiep theo |
| --- | --- | --- | --- | --- | --- |
| AD01 | `admin/AD01TeacherRegistrationReview.md` | `VERIFY: /admin/teacher-registration/:requestId` | `1920x2699` | ASSET_UNAVAILABLE | Can source admin SVG va contract permission/audit. |
| AD02 | `admin/AD02CourseApprovalReview.md` | `VERIFY: /admin/course-review/:courseId` | Khong co | DESIGN_ONLY | Verify flow moderation voi PRD/API. |
| AUTH01 | `auth/AUTH01Login.md` | `/auth/login` (suy luan) | `1600x1000` | ASSET_UNAVAILABLE | Xac nhan route voi Auth Provider. |
| AUTH02 | `auth/AUTH02Register.md` | `VERIFY route` | `1600x1000` | ASSET_UNAVAILABLE | Asset tung duoc ghi nhan trung AUTH03; can asset Register dung. |
| AUTH03 | `auth/AUTH03ForgotPassword.md` | `/auth/forgot-password` (suy luan) | `1600x1000` | ASSET_UNAVAILABLE | Reverify khi asset duoc cung cap. |
| AUTH04 | `auth/AUTH04SetPassword.md` | `/auth/set-password` (suy luan) | `1600x1000` | ASSET_UNAVAILABLE | Xac nhan reset-token flow. |
| AUTH05 | `auth/AUTH05LockScreen.md` | `/auth/lock` (suy luan) | `1600x1000` | ASSET_UNAVAILABLE | Xac nhan route/session-lock behavior. |
| AUTH06 | `auth/AUTH06OTP.md` | `/auth/otp` (suy luan) | `3200x2000` rendered `1600x1000` | ASSET_UNAVAILABLE | Xac nhan OTP route va resend policy. |
| AUTH07 | `auth/AUTH07TeacherRegistration.md` | `/auth/teacher-registration` (suy luan) | `1939x4281` | ASSET_UNAVAILABLE | Verify field mapping va teacher application state. |
| CLASS01 | `class/CLASS01Workspace.md` | `VERIFY: /classroom/workspace` | `1939x2181` | ASSET_UNAVAILABLE | Phai doi chieu lai sau C-01 LessonContent decision. |
| LEARNING00 | `class/LEARNING00UnifiedLessonWorkspace.md` | Shared shell | Khong co | STRUCTURAL | Sua de chi con Reading/Quiz/Problem sau phase gap. |
| COURSE01 | `course/COURSE01CourseCatalog.md` | `VERIFY: /courses` | `1620x2492` | ASSET_UNAVAILABLE | Verify catalog filters, favorite va CTA. |
| COURSE02 | `course/COURSE02CourseDetail.md` | `VERIFY: /courses/:courseId` | `1892x4505` | ASSET_UNAVAILABLE | Verify enrollment/review states. |
| COURSE03 | `course/Course03EmptyState.md` | `VERIFY: /courses/:courseId` | `1620x2492` | ASSET_UNAVAILABLE | Verify 404/unavailable handling. |
| COURSE04.1 | `course/Course04_1CourseDetailCommentTab.md` | `VERIFY: /courses/:courseId?tab=comments` | `1892x4481` | ASSET_UNAVAILABLE | Distinguish course review from lesson comment. |
| COURSE04.2 | `course/Course04_2CourseDetailProgressLessonTab.md` | `VERIFY: /courses/:courseId?tab=progress` | `1892x4481` | ASSET_UNAVAILABLE | Verify lock/progress policy. |
| COURSE04.3 | `course/Couser04_3CourseDetailInstructorPreviewTab.md` | `VERIFY: /courses/:courseId?tab=instructor` | `1892x5071` | ASSET_UNAVAILABLE | Correct filename typo only after source confirmation. |
| INS01 | `instructor/INS01InstructorGrid.md` | `VERIFY: /instructors` | `1600x2550` | ASSET_UNAVAILABLE | Verify instructor search/filter data. |
| INS02 | `instructor/INS02InstructorList.md` | `VERIFY: /instructors?view=list` | `1600x2550` | ASSET_UNAVAILABLE | Verify grid/list state. |
| INS03 | `instructor/INS03InstructorDetail.md` | `VERIFY: /instructors/:instructorId` | `VERIFY` | ASSET_UNAVAILABLE | Need valid asset geometry before UI implementation. |
| INTERVIEW01 | `interview/INTERVIEW01InterviewReport.md` | `VERIFY: /interview/report/:sessionId` | `1920x2013` | ASSET_UNAVAILABLE | Verify report state and one-report rule. |
| INTERVIEW02 | `interview/INTERVIEW02AIInterview.md` | `VERIFY: /interview` | `1927x1710` | ASSET_UNAVAILABLE | Verify session/resume/end behavior. |
| INTERVIEW03 | `interview/INTERVIEW03InterviewSetup.md` | `VERIFY: /interview/setup` | Khong co | DESIGN_ONLY | Verify topic, level, permission flow. |
| OJ01 | `online-judge/OJ01ProblemList.md` | `VERIFY: /online-judge/problems` | `1920x1715` | ASSET_UNAVAILABLE | Verify filters/tag/solved labels. |
| OJ02 | `online-judge/OJ02OnlineJudgeWorkspace.md` | `VERIFY: /online-judge/problems/:problemId` | `1920x1200` | ASSET_UNAVAILABLE | Verify run/submit/hidden testcase behavior. |
| OJ03 | `online-judge/OJ03SubmissionHistory.md` | `VERIFY: /online-judge/submissions` | `1920x1200` | ASSET_UNAVAILABLE | Verify immutable source/result detail. |
| PAY01 | `payment/PAY01ShoppingCart.md` | `VERIFY: /cart` | `1920x2418` | ASSET_UNAVAILABLE | Asset da co ghi chu XML blocker; can source da sua. |
| PAY02 | `payment/PAY02Checkout.md` | `VERIFY: /checkout` | `1600x1915` | ASSET_UNAVAILABLE | Chot one-course/multi-course truoc API/DB. |
| PAY03 | `payment/PAY03PaymentResult.md` | `VERIFY: /checkout/result/:orderId` | Khong co | DESIGN_ONLY | Verify payment lifecycle va enrollment result. |
| PROG01 | `programming/PROG01ProblemReading.md` | `VERIFY: /programming/:problemId/reading` | `1912x4304` | ASSET_UNAVAILABLE | Verify relation voi LessonContent Reading. |
| PROG02 | `programming/PROG02ProblemPreview.md` | `VERIFY: /programming/:problemId/preview` | `1912x3089` | ASSET_UNAVAILABLE | Verify quiz/problem preview states. |
| PROG03 | `programming/PROG03ProblemVideo.md` | `VERIFY: /programming/:problemId/video` | `1912x3089` | ASSET_UNAVAILABLE | Blocked by C-01/C-08; chot remove/rename/out-of-scope. |
| QUIZ01 | `quiz/QUIZ01QuizAttempt.md` | `VERIFY: /quiz/:quizId/attempt` | `1912x2922` | ASSET_UNAVAILABLE | Verify attempt/resume/submit contract. |
| QUIZ02 | `quiz/QUIZ02QuizPreview.md` | `VERIFY: /quiz/:quizId/preview` | `1912x3202` | ASSET_UNAVAILABLE | Verify attempt start and score policy. |
| STD01 | `student/STD01StudentDashboard.md` | `VERIFY: /dashboard` | `1561x2795` desktop | VERIFIED_ASSET | Layout verified; define metric/domain/API source next. |
| STD02 | `student/STD02StudentDashboardEnrolledCourse.md` | `VERIFY: /student/enrolled-courses` | `1600x1802` | ASSET_UNAVAILABLE | Verify list count and resume data. |
| STD03 Profile | `student/STD03MyProfile.md` | `VERIFY: /student/profile` | `1600x1639` | ASSET_UNAVAILABLE | Asset path points `needs-review`; code overlaps STD03 Favorites. |
| STD03 Favorites | `student/STD03StudentFavorites.md` | `VERIFY: /student/favorites` | `1600x1639` | ASSET_UNAVAILABLE | Verify favorite source and naming. |
| STD04 | `student/STD04TeacherApplication.md` | `VERIFY: /student/teacher-application` | Khong co | DESIGN_ONLY | Verify submit/resubmit/application status. |
| TC01 | `teacher/TC01TeacherDashboard.md` | `VERIFY: /teacher/dashboard` | `1920x2202` | ASSET_UNAVAILABLE | Verify metric definitions and permission. |
| TC02 | `teacher/TC02TeacherProfile.md` | `VERIFY: /teacher/profile` | `1920x2418` | ASSET_UNAVAILABLE | Verify profile field mapping. |
| TC03 | `teacher/TC03ViewStudent.md` | `VERIFY: /teacher/students` | `1920x2298` | ASSET_UNAVAILABLE | Verify ownership/student visibility. |
| TC04 | `teacher/TC04TeacherEarning.md` | `VERIFY: /teacher/earnings` | `1920x2476` | ASSET_UNAVAILABLE | Verify currency and payout behavior. |
| TC05 | `teacher/TC05TeacherCourseEnrollment.md` | `VERIFY: /teacher/course-enrollment` | `1914x2090` | ASSET_UNAVAILABLE | Verify enrollment/read model. |
| TC06 | `teacher/TC06TeacherLessonContentBuilder.md` | `VERIFY: /teacher/lesson-builder` | `1920x2204` | ASSET_UNAVAILABLE | Remove Video content after C-01. |
| TC07 | `teacher/TC07TeacherCurriculumReorder.md` | `VERIFY: /teacher/curriculum/reorder` | `1920x2097` | ASSET_UNAVAILABLE | Verify position/reorder transaction. |
| TC08 | `teacher/TC08TeacherSubmissionReview.md` | `VERIFY: /teacher/submissions` | `1600x1473` | ASSET_UNAVAILABLE | Verify student submission authorization. |
| TC09 | `teacher/TC09TeacherStudentProgress.md` | `VERIFY: /teacher/student-progress` | `1600x1473` | ASSET_UNAVAILABLE | Verify content-level progress source. |
| TC10 | `teacher/TC10TeacherCourseStudent.md` | `VERIFY: /teacher/course-students` | `1600x1473` | ASSET_UNAVAILABLE | Verify course ownership filter. |
| TC11 | `teacher/TC11TeacherCourseBuilder.md` | `VERIFY: /teacher/course-builder` | `1600x1486` | ASSET_UNAVAILABLE | Verify moderation submit/reject/resubmit flow. |
| TC12 | `teacher/TC12TeacherLessonContentPreview.md` | `VERIFY: /teacher/lesson-preview` | `1600x1467` | ASSET_UNAVAILABLE | Remove Video wording after C-01. |
| TC13 | `teacher/TC13TeacherCodingProblemManagement.md` | `VERIFY: /teacher/coding-problems` | `1920x1200` | ASSET_UNAVAILABLE | Verify separate OJ admin shell and editor permission. |
| TC14 | `teacher/TC14CourseApprovalStatus.md` | `VERIFY: /teacher/courses/:courseId/review-status` | Khong co | DESIGN_ONLY | Verify status/reviewer-note history. |
| TC15 | `teacher/TC15TeacherWalletPayout.md` | `VERIFY: /teacher/wallet` | Khong co | DESIGN_ONLY | Verify ledger/payout lifecycle and currency. |
| README | `README.md` | N/A | N/A | STRUCTURAL | Maintain source links and verification vocabulary. |
| Theme | `theme.md` | N/A | N/A | STRUCTURAL | Keep `VERIFY-FIGMA` markers until Figma context is available. |

## Verification checklist for Task 22

For every `VERIFIED_ASSET` or asset made available later, compare in this order:

1. File name/path, image type and viewport metadata.
2. Screen title, breadcrumb, navigation shell and major layout regions.
3. Visible labels, CTA, cards, table columns, badges and empty/error/loading state shown by asset.
4. Component map: each row must map to a visible region or be explicitly labelled as a business rule.
5. States and business rules: only keep claims backed by PRD/schema/API; otherwise use `VERIFY` or `Assumption`.

Do not mark a screen `VERIFIED_ASSET` merely because its Markdown link has a plausible file name.
