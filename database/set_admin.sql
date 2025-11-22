-- ===================================================================
-- SET ADMIN USER
-- ===================================================================
-- Replace 'your-email@example.com' with your actual email address.
-- Run this in the Supabase SQL Editor.

UPDATE user_profiles 
SET is_admin = true, is_instructor = true
WHERE email = 'your-email@example.com';

-- Verify the change
SELECT email, is_admin, is_instructor FROM user_profiles WHERE is_admin = true;
