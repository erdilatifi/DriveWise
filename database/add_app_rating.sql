-- Add app_rating column to user_profiles table
-- This allows users to rate the app (1-5 stars) after their first test

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS app_rating INTEGER CHECK (app_rating >= 1 AND app_rating <= 5);

-- Add comment to explain the column
COMMENT ON COLUMN user_profiles.app_rating IS 'User rating of the app (1-5 stars), shown after first test completion';
