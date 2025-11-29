-- Chapter 1 (Category C1): HYRJE NË KATEGORINË C1
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'C1', 
  'Hyrje në Kategorinë C1', 
  'Introduction to Category C1', 
  'Njohja me kategorinë e mesme të kamionëve (3.5t - 7.5t).', 
  'Introduction to medium-sized trucks (3.5t - 7.5t).', 
  '{
  "chapter": {
    "title": "Hyrje në Kategorinë C1",
    "description": "Kategoria C1 është hapi i parë drejt transportit profesional të mallrave.",
    "sections": [
      {
        "title": "Përkufizimi i Kategorisë C1",
        "points": [
          "Përfshin mjetet motorike me masë maksimale të lejuar mbi 3500 kg por jo më shumë se 7500 kg.",
          "Numri i ulëseve: Maksimumi 8 ulëse (pa përfshirë shoferin).",
          "Rimorkio: Mund të tërhiqet një rimorkio e lehtë (deri në 750 kg).",
          "Për rimorkio më të rënda nevojitet kategoria C1+E."
        ]
      },
      {
        "title": "Kushtet për Shoferin",
        "points": [
          "Mosha minimale: 18 vjeç.",
          "Përvoja: Duhet të posedoni patentën e kategorisë B.",
          "Vlefshmëria: Patenta C1 vlen 5 vjeç (kërkon rinovim të certifikatës mjekësore)."
        ]
      }
    ]
  }
}', 
  '{}', 
  1, 
  true, 
  30
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

-- Chapter 2 (Category C1): TRANSPORTI DHE DOKUMENTACIONI C1
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'C1', 
  'Transporti dhe Dokumentacioni', 
  'Transport and Documentation', 
  'Rregullat specifike për transportin me mjete të lehta transportuese.', 
  'Specific rules for transport with light trucks.', 
  '{
  "chapter": {
    "title": "Transporti dhe Dokumentacioni për C1",
    "description": "Edhe pse më të lehtë se kamionët e rëndë, mjetet C1 kanë rregulla strikte transporti.",
    "sections": [
      {
        "title": "Rregullat e Transportit",
        "points": [
          "Transporti i mallrave: Zakonisht përdoret për shpërndarje lokale dhe rajonale.",
          "Kufizimet e lëvizjes: Mjetet C1 mund të kenë qasje në zona urbane ku kamionët e rëndë (C) ndalohen.",
          "Tahografi: I detyrueshëm edhe për C1 nëse përdoret për transport komercial."
        ]
      },
      {
        "title": "Dokumentet në Mjet",
        "points": [
          "Certifikata e regjistrimit dhe polica e sigurimit.",
          "Patenta e shoferit dhe certifikata e aftësisë profesionale (nëse kërkohet).",
          "Fletëngarkesa për mallin që transportohet."
        ]
      }
    ]
  }
}', 
  '{}', 
  2, 
  true, 
  31
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

-- Chapter 3 (Category C1): SIGURIA DHE NGARKESA C1
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'C1', 
  'Siguria dhe Ngarkesa', 
  'Safety and Load', 
  'Sigurimi i ngarkesës dhe kufizimet e peshës për kategorinë C1.', 
  'Securing load and weight limits for C1 category.', 
  '{
  "chapter": {
    "title": "Siguria dhe Ngarkesa për C1",
    "description": "Menaxhimi i peshës është kritik për mjetet C1 për të mos tejkaluar 7.5 ton.",
    "sections": [
      {
        "title": "Kufizimet e Peshës",
        "points": [
          "Masa maksimale e lejuar: 7500 kg. Tejkalimi është shkelje e rëndë.",
          "Ngarkesa e dobishme: Duhet llogaritur saktë (Masa totale - Masa e mjetit të zbrazët).",
          "Shpërndarja: Pesha duhet të shpërndahet që të mos mbingarkojë boshtin e pasmë."
        ]
      },
      {
        "title": "Sigurimi i Ngarkesës",
        "points": [
          "Përdorimi i rripave shtrëngues (gurtneve).",
          "Mbyllja e dyerve të pasme dhe anësore.",
          "Kujdes gjatë kthesave: Qendra e rëndesës është më e lartë se te veturat."
        ]
      }
    ]
  }
}', 
  '{}', 
  3, 
  true, 
  32
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
