-- ===================================================================
-- DRIVEWISE - Complete Database Setup (NO RLS)
-- ===================================================================
-- Run this ENTIRE file in Supabase SQL Editor
-- RLS is DISABLED for now - will add security later
-- ===================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================================================
-- STEP 1: Disable RLS on all tables (if they exist)
-- ===================================================================

ALTER TABLE IF EXISTS user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS test_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS test_attempt_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS student_instructor_links DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS study_materials DISABLE ROW LEVEL SECURITY;

-- ===================================================================
-- STEP 2: Create ENUMS (if not exist)
-- ===================================================================

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'license_category') THEN
        CREATE TYPE license_category AS ENUM ('A', 'B', 'C1', 'C', 'CE', 'D');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'language_code') THEN
        CREATE TYPE language_code AS ENUM ('sq', 'en');
    END IF;
END $$;

-- ===================================================================
-- STEP 3: Create USER_PROFILES Table
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
-- STEP 5: Create ADMIN_QUESTIONS Table
-- ===================================================================

CREATE TABLE IF NOT EXISTS admin_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(10) NOT NULL CHECK (category IN ('A', 'B', 'C', 'C1', 'CE', 'D')),
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
-- STEP 6: Create TEST_ATTEMPTS Table
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
-- STEP 7: Create TEST_ATTEMPT_ANSWERS Table
-- ===================================================================

CREATE TABLE IF NOT EXISTS test_attempt_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_attempt_id UUID REFERENCES test_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES admin_questions(id),
  selected_answer VARCHAR(1),
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- STEP 8: Create STUDENT_INSTRUCTOR_LINKS Table
-- ===================================================================

CREATE TABLE IF NOT EXISTS student_instructor_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  linked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, instructor_id)
);

-- ===================================================================
-- STEP 9: Create STUDY_MATERIALS Table
-- ===================================================================

CREATE TABLE IF NOT EXISTS study_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  material_type VARCHAR(50),
  file_url TEXT,
  order_index INTEGER,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- STEP 10: Create INDEXES
-- ===================================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_blocked ON user_profiles(is_blocked);
CREATE INDEX IF NOT EXISTS idx_user_profiles_admin ON user_profiles(is_admin);

CREATE INDEX IF NOT EXISTS idx_admin_questions_category ON admin_questions(category);
CREATE INDEX IF NOT EXISTS idx_admin_questions_test_number ON admin_questions(test_number);
CREATE INDEX IF NOT EXISTS idx_admin_questions_category_test ON admin_questions(category, test_number);

CREATE INDEX IF NOT EXISTS idx_test_attempts_user ON test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_category ON test_attempts(category);
CREATE INDEX IF NOT EXISTS idx_test_attempts_completed ON test_attempts(completed_at);

CREATE INDEX IF NOT EXISTS idx_test_attempt_answers_test_attempt ON test_attempt_answers(test_attempt_id);
CREATE INDEX IF NOT EXISTS idx_test_attempt_answers_question ON test_attempt_answers(question_id);

-- ===================================================================
-- STEP 11: Create TRIGGERS
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

-- Create triggers
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
-- STEP 12: Set first admin (CHANGE EMAIL!)
-- ===================================================================

-- IMPORTANT: Change this to your email address!
UPDATE user_profiles 
SET is_admin = true 
WHERE email = 'admin@example.com';

-- ===================================================================
-- COMPLETE!
-- ===================================================================

SELECT 
  '=== DATABASE SETUP COMPLETE (NO RLS) ===' AS status,
  (SELECT COUNT(*) FROM user_profiles) || ' user profiles' AS user_count,
  (SELECT COUNT(*) FROM admin_questions) || ' questions' AS question_count,
  (SELECT COUNT(*) FROM test_attempts) || ' test attempts' AS test_count;

-- Show all tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'user_profiles', 
  'admin_questions', 
  'test_attempts', 
  'test_attempt_answers',
  'student_instructor_links',
  'study_materials'
)
ORDER BY table_name;

-- ===================================================================
-- NOTE: RLS is DISABLED for testing
-- Add RLS policies later when ready for production
-- ===================================================================
