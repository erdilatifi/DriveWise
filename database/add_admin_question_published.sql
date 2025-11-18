-- Add is_published flag to admin_questions for draft/published workflow
-- Run this in Supabase SQL editor after the main setup scripts.

ALTER TABLE admin_questions
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;

-- Mark all existing questions as published by default
UPDATE admin_questions
SET is_published = TRUE
WHERE is_published IS NULL;

-- Optional index to speed up published/draft filtering
CREATE INDEX IF NOT EXISTS idx_admin_questions_published
  ON admin_questions(is_published);
