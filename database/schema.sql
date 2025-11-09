-- DriveWise Database Schema
-- This schema supports the driving theory exam prep app for Kosovo

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories enum for license types
CREATE TYPE license_category AS ENUM ('A', 'B', 'C1', 'C', 'CE', 'D');

-- Languages enum
CREATE TYPE language_code AS ENUM ('sq', 'en');

-- ============================================
-- QUESTIONS AND CONTENT TABLES
-- ============================================

-- Questions table - stores all exam questions
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category license_category NOT NULL,
  topic VARCHAR(100), -- e.g., 'Traffic Signs', 'Speed Limits', 'Right of Way'
  image_url TEXT, -- Optional image for road signs or scenarios
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Question translations - multilingual support
CREATE TABLE question_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  language language_code NOT NULL,
  question_text TEXT NOT NULL,
  explanation TEXT, -- Explanation for the correct answer
  UNIQUE(question_id, language)
);

-- Answer options for each question
CREATE TABLE answer_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  option_order INTEGER NOT NULL, -- 1, 2, 3, 4, 5
  is_correct BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Answer option translations
CREATE TABLE answer_option_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  answer_option_id UUID REFERENCES answer_options(id) ON DELETE CASCADE,
  language language_code NOT NULL,
  option_text TEXT NOT NULL,
  UNIQUE(answer_option_id, language)
);

-- Test sets - predefined or dynamic test configurations
CREATE TABLE test_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category license_category NOT NULL,
  test_number INTEGER NOT NULL, -- 1-10 for each category
  name VARCHAR(100),
  is_random BOOLEAN DEFAULT false, -- If true, randomly select from pool
  question_count INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category, test_number)
);

-- Test set questions - links questions to test sets (for fixed tests)
CREATE TABLE test_set_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_set_id UUID REFERENCES test_sets(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  question_order INTEGER NOT NULL,
  UNIQUE(test_set_id, question_id)
);

-- ============================================
-- USER MANAGEMENT
-- ============================================

-- User profiles - extends Supabase auth.users
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255),
  full_name VARCHAR(255),
  preferred_language language_code DEFAULT 'sq',
  is_admin BOOLEAN DEFAULT false,
  is_instructor BOOLEAN DEFAULT false,
  instructor_code VARCHAR(20) UNIQUE, -- For instructors to share with students
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student-Instructor relationships
CREATE TABLE student_instructor_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  linked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, instructor_id)
);

-- ============================================
-- PROGRESS TRACKING
-- ============================================

-- Test attempts - records each time a user takes a test
CREATE TABLE test_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  test_set_id UUID REFERENCES test_sets(id),
  category license_category NOT NULL,
  score INTEGER NOT NULL, -- Number of correct answers
  total_questions INTEGER NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  time_taken_seconds INTEGER, -- Optional: time to complete
  is_assigned BOOLEAN DEFAULT false, -- If assigned by instructor
  assigned_by UUID REFERENCES user_profiles(id), -- Instructor who assigned
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test attempt answers - individual answers for review
CREATE TABLE test_attempt_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_attempt_id UUID REFERENCES test_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id),
  selected_answer_id UUID REFERENCES answer_options(id),
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- REFERENCE MATERIALS
-- ============================================

-- Study materials and reference content
CREATE TABLE study_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(100), -- e.g., 'Traffic Signs', 'Driving Rules'
  material_type VARCHAR(50), -- 'handbook', 'guide', 'faq'
  order_index INTEGER,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study material translations
CREATE TABLE study_material_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  study_material_id UUID REFERENCES study_materials(id) ON DELETE CASCADE,
  language language_code NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  UNIQUE(study_material_id, language)
);

-- Road signs reference
CREATE TABLE road_signs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sign_code VARCHAR(50) UNIQUE,
  category VARCHAR(100), -- 'Warning', 'Regulatory', 'Informational'
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Road sign translations
CREATE TABLE road_sign_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  road_sign_id UUID REFERENCES road_signs(id) ON DELETE CASCADE,
  language language_code NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  UNIQUE(road_sign_id, language)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_active ON questions(is_active);
CREATE INDEX idx_test_attempts_user ON test_attempts(user_id);
CREATE INDEX idx_test_attempts_category ON test_attempts(category);
CREATE INDEX idx_test_attempts_completed ON test_attempts(completed_at);
CREATE INDEX idx_question_translations_lang ON question_translations(language);
CREATE INDEX idx_answer_options_question ON answer_options(question_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_instructor_links ENABLE ROW LEVEL SECURITY;

-- User profiles: Users can read their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Test attempts: Users can view their own attempts
CREATE POLICY "Users can view own test attempts" ON test_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own test attempts" ON test_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Instructors can view their students' assigned test attempts
CREATE POLICY "Instructors can view assigned attempts" ON test_attempts
  FOR SELECT USING (
    auth.uid() = assigned_by OR
    auth.uid() IN (
      SELECT instructor_id FROM student_instructor_links
      WHERE student_id = test_attempts.user_id
    )
  );

-- Test attempt answers: Users can view their own answers
CREATE POLICY "Users can view own answers" ON test_attempt_answers
  FOR SELECT USING (
    test_attempt_id IN (
      SELECT id FROM test_attempts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own answers" ON test_attempt_answers
  FOR INSERT WITH CHECK (
    test_attempt_id IN (
      SELECT id FROM test_attempts WHERE user_id = auth.uid()
    )
  );

-- Student-instructor links
CREATE POLICY "Students can view their instructors" ON student_instructor_links
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Instructors can view their students" ON student_instructor_links
  FOR SELECT USING (auth.uid() = instructor_id);

CREATE POLICY "Students can link to instructors" ON student_instructor_links
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can unlink from instructors" ON student_instructor_links
  FOR DELETE USING (auth.uid() = student_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_materials_updated_at BEFORE UPDATE ON study_materials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique instructor code
CREATE OR REPLACE FUNCTION generate_instructor_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    SELECT EXISTS(SELECT 1 FROM user_profiles WHERE instructor_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
