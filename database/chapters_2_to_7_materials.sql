-- Chapter 2: SHENJAT E TRAFIKUT
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'B', 
  'Shenjat e Trafikut', 
  'Traffic Signs', 
  'Njihuni me të gjitha llojet e shenjave të trafikut', 
  'Learn about all types of traffic signs', 
  '{
  "chapter": {
    "title": "Shenjat e Trafikut",
    "description": "Ky kapitull shpjegon kuptimin dhe veprimin e shoferit ndaj shenjave të ndryshme të trafikut.",
    "sections": [
      {
        "title": "Llojet e Shenjave",
        "points": [
          "Shenjat e rrezikut: Paralajmërojnë për rrezikun në rrugë.",
          "Shenjat e urdhëresave të prera: Ndalime, kufizime dhe obligime.",
          "Shenjat e lajmërimit: Japin informata të nevojshme për rrugën."
        ]
      },
      {
        "title": "Shenjat e Rrezikut",
        "points": [
          "Zakonisht kanë formë trekëndëshi me kulm lart (përveç Kryqit të Andreut).",
          "Vendosen zakonisht 150-250m para rrezikut jashtë vendbanimit.",
          "Shembuj: Kthesë e rrezikshme, rrugë e rrëshqitshme, punime në rrugë."
        ]
      },
      {
        "title": "Shenjat e Urdhëresave të Prera",
        "points": [
          "Kanë formë rrethi (përveç STOP dhe Trekëndëshit të përmbysur).",
          "Rrethi me skaj të kuq tregon NDALIM ose KUFIZIM.",
          "Rrethi me sfond të kaltër tregon OBLIGIM.",
          "Vlejnë nga vendi i vendosjes deri te kryqëzimi i parë ose shenja e shfuqizimit."
        ]
      },
      {
        "title": "Shenjat e Lajmërimit",
        "points": [
          "Kanë forma të ndryshme (katrore, drejtkëndëshe).",
          "Tregojnë emrat e vendeve, spitalet, pompat e benzinës, parkimet, etj.",
          "Ndihmojnë orientimin në trafik."
        ]
      },
      {
        "title": "Shenjat e Ndritshme (Semaforët)",
        "points": [
          "E kuqe: Ndalje e detyrueshme.",
          "E verdhë: Ndalje (përveç nëse nuk mund të ndaleni sigurt). Përgatitje për nisje (nëse është bashkë me të kuqen).",
          "E gjelbër: Kalim i lirë (me kujdes).",
          "Drita plotësuese (shigjeta): Kalim i lirë vetëm në drejtimin e shigjetës."
        ]
      },
      {
        "title": "Shenjat në Sipërfaqen e Rrugës",
        "points": [
          "Vija e plotë: Ndalohet kalimi mbi të.",
          "Vija e ndërprerë: Lejohet kalimi mbi të (për tejkalim, kthim).",
          "Vija e dyfishtë e kombinuar: Respektohet vija që është në anën tuaj."
        ]
      }
    ]
  }
}', 
  '{}', 
  2, 
  true, 
  2
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

-- Chapter 3: SINJALIZIMI I POLICIT
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'B', 
  'Sinjalizimi i Policit', 
  'Police Signals', 
  'Kuptimi i shenjave dhe urdhrave të policit në trafik', 
  'Understanding police signals and orders', 
  '{
  "chapter": {
    "title": "Sinjalizimi i Policit",
    "description": "Urdhrat e policit kanë prioritet mbi të gjitha rregullat tjera, shenjat dhe semaforët.",
    "sections": [
      {
        "title": "Pozita e Trupit të Policit",
        "points": [
          "Trupi anash (profil): Kalim i LIRË për mjetet që vijnë nga drejtimi i krahëve.",
          "Trupi me fytyrë ose shpinë: NDALJE për mjetet që vijnë nga para ose prapa.",
          "Dora e ngritur lart (shuplaka hapur): NDALJE për të gjithë pjesëmarrësit në trafik (përveç atyre që janë në kryqëzim)."
        ]
      },
      {
        "title": "Lëvizjet e Duarve",
        "points": [
          "Dora e shtrirë horizontalisht: Ndalim për ata që vijnë nga drejtimi i shpinës ose gjoksit.",
          "Lëvizja e dorës lart-poshtë (shuplaka hapur): Zvogëlo shpejtësinë.",
          "Rrotullimi i dorës: Përshpejto lëvizjen."
        ]
      },
      {
        "title": "Sinjalet me Bilbil",
        "points": [
          "Një vërshëllimë e gjatë: Kërkesë për vëmendje (të gjithë duhet të shikojnë policin).",
          "Disa vërshëllima të shkurtra: Dikush ka shkelur rregullat (ndalje e menjëhershme)."
        ]
      },
      {
        "title": "Urdhrat nga Automjeti i Policisë",
        "points": [
          "Dritat rrotulluese (blue/kuqe) dhe sirena: Tërhiqni mjetin djathtas dhe ndaloni.",
          "Tabela STOP POLICIA: Ndalim i detyrueshëm për mjetin që i tregohet tabela."
        ]
      }
    ]
  }
}', 
  '{}', 
  3, 
  true, 
  3
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

-- Chapter 4: RREZIQET NË TRAFIK DHE TEKNIKA E NGASJES
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'B', 
  'Rreziqet dhe Teknika', 
  'Risks and Driving Technique', 
  'Identifikimi i rreziqeve dhe teknikat e sigurta të ngasjes', 
  'Identifying risks and safe driving techniques', 
  '{
  "chapter": {
    "title": "Rreziqet në Trafik dhe Teknika e Ngasjes",
    "description": "Si të njohim dhe shmangim rreziqet, dhe si të drejtojmë mjetin në mënyrë të sigurt dhe ekonomike.",
    "sections": [
      {
        "title": "Faktorët e Rrezikut",
        "points": [
          "Njeriu (shoferi): Lodhja, alkooli, pagjumësia, mungesa e përvojës.",
          "Mjeti: Defektet teknike (frenat, rrotat, dritat).",
          "Rruga: Lagështia, gropat, kthesat e forta, sinjalizimi i munguar.",
          "Mjedisi: Shi, borë, mjegull, erë e fortë."
        ]
      },
      {
        "title": "Distanca e Sigurisë",
        "points": [
          "Rregulla e 2 sekondave: Mbani distancë prej së paku 2 sekondash nga mjeti para (në kushte normale).",
          "Në shi/borë: Distanca duhet të dyfishohet ose trefishohet.",
          "Distanca e ndaljes = Rruga e reagimit + Rruga e frenimit."
        ]
      },
      {
        "title": "Parakalimi (Tejkalimi)",
        "points": [
          "Sigurohuni që keni dukshmëri dhe hapësirë të mjaftueshme.",
          "Shikoni pasqyrat dhe këndin e vdekur.",
          "Ndizni treguesin e majtë.",
          "Mos e rrisni shpejtësinë kur dikush ju tejkalon."
        ]
      },
      {
        "title": "Ngasja Ekonomike (Eco-Driving)",
        "points": [
          "Ndërroni shpejtësitë (marshat) me kohë (rreth 2000-2500 rrotullime).",
          "Mbani shpejtësi konstante.",
          "Shmangni frenimet dhe nisjet e vrullshme.",
          "Kontrolloni presionin e gomave rregullisht."
        ]
      },
      {
        "title": "Ngasja Natën dhe në Kushte të Vështira",
        "points": [
          "Përdorni dritat e gjata kur nuk ka mjete përballë.",
          "Në mjegull përdorni dritat e mjegullës (mos përdorni dritat e gjata).",
          "Kujdes nga këmbësorët dhe kafshët e padukshme."
        ]
      }
    ]
  }
}', 
  '{}', 
  4, 
  true, 
  4
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

-- Chapter 5: PAJISJET E MJETIT DHE NGARKESA
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'B', 
  'Pajisjet dhe Ngarkesa', 
  'Vehicle Equipment and Load', 
  'Pajisjet e obligueshme dhe rregullat për ngarkesën', 
  'Mandatory equipment and load rules', 
  '{
  "chapter": {
    "title": "Pajisjet e Mjetit dhe Ngarkesa",
    "description": "Informacione për pajisjet e detyrueshme në automjet dhe si të bartet ngarkesa në mënyrë të sigurt.",
    "sections": [
      {
        "title": "Pajisjet e Detyrueshme",
        "points": [
          "Rrota rezervë (ose seti për riparim).",
          "Trekëndëshi i sigurisë (për paralajmërim të rrezikut).",
          "Kutia e ndihmës së parë (e pa skaduar).",
          "Jeleku reflektues (fluoreshent).",
          "Litar ose bigë për tërheqje.",
          "Zinxhirët e borës (në sezonin dimëror: 15 Nëntor - 15 Mars)."
        ]
      },
      {
        "title": "Dritat dhe Sinjalizimi i Mjetit",
        "points": [
          "Dritat e pozicionit, të shkurtra dhe të gjata.",
          "Treguesit e drejtimit (të katër anët).",
          "Dritat e frenimit (STOP) dhe drita e targës.",
          "Dritat e mjegullës (opsionale por të rekomanduara)."
        ]
      },
      {
        "title": "Ngarkesa në Mjet",
        "points": [
          "Nuk duhet të kalojë peshën maksimale të lejuar të mjetit.",
          "Nuk duhet të rrezikojë stabilitetin e mjetit.",
          "Nuk duhet të pengojë pamjen e shoferit ose të mbulojë dritat/targat.",
          "Nëse ngarkesa kalon më shumë se 1m prapa mjetit, duhet të shënohet me pëlhurë të kuqe (ditën) ose dritë të kuqe (natën)."
        ]
      }
    ]
  }
}', 
  '{}', 
  5, 
  true, 
  5
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

-- Chapter 6: NDËRTIMI DHE FUNKSIONIMI I MJETIT
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'B', 
  'Mekanika e Mjetit', 
  'Vehicle Mechanics', 
  'Bazat e funksionimit të motorit dhe sistemeve të mjetit', 
  'Basics of engine and vehicle systems operation', 
  '{
  "chapter": {
    "title": "Ndërtimi dhe Funksionimi i Mjetit",
    "description": "Njohuri bazike për motorin, sistemet e frenimit, drejtimit dhe mirëmbajtjen e mjetit.",
    "sections": [
      {
        "title": "Motori",
        "points": [
          "Motori shndërron energjinë e djegies në energji mekanike.",
          "Sistemi i ftohjes: Mban temperaturën e motorit (kontrolloni lëngun antifriz).",
          "Sistemi i vajosjes: Zvogëlon fërkimin (kontrolloni nivelin e vajit)."
        ]
      },
      {
        "title": "Sistemi i Frenimit",
        "points": [
          "Freni i punës (këmba): Vepron në të gjitha rrotat.",
          "Freni i dorës (parkimit): Mban mjetin të ndalur (vepron zakonisht në rrotat e pasme).",
          "ABS: Parandalon bllokimin e rrotave gjatë frenimit të fortë."
        ]
      },
      {
        "title": "Gomat (Pneumatikët)",
        "points": [
          "Presioni i duhur është jetik për siguri dhe konsum.",
          "Thellësia e vijave: Minimalisht 1.6mm (për verë) dhe 4mm (për dimër).",
          "Ndërrimi i gomave: Çdo 5-6 vjet ose kur dëmtohen."
        ]
      },
      {
        "title": "Paneli i Instrumenteve",
        "points": [
          "Drita e kuqe e vajit/akumulatorit: Ndalje e menjëhershme.",
          "Drita e verdhë e motorit: Kontroll në servis.",
          "Treguesi i temperaturës: Kujdes nga mbinxehja."
        ]
      }
    ]
  }
}', 
  '{}', 
  6, 
  true, 
  6
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

-- Chapter 7: NDIHMA E PARË
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'B', 
  'Ndihma e Parë', 
  'First Aid', 
  'Veprimet emergjente në rast aksidenti', 
  'Emergency actions in case of an accident', 
  '{
  "chapter": {
    "title": "Ndihma e Parë",
    "description": "Hapat që duhet ndërmarrë në vendin e aksidentit për të shpëtuar jetë.",
    "sections": [
      {
        "title": "Veprimet në Vendin e Ngjarjes",
        "points": [
          "Siguroni vendin (vendosni trekëndëshin, ndizni dritat).",
          "Vlerësoni gjendjen e të lënduarve (vetëdija, frymëmarrja).",
          "Thirrni ndihmën (Policia 192, Urgjenca 194)."
        ]
      },
      {
        "title": "Reanimimi (CPR)",
        "points": [
          "Nëse i lënduari nuk merr frymë: 30 shtypje në gjoks dhe 2 frymëdhënie.",
          "Vazhdoni derisa të vijë ndihma mjekësore."
        ]
      },
      {
        "title": "Gjakderdhja",
        "points": [
          "Shtypni plagën direkt me fashë sterile ose rroba të pastra.",
          "Ngrini gjymtyrën e lënduar lart (nëse nuk është e thyer).",
          "Mos e hiqni fashën e parë nëse gjakoset, vendosni tjetrën mbi të."
        ]
      },
      {
        "title": "Pozita Anësore e Sigurisë",
        "points": [
          "Përdoret për të lënduarit pa vetëdije por që marrin frymë.",
          "Parandalon ngulfatjen nga gjuha ose të vjellat."
        ]
      }
    ]
  }
}', 
  '{}', 
  7, 
  true, 
  7
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
