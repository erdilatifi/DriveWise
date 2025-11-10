-- ===================================================================
-- DRIVEWISE - Add 5 Sample Questions
-- ===================================================================
-- Run this in Supabase SQL Editor to add test questions
-- ===================================================================

-- Insert 5 sample questions for Category B
INSERT INTO admin_questions (category, test_number, question_text, option_a, option_b, option_c, correct_answer, image_url)
VALUES
  -- Question 1
  (
    'B',
    1,
    'What does a red traffic light mean?',
    'Stop completely',
    'Slow down and proceed with caution',
    'Speed up to clear the intersection',
    'A',
    NULL
  ),
  
  -- Question 2
  (
    'B',
    1,
    'What is the maximum speed limit in urban areas in Kosovo?',
    '40 km/h',
    '50 km/h',
    '60 km/h',
    'B',
    NULL
  ),
  
  -- Question 3
  (
    'B',
    1,
    'When must you use your headlights?',
    'Only at night',
    'During rain, fog, or poor visibility',
    'Never during the day',
    'B',
    NULL
  ),
  
  -- Question 4
  (
    'B',
    1,
    'What should you do when approaching a pedestrian crossing?',
    'Speed up to pass quickly',
    'Honk to warn pedestrians',
    'Slow down and be prepared to stop',
    'C',
    NULL
  ),
  
  -- Question 5
  (
    'B',
    1,
    'What is the minimum safe following distance behind another vehicle?',
    '1 second',
    '2 seconds',
    '5 seconds',
    'B',
    NULL
  );

-- Verify the questions were added
SELECT 
  id,
  category,
  test_number,
  LEFT(question_text, 50) as question_preview,
  correct_answer,
  created_at
FROM admin_questions
WHERE category = 'B' AND test_number = 1
ORDER BY created_at DESC
LIMIT 5;

-- Show count by category
SELECT 
  category,
  COUNT(*) as question_count
FROM admin_questions
GROUP BY category
ORDER BY category;

-- ===================================================================
-- SAMPLE QUESTIONS ADDED!
-- ===================================================================
-- You now have 5 questions in Category B, Test 1
-- Go to /admin/questions to see them
-- ===================================================================
