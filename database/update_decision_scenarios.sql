-- 1. Pastro skenarët ekzistues për të shmangur dublikimet
DELETE FROM decision_trainer_scenarios;

-- 2. Shto 6 Skenarët e rinj (nga 5 pyetje secili, por këtu po shtojmë 6 skenarë unikë për temën e kërkuar)
-- Përdorim 'B' si kategori default.

INSERT INTO decision_trainer_scenarios (
    category,
    question,
    image_url,
    options,
    correct_explanation,
    difficulty,
    xp,
    created_at,
    updated_at
) VALUES 
-- Skenari 1: Traffic Lights (Semaphori)
(
    'B',
    'Çfarë duhet të bëni kur semafori tregon dritën e verdhë pulsuese?',
    'https://images.unsplash.com/photo-1566244654055-6b3554f6e339?auto=format&fit=crop&w=800&q=80',
    '[
        {"text": "Ndaloni menjëherë", "isCorrect": false},
        {"text": "Vazhdoni me kujdes të shtuar dhe ulni shpejtësinë", "isCorrect": true},
        {"text": "Përshpejtoni për të kaluar para se të bëhet e kuqe", "isCorrect": false},
        {"text": "Kjo dritë nuk ekziston", "isCorrect": false}
    ]'::jsonb,
    'Drita e verdhë pulsuese tregon rrezik të mundshëm. Ju duhet të ulni shpejtësinë dhe të vazhdoni me kujdes të shtuar.',
    'easy',
    10,
    NOW(),
    NOW()
),

-- Skenari 2: Road Signs (Shenjat e Trafikut)
(
    'B',
    'Çfarë tregon shenja e trafikut në formë trekëndëshi me kulm poshtë?',
    'https://images.unsplash.com/photo-1564691899618-13a8c0124d10?auto=format&fit=crop&w=800&q=80',
    '[
        {"text": "Rrugë me përparësi", "isCorrect": false},
        {"text": "Ndalim kalimi", "isCorrect": false},
        {"text": "Jep përparësi", "isCorrect": true},
        {"text": "Rrezik i përgjithshëm", "isCorrect": false}
    ]'::jsonb,
    'Shenja trekëndore me kulm poshtë do të thotë "Jep Përparësi". Duhet t''u jepni përparësi mjeteve që lëvizin në rrugën ku po hyni.',
    'easy',
    15,
    NOW(),
    NOW()
),

-- Skenari 3: Pedestrian Safety (Siguria e Këmbësorëve)
(
    'B',
    'Po i afroheni një vendkalimi për këmbësorë dhe një këmbësor po pret të kalojë. Si veproni?',
    'https://images.unsplash.com/photo-1557332346-203d04e58908?auto=format&fit=crop&w=800&q=80',
    '[
        {"text": "I bini borisë që të largohet", "isCorrect": false},
        {"text": "Vazhdoni shpejt para se të zbresë në rrugë", "isCorrect": false},
        {"text": "Ndaloni dhe i jepni përparësi këmbësorit", "isCorrect": true},
        {"text": "Ulni shpejtësinë por nuk ndaloni", "isCorrect": false}
    ]'::jsonb,
    'Këmbësorët kanë gjithmonë përparësi në vendkalime. Duhet të ndaloni plotësisht dhe t''i lejoni të kalojnë të sigurt.',
    'medium',
    20,
    NOW(),
    NOW()
),

-- Skenari 4: Right of Way (Përparësia e Kalimit)
(
    'B',
    'Në një kryqëzim të barabartë (pa shenja), cili mjet ka përparësi?',
    'https://images.unsplash.com/photo-1604357209793-fca5dca89f97?auto=format&fit=crop&w=800&q=80',
    '[
        {"text": "Mjeti që vjen nga e majta", "isCorrect": false},
        {"text": "Mjeti që lëviz më shpejt", "isCorrect": false},
        {"text": "Mjeti më i madh", "isCorrect": false},
        {"text": "Mjeti që vjen nga e djathta", "isCorrect": true}
    ]'::jsonb,
    'Në mungesë të shenjave rrugore, zbatohet rregulli i krahut të djathtë: mjeti që vjen nga e djathta ka përparësi.',
    'hard',
    25,
    NOW(),
    NOW()
),

-- Skenari 5: Road Hazard (Rreziqet në Rrugë)
(
    'B',
    'Vëreni vaj të derdhur në rrugë në një kthesë. Çfarë duhet të bëni?',
    'https://images.unsplash.com/photo-1619685767540-0c6710f96347?auto=format&fit=crop&w=800&q=80',
    '[
        {"text": "Frenoni fort në mes të kthesës", "isCorrect": false},
        {"text": "Ulni shpejtësinë para kthesës dhe shmangni frenimin e fortë", "isCorrect": true},
        {"text": "Shtoni shpejtësinë për ta kaluar shpejt", "isCorrect": false},
        {"text": "Kthejeni timonin me shpejtësi", "isCorrect": false}
    ]'::jsonb,
    'Vaji në rrugë zvogëlon fërkimin. Duhet të ulni shpejtësinë para se të hyni në zonën e rrezikshme dhe të shmangni manovrat e forta.',
    'medium',
    20,
    NOW(),
    NOW()
),

-- Skenari 6: Parking Rules (Rregullat e Parkimit)
(
    'B',
    'A lejohet parkimi në trotuar?',
    'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=800&q=80',
    '[
        {"text": "Po, gjithmonë", "isCorrect": false},
        {"text": "Po, nëse lini 1 metër hapësirë për këmbësorët", "isCorrect": false},
        {"text": "Jo, përveç kur lejohet shprehimisht me shenjë dhe lihet hapësirë 1.6m", "isCorrect": true},
        {"text": "Po, vetëm natën", "isCorrect": false}
    ]'::jsonb,
    'Parkimi në trotuar është i ndaluar, përveç kur ka sinjalistikë të veçantë që e lejon dhe duhet lënë hapësirë e mjaftueshme për këmbësorët (min 1.6m).',
    'medium',
    15,
    NOW(),
    NOW()
);
