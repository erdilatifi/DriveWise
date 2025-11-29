-- Enriched Chapter 1: Hyrje dhe Përgatitja për Kategorinë A
UPDATE "study_materials"
SET "content_sq" = '{
  "chapter": {
    "title": "Hyrje dhe Përgatitja për Kategorinë A",
    "description": "Drejtimi i motoçikletës është liri, por kërkon disiplinë të hekurt. Ky kapitull mbulon patentën, pajisjet dhe kontrollin vital para nisjes.",
    "sections": [
      {
        "title": "Kategorizimi i Patentave",
        "points": [
          "AM (Moped): Deri 50cc, max 45 km/h. Mosha: 16 vjeç. Për lëvizje urbane, ndalohet në autostradë.",
          "A1 (Motoçikletë e lehtë): Deri 125cc, fuqi max 11kW. Raporti fuqi/peshë max 0.1 kW/kg. Mosha: 18 vjeç. Ideale për fillestarët.",
          "A2 (Motoçikletë e mesme): Fuqi max 35kW. Raporti fuqi/peshë max 0.2 kW/kg. Nuk lejohet të rrjedhë nga një motor me më shumë se dyfishi i fuqisë së tij. Mosha: 18 vjeç.",
          "A (Motoçikletë e rëndë): Pa kufizim fuqie. Mosha: 24 vjeç (ose 20 vjeç pas 2 vitesh përvojë me A2). Kërkon pjekuri maksimale."
        ]
      },
      {
        "title": "Pajisjet Mbrojtëse - Mburoja juaj e vetme",
        "points": [
          "Helmeta (Kaska): E vetmja pajisje ligjërisht e detyrueshme, por jo e mjaftueshme. Duhet të ketë standardin ECE 22.05 ose 22.06. Mos blini helmeta të përdorura (mund të kenë dëmtime të brendshme).",
          "Xhaketa dhe Pantallonat: Material lëkure (më i sigurt ndaj gërryerjes) ose tekstil teknik (Cordura, Gore-Tex). Mbrojtëset në supe, bërryla dhe shpinë thithin goditjen.",
          "Dorezat: Duart janë të parat që prekin tokën gjatë rrëzimit. Dorezat duhet të kenë mbrojtje në nyje (knuckles) dhe pëllëmbë të përforcuar.",
          "Çizmet: Duhet të mbulojnë kyçin e këmbës dhe të kenë shollë të fortë që nuk përdridhet. Lidhëset e këpucëve janë rrezik (mund të kapen te këmbëzat).",
          "Veshja e shiut: Motoçiklisti i lagur humb përqendrimin. Përdorni veshje papërshkueshme mbi pajisjet mbrojtëse."
        ]
      },
      {
        "title": "Kontrolli Teknik ''P.O.W.D.E.R''",
        "points": [
          "P (Petrol): A keni karburant mjaftueshëm?",
          "O (Oil): Niveli i vajit. Motorët me rrotullime të larta harxhojnë vaj.",
          "W (Water): Niveli i lëngut ftohës (për motorët me ujë).",
          "D (Damage): Kontrolloni për dëmtime fizike, plastika të liruara, pasqyra të thyera.",
          "E (Electrics): Dritat (të shkurtra/të gjata), sinjalet, borinë, stop-dritën (nga freni i dorës dhe i këmbës).",
          "R (Rubber): Presioni i gomave është kritik! Edhe 0.2 bar më pak ndikon në kthesa. Kontrolloni vijat dhe për çarje/gozhda."
        ]
      }
    ]
  }
}'
WHERE category = 'A' AND title_sq LIKE '%Hyrje%';

-- Enriched Chapter 2: Teknika e Avancuar e Ngasjes
UPDATE "study_materials"
SET "content_sq" = '{
  "chapter": {
    "title": "Teknika e Avancuar e Ngasjes",
    "description": "Të dish t''i japësh motorit do të thotë të kuptosh fizikën e tij. Mësoni kundër-drejtimin, frenimin e saktë dhe pozicionimin taktik.",
    "sections": [
      {
        "title": "Pozicionimi Taktik në Rrugë",
        "points": [
          "Pozita Dominuese: Qëndroni në 1/3 e majtë të korsisë suaj (gjurma e majtë e veturave). Kjo ju jep pamje, ju bën të dukshëm në pasqyrat e shoferit para dhe bllokon veturat që t''ju parakalojnë rrezikshëm.",
          "Shmangia e ''Mesit'': Mesi i korsisë shpesh ka vaj, naftë të derdhur dhe zhavorr. Është veçanërisht i rrezikshëm kur bie shi.",
          "Distanca e Sigurisë: Mbani të paktën 2 sekonda distancë. Motorët frenojnë fort, por shpesh shoferët prapa nuk reagojnë në kohë. Krijoni hapësirë ''shpëtimi'' para vetes."
        ]
      },
      {
        "title": "Fizika e Kthesave (Counter-steering)",
        "points": [
          "Efekti i Gjiroskopit: Mbi 30 km/h, rrotat krijojnë stabilitet. Për të kthyer, duhet të prishni këtë ekuilibër.",
          "Kundër-drejtimi: Për të shkuar MAJTAS, shtyni timonin e MAJTË përpara. Kjo e rrëzon motorin në të majtë. Për djathtas, shtyni të djathtin.",
          "Teknika ''Slow In, Fast Out'': Hyni ngadalë në kthesë, gjeni pikën e kulmit (apex), dhe përshpejtoni butësisht gjatë daljes për të stabilizuar motorin.",
          "Shikimi: Trupi shkon ku shkojnë sytë. Ktheni kokën plotësisht drejt daljes së kthesës. Mos shikoni kurrë tokën para rrotës."
        ]
      },
      {
        "title": "Frenimi Efektiv",
        "points": [
          "Shpërndarja e Peshës: Kur frenoni, pesha kalon te rrota e parë. Kjo i jep rrotës së parë 80-90% të fërkimit.",
          "Freni i Parë: Përdoreni me dy gishta. Shtypni progresivisht (si të shtrydhni një limon), mos e goditni menjëherë.",
          "Freni i Pasmë: Përdoret për stabilitet në shpejtësi të vogla, në zhavorr, ose për të ''ulur'' motorin para kthesës. Në frenim emergjent, përdoreni lehtë por kujdes se bllokohet shpejt.",
          "Frenimi në Kthesë: E RREZIKSHME! Nëse duhet të frenoni në kthesë, drejtoni motorin paksa para se të frenoni fort, ose përdorni shumë lehtë frenin e pasmë."
        ]
      }
    ]
  }
}'
WHERE category = 'A' AND title_sq LIKE '%Teknika%';

-- Enriched Chapter 3: Mbijetesa Urbane dhe Rreziqet
UPDATE "study_materials"
SET "content_sq" = '{
  "chapter": {
    "title": "Mbijetesa Urbane dhe Rreziqet",
    "description": "Qyteti është xhungël për motoçiklistët. Mësoni si të parashikoni rreziqet e padukshme dhe të mbroni veten.",
    "sections": [
      {
        "title": "Sipërfaqet e Rrezikshme",
        "points": [
          "Vijat e Bardha (Zebrat): Janë plastikë. Kur janë të thata janë ok, kur lagen bëhen akull. Asnjëherë mos frenoni fort dhe mos merrni kthesë të pjerrët mbi to.",
          "Pusetat Metalike: Janë kurthe. Në shi, ato janë jashtëzakonisht të rrëshqitshme. Planifikoni rrugën që t''i anashkaloni.",
          "Bitumi (Gjarpërinjtë e zinj): Vijat e riparimit të asfaltit. Në verë shkrihen dhe rrëshqasin, në dimër janë të lëmuara.",
          "Gjethet e Lagura: Rrezik vdekjeprurës në vjeshtë. Fshehin gropa dhe janë si sapun."
        ]
      },
      {
        "title": "Rreziqet e Trafikut",
        "points": [
          "Kthesa Majtas e Veturës: Shkaku #1 i aksidenteve. Vetura përballë jush kthehet majtas dhe ju pret rrugën. Arsyeja: Shoferi shikon, por truri i tij kërkon ''kamionë/vetura'', jo motorë. Zvogëloni shpejtësinë dhe përgatituni të frenoni.",
          "Dyerët e Hapura: Kur kaloni pranë veturave të parkuara, mbani distancë 1.5 metra (një gjerësi dere). Shikoni nëse ka njerëz brenda veturave të parkuara.",
          "Këndi i Vdekur: Mos qëndroni kurrë në pozicionin ''ora 4'' ose ''ora 8'' të një veture. Ata nuk ju shohin. Ose parakaloni shpejt, ose rrini prapa.",
          "Këmbësorët ''Zombie'': Këmbësorët me kufje/telefon që dalin papritur mes makinave. Shikoni për këmbë poshtë makinave të parkuara."
        ]
      },
      {
        "title": "Ngasja me Pasagjer",
        "points": [
          "Dinamika Ndryshon: Motori bëhet i rëndë, frenon më gjatë, përshpejton më dobët. Rregulloni dritat (që të mos verbojnë) dhe presionin e gomave.",
          "Pasagjeri i Mirë: Duhet të mbajë duart te beli i shoferit (jo te supet), të shtrëngojë gjunjët, dhe të shikojë mbi supin e brendshëm të kthesës (të anojë me motorin).",
          "Ndalimi: Pasagjeri duhet të rrijë i qetë në semafor. Lëvizjet e tij në vend numëro mund ta rrëzojnë motorin.",
          "Komunikimi: Vendosni sinjale me duar para nisjes (psh. një goditje në sup = ndalo)."
        ]
      }
    ]
  }
}'
WHERE category = 'A' AND title_sq LIKE '%Rreziqet Specifike%';

-- Add NEW Chapter 4: Mirëmbajtja dhe Situatat Emergjente
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'A', 
  'Mirëmbajtja dhe Situatat Emergjente', 
  'Maintenance and Emergencies', 
  'Mirëmbajtja e motorit dhe reagimi në situata kritike.', 
  'Motorcycle maintenance and reacting to critical situations.', 
  '{
  "chapter": {
    "title": "Mirëmbajtja dhe Situatat Emergjente",
    "description": "Një motor i mirëmbajtur ju kthen në shtëpi. Mësoni si të kujdeseni për të dhe çfarë të bëni kur gjërat shkojnë keq.",
    "sections": [
      {
        "title": "Kujdesi për Zinxhirin",
        "points": [
          "Lyerja: Duhet bërë çdo 500-1000 km, ose pas çdo shiu. Lyhet pjesa e brendshme e zinxhirit, preferohet kur zinxhiri është i ngrohtë (pas ngasjes).",
          "Tensioni: Zinxhiri duhet të ketë një lëvizje të lirë vertikale 2-3 cm. Zinxhiri i lirë mund të dalë, i shtrënguar mund të këputet ose të dëmtojë kushinetat."
        ]
      },
      {
        "title": "Gomat dhe Lëngjet",
        "points": [
          "Vjetërsia e gomave: Gomat e motorit forcohen pas 3-4 vitesh dhe humbin fërkimin edhe nëse kanë vija. Ndërrojini ato.",
          "Lëngu i frenave: Thith lagështinë nga ajri. Duhet ndërruar çdo 2 vjet. Lëngu i vjetër mund të vlojë gjatë frenimit të fortë dhe të humbni frenat."
        ]
      },
      {
        "title": "Situatat Emergjente",
        "points": [
          "Shpërthimi i gomës së parë: MË E RREZIKSHMJA. Mos frenoni! Mbani timonin fort, mbyllni gazin gradualisht dhe zhvendosni peshën prapa.",
          "Shpërthimi i gomës së pasme: Motori do të ''notojë'' (wooble). Mos frenoni fort. Mbajeni drejt dhe lejoni motorin të ngadalësohet vetë.",
          "Dridhjet e Timonit (Tank Slapper): Ndodh kur rrota e parë ngrihet lehtë dhe ulet shtrembër. MOS e luftoni timonin (e bëni më keq). Lironi duart paksa, mbyllni gazin lehtë.",
          "Rrëzimi (Low Side): Kur motori rrëshqet në kthesë. Lëshojeni motorin! Mos u mundoni ta mbani. Rrëshqisni në shpinë nëse është e mundur, me këmbët para."
        ]
      }
    ]
  }
}', 
  '{}', 
  4, 
  true, 
  43
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
