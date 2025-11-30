-- Updates existing scenarios to have lower XP values
UPDATE decision_trainer_scenarios 
SET xp = 3 
WHERE xp = 10 OR xp = 25;

UPDATE decision_trainer_scenarios 
SET xp = 5 
WHERE xp = 15;

UPDATE decision_trainer_scenarios 
SET xp = 8 
WHERE xp = 20;

-- Ensure no scenario has more than 10 XP just in case
UPDATE decision_trainer_scenarios
SET xp = 10
WHERE xp > 10;
