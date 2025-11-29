-- ===================================================================
-- DRIVEWISE - COMPLETE DATABASE SCHEMA (V3)
-- ===================================================================
-- Run this ENTIRE file in Supabase SQL Editor to set up the database schema.
-- This replaces all previous setup scripts.
-- ===================================================================

-- Enable required extensions
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- Safely handle pg_trgm extension move/creation
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm') THEN
    -- If it exists (e.g. in public), move it to extensions
    ALTER EXTENSION pg_trgm SET SCHEMA extensions;
  ELSE
    -- If it doesn't exist, create it in extensions
    CREATE EXTENSION "pg_trgm" WITH SCHEMA extensions;
  END IF;
END $$;

-- Ensure extensions are in the search path
ALTER DATABASE postgres SET search_path TO public, extensions;

-- ===================================================================
-- STEP 1: Disable RLS on existing tables (for clean setup)
-- ===================================================================

ALTER TABLE IF EXISTS user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS test_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS test_attempt_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS student_instructor_links DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS study_materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS material_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS decision_trainer_scenarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS decision_trainer_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS decision_trainer_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS decision_trainer_badges DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payment_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bug_reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_feedback DISABLE ROW LEVEL SECURITY;

-- Drop legacy views if they exist to clean up Linter errors
DROP VIEW IF EXISTS decision_trainer_leaderboard;
DROP MATERIALIZED VIEW IF EXISTS decision_trainer_leaderboard; -- In case we re-run
DROP VIEW IF EXISTS tests_leaderboard;

-- ===================================================================
-- STEP 2: Create ENUMS
-- ===================================================================

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'license_category') THEN
        CREATE TYPE license_category AS ENUM ('A', 'B', 'C', 'D');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'language_code') THEN
        CREATE TYPE language_code AS ENUM ('sq', 'en');
    END IF;
END $$;

-- ===================================================================
-- STEP 3: Core Tables - USER PROFILES
-- ===================================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(50),
  date_of_birth DATE,
  address TEXT,
  preferred_language language_code DEFAULT 'sq',
  is_admin BOOLEAN DEFAULT false,
  is_blocked BOOLEAN DEFAULT false,
  app_rating INTEGER,
  avatar_url TEXT,
  subscription_id TEXT, -- Added for subscription management
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- STEP 4: Populate user_profiles for existing auth.users
-- ===================================================================

INSERT INTO user_profiles (id, email, full_name, created_at, updated_at)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', email) as full_name,
  created_at,
  updated_at
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.users.id
)
ON CONFLICT (id) DO NOTHING;

-- ===================================================================
-- STEP 5: Theory Test System - ADMIN QUESTIONS
-- ===================================================================

CREATE TABLE IF NOT EXISTS admin_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(10) NOT NULL CHECK (category IN ('A', 'B', 'C', 'D')),
  test_number INTEGER NOT NULL CHECK (test_number BETWEEN 1 AND 10),
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  correct_answer VARCHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C')),
  image_url TEXT,
  topic VARCHAR(100),
  difficulty VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category, test_number, question_text)
);

-- ===================================================================
-- STEP 6: Theory Test System - TEST ATTEMPTS
-- ===================================================================

CREATE TABLE IF NOT EXISTS test_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  category VARCHAR(10) NOT NULL,
  test_number VARCHAR(20) NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  time_taken_seconds INTEGER,
  is_assigned BOOLEAN DEFAULT false,
  assigned_by UUID REFERENCES user_profiles(id),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- STEP 7: Theory Test System - TEST ATTEMPT ANSWERS
-- ===================================================================

CREATE TABLE IF NOT EXISTS test_attempt_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_attempt_id UUID REFERENCES test_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES admin_questions(id),
  selected_answer VARCHAR(10), -- Supports multiple answers like "A,B,C"
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- STEP 8: Decision Trainer System - SCENARIOS
-- ===================================================================

CREATE TABLE IF NOT EXISTS decision_trainer_scenarios (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 4),
  question TEXT NOT NULL,
  image_url TEXT,
  options JSONB NOT NULL,
  correct_explanation TEXT NOT NULL,
  real_world_tip TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 25,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- STEP 9: Decision Trainer System - USER PROGRESS
-- ===================================================================

CREATE TABLE IF NOT EXISTS decision_trainer_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  total_xp INTEGER DEFAULT 0,
  scenarios_completed INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  best_time_seconds INTEGER,
  average_time_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, category)
);

-- ===================================================================
-- STEP 10: Decision Trainer System - ATTEMPTS
-- ===================================================================

CREATE TABLE IF NOT EXISTS decision_trainer_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_id TEXT NOT NULL,
  category TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  selected_options JSONB NOT NULL CHECK (jsonb_typeof(selected_options) = 'array'),
  time_taken_ms INTEGER,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- STEP 11: Decision Trainer System - BADGES/ACHIEVEMENTS
-- ===================================================================

CREATE TABLE IF NOT EXISTS decision_trainer_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, badge_type)
);

-- ===================================================================
-- STEP 12: Additional Tables - STUDY MATERIALS
-- ===================================================================

CREATE TABLE IF NOT EXISTS study_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id INTEGER NOT NULL,
  category license_category,
  title_en TEXT NOT NULL,
  title_sq TEXT NOT NULL,
  content_en JSONB NOT NULL,
  content_sq JSONB NOT NULL,
  order_index INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(chapter_id)
);

CREATE TABLE IF NOT EXISTS material_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES study_materials(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption_en TEXT,
  caption_sq TEXT,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- STEP 14: Payments & Subscriptions
-- ===================================================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  category license_category NOT NULL,
  plan_tier VARCHAR(20) NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, paid, failed, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  provider_status VARCHAR(50) NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(10) NOT NULL,
  raw_payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  plan_tier TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS user_plans_user_category_key ON user_plans (user_id, category);

-- ===================================================================
-- STEP 15: Bug Reports & Feedback
-- ===================================================================

CREATE TABLE IF NOT EXISTS bug_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  steps_to_reproduce TEXT,
  location VARCHAR(50),
  device_browser TEXT,
  contact_email TEXT,
  status VARCHAR(20) DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- No FK to allow user deletion
  display_name TEXT,
  avatar_url TEXT,
  email TEXT,
  reason TEXT NOT NULL,
  comment TEXT,
  is_public_allowed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- STEP 16: VIEWS (Materialized)
-- ===================================================================

CREATE MATERIALIZED VIEW decision_trainer_leaderboard AS
SELECT 
  p.user_id,
  COALESCE(up.full_name, up.email) as full_name,
  up.email,
  SUM(p.total_xp) as total_xp,
  SUM(p.scenarios_completed) as total_scenarios,
  SUM(p.correct_answers) as total_correct,
  SUM(p.total_attempts) as total_attempts,
  MAX(p.best_streak) as best_streak,
  MIN(p.best_time_seconds) as best_time_seconds,
  ROUND(AVG(p.average_time_seconds)) as average_time_seconds,
  CASE 
    WHEN SUM(p.total_attempts) > 0 
    THEN ROUND((SUM(p.correct_answers)::NUMERIC / SUM(p.total_attempts)::NUMERIC) * 100, 1)
    ELSE 0 
  END as accuracy,
  COUNT(DISTINCT p.category) as categories_completed
FROM decision_trainer_progress p
LEFT JOIN user_profiles up ON p.user_id = up.id
GROUP BY p.user_id, up.full_name, up.email
ORDER BY total_xp DESC, best_time_seconds ASC;

CREATE UNIQUE INDEX idx_dt_leaderboard_user_id ON decision_trainer_leaderboard(user_id);

CREATE OR REPLACE FUNCTION refresh_decision_trainer_leaderboard()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY decision_trainer_leaderboard;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS refresh_dt_leaderboard_on_progress ON decision_trainer_progress;
CREATE TRIGGER refresh_dt_leaderboard_on_progress
  AFTER INSERT OR UPDATE OR DELETE ON decision_trainer_progress
  FOR EACH STATEMENT
  EXECUTE FUNCTION refresh_decision_trainer_leaderboard();

GRANT SELECT ON decision_trainer_leaderboard TO authenticated;
GRANT SELECT ON decision_trainer_leaderboard TO anon;

-- ===================================================================
-- STEP 17: INDEXES
-- ===================================================================

-- User Profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_blocked ON user_profiles(is_blocked);
CREATE INDEX IF NOT EXISTS idx_user_profiles_admin ON user_profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_id ON user_profiles(subscription_id);

-- Admin Questions
CREATE INDEX IF NOT EXISTS idx_admin_questions_category ON admin_questions(category);
CREATE INDEX IF NOT EXISTS idx_admin_questions_test_number ON admin_questions(test_number);
CREATE INDEX IF NOT EXISTS idx_admin_questions_category_test ON admin_questions(category, test_number);

-- Test Attempts
CREATE INDEX IF NOT EXISTS idx_test_attempts_user ON test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_category ON test_attempts(category);
CREATE INDEX IF NOT EXISTS idx_test_attempts_completed ON test_attempts(completed_at);
CREATE INDEX IF NOT EXISTS idx_test_attempts_completed_at ON test_attempts(completed_at);

-- Answers
CREATE INDEX IF NOT EXISTS idx_test_attempt_answers_test_attempt ON test_attempt_answers(test_attempt_id);
CREATE INDEX IF NOT EXISTS idx_test_attempt_answers_question ON test_attempt_answers(question_id);

-- Decision Trainer
CREATE INDEX IF NOT EXISTS idx_dt_scenarios_category ON decision_trainer_scenarios(category);
CREATE INDEX IF NOT EXISTS idx_dt_scenarios_active ON decision_trainer_scenarios(is_active);
CREATE INDEX IF NOT EXISTS idx_dt_progress_user ON decision_trainer_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_dt_progress_category ON decision_trainer_progress(category);
CREATE INDEX IF NOT EXISTS idx_dt_attempts_user ON decision_trainer_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_dt_attempts_scenario ON decision_trainer_attempts(scenario_id);
CREATE INDEX IF NOT EXISTS idx_dt_attempts_selected_options ON decision_trainer_attempts USING GIN (selected_options);
CREATE INDEX IF NOT EXISTS idx_dt_attempts_created_at ON decision_trainer_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_dt_badges_user ON decision_trainer_badges(user_id);

-- Orders & Plans
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS user_plans_user_id_idx ON user_plans (user_id);
CREATE INDEX IF NOT EXISTS user_plans_status_idx ON user_plans (status);
CREATE INDEX IF NOT EXISTS user_plans_category_idx ON user_plans (category);

-- Feedback & Bug Reports
CREATE INDEX IF NOT EXISTS idx_user_feedback_public ON user_feedback(is_public_allowed);
CREATE INDEX IF NOT EXISTS idx_user_feedback_reason ON user_feedback(reason);

-- ===================================================================
-- STEP 18: FUNCTIONS & TRIGGERS (Core)
-- ===================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SET search_path = public, extensions
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop triggers if exist
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_admin_questions_updated_at ON admin_questions;
DROP TRIGGER IF EXISTS update_study_materials_updated_at ON study_materials;
DROP TRIGGER IF EXISTS update_material_images_updated_at ON material_images;
DROP TRIGGER IF EXISTS update_dt_scenarios_updated_at ON decision_trainer_scenarios;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_payment_transactions_updated_at ON payment_transactions;
DROP TRIGGER IF EXISTS update_user_plans_updated_at ON user_plans;

-- Create triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_questions_updated_at BEFORE UPDATE ON admin_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_study_materials_updated_at BEFORE UPDATE ON study_materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_material_images_updated_at BEFORE UPDATE ON material_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dt_scenarios_updated_at BEFORE UPDATE ON decision_trainer_scenarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_plans_updated_at BEFORE UPDATE ON user_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- ===================================================================
-- STEP 19: RPC FUNCTIONS (For Performance/Admin)
-- ===================================================================

-- 1. Get User Dashboard Stats
CREATE OR REPLACE FUNCTION get_dashboard_stats(p_user_id UUID)
RETURNS TABLE (
  total_tests INTEGER,
  average_score INTEGER,
  best_score INTEGER,
  tests_this_week INTEGER,
  passed_tests INTEGER,
  failed_tests INTEGER
) 
SECURITY DEFINER
SET search_path = public, extensions
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check access: user can only see their own stats, or admin
  IF p_user_id != auth.uid() AND NOT (SELECT EXISTS(SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true)) THEN
    RAISE EXCEPTION 'Unauthorized access to stats';
  END IF;

  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER as total_tests,
    COALESCE(ROUND(AVG(percentage)), 0)::INTEGER as average_score,
    COALESCE(MAX(percentage), 0)::INTEGER as best_score,
    COUNT(*) FILTER (WHERE completed_at >= NOW() - INTERVAL '7 days')::INTEGER as tests_this_week,
    COUNT(*) FILTER (WHERE percentage >= 80)::INTEGER as passed_tests,
    COUNT(*) FILTER (WHERE percentage < 80)::INTEGER as failed_tests
  FROM test_attempts
  WHERE user_id = p_user_id;
END;
$$;

-- 2. Get Weekly Progress
CREATE OR REPLACE FUNCTION get_weekly_progress(p_user_id UUID)
RETURNS TABLE (
  attempt_date DATE,
  daily_avg_score INTEGER
) 
SECURITY DEFINER
SET search_path = public, extensions
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_user_id != auth.uid() AND NOT (SELECT EXISTS(SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true)) THEN
    RAISE EXCEPTION 'Unauthorized access to progress';
  END IF;

  RETURN QUERY
  SELECT
    completed_at::DATE as attempt_date,
    ROUND(AVG(percentage))::INTEGER as daily_avg_score
  FROM test_attempts
  WHERE user_id = p_user_id
  AND completed_at >= NOW() - INTERVAL '7 days'
  GROUP BY completed_at::DATE
  ORDER BY completed_at::DATE ASC;
END;
$$;

-- 3. Get Recent Tests
CREATE OR REPLACE FUNCTION get_recent_tests(p_user_id UUID, p_limit INTEGER DEFAULT 4)
RETURNS TABLE (
  id UUID,
  category VARCHAR,
  test_number VARCHAR,
  score INTEGER,
  percentage DECIMAL,
  completed_at TIMESTAMP WITH TIME ZONE
) 
SECURITY DEFINER
SET search_path = public, extensions
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_user_id != auth.uid() AND NOT (SELECT EXISTS(SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true)) THEN
    RAISE EXCEPTION 'Unauthorized access to tests';
  END IF;

  RETURN QUERY
  SELECT
    t.id,
    t.category,
    t.test_number,
    t.score,
    t.percentage,
    t.completed_at
  FROM test_attempts t
  WHERE t.user_id = p_user_id
  ORDER BY t.completed_at DESC
  LIMIT p_limit;
END;
$$;

-- 4. Get Admin Dashboard Stats
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  WITH 
    user_stats AS (SELECT count(*) as total_users FROM user_profiles),
    question_stats AS (SELECT count(*) as total_questions FROM admin_questions),
    attempt_stats AS (
      SELECT 
        count(*) as total_attempts,
        count(*) FILTER (WHERE percentage >= 80) as passed_attempts,
        count(*) FILTER (WHERE percentage < 80) as failed_attempts
      FROM test_attempts
    ),
    questions_by_category AS (
      SELECT json_object_agg(category, count) as category_counts
      FROM (SELECT category, count(*) as count FROM admin_questions GROUP BY category) q
    ),
    questions_per_test AS (
      SELECT json_object_agg(key, count) as questions_per_test
      FROM (
        SELECT (category || '-' || test_number) as key, count(*) as count
        FROM admin_questions
        GROUP BY category, test_number
      ) qpt
    ),
    scenarios_by_category AS (
      SELECT json_object_agg(category, count) as scenario_category_counts
      FROM (SELECT category, count(*) as count FROM decision_trainer_scenarios GROUP BY category) s
    ),
    scenarios_by_level AS (
      SELECT json_object_agg(level, count) as scenario_level_counts
      FROM (SELECT level, count(*) as count FROM decision_trainer_scenarios GROUP BY level) l
    ),
    materials_coverage AS (
      SELECT json_object_agg(chapter_id, stats) as materials_by_chapter
      FROM (
        SELECT 
          chapter_id, 
          json_build_object(
            'total', count(*), 
            'published', count(*) FILTER (WHERE is_published = true)
          ) as stats
        FROM study_materials
        GROUP BY chapter_id
      ) m
    )
  SELECT json_build_object(
    'totalUsers', (SELECT total_users FROM user_stats),
    'totalQuestions', (SELECT total_questions FROM question_stats),
    'totalAttempts', (SELECT total_attempts FROM attempt_stats),
    'passedAttempts', (SELECT passed_attempts FROM attempt_stats),
    'failedAttempts', (SELECT failed_attempts FROM attempt_stats),
    'categoryCounts', (SELECT category_counts FROM questions_by_category),
    'questionsPerTest', (SELECT questions_per_test FROM questions_per_test),
    'scenarioCategoryCounts', (SELECT scenario_category_counts FROM scenarios_by_category),
    'scenarioLevelCounts', (SELECT scenario_level_counts FROM scenarios_by_level),
    'materialsByChapter', (SELECT materials_by_chapter FROM materials_coverage)
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Get Users With Stats (Paginated)
CREATE OR REPLACE FUNCTION get_users_with_stats(
  page_number INTEGER,
  page_size INTEGER,
  search_term TEXT DEFAULT NULL,
  role_filter TEXT DEFAULT 'all',
  premium_filter TEXT DEFAULT 'all'
)
RETURNS JSON AS $$
DECLARE
  result JSON;
  total_count INTEGER;
BEGIN
  -- Calculate total count with filters
  SELECT count(*) INTO total_count
  FROM user_profiles u
  WHERE 
    (search_term IS NULL OR u.email ILIKE '%' || search_term || '%' OR u.full_name ILIKE '%' || search_term || '%')
    AND (
      role_filter = 'all' OR
      (role_filter = 'admin' AND u.is_admin = true) OR
      (role_filter = 'user' AND u.is_admin = false)
    )
    AND (
      premium_filter = 'all' OR
      (premium_filter = 'true' AND EXISTS(SELECT 1 FROM user_plans p WHERE p.user_id = u.id AND p.status = 'active')) OR
      (premium_filter = 'false' AND NOT EXISTS(SELECT 1 FROM user_plans p WHERE p.user_id = u.id AND p.status = 'active'))
    );

  -- Fetch paginated data with attempt counts
  SELECT json_build_object(
    'total', total_count,
    'users', json_agg(t)
  ) INTO result
  FROM (
    SELECT 
      u.*,
      (SELECT count(*) FROM test_attempts ta WHERE ta.user_id = u.id) as test_attempts_count
    FROM user_profiles u
    WHERE 
      (search_term IS NULL OR u.email ILIKE '%' || search_term || '%' OR u.full_name ILIKE '%' || search_term || '%')
      AND (
        role_filter = 'all' OR
        (role_filter = 'admin' AND u.is_admin = true) OR
        (role_filter = 'user' AND u.is_admin = false)
      )
      AND (
        premium_filter = 'all' OR
        (premium_filter = 'true' AND EXISTS(SELECT 1 FROM user_plans p WHERE p.user_id = u.id AND p.status = 'active')) OR
        (premium_filter = 'false' AND NOT EXISTS(SELECT 1 FROM user_plans p WHERE p.user_id = u.id AND p.status = 'active'))
      )
    ORDER BY u.created_at DESC
    LIMIT page_size
    OFFSET (page_number - 1) * page_size
  ) t;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_dashboard_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_weekly_progress(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_tests(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_users_with_stats(INTEGER, INTEGER, TEXT, TEXT, TEXT) TO authenticated;

-- ===================================================================
-- STEP 20: STORAGE BUCKETS
-- ===================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('question-images', 'question-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('decision-trainer', 'decision-trainer', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('material-images', 'material-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ===================================================================
-- STEP 21: Set First Admin (CHANGE EMAIL!)
-- ===================================================================

-- IMPORTANT: Change this to your email address!
UPDATE user_profiles 
SET is_admin = true 
WHERE email = 'admin@example.com';

-- ===================================================================
-- STEP 22: COMPLETION STATUS
-- ===================================================================

SELECT 
  '=== DRIVEWISE DATABASE SETUP COMPLETE ===' AS status,
  (SELECT COUNT(*) FROM user_profiles) || ' user profiles' AS user_count,
  (SELECT COUNT(*) FROM admin_questions) || ' theory questions' AS theory_questions,
  (SELECT COUNT(*) FROM decision_trainer_scenarios) || ' decision trainer scenarios' AS dt_scenarios,
  (SELECT COUNT(*) FROM test_attempts) || ' test attempts' AS test_attempts;
