-- Update Category C to include CE content in Chapter 4 (Load Safety) and add new Chapter 6
-- We will update the existing Chapter 4 content to mention trailers and add a new Chapter 6 for specific CE rules.

-- Update Chapter 4 (Category C) - ENRICHED
UPDATE "study_materials"
SET "content_sq" = '{
  "chapter": {
    "title": "Faktorët e Sigurisë dhe Ngarkimi (Përfshirë CE)",
    "description": "Sigurimi i ngarkesës është vital për sigurinë rrugore, sidomos kur tërhiqen rimorkio (Kategoria CE).",
    "sections": [
      {
        "title": "Sigurimi i Ngarkesës",
        "points": [
          "Ngarkesa nuk guxon të lëvizë, të bjerë ose të shkaktojë zhurmë gjatë frenimit të vrullshëm ose kthesave.",
          "Forcat inerciale: Gjatë frenimit, ngarkesa tenton të lëvizë përpara me një forcë sa 0.8 e peshës së saj. Gjatë kthesave, forca anësore është 0.5 e peshës.",
          "Përdorimi i rripave shtrëngues (gurtneve): Duhet të jenë të atestuar dhe pa dëmtime. Këndi i lidhjes është kritik për efikasitetin.",
          "Shpërndarja: Pesha duhet të shpërndahet në mënyrë të barabartë. Mbingarkimi i boshtit të pasmë të kokës tërheqëse e bën timonin të pasigurt.",
          "Nëse ngarkesa kalon më shumë se 1m prapa, duhet të shënohet me tabelë katrore (kuqe-bardhë) ose dritë të kuqe."
        ]
      },
      {
        "title": "Transporti i Materieve të Rrezikshme (ADR)",
        "points": [
          "Kërkon certifikim të veçantë ADR për shoferin dhe mjetin.",
          "Mjeti duhet të shënohet me tabela portokalli (para dhe prapa). Numrat në tabelë tregojnë llojin e rrezikut (lart) dhe kodin e lëndës (poshtë).",
          "Pajisjet shtesë ADR: Maska kundër gazit, lopata, dorëza mbrojtëse, lëngu për shpëlarje të syve.",
          "Shoferi duhet të njohë procedurat emergjente në rast rrjedhjeje: Sigurimi i zonës, mos-pirja e duhanit, lajmërimi i zjarrfikësve."
        ]
      },
      {
        "title": "Pajisjet e Sigurisë",
        "points": [
          "Kamionët duhet të kenë: Fikës zjarri (6kg+ për mjetet e rënda), pyka sigurie (të paktën dy), trekëndësh sigurie (2 copë për rimorkio), jelek reflektues.",
          "Kufizuesi i shpejtësisë: I detyrueshëm për mjetet mbi 3.5 tonë (90 km/h).",
          "Pasqyrat shtesë: Pasqyra e rampës (për të parë afër rrotës së parë) dhe pasqyra e trotuarit janë obligative për të eliminuar këndet e vdekura."
        ]
      }
    ]
  }
}'
WHERE category = 'C' AND title_sq LIKE '%Faktorët e Sigurisë%';

-- Insert New Chapter 6 for Category C (Specific for CE - Trailers)
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'C', 
  'Mjetet e Bashkëngjitura (CE)', 
  'Trailers and Combinations (CE)', 
  'Rregullat dhe teknikat specifike për drejtimin e kamionit me rimorkio (CE).', 
  'Specific rules and techniques for driving truck with trailer (CE).', 
  '{
  "chapter": {
    "title": "Mjetet e Bashkëngjitura (Kategoria CE)",
    "description": "Drejtimi i një bashkësie mjetesh kërkon njohuri shtesë për dinamikën, lidhjen dhe manovrimin.",
    "sections": [
      {
        "title": "Lidhja e Mjetit Tërheqës me Rimorkion",
        "points": [
          "Procedura e lidhjes: Afrimi i kujdesshëm, kontrolli i lartësisë së rimorkios, kyçja e ''shalisë'' (për gjysmë-rimorkio) ose ''grep-it'' (për rimorkio klasike).",
          "Lidhjet pneumatike: Lidhja e zorrëve të ajrit (e kuqe - furnizim, e verdhë - komandim). Gabimi këtu mund të bllokojë frenat.",
          "Lidhjet elektrike: Kabllot për drita dhe ABS/EBS. Kontrolli i funksionimit pas lidhjes është i detyrueshëm.",
          "Këmbët mbështetëse: Duhet të ngrihen plotësisht pas lidhjes."
        ]
      },
      {
        "title": "Dinamika e Ngarjes me Rimorkio",
        "points": [
          "Efekti i ''prerjes së kthesës'': Rrotat e rimorkios ndjekin një rrugë më të shkurtër se tërheqësi. Kthesat duhet të merren shumë gjerë.",
          "Frenimi: Rimorkio frenon pak më herët se koka tërheqëse për të mbajtur bashkësinë të shtrirë (efekti ''tërheqës'').",
          "Lëvizja prapa (Rikverc): Është manovra më e vështirë. Kërkon kthim të timonit në drejtim të kundërt nga ai që dëshironi të shkojë rimorkioja.",
          "Efekti ''Jackknife'' (Thika): Në rrugë të rrëshqitshme, nëse koka tërheqëse frenon fort dhe rimorkio jo, ajo mund ta shtyjë kokën anash duke shkaktuar palosje."
        ]
      },
      {
        "title": "Dimensionet CE",
        "points": [
          "Gjatësia maksimale për kamion me rimorkio: 18.75 metra.",
          "Gjatësia maksimale për kokë + gjysmërimorkio: 16.50 metra.",
          "Masa maksimale e lejuar: Zakonisht 40 tonë për transport ndërkombëtar (deri 44 tonë për transport të kombinuar/kontejerë)."
        ]
      }
    ]
  }
}', 
  '{}', 
  6, 
  true, 
  25
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

-- Update Category D to include DE content in Chapter 4 and add new Chapter 5
-- Enriched Chapter 4 for D
UPDATE "study_materials"
SET "content_sq" = '{
  "chapter": {
    "title": "Dimensionet dhe Dinamika e Autobusit (Përfshirë DE)",
    "description": "Drejtimi i autobusit ndryshon rrënjësisht nga vetura për shkak të gjatësisë, peshës dhe inercisë, veçanërisht me rimorkio.",
    "sections": [
      {
        "title": "Marrja e Kthesave",
        "points": [
          "Kthesat e ngushta: Duhet të merren gjerë (nga jashtë brenda) sepse rrotat e pasme presin kthesën. Me rimorkio (DE), kjo distancë rritet ndjeshëm.",
          "Kujdes nga ''bishti'': Pjesa e pasme e autobusit (sbalco) mund të dalë jashtë korsisë deri në 1-1.5m gjatë kthesave të forta, duke rrezikuar këmbësorët ose mjetet anash.",
          "Qendra e rëndesës: Është e lartë. Shpejtësia në kthesa duhet të jetë e ulët për të shmangur rrokullisjen."
        ]
      },
      {
        "title": "Frenimi dhe Distanca",
        "points": [
          "Inercia: Një autobus i mbushur (18-24 ton) kërkon distancë shumë më të madhe frenimi.",
          "Frenat me ajër: Kanë vonesë prej 0.4-0.6 sekonda në reagim. Kjo duhet llogaritur në distancën e sigurisë.",
          "Retarderi/Intarderi: Përdoret detyrimisht në teposhtëze për të ruajtur frenat e shërbimit nga mbinxehja (fading).",
          "ABS/ASR: Ndihmojnë në ruajtjen e drejtimit gjatë frenimit emergjent dhe nisjes në rrugë të rrëshqitshme."
        ]
      },
      {
        "title": "Këndet e Vdekura",
        "points": [
          "Autobusi ka kënde të mëdha të vdekura, sidomos prapa dhe anash poshtë.",
          "Pasqyrat: Kontrolli i pasqyrave duhet të jetë i vazhdueshëm (çdo 5-8 sekonda).",
          "Kujdes i veçantë për fëmijët afër rrotave gjatë nisjes nga stacioni."
        ]
      }
    ]
  }
}'
WHERE category = 'D' AND title_sq LIKE '%Dinamika e Mjetit%';

-- Insert New Chapter 5 for Category D (Specific for DE - Bus with Trailer)
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'D', 
  'Autobusët me Rimorkio (DE)', 
  'Buses with Trailers (DE)', 
  'Rregullat specifike për kategorinë DE dhe autobusët nyjorë.', 
  'Specific rules for category DE and articulated buses.', 
  '{
  "chapter": {
    "title": "Autobusët me Rimorkio dhe Nyjorë (Kategoria DE)",
    "description": "Transporti i udhëtarëve me mjete të përbëra kërkon aftësi të larta drejtimi.",
    "sections": [
      {
        "title": "Kategoria DE",
        "points": [
          "Përfshin: Autobus (D) + Rimorkio mbi 750 kg.",
          "Përdorimi: Zakonisht për transport bagazhesh shtesë në linja të gjata turistike (psh. rimorkio për ski/biçikleta).",
          "Kufizimi i shpejtësisë: Shpesh më i ulët se autobusi i vetëm (zakonisht 80 km/h në autostradë).",
          "Ndalohet transporti i personave në rimorkio."
        ]
      },
      {
        "title": "Autobusët Nyjorë (Harmonika)",
        "points": [
          "Konsiderohen si një mjet i vetëm (Kategoria D mjafton), por dinamika është e ngjashme me DE.",
          "Gjatësia: Mund të arrijë deri në 18.75 metra.",
          "Manovrimi: Pjesa e pasme ndjek kokën, por duhet kujdes i shtuar në kthesa urbane dhe rrethrrotullime.",
          "Sistemi kundër palosjes: Kanë mekanizma hidraulikë/elektronikë në nyje për të parandaluar palosjen e pakontrolluar."
        ]
      },
      {
        "title": "Lidhja dhe Siguria",
        "points": [
          "Kontrolli i lidhjes: Sigurohuni që gjilpëra është kyçur dhe siguruar.",
          "Lidhjet e dritave: Të gjitha dritat e rimorkios (stop, sinjale, pozicion) duhet të punojnë.",
          "Stabiliteti: Rimorkio mund të bëjë lëvizje gjarpërore (snaking) në shpejtësi të mëdha ose nëse është ngarkuar keq (pesha duhet të jetë poshtë dhe mbi bosht)."
        ]
      }
    ]
  }
}', 
  '{}', 
  5, 
  true, 
  14
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

-- Enrich Category A (Motorcycle) - Updating existing chapters with MUCH MORE detail
UPDATE "study_materials"
SET "content_sq" = '{
  "chapter": {
    "title": "Hyrje në Kategorinë A",
    "description": "Drejtimi i motoçikletës kërkon shkathtësi të veçanta dhe njohuri të thella për sigurinë, pasi motoçiklistët janë pjesëmarrësit më të rrezikuar në trafik.",
    "sections": [
      {
        "title": "Nënkategoritë e Lejes",
        "points": [
          "Kategoria AM: Ciklomotorë (Moped) deri në 50cc dhe shpejtësi maksimale 45 km/h. Mosha minimale 16 vjeç. Nuk lejohet në autostradë.",
          "Kategoria A1: Motoçikleta të lehta deri në 125cc, fuqi max 11kW, raporti fuqi/peshë max 0.1 kW/kg. Mosha minimale 18 vjeç.",
          "Kategoria A2: Motoçikleta me fuqi deri në 35kW, raporti fuqi/peshë max 0.2 kW/kg. Mosha minimale 18 vjeç.",
          "Kategoria A: Motoçikleta pa kufizim fuqie. Mosha minimale 24 vjeç (ose 20 vjeç nëse keni 2 vjet përvojë në A2). Ju lejon të drejtoni çdo lloj motoçiklete."
        ]
      },
      {
        "title": "Pajisjet Mbrojtëse (Detyrim dhe Rekomandim)",
        "points": [
          "Helmeta (Kaska): E DETYRUESHME për shoferin dhe pasagjerin. Duhet të jetë e homologuar (ECE 22.05/06), e masës së duhur dhe gjithmonë e shtrënguar nën mjekër. Visozi duhet të jetë i pastër dhe pa gërvishtje.",
          "Xhaketa dhe Pantallonat: Duhet të jenë nga materiali rezistent (lëkurë ose tekstil teknik si Cordura) me mbrojtëse të certifikuara në supe, bërryla, shpinë dhe gjunjë. Mbrojnë nga gërvishtjet e asfaltit (road rash).",
          "Dorezat: Të domosdoshme! Mbrojnë duart nga i ftohti (që ul reagimin) dhe nga lëndimet gjatë rrëzimit (refleksi i parë është vendosja e duarve).",
          "Këpucët/Çizmet: Duhet të mbulojnë kyçin e këmbës. Atletet e thjeshta bien menjëherë gjatë aksidentit.",
          "Dukshmëria: Përdorni veshje me ngjyra të çelëta ose jelek reflektues. Ju jeni të vogël në rrugë, bëhuni të dukshëm!"
        ]
      },
      {
        "title": "Kontrolli Teknik Para Nisjes",
        "points": [
          "Gomat: Presioni i saktë është kritik për stabilitet. Vijat duhet të jenë >1mm (rekomandohet 2mm). Kontrolloni për të çara.",
          "Frenat: Testoni frenin e parë dhe të pasmë para se të niseni. Kontrolloni nivelin e lëngut.",
          "Zinxhiri: Duhet të jetë i lyer dhe me tensionin e duhur (lëvizje 2-3cm).",
          "Dritat: Dritat e shkurtra duhet të jenë gjithmonë ndezur. Kontrolloni sinjalet dhe stop-dritën."
        ]
      }
    ]
  }
}'
WHERE category = 'A' AND title_sq LIKE '%Hyrje%';

UPDATE "study_materials"
SET "content_sq" = '{
  "chapter": {
    "title": "Teknika e Ngasjes së Motoçikletës",
    "description": "Stabiliteti i motoçikletës varet tërësisht nga shoferi. Këtu mësoni si të kontrolloni mjetin në çdo situatë, fiziken e lëvizjes dhe frenimin.",
    "sections": [
      {
        "title": "Pozita në Rrugë dhe Shikimi",
        "points": [
          "Shikimi: Shikoni atje ku doni të shkoni (Target Fixation). Nëse shikoni një gropë, do të shkoni te gropa. Në kthesë, ktheni kokën dhe shikoni daljen e kthesës sa më larg.",
          "Pozita në korsi: Qëndroni në mes ose lehtësisht majtas në korsinë tuaj (gjurma e gomës së majtë të veturave). Kjo ju bën më të dukshëm në pasqyrat e veturave para dhe shmang vajin në mes të korsisë.",
          "Mbajtja e timonit: Duart duhet të jenë të relaksuara, bërrylat lehtësisht të përthyera. Mos e shtrëngoni timonin fort (shkakton lodhje dhe dridhje). Gjunjët duhet të shtrëngojnë rezervuarin."
        ]
      },
      {
        "title": "Marrja e Kthesave (Fizika)",
        "points": [
          "Ngadalësimi: Bëhet GJITHMONË para se të hyni në kthesë, kur motori është ende drejt.",
          "Kundër-drejtimi (Counter-steering): Mbi 30 km/h, për të kthyer majtas, shtyni lehtë timonin majtas (kjo e rrëzon motorin në të majtë). Për djathtas, shtyni djathtas.",
          "Pjerrësia: Trupi duhet të anojë bashkë me motoçikletën. Mos e mbani trupin drejt ndërsa motori anon.",
          "Përshpejtimi: Sapo të kaloni kulmin e kthesës (apex), filloni gazin butësisht. Kjo stabilizon motorin dhe e ngre atë.",
          "Gabimi në kthesë: Nëse hyni shpejt, MOS frenoni fort (do dilni jashtë ose rrëzoheni). Shtypni më shumë motorin poshtë dhe shikoni drejt daljes."
        ]
      },
      {
        "title": "Teknika e Frenimit",
        "points": [
          "Freni i parë: Është freni kryesor (ofron 70-90% të fuqisë ndaluese për shkak të transferimit të peshës përpara). Përdoreni me progresivitet: shtypni lehtë fillimisht, pastaj shtoni forcën.",
          "Freni i pasmë: Përdoret për stabilitet, manovrim të ngadaltë dhe në rrugë të rrëshqitshme/zhavorr. Në frenim emergjent, përdoret bashkë me të parin por kujdes nga bllokimi.",
          "Frenimi emergjent: Mbyllni gazin, shtypni të dy frenat, shtrëngoni gjunjët pas rezervuarit, mbani trupin drejt dhe shikoni përpara (jo poshtë).",
          "ABS: Nëse keni ABS dhe ndjeni pulsim në dorezë, VAZHDONI të shtypni fort. Sistemi po punon."
        ]
      }
    ]
  }
}'
WHERE category = 'A' AND title_sq LIKE '%Teknika%';

UPDATE "study_materials"
SET "content_sq" = '{
  "chapter": {
    "title": "Rreziqet Specifike për Motoçiklistë",
    "description": "Motoçiklistët janë të pambrojtur nga llamarina. Njohja e rreziqeve të padukshme dhe parashikimi i gabimeve të të tjerëve është mbijetesë.",
    "sections": [
      {
        "title": "Sipërfaqet e Rrezikshme",
        "points": [
          "Vijat e bardha (Zebrat/Sinjalizimi): Janë plastikë e lëmuar. Kur lagen, bëhen si akull. Shmangni frenimin ose animin mbi to.",
          "Kapakët e pusetave: Metalikë dhe të rrëshqitshëm. Planifikoni trajektoren t''i anashkaloni.",
          "Rëra dhe zhavorri: Kujdes në kthesa dhe kryqëzime (shpesh grumbullohen aty). Rëra vepron si sfera të vogla, humbni fërkimin menjëherë.",
          "Bitumi (Vija të zeza riparimi): Në ditë të nxehta shkrihen dhe rrëshqasin, në shi janë gjithashtu të rrezikshme."
        ]
      },
      {
        "title": "Trafiku dhe Vetëdija",
        "points": [
          "Fenomeni SMIDSY (Sorry Mate, I Didn''t See You): Vetura ju pret rrugën sepse truri i shoferit kërkon vetura/kamionë, jo motorë të vegjël. Bëni kontakt me sy, por mos u besoni.",
          "Këndi i vdekur: Mos qëndroni kurrë anash, prapa një veture. Ose kaloni shpejt, ose rrini prapa me distancë.",
          "Dyerët e hapura: Në qytet, kujdes nga veturat e parkuara. Mbani distancë 1.5m anash tyre.",
          "Era anësore: Kur parakaloni kamionë ose dilni nga tuneli, era mund t''ju shtyjë. Bëhuni gati të kundërveproni me timon."
        ]
      },
      {
        "title": "Ngasja me Pasagjer",
        "points": [
          "Përgatitja: Motorri bëhet më i rëndë, frenon më ngadalë dhe përshpejton më dobët. Rregulloni sustat (suspensionin) dhe presionin e gomave.",
          "Pasagjeri: Duhet të ketë helmetë/veshje. Duhet të ulet afër shoferit, të mbajë duart te beli i shoferit ose dorezat anësore.",
          "Në kthesa: Pasagjeri duhet të shikojë mbi supin e brendshëm të shoferit (të anojë me të). NUK duhet të anojë kundër kthesës.",
          "Ndalimi: Pasagjeri duhet të rrijë i qetë dhe të mos vendosë këmbët në tokë (këmbët në mbajtëse gjithmonë)."
        ]
      }
    ]
  }
}'
WHERE category = 'A' AND title_sq LIKE '%Rreziqet Specifike%';

-- Enrich Category C1 (Light Trucks) - Updating existing chapters with MUCH MORE detail
UPDATE "study_materials"
SET "content_sq" = '{
  "chapter": {
    "title": "Hyrje dhe Rregullat për C1 (E Zgjeruar)",
    "description": "Kategoria C1 (3.5t - 7.5t) është hyrja në botën profesionale. Kërkon njohuri teknike dhe ligjore të detajuara.",
    "sections": [
      {
        "title": "Kushtet dhe Kufizimet C1",
        "points": [
          "Përkufizimi: Mjete > 3500 kg por <= 7500 kg. Mund të kenë rimorkio të lehtë (<= 750 kg).",
          "Mosha: 18 vjeç. Kërkohet patentë B paraprakisht.",
          "Vlefshmëria: 5 vjet. Pas moshës 65 vjeçare, kontrolli mjekësor është më i shpeshtë.",
          "Dallimi nga C: C1 është më i lehtë, shpesh përdoret për distribuim lokal, autoambulanca, mjete zjarrfikëse të vogla."
        ]
      },
      {
        "title": "Tahografi për C1",
        "points": [
          "A është i detyrueshëm? PO, nëse mjeti përdoret për transport komercial të mallrave.",
          "Përjashtimet: Mjetet që përdoren për nevoja personale (jo-komerciale) nën 7.5 ton, mjetet e mirëmbajtjes rrugore, emergjencat.",
          "Rregullat bazë: 9 orë ngasje/ditë, 45 min pauzë pas 4.5 orësh. (Njëjtë si C).",
          "Përdorimi: Vendosni kartelën në slotin 1 para se të niseni. Zgjidhni ''Punë tjetër'' kur ngarkoni mallin."
        ]
      }
    ]
  }
}'
WHERE category = 'C1' AND title_sq LIKE '%Hyrje%';

UPDATE "study_materials"
SET "content_sq" = '{
  "chapter": {
    "title": "Siguria dhe Ngarkesa për C1 (E Zgjeruar)",
    "description": "Menaxhimi i peshës është kritik. Tejkalimi i 7.5 tonëve është i lehtë nëse nuk keni kujdes, dhe dënimet janë të rënda.",
    "sections": [
      {
        "title": "Llogaritja e Ngarkesës",
        "points": [
          "Masa Neto (Dobishme) = Masa Maksimale e Lejuar (7500kg) - Masa e Mjetit të Zbrazët (Tara).",
          "Shembull: Nëse kamioni bosh peshon 4000 kg, ju mund të ngarkoni vetëm 3500 kg mall.",
          "Kujdes: Pajisjet shtesë (rampa hidraulike, frigoriferi) e rrisin Tarën dhe zvogëlojnë ngarkesën e dobishme.",
          "Mbingarkesa: Dëmton gomat, sustat, rrit distancën e frenimit dhe është shkelje e rëndë ligjore."
        ]
      },
      {
        "title": "Dinamika e C1",
        "points": [
          "Qendra e rëndesës (C.G.): Mjetet C1 shpesh janë të larta (furgonë të mbyllur). Në kthesa, rreziku i përmbysjes është real.",
          "Era anësore: Sipërfaqja e madhe anësore e bën mjetin të ndjeshëm ndaj erës. Mbani timonin fort kur dilni nga tunelet ose kaloni ura.",
          "Kthimi: Edhe pse më i vogël se C, C1 ka rreze kthimi më të madhe se vetura. Kujdes nga ''shkelja'' e trotuarit me rrotën e pasme."
        ]
      }
    ]
  }
}'
WHERE category = 'C1' AND title_sq LIKE '%Siguria%';
