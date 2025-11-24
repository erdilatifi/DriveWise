-- Indexes for scalable admin queries

-- 1. Performance indexes for Questions table (admin_questions)
-- Support faster filtering by category and status
CREATE INDEX IF NOT EXISTS idx_admin_questions_category ON admin_questions(category);
CREATE INDEX IF NOT EXISTS idx_admin_questions_is_published ON admin_questions(is_published);

-- Support faster text search on question_text (GIN index for ilike operations)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_admin_questions_text_search ON admin_questions USING gin (question_text gin_trgm_ops);


-- 2. Performance indexes for User Profiles (user_profiles)
-- Support faster filtering by roles
CREATE INDEX IF NOT EXISTS idx_user_profiles_roles ON user_profiles(is_admin, is_instructor);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at DESC);

-- Support faster text search on email and full_name
CREATE INDEX IF NOT EXISTS idx_user_profiles_email_search ON user_profiles USING gin (email gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_user_profiles_name_search ON user_profiles USING gin (full_name gin_trgm_ops);

-- 3. Composite indexes for common access patterns
-- For admin/questions: filtering by category AND searching text
CREATE INDEX IF NOT EXISTS idx_admin_questions_category_text ON admin_questions(category, question_text);
