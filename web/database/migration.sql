-- ===================================================================
-- MIGRATION SCRIPT: MULTI-LANGUAGE TO ALBANIAN ONLY
-- ===================================================================
-- Run this script to convert your existing database to the simplified structure.
-- It preserves Albanian data and removes English data.
-- ===================================================================

BEGIN;

-- 1. MIGRATE STUDY MATERIALS
-- Rename Albanian columns to generic names
ALTER TABLE study_materials RENAME COLUMN title_sq TO title;
ALTER TABLE study_materials RENAME COLUMN content_sq TO content;
ALTER TABLE study_materials RENAME COLUMN description_sq TO description;

-- Drop English columns
ALTER TABLE study_materials DROP COLUMN IF EXISTS title_en;
ALTER TABLE study_materials DROP COLUMN IF EXISTS content_en;
ALTER TABLE study_materials DROP COLUMN IF EXISTS description_en;

-- 2. MIGRATE MATERIAL IMAGES
-- Rename Albanian caption
ALTER TABLE material_images RENAME COLUMN caption_sq TO caption;

-- Drop English caption
ALTER TABLE material_images DROP COLUMN IF EXISTS caption_en;

-- 3. MIGRATE ADMIN QUESTIONS
-- Add explanation column if it doesn't exist
ALTER TABLE admin_questions ADD COLUMN IF NOT EXISTS explanation TEXT;

-- Update base columns with Albanian content where available
UPDATE admin_questions SET question_text = COALESCE(question_text_sq, question_text);
UPDATE admin_questions SET option_a = COALESCE(option_a_sq, option_a);
UPDATE admin_questions SET option_b = COALESCE(option_b_sq, option_b);
UPDATE admin_questions SET option_c = COALESCE(option_c_sq, option_c);
UPDATE admin_questions SET explanation = COALESCE(explanation_sq, explanation);

-- Drop specific language columns
ALTER TABLE admin_questions DROP COLUMN IF EXISTS question_text_en;
ALTER TABLE admin_questions DROP COLUMN IF EXISTS question_text_sq;
ALTER TABLE admin_questions DROP COLUMN IF EXISTS option_a_en;
ALTER TABLE admin_questions DROP COLUMN IF EXISTS option_a_sq;
ALTER TABLE admin_questions DROP COLUMN IF EXISTS option_b_en;
ALTER TABLE admin_questions DROP COLUMN IF EXISTS option_b_sq;
ALTER TABLE admin_questions DROP COLUMN IF EXISTS option_c_en;
ALTER TABLE admin_questions DROP COLUMN IF EXISTS option_c_sq;
ALTER TABLE admin_questions DROP COLUMN IF EXISTS explanation_en;
ALTER TABLE admin_questions DROP COLUMN IF EXISTS explanation_sq;

-- 4. CLEANUP USER PROFILES
-- Remove preferred_language since app is now Albanian only
ALTER TABLE user_profiles DROP COLUMN IF EXISTS preferred_language;

COMMIT;

-- ===================================================================
-- MIGRATION COMPLETE
-- ===================================================================
SELECT 'Migration completed successfully' as status;
