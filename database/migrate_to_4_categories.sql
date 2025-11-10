-- ===================================================================
-- DRIVEWISE - Migration to 4 Categories (A, B, C, D)
-- ===================================================================
-- This script migrates the database from 6 categories to 4 categories
-- Run this in Supabase SQL Editor
-- ===================================================================

-- STEP 1: Backup existing data with C1 and CE categories (OPTIONAL)
-- Uncomment if you want to keep a backup before deletion
-- CREATE TABLE IF NOT EXISTS admin_questions_backup AS 
-- SELECT * FROM admin_questions WHERE category IN ('C1', 'CE');

-- CREATE TABLE IF NOT EXISTS test_attempts_backup AS 
-- SELECT * FROM test_attempts WHERE category IN ('C1', 'CE');

-- ===================================================================
-- STEP 2: Handle existing C1 and CE category data
-- ===================================================================
-- OPTION A: Delete all questions with C1 and CE categories (UNCOMMENT TO USE)
-- WARNING: This will permanently delete questions for C1 and CE categories

-- DELETE FROM test_attempt_answers 
-- WHERE test_attempt_id IN (
--   SELECT id FROM test_attempts WHERE category IN ('C1', 'CE')
-- );

-- DELETE FROM test_attempts 
-- WHERE category IN ('C1', 'CE');

-- DELETE FROM admin_questions 
-- WHERE category IN ('C1', 'CE');

-- OPTION B: Migrate C1 and CE to C category (RECOMMENDED - UNCOMMENT TO USE)
-- This preserves your existing questions by converting them to category C

UPDATE admin_questions 
SET category = 'C', updated_at = NOW()
WHERE category IN ('C1', 'CE');

UPDATE test_attempts 
SET category = 'C'
WHERE category IN ('C1', 'CE');

-- ===================================================================
-- STEP 3: Update the license_category ENUM type
-- ===================================================================
-- Drop and recreate the enum with only 4 values

-- First, alter columns to use VARCHAR temporarily
ALTER TABLE admin_questions 
  ALTER COLUMN category TYPE VARCHAR(10);

ALTER TABLE test_attempts 
  ALTER COLUMN category TYPE VARCHAR(10);

-- Drop the old enum type
DROP TYPE IF EXISTS license_category CASCADE;

-- Create new enum with only 4 categories
CREATE TYPE license_category AS ENUM ('A', 'B', 'C', 'D');

-- Update the CHECK constraint on admin_questions
ALTER TABLE admin_questions 
  DROP CONSTRAINT IF EXISTS admin_questions_category_check;

ALTER TABLE admin_questions 
  ADD CONSTRAINT admin_questions_category_check 
  CHECK (category IN ('A', 'B', 'C', 'D'));

-- Update the CHECK constraint on test_attempts (if it exists)
ALTER TABLE test_attempts 
  DROP CONSTRAINT IF EXISTS test_attempts_category_check;

ALTER TABLE test_attempts 
  ADD CONSTRAINT test_attempts_category_check 
  CHECK (category IN ('A', 'B', 'C', 'D'));

-- ===================================================================
-- STEP 4: Verify the migration
-- ===================================================================

-- Check remaining categories in admin_questions
SELECT category, COUNT(*) as question_count 
FROM admin_questions 
GROUP BY category 
ORDER BY category;

-- Check remaining categories in test_attempts
SELECT category, COUNT(*) as attempt_count 
FROM test_attempts 
GROUP BY category 
ORDER BY category;

-- ===================================================================
-- MIGRATION COMPLETE
-- ===================================================================
-- You should now have only categories A, B, C, and D in your database
-- ===================================================================
