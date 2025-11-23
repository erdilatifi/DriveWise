-- Add subscription_id to user_profiles to support subscription management
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS subscription_id TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_id 
ON user_profiles(subscription_id);
