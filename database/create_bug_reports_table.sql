-- Create bug_reports table
CREATE TABLE IF NOT EXISTS bug_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional, if logged in
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  steps_to_reproduce TEXT,
  location VARCHAR(50), -- Dashboard, Mock test list, etc.
  device_browser TEXT,
  contact_email TEXT,
  status VARCHAR(20) DEFAULT 'open', -- open, in_progress, resolved, closed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE bug_reports ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Admins can view all bug reports
CREATE POLICY "Admins can view all bug reports"
  ON bug_reports
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin FROM user_profiles WHERE id = auth.uid()));

-- 2. Authenticated users can insert their own reports
CREATE POLICY "Users can insert bug reports"
  ON bug_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 3. Allow anon inserts if we want (optional, but prompt implies user might provide email)
-- Since app seems to be behind auth mostly, we'll stick to authenticated or anon if public routes exist.
-- The user request implies "entry point... main navigation", which could be public.
-- Let's allow anon insert for robustness, but usually user_id will be null.
CREATE POLICY "Anyone can insert bug reports"
  ON bug_reports
  FOR INSERT
  TO anon
  WITH CHECK (true);
