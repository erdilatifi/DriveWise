-- ===================================================================
-- DRIVEWISE - DATABASE OPTIMIZATION & FIXES (V4 - REVISED)
-- ===================================================================
-- This script addresses:
-- 1. Performance: Optimizes RLS policies to avoid re-evaluating auth.uid() for every row.
-- 2. Performance: Adds missing indexes on Foreign Keys.
-- 3. Integrity: Ensures 'orders' and 'payment_transactions' tables exist with correct schema.
-- 4. Security: Consolidates multiple permissive policies.
-- ===================================================================

-- Enable extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================================================
-- STEP 1: Ensure Payment Tables Exist (with correct schema)
-- ===================================================================

-- Create ENUM if missing
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'license_category') THEN
        CREATE TYPE license_category AS ENUM ('A', 'B', 'C', 'D');
    END IF;
END $$;

-- Update 'orders' table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  category license_category NOT NULL,
  plan_tier VARCHAR(20) NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  paysera_order_id VARCHAR(100), -- Added to match your schema request
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update 'payment_transactions' table
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

-- Add missing columns if table existed but column didn't
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='paysera_order_id') THEN
        ALTER TABLE orders ADD COLUMN paysera_order_id VARCHAR(100);
    END IF;
END $$;

-- ===================================================================
-- STEP 2: Add Missing Indexes (Fixing "Unindexed foreign keys")
-- ===================================================================

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id); -- If audit_log exists
CREATE INDEX IF NOT EXISTS idx_dt_scenarios_created_by ON decision_trainer_scenarios(created_by);
CREATE INDEX IF NOT EXISTS idx_material_images_material_id ON material_images(material_id);
CREATE INDEX IF NOT EXISTS idx_student_instructor_links_instructor_id ON student_instructor_links(instructor_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_assigned_by ON test_attempts(assigned_by);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_user_plans_user_id ON user_plans(user_id);

-- ===================================================================
-- STEP 3: Optimize RLS Policies (Fixing "auth_rls_initplan" & "multiple_permissive_policies")
-- ===================================================================

-- Helper function to check admin status efficiently
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_profiles 
    WHERE id = (SELECT auth.uid()) 
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- -------------------------------------------------------
-- Table: user_profiles
-- -------------------------------------------------------
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Safely drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Public can insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON user_profiles;
-- Drop variations found in error logs
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Public can view profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can do everything on profiles" ON user_profiles;

-- Optimized Policies
CREATE POLICY "Public can view profiles"
ON user_profiles FOR SELECT
TO authenticated, anon
USING (true); -- Profiles are generally public in this app context (leaderboards etc), or restrict if needed

CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
TO authenticated
USING (id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own profile"
ON user_profiles FOR INSERT
TO authenticated, anon
WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "Admins can do everything on profiles"
ON user_profiles FOR ALL
TO authenticated
USING (is_admin());

-- -------------------------------------------------------
-- Table: student_instructor_links
-- -------------------------------------------------------
ALTER TABLE student_instructor_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Students can view their instructors" ON student_instructor_links;
DROP POLICY IF EXISTS "Students can link to instructors" ON student_instructor_links;
DROP POLICY IF EXISTS "Students can unlink from instructors" ON student_instructor_links;
DROP POLICY IF EXISTS "Instructors can view their students" ON student_instructor_links;
-- Variations
DROP POLICY IF EXISTS "Users can view their own links" ON student_instructor_links;
DROP POLICY IF EXISTS "Students can create links" ON student_instructor_links;
DROP POLICY IF EXISTS "Users can delete their own links" ON student_instructor_links;

CREATE POLICY "Users can view their own links"
ON student_instructor_links FOR SELECT
TO authenticated
USING (
  student_id = (SELECT auth.uid()) OR 
  instructor_id = (SELECT auth.uid()) OR
  is_admin()
);

CREATE POLICY "Students can create links"
ON student_instructor_links FOR INSERT
TO authenticated
WITH CHECK (student_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own links"
ON student_instructor_links FOR DELETE
TO authenticated
USING (
  student_id = (SELECT auth.uid()) OR 
  instructor_id = (SELECT auth.uid()) OR
  is_admin()
);

-- -------------------------------------------------------
-- Table: user_plans
-- -------------------------------------------------------
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own plans" ON user_plans;
DROP POLICY IF EXISTS "Admins can view all plans" ON user_plans;
DROP POLICY IF EXISTS "Admins can manage plans" ON user_plans;

CREATE POLICY "Users can view own plans"
ON user_plans FOR SELECT
TO authenticated
USING (
  user_id = (SELECT auth.uid()) OR 
  is_admin()
);

CREATE POLICY "Admins can manage plans"
ON user_plans FOR ALL
TO authenticated
USING (is_admin());

-- -------------------------------------------------------
-- Table: orders
-- -------------------------------------------------------
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON orders;
DROP POLICY IF EXISTS "Admins can manage orders" ON orders;

CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
TO authenticated
USING (
  user_id = (SELECT auth.uid()) OR 
  is_admin()
);

CREATE POLICY "Admins can manage orders"
ON orders FOR ALL
TO authenticated
USING (is_admin());

-- -------------------------------------------------------
-- Table: payment_transactions
-- -------------------------------------------------------
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own transactions" ON payment_transactions;

CREATE POLICY "Users can view own transactions"
ON payment_transactions FOR SELECT
TO authenticated
USING (
  order_id IN (SELECT id FROM orders WHERE user_id = (SELECT auth.uid())) OR
  is_admin()
);

-- -------------------------------------------------------
-- Table: study_materials (Performance Fix)
-- -------------------------------------------------------
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin can manage materials" ON study_materials;
DROP POLICY IF EXISTS "Everyone can view published materials" ON study_materials;
DROP POLICY IF EXISTS "Admins can manage materials" ON study_materials;

CREATE POLICY "Everyone can view published materials"
ON study_materials FOR SELECT
TO authenticated, anon
USING (is_published = true OR is_admin());

CREATE POLICY "Admins can manage materials"
ON study_materials FOR ALL
TO authenticated
USING (is_admin());

-- -------------------------------------------------------
-- Table: test_attempts (Performance Fix)
-- -------------------------------------------------------
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own test attempts" ON test_attempts;
DROP POLICY IF EXISTS "Admins can view all test attempts" ON test_attempts;
DROP POLICY IF EXISTS "Users can create own test attempts" ON test_attempts;
DROP POLICY IF EXISTS "Users can view own attempts" ON test_attempts;
DROP POLICY IF EXISTS "Users can create own attempts" ON test_attempts;
DROP POLICY IF EXISTS "Users can update own attempts" ON test_attempts;

CREATE POLICY "Users can view own attempts"
ON test_attempts FOR SELECT
TO authenticated
USING (
  user_id = (SELECT auth.uid()) OR 
  is_admin()
);

CREATE POLICY "Users can create own attempts"
ON test_attempts FOR INSERT
TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own attempts"
ON test_attempts FOR UPDATE
TO authenticated
USING (user_id = (SELECT auth.uid()) OR is_admin());

-- -------------------------------------------------------
-- Table: decision_trainer_progress (Performance Fix)
-- -------------------------------------------------------
ALTER TABLE decision_trainer_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own progress" ON decision_trainer_progress;
DROP POLICY IF EXISTS "Admins can view all progress" ON decision_trainer_progress;
DROP POLICY IF EXISTS "Users can manage own progress" ON decision_trainer_progress;

CREATE POLICY "Users can view own progress"
ON decision_trainer_progress FOR SELECT
TO authenticated
USING (
  user_id = (SELECT auth.uid()) OR 
  is_admin()
);

CREATE POLICY "Users can manage own progress"
ON decision_trainer_progress FOR ALL
TO authenticated
USING (user_id = (SELECT auth.uid()) OR is_admin());

-- ===================================================================
-- FINAL STEP: Grant Permissions
-- ===================================================================

GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Confirm Execution
SELECT '=== V4 OPTIMIZATION COMPLETE: RLS Optimized & Indexes Added ===' as status;
