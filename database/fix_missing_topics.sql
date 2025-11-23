-- 1. Add the 'topic' column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_questions' AND column_name = 'topic') THEN
        ALTER TABLE admin_questions ADD COLUMN topic VARCHAR(100);
    END IF;
END $$;

-- 2. Populate existing questions with random topics (so the dashboard has data)
-- We will assign one of 4 topics randomly to each question that doesn't have one
UPDATE admin_questions
SET topic = CASE floor(random() * 4)
    WHEN 0 THEN 'Traffic Signs'
    WHEN 1 THEN 'Rules of the Road'
    WHEN 2 THEN 'Safety & First Aid'
    ELSE 'Vehicle Mechanics'
END
WHERE topic IS NULL OR topic = '';

-- 3. Verify the update
SELECT count(*) as questions_updated, topic FROM admin_questions GROUP BY topic;
