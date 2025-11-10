-- ===================================================================
-- DRIVEWISE - Add Multiple Correct Answers Support
-- ===================================================================
-- Run this in Supabase SQL Editor
-- ===================================================================

-- Step 1: Add new column for multiple answers (array of correct answers)
ALTER TABLE admin_questions 
ADD COLUMN IF NOT EXISTS correct_answers TEXT[] DEFAULT NULL;

-- Step 2: Migrate existing single answers to array format
UPDATE admin_questions 
SET correct_answers = ARRAY[correct_answer]
WHERE correct_answers IS NULL;

-- Step 3: Add check constraint to ensure at least one correct answer
ALTER TABLE admin_questions
ADD CONSTRAINT check_has_correct_answers 
CHECK (
  (correct_answer IS NOT NULL) OR 
  (correct_answers IS NOT NULL AND array_length(correct_answers, 1) > 0)
);

-- Step 4: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_admin_questions_correct_answers 
ON admin_questions USING GIN (correct_answers);

-- Step 5: Update test_attempts table to store array of user answers
ALTER TABLE test_attempts
ADD COLUMN IF NOT EXISTS user_answers JSONB DEFAULT NULL;

-- Note: We keep the old 'correct_answer' column for backward compatibility
-- New questions can use 'correct_answers' array
-- Old questions will continue to work with 'correct_answer'

-- ===================================================================
-- MIGRATION COMPLETE!
-- ===================================================================
-- New columns added:
-- - correct_answers: TEXT[] (array of correct answers like ['A', 'B'])
-- - user_answers: JSONB (stores user's selected answers per question)
-- 
-- Usage:
-- - Single answer: correct_answers = ['A']
-- - Multiple answers: correct_answers = ['A', 'B'] or ['A', 'C'] etc.
-- ===================================================================
