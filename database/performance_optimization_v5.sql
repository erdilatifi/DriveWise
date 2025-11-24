-- ===================================================================
-- DRIVEWISE - PERFORMANCE OPTIMIZATION V5
-- ===================================================================
-- Adds RPC functions to offload dashboard calculations to the database.
-- ===================================================================

-- 1. Get User Dashboard Stats (Aggregated)
-- Replaces fetching ALL test attempts to calculate basic stats.
CREATE OR REPLACE FUNCTION get_dashboard_stats(p_user_id UUID)
RETURNS TABLE (
  total_tests INTEGER,
  average_score INTEGER,
  best_score INTEGER,
  tests_this_week INTEGER,
  passed_tests INTEGER,
  failed_tests INTEGER
) 
SECURITY DEFINER
SET search_path = public, extensions
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check access: user can only see their own stats, or admin
  IF p_user_id != auth.uid() AND NOT (SELECT public.is_admin()) THEN
    RAISE EXCEPTION 'Unauthorized access to stats';
  END IF;

  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER as total_tests,
    COALESCE(ROUND(AVG(percentage)), 0)::INTEGER as average_score,
    COALESCE(MAX(percentage), 0)::INTEGER as best_score,
    COUNT(*) FILTER (WHERE completed_at >= NOW() - INTERVAL '7 days')::INTEGER as tests_this_week,
    COUNT(*) FILTER (WHERE percentage >= 80)::INTEGER as passed_tests,
    COUNT(*) FILTER (WHERE percentage < 80)::INTEGER as failed_tests
  FROM test_attempts
  WHERE user_id = p_user_id;
END;
$$;

-- 2. Get Weekly Progress (Chart Data)
-- Aggregates scores by day for the last 7 days.
CREATE OR REPLACE FUNCTION get_weekly_progress(p_user_id UUID)
RETURNS TABLE (
  attempt_date DATE,
  daily_avg_score INTEGER
) 
SECURITY DEFINER
SET search_path = public, extensions
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_user_id != auth.uid() AND NOT (SELECT public.is_admin()) THEN
    RAISE EXCEPTION 'Unauthorized access to progress';
  END IF;

  RETURN QUERY
  SELECT
    completed_at::DATE as attempt_date,
    ROUND(AVG(percentage))::INTEGER as daily_avg_score
  FROM test_attempts
  WHERE user_id = p_user_id
  AND completed_at >= NOW() - INTERVAL '7 days'
  GROUP BY completed_at::DATE
  ORDER BY completed_at::DATE ASC;
END;
$$;

-- 3. Get Recent Tests (Limit 4)
-- Efficiently fetches just the last few tests for the dashboard list.
CREATE OR REPLACE FUNCTION get_recent_tests(p_user_id UUID, p_limit INTEGER DEFAULT 4)
RETURNS TABLE (
  id UUID,
  category VARCHAR,
  test_number VARCHAR,
  score INTEGER,
  percentage DECIMAL,
  completed_at TIMESTAMP WITH TIME ZONE
) 
SECURITY DEFINER
SET search_path = public, extensions
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_user_id != auth.uid() AND NOT (SELECT public.is_admin()) THEN
    RAISE EXCEPTION 'Unauthorized access to tests';
  END IF;

  RETURN QUERY
  SELECT
    t.id,
    t.category,
    t.test_number,
    t.score,
    t.percentage,
    t.completed_at
  FROM test_attempts t
  WHERE t.user_id = p_user_id
  ORDER BY t.completed_at DESC
  LIMIT p_limit;
END;
$$;

-- 4. Get Global Streak (Optimized)
-- Fetches ONLY dates, not full rows, for streak calculation.
-- While JS calc is fine, minimizing data transfer is key.
-- Note: We still return dates to JS for complex logic or implement gap-and-island here.
-- For now, let's just ensure we have an index on completed_at (already done) and created_at.

-- Ensure indexes exist for performance
CREATE INDEX IF NOT EXISTS idx_decision_trainer_attempts_created_at ON decision_trainer_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_test_attempts_completed_at ON test_attempts(completed_at);

-- Grant access to authenticated users
GRANT EXECUTE ON FUNCTION get_dashboard_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_weekly_progress(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_tests(UUID, INTEGER) TO authenticated;
