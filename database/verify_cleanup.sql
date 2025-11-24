-- VERIFICATION QUERY
-- Run this to check if any Driving School remnants exist.
-- A CLEAN output means everything is correct.
-- Any rows returned indicate leftover data.

SELECT 'Table' as type, table_name as name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('driving_schools', 'school_payouts', 'plans', 'student_instructor_link')

UNION ALL

SELECT 'Column' as type, table_name || '.' || column_name as name
FROM information_schema.columns
WHERE table_schema = 'public'
AND (
    (table_name = 'user_profiles' AND column_name IN ('driving_school_id', 'is_instructor', 'instructor_code'))
    OR
    (table_name = 'orders' AND column_name IN ('driving_school_id', 'school_share_cents', 'platform_share_cents', 'paddle_transaction_id'))
);
