# ADR-002: Require Note when Rejecting Teacher Applications

## Status
Accepted

## Date
2026-09-05

## Context
In the Teacher Application review process, an Admin can either APPROVE or REJECT a PENDING application. The original API specification did not explicitly state whether a review note is required. However, rejecting a teacher's application without providing a reason leads to poor user experience, as the applicant will not know what to correct (e.g., blurry CCCD, missing documents) for a subsequent application.

## Decision
Mandate that the `note` field is **required** when the review `status` is `REJECTED`, and **optional** when `APPROVED`. This rule is enforced at the DTO layer using Pydantic's `@model_validator` to reject bad requests with a 400/422 status code before they hit the service layer.

## Alternatives Considered

### Optional Note for both
- Pros: Simpler API schema.
- Cons: Admins might forget or skip writing reasons for rejection, resulting in confused applicants.
- Rejected: Bad for business logic and UX.

### Required Note for both
- Pros: Strict auditability.
- Cons: Approvals typically don't need extensive reasoning beyond "All good", causing unnecessary friction for Admins.
- Rejected: Unnecessary friction.

## Consequences
- The API explicitly returns a validation error if a rejection lacks a note.
- The applicant will always have actionable feedback upon rejection.
- The `note` is persisted in both the `TeacherRegisterModel` (`reviewed_note`) and `TeacherRegisterHistoryModel`.
