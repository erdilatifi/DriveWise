-- Drop Tables with CASCADE to remove dependent constraints/policies
DROP TABLE IF EXISTS school_payouts CASCADE;
DROP TABLE IF EXISTS plans CASCADE;
DROP TABLE IF EXISTS student_instructor_link CASCADE;
DROP TABLE IF EXISTS driving_schools CASCADE; 

-- Drop Functions
DROP FUNCTION IF EXISTS get_admin_payouts_overview CASCADE;
DROP FUNCTION IF EXISTS mark_payout_paid CASCADE;

-- Remove Columns from Orders with CASCADE
-- CASCADE ensures any policies using these columns are also dropped
ALTER TABLE orders 
DROP COLUMN IF EXISTS driving_school_id CASCADE,
DROP COLUMN IF EXISTS school_share_cents CASCADE,
DROP COLUMN IF EXISTS platform_share_cents CASCADE,
DROP COLUMN IF EXISTS paddle_transaction_id CASCADE;

-- Remove Columns from User Profiles with CASCADE
-- This fixes the specific error "cannot drop column... because other objects depend on it"
ALTER TABLE user_profiles 
DROP COLUMN IF EXISTS driving_school_id CASCADE,
DROP COLUMN IF EXISTS is_instructor CASCADE,
DROP COLUMN IF EXISTS instructor_code CASCADE;

-- Clean up any lingering policies (just in case)
DROP POLICY IF EXISTS "Driving schools can view their students profiles" ON user_profiles;
DROP POLICY IF EXISTS "Driving schools can view students plans" ON user_plans;
DROP POLICY IF EXISTS "Driving schools can view students orders" ON orders;
DROP POLICY IF EXISTS "Driving schools can insert plans for their students" ON user_plans;
DROP POLICY IF EXISTS "Driving schools can insert orders for their students" ON orders;
DROP POLICY IF EXISTS "Driving schools can update plans for their students" ON user_plans;
