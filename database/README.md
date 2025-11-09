# Database Setup Guide

This guide will help you set up the Supabase database for DriveWise.

## Prerequisites

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Project Settings > API

## Environment Variables

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

## Database Schema Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `schema.sql`
4. Run the SQL script

This will create:
- All necessary tables (questions, test_sets, user_profiles, etc.)
- Row Level Security (RLS) policies
- Indexes for performance
- Triggers and functions

## Initial Data Setup

After running the schema, you'll need to populate the database with:

### 1. Test Sets

For each category (A, B, C1, C, CE, D), create 10 test sets:

```sql
-- Example for Category B
INSERT INTO test_sets (category, test_number, name, question_count) VALUES
  ('B', 1, 'Category B - Test 1', 10),
  ('B', 2, 'Category B - Test 2', 10),
  ('B', 3, 'Category B - Test 3', 10),
  ('B', 4, 'Category B - Test 4', 10),
  ('B', 5, 'Category B - Test 5', 10),
  ('B', 6, 'Category B - Test 6', 10),
  ('B', 7, 'Category B - Test 7', 10),
  ('B', 8, 'Category B - Test 8', 10),
  ('B', 9, 'Category B - Test 9', 10),
  ('B', 10, 'Category B - Test 10', 10);
```

Repeat for all categories: A, C1, C, CE, D

### 2. Sample Questions

Here's an example of adding a question with translations:

```sql
-- Insert a question
INSERT INTO questions (category, topic, is_active) 
VALUES ('B', 'Traffic Signs', true)
RETURNING id;

-- Use the returned ID to add translations
INSERT INTO question_translations (question_id, language, question_text, explanation) VALUES
  ('question-id-here', 'sq', 'Çfarë do të thotë ky shenjë?', 'Kjo shenjë tregon ndalimin e parkimit.'),
  ('question-id-here', 'sr', 'Шта значи овај знак?', 'Овај знак означава забрану паркирања.'),
  ('question-id-here', 'en', 'What does this sign mean?', 'This sign indicates no parking.');

-- Add answer options
INSERT INTO answer_options (question_id, option_order, is_correct) VALUES
  ('question-id-here', 1, false),
  ('question-id-here', 2, true),
  ('question-id-here', 3, false),
  ('question-id-here', 4, false)
RETURNING id;

-- Add translations for each answer option
INSERT INTO answer_option_translations (answer_option_id, language, option_text) VALUES
  ('option-1-id', 'sq', 'Ndalim qarkullimi'),
  ('option-1-id', 'sr', 'Забрана саобраћаја'),
  ('option-1-id', 'en', 'No traffic'),
  
  ('option-2-id', 'sq', 'Ndalim parkimi'),
  ('option-2-id', 'sr', 'Забрана паркирања'),
  ('option-2-id', 'en', 'No parking'),
  
  ('option-3-id', 'sq', 'Ndalim ndalimi'),
  ('option-3-id', 'sr', 'Забрана заустављања'),
  ('option-3-id', 'en', 'No stopping'),
  
  ('option-4-id', 'sq', 'Ndalim kalimi'),
  ('option-4-id', 'sr', 'Забрана претицања'),
  ('option-4-id', 'en', 'No overtaking');
```

### 3. Link Questions to Test Sets

```sql
-- Link questions to a test set
INSERT INTO test_set_questions (test_set_id, question_id, question_order) VALUES
  ('test-set-id', 'question-1-id', 1),
  ('test-set-id', 'question-2-id', 2),
  ('test-set-id', 'question-3-id', 3),
  -- ... up to 10 questions
  ('test-set-id', 'question-10-id', 10);
```

## Admin Panel Access

To make a user an admin:

```sql
UPDATE user_profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';
```

## Storage Setup (for images)

1. Go to Storage in your Supabase dashboard
2. Create a bucket named `question-images`
3. Set it to public access
4. Upload road sign images and other question images
5. Use the public URLs in the `image_url` field of questions

## Testing the Setup

After setup, you should be able to:
- Sign up for an account
- Select a category
- Take a test
- View results
- Track progress

## Next Steps

1. Populate the database with real Kosovo driving theory questions
2. Add road signs to the `road_signs` table
3. Create study materials in the `study_materials` table
4. Test all functionality

## Troubleshooting

### RLS Policies Not Working
- Make sure you're authenticated when testing
- Check that policies are enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`

### Questions Not Showing
- Verify questions have `is_active = true`
- Check that translations exist for your selected language
- Ensure test_set_questions are properly linked

### Authentication Issues
- Verify environment variables are set correctly
- Check Supabase project settings for auth configuration
- Enable email authentication in Supabase Auth settings
