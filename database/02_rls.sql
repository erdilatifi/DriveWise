-- ===================================================================
-- DRIVEWISE - COMPREHENSIVE ROW LEVEL SECURITY POLICIES (V3)
-- ===================================================================
-- This file contains complete RLS policies for all tables and storage buckets
-- Run this AFTER the main database setup to secure your application
-- This replaces all previous RLS scripts.
-- ===================================================================

-- ===================================================================
-- STEP 1: Enable RLS on ALL tables
-- ===================================================================

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
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE bug_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- ===================================================================
-- STEP 2: Drop ALL existing policies (clean slate)
-- ===================================================================

-- User Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Public can insert profiles" ON user_profiles;

-- Admin Questions policies
DROP POLICY IF EXISTS "Authenticated users can view questions" ON admin_questions;
DROP POLICY IF EXISTS "Admins can manage questions" ON admin_questions;
DROP POLICY IF EXISTS "Public can view questions" ON admin_questions;

-- Test Attempts policies
DROP POLICY IF EXISTS "Users can view own test attempts" ON test_attempts;
DROP POLICY IF EXISTS "Users can insert own test attempts" ON test_attempts;
DROP POLICY IF EXISTS "Users can update own test attempts" ON test_attempts;
DROP POLICY IF EXISTS "Users can delete own test attempts" ON test_attempts;
DROP POLICY IF EXISTS "Admins can view all test attempts" ON test_attempts;
DROP POLICY IF EXISTS "Admins can delete any test attempt" ON test_attempts;

-- Test Attempt Answers policies
DROP POLICY IF EXISTS "Users can view own test answers" ON test_attempt_answers;
DROP POLICY IF EXISTS "Users can insert own test answers" ON test_attempt_answers;
DROP POLICY IF EXISTS "Admins can view all test answers" ON test_attempt_answers;

-- Student Instructor Links policies
DROP POLICY IF EXISTS "Students can view own links" ON student_instructor_links;
DROP POLICY IF EXISTS "Instructors can view their students" ON student_instructor_links;
DROP POLICY IF EXISTS "Instructors can create student links" ON student_instructor_links;
DROP POLICY IF EXISTS "Instructors can remove student links" ON student_instructor_links;
DROP POLICY IF EXISTS "Users can view own links" ON student_instructor_links;
DROP POLICY IF EXISTS "Instructors can manage links" ON student_instructor_links;
DROP POLICY IF EXISTS "Admins can manage all links" ON student_instructor_links;

-- Study Materials policies
DROP POLICY IF EXISTS "Public can view published materials" ON study_materials;
DROP POLICY IF EXISTS "Authenticated users can view published materials" ON study_materials;
DROP POLICY IF EXISTS "Admins can manage materials" ON study_materials;
DROP POLICY IF EXISTS "Admins can manage all materials" ON study_materials;

-- Material Images policies
DROP POLICY IF EXISTS "Authenticated users can view material images" ON material_images;
DROP POLICY IF EXISTS "Admins can manage material images" ON material_images;

-- Decision Trainer Scenarios policies
DROP POLICY IF EXISTS "Anyone can view active scenarios" ON decision_trainer_scenarios;
DROP POLICY IF EXISTS "Authenticated users can view active scenarios" ON decision_trainer_scenarios;
DROP POLICY IF EXISTS "Admins can insert scenarios" ON decision_trainer_scenarios;
DROP POLICY IF EXISTS "Admins can update scenarios" ON decision_trainer_scenarios;
DROP POLICY IF EXISTS "Admins can delete scenarios" ON decision_trainer_scenarios;
DROP POLICY IF EXISTS "Admins can manage scenarios" ON decision_trainer_scenarios;
DROP POLICY IF EXISTS "Admins can manage all scenarios" ON decision_trainer_scenarios;

-- Decision Trainer Progress policies
DROP POLICY IF EXISTS "Users can view own progress" ON decision_trainer_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON decision_trainer_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON decision_trainer_progress;
DROP POLICY IF EXISTS "Users can manage own progress" ON decision_trainer_progress;
DROP POLICY IF EXISTS "Admins can view all progress" ON decision_trainer_progress;

-- Decision Trainer Attempts policies
DROP POLICY IF EXISTS "Users can view own attempts" ON decision_trainer_attempts;
DROP POLICY IF EXISTS "Users can insert own attempts" ON decision_trainer_attempts;
DROP POLICY IF EXISTS "Admins can view all attempts" ON decision_trainer_attempts;

-- Decision Trainer Badges policies
DROP POLICY IF EXISTS "Users can view own badges" ON decision_trainer_badges;
DROP POLICY IF EXISTS "Users can insert own badges" ON decision_trainer_badges;
DROP POLICY IF EXISTS "Admins can view all badges" ON decision_trainer_badges;
DROP POLICY IF EXISTS "Admins can manage badges" ON decision_trainer_badges;

-- Audit log policies
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_log;

-- Orders & Payments policies
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON orders;
DROP POLICY IF EXISTS "Users can view own transactions" ON payment_transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON payment_transactions;
DROP POLICY IF EXISTS "Admins can manage all transactions" ON payment_transactions;

-- User Plans policies
DROP POLICY IF EXISTS "Users can view own plans" ON user_plans;
DROP POLICY IF EXISTS "Users can insert own plans" ON user_plans;
DROP POLICY IF EXISTS "Users can update own plans" ON user_plans;

-- Bug Reports policies
DROP POLICY IF EXISTS "Admins can view all bug reports" ON bug_reports;
DROP POLICY IF EXISTS "Users can insert bug reports" ON bug_reports;
DROP POLICY IF EXISTS "Anyone can insert bug reports" ON bug_reports;

-- User Feedback policies
DROP POLICY IF EXISTS "Admins can view all feedback" ON user_feedback;
DROP POLICY IF EXISTS "Public can view testimonials" ON user_feedback;

-- ===================================================================
-- STEP 3: Create helper functions for RLS (SECURED)
-- ===================================================================

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN 
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql;

-- Function to check if current user is blocked
CREATE OR REPLACE FUNCTION public.is_blocked()
RETURNS BOOLEAN 
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND is_blocked = true
  );
END;
$$ LANGUAGE plpgsql;

-- ===================================================================
-- STEP 4: USER PROFILES - Core user management
-- ===================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING ((select auth.uid()) = id);

-- Users can update their own profile (except admin/instructor flags)
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING ((select auth.uid()) = id)
  WITH CHECK (
    (select auth.uid()) = id AND
    -- Prevent users from changing their admin/instructor status
    (is_admin = (SELECT is_admin FROM user_profiles WHERE id = (select auth.uid()))) AND
    (is_blocked = (SELECT is_blocked FROM user_profiles WHERE id = (select auth.uid())))
  );

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  USING ((select public.is_admin()));

-- Admins can manage all profiles (including admin/instructor flags)
CREATE POLICY "Admins can manage all profiles"
  ON user_profiles FOR ALL
  USING ((select public.is_admin()));

-- Allow profile creation during signup (handled by trigger)
CREATE POLICY "Public can insert profiles"
  ON user_profiles FOR INSERT
  WITH CHECK ((select auth.uid()) = id);

-- ===================================================================
-- STEP 5: ADMIN QUESTIONS - Theory test questions
-- ===================================================================

-- All authenticated users can view questions (for taking tests)
CREATE POLICY "Authenticated users can view questions"
  ON admin_questions FOR SELECT
  TO authenticated
  USING (NOT (select public.is_blocked()));

-- Admins can manage all questions
CREATE POLICY "Admins can manage questions"
  ON admin_questions FOR ALL
  USING ((select public.is_admin()));

-- ===================================================================
-- STEP 6: TEST ATTEMPTS - User test results
-- ===================================================================

-- Users can view their own test attempts
CREATE POLICY "Users can view own test attempts"
  ON test_attempts FOR SELECT
  USING ((select auth.uid()) = user_id AND NOT (select public.is_blocked()));

-- Users can insert their own test attempts
CREATE POLICY "Users can insert own test attempts"
  ON test_attempts FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id AND NOT (select public.is_blocked()));

-- Users can update their own test attempts (for time tracking, etc.)
CREATE POLICY "Users can update own test attempts"
  ON test_attempts FOR UPDATE
  USING ((select auth.uid()) = user_id AND NOT (select public.is_blocked()));

-- Users can delete their own test attempts
CREATE POLICY "Users can delete own test attempts"
  ON test_attempts FOR DELETE
  USING ((select auth.uid()) = user_id AND NOT (select public.is_blocked()));

-- Admins can view all test attempts (for analytics)
CREATE POLICY "Admins can view all test attempts"
  ON test_attempts FOR SELECT
  USING ((select public.is_admin()));

-- Admins can delete any test attempt (for moderation)
CREATE POLICY "Admins can delete any test attempt"
  ON test_attempts FOR DELETE
  USING ((select public.is_admin()));

-- ===================================================================
-- STEP 7: TEST ATTEMPT ANSWERS - Individual question answers
-- ===================================================================

-- Users can view their own test answers
CREATE POLICY "Users can view own test answers"
  ON test_attempt_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM test_attempts 
      WHERE test_attempts.id = test_attempt_id 
      AND test_attempts.user_id = (select auth.uid())
    ) AND NOT (select public.is_blocked())
  );

-- Users can insert their own test answers
CREATE POLICY "Users can insert own test answers"
  ON test_attempt_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM test_attempts 
      WHERE test_attempts.id = test_attempt_id 
      AND test_attempts.user_id = (select auth.uid())
    ) AND NOT (select public.is_blocked())
  );

-- Admins can view all test answers
CREATE POLICY "Admins can view all test answers"
  ON test_attempt_answers FOR SELECT
  USING ((select public.is_admin()));

-- ===================================================================
-- STEP 8: REMOVED - INSTRUCTOR SYSTEM
-- ===================================================================

-- ===================================================================
-- STEP 9: STUDY MATERIALS - Learning resources
-- ===================================================================

-- All authenticated users can view published materials
CREATE POLICY "Authenticated users can view published materials"
  ON study_materials FOR SELECT
  TO authenticated
  USING (is_published = true AND NOT (select public.is_blocked()));

-- Admins can manage all study materials
CREATE POLICY "Admins can manage all materials"
  ON study_materials FOR ALL
  USING ((select public.is_admin()));

-- All authenticated users can view images for published materials
CREATE POLICY "Authenticated users can view material images"
  ON material_images FOR SELECT
  TO authenticated
  USING (
    NOT (select public.is_blocked()) AND
    EXISTS (
      SELECT 1 FROM study_materials sm
      WHERE sm.id = material_id
      AND sm.is_published = true
    )
  );

-- Admins can manage all material images
CREATE POLICY "Admins can manage material images"
  ON material_images FOR ALL
  USING ((select public.is_admin()));

-- ===================================================================
-- STEP 10: DECISION TRAINER SCENARIOS - Interactive scenarios
-- ===================================================================

-- All authenticated users can view active scenarios
CREATE POLICY "Authenticated users can view active scenarios"
  ON decision_trainer_scenarios FOR SELECT
  TO authenticated
  USING (is_active = true AND NOT (select public.is_blocked()));

-- Admins can manage all scenarios
CREATE POLICY "Admins can manage all scenarios"
  ON decision_trainer_scenarios FOR ALL
  USING ((select public.is_admin()));

-- ===================================================================
-- STEP 11: DECISION TRAINER PROGRESS - User progress tracking
-- ===================================================================

-- Users can view their own progress
CREATE POLICY "Users can view own progress"
  ON decision_trainer_progress FOR SELECT
  USING ((select auth.uid()) = user_id AND NOT (select public.is_blocked()));

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress"
  ON decision_trainer_progress FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id AND NOT (select public.is_blocked()));

-- Users can update their own progress
CREATE POLICY "Users can update own progress"
  ON decision_trainer_progress FOR UPDATE
  USING ((select auth.uid()) = user_id AND NOT (select public.is_blocked()));

-- Admins can view all progress (for analytics)
CREATE POLICY "Admins can view all progress"
  ON decision_trainer_progress FOR SELECT
  USING ((select public.is_admin()));

-- ===================================================================
-- STEP 12: DECISION TRAINER ATTEMPTS - Individual scenario attempts
-- ===================================================================

-- Users can view their own attempts
CREATE POLICY "Users can view own attempts"
  ON decision_trainer_attempts FOR SELECT
  USING ((select auth.uid()) = user_id AND NOT (select public.is_blocked()));

-- Users can insert their own attempts
CREATE POLICY "Users can insert own attempts"
  ON decision_trainer_attempts FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id AND NOT (select public.is_blocked()));

-- Admins can view all attempts (for analytics)
CREATE POLICY "Admins can view all attempts"
  ON decision_trainer_attempts FOR SELECT
  USING ((select public.is_admin()));

-- ===================================================================
-- STEP 13: DECISION TRAINER BADGES - Achievement system
-- ===================================================================

-- Users can view their own badges
CREATE POLICY "Users can view own badges"
  ON decision_trainer_badges FOR SELECT
  USING ((select auth.uid()) = user_id AND NOT (select public.is_blocked()));

-- Users can insert their own badges (earned through gameplay)
CREATE POLICY "Users can insert own badges"
  ON decision_trainer_badges FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id AND NOT (select public.is_blocked()));

-- Admins can view all badges
CREATE POLICY "Admins can view all badges"
  ON decision_trainer_badges FOR SELECT
  USING ((select public.is_admin()));

-- Admins can manage badges (for special awards)
CREATE POLICY "Admins can manage badges"
  ON decision_trainer_badges FOR ALL
  USING ((select public.is_admin()));

-- ===================================================================
-- STEP 14: ORDERS & TRANSACTIONS & SUBSCRIPTIONS
-- ===================================================================

-- Orders
CREATE POLICY "Users can view own orders" ON orders 
  FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own orders" ON orders 
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Admins can view all orders" ON orders 
  FOR SELECT USING ((select public.is_admin()));

CREATE POLICY "Admins can manage all orders" ON orders 
  FOR ALL USING ((select public.is_admin()));

-- Payment Transactions
CREATE POLICY "Users can view own transactions" ON payment_transactions 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = payment_transactions.order_id 
      AND orders.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can view all transactions" ON payment_transactions 
  FOR SELECT USING ((select public.is_admin()));

CREATE POLICY "Admins can manage all transactions" ON payment_transactions 
  FOR ALL USING ((select public.is_admin()));

-- User Plans
CREATE POLICY "Users can view own plans" ON user_plans
  FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own plans" ON user_plans
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own plans" ON user_plans
  FOR UPDATE USING ((select auth.uid()) = user_id);

-- ===================================================================
-- STEP 15: BUG REPORTS & FEEDBACK
-- ===================================================================

-- Bug Reports
CREATE POLICY "Admins can view all bug reports"
  ON bug_reports FOR SELECT
  TO authenticated
  USING ((SELECT is_admin FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert bug reports"
  ON bug_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can insert bug reports"
  ON bug_reports FOR INSERT
  TO anon
  WITH CHECK (true);

-- User Feedback
CREATE POLICY "Admins can view all feedback"
  ON user_feedback FOR SELECT
  TO authenticated
  USING ((SELECT is_admin FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Public can view testimonials"
  ON user_feedback FOR SELECT
  TO anon, authenticated
  USING (is_public_allowed = true);

-- ===================================================================
-- STEP 16: STORAGE BUCKET POLICIES
-- ===================================================================

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('question-images', 'question-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('decision-trainer', 'decision-trainer', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('material-images', 'material-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Anyone can view question images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload question images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update question images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete question images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view decision trainer images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload decision trainer images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update decision trainer images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete decision trainer images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view material images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload material images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update material images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete material images" ON storage.objects;

-- Question Images Storage Policies
CREATE POLICY "Anyone can view question images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'question-images');

CREATE POLICY "Admins can upload question images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'question-images' AND
    (select public.is_admin()) AND
    -- Ensure proper file path structure
    (storage.foldername(name))[1] = 'questions'
  );

CREATE POLICY "Admins can update question images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'question-images' AND
    (select public.is_admin())
  );

CREATE POLICY "Admins can delete question images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'question-images' AND
    (select public.is_admin())
  );

-- Decision Trainer Images Storage Policies
CREATE POLICY "Anyone can view decision trainer images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'decision-trainer');

CREATE POLICY "Admins can upload decision trainer images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'decision-trainer' AND
    (select public.is_admin()) AND
    -- Ensure proper file path structure
    (storage.foldername(name))[1] = 'scenario-images'
  );

CREATE POLICY "Admins can update decision trainer images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'decision-trainer' AND
    (select public.is_admin())
  );

CREATE POLICY "Admins can delete decision trainer images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'decision-trainer' AND
    (select public.is_admin())
  );

-- Study Material Images Storage Policies
CREATE POLICY "Anyone can view material images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'material-images');

CREATE POLICY "Admins can upload material images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'material-images' AND
    (select public.is_admin()) AND
    (storage.foldername(name))[1] = 'materials'
  );

CREATE POLICY "Admins can update material images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'material-images' AND
    (select public.is_admin())
  );

CREATE POLICY "Admins can delete material images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'material-images' AND
    (select public.is_admin())
  );

-- ===================================================================
-- STEP 17: Additional Security Functions (SECURED)
-- ===================================================================

-- Function to check if user can access another user's data (for instructor system)
CREATE OR REPLACE FUNCTION public.can_access_user_data(target_user_id UUID)
RETURNS BOOLEAN 
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  -- Admin can access anyone's data
  IF (select public.is_admin()) THEN
    RETURN TRUE;
  END IF;
  
  -- User can access their own data
  IF (select auth.uid()) = target_user_id THEN
    RETURN TRUE;
  END IF;
  
  -- Bug report special case: if a user submits a bug report, admin sees it, but regular user access is restricted
  -- This function is mostly for profile/progress access
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Function to validate test attempt integrity
CREATE OR REPLACE FUNCTION public.validate_test_attempt(
  p_user_id UUID,
  p_category TEXT,
  p_test_number TEXT,
  p_score INTEGER,
  p_total_questions INTEGER
)
RETURNS BOOLEAN 
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  -- Basic validation
  IF p_user_id != (select auth.uid()) THEN
    RETURN FALSE;
  END IF;
  
  IF p_score < 0 OR p_score > p_total_questions THEN
    RETURN FALSE;
  END IF;
  
  IF p_category NOT IN ('A', 'B', 'C', 'D') THEN
    RETURN FALSE;
  END IF;
  
  -- Check if questions exist for this category/test
  IF NOT EXISTS (
    SELECT 1 FROM admin_questions 
    WHERE category = p_category 
    AND test_number = p_test_number::INTEGER
  ) THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ===================================================================
-- STEP 18: Create audit triggers for sensitive operations (SECURED)
-- ===================================================================

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON audit_log FOR SELECT
  USING ((select public.is_admin()));

-- Function to log sensitive operations
CREATE OR REPLACE FUNCTION log_sensitive_operation()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  -- Log admin operations on user profiles
  IF TG_TABLE_NAME = 'user_profiles' AND (
    (OLD.is_admin != NEW.is_admin) OR 
    (OLD.is_blocked != NEW.is_blocked)
  ) THEN
    INSERT INTO audit_log (table_name, operation, user_id, old_data, new_data)
    VALUES (
      TG_TABLE_NAME,
      TG_OP,
      (select auth.uid()),
      row_to_json(OLD),
      row_to_json(NEW)
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers
DROP TRIGGER IF EXISTS audit_user_profiles ON user_profiles;
CREATE TRIGGER audit_user_profiles
  AFTER UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION log_sensitive_operation();

-- ===================================================================
-- STEP 19: Performance optimization for RLS
-- ===================================================================

-- Clean up duplicate indexes detected by linter
DROP INDEX IF EXISTS idx_test_attempts_user_id_only;
DROP INDEX IF EXISTS idx_user_profiles_is_blocked;

-- Create additional indexes to optimize RLS queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_admin_status ON user_profiles(id, is_admin) WHERE is_admin = true;
CREATE INDEX IF NOT EXISTS idx_user_profiles_blocked_status ON user_profiles(id, is_blocked) WHERE is_blocked = true;

-- Optimize test attempts queries
CREATE INDEX IF NOT EXISTS idx_test_attempts_user_category ON test_attempts(user_id, category);
CREATE INDEX IF NOT EXISTS idx_test_attempts_completed_at_desc ON test_attempts(completed_at DESC);

-- Optimize decision trainer queries
CREATE INDEX IF NOT EXISTS idx_dt_progress_user_category ON decision_trainer_progress(user_id, category);
CREATE INDEX IF NOT EXISTS idx_dt_attempts_user_created ON decision_trainer_attempts(user_id, created_at DESC);

-- ===================================================================
-- STEP 20: Verification and testing (SECURED)
-- ===================================================================

-- Create a test function to verify RLS is working
CREATE OR REPLACE FUNCTION test_rls_policies()
RETURNS TABLE(test_name TEXT, result TEXT) 
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  -- Test 1: Check if RLS is enabled on all tables
  RETURN QUERY
  SELECT 
    'RLS Enabled Check' as test_name,
    CASE 
      WHEN COUNT(*) = 15 THEN 'PASS - All 15 tables have RLS enabled'
      ELSE 'FAIL - Some tables missing RLS: ' || (15 - COUNT(*))::TEXT
    END as result
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
  AND c.relname IN (
    'user_profiles', 'admin_questions', 'test_attempts', 'test_attempt_answers',
    'study_materials', 'material_images', 'decision_trainer_scenarios',
    'decision_trainer_progress', 'decision_trainer_attempts', 'decision_trainer_badges', 'orders', 
    'payment_transactions', 'user_plans', 'bug_reports', 'user_feedback'
  )
  AND c.relrowsecurity = true;
  
  -- Test 2: Check if helper functions exist
  RETURN QUERY
  SELECT 
    'Helper Functions Check' as test_name,
    CASE 
      WHEN COUNT(*) >= 2 THEN 'PASS - Helper functions created'
      ELSE 'FAIL - Missing helper functions'
    END as result
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
  AND p.proname IN ('is_admin', 'is_blocked');
  
  -- Test 3: Check storage bucket policies
  RETURN QUERY
  SELECT 
    'Storage Policies Check' as test_name,
    CASE 
      WHEN COUNT(*) >= 12 THEN 'PASS - Storage policies created'
      ELSE 'FAIL - Missing storage policies'
    END as result
  FROM pg_policies
  WHERE schemaname = 'storage'
  AND tablename = 'objects';
  
END;
$$ LANGUAGE plpgsql;

-- ===================================================================
-- STEP 21: COMPLETION STATUS
-- ===================================================================

SELECT 
  '=== RLS POLICIES SETUP COMPLETE ===' AS status,
  (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') || ' table policies created' AS table_policies,
  (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'storage') || ' storage policies created' AS storage_policies;

-- Run verification tests
SELECT * FROM test_rls_policies();
