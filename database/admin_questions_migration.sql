-- Migration: Add simplified admin questions table
-- This table is for quick admin management of questions
-- It stores questions in a simple format for easy CRUD operations

CREATE TABLE IF NOT EXISTS admin_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(10) NOT NULL CHECK (category IN ('A', 'B', 'C', 'C1', 'CE', 'D')),
  test_number INTEGER NOT NULL CHECK (test_number BETWEEN 1 AND 10),
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  correct_answer VARCHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category, test_number, question_text)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_admin_questions_category ON admin_questions(category);
CREATE INDEX IF NOT EXISTS idx_admin_questions_test_number ON admin_questions(test_number);
CREATE INDEX IF NOT EXISTS idx_admin_questions_category_test ON admin_questions(category, test_number);

-- Trigger for updated_at (drop if exists first)
DROP TRIGGER IF EXISTS update_admin_questions_updated_at ON admin_questions;
CREATE TRIGGER update_admin_questions_updated_at 
  BEFORE UPDATE ON admin_questions
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for admin_questions
ALTER TABLE admin_questions ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read questions (for taking tests)
CREATE POLICY "Anyone can view questions" ON admin_questions
  FOR SELECT USING (true);

-- Only admin can insert, update, delete
-- Note: You'll need to add is_admin column to user_profiles or use the specific admin user ID
CREATE POLICY "Admin can insert questions" ON admin_questions
  FOR INSERT WITH CHECK (
    auth.uid() = '49b5bb08-7ed2-41ff-a4a2-5af9fa14cf85'::uuid
  );

CREATE POLICY "Admin can update questions" ON admin_questions
  FOR UPDATE USING (
    auth.uid() = '49b5bb08-7ed2-41ff-a4a2-5af9fa14cf85'::uuid
  );

CREATE POLICY "Admin can delete questions" ON admin_questions
  FOR DELETE USING (
    auth.uid() = '49b5bb08-7ed2-41ff-a4a2-5af9fa14cf85'::uuid
  );

-- Insert some sample questions for testing
INSERT INTO admin_questions (category, test_number, question_text, option_a, option_b, option_c, correct_answer) VALUES
('B', 1, 'What does a red traffic light mean?', 'Stop', 'Slow down', 'Proceed with caution', 'A'),
('B', 1, 'What is the speed limit in residential areas in Kosovo?', '30 km/h', '50 km/h', '70 km/h', 'B'),
('B', 1, 'When must you use your headlights?', 'Only at night', 'During rain and fog', 'Both at night and in poor visibility', 'C'),
('A', 1, 'What protective gear must a motorcyclist wear?', 'Helmet only', 'Helmet and gloves', 'Helmet, gloves, and protective clothing', 'C'),
('A', 1, 'At what age can you obtain a Category A license in Kosovo?', '16 years', '18 years', '21 years', 'B');
