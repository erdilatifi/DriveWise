-- ===================================================================
-- DRIVEWISE - COMPLETE DATABASE SETUP
-- ===================================================================
-- Run this ENTIRE file in Supabase SQL Editor
-- This file contains ALL database tables, indexes, policies, and setup
-- ===================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
  is_instructor BOOLEAN DEFAULT false,
  is_blocked BOOLEAN DEFAULT false,
  instructor_code VARCHAR(20) UNIQUE,
  avatar_url TEXT,
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
-- STEP 12: Additional Tables - INSTRUCTOR SYSTEM
-- ===================================================================

CREATE TABLE IF NOT EXISTS student_instructor_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  linked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, instructor_id)
);

-- ===================================================================
-- STEP 13: Additional Tables - STUDY MATERIALS
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
-- STEP 14b: Payments - Orders and Transactions
-- ===================================================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  category license_category NOT NULL,
  plan_tier VARCHAR(20) NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, paid, failed, cancelled
  paysera_order_id VARCHAR(100),
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

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_paysera_order_id ON orders(paysera_order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions(order_id);

-- ===================================================================
-- STEP 14: Create VIEWS
-- ===================================================================

-- Decision Trainer Leaderboard View
CREATE OR REPLACE VIEW decision_trainer_leaderboard AS
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

-- ===================================================================
-- STEP 15: Create INDEXES for Performance
-- ===================================================================

-- User Profiles Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_blocked ON user_profiles(is_blocked);
CREATE INDEX IF NOT EXISTS idx_user_profiles_admin ON user_profiles(is_admin);

-- Admin Questions Indexes
CREATE INDEX IF NOT EXISTS idx_admin_questions_category ON admin_questions(category);
CREATE INDEX IF NOT EXISTS idx_admin_questions_test_number ON admin_questions(test_number);
CREATE INDEX IF NOT EXISTS idx_admin_questions_category_test ON admin_questions(category, test_number);

-- Test Attempts Indexes
CREATE INDEX IF NOT EXISTS idx_test_attempts_user ON test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_category ON test_attempts(category);
CREATE INDEX IF NOT EXISTS idx_test_attempts_completed ON test_attempts(completed_at);

-- Test Attempt Answers Indexes
CREATE INDEX IF NOT EXISTS idx_test_attempt_answers_test_attempt ON test_attempt_answers(test_attempt_id);
CREATE INDEX IF NOT EXISTS idx_test_attempt_answers_question ON test_attempt_answers(question_id);

-- Decision Trainer Indexes
CREATE INDEX IF NOT EXISTS idx_dt_scenarios_category ON decision_trainer_scenarios(category);
CREATE INDEX IF NOT EXISTS idx_dt_scenarios_active ON decision_trainer_scenarios(is_active);
CREATE INDEX IF NOT EXISTS idx_dt_progress_user ON decision_trainer_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_dt_progress_category ON decision_trainer_progress(category);
CREATE INDEX IF NOT EXISTS idx_dt_attempts_user ON decision_trainer_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_dt_attempts_scenario ON decision_trainer_attempts(scenario_id);
CREATE INDEX IF NOT EXISTS idx_dt_attempts_selected_options ON decision_trainer_attempts USING GIN (selected_options);
CREATE INDEX IF NOT EXISTS idx_dt_badges_user ON decision_trainer_badges(user_id);

-- ===================================================================
-- STEP 16: Create FUNCTIONS and TRIGGERS
-- ===================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_admin_questions_updated_at ON admin_questions;
DROP TRIGGER IF EXISTS update_study_materials_updated_at ON study_materials;
DROP TRIGGER IF EXISTS update_material_images_updated_at ON material_images;
DROP TRIGGER IF EXISTS update_dt_scenarios_updated_at ON decision_trainer_scenarios;

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_payment_transactions_updated_at ON payment_transactions;

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_questions_updated_at 
  BEFORE UPDATE ON admin_questions
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_materials_updated_at 
  BEFORE UPDATE ON study_materials
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_material_images_updated_at 
  BEFORE UPDATE ON material_images
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dt_scenarios_updated_at 
  BEFORE UPDATE ON decision_trainer_scenarios
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at 
  BEFORE UPDATE ON payment_transactions
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- ===================================================================
-- STEP 17: Enable ROW LEVEL SECURITY (Basic Setup)
-- ===================================================================
-- NOTE: This enables RLS but does NOT create comprehensive policies
-- For complete security, run 'comprehensive_rls_policies.sql' after this setup

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_instructor_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_trainer_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_trainer_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_trainer_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_trainer_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- ===================================================================
-- STEP 19: Create STORAGE BUCKETS
-- ===================================================================

-- Create storage bucket for decision trainer images
INSERT INTO storage.buckets (id, name, public)
VALUES ('decision-trainer', 'decision-trainer', true)
ON CONFLICT (id) DO NOTHING;

-- ===================================================================
-- STEP 20: Set First Admin (CHANGE EMAIL!)
-- ===================================================================

-- IMPORTANT: Change this to your email address!
UPDATE user_profiles 
SET is_admin = true 
WHERE email = 'admin@example.com';

-- ===================================================================
-- STEP 21: COMPLETION STATUS
-- ===================================================================

SELECT 
  '=== DRIVEWISE DATABASE SETUP COMPLETE ===' AS status,
  (SELECT COUNT(*) FROM user_profiles) || ' user profiles' AS user_count,
  (SELECT COUNT(*) FROM admin_questions) || ' theory questions' AS theory_questions,
  (SELECT COUNT(*) FROM decision_trainer_scenarios) || ' decision trainer scenarios' AS dt_scenarios,
  (SELECT COUNT(*) FROM test_attempts) || ' test attempts' AS test_attempts;

-- Show all created tables
SELECT 
  table_name,
  CASE 
    WHEN table_name LIKE 'decision_trainer_%' THEN 'Decision Trainer'
    WHEN table_name IN ('admin_questions', 'test_attempts', 'test_attempt_answers') THEN 'Theory Tests'
    WHEN table_name = 'user_profiles' THEN 'Core System'
    ELSE 'Additional Features'
  END as system_component
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'user_profiles', 
  'admin_questions', 
  'test_attempts', 
  'test_attempt_answers',
  'student_instructor_links',
  'study_materials',
  'material_images',
  'decision_trainer_scenarios',
  'decision_trainer_progress',
  'decision_trainer_attempts',
  'decision_trainer_badges'
)
ORDER BY system_component, table_name;

-- ===================================================================
-- SETUP COMPLETE!
-- ===================================================================
-- 
-- What this file created:
-- 1. User management system with profiles and authentication
-- 2. Theory test system with questions and attempts tracking
-- 3. Decision trainer system with scenarios, progress, and badges
-- 4. Instructor system for student management
-- 5. Study materials system
-- 6. Complete indexing for performance
-- 7. Basic Row Level Security setup (RLS enabled)
-- 8. Storage buckets for file uploads
-- 9. Automated triggers for data consistency
-- 
-- ⚠️  IMPORTANT SECURITY STEP:
-- This file enables RLS but does NOT create comprehensive security policies.
-- For complete application security, you MUST also run:
-- 
--   comprehensive_rls_policies.sql
-- 
-- This will create:
-- - Complete user access controls
-- - Admin/instructor role permissions
-- - Data isolation between users
-- - Storage bucket security
-- - Audit logging
-- - Performance optimizations
-- 
-- Next steps:
-- 1. Change the admin email in STEP 20
-- 2. Run 'comprehensive_rls_policies.sql' for complete security
-- 3. Add your first questions and scenarios
-- 4. Test the application functionality
-- 5. Verify security with test_rls_policies() function
-- 
-- ===================================================================
