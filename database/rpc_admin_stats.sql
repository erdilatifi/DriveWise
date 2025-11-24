-- RPC functions for scalable admin dashboard statistics

-- 1. Get general dashboard stats (aggregated on server side)
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  WITH 
    -- User counts
    user_stats AS (
      SELECT count(*) as total_users FROM user_profiles
    ),
    -- Question counts
    question_stats AS (
      SELECT count(*) as total_questions FROM admin_questions
    ),
    -- Attempt stats
    attempt_stats AS (
      SELECT 
        count(*) as total_attempts,
        count(*) FILTER (WHERE percentage >= 80) as passed_attempts,
        count(*) FILTER (WHERE percentage < 80) as failed_attempts
      FROM test_attempts
    ),
    -- Question distribution by category
    questions_by_category AS (
      SELECT json_object_agg(category, count) as category_counts
      FROM (
        SELECT category, count(*) as count 
        FROM admin_questions 
        GROUP BY category
      ) q
    ),
    -- Questions per test
    questions_per_test AS (
      SELECT json_object_agg(key, count) as questions_per_test
      FROM (
        SELECT (category || '-' || test_number) as key, count(*) as count
        FROM admin_questions
        GROUP BY category, test_number
      ) qpt
    ),
    -- Scenarios by category
    scenarios_by_category AS (
      SELECT json_object_agg(category, count) as scenario_category_counts
      FROM (
        SELECT category, count(*) as count 
        FROM decision_trainer_scenarios 
        GROUP BY category
      ) s
    ),
    -- Scenarios by level
    scenarios_by_level AS (
      SELECT json_object_agg(level, count) as scenario_level_counts
      FROM (
        SELECT level, count(*) as count 
        FROM decision_trainer_scenarios 
        GROUP BY level
      ) l
    ),
    -- Materials coverage
    materials_coverage AS (
      SELECT json_object_agg(chapter_id, stats) as materials_by_chapter
      FROM (
        SELECT 
          chapter_id, 
          json_build_object(
            'total', count(*), 
            'published', count(*) FILTER (WHERE is_published = true)
          ) as stats
        FROM study_materials
        GROUP BY chapter_id
      ) m
    )
  SELECT json_build_object(
    'totalUsers', (SELECT total_users FROM user_stats),
    'totalQuestions', (SELECT total_questions FROM question_stats),
    'totalAttempts', (SELECT total_attempts FROM attempt_stats),
    'passedAttempts', (SELECT passed_attempts FROM attempt_stats),
    'failedAttempts', (SELECT failed_attempts FROM attempt_stats),
    'categoryCounts', (SELECT category_counts FROM questions_by_category),
    'questionsPerTest', (SELECT questions_per_test FROM questions_per_test),
    'scenarioCategoryCounts', (SELECT scenario_category_counts FROM scenarios_by_category),
    'scenarioLevelCounts', (SELECT scenario_level_counts FROM scenarios_by_level),
    'materialsByChapter', (SELECT materials_by_chapter FROM materials_coverage)
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Get user activity stats (for user management list, optimized)
-- This allows fetching user list with attempt counts without N+1 queries
CREATE OR REPLACE FUNCTION get_users_with_stats(
  page_number INTEGER,
  page_size INTEGER,
  search_term TEXT DEFAULT NULL,
  role_filter TEXT DEFAULT 'all',
  premium_filter TEXT DEFAULT 'all'
)
RETURNS JSON AS $$
DECLARE
  result JSON;
  total_count INTEGER;
BEGIN
  -- Calculate total count with filters
  SELECT count(*) INTO total_count
  FROM user_profiles u
  WHERE 
    (search_term IS NULL OR u.email ILIKE '%' || search_term || '%' OR u.full_name ILIKE '%' || search_term || '%')
    AND (
      role_filter = 'all' OR
      (role_filter = 'admin' AND u.is_admin = true) OR
      (role_filter = 'instructor' AND u.is_instructor = true) OR
      (role_filter = 'user' AND u.is_admin = false AND u.is_instructor = false)
    )
    AND (
      premium_filter = 'all' OR
      (premium_filter = 'true' AND u.is_premium = true) OR
      (premium_filter = 'false' AND u.is_premium = false)
    );

  -- Fetch paginated data with attempt counts
  SELECT json_build_object(
    'total', total_count,
    'users', json_agg(t)
  ) INTO result
  FROM (
    SELECT 
      u.*,
      (SELECT count(*) FROM test_attempts ta WHERE ta.user_id = u.id) as test_attempts_count
    FROM user_profiles u
    WHERE 
      (search_term IS NULL OR u.email ILIKE '%' || search_term || '%' OR u.full_name ILIKE '%' || search_term || '%')
      AND (
        role_filter = 'all' OR
        (role_filter = 'admin' AND u.is_admin = true) OR
        (role_filter = 'instructor' AND u.is_instructor = true) OR
        (role_filter = 'user' AND u.is_admin = false AND u.is_instructor = false)
      )
      AND (
        premium_filter = 'all' OR
        (premium_filter = 'true' AND u.is_premium = true) OR
        (premium_filter = 'false' AND u.is_premium = false)
      )
    ORDER BY u.created_at DESC
    LIMIT page_size
    OFFSET (page_number - 1) * page_size
  ) t;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
