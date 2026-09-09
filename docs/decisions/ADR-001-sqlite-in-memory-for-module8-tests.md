# ADR-001: Use SQLite in-memory for Module 8 Tests

## Status
Accepted

## Date
2026-09-05

## Context
When implementing integration tests for Module 8 (Teacher Applications), we needed a database environment to test the SQLAlchemy ORM layer, including transactions, unique constraints, and relationships.
The team's global test infrastructure (e.g., testcontainers with PostgreSQL + factory_boy) was either missing, too complex to set up just for this module, or outside the scope of Module 8's immediate deliverables. However, testing without a real database (e.g., using `AsyncMock` to mock `AsyncSession`) would fail to catch real-world issues like `IntegrityError` from unique constraints or rollback failures.

## Decision
Use `aiosqlite` to provision an in-memory SQLite database specifically for the Module 8 test suite (`tests/module8/conftest.py`). We use SQLAlchemy's `create_all` to build the schema on the fly and populate it using direct ORM model inserts (`db_session.add()`) instead of raw IDs.

## Alternatives Considered

### Mocking `AsyncSession`
- Pros: Fast, no database setup required.
- Cons: Cannot verify transactions, foreign keys, or unique constraints. Rollback logic cannot be tested effectively.
- Rejected: Defeats the purpose of integration testing the persistence layer.

### Setting up Testcontainers + PostgreSQL
- Pros: Exact parity with production environment.
- Cons: Requires significant global infrastructure changes affecting the entire team, outside the scope of this module.
- Rejected: Too much overhead for a single feature module delivery. Backlogged for future team-wide implementation.

## Consequences
- Module 8 tests are robust, capable of catching real database constraint errors, and run extremely fast.
- The `aiosqlite` dependency is isolated to `[dev-dependencies]` in `pyproject.toml`.
- Future action (Backlog): Migrate these tests to use `testcontainers` and PostgreSQL when the global test infrastructure is established for the project.
