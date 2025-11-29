-- ===================================================================
-- DRIVEWISE - SIMPLIFIED DATABASE SCHEMA (ALBANIAN ONLY)
-- ===================================================================

-- Enable required extensions
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- Safely handle pg_trgm extension
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm') THEN
    ALTER EXTENSION pg_trgm SET SCHEMA extensions;
  ELSE
    CREATE EXTENSION "pg_trgm" WITH SCHEMA extensions;
  END IF;
END $$;

ALTER DATABASE postgres SET search_path TO public, extensions;

-- ===================================================================
-- ENUMS
-- ===================================================================

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'license_category') THEN
        CREATE TYPE license_category AS ENUM ('A', 'B', 'C', 'D');
    END IF;
END $$;

-- ===================================================================
-- TABLES
-- ===================================================================

-- 1. USER PROFILES (Simplified)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(50),
  date_of_birth DATE,
  address TEXT,
  is_admin BOOLEAN DEFAULT false,
  is_blocked BOOLEAN DEFAULT false,
  app_rating INTEGER,
  avatar_url TEXT,
  subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ADMIN QUESTIONS (Single Language)
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

-- 3. TEST ATTEMPTS
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

-- 4. TEST ATTEMPT ANSWERS
CREATE TABLE IF NOT EXISTS test_attempt_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_attempt_id UUID REFERENCES test_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES admin_questions(id),
  selected_answer VARCHAR(10),
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. DECISION TRAINER SCENARIOS (Enhanced & Single Language)
CREATE TABLE IF NOT EXISTS decision_trainer_scenarios (
  id TEXT PRIMARY KEY, -- Can be custom ID like 'tl-001' or UUID
  category TEXT NOT NULL,
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 4),
  question TEXT NOT NULL,
  image_url TEXT,
  options JSONB NOT NULL, -- Array of {text, isCorrect, explanation}
  correct_explanation TEXT NOT NULL,
  real_world_tip TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 25,
  topic TEXT,
  difficulty TEXT DEFAULT 'medium',
  is_active BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. DECISION TRAINER PROGRESS
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

-- 7. DECISION TRAINER ATTEMPTS
CREATE TABLE IF NOT EXISTS decision_trainer_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_id TEXT NOT NULL,
  category TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  selected_options JSONB NOT NULL,
  time_taken_ms INTEGER,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. DECISION TRAINER BADGES
CREATE TABLE IF NOT EXISTS decision_trainer_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_type)
);

-- 9. STUDY MATERIALS (Single Language - Albanian)
CREATE TABLE IF NOT EXISTS study_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id INTEGER NOT NULL,
  category license_category,
  title TEXT NOT NULL, -- Renamed from title_sq
  content JSONB NOT NULL, -- Renamed from content_sq
  order_index INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(chapter_id)
);

-- 10. MATERIAL IMAGES (Single Language)
CREATE TABLE IF NOT EXISTS material_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES study_materials(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT, -- Renamed from caption_sq
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. TRAFFIC SIGNS (New)
CREATE TABLE IF NOT EXISTS traffic_signs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('danger', 'prohibition', 'mandatory', 'info')),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. ORDERS & PAYMENTS
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  category license_category NOT NULL,
  plan_tier VARCHAR(20) NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
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

-- 13. BUG REPORTS & FEEDBACK
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
  user_id UUID,
  display_name TEXT,
  avatar_url TEXT,
  email TEXT,
  reason TEXT NOT NULL,
  comment TEXT,
  is_public_allowed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. AUDIT LOG
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- FUNCTIONS & TRIGGERS
-- ===================================================================

-- Update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER SET search_path = public, extensions AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_questions_updated_at BEFORE UPDATE ON admin_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_study_materials_updated_at BEFORE UPDATE ON study_materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_material_images_updated_at BEFORE UPDATE ON material_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dt_scenarios_updated_at BEFORE UPDATE ON decision_trainer_scenarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_plans_updated_at BEFORE UPDATE ON user_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_traffic_signs_updated_at BEFORE UPDATE ON traffic_signs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER SECURITY DEFINER SET search_path = public, extensions AS $$
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
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helpers
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN SECURITY DEFINER SET search_path = public, extensions AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.is_blocked()
RETURNS BOOLEAN SECURITY DEFINER SET search_path = public, extensions AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_blocked = true);
END;
$$ LANGUAGE plpgsql;

-- Audit Log Trigger
CREATE OR REPLACE FUNCTION log_sensitive_operation()
RETURNS TRIGGER SECURITY DEFINER SET search_path = public, extensions AS $$
BEGIN
  IF TG_TABLE_NAME = 'user_profiles' AND (
    (OLD.is_admin != NEW.is_admin) OR 
    (OLD.is_blocked != NEW.is_blocked)
  ) THEN
    INSERT INTO audit_log (table_name, operation, user_id, old_data, new_data)
    VALUES (TG_TABLE_NAME, TG_OP, (select auth.uid()), row_to_json(OLD), row_to_json(NEW));
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_user_profiles AFTER UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION log_sensitive_operation();

-- ===================================================================
-- INDEXES
-- ===================================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_admin_questions_category ON admin_questions(category);
CREATE INDEX IF NOT EXISTS idx_test_attempts_user ON test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_dt_scenarios_category ON decision_trainer_scenarios(category);
CREATE INDEX IF NOT EXISTS idx_traffic_signs_category ON traffic_signs(category);
CREATE INDEX IF NOT EXISTS idx_traffic_signs_code ON traffic_signs(code);

-- ===================================================================
-- COMPLETION
-- ===================================================================
SELECT 'Schema Setup Complete' as status;
