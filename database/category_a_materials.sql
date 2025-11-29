-- Chapter 1 (Category A): HYRJE NË KATEGORINË A
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'A', 
  'Hyrje në Kategorinë A', 
  'Introduction to Category A', 
  'Rregullat dhe kushtet për drejtimin e motoçikletave.', 
  'Rules and conditions for riding motorcycles.', 
  '{
  "chapter": {
    "title": "Hyrje në Kategorinë A",
    "description": "Drejtimi i motoçikletës kërkon shkathtësi të veçanta dhe njohuri të thella për sigurinë, pasi motoçiklistët janë pjesëmarrësit më të rrezikuar.",
    "sections": [
      {
        "title": "Nënkategoritë",
        "points": [
          "Kategoria AM: Ciklomotorë (Moped) deri në 50cc dhe 45 km/h. Mosha minimale 16 vjeç.",
          "Kategoria A1: Motoçikleta të lehta deri në 125cc dhe 11kW. Mosha minimale 18 vjeç.",
          "Kategoria A2: Motoçikleta deri në 35kW. Mosha minimale 18 vjeç.",
          "Kategoria A: Motoçikleta pa kufizim fuqie. Mosha minimale 24 vjeç (ose 20 vjeç me 2 vjet përvojë në A2)."
        ]
      },
      {
        "title": "Pajisjet Mbrojtëse",
        "points": [
          "Helmeta (Kaska): E obligueshme për shoferin dhe pasagjerin. Duhet të jetë e homologuar dhe e shtrënguar.",
          "Veshja mbrojtëse: Xhaketa me mbrojtëse, doreza, pantallona të forta dhe çizme. Mbrojnë nga gërvishtjet dhe goditjet.",
          "Dukshmëria: Veshjet me ngjyra të çelëta ose jelek reflektues rrisin sigurinë."
        ]
      }
    ]
  }
}', 
  '{}', 
  1, 
  true, 
  40
)
ON CONFLICT ("chapter_id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "title_sq" = EXCLUDED."title_sq",
  "title_en" = EXCLUDED."title_en",
  "description_sq" = EXCLUDED."description_sq",
  "description_en" = EXCLUDED."description_en",
  "content_sq" = EXCLUDED."content_sq",
  "content_en" = EXCLUDED."content_en",
  "order_index" = EXCLUDED."order_index",
  "is_published" = EXCLUDED."is_published";

-- Chapter 2 (Category A): TEKNIKA E NGASJES SË MOTOÇIKLETËS
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'A', 
  'Teknika e Ngasjes', 
  'Riding Technique', 
  'Manovrimi, frenimi dhe marrja e kthesave me motoçikletë.', 
  'Maneuvering, braking, and cornering with a motorcycle.', 
  '{
  "chapter": {
    "title": "Teknika e Ngasjes së Motoçikletës",
    "description": "Stabiliteti i motoçikletës varet tërësisht nga shoferi. Këtu mësoni si të kontrolloni mjetin në çdo situatë.",
    "sections": [
      {
        "title": "Pozita në Rrugë dhe Shikimi",
        "points": [
          "Shikimi: Shikoni atje ku doni të shkoni (jo te rrota e parë). Në kthesë, shikoni daljen e kthesës.",
          "Pozita: Qëndroni në mes të korsisë tuaj për të dominuar hapësirën dhe për të qenë të dukshëm.",
          "Mbajtja e timonit: Duart duhet të jenë të relaksuara, jo të ngërçura."
        ]
      },
      {
        "title": "Marrja e Kthesave",
        "points": [
          "Ngadalësimi: Bëhet PARA se të hyni në kthesë.",
          "Pjerrësia: Anoni trupin bashkë me motoçikletën.",
          "Kundër-drejtimi (Counter-steering): Për të kthyer majtas, shtyni timonin majtas (kjo e rrëzon motorin në të majtë).",
          "Përshpejtimi: Bëhet lehtësisht pas daljes nga kulmi i kthesës."
        ]
      },
      {
        "title": "Frenimi",
        "points": [
          "Freni i parë: Është freni kryesor (ofron 70-80% të fuqisë ndaluese). Përdoreni me kujdes progresiv.",
          "Freni i pasmë: Përdoret për stabilitet dhe manovrim të ngadaltë.",
          "Frenimi emergjent: Përdorni të dy frenat njëkohësisht, mbani trupin drejt dhe shikoni përpara."
        ]
      }
    ]
  }
}', 
  '{}', 
  2, 
  true, 
  41
)
ON CONFLICT ("chapter_id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "title_sq" = EXCLUDED."title_sq",
  "title_en" = EXCLUDED."title_en",
  "description_sq" = EXCLUDED."description_sq",
  "description_en" = EXCLUDED."description_en",
  "content_sq" = EXCLUDED."content_sq",
  "content_en" = EXCLUDED."content_en",
  "order_index" = EXCLUDED."order_index",
  "is_published" = EXCLUDED."is_published";

-- Chapter 3 (Category A): RREZIQET SPECIFIKE PËR MOTOÇIKLISTË
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'A', 
  'Rreziqet Specifike', 
  'Specific Risks', 
  'Sipërfaqet e rrezikshme, dukshmëria dhe trafiku urban.', 
  'Dangerous surfaces, visibility, and urban traffic.', 
  '{
  "chapter": {
    "title": "Rreziqet Specifike për Motoçiklistë",
    "description": "Motoçiklistët janë të pambrojtur. Njohja e rreziqeve të padukshme për shoferët e veturave është jetike.",
    "sections": [
      {
        "title": "Sipërfaqet e Rrezikshme",
        "points": [
          "Vijat e bardha (Zebrat): Janë shumë të rrëshqitshme kur lagen. Shmangni frenimin ose kthesën mbi to.",
          "Kapakët e pusetave: Metalikë dhe të rrëshqitshëm. Mundohuni t''i anashkaloni.",
          "Rëra dhe zhavorri: Kujdes në kthesa dhe kryqëzime. Rëra vepron si sfera të vogla që humbin fërkimin.",
          "Gjethet e lagura: Rrezik i ngjashëm me akullin."
        ]
      },
      {
        "title": "Dukshmëria dhe Trafiku",
        "points": [
          "''Nuk të pashë'': Shkaku më i shpeshtë i aksidenteve. Veturat shpesh nuk i shohin motorët në kryqëzime.",
          "Këndi i vdekur: Mos qëndroni në këndin e vdekur të veturave/kamionëve.",
          "Drita ndezur: Mbani dritat e shkurtra ndezur edhe ditën (detyrim ligjor)."
        ]
      },
      {
        "title": "Pasagjeri",
        "points": [
          "Pasagjeri duhet të ketë helmetë.",
          "Duhet të ulet afër shoferit dhe të ndjekë lëvizjet e tij (të anojë bashkë me shoferin në kthesë).",
          "Nuk duhet të bëjë lëvizje të papritura.",
          "Kujdes: Pesha shtesë rrit distancën e frenimit dhe ndryshon qendrën e rëndesës."
        ]
      }
    ]
  }
}', 
  '{}', 
  3, 
  true, 
  42
)
ON CONFLICT ("chapter_id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "title_sq" = EXCLUDED."title_sq",
  "title_en" = EXCLUDED."title_en",
  "description_sq" = EXCLUDED."description_sq",
  "description_en" = EXCLUDED."description_en",
  "content_sq" = EXCLUDED."content_sq",
  "content_en" = EXCLUDED."content_en",
  "order_index" = EXCLUDED."order_index",
  "is_published" = EXCLUDED."is_published";
