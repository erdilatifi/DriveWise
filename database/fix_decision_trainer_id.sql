-- ===================================================================
-- FIX DECISION TRAINER ID COLUMN - AUTO GENERATE UUIDs
-- ===================================================================
-- Run this in Supabase SQL Editor to fix the ID column issue
-- ===================================================================

-- 1. First, check current table structure
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns 
WHERE table_name = 'decision_trainer_scenarios' 
AND column_name = 'id';

-- 2. Drop the existing table if it has wrong ID setup (ONLY if no important data)
-- UNCOMMENT ONLY if you want to recreate the table:
-- DROP TABLE IF EXISTS decision_trainer_scenarios CASCADE;

-- 3. Alternative: Alter existing table to auto-generate UUIDs
-- This preserves existing data if any

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Update the ID column to auto-generate UUIDs
ALTER TABLE decision_trainer_scenarios 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- If the column is TEXT instead of UUID, we need to change the type
-- WARNING: This will fail if there's existing data with non-UUID format
-- ALTER TABLE decision_trainer_scenarios 
-- ALTER COLUMN id TYPE UUID USING id::UUID;

-- 4. Verify the fix
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns 
WHERE table_name = 'decision_trainer_scenarios' 
AND column_name = 'id';

-- 5. Test insert without ID (should auto-generate)
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

-- 6. Verify the test record was created with auto-generated ID
SELECT id, category, question, created_at 
FROM decision_trainer_scenarios 
WHERE question = 'Test auto-generated ID';

-- 7. Clean up test record
DELETE FROM decision_trainer_scenarios 
WHERE question = 'Test auto-generated ID';

-- ===================================================================
-- ALTERNATIVE: Recreate table with proper structure (if needed)
-- ===================================================================

/*
-- ONLY run this if the ALTER approach doesn't work:

DROP TABLE IF EXISTS decision_trainer_scenarios CASCADE;

CREATE TABLE decision_trainer_scenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 4),
  question TEXT NOT NULL,
  image_url TEXT,
  options JSONB NOT NULL,
  correct_explanation TEXT NOT NULL,
  real_world_tip TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 25,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_dt_scenarios_category ON decision_trainer_scenarios(category);
CREATE INDEX IF NOT EXISTS idx_dt_scenarios_active ON decision_trainer_scenarios(is_active);

-- Enable RLS
ALTER TABLE decision_trainer_scenarios ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active scenarios"
  ON decision_trainer_scenarios FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can insert scenarios"
  ON decision_trainer_scenarios FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update scenarios"
  ON decision_trainer_scenarios FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete scenarios"
  ON decision_trainer_scenarios FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );
*/

-- ===================================================================
-- VERIFICATION
-- ===================================================================

-- Check final table structure (Supabase compatible)
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable,
  character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'decision_trainer_scenarios'
ORDER BY ordinal_position;

-- Test that auto-generation works
SELECT 
  CASE 
    WHEN column_default LIKE '%uuid_generate_v4%' 
    THEN '✅ ID column setup correctly! Auto-generation enabled.'
    ELSE '❌ ID column needs fixing. Default: ' || COALESCE(column_default, 'NULL')
  END as status
FROM information_schema.columns 
WHERE table_name = 'decision_trainer_scenarios' 
AND column_name = 'id';
