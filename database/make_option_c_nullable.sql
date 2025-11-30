-- Make option_c nullable in admin_questions table
ALTER TABLE admin_questions ALTER COLUMN option_c DROP NOT NULL;
