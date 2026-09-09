# Teacher Application Module (Module 8)

## Overview
The Teacher Application Module manages the entire lifecycle of a user registering to become a teacher on the LMS platform. It enforces a strict state machine (DRAFT -> PENDING -> APPROVED / REJECTED) and requires comprehensive validation of Citizen Identity (CCCD) and educational degrees. The module features robust role-based access control, ensuring that students can manage their own drafts while only Admins can review and approve them.

This module is designed with security and compliance in mind, enforcing Audit Logging as a hard requirement before any sensitive Personally Identifiable Information (PII) like CCCD is returned to an Admin.

## Endpoints

### Student Endpoints (Requires `STUDENT` or base User role)
- **POST `/api/teacher-applications`**
  - *Description:* Creates a new teacher application in DRAFT state. A teacher profile must already exist.
- **GET `/api/teacher-applications/me`**
  - *Description:* Returns the draft/pending/approved teacher application for the authenticated user.
- **PUT `/api/teacher-applications/me`**
  - *Description:* Updates the draft application. If the application is APPROVED, only a whitelist of fields (bio, date_of_birth, motivation) can be updated. Cannot update if PENDING.
- **POST `/api/teacher-applications/me/submit`**
  - *Description:* Submits the application for review. Validates that all required fields are present via `TeacherApplicationSubmitSchema` and changes the status to PENDING.

### Admin Endpoints (Requires `ADMIN` role)
- **GET `/api/admin/teacher-applications`**
  - *Description:* Returns a paginated list of teacher applications. Identity numbers (CCCD) are masked (e.g., `***7890`) and document URLs are hidden to prevent data leakage in bulk views. Can be filtered by status.
- **GET `/api/admin/teacher-applications/{application_id}`**
  - *Description:* Returns full, unmasked details of a teacher application (including CCCD images). **Security:** This endpoint strictly requires an Audit Log (`TEACHER_APPLICATION_VIEW`) to be inserted. If the DB fails to record the audit log, it raises a 500 error and blocks the data.
- **POST `/api/admin/teacher-applications/{application_id}/review`**
  - *Description:* Approves or rejects a pending application. Rejection requires a review note. Updates the application, writes to the history table (`TeacherRegisterHistoryModel`), and creates an audit log in a single transaction.

## How to Run the Service
The Teacher Application module is integrated into the core `business-application`.
To run it, use the standard startup command from the root of `business-application`:

```bash
uv run uvicorn src.app:app --port 4000 --reload
```
You can access the OpenAPI Swagger documentation at `http://localhost:4000/docs` to interact with these endpoints.

## How to Run Tests
This module has a dedicated integration test suite (20 test cases) that runs independently of external databases by provisioning an in-memory SQLite database via `aiosqlite`.

To run the module's tests:
```bash
uv run pytest tests/module8/ -v
```
*(No external database or Docker containers are required to test this module).*

## Architecture Decision Records (ADRs)
The following ADRs document critical design decisions made during the development of this module:
- [ADR-001: SQLite In-Memory for Module 8 Tests](../../../../../docs/decisions/ADR-001-sqlite-in-memory-for-module8-tests.md)
- [ADR-002: Require Note when Rejecting Teacher Applications](../../../../../docs/decisions/ADR-002-require-note-on-rejected.md)
- [ADR-003: Shared PK and Mandatory Audit Logging](../../../../../docs/decisions/ADR-003-shared-pk-and-mandatory-audit-logging.md)
