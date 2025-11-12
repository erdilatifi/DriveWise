-- Create Tests Leaderboard View
-- Shows aggregated test performance for all users

-- Drop existing view if it exists
DROP VIEW IF EXISTS tests_leaderboard;

-- Create leaderboard view for test attempts
CREATE OR REPLACE VIEW tests_leaderboard AS
SELECT 
  ta.user_id,
  COALESCE(up.full_name, up.email) as full_name,
  up.email,
  COUNT(DISTINCT ta.id) as total_tests,
  COUNT(DISTINCT CASE WHEN ta.percentage >= 80 THEN ta.id END) as tests_passed,
  COUNT(DISTINCT CASE WHEN ta.percentage < 80 THEN ta.id END) as tests_failed,
  ROUND(AVG(ta.percentage), 1) as average_score,
  MAX(ta.percentage) as best_score,
  SUM(ta.score) as total_correct,
  SUM(ta.total_questions) as total_questions,
  ROUND(AVG(ta.percentage), 1) as overall_accuracy,
  COUNT(DISTINCT ta.category) as categories_attempted,
  MAX(ta.completed_at) as last_test_date
FROM test_attempts ta
LEFT JOIN user_profiles up ON ta.user_id = up.id
WHERE ta.completed_at IS NOT NULL
GROUP BY ta.user_id, up.full_name, up.email
ORDER BY average_score DESC, total_tests DESC;

-- Grant access
GRANT SELECT ON tests_leaderboard TO authenticated;
