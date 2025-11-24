-- Create user_feedback table to store testimonials and deletion reasons
-- This table is designed to retain data even after the user is deleted from auth.users

CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- Stored for reference, but NO foreign key constraint to allow user deletion
  display_name TEXT, -- Snapshot of user name for testimonials
  avatar_url TEXT, -- Snapshot of avatar for testimonials
  email TEXT, -- Snapshot of email (kept private, for admin reference)
  reason TEXT NOT NULL, -- 'passed', 'not-needed', 'unsatisfied', 'duplicate', 'other'
  comment TEXT, -- The actual feedback/testimonial text
  is_public_allowed BOOLEAN DEFAULT false, -- If true, can be shown on landing page
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Policies

-- 1. Admins can view all feedback
CREATE POLICY "Admins can view all feedback"
  ON user_feedback
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin FROM user_profiles WHERE id = auth.uid()));

-- 2. Public/Everyone can view APPROVED testimonials (is_public_allowed = true)
-- Note: You might want to add an 'is_featured' or 'admin_approved' column later for extra safety
CREATE POLICY "Public can view testimonials"
  ON user_feedback
  FOR SELECT
  TO anon, authenticated
  USING (is_public_allowed = true);

-- 3. Server-side inserts are handled by Service Role (bypasses RLS)
-- But if we wanted client-side insert:
-- CREATE POLICY "Users can insert feedback" ON user_feedback FOR INSERT TO authenticated WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_feedback_public ON user_feedback(is_public_allowed);
CREATE INDEX IF NOT EXISTS idx_user_feedback_reason ON user_feedback(reason);
