# Kế hoạch đồng bộ tài liệu theo Meeting buổi 3

## Mục tiêu

Đồng bộ `docs/plans/overall-plan.md`, `docs/prd-documents/prd.md`, `docs/prd-documents/gap-analysis.md`, `docs/specs/api_spec.md` và ưu tiên `docs/DATABASE.txt` với các quyết định đã chốt trong `docs/meetings/meeting-buoi-3.md`. Giữ cấu trúc cấp mục và cách trình bày hiện có của mỗi tài liệu; chỉ thay đổi nội dung nghiệp vụ, schema, contract và task để chúng mô tả cùng một MVP.

## Quyết định đầu vào đã chốt

- Teacher application có quan hệ 1-1 với `teacher_profile`; application hiện hành là duy nhất, lịch sử transition dùng `teacher_register_history`.
- `education_entries` và `experience_entries` là JSON trong `teacher_profile`; không còn bảng riêng cho hai dữ liệu này.
- Application `PENDING` khóa chỉnh sửa; `REJECTED` mở lại để sửa và submit; `APPROVED` chỉ cho sửa field không nhạy cảm đã được whitelist.
- Course dùng `DRAFT -> PENDING_REVIEW -> APPROVED | REJECTED`; `ARCHIVED` ngừng bán nhưng không thu hồi enrollment đã có.
- Currency là `USD`, lưu `decimal` với 2 chữ số thập phân; minimum payout là `0.00 USD`.
- MVP thanh toán trực tiếp một course, không có Cart/Order. Một Student/course có thể có nhiều transaction lịch sử nhưng chỉ một `PENDING` chưa hết hạn; payment hoàn tất chỉ tạo một enrollment.
- PayOS được mô phỏng sát integration thật; chỉ webhook backend có chữ ký test được chuyển transaction sang `COMPLETED`.
- Một Student chỉ có một course review cho mỗi course đã enrollment.
- Quiz dùng bảng `quiz_attempt` riêng; không có save/resume và mỗi lần làm bắt đầu lại từ đầu.
- Problem completion dùng `ACCEPTED` cùng `passing_score` do Teacher cấu hình.
- AI Interview là voice-first với speech-to-text và text fallback; camera optional preview-only; backend chỉ lưu message text và một final report tổng hợp, không lưu media hoặc feedback từng câu.

## Decision ledger và target mapping

| Quyết định đã chốt | `DATABASE.txt` | PRD / gap analysis | API spec | Overall plan |
| --- | --- | --- | --- | --- |
| Teacher profile/application 1-1 và history riêng | `teacher_profile`, `teacher_register`, `teacher_register_history` | PRD §2–3; gap `teacher_register` | DTO §2.4; route §5 | Phase 0 BE-0.2, Phase 2 BE-2.1–2.4 / FE-2.1–2.2 |
| Education/experience là JSON của profile | `teacher_profile`; xoá bảng education/experience | PRD §2 Teacher; gap `teacher_register` và bảng mới | DTO §2.4; route §5 | Phase 2 BE-2.1, FE-2.1 |
| Write policy theo application status | Comment/constraint của `teacher_register` | PRD §3 Teacher application; gap `teacher_register` | §4 profile và §5 application | Phase 2 BE-2.2–2.3, FE-2.1 |
| Course moderation và archive access | `CourseStatus`, `courses`, moderation history | PRD §3 Course moderation; gap `course_moderation` | §6.1–6.2 | Phase 0 BE-0.1, Phase 3 BE-3.1–3.4 / FE-3.1–3.3 |
| USD, 2-decimal amount và payout minimum | money fields in `courses`, `transaction`, `wallet`, `payout_request` | PRD §3/§5; gap commerce/wallet | §2.1, §9–10 | Phase 0 BE-0.1, Phase 4 BE-4.1–4.5, Phase 8 BE-8.1–8.2 |
| Direct one-course transaction; no Cart/Order | `transaction`, `enrollment`; xoá Cart/Order tables | PRD §2/§3/§5/§9; gap commerce | DTO §2.4; §9; §14 | Phase 4 BE-4.1–4.4 / FE-4.1–4.2 |
| Signed mock PayOS webhook is the sole completion authority | `transaction` provider/signature fields; audit relation | PRD §3/§5/§8; gap commerce/notification | §9, §15 | Phase 4 BE-4.3–4.4 / FE-4.2 |
| One review per enrolled Student/course | `course_review` composite unique | PRD §2 Student; gap catalog/review | DTO §2.4, §6.1 | Phase 3 BE-3.1/3.4, FE-3.1 |
| Separate restart-only quiz attempt | new `quiz_attempt`, terminal `quiz_submission` relation | PRD §4; gap quiz/OJ | DTO §2.4, §8.1 | Phase 5 BE-5.4 / FE-5.2 |
| Problem uses Teacher-configured passing score | `problem` or approved completion-policy source | PRD §4; gap learning/quiz/OJ | §7.2, §8.2 | Phase 5 BE-5.2/5.4, Phase 6 BE-6.1–6.4 |
| Voice-first Interview and aggregate final report | `interview_session`, text `interview_message`, `interview_reports` | PRD §1/§3/§6/§9; gap AI Interview | DTO §2.4, §11 | Phase 7 BE-7.1–7.3 / FE-7.1–7.2 |

### Phân loại các câu hỏi cũ

| Câu hỏi cũ | Trạng thái | Hành động downstream |
| --- | --- | --- |
| Course dùng `PENDING_REVIEW/APPROVED` hay `PENDING/PUBLISHED`? | Đã chốt | Dùng `PENDING_REVIEW/APPROVED`; bỏ nhãn `GATED` và mapping `PUBLISHED` chỉ còn là migration legacy. |
| Currency, rounding và minimum payout? | Đã chốt | Dùng `USD`, decimal 2 chữ số, `0.00 USD`. |
| Một hay nhiều course trong order? | Đã chốt | Không dùng Cart/Order; thanh toán trực tiếp một course/transaction. |
| Field Profile/Application, history và edit policy? | Đã chốt | Dùng relation 1-1, profile JSON và policy theo status. |
| Một hay nhiều course review? | Đã chốt | Unique Student/course sau khi enrollment. |
| Mở rộng `quiz_submission` hay tạo `quiz_attempt`; có save/resume? | Đã chốt ở mức nghiệp vụ | Tạo `quiz_attempt`; không save/resume. Cần mô tả chính xác FK/cardinality với terminal submission ở Task 2. |
| Problem completion và passing score? | Đã chốt | `ACCEPTED` cùng Teacher-configured `passing_score`. |
| Interview feedback/skill score theo câu? | Đã chốt | Chỉ final report aggregate; bỏ persistence/DTO feedback từng câu. |
| Revenue split, settlement chi tiết | Còn mở | Giữ `GATED`/open question có chủ đích. |
| Activity day, timezone, streak, study time | Còn mở | Giữ `GATED`/open question có chủ đích. |
| `docs/database.txt` legacy mirror | Đã chốt ở Task 6 | Lowercase path đã retired/không tồn tại; chỉ `DATABASE.txt` là schema proposal canonical. |

## Dependency graph

```text
Meeting 3 decisions
        |
        v
DATABASE.txt (canonical entity/enum/constraint model)
        |
        +--> prd.md (scope, role, lifecycle, NFR)
        +--> gap-analysis.md (current-to-target migration gaps)
        |        |
        |        v
        +--> api_spec.md (DTO, endpoint, ownership, error/idempotency contract)
        |
        v
overall-plan.md (phases, deliverables, acceptance gates)
        |
        v
cross-document audit + legacy database mirror decision
```

## Task list

### Task 1: Freeze the decision ledger and target mapping — Completed

**Description:** Map each confirmed Meeting 3 decision to the exact sections in the five target documents and mark all former open questions as resolved or still open. Do not infer policy not approved in the meeting.

**Acceptance criteria:**

- [x] Every decision in the input list maps to at least one `DATABASE.txt`, PRD, gap, API and/or roadmap section.
- [x] Resolved questions are identified for removal from downstream open-question/gated lists; unresolved ones remain explicit in the ledger.
- [x] Terms use one canonical vocabulary: `teacher_registered`/`teacher_register`, `USD`, `APPROVED`, `PENDING_REVIEW`, `quiz_attempt` and direct transaction.

**Verification:**

- [x] Review mapping against `docs/meetings/meeting-buoi-3.md`.
- [x] Search for obsolete decision wording before content edits begin.

**Dependencies:** None.

**Files likely touched:** `docs/meetings/meeting-buoi-3.md` only if a confirmed decision needs clarification; otherwise no source-of-truth edit.

**Estimated scope:** Small.

### Task 2: Update `DATABASE.txt` as the canonical model — Completed

**Description:** Apply the confirmed entity, enum, relation and constraint changes before changing any API contract. This is the highest-risk task because every downstream document depends on its terminology and ownership model.

**Acceptance criteria:**

- [x] `teacher_profile` contains the approved public/profile fields, including JSON `education_entries` and `experience_entries`; `teacher_register` has a unique FK relation to it, sensitive application data and the mutable/non-mutable policy in comments.
- [x] Removed `teacher_education`, `teacher_experience`, `cart`, `cart_item`, `orders` and `order_item`; `transaction` directly references Student and Course and uses `USD`, a two-decimal amount, expiry, provider reference and verified webhook state.
- [x] Documented the one-active-pending-attempt rule as a transaction/service-concurrency invariant, not an invalid time-dependent database unique constraint; retained unique enrollment and one course review per Student/course.
- [x] Added `quiz_attempt` with a 1-1 relationship to terminal `quiz_submission`, removed in-progress save/resume semantics and added the Teacher-configured problem passing-score source.
- [x] Removed interview per-question feedback/skill-score persistence while retaining text messages, one report/session and no media storage.

**Verification:**

- [x] `rg` confirms no canonical Cart/Order or separate Teacher education/experience table declarations remain.
- [x] Mapped every Task 2 business resource to a table, column or explicitly documented projection/command source for Tasks 3–4.
- [x] Reviewed constraints, enum comments and legacy mappings; downstream `GATED` cleanup remains assigned to Tasks 3–4.

**Dependencies:** Task 1.

**Files likely touched:** `docs/DATABASE.txt`.

**Estimated scope:** Medium.

### Task 3: Align the PRD and gap analysis to the canonical model — Completed

**Description:** Update business scope and the current-to-target gap record using Task 2 terminology. Preserve their current headings/tables, but replace obsolete Cart/Order, payment, Teacher, Quiz and Interview content.

**Acceptance criteria:**

- [x] PRD describes direct single-course checkout, USD, signed mock PayOS webhook, retry attempts and idempotent enrollment; Cart/Order and multi-item checkout are out of scope.
- [x] PRD defines Teacher edit locking, course public/archive access, quiz restart-only attempts, problem passing-score policy, and voice-first Interview with text fallback.
- [x] Gap analysis records the exact schema/API/UI changes required, not already-obsolete proposals; its resolved-decision list agrees with the meeting.
- [x] Both documents remove resolved questions and retain only genuinely undecided policy.

**Verification:**

- [x] Compared lifecycle strings and payment invariants line-by-line with `DATABASE.txt`.
- [x] Keyword audit for `cart`, `order`, `PUBLISHED`, `resume`, `skill_scores`, `question_feedback`, `chatbot`, `audio` and `video` distinguishes valid legacy/history mention from active MVP requirements.

**Dependencies:** Task 2.

**Files likely touched:** `docs/prd-documents/prd.md`, `docs/prd-documents/gap-analysis.md`.

**Estimated scope:** Medium.

### Task 4: Rewrite the API contract around the resolved decisions — Completed

**Description:** Revise DTO mapping, route tables, authorization and idempotency rules to match the canonical schema and user-facing flows. Keep the existing section layout, but replace Cart/Order routes with direct transaction/checkout routes and mark legacy routes accurately.

**Acceptance criteria:**

- [x] Teacher profile/application DTOs use the 1-1 relation, JSON education/experience, role-filtered sensitive fields and state-specific write permissions.
- [x] Course status is no longer `GATED`; catalog, submit/review and archive routes enforce the agreed lifecycle/access policy.
- [x] Commerce section has direct checkout/payment-status routes, no Cart/Order DTOs/routes, multiple historical attempts, only one active pending payment, USD decimal values and signed mock PayOS webhook ownership.
- [x] Quiz routes model start/submit/history without save/resume; Problem routes expose the configured passing score only as authorized data.
- [x] Interview routes accept text generated by speech-to-text or fallback typing, do not present a chatbot interaction model, and return only a final aggregate report.

**Verification:**

- [x] Every write endpoint has actor, ownership, state transition, validation and idempotency behavior.
- [x] Every DTO field maps to Task 2 schema or is labelled command/projection/transient.
- [x] All resolved rows are removed from API section 14 `GATED` list.

**Dependencies:** Tasks 2–3.

**Files likely touched:** `docs/specs/api_spec.md`.

**Estimated scope:** Medium.

### Task 5: Re-sequence the overall implementation plan — Completed

**Description:** Update phase objectives, task names, outputs and acceptance gates while preserving the roadmap's existing phase structure. The plan must build direct payment, Teacher data rules, quiz attempts and voice-first Interview in dependency order.

**Acceptance criteria:**

- [x] Phase 0 records confirmed decisions as baseline rather than blockers.
- [x] Phase 2 implements the 1-1 Teacher model and edit-lock policy.
- [x] Phase 3 uses the agreed course lifecycle; Phase 4 removes Cart/Order work and targets direct transaction plus simulated signed PayOS webhook.
- [x] Phase 5/6 use `quiz_attempt` and problem passing score; Phase 7 uses voice-first/text-only persistence and aggregate report.
- [x] Phase completion criteria refer only to current contract/schema resources.

**Verification:**

- [x] Each roadmap task can be traced to a PRD requirement, an API section and a database resource.
- [x] No planned deliverable depends on removed Cart/Order or per-question Interview feedback resources.

**Dependencies:** Tasks 2–4.

**Files likely touched:** `docs/plans/overall-plan.md`.

**Estimated scope:** Medium.

### Task 6: Cross-document acceptance audit and legacy-mirror disposition — Completed

**Description:** Prove the five target documents describe the same system, then handle the explicitly documented `docs/database.txt` legacy mirror without creating a second conflicting schema source.

**Acceptance criteria:**

- [x] A single matrix verifies Teacher, Course, Payment, Quiz/Problem and Interview terms across database, PRD, gap, API and roadmap.
- [x] No resolved decision remains labelled `GATED`, an open question, or a contradictory legacy requirement.
- [x] `docs/database.txt` is either synchronized from `docs/DATABASE.txt` or explicitly marked as a non-authoritative retired mirror, according to its required compatibility purpose.

**Verification:**

- [x] Run repository-wide `rg` audits for obsolete entities, status names, currency and Interview terms.
- [x] Review diffs to ensure only documentation/task-control files changed; no wireframe/source implementation is modified.
- [x] Validate Markdown links and heading structure of each target file.

### Ma trận nghiệm thu liên tài liệu — Task 6

| Nghiệp vụ | `DATABASE.txt` | PRD | Gap analysis | API spec | Overall plan | Kết quả audit |
| --- | --- | --- | --- | --- | --- | --- |
| Teacher Profile/Application | `teacher_profile`, 1-1 `teacher_register`, JSON education/experience, history | §2–§3 | `teacher_register` | §4–§5, §15 | Phase 2 | Đồng bộ: PENDING lock; APPROVED sửa profile + chỉ whitelist application không nhạy cảm |
| Course lifecycle | `CourseStatus`, `courses`, moderation history | §3 Course moderation | `course_moderation`, `catalog_favorite_review` | §6, §15 | Phase 3 | Đồng bộ: `DRAFT/PENDING_REVIEW/APPROVED/REJECTED/ARCHIVED`; PUBLISHED chỉ legacy |
| Checkout/Enrollment | `transaction`, `enrollment`, USD/payment enums | §3 Payment, §5 | `payment_enrollment` | §9, §15 | Phase 4 | Đồng bộ: one-course direct checkout, signed PayOS mock completion, one active PENDING, unique enrollment |
| Quiz/Problem | `quiz_attempt` + terminal submission; `problem.passing_score` | §4 | `quiz_online_judge`, progress | §8, §15 | Phases 5–6 | Đồng bộ: không save/resume; completion khi đạt passing score |
| AI Interview | text `interview_message`, aggregate `interview_reports` | §3, §6 | `ai_interview` | §11, §15 | Phase 7 | Đồng bộ: voice-first/STT + typed fallback, camera preview-only, không media/chatbot/per-question feedback |
| Legacy lowercase schema path | Header `DATABASE.txt` | §10 Source of truth | Canonical-source note | §14 | Phase 0 / M0 | Đã chốt: `docs/database.txt` retired/không tồn tại; không phải mirror hoặc input migration |

**Dependencies:** Tasks 2–5.

**Files likely touched:** the five target files; lowercase path confirmed retired/absent, so no `docs/database.txt` update is required.

**Estimated scope:** Medium.

## Checkpoints

### Checkpoint A: Canonical foundation (after Tasks 1–2)

- [x] `DATABASE.txt` has no unresolved conflict with Meeting 3.
- [x] Schema terminology is stable enough for contract work.
- [x] Human review before PRD/API edits.

### Checkpoint B: Contract alignment (after Tasks 3–4)

- [x] PRD, gap analysis and API agree on all confirmed state machines and payment/interview flows.
- [x] All API fields have a schema/command/projection source.
- [x] Human review before roadmap changes.

### Checkpoint C: Documentation acceptance (after Tasks 5–6)

- [x] The five target documents use the same vocabulary and scope.
- [x] No unapproved implementation, wireframe or migration changes were made.
- [x] Legacy database mirror decision is visible and unambiguous.

## Risks and mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Removing Cart/Order leaves stale routes, DTOs or schema references | High | Update schema first, then perform repository-wide keyword audit in Task 6. |
| Active pending payment cannot be enforced with a naive time-based unique index | High | Document transaction locking/expiry transition and idempotency as service invariants. |
| Teacher profile/application relation reintroduces duplicated field ownership | High | Preserve a field-ownership map: profile JSON/public data vs application review/PII data. |
| `quiz_attempt` and `quiz_submission` overlap semantically | High | Define their one-to-one/terminal relationship in Task 2 before API routes are changed. |
| "No chatbot" accidentally removes required text persistence | Medium | Specify voice-first UI separately from text-only backend message contract. |
| `docs/database.txt` becomes a competing schema source | Medium | Resolve it only in the final audit, preserving `DATABASE.txt` as canonical. |

## Remaining open questions

- Revenue-split percentage and payout settlement mechanism are not present in the confirmed Meeting 3 decisions.
- Definition of daily activity, streak and study-time remains unchanged and requires a later Product Owner decision.
