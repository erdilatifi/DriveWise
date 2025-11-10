-- ===================================================================
-- Add is_blocked column to user_profiles
-- ===================================================================
-- Run this in Supabase SQL Editor
-- ===================================================================

-- Add is_blocked column if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE;

-- Create index for faster blocked user checks
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_blocked 
ON user_profiles (is_blocked);

-- ===================================================================
-- DONE!
-- ===================================================================
-- The is_blocked column is now available for blocking users
-- Default value is FALSE (not blocked)
-- ===================================================================
