-- ===================================================================
-- DRIVEWISE - Fix Admin Questions Table
-- ===================================================================
-- This script ensures the admin_questions table works properly
-- Run this in Supabase SQL Editor
-- ===================================================================

-- STEP 1: Drop and recreate the table with correct structure
DROP TABLE IF EXISTS admin_questions CASCADE;

-- STEP 2: Create admin_questions table with proper structure
CREATE TABLE admin_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(10) NOT NULL CHECK (category IN ('A', 'B', 'C', 'D')),
  test_number INTEGER NOT NULL CHECK (test_number BETWEEN 1 AND 10),
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  correct_answer VARCHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 3: Create index for better performance
CREATE INDEX idx_admin_questions_category ON admin_questions(category);
CREATE INDEX idx_admin_questions_test_number ON admin_questions(test_number);
CREATE INDEX idx_admin_questions_category_test ON admin_questions(category, test_number);

-- STEP 4: Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_admin_questions_updated_at ON admin_questions;

CREATE TRIGGER update_admin_questions_updated_at
    BEFORE UPDATE ON admin_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- STEP 5: Disable RLS (Row Level Security) for admin operations
ALTER TABLE admin_questions DISABLE ROW LEVEL SECURITY;

-- STEP 6: Grant necessary permissions
GRANT ALL ON admin_questions TO authenticated;
GRANT ALL ON admin_questions TO anon;

-- STEP 7: Verify the table structure
SELECT 
  column_name, 
  data_type, 
  character_maximum_length,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'admin_questions'
ORDER BY ordinal_position;

-- ===================================================================
-- FIX COMPLETE
-- ===================================================================
-- You can now add, edit, and delete questions without errors
-- ===================================================================
