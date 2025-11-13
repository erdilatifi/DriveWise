-- ===================================================================
-- DEBUG DECISION TRAINER ISSUES
-- ===================================================================
-- Run this in Supabase SQL Editor to check table structure and permissions
-- ===================================================================

-- 1. Check if decision_trainer_scenarios table exists
SELECT 
  table_name,
  table_schema
FROM information_schema.tables 
WHERE table_name = 'decision_trainer_scenarios';

-- 2. Check table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'decision_trainer_scenarios'
ORDER BY ordinal_position;

-- 3. Check if table has any data
SELECT 
  COUNT(*) as total_scenarios,
  COUNT(DISTINCT category) as categories,
  MIN(created_at) as oldest_scenario,
  MAX(created_at) as newest_scenario
FROM decision_trainer_scenarios;

-- 4. Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'decision_trainer_scenarios';

-- 5. Test insert permissions (this will show the actual error)
-- UNCOMMENT TO TEST:
/*
INSERT INTO decision_trainer_scenarios (
  category,
  level,
  question,
  options,
  correct_explanation,
  real_world_tip,
  xp,
  is_active
) VALUES (
  'traffic-lights',
  1,
  'Test question',
  '[{"text": "Option 1", "isCorrect": true}, {"text": "Option 2", "isCorrect": false}]'::jsonb,
  'Test explanation',
  'Test tip',
  25,
  true
);
*/

-- 6. Check user permissions
SELECT 
  current_user as current_user,
  session_user as session_user,
  current_setting('role') as current_role;

-- 7. Check if user_profiles table exists and user is admin
SELECT 
  id,
  email,
  is_admin,
  created_at
FROM user_profiles 
WHERE id = auth.uid();

-- ===================================================================
-- COMMON ISSUES AND SOLUTIONS:
-- ===================================================================

/*
ISSUE 1: Table doesn't exist
SOLUTION: Run decision_trainer_schema.sql

ISSUE 2: RLS blocking inserts
SOLUTION: Check if user is authenticated and has admin privileges

ISSUE 3: Column mismatch
SOLUTION: Check if all columns exist and have correct data types

ISSUE 4: JSON format issues
SOLUTION: Ensure options field accepts JSONB format

ISSUE 5: Missing created_by field
SOLUTION: Add created_by UUID REFERENCES auth.users(id)
*/
