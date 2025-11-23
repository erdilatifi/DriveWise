-- Replace 'YOUR_EMAIL_HERE' with your actual login email
DO $$
DECLARE
    target_email TEXT := 'YOUR_EMAIL_HERE'; -- <--- PUT YOUR EMAIL HERE
    target_user_id UUID;
    v_attempt_id UUID;
    v_question RECORD;
    v_score INTEGER;
    v_total INTEGER := 30; -- 30 questions per test
    v_percentage DECIMAL;
    v_is_correct BOOLEAN;
    v_selected_answer TEXT;
    i INTEGER;
    j INTEGER;
BEGIN
    -- 1. Get User ID
    SELECT id INTO target_user_id FROM auth.users WHERE email = target_email;
    
    IF target_user_id IS NULL THEN
        RAISE NOTICE 'User with email % not found. Please check the email.', target_email;
        RETURN;
    END IF;

    RAISE NOTICE 'Creating 20 test attempts for user: % (ID: %)', target_email, target_user_id;

    -- 2. Loop to create 20 attempts
    FOR i IN 1..20 LOOP
        v_score := 0;
        
        -- Create the attempt record first
        INSERT INTO test_attempts (
            user_id, 
            category, 
            test_number, 
            score, 
            total_questions, 
            percentage, 
            time_taken_seconds, 
            completed_at
        ) VALUES (
            target_user_id,
            'B', -- Category
            (floor(random() * 10) + 1)::TEXT, -- Random test number 1-10
            0, -- Placeholder score
            v_total,
            0, -- Placeholder percentage
            floor(random() * 1000) + 300, -- Random time 5-20 mins
            NOW() - (i || ' days')::INTERVAL -- Spread over last 50 days
        ) RETURNING id INTO v_attempt_id;

        -- 3. Answer questions for this attempt
        -- We'll pick 30 random questions from admin_questions. 
        FOR v_question IN (SELECT id, correct_answer FROM admin_questions ORDER BY random() LIMIT v_total) LOOP
            
            -- Simple random logic: 70% chance to be correct
            v_is_correct := (random() < 0.7);

            IF v_is_correct THEN
                v_selected_answer := v_question.correct_answer;
                v_score := v_score + 1;
            ELSE
                -- Pick a wrong answer (simple logic: if 'A' is correct, pick 'B')
                v_selected_answer := CASE WHEN v_question.correct_answer = 'A' THEN 'B' ELSE 'A' END;
            END IF;

            INSERT INTO test_attempt_answers (
                test_attempt_id,
                question_id,
                selected_answer,
                is_correct
            ) VALUES (
                v_attempt_id,
                v_question.id,
                v_selected_answer,
                v_is_correct
            );
        END LOOP;

        -- 4. Update the attempt with final score
        v_percentage := (v_score::DECIMAL / v_total::DECIMAL) * 100;
        
        UPDATE test_attempts 
        SET score = v_score, percentage = v_percentage
        WHERE id = v_attempt_id;

    END LOOP;

    RAISE NOTICE 'Successfully created 50 test attempts!';
END $$;
