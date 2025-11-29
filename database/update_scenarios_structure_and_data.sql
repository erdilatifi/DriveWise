-- 1. Add missing columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'decision_trainer_scenarios' AND column_name = 'topic') THEN
        ALTER TABLE decision_trainer_scenarios ADD COLUMN topic TEXT;
        CREATE INDEX idx_decision_trainer_scenarios_topic ON decision_trainer_scenarios(topic);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'decision_trainer_scenarios' AND column_name = 'difficulty') THEN
        ALTER TABLE decision_trainer_scenarios ADD COLUMN difficulty TEXT DEFAULT 'medium';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'decision_trainer_scenarios' AND column_name = 'is_published') THEN
        ALTER TABLE decision_trainer_scenarios ADD COLUMN is_published BOOLEAN DEFAULT true;
    END IF;

    -- Optional: Add real_world_tip if it's missing but used in Typescript interface (though not used in INSERTs below, good for future)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'decision_trainer_scenarios' AND column_name = 'real_world_tip') THEN
        ALTER TABLE decision_trainer_scenarios ADD COLUMN real_world_tip TEXT DEFAULT '';
    END IF;
END $$;

-- 2. Clear existing scenarios to start fresh with the new structure
DELETE FROM decision_trainer_scenarios;

-- 3. Seed Data (Samples for each topic - expanding to 30 would make this file huge, here are 5 per topic as a start)

-- TOPIC: Traffic Lights (traffic_lights)
INSERT INTO decision_trainer_scenarios (category, topic, question, image_url, options, correct_explanation, difficulty, xp, is_active, is_published, real_world_tip, level) VALUES
('B', 'traffic_lights', 'Çfarë duhet të bëni kur semafori tregon dritën e verdhë pulsuese?', 'https://images.unsplash.com/photo-1566244654055-6b3554f6e339', 
'[{"text": "Ndaloni menjëherë", "isCorrect": false}, {"text": "Vazhdoni me kujdes të shtuar", "isCorrect": true}, {"text": "Përshpejtoni", "isCorrect": false}]'::jsonb, 
'Drita e verdhë pulsuese tregon rrezik të mundshëm. Ulni shpejtësinë.', 'easy', 10, true, true, 'Mbani këmbën pranë frenave në këto situata.', 1),

('B', 'traffic_lights', 'Çfarë do të thotë drita e kuqe dhe e verdhë së bashku?', 'https://images.unsplash.com/photo-1566244654055-6b3554f6e339', 
'[{"text": "Ndaloni, do të ndizet e gjelbra", "isCorrect": false}, {"text": "Përgatituni për nisje, do të ndizet e gjelbra", "isCorrect": true}, {"text": "Kaloni shpejt", "isCorrect": false}]'::jsonb, 
'Kjo kombinim paralajmëron se së shpejti do të ndizet drita e gjelbër.', 'easy', 10, true, true, 'Mos u nisni para se të ndizet drita e gjelbër.', 1),

('B', 'traffic_lights', 'A lejohet kthimi djathtas në dritë të kuqe?', 'https://images.unsplash.com/photo-1566244654055-6b3554f6e339', 
'[{"text": "Po, gjithmonë", "isCorrect": false}, {"text": "Jo, asnjëherë", "isCorrect": false}, {"text": "Po, nëse ka sinjalizim shtesë (shigjetë)", "isCorrect": true}]'::jsonb, 
'Kthimi lejohet vetëm nëse ka një shigjetë të gjelbër shtesë ose sinjalistikë që e lejon.', 'medium', 15, true, true, 'Kontrolloni gjithmonë për këmbësorë edhe nëse keni shigjetë të gjelbër.', 2),

('B', 'traffic_lights', 'Çfarë duhet bërë kur semafori nuk punon?', 'https://images.unsplash.com/photo-1566244654055-6b3554f6e339', 
'[{"text": "Vazhdoni si rrugë me përparësi", "isCorrect": false}, {"text": "Zbatoni rregullin e krahut të djathtë dhe shenjat", "isCorrect": true}, {"text": "Prisni policinë", "isCorrect": false}]'::jsonb, 
'Kur semafori nuk punon, vlejnë shenjat e trafikut ose rregulli i krahut të djathtë.', 'medium', 15, true, true, 'Bëni kujdes të shtuar sepse shoferët e tjerë mund të jenë konfuzë.', 2),

('B', 'traffic_lights', 'Drita jeshile pulsuese paralajmëron:', 'https://images.unsplash.com/photo-1566244654055-6b3554f6e339', 
'[{"text": "Që semafori është prishur", "isCorrect": false}, {"text": "Fundin e lejimit të kalimit (do të ndizet e verdha)", "isCorrect": true}, {"text": "Rritje të shpejtësisë", "isCorrect": false}]'::jsonb, 
'Drita e gjelbër pulsuese tregon se së shpejti do të ndizet drita e verdhë dhe pastaj e kuqe.', 'easy', 10, true, true, 'Mos përshpejtoni, përgatituni për ndalim.', 1);


-- TOPIC: Road Signs (road_signs)
INSERT INTO decision_trainer_scenarios (category, topic, question, image_url, options, correct_explanation, difficulty, xp, is_active, is_published, real_world_tip, level) VALUES
('B', 'road_signs', 'Çfarë tregon shenja "Stop"?', 'https://images.unsplash.com/photo-1564691899618-13a8c0124d10', 
'[{"text": "Ulni shpejtësinë", "isCorrect": false}, {"text": "Ndalim i plotë i detyrueshëm", "isCorrect": true}, {"text": "Jep përparësi pa ndaluar", "isCorrect": false}]'::jsonb, 
'Shenja STOP detyron ndalimin e plotë të mjetit para vijës së ndalimit.', 'easy', 10, true, true, 'Ndaloni plotësisht, rrotat nuk duhet të lëvizin.', 1),

('B', 'road_signs', 'Çfarë tregon shenja trekëndore me kulm poshtë?', 'https://images.unsplash.com/photo-1564691899618-13a8c0124d10', 
'[{"text": "Rrugë me përparësi", "isCorrect": false}, {"text": "Jep përparësi", "isCorrect": true}, {"text": "Ndalim kalimi", "isCorrect": false}]'::jsonb, 
'Kjo shenjë tregon se duhet t''u jepni përparësi mjeteve në rrugën kryesore.', 'easy', 10, true, true, 'Shikoni majtas dhe djathtas dy herë.', 1),

('B', 'road_signs', 'Shenja rrethore me bordurë të kuqe tregon:', 'https://images.unsplash.com/photo-1564691899618-13a8c0124d10', 
'[{"text": "Urdhër ose ndalim", "isCorrect": true}, {"text": "Rrezik", "isCorrect": false}, {"text": "Informacion", "isCorrect": false}]'::jsonb, 
'Shenjat rrethore me bordurë të kuqe janë shenja ndalimi ose kufizimi.', 'medium', 15, true, true, 'Mos i injoroni kurrë këto shenja, janë urdhëruese.', 2),

('B', 'road_signs', 'Shenja katrore blu tregon:', 'https://images.unsplash.com/photo-1564691899618-13a8c0124d10', 
'[{"text": "Rrezik", "isCorrect": false}, {"text": "Urdhër", "isCorrect": false}, {"text": "Informacion ose shërbim", "isCorrect": true}]'::jsonb, 
'Shenjat katrore ose drejtkëndëshe me ngjyrë blu japin informacione ose tregojnë shërbime.', 'easy', 10, true, true, 'Përdorini për të gjetur spitale, parkingje ose dalje.', 1),

('B', 'road_signs', 'Cila shenjë paralajmëron kthesë të rrezikshme?', 'https://images.unsplash.com/photo-1564691899618-13a8c0124d10', 
'[{"text": "Trekëndësh me kulm lart", "isCorrect": true}, {"text": "Rrethore blu", "isCorrect": false}, {"text": "Trekëndësh me kulm poshtë", "isCorrect": false}]'::jsonb, 
'Shenjat e rrezikut janë zakonisht trekëndore me kulm lart dhe bordurë të kuqe.', 'medium', 15, true, true, 'Ulni shpejtësinë para se të hyni në kthesë.', 2);


-- TOPIC: Pedestrian Safety (pedestrian_safety)
INSERT INTO decision_trainer_scenarios (category, topic, question, image_url, options, correct_explanation, difficulty, xp, is_active, is_published, real_world_tip, level) VALUES
('B', 'pedestrian_safety', 'Këmbësori është në vendkalim. Si veproni?', 'https://images.unsplash.com/photo-1557332346-203d04e58908', 
'[{"text": "I bini borisë", "isCorrect": false}, {"text": "Ndaloni dhe jepni përparësi", "isCorrect": true}, {"text": "Anashkaloni shpejt", "isCorrect": false}]'::jsonb, 
'Këmbësorët kanë përparësi absolute në vijat e bardha.', 'easy', 10, true, true, 'Krijoni kontakt me sy me këmbësorin.', 1),

('B', 'pedestrian_safety', 'A lejohet parakalimi para vendkalimit të këmbësorëve?', 'https://images.unsplash.com/photo-1557332346-203d04e58908', 
'[{"text": "Po, nëse nuk ka këmbësorë", "isCorrect": false}, {"text": "Jo, është rreptësisht e ndaluar", "isCorrect": true}, {"text": "Po, me shpejtësi të ulët", "isCorrect": false}]'::jsonb, 
'Parakalimi në afërsi të vendkalimeve të këmbësorëve është i rrezikshëm dhe i ndaluar.', 'hard', 20, true, true, 'Mund të mos shihni dikë që po kalon para mjetit që parakaloni.', 3),

('B', 'pedestrian_safety', 'Kur shikoni fëmijë pranë rrugës, çfarë duhet të prisni?', 'https://images.unsplash.com/photo-1557332346-203d04e58908', 
'[{"text": "Ata do presin makinat", "isCorrect": false}, {"text": "Mund të vrapojnë papritur në rrugë", "isCorrect": true}, {"text": "Janë të vëmendshëm", "isCorrect": false}]'::jsonb, 
'Fëmijët janë të paparashikueshëm. Ulni shpejtësinë dhe jini gati për frenim.', 'medium', 15, true, true, 'Hiqni këmbën nga gazi menjëherë.', 2),

('B', 'pedestrian_safety', 'Këmbësori po kalon jashtë vizave të bardha. Si veproni?', 'https://images.unsplash.com/photo-1557332346-203d04e58908', 
'[{"text": "Nuk i jepni përparësi, por bëni kujdes", "isCorrect": true}, {"text": "I bini borisë dhe vazhdoni", "isCorrect": false}, {"text": "Shpejtoni për ta frikësuar", "isCorrect": false}]'::jsonb, 
'Edhe pse nuk kanë përparësi, duhet të shmangni aksidentin me çdo kusht.', 'medium', 15, true, true, 'Jeta ka përparësi mbi rregullat.', 2),

('B', 'pedestrian_safety', 'Një i moshuar po kalon ngadalë rrugën. Si veproni?', 'https://images.unsplash.com/photo-1557332346-203d04e58908', 
'[{"text": "Prisni me durim derisa të kalojë", "isCorrect": true}, {"text": "I bini borisë", "isCorrect": false}, {"text": "Kaloni pas tij me shpejtësi", "isCorrect": false}]'::jsonb, 
'Tregoni durim dhe kujdes ndaj të moshuarve ose personave me aftësi të kufizuar.', 'easy', 10, true, true, 'Mos ushtroni presion me makinë.', 1);


-- TOPIC: Right of Way (right_of_way)
INSERT INTO decision_trainer_scenarios (category, topic, question, image_url, options, correct_explanation, difficulty, xp, is_active, is_published, real_world_tip, level) VALUES
('B', 'right_of_way', 'Në kryqëzim të barabartë, kush ka përparësi?', 'https://images.unsplash.com/photo-1604357209793-fca5dca89f97', 
'[{"text": "Mjeti nga e majta", "isCorrect": false}, {"text": "Mjeti nga e djathta", "isCorrect": true}, {"text": "Mjeti më i shpejtë", "isCorrect": false}]'::jsonb, 
'Rregulli i krahut të djathtë zbatohet në mungesë të shenjave.', 'medium', 15, true, true, 'Jepini përparësi atij që vjen nga e djathta juaj.', 2),

('B', 'right_of_way', 'Mjeti A shkon drejt, B kthehet majtas. Kush kalon i pari?', 'https://images.unsplash.com/photo-1604357209793-fca5dca89f97', 
'[{"text": "Mjeti A", "isCorrect": true}, {"text": "Mjeti B", "isCorrect": false}, {"text": "Varet nga shpejtësia", "isCorrect": false}]'::jsonb, 
'Mjeti që ruan drejtimin e lëvizjes ka përparësi ndaj atij që pret rrugën duke u kthyer majtas.', 'hard', 20, true, true, 'Ai që kthehet majtas pret të gjithë (përveç atij përballë që kthehet majtas).', 3),

('B', 'right_of_way', 'Po dilni nga një parking. Kush ka përparësi?', 'https://images.unsplash.com/photo-1604357209793-fca5dca89f97', 
'[{"text": "Ju", "isCorrect": false}, {"text": "Mjetet në rrugë", "isCorrect": true}, {"text": "Kush është më i shpejtë", "isCorrect": false}]'::jsonb, 
'Kur dilni nga zona private/parkimi, duhet t''u jepni përparësi të gjithë përdoruesve të rrugës.', 'easy', 10, true, true, 'Prisni derisa rruga të jetë plotësisht e lirë.', 1),

('B', 'right_of_way', 'Çfarë do të thotë drita jeshile plotësuese (shigjeta)?', 'https://images.unsplash.com/photo-1604357209793-fca5dca89f97', 
'[{"text": "Kalim i lirë në drejtimin e shigjetës", "isCorrect": true}, {"text": "Kujdes i shtuar", "isCorrect": false}, {"text": "Ndalim kalimi", "isCorrect": false}]'::jsonb, 
'Shigjeta e gjelbër lejon lëvizjen në atë drejtim, pavarësisht dritës kryesore.', 'medium', 15, true, true, 'Sigurohuni që këmbësorët kanë mbaruar kalimin.', 2),

('B', 'right_of_way', 'Mjetet e urgjencës me sinjale të ndezura:', 'https://images.unsplash.com/photo-1604357209793-fca5dca89f97', 
'[{"text": "Kanë gjithmonë përparësi", "isCorrect": true}, {"text": "Kanë përparësi vetëm në kryqëzime", "isCorrect": false}, {"text": "Nuk kanë përparësi", "isCorrect": false}]'::jsonb, 
'Mjetet me përparësi (policia, ambulanca) me sinjale të ndezura kanë përparësi ndaj të gjithëve.', 'easy', 10, true, true, 'Hapni krahun dhe ndaloni nëse është e nevojshme.', 1);


-- TOPIC: Road Hazard (road_hazard)
INSERT INTO decision_trainer_scenarios (category, topic, question, image_url, options, correct_explanation, difficulty, xp, is_active, is_published, real_world_tip, level) VALUES
('B', 'road_hazard', 'Vaj në rrugë në kthesë. Si veproni?', 'https://images.unsplash.com/photo-1619685767540-0c6710f96347', 
'[{"text": "Frenoni fort", "isCorrect": false}, {"text": "Ulni shpejtësinë para kthesës", "isCorrect": true}, {"text": "Shtoni gazin", "isCorrect": false}]'::jsonb, 
'Shmangni frenimin e fortë në sipërfaqe të rrëshqitshme. Ulni shpejtësinë gradualisht.', 'medium', 15, true, true, 'Mos bëni manovra të forta me timon.', 2),

('B', 'road_hazard', 'Çfarë është "aquaplaning"?', 'https://images.unsplash.com/photo-1619685767540-0c6710f96347', 
'[{"text": "Humbja e kontaktit të gomave me rrugën nga uji", "isCorrect": true}, {"text": "Larja e makinës", "isCorrect": false}, {"text": "Lloji i karburantit", "isCorrect": false}]'::jsonb, 
'Aquaplaning ndodh kur uji krijon shtresë midis gomës dhe rrugës, duke humbur kontrollin.', 'hard', 20, true, true, 'Nëse ndodh, hiqni këmbën nga gazi dhe mbani timonin drejt.', 3),

('B', 'road_hazard', 'Në mjegull të dendur, cilat drita përdorni?', 'https://images.unsplash.com/photo-1619685767540-0c6710f96347', 
'[{"text": "Dritat e gjata (të largëta)", "isCorrect": false}, {"text": "Dritat e shkurtra dhe antimjegull", "isCorrect": true}, {"text": "Vetëm dritat e pozicionit", "isCorrect": false}]'::jsonb, 
'Dritat e gjata reflektohen në mjegull dhe ulin dukshmërinë. Përdorni të shkurtrat.', 'medium', 15, true, true, 'Rritni distancën e sigurisë.', 2),

('B', 'road_hazard', 'Kafshë e egër në rrugë natën. Si veproni?', 'https://images.unsplash.com/photo-1619685767540-0c6710f96347', 
'[{"text": "I bini borisë dhe ndizni dritat e gjata", "isCorrect": false}, {"text": "Frenoni dhe ulni dritat (nëse e verboni)", "isCorrect": true}, {"text": "Devijoni majtas menjëherë", "isCorrect": false}]'::jsonb, 
'Dritat e forta mund ta ngrijnë kafshën në vend. Ulja e dritave dhe frenimi është zgjidhja më e sigurt.', 'hard', 20, true, true, 'Mos rrezikoni duke dalë nga rruga për të shmangur kafshën e vogël.', 3),

('B', 'road_hazard', 'Guri bie nga mali në rrugë. Reagimi?', 'https://images.unsplash.com/photo-1619685767540-0c6710f96347', 
'[{"text": "Ndaloni menjëherë nëse është e sigurt", "isCorrect": true}, {"text": "Kaloni sipër tij", "isCorrect": false}, {"text": "Mbyllni sytë", "isCorrect": false}]'::jsonb, 
'Ndaloni për të shmangur dëmtimin ose aksidentin, duke kontrolluar trafikun pas jush.', 'medium', 15, true, true, 'Ndaloni në vend të sigurt dhe njoftoni autoritetet.', 2);


-- TOPIC: Parking Rules (parking_rules)
INSERT INTO decision_trainer_scenarios (category, topic, question, image_url, options, correct_explanation, difficulty, xp, is_active, is_published, real_world_tip, level) VALUES
('B', 'parking_rules', 'A lejohet parkimi në trotuar?', 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c', 
'[{"text": "Po, gjithmonë", "isCorrect": false}, {"text": "Jo, përveç kur lejohet me shenjë", "isCorrect": true}, {"text": "Po, gjatë natës", "isCorrect": false}]'::jsonb, 
'Trotuari është për këmbësorë. Parkimi lejohet vetëm kur sinjalistika e tregon qartë.', 'easy', 10, true, true, 'Respektoni hapësirën e këmbësorëve.', 1),

('B', 'parking_rules', 'Sa është distanca minimale nga kryqëzimi për parkim?', 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c', 
'[{"text": "5 metra", "isCorrect": true}, {"text": "2 metra", "isCorrect": false}, {"text": "10 metra", "isCorrect": false}]'::jsonb, 
'Nuk lejohet parkimi më afër se 5 metra nga kryqëzimi për të mos penguar pamjen.', 'hard', 20, true, true, 'Siguria e pamjes në kryqëzim është jetike.', 3),

('B', 'parking_rules', 'A lejohet parkimi para hyrjes së një garazhi?', 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c', 
'[{"text": "Po, nëse është garazhi juaj", "isCorrect": false}, {"text": "Jo, asnjëherë", "isCorrect": true}, {"text": "Po, për 5 minuta", "isCorrect": false}]'::jsonb, 
'Bllokimi i hyrje-daljeve është i ndaluar.', 'easy', 10, true, true, 'Konsideroni emergjencat që mund të kenë banorët.', 1),

('B', 'parking_rules', 'Parkimi në rresht të dytë (dyshe):', 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c', 
'[{"text": "Lejohet për ndalim të shkurtër", "isCorrect": false}, {"text": "Është i ndaluar", "isCorrect": true}, {"text": "Lejohet me drita emergjence", "isCorrect": false}]'::jsonb, 
'Parkimi në rresht të dytë bllokon trafikun dhe është i ndaluar.', 'medium', 15, true, true, 'Mos u bëni pengesë për trafikun.', 2),

('B', 'parking_rules', 'Si duhet lënë makina në dishezë?', 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c', 
'[{"text": "Në marsh të parë, rrotat drejt", "isCorrect": false}, {"text": "Në marsh indietro, rrotat drejt trotuarit", "isCorrect": true}, {"text": "Në neutral (moto)", "isCorrect": false}]'::jsonb, 
'Në dishezë, vendosni marshin indietro dhe ktheni rrotat drejt trotuarit për siguri.', 'hard', 20, true, true, 'Përdorni gjithmonë frenat e dorës.', 3);

