-- Add is_published flag to decision_trainer_scenarios for draft/published workflow
-- Run this in Supabase SQL editor after the main setup scripts.

ALTER TABLE decision_trainer_scenarios
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;

-- Mark all existing scenarios as published by default
UPDATE decision_trainer_scenarios
SET is_published = TRUE
WHERE is_published IS NULL;

-- Optional index to speed up published/draft filtering
CREATE INDEX IF NOT EXISTS idx_dt_scenarios_published
  ON decision_trainer_scenarios(is_published);
