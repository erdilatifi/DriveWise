-- ===================================================================
-- Fix selected_answer column to support multiple answers
-- ===================================================================
-- This fixes error 22001 (string data right truncation)
-- Run this in Supabase SQL Editor
-- ===================================================================

-- Increase selected_answer column size to support multiple answers
-- VARCHAR(1) -> VARCHAR(10) to support formats like "A,B,C"
ALTER TABLE test_attempt_answers 
ALTER COLUMN selected_answer TYPE VARCHAR(10);

-- ===================================================================
-- DONE!
-- ===================================================================
-- The selected_answer column can now store:
-- - Single answer: "A"
-- - Multiple answers: "A,B" or "A,B,C"
-- ===================================================================
