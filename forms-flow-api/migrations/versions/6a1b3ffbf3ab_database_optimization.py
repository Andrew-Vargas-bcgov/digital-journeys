"""database optimization

Revision ID: 6a1b3ffbf3ab
Revises: 82a8cd6c7aa6
Create Date: 2022-02-17 21:35:19.447289

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '6a1b3ffbf3ab'
down_revision = '82a8cd6c7aa6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('application', 'process_name')
    op.drop_column('application', 'process_key')
    op.drop_column('application', 'application_name')

    op.add_column('form_process_mapper', sa.Column('version', sa.Integer(), nullable=False, server_default='1'))
    op.execute('create temporary sequence version_upd;')
    op.execute('update form_process_mapper set version=nextval(\'version_upd\')')

    op.create_unique_constraint('_form_version_uc', 'form_process_mapper', ['form_id', 'version'])
    op.add_column('application_audit', sa.Column('submitted_by', sa.String(length=300), nullable=True))
    op.add_column('form_process_mapper', sa.Column('task_variable', postgresql.JSON(astext_type=sa.Text()), nullable=True))
    op.execute("update form_process_mapper set task_variable = '[]' where form_process_mapper.task_variable is null")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('_form_version_uc', 'form_process_mapper', type_='unique')
    op.drop_column('form_process_mapper', 'version')
    op.add_column('application', sa.Column('application_name', sa.VARCHAR(length=100), autoincrement=False, nullable=True))
    op.execute('update application set application_name = (select form_name from form_process_mapper where application.form_process_mapper_id = form_process_mapper.id)')
    op.alter_column('application', 'application_name', nullable=False )
    op.add_column('application', sa.Column('process_key', sa.VARCHAR(length=50), autoincrement=False, nullable=True))
    op.add_column('application', sa.Column('process_name', sa.VARCHAR(length=100), autoincrement=False, nullable=True))
    op.drop_column('application_audit', 'submitted_by')
    op.drop_column('form_process_mapper', 'task_variable')
    # ### end Alembic commands ###