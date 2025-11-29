-- Chapter 1: KUSHTET PËR DREJTIMIN E MJETEVE TË KATEGORISË D
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'D', 
  'Kushtet për Kategorinë D', 
  'Category D Conditions', 
  'Rregullat dhe kushtet për marrjen dhe mbajtjen e patentës për autobus.', 
  'Rules and conditions for obtaining and holding a bus driving license.', 
  '{
  "chapter": {
    "title": "Kushtet për Drejtimin e Mjeteve të Kategorisë D",
    "description": "Kategoria D përfshin mjetet motorike të projektuara për transportin e më shumë se 8 udhëtarëve (autobusët).",
    "sections": [
      {
        "title": "Përkufizimi i Kategorisë D",
        "points": [
          "Kategoria D: Mjetet motorike për transportin e personave me më shumë se 8 ulëse (pa përfshirë shoferin).",
          "Mund të tërheqin një rimorkio të lehtë (deri në 750 kg).",
          "Për rimorkio më të rënda nevojitet kategoria D+E."
        ]
      },
      {
        "title": "Kushtet për Shoferin",
        "points": [
          "Mosha minimale: Zakonisht 24 vjeç (ose 21/23 vjeç me Kualifikim Profesional - CPC).",
          "Përvoja: Duhet të posedoni patentën e kategorisë B (dhe shpesh C).",
          "Certifikata mjekësore: Kërkohet kontroll më i rreptë mjekësor dhe psikologjik.",
          "Vlefshmëria: Patenta D vlen zakonisht 5 vjet."
        ]
      }
    ]
  }
}', 
  '{}', 
  1, 
  true, 
  10
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

-- Chapter 2: RREGULLAT PËR TRANSPORTIN E UDHËTARËVE
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'D', 
  'Transporti i Udhëtarëve', 
  'Passenger Transport', 
  'Rregullat për sigurinë dhe komoditetin e udhëtarëve.', 
  'Rules for passenger safety and comfort.', 
  '{
  "chapter": {
    "title": "Rregullat për Transportin e Udhëtarëve",
    "description": "Përgjegjësia e shoferit të autobusit është shumë e lartë pasi transporton njerëz.",
    "sections": [
      {
        "title": "Hyrja dhe Dalja e Udhëtarëve",
        "points": [
          "Hyrja/dalja lejohet vetëm në vendndalime të shënuara.",
          "Autobusi duhet të jetë plotësisht i ndalur para hapjes së dyerve.",
          "Shoferi duhet të sigurohet që dyert janë mbyllur para nisjes.",
          "Kujdes i veçantë për fëmijët, të moshuarit dhe personat me aftësi të kufizuara."
        ]
      },
      {
        "title": "Rregullat Gjatë Udhëtimit",
        "points": [
          "Numri i udhëtarëve nuk guxon të kalojë kapacitetin e lejuar të mjetit.",
          "Në autobusët ndërurbanë/turistikë, udhëtarët nuk lejohen të qëndrojnë në këmbë.",
          "Shoferi nuk duhet të bisedojë me udhëtarët gjatë ngasjes."
        ]
      }
    ]
  }
}', 
  '{}', 
  2, 
  true, 
  11
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

-- Chapter 3: KOHA E DREJTIMIT DHE PUSHIMIT (TAHOFRAF)
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'D', 
  'Koha e Drejtimit dhe Pushimit', 
  'Driving and Rest Times', 
  'Rregullat strikte për orët e punës dhe përdorimin e tahografit.', 
  'Strict rules for working hours and tachograph use.', 
  '{
  "chapter": {
    "title": "Koha e Drejtimit dhe Pushimit",
    "description": "Për të shmangur lodhjen, shoferët profesionistë duhet t''u përmbahen rregullave të orarit (Rregullore e BE-së).",
    "sections": [
      {
        "title": "Koha e Drejtimit Ditor",
        "points": [
          "Maksimumi 9 orë në ditë.",
          "Mund të zgjatet në 10 orë, por jo më shumë se dy herë në javë.",
          "Pas 4.5 orësh drejtimi, shoferi duhet të bëjë pushim prej 45 minutash (ose 15+30 minuta)."
        ]
      },
      {
        "title": "Pushimi Ditor dhe Javor",
        "points": [
          "Pushimi ditor i rregullt: Së paku 11 orë të pandërprera.",
          "Pushimi javor: Së paku 45 orë (mund të reduktohet në 24 orë në kushte të caktuara).",
          "Tahografi: Pajisja që regjistron kohën, shpejtësinë dhe distancën. Manipulimi është vepër e rëndë."
        ]
      }
    ]
  }
}', 
  '{}', 
  3, 
  true, 
  12
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

-- Chapter 4: DIMENSIONET DHE DINAMIKA E AUTOBUSIT
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'D', 
  'Dinamika e Mjetit', 
  'Vehicle Dynamics', 
  'Veçoritë e drejtimit të mjetit të madh: kthesat, frenimi dhe këndet e vdekura.', 
  'Features of driving large vehicles: turns, braking, and blind spots.', 
  '{
  "chapter": {
    "title": "Dimensionet dhe Dinamika e Autobusit",
    "description": "Drejtimi i autobusit ndryshon rrënjësisht nga vetura për shkak të gjatësisë, peshës dhe inercisë.",
    "sections": [
      {
        "title": "Marrja e Kthesave",
        "points": [
          "Kthesat e ngushta: Duhet të merren gjerë (nga jashtë brenda) sepse rrotat e pasme presin kthesën.",
          "Kujdes nga ''bishti'': Pjesa e pasme e autobusit mund të dalë jashtë korsisë gjatë kthesave të forta (efekti ''shuplakë'')."
        ]
      },
      {
        "title": "Frenimi dhe Distanca",
        "points": [
          "Pesha e madhe rrit distancën e frenimit.",
          "Frenat me ajër: Kanë vonesë të lehtë në reagim krahasuar me ato hidraulike.",
          "Retarderi: Përdoret për të ngadalësuar mjetin në teposhtëze pa nxehur frenat e shërbimit."
        ]
      },
      {
        "title": "Këndet e Vdekura",
        "points": [
          "Autobusi ka kënde të mëdha të vdekura, sidomos prapa dhe anash poshtë.",
          "Kujdes i veçantë për këmbësorët dhe çiklistët gjatë nisjes nga vendndalimi."
        ]
      }
    ]
  }
}', 
  '{}', 
  4, 
  true, 
  13
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
