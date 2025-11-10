-- ===================================================================
-- DRIVEWISE - Diagnose Admin Questions Issues
-- ===================================================================
-- Run this to see what's wrong with your admin_questions table
-- ===================================================================

-- Check if table exists
SELECT 
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'admin_questions')
        THEN '✅ Table EXISTS'
        ELSE '❌ Table DOES NOT EXIST'
    END AS table_status;

-- Show table structure
SELECT 
    '📋 TABLE STRUCTURE' AS info,
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'admin_questions'
ORDER BY ordinal_position;

-- Show all constraints
SELECT 
    '🔒 CONSTRAINTS' AS info,
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'admin_questions'::regclass;

-- Show indexes
SELECT 
    '📊 INDEXES' AS info,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'admin_questions';

-- Check RLS status
SELECT 
    '🔐 ROW LEVEL SECURITY' AS info,
    relname AS table_name,
    relrowsecurity AS rls_enabled,
    relforcerowsecurity AS rls_forced
FROM pg_class
WHERE relname = 'admin_questions';

-- Show policies (if any)
SELECT 
    '📜 POLICIES' AS info,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'admin_questions';

-- Check permissions
SELECT 
    '👥 PERMISSIONS' AS info,
    grantee,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'admin_questions';

-- Count existing questions
SELECT 
    '📈 DATA COUNT' AS info,
    COUNT(*) AS total_questions,
    COUNT(DISTINCT category) AS unique_categories
FROM admin_questions;

-- Show questions by category
SELECT 
    '📊 QUESTIONS BY CATEGORY' AS info,
    category,
    COUNT(*) AS count
FROM admin_questions
GROUP BY category
ORDER BY category;

-- Test insert capability (will rollback)
DO $$ 
BEGIN
    BEGIN
        INSERT INTO admin_questions (
            category, test_number, question_text,
            option_a, option_b, option_c, correct_answer
        ) VALUES (
            'B', 1, 'Diagnostic test question',
            'Test A', 'Test B', 'Test C', 'A'
        );
        
        RAISE NOTICE '✅ INSERT TEST: SUCCESS';
        
        -- Rollback
        RAISE EXCEPTION 'Rolling back test insert';
    EXCEPTION
        WHEN OTHERS THEN
            IF SQLERRM LIKE '%Rolling back%' THEN
                RAISE NOTICE '✅ Test completed and rolled back';
            ELSE
                RAISE NOTICE '❌ INSERT TEST FAILED: %', SQLERRM;
            END IF;
    END;
END $$;

-- ===================================================================
-- DIAGNOSIS COMPLETE
-- ===================================================================
-- Review the output above to identify issues
-- Then run fix_admin_questions_v2.sql to fix them
-- ===================================================================
