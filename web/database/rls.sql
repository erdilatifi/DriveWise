-- ===================================================================
-- DRIVEWISE - RLS POLICIES (V4 - Consolidated)
-- ===================================================================

-- 1. Enable RLS on ALL tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_trainer_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_trainer_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_trainer_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_trainer_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE bug_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- 2. USER PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;
CREATE POLICY "Admins can manage all profiles" ON user_profiles FOR ALL USING ((select public.is_admin()));

DROP POLICY IF EXISTS "Public can insert profiles" ON user_profiles;
CREATE POLICY "Public can insert profiles" ON user_profiles FOR INSERT WITH CHECK ((select auth.uid()) = id);

-- 3. ADMIN QUESTIONS
DROP POLICY IF EXISTS "Authenticated users can view questions" ON admin_questions;
CREATE POLICY "Authenticated users can view questions" ON admin_questions FOR SELECT TO authenticated USING (NOT (select public.is_blocked()));

DROP POLICY IF EXISTS "Admins can manage questions" ON admin_questions;
CREATE POLICY "Admins can manage questions" ON admin_questions FOR ALL USING ((select public.is_admin()));

-- 4. TEST ATTEMPTS
DROP POLICY IF EXISTS "Users can view own test attempts" ON test_attempts;
CREATE POLICY "Users can view own test attempts" ON test_attempts FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own test attempts" ON test_attempts;
CREATE POLICY "Users can insert own test attempts" ON test_attempts FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Admins can manage test attempts" ON test_attempts;
CREATE POLICY "Admins can manage test attempts" ON test_attempts FOR ALL USING ((select public.is_admin()));

-- 5. TEST ATTEMPT ANSWERS
DROP POLICY IF EXISTS "Users can view own test answers" ON test_attempt_answers;
CREATE POLICY "Users can view own test answers" ON test_attempt_answers FOR SELECT USING (EXISTS (SELECT 1 FROM test_attempts WHERE id = test_attempt_id AND user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can insert own test answers" ON test_attempt_answers;
CREATE POLICY "Users can insert own test answers" ON test_attempt_answers FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM test_attempts WHERE id = test_attempt_id AND user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Admins can manage test answers" ON test_attempt_answers;
CREATE POLICY "Admins can manage test answers" ON test_attempt_answers FOR ALL USING ((select public.is_admin()));

-- 6. STUDY MATERIALS
DROP POLICY IF EXISTS "Public can view published materials" ON study_materials;
CREATE POLICY "Public can view published materials" ON study_materials FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage materials" ON study_materials;
CREATE POLICY "Admins can manage materials" ON study_materials FOR ALL USING ((select public.is_admin()));

-- 7. MATERIAL IMAGES
DROP POLICY IF EXISTS "Public can view material images" ON material_images;
CREATE POLICY "Public can view material images" ON material_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage material images" ON material_images;
CREATE POLICY "Admins can manage material images" ON material_images FOR ALL USING ((select public.is_admin()));

-- 8. TRAFFIC SIGNS
DROP POLICY IF EXISTS "Everyone can read traffic signs" ON traffic_signs;
CREATE POLICY "Everyone can read traffic signs" ON traffic_signs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage traffic signs" ON traffic_signs;
CREATE POLICY "Admins can manage traffic signs" ON traffic_signs FOR ALL USING ((select public.is_admin()));

-- 9. DECISION TRAINER SCENARIOS
DROP POLICY IF EXISTS "Anyone can view active scenarios" ON decision_trainer_scenarios;
CREATE POLICY "Anyone can view active scenarios" ON decision_trainer_scenarios FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage scenarios" ON decision_trainer_scenarios;
CREATE POLICY "Admins can manage scenarios" ON decision_trainer_scenarios FOR ALL USING ((select public.is_admin()));

-- 10. DECISION TRAINER PROGRESS & ATTEMPTS
DROP POLICY IF EXISTS "Users can manage own dt progress" ON decision_trainer_progress;
CREATE POLICY "Users can manage own dt progress" ON decision_trainer_progress FOR ALL USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can manage own dt attempts" ON decision_trainer_attempts;
CREATE POLICY "Users can manage own dt attempts" ON decision_trainer_attempts FOR ALL USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can manage own badges" ON decision_trainer_badges;
CREATE POLICY "Users can manage own badges" ON decision_trainer_badges FOR ALL USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Admins can view dt data" ON decision_trainer_progress;
CREATE POLICY "Admins can view dt data" ON decision_trainer_progress FOR SELECT USING ((select public.is_admin()));

-- 11. ORDERS & PLANS
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Admins can manage orders" ON orders;
CREATE POLICY "Admins can manage orders" ON orders FOR ALL USING ((select public.is_admin()));

DROP POLICY IF EXISTS "Users can view own plans" ON user_plans;
CREATE POLICY "Users can view own plans" ON user_plans FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Admins can manage plans" ON user_plans;
CREATE POLICY "Admins can manage plans" ON user_plans FOR ALL USING ((select public.is_admin()));

-- 12. AUDIT LOG
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_log;
CREATE POLICY "Admins can view audit logs" ON audit_log FOR SELECT USING ((select public.is_admin()));

-- 13. STORAGE POLICIES
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('signs', 'signs', true),
  ('material-images', 'material-images', true),
  ('decision-trainer', 'decision-trainer', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Access Signs" ON storage.objects;
CREATE POLICY "Public Access Signs" ON storage.objects FOR SELECT USING (bucket_id = 'signs');

DROP POLICY IF EXISTS "Admins Manage Signs" ON storage.objects;
CREATE POLICY "Admins Manage Signs" ON storage.objects FOR ALL USING (bucket_id = 'signs' AND (select public.is_admin()));

DROP POLICY IF EXISTS "Public Access Materials" ON storage.objects;
CREATE POLICY "Public Access Materials" ON storage.objects FOR SELECT USING (bucket_id = 'material-images');

DROP POLICY IF EXISTS "Admins Manage Materials" ON storage.objects;
CREATE POLICY "Admins Manage Materials" ON storage.objects FOR ALL USING (bucket_id = 'material-images' AND (select public.is_admin()));

DROP POLICY IF EXISTS "Public Access Trainer" ON storage.objects;
CREATE POLICY "Public Access Trainer" ON storage.objects FOR SELECT USING (bucket_id = 'decision-trainer');

DROP POLICY IF EXISTS "Admins Manage Trainer" ON storage.objects;
CREATE POLICY "Admins Manage Trainer" ON storage.objects FOR ALL USING (bucket_id = 'decision-trainer' AND (select public.is_admin()));

SELECT 'RLS Policies Setup Complete' as status;
