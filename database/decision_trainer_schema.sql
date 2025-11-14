-- Decision Trainer Database Schema

-- Scenarios table (stores all quiz questions)
CREATE TABLE IF NOT EXISTS decision_trainer_scenarios (
  id TEXT PRIMARY KEY,
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

-- User progress tracking
CREATE TABLE IF NOT EXISTS decision_trainer_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  total_xp INTEGER DEFAULT 0,
  scenarios_completed INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  best_time_seconds INTEGER,
  average_time_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, category)
);

-- Individual scenario attempts
CREATE TABLE IF NOT EXISTS decision_trainer_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_id TEXT NOT NULL,
  category TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  selected_options JSONB NOT NULL CHECK (jsonb_typeof(selected_options) = 'array'),
  time_taken_ms INTEGER,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Badges/achievements
CREATE TABLE IF NOT EXISTS decision_trainer_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, badge_type)
);

-- Leaderboard view (aggregates user stats)
CREATE OR REPLACE VIEW decision_trainer_leaderboard AS
SELECT 
  p.user_id,
  COALESCE(up.full_name, up.email) as full_name,
  up.email,
  SUM(p.total_xp) as total_xp,
  SUM(p.scenarios_completed) as total_scenarios,
  SUM(p.correct_answers) as total_correct,
  SUM(p.total_attempts) as total_attempts,
  MAX(p.best_streak) as best_streak,
  MIN(p.best_time_seconds) as best_time_seconds,
  ROUND(AVG(p.average_time_seconds)) as average_time_seconds,
  CASE 
    WHEN SUM(p.total_attempts) > 0 
    THEN ROUND((SUM(p.correct_answers)::NUMERIC / SUM(p.total_attempts)::NUMERIC) * 100, 1)
    ELSE 0 
  END as accuracy,
  COUNT(DISTINCT p.category) as categories_completed
FROM decision_trainer_progress p
LEFT JOIN user_profiles up ON p.user_id = up.id
GROUP BY p.user_id, up.full_name, up.email
ORDER BY total_xp DESC, best_time_seconds ASC;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_dt_scenarios_category ON decision_trainer_scenarios(category);
CREATE INDEX IF NOT EXISTS idx_dt_scenarios_active ON decision_trainer_scenarios(is_active);
CREATE INDEX IF NOT EXISTS idx_dt_progress_user ON decision_trainer_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_dt_progress_category ON decision_trainer_progress(category);
CREATE INDEX IF NOT EXISTS idx_dt_attempts_user ON decision_trainer_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_dt_attempts_scenario ON decision_trainer_attempts(scenario_id);
CREATE INDEX IF NOT EXISTS idx_dt_attempts_selected_options ON decision_trainer_attempts USING GIN (selected_options);
CREATE INDEX IF NOT EXISTS idx_dt_badges_user ON decision_trainer_badges(user_id);

-- Row Level Security
ALTER TABLE decision_trainer_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_trainer_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_trainer_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_trainer_badges ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for scenarios if they exist
DROP POLICY IF EXISTS "Anyone can view active scenarios" ON decision_trainer_scenarios;
DROP POLICY IF EXISTS "Admins can insert scenarios" ON decision_trainer_scenarios;
DROP POLICY IF EXISTS "Admins can update scenarios" ON decision_trainer_scenarios;
DROP POLICY IF EXISTS "Admins can delete scenarios" ON decision_trainer_scenarios;

-- RLS Policies for Scenarios
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own progress" ON decision_trainer_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON decision_trainer_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON decision_trainer_progress;
DROP POLICY IF EXISTS "Users can view own attempts" ON decision_trainer_attempts;
DROP POLICY IF EXISTS "Users can insert own attempts" ON decision_trainer_attempts;
DROP POLICY IF EXISTS "Users can view own badges" ON decision_trainer_badges;
DROP POLICY IF EXISTS "Users can insert own badges" ON decision_trainer_badges;

-- RLS Policies for Progress
CREATE POLICY "Users can view own progress"
  ON decision_trainer_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON decision_trainer_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON decision_trainer_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own attempts"
  ON decision_trainer_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts"
  ON decision_trainer_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own badges"
  ON decision_trainer_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
  ON decision_trainer_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);
