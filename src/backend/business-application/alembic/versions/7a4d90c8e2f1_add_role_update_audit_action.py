"""add ROLE_UPDATE audit action

Revision ID: 7a4d90c8e2f1
Revises: 63b183b7073b
Create Date: 2026-08-27 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


revision: str = "7a4d90c8e2f1"
down_revision: Union[str, Sequence[str], None] = "63b183b7073b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TYPE auditaction ADD VALUE IF NOT EXISTS 'ROLE_UPDATE'")


def downgrade() -> None:
    # PostgreSQL does not support removing an enum value safely.
    pass
