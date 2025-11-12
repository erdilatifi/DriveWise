-- Create user profiles for any auth users that don't have profiles yet
-- This fixes the foreign key constraint issue

-- Insert profiles for auth users that don't have profiles
INSERT INTO user_profiles (id, email, full_name, created_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1)) as full_name,
  au.created_at
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
WHERE up.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Verify all auth users now have profiles
SELECT 
  COUNT(*) as auth_users,
  (SELECT COUNT(*) FROM user_profiles) as profiles,
  CASE 
    WHEN COUNT(*) = (SELECT COUNT(*) FROM user_profiles) 
    THEN '✅ All users have profiles'
    ELSE '❌ Some users missing profiles'
  END as status
FROM auth.users;

-- Show any users without profiles (should be empty)
SELECT 
  au.id,
  au.email,
  'Missing profile' as issue
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
WHERE up.id IS NULL;
