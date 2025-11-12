-- ============================================================================
-- FIX: Create user profiles for all auth users
-- Run this ONCE in Supabase SQL Editor
-- ============================================================================

-- Step 1: Create profiles for any auth users that don't have them
INSERT INTO user_profiles (id, email, full_name, created_at)
SELECT 
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'full_name', 
    split_part(au.email, '@', 1),
    'User'
  ) as full_name,
  au.created_at
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
WHERE up.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Step 2: Verify - Show results
SELECT 
  'Profiles Created' as step,
  COUNT(*) as total_auth_users,
  (SELECT COUNT(*) FROM user_profiles) as total_profiles,
  CASE 
    WHEN COUNT(*) = (SELECT COUNT(*) FROM user_profiles) 
    THEN '✅ SUCCESS: All users have profiles'
    ELSE '⚠️ WARNING: Some users still missing profiles'
  END as status
FROM auth.users;

-- Step 3: Show any remaining users without profiles (should be empty)
SELECT 
  au.id,
  au.email,
  'Still missing profile - contact support' as issue
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
WHERE up.id IS NULL;

-- Step 4: Show test_attempts table status
SELECT 
  'Test Attempts Table' as info,
  COUNT(*) as total_tests,
  COUNT(DISTINCT user_id) as unique_users,
  MAX(completed_at) as last_test_date
FROM test_attempts;

-- Step 5: Show leaderboard preview
SELECT 
  full_name,
  total_tests,
  average_score,
  best_score
FROM tests_leaderboard
ORDER BY average_score DESC
LIMIT 5;
