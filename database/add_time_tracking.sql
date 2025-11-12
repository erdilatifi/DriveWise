-- Migration: Add time tracking columns to decision_trainer_progress
-- Run this BEFORE running the main schema

-- Add columns if they don't exist
ALTER TABLE decision_trainer_progress 
ADD COLUMN IF NOT EXISTS best_time_seconds INTEGER,
ADD COLUMN IF NOT EXISTS average_time_seconds INTEGER;

-- Update the view to include time tracking
DROP VIEW IF EXISTS decision_trainer_leaderboard;

CREATE OR REPLACE VIEW decision_trainer_leaderboard AS
SELECT 
  p.user_id,
  COALESCE(up.full_name, up.email) as full_name,
  up.email,
  SUM(p.total_xp) as total_xp,
  SUM(p.scenarios_completed) as total_scenarios,
  SUM(p.correct_answers) as total_correct,
  SUM(p.total_attempts) as total_attempts,
  MAX(p.best_streak) as best_streak,
  MIN(p.best_time_seconds) as best_time_seconds,
  ROUND(AVG(p.average_time_seconds)) as average_time_seconds,
  CASE 
    WHEN SUM(p.total_attempts) > 0 
    THEN ROUND((SUM(p.correct_answers)::NUMERIC / SUM(p.total_attempts)::NUMERIC) * 100, 1)
    ELSE 0 
  END as accuracy,
  COUNT(DISTINCT p.category) as categories_completed
FROM decision_trainer_progress p
LEFT JOIN user_profiles up ON p.user_id = up.id
GROUP BY p.user_id, up.full_name, up.email
ORDER BY total_xp DESC, best_time_seconds ASC NULLS LAST;
