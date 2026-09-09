# ADR-003: Shared PK and Mandatory Audit Logging for Teacher Applications

## Status
Accepted

## Date
2026-09-05

## Context
When designing the teacher application system, we encountered two significant architectural and security considerations:
1. Identifying the relationship between a user, their teacher profile, and their application. `TeacherProfileModel` uses a shared Primary Key (`user_id`) instead of a distinct surrogate `id`.
2. Accessing sensitive CCCD (Citizen ID) information in the Admin detail endpoint (`GET /admin/teacher-applications/{id}`). The specification required that "accessing details must be audit logged."

## Decision
1. **Shared PK**: We embrace the shared PK design where `teacher_profile.user_id` is the primary key. In the service layer, we explicitly refer to `user_id` when linking `TeacherRegisterModel` (via `teacher_profile_id`). 
2. **Mandatory Audit Logging**: We treat the audit log as a strict precondition to returning sensitive data. The `get_application_detail_for_admin` service writes an `AuditLogModel` record (with a new `TEACHER_APPLICATION_VIEW` action) and issues an `await db.commit()`. If the commit fails (e.g., `IntegrityError`), the transaction is rolled back and an `HTTPException(500)` is raised.

## Alternatives Considered

### Return data even if Audit Log fails (Best-effort logging)
- Pros: Higher availability of the endpoint; admins can work even if the audit log table is having issues.
- Cons: Introduces a severe security loophole where sensitive PII (CCCD data) can be viewed without a trace.
- Rejected: Security and compliance overrule availability in this context.

## Consequences
- No PII is ever returned to an admin unless the system successfully writes an irrefutable audit trail.
- We must handle `IntegrityError` explicitly and raise 500 Server Error to halt the response.
- A test case specifically mocks `db.commit` to fail, ensuring that the 500 error is raised and no data is leaked.
