"""Alert Note

Revision ID: d908261c4e9d
Revises: e664a2f70952
Create Date: 2024-04-11 00:36:55.645098

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd908261c4e9d'
down_revision = 'e664a2f70952'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('alert_note',
    sa.Column('created', sa.DateTime(), nullable=False),
    sa.Column('modified', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('contenttype', sa.String(length=1024), nullable=True),
    sa.Column('contentdata', sa.String(length=64), nullable=True),
    sa.Column('content', sa.String(length=10240), nullable=True),
    sa.Column('start_date', sa.DateTime(), nullable=True),
    sa.Column('end_date', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('alert_note')
    # ### end Alembic commands ###