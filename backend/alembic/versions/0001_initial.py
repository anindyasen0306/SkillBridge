from alembic import op
import sqlalchemy as sa
revision = '0001_initial'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('users', sa.Column('id', sa.Integer, primary_key=True), sa.Column('full_name', sa.String(120), nullable=False), sa.Column('email', sa.String(255), nullable=False), sa.Column('password', sa.String(255), nullable=False), sa.Column('is_active', sa.Boolean), sa.Column('avatar_url', sa.String(500)), sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()), sa.Column('updated_at', sa.DateTime(timezone=True)))
    op.create_index('ix_users_id', 'users', ['id'])
    op.create_index('ix_users_email', 'users', ['email'], unique=True)
    op.create_table('resume_analyses', sa.Column('id', sa.Integer, primary_key=True), sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False), sa.Column('filename', sa.String(255), nullable=False), sa.Column('resume_text', sa.Text), sa.Column('job_description', sa.Text, nullable=False), *[sa.Column(name, sa.JSON) for name in ['candidate_skills','required_skills','missing_skills','learning_suggestions']], sa.Column('match_score', sa.Float), sa.Column('raw_llm_response', sa.Text), sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()))
    op.create_index('ix_resume_analyses_id', 'resume_analyses', ['id'])

def downgrade():
    op.drop_table('resume_analyses')
    op.drop_table('users')
