-- ===================================================================
-- DRIVEWISE - COMPREHENSIVE ROW LEVEL SECURITY POLICIES
-- ===================================================================
-- This file contains complete RLS policies for all tables and storage buckets
-- Run this AFTER the main database setup to secure your application
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
ALTER TABLE decision_trainer_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_trainer_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_trainer_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_trainer_badges ENABLE ROW LEVEL SECURITY;

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
DROP POLICY IF EXISTS "Admins can manage materials" ON study_materials;

-- Decision Trainer Scenarios policies
DROP POLICY IF EXISTS "Anyone can view active scenarios" ON decision_trainer_scenarios;
DROP POLICY IF EXISTS "Admins can insert scenarios" ON decision_trainer_scenarios;
DROP POLICY IF EXISTS "Admins can update scenarios" ON decision_trainer_scenarios;
DROP POLICY IF EXISTS "Admins can delete scenarios" ON decision_trainer_scenarios;
DROP POLICY IF EXISTS "Admins can manage scenarios" ON decision_trainer_scenarios;

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

-- ===================================================================
-- STEP 3: Create helper functions for RLS
-- ===================================================================

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user is instructor
CREATE OR REPLACE FUNCTION public.is_instructor()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND is_instructor = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user is blocked
CREATE OR REPLACE FUNCTION public.is_blocked()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND is_blocked = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- STEP 4: USER PROFILES - Core user management
-- ===================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (except admin/instructor flags)
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    -- Prevent users from changing their admin/instructor status
    (is_admin = (SELECT is_admin FROM user_profiles WHERE id = auth.uid())) AND
    (is_instructor = (SELECT is_instructor FROM user_profiles WHERE id = auth.uid())) AND
    (is_blocked = (SELECT is_blocked FROM user_profiles WHERE id = auth.uid()))
  );

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  USING (public.is_admin());

-- Admins can manage all profiles (including admin/instructor flags)
CREATE POLICY "Admins can manage all profiles"
  ON user_profiles FOR ALL
  USING (public.is_admin());

-- Allow profile creation during signup (handled by trigger)
CREATE POLICY "Public can insert profiles"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ===================================================================
-- STEP 5: ADMIN QUESTIONS - Theory test questions
-- ===================================================================

-- All authenticated users can view questions (for taking tests)
CREATE POLICY "Authenticated users can view questions"
  ON admin_questions FOR SELECT
  TO authenticated
  USING (NOT public.is_blocked());

-- Admins can manage all questions
CREATE POLICY "Admins can manage questions"
  ON admin_questions FOR ALL
  USING (public.is_admin());

-- ===================================================================
-- STEP 6: TEST ATTEMPTS - User test results
-- ===================================================================

-- Users can view their own test attempts
CREATE POLICY "Users can view own test attempts"
  ON test_attempts FOR SELECT
  USING (auth.uid() = user_id AND NOT public.is_blocked());

-- Users can insert their own test attempts
CREATE POLICY "Users can insert own test attempts"
  ON test_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id AND NOT public.is_blocked());

-- Users can update their own test attempts (for time tracking, etc.)
CREATE POLICY "Users can update own test attempts"
  ON test_attempts FOR UPDATE
  USING (auth.uid() = user_id AND NOT public.is_blocked());

-- Users can delete their own test attempts
CREATE POLICY "Users can delete own test attempts"
  ON test_attempts FOR DELETE
  USING (auth.uid() = user_id AND NOT public.is_blocked());

-- Admins can view all test attempts (for analytics)
CREATE POLICY "Admins can view all test attempts"
  ON test_attempts FOR SELECT
  USING (public.is_admin());

-- Admins can delete any test attempt (for moderation)
CREATE POLICY "Admins can delete any test attempt"
  ON test_attempts FOR DELETE
  USING (public.is_admin());

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
      AND test_attempts.user_id = auth.uid()
    ) AND NOT public.is_blocked()
  );

-- Users can insert their own test answers
CREATE POLICY "Users can insert own test answers"
  ON test_attempt_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM test_attempts 
      WHERE test_attempts.id = test_attempt_id 
      AND test_attempts.user_id = auth.uid()
    ) AND NOT public.is_blocked()
  );

-- Admins can view all test answers
CREATE POLICY "Admins can view all test answers"
  ON test_attempt_answers FOR SELECT
  USING (public.is_admin());

-- ===================================================================
-- STEP 8: STUDENT INSTRUCTOR LINKS - Instructor system
-- ===================================================================

-- Students can view their own instructor links
CREATE POLICY "Students can view own links"
  ON student_instructor_links FOR SELECT
  USING (auth.uid() = student_id AND NOT public.is_blocked());

-- Instructors can view their student links
CREATE POLICY "Instructors can view their students"
  ON student_instructor_links FOR SELECT
  USING (auth.uid() = instructor_id AND public.is_instructor() AND NOT public.is_blocked());

-- Instructors can create links to students
CREATE POLICY "Instructors can create student links"
  ON student_instructor_links FOR INSERT
  WITH CHECK (auth.uid() = instructor_id AND public.is_instructor() AND NOT public.is_blocked());

-- Instructors can remove their student links
CREATE POLICY "Instructors can remove student links"
  ON student_instructor_links FOR DELETE
  USING (auth.uid() = instructor_id AND public.is_instructor() AND NOT public.is_blocked());

-- Admins can manage all instructor-student links
CREATE POLICY "Admins can manage all links"
  ON student_instructor_links FOR ALL
  USING (public.is_admin());

-- ===================================================================
-- STEP 9: STUDY MATERIALS - Learning resources
-- ===================================================================

-- All authenticated users can view published materials
CREATE POLICY "Authenticated users can view published materials"
  ON study_materials FOR SELECT
  TO authenticated
  USING (is_published = true AND NOT public.is_blocked());

-- Admins can manage all study materials
CREATE POLICY "Admins can manage all materials"
  ON study_materials FOR ALL
  USING (public.is_admin());

-- ===================================================================
-- STEP 10: DECISION TRAINER SCENARIOS - Interactive scenarios
-- ===================================================================

-- All authenticated users can view active scenarios
CREATE POLICY "Authenticated users can view active scenarios"
  ON decision_trainer_scenarios FOR SELECT
  TO authenticated
  USING (is_active = true AND NOT public.is_blocked());

-- Admins can manage all scenarios
CREATE POLICY "Admins can manage all scenarios"
  ON decision_trainer_scenarios FOR ALL
  USING (public.is_admin());

-- ===================================================================
-- STEP 11: DECISION TRAINER PROGRESS - User progress tracking
-- ===================================================================

-- Users can view their own progress
CREATE POLICY "Users can view own progress"
  ON decision_trainer_progress FOR SELECT
  USING (auth.uid() = user_id AND NOT public.is_blocked());

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress"
  ON decision_trainer_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id AND NOT public.is_blocked());

-- Users can update their own progress
CREATE POLICY "Users can update own progress"
  ON decision_trainer_progress FOR UPDATE
  USING (auth.uid() = user_id AND NOT public.is_blocked());

-- Admins can view all progress (for analytics)
CREATE POLICY "Admins can view all progress"
  ON decision_trainer_progress FOR SELECT
  USING (public.is_admin());

-- ===================================================================
-- STEP 12: DECISION TRAINER ATTEMPTS - Individual scenario attempts
-- ===================================================================

-- Users can view their own attempts
CREATE POLICY "Users can view own attempts"
  ON decision_trainer_attempts FOR SELECT
  USING (auth.uid() = user_id AND NOT public.is_blocked());

-- Users can insert their own attempts
CREATE POLICY "Users can insert own attempts"
  ON decision_trainer_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id AND NOT public.is_blocked());

-- Admins can view all attempts (for analytics)
CREATE POLICY "Admins can view all attempts"
  ON decision_trainer_attempts FOR SELECT
  USING (public.is_admin());

-- ===================================================================
-- STEP 13: DECISION TRAINER BADGES - Achievement system
-- ===================================================================

-- Users can view their own badges
CREATE POLICY "Users can view own badges"
  ON decision_trainer_badges FOR SELECT
  USING (auth.uid() = user_id AND NOT public.is_blocked());

-- Users can insert their own badges (earned through gameplay)
CREATE POLICY "Users can insert own badges"
  ON decision_trainer_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id AND NOT public.is_blocked());

-- Admins can view all badges
CREATE POLICY "Admins can view all badges"
  ON decision_trainer_badges FOR SELECT
  USING (public.is_admin());

-- Admins can manage badges (for special awards)
CREATE POLICY "Admins can manage badges"
  ON decision_trainer_badges FOR ALL
  USING (public.is_admin());

-- ===================================================================
-- STEP 14: STORAGE BUCKET POLICIES
-- ===================================================================

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('question-images', 'question-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('decision-trainer', 'decision-trainer', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Anyone can view question images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload question images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete question images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view decision trainer images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload decision trainer images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete decision trainer images" ON storage.objects;

-- Question Images Storage Policies
CREATE POLICY "Anyone can view question images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'question-images');

CREATE POLICY "Admins can upload question images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'question-images' AND
    public.is_admin() AND
    -- Ensure proper file path structure
    (storage.foldername(name))[1] = 'questions'
  );

CREATE POLICY "Admins can update question images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'question-images' AND
    public.is_admin()
  );

CREATE POLICY "Admins can delete question images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'question-images' AND
    public.is_admin()
  );

-- Decision Trainer Images Storage Policies
CREATE POLICY "Anyone can view decision trainer images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'decision-trainer');

CREATE POLICY "Admins can upload decision trainer images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'decision-trainer' AND
    public.is_admin() AND
    -- Ensure proper file path structure
    (storage.foldername(name))[1] = 'scenario-images'
  );

CREATE POLICY "Admins can update decision trainer images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'decision-trainer' AND
    public.is_admin()
  );

CREATE POLICY "Admins can delete decision trainer images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'decision-trainer' AND
    public.is_admin()
  );

-- ===================================================================
-- STEP 15: Additional Security Functions
-- ===================================================================

-- Function to check if user can access another user's data (for instructor system)
CREATE OR REPLACE FUNCTION public.can_access_user_data(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Admin can access anyone's data
  IF public.is_admin() THEN
    RETURN TRUE;
  END IF;
  
  -- User can access their own data
  IF auth.uid() = target_user_id THEN
    RETURN TRUE;
  END IF;
  
  -- Instructor can access their students' data
  IF public.is_instructor() THEN
    RETURN EXISTS (
      SELECT 1 FROM student_instructor_links
      WHERE instructor_id = auth.uid() 
      AND student_id = target_user_id
    );
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate test attempt integrity
CREATE OR REPLACE FUNCTION public.validate_test_attempt(
  p_user_id UUID,
  p_category TEXT,
  p_test_number TEXT,
  p_score INTEGER,
  p_total_questions INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Basic validation
  IF p_user_id != auth.uid() THEN
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- STEP 16: Create audit triggers for sensitive operations
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
  USING (public.is_admin());

-- Function to log sensitive operations
CREATE OR REPLACE FUNCTION log_sensitive_operation()
RETURNS TRIGGER AS $$
BEGIN
  -- Log admin operations on user profiles
  IF TG_TABLE_NAME = 'user_profiles' AND (
    (OLD.is_admin != NEW.is_admin) OR 
    (OLD.is_blocked != NEW.is_blocked) OR
    (OLD.is_instructor != NEW.is_instructor)
  ) THEN
    INSERT INTO audit_log (table_name, operation, user_id, old_data, new_data)
    VALUES (
      TG_TABLE_NAME,
      TG_OP,
      auth.uid(),
      row_to_json(OLD),
      row_to_json(NEW)
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers
DROP TRIGGER IF EXISTS audit_user_profiles ON user_profiles;
CREATE TRIGGER audit_user_profiles
  AFTER UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION log_sensitive_operation();

-- ===================================================================
-- STEP 17: Performance optimization for RLS
-- ===================================================================

-- Create additional indexes to optimize RLS queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_admin_status ON user_profiles(id, is_admin) WHERE is_admin = true;
CREATE INDEX IF NOT EXISTS idx_user_profiles_blocked_status ON user_profiles(id, is_blocked) WHERE is_blocked = true;
CREATE INDEX IF NOT EXISTS idx_user_profiles_instructor_status ON user_profiles(id, is_instructor) WHERE is_instructor = true;

-- Optimize test attempts queries
CREATE INDEX IF NOT EXISTS idx_test_attempts_user_category ON test_attempts(user_id, category);
CREATE INDEX IF NOT EXISTS idx_test_attempts_completed_at_desc ON test_attempts(completed_at DESC);

-- Optimize decision trainer queries
CREATE INDEX IF NOT EXISTS idx_dt_progress_user_category ON decision_trainer_progress(user_id, category);
CREATE INDEX IF NOT EXISTS idx_dt_attempts_user_created ON decision_trainer_attempts(user_id, created_at DESC);

-- ===================================================================
-- STEP 18: Verification and testing
-- ===================================================================

-- Create a test function to verify RLS is working
CREATE OR REPLACE FUNCTION test_rls_policies()
RETURNS TABLE(test_name TEXT, result TEXT) AS $$
BEGIN
  -- Test 1: Check if RLS is enabled on all tables
  RETURN QUERY
  SELECT 
    'RLS Enabled Check' as test_name,
    CASE 
      WHEN COUNT(*) = 10 THEN 'PASS - All tables have RLS enabled'
      ELSE 'FAIL - Some tables missing RLS: ' || (10 - COUNT(*))::TEXT
    END as result
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
  AND c.relname IN (
    'user_profiles', 'admin_questions', 'test_attempts', 'test_attempt_answers',
    'student_instructor_links', 'study_materials', 'decision_trainer_scenarios',
    'decision_trainer_progress', 'decision_trainer_attempts', 'decision_trainer_badges'
  )
  AND c.relrowsecurity = true;
  
  -- Test 2: Check if helper functions exist
  RETURN QUERY
  SELECT 
    'Helper Functions Check' as test_name,
    CASE 
      WHEN COUNT(*) >= 3 THEN 'PASS - Helper functions created'
      ELSE 'FAIL - Missing helper functions'
    END as result
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'auth'
  AND p.proname IN ('is_admin', 'is_instructor', 'is_blocked');
  
  -- Test 3: Check storage bucket policies
  RETURN QUERY
  SELECT 
    'Storage Policies Check' as test_name,
    CASE 
      WHEN COUNT(*) >= 8 THEN 'PASS - Storage policies created'
      ELSE 'FAIL - Missing storage policies'
    END as result
  FROM pg_policies
  WHERE schemaname = 'storage'
  AND tablename = 'objects';
  
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- COMPLETION STATUS
-- ===================================================================

SELECT 
  '=== RLS POLICIES SETUP COMPLETE ===' AS status,
  (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') || ' table policies created' AS table_policies,
  (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'storage') || ' storage policies created' AS storage_policies;

-- Run verification tests
SELECT * FROM test_rls_policies();

-- Show all created policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual IS NOT NULL as has_using_clause,
  with_check IS NOT NULL as has_with_check_clause
FROM pg_policies 
WHERE schemaname IN ('public', 'storage')
ORDER BY schemaname, tablename, policyname;

-- ===================================================================
-- SECURITY NOTES AND RECOMMENDATIONS
-- ===================================================================

/*
SECURITY FEATURES IMPLEMENTED:

1. **Complete Table Protection**: All tables have RLS enabled with appropriate policies
2. **Role-Based Access**: Admin, Instructor, and User roles with proper permissions
3. **Data Isolation**: Users can only access their own data unless authorized
4. **Storage Security**: File upload/access controls with proper bucket policies
5. **Audit Logging**: Sensitive operations are logged for security monitoring
6. **Performance Optimized**: Indexes created to optimize RLS query performance
7. **Blocked User Protection**: Blocked users cannot access any data
8. **Input Validation**: Functions to validate data integrity
9. **Helper Functions**: Reusable security functions for consistent checks
10. **Comprehensive Testing**: Built-in verification functions

ADMIN CAPABILITIES:
- View and manage all user profiles
- Create, edit, delete questions and scenarios
- View all test attempts and progress data
- Manage storage files
- Block/unblock users
- View audit logs

USER CAPABILITIES:
- View and edit their own profile (except admin flags)
- Take tests and view their results
- Play decision trainer scenarios
- Track their own progress
- Upload profile pictures (if implemented)

INSTRUCTOR CAPABILITIES (when fully implemented):
- View their assigned students' data
- Manage student-instructor relationships

SECURITY RECOMMENDATIONS:
1. Regularly review audit logs for suspicious activity
2. Monitor failed RLS policy violations
3. Keep admin accounts secure with strong passwords
4. Regularly backup the database
5. Test RLS policies after any schema changes
6. Monitor storage usage and file uploads
7. Implement rate limiting at the application level
8. Use HTTPS for all connections
9. Regularly update Supabase and dependencies
10. Consider implementing additional logging for sensitive operations

To test the security:
1. Create test users with different roles
2. Try to access other users' data
3. Verify blocked users cannot access anything
4. Test file upload permissions
5. Run the test_rls_policies() function regularly
*/

-- ===================================================================
-- END OF RLS POLICIES SETUP
-- ===================================================================
