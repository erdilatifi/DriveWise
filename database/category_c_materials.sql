-- Chapter 1 (Category C): RREGULLAT PËR KOHËZGJATJEN E DREJTIMIT DHE PUSHIMIT
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'C', 
  'Koha e Drejtimit dhe Pushimit', 
  'Driving and Rest Times', 
  'Rregullat për orarin e punës së shoferëve profesionistë (Tahografi).', 
  'Rules for professional drivers working hours (Tachograph).', 
  '{
  "chapter": {
    "title": "Koha e Drejtimit dhe Pushimit",
    "description": "Shoferët profesionistë duhet t''u përmbahen rregullave strikte të kohës së drejtimit dhe pushimit për të garantuar sigurinë.",
    "sections": [
      {
        "title": "Koha e Ngasjes",
        "points": [
          "Koha ditore e ngasjes: Maksimumi 9 orë (mund të zgjatet në 10 orë max 2 herë në javë).",
          "Koha javore e ngasjes: Maksimumi 56 orë.",
          "Koha dy-javore e ngasjes: Maksimumi 90 orë (për dy javë të njëpasnjëshme)."
        ]
      },
      {
        "title": "Pauzat dhe Pushimet",
        "points": [
          "Pauza gjatë ngasjes: Pas 4.5 orësh ngasje, shoferi duhet të bëjë një pauzë prej 45 minutash (ose e ndarë në 15+30 minuta).",
          "Pushimi ditor: Së paku 11 orë të pandërprera në 24 orë (mund të reduktohet në 9 orë max 3 herë në javë).",
          "Pushimi javor: Së paku 45 orë (mund të reduktohet në 24 orë nëse kompensohet)."
        ]
      },
      {
        "title": "Tahografi",
        "points": [
          "Pajisja e kontrollit (Tahografi) është e obligueshme për mjetet mbi 3.5 tonë (përveç përjashtimeve).",
          "Kartela e shoferit: Është personale, vlen 5 vjet dhe nuk guxon të përdoret nga dikush tjetër.",
          "Manipulimi me tahograf është shkelje e rëndë ligjore."
        ]
      }
    ]
  }
}', 
  '{}', 
  1, 
  true, 
  20
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

-- Chapter 2 (Category C): TRANSPORTI I MALLRAVE
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'C', 
  'Transporti i Mallrave', 
  'Transport of Goods', 
  'Dokumentacioni dhe rregullat për transportin e mallrave (CMR, Lejet).', 
  'Documentation and rules for goods transport (CMR, Permits).', 
  '{
  "chapter": {
    "title": "Transporti i Mallrave",
    "description": "Rregullat për transportin e brendshëm dhe ndërkombëtar të mallrave dhe dokumentet e nevojshme.",
    "sections": [
      {
        "title": "Llojet e Transportit",
        "points": [
          "Transport për nevoja vetanake: Kryhet nga personi fizik/juridik për nevojat e veta pa pagesë.",
          "Transport për palë të tretë (me qira): Kryhet me qëllime komerciale për klientë tjerë kundrejt pagesës."
        ]
      },
      {
        "title": "Dokumentacioni i Nevojshëm",
        "points": [
          "Fletëngarkesa (CMR): Dokumenti kryesor për transportin ndërkombëtar që shoqëron mallin.",
          "Licenca e Transportit: Leja për të ushtruar veprimtarinë e transportit.",
          "Leja CEMT: Leje multilaterale për transport ndërkombëtar (nëse kërkohet).",
          "Certifikata e shoferit (CPC): Dëshmi e kualifikimit profesional të shoferit."
        ]
      },
      {
        "title": "Transporti i Personave në Kamion",
        "points": [
          "Në kamion lejohen maksimumi 5 persona (punëtorë ngarkim-shkarkimi).",
          "Ndalohet qëndrimi në këmbë, ulja në anësore ose mbi ngarkesë.",
          "Ndalohet transporti i personave në rimorkio."
        ]
      }
    ]
  }
}', 
  '{}', 
  2, 
  true, 
  21
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

-- Chapter 3 (Category C): MASA DHE DIMENSIONET
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'C', 
  'Masa dhe Dimensionet', 
  'Weight and Dimensions', 
  'Kufizimet e peshës, gjatësisë dhe ngarkesës boshtore për kamionë.', 
  'Weight, length, and axle load limits for trucks.', 
  '{
  "chapter": {
    "title": "Masa dhe Dimensionet",
    "description": "Kufizimet ligjore për dimensionet dhe peshën e mjeteve të rënda.",
    "sections": [
      {
        "title": "Dimensionet Maksimale",
        "points": [
          "Gjatësia maksimale: Kamion i vetëm (12m), Kamion me rimorkio (18.75m), Rimorkiator (16.50m).",
          "Gjerësia maksimale: 2.55m (për mjetet frigoriferike 2.60m).",
          "Lartësia maksimale: 4.00 metra."
        ]
      },
      {
        "title": "Masat e Lejuara",
        "points": [
          "Masa maksimale për rimorkio njëboshtore: 10 ton.",
          "Masa maksimale për rimorkio dyboshtore: 18 ton.",
          "Masa maksimale për bashkësinë e mjeteve (5-6 boshte): 40 ton."
        ]
      },
      {
        "title": "Ngarkesa Boshtore",
        "points": [
          "Boshti i vetëm (jo-tërheqës): 10 ton.",
          "Boshti i vetëm (tërheqës): 11.5 ton.",
          "Shpërndarja e peshës: Rrotave tërheqëse duhet t''u takojë së paku 25% e masës së përgjithshme."
        ]
      }
    ]
  }
}', 
  '{}', 
  3, 
  true, 
  22
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

-- Chapter 4 (Category C): FAKTORËT E SIGURISË DHE NGARKIMI
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'C', 
  'Siguria e Ngarkesës', 
  'Load Safety', 
  'Sigurimi i ngarkesës, shpërndarja e peshës dhe transporti i mallrave të rrezikshme (ADR).', 
  'Securing the load, weight distribution, and transport of dangerous goods (ADR).', 
  '{
  "chapter": {
    "title": "Faktorët e Sigurisë dhe Ngarkimi",
    "description": "Sigurimi i ngarkesës është vital për sigurinë rrugore. Përgjegjësia bie mbi shoferin.",
    "sections": [
      {
        "title": "Sigurimi i Ngarkesës",
        "points": [
          "Ngarkesa nuk guxon të lëvizë, të bjerë ose të shkaktojë zhurmë.",
          "Duhet të shpërndahet në mënyrë të barabartë për të mos cenuar stabilitetin e mjetit.",
          "Nëse ngarkesa kalon më shumë se 1m prapa, duhet të shënohet me tabelë katrore (kuqe-bardhë) ose dritë të kuqe."
        ]
      },
      {
        "title": "Transporti i Materieve të Rrezikshme (ADR)",
        "points": [
          "Kërkon certifikim të veçantë ADR për shoferin dhe mjetin.",
          "Mjeti duhet të shënohet me tabela portokalli (para dhe prapa).",
          "Shoferi duhet të njohë procedurat emergjente në rast rrjedhjeje ose aksidenti."
        ]
      },
      {
        "title": "Pajisjet e Sigurisë",
        "points": [
          "Kamionët duhet të kenë: Fikës zjarri (sipas tonazhit), pyka sigurie, trekëndësh sigurie (2 copë për rimorkio), jelek reflektues.",
          "Kufizuesi i shpejtësisë: I detyrueshëm për mjetet mbi 3.5 tonë (zakonisht 90 km/h)."
        ]
      }
    ]
  }
}', 
  '{}', 
  4, 
  true, 
  23
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

-- Chapter 5 (Category C): DINAMIKA DHE MIRËMBAJTJA
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'C', 
  'Dinamika dhe Mirëmbajtja', 
  'Dynamics and Maintenance', 
  'Frenimi, retarderi, sistemet pneumatike dhe kontrolli ditor.', 
  'Braking, retarder, pneumatic systems, and daily checks.', 
  '{
  "chapter": {
    "title": "Dinamika dhe Mirëmbajtja e Mjetit të Rëndë",
    "description": "Mjetet e rënda kanë sisteme specifike frenimi dhe kërkojnë mirëmbajtje të veçantë.",
    "sections": [
      {
        "title": "Sistemi i Frenimit",
        "points": [
          "Frenat pneumatike (me ajër): Përdoren te mjetet e rënda. Kërkojnë kohë për t''u mbushur me presion.",
          "Retarderi/Intarderi: Sistem frenimi ndihmës për të ngadalësuar mjetin pa harxhuar frenat kryesore (sidomos në tatëpjetë).",
          "Frenimi i dorës: Vepron me susta (bllokon rrotat kur lirohet ajri)."
        ]
      },
      {
        "title": "Këndet e Vdekura",
        "points": [
          "Kamioni ka kënde të mëdha të vdekura anash dhe prapa.",
          "Kujdes i veçantë kërkohet gjatë kthesave djathtas për shkak të këmbësorëve/biçiklistëve.",
          "Përdorni të gjitha pasqyrat shtesë (të rampës, trotuarit)."
        ]
      },
      {
        "title": "Mirëmbajtja Ditore",
        "points": [
          "Kontrolloni: Nivelin e vajit, lëngun ftohës, presionin e ajrit në sistemin e frenimit, gjendjen e gomave (rrotat e dyfishta!), dritat dhe sinjalizimin.",
          "Në dimër: Sigurohuni që sistemi i ajrit nuk ka lagështi (ngrirja bllokon frenat)."
        ]
      }
    ]
  }
}', 
  '{}', 
  5, 
  true, 
  24
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
