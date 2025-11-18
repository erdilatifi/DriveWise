-- Add bilingual explanation fields to admin_questions for theory test questions
-- Run this in Supabase SQL editor after the main setup scripts.

ALTER TABLE admin_questions
  ADD COLUMN IF NOT EXISTS explanation_en TEXT,
  ADD COLUMN IF NOT EXISTS explanation_sq TEXT;
