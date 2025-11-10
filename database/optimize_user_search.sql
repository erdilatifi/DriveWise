-- ===================================================================
-- Optimize User Search Performance for Large Datasets
-- ===================================================================
-- Run this in Supabase SQL Editor
-- ===================================================================

-- IMPORTANT: Enable pg_trgm extension FIRST (must be before creating indexes)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add indexes for faster user searches (after extension is enabled)
CREATE INDEX IF NOT EXISTS idx_user_profiles_email_search 
ON user_profiles USING gin (email gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_user_profiles_full_name_search 
ON user_profiles USING gin (full_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at 
ON user_profiles (created_at DESC);

-- Add index for test_attempts user_id for faster counting
CREATE INDEX IF NOT EXISTS idx_test_attempts_user_id_only 
ON test_attempts (user_id);

-- Add composite index for common queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_blocked 
ON user_profiles (created_at DESC, is_blocked);

-- ===================================================================
-- Performance Tips:
-- ===================================================================
-- 1. These indexes speed up ILIKE searches (case-insensitive)
-- 2. GIN indexes are perfect for text search patterns
-- 3. The trigram extension enables fuzzy matching
-- 4. Composite indexes help with filtered queries
-- 
-- Expected improvements:
-- - Search queries: 10-100x faster
-- - Pagination: 5-10x faster
-- - Large datasets (10k+ users): Maintains sub-second response
-- ===================================================================
