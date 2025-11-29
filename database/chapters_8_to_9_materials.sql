-- Chapter 8: RREGULLAT PLOTËSUESE DHE ADMINISTRIMI
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'B', 
  'Rregullat Plotësuese', 
  'Additional Rules', 
  'Rregulla të tjera të rëndësishme dhe procedurat administrative', 
  'Other important rules and administrative procedures', 
  '{
  "chapter": {
    "title": "Rregullat Plotësuese dhe Administrimi",
    "description": "Informacione mbi patentë shoferin, regjistrimin e mjetit dhe masa të tjera administrative.",
    "sections": [
      {
        "title": "Patentë Shoferi",
        "points": [
          "Patentë shoferi i kategorisë B vlen 10 vjet (për personat nën 65 vjeç).",
          "Shoferi fillestar: Personi që ka marrë patentën për herë të parë (në 2 vitet e para).",
          "Kufizimet për shoferin fillestar: Nuk lejohet të ngasë me shpejtësi mbi 110 km/h në autostradë."
        ]
      },
      {
        "title": "Regjistrimi i Mjetit",
        "points": [
          "Certifikata e regjistrimit duhet të mbahet gjithmonë në mjet.",
          "Polica e sigurimit është e detyrueshme.",
          "Kontrolli teknik bëhet çdo vit (për mjetet më të vjetra se 3 vjet)."
        ]
      },
      {
        "title": "Aksidentet në Trafik",
        "points": [
          "Në rast aksidenti me dëme të vogla materiale: Plotësoni Raportin Evropian të Aksidenteve.",
          "Në rast aksidenti me të lënduar: Mos e lëvizni mjetin dhe thirrni policinë.",
          "Mos u largoni nga vendi i ngjarjes."
        ]
      },
      {
        "title": "Alkooli dhe Drogat",
        "points": [
          "Kufiri i alkoolit për shoferët profesionistë dhe fillestarë: 0.00 g/kg (promila).",
          "Për shoferët e tjerë: 0.50 g/kg.",
          "Ngasja nën ndikimin e drogave është rreptësisht e ndaluar."
        ]
      }
    ]
  }
}', 
  '{}', 
  8, 
  true, 
  8
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

-- Chapter 9: EKO-NGASJA DHE MJEDISI
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'B', 
  'Eko-Ngasja', 
  'Eco-Driving', 
  'Mbrojtja e mjedisit dhe ngasja ekonomike', 
  'Environment protection and economic driving', 
  '{
  "chapter": {
    "title": "Eko-Ngasja dhe Mjedisi",
    "description": "Teknikat për të zvogëluar konsumin e karburantit dhe ndotjen e mjedisit.",
    "sections": [
      {
        "title": "Parimet e Eko-Ngasjes",
        "points": [
          "Ndërrimi i shpejtësive në kohën e duhur (rrotullime të ulëta).",
          "Parashikimi i trafikut për të shmangur frenimet e panevojshme.",
          "Fikja e motorit gjatë ndalesave të gjata (>1 minutë)."
        ]
      },
      {
        "title": "Mirëmbajtja dhe Mjedisi",
        "points": [
          "Gomat e fryra dobët rrisin konsumin e karburantit.",
          "Filtrat e bllokuar të ajrit rrisin ndotjen.",
          "Mos hidhni vajra ose mbeturina në natyrë."
        ]
      },
      {
        "title": "Aerodinamika",
        "points": [
          "Dritaret e hapura gjatë shpejtësive të mëdha rrisin rezistencën.",
          "Mbajtësit e bagazhit në çati rrisin konsumin (hiqni kur nuk përdoren)."
        ]
      }
    ]
  }
}', 
  '{}', 
  9, 
  true, 
  9
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
