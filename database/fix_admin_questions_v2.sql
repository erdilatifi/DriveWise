-- ===================================================================
-- DRIVEWISE - Complete Admin Questions Fix (V2)
-- ===================================================================
-- This script completely fixes the admin_questions table
-- Run this ENTIRE script in Supabase SQL Editor
-- ===================================================================

-- STEP 1: Check if table exists and show current structure
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'admin_questions') THEN
        RAISE NOTICE 'Table admin_questions exists. Backing up data...';
    ELSE
        RAISE NOTICE 'Table admin_questions does not exist. Will create new.';
    END IF;
END $$;

-- STEP 2: Backup existing data (if any)
CREATE TABLE IF NOT EXISTS admin_questions_backup_temp AS 
SELECT * FROM admin_questions WHERE 1=0;

DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'admin_questions') THEN
        INSERT INTO admin_questions_backup_temp SELECT * FROM admin_questions;
        RAISE NOTICE 'Backed up % rows', (SELECT COUNT(*) FROM admin_questions_backup_temp);
    END IF;
END $$;

-- STEP 3: Drop existing table and all dependencies
DROP TABLE IF EXISTS admin_questions CASCADE;

-- STEP 4: Create fresh admin_questions table
CREATE TABLE admin_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(10) NOT NULL,
  test_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  correct_answer VARCHAR(1) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT admin_questions_category_check CHECK (category IN ('A', 'B', 'C', 'D')),
  CONSTRAINT admin_questions_test_number_check CHECK (test_number BETWEEN 1 AND 10),
  CONSTRAINT admin_questions_correct_answer_check CHECK (correct_answer IN ('A', 'B', 'C'))
);

-- STEP 5: Create indexes for better performance
CREATE INDEX idx_admin_questions_category ON admin_questions(category);
CREATE INDEX idx_admin_questions_test_number ON admin_questions(test_number);
CREATE INDEX idx_admin_questions_category_test ON admin_questions(category, test_number);
CREATE INDEX idx_admin_questions_created_at ON admin_questions(created_at DESC);

-- STEP 6: Create trigger function for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_admin_questions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEP 7: Create trigger
DROP TRIGGER IF EXISTS trigger_update_admin_questions_updated_at ON admin_questions;
CREATE TRIGGER trigger_update_admin_questions_updated_at
    BEFORE UPDATE ON admin_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_questions_updated_at();

-- STEP 8: Disable RLS (Row Level Security)
ALTER TABLE admin_questions DISABLE ROW LEVEL SECURITY;

-- STEP 9: Drop any existing policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON admin_questions;
DROP POLICY IF EXISTS "Enable read access for all users" ON admin_questions;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON admin_questions;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON admin_questions;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON admin_questions;

-- STEP 10: Grant permissions
GRANT ALL ON admin_questions TO authenticated;
GRANT ALL ON admin_questions TO anon;
GRANT ALL ON admin_questions TO service_role;

-- STEP 11: Restore backed up data (if any)
DO $$ 
DECLARE
    backup_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO backup_count FROM admin_questions_backup_temp;
    
    IF backup_count > 0 THEN
        INSERT INTO admin_questions (
            id, category, test_number, question_text, 
            option_a, option_b, option_c, correct_answer, 
            image_url, created_at, updated_at
        )
        SELECT 
            id, category, test_number, question_text, 
            option_a, option_b, option_c, correct_answer, 
            image_url, created_at, updated_at
        FROM admin_questions_backup_temp
        WHERE category IN ('A', 'B', 'C', 'D');
        
        RAISE NOTICE 'Restored % rows', (SELECT COUNT(*) FROM admin_questions);
    END IF;
END $$;

-- STEP 12: Clean up backup table
DROP TABLE IF EXISTS admin_questions_backup_temp;

-- STEP 13: Verify the table structure
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'admin_questions'
ORDER BY ordinal_position;

-- STEP 14: Show constraints
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'admin_questions'::regclass;

-- STEP 15: Test insert (will be rolled back)
DO $$ 
BEGIN
    -- Test insert
    INSERT INTO admin_questions (
        category, test_number, question_text,
        option_a, option_b, option_c, correct_answer
    ) VALUES (
        'B', 1, 'Test question?',
        'Option A', 'Option B', 'Option C', 'A'
    );
    
    RAISE NOTICE 'Test insert successful!';
    
    -- Rollback test data
    DELETE FROM admin_questions WHERE question_text = 'Test question?';
    RAISE NOTICE 'Test data cleaned up';
END $$;

-- ===================================================================
-- FIX COMPLETE!
-- ===================================================================
-- Your admin_questions table is now ready to use
-- Try adding a question from the admin panel
-- ===================================================================

SELECT 'Admin questions table fixed successfully!' AS status;
