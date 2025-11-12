-- Check if test_attempts table exists and its structure

-- 1. Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'test_attempts'
) as table_exists;

-- 2. Show table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'test_attempts'
ORDER BY ordinal_position;

-- 3. Check RLS status
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'test_attempts';

-- 4. Show existing test attempts (if any)
SELECT COUNT(*) as total_attempts FROM test_attempts;

-- 5. Try a test insert (will rollback)
BEGIN;
  INSERT INTO test_attempts (
    user_id,
    category,
    test_number,
    score,
    total_questions,
    percentage,
    time_taken_seconds,
    completed_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', -- dummy UUID
    'A',
    '1',
    8,
    10,
    80.00,
    300,
    NOW()
  );
  SELECT 'Test insert successful' as result;
ROLLBACK;
