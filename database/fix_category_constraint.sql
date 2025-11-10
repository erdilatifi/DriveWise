-- ===================================================================
-- DRIVEWISE - Fix Category Constraint (Quick Fix)
-- ===================================================================
-- This script fixes the CHECK constraint to allow only A, B, C, D
-- Run this FIRST before using the app
-- ===================================================================

-- STEP 1: Drop the old CHECK constraint
ALTER TABLE admin_questions 
  DROP CONSTRAINT IF EXISTS admin_questions_category_check;

-- STEP 2: Add new CHECK constraint with only 4 categories
ALTER TABLE admin_questions 
  ADD CONSTRAINT admin_questions_category_check 
  CHECK (category IN ('A', 'B', 'C', 'D'));

-- STEP 3: Do the same for test_attempts table
ALTER TABLE test_attempts 
  DROP CONSTRAINT IF EXISTS test_attempts_category_check;

ALTER TABLE test_attempts 
  ADD CONSTRAINT test_attempts_category_check 
  CHECK (category IN ('A', 'B', 'C', 'D'));

-- STEP 4: Verify the constraints
SELECT 
  conname AS constraint_name,
  conrelid::regclass AS table_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conname LIKE '%category_check%';

-- ===================================================================
-- CONSTRAINT FIX COMPLETE
-- ===================================================================
-- You can now create and update questions with categories A, B, C, D
-- ===================================================================
