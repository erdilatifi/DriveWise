-- ===================================================================
-- DECISION TRAINER DATABASE SETUP
-- ===================================================================
-- Run this in Supabase SQL Editor to enable Decision Trainer leaderboard
-- ===================================================================

-- Check if decision trainer tables exist
SELECT 
  table_name,
  CASE 
    WHEN table_name IN (
      'decision_trainer_scenarios',
      'decision_trainer_progress', 
      'decision_trainer_attempts',
      'decision_trainer_badges'
    ) THEN '✅ EXISTS'
    ELSE '❌ MISSING'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'decision_trainer_%'
ORDER BY table_name;

-- If tables are missing, run the decision_trainer_schema.sql file
-- If tables exist but leaderboard is empty, check if scenarios are populated:

SELECT 
  'Scenarios' as table_name,
  COUNT(*) as record_count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ HAS DATA'
    ELSE '❌ EMPTY - Run insert_scenarios.sql'
  END as status
FROM decision_trainer_scenarios
UNION ALL
SELECT 
  'Progress' as table_name,
  COUNT(*) as record_count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ HAS DATA'
    ELSE '⚠️ EMPTY - Will populate when users complete scenarios'
  END as status
FROM decision_trainer_progress
UNION ALL
SELECT 
  'Attempts' as table_name,
  COUNT(*) as record_count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ HAS DATA'
    ELSE '⚠️ EMPTY - Will populate when users complete scenarios'
  END as status
FROM decision_trainer_attempts;

-- Check leaderboard view
SELECT 
  'Leaderboard View' as check_name,
  COUNT(*) as user_count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ HAS DATA'
    ELSE '⚠️ EMPTY - Users need to complete scenarios first'
  END as status
FROM decision_trainer_leaderboard;

-- ===================================================================
-- TROUBLESHOOTING GUIDE
-- ===================================================================

/*
IF LEADERBOARD IS STILL EMPTY AFTER USERS COMPLETE SCENARIOS:

1. Check if decision_trainer_schema.sql was run:
   - Tables should exist with proper structure
   - RLS policies should be enabled
   - Leaderboard view should exist

2. Check if scenarios exist:
   - Run: SELECT COUNT(*) FROM decision_trainer_scenarios;
   - Should return > 0 (run insert_scenarios.sql if empty)

3. Check if users can insert data:
   - RLS policies allow users to insert their own progress
   - User profiles exist in user_profiles table

4. Test manually:
   - Complete a scenario in Decision Trainer
   - Check: SELECT * FROM decision_trainer_attempts ORDER BY created_at DESC LIMIT 5;
   - Check: SELECT * FROM decision_trainer_progress;
   - Check: SELECT * FROM decision_trainer_leaderboard;

5. If still issues, check browser console for errors during scenario completion
*/
