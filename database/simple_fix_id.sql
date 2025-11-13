-- ===================================================================
-- SIMPLE FIX FOR DECISION TRAINER ID COLUMN
-- ===================================================================
-- Run each section step by step in Supabase SQL Editor
-- ===================================================================

-- STEP 1: Check current table structure
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'decision_trainer_scenarios' 
AND column_name = 'id';

-- STEP 2: Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- STEP 3: Fix the ID column to auto-generate UUIDs
ALTER TABLE decision_trainer_scenarios 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- STEP 4: Verify the fix worked
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'decision_trainer_scenarios' 
AND column_name = 'id';

-- STEP 5: Test insert (should work without specifying ID)
INSERT INTO decision_trainer_scenarios (
  category,
  level,
  question,
  options,
  correct_explanation,
  real_world_tip,
  xp,
  is_active
) VALUES (
  'traffic-lights',
  1,
  'Test auto-generated ID',
  '[{"text": "Option A", "isCorrect": true}, {"text": "Option B", "isCorrect": false}]'::jsonb,
  'This is a test explanation',
  'This is a test tip',
  25,
  true
);

-- STEP 6: Check that the record was created with auto-generated ID
SELECT id, category, question 
FROM decision_trainer_scenarios 
WHERE question = 'Test auto-generated ID';

-- STEP 7: Clean up test record
DELETE FROM decision_trainer_scenarios 
WHERE question = 'Test auto-generated ID';

-- STEP 8: Final verification
SELECT 
  CASE 
    WHEN column_default LIKE '%uuid_generate_v4%' 
    THEN '✅ SUCCESS: ID column now auto-generates UUIDs!'
    ELSE '❌ FAILED: ID column still needs manual input'
  END as result
FROM information_schema.columns 
WHERE table_name = 'decision_trainer_scenarios' 
AND column_name = 'id';
