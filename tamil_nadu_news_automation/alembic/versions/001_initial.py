"""initial schema

Revision ID: 001
"""

from alembic import op
import sqlalchemy as sa

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Tables created via metadata for bootstrap; migration documents schema version.
    pass


def downgrade() -> None:
    pass
