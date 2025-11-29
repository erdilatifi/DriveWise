-- Chapter 2: SHENJAT E TRAFIKUT (Expanded)
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'B', 
  'Shenjat e Trafikut', 
  'Traffic Signs', 
  'Njihuni me të gjitha llojet e shenjave të trafikut, domethënien dhe veprimin ndaj tyre.', 
  'Learn about all types of traffic signs, their meaning and how to act.', 
  '{
  "chapter": {
    "title": "Shenjat e Trafikut",
    "description": "Ky kapitull shpjegon në detaje të gjitha kategoritë e shenjave të trafikut, nga ato të rrezikut deri te sinjalizimi horizontal dhe semaforët.",
    "sections": [
      {
        "title": "Kategorizimi i Shenjave",
        "points": [
          "Shenjat e trafikut ndahen në: Shenja të rrezikut, Shenja të urdhrave të prera, dhe Shenja të lajmërimit.",
          "Përveç shenjave vertikale, kemi edhe shenjat në sipërfaqen e rrugës (horizontale) dhe sinjalizimin e ndritshëm (semaforët)."
        ]
      },
      {
        "title": "Shenjat e Rrezikut",
        "points": [
          "Forma: Trekëndësh barabrinjës me kulm lart (përveç Kryqit të Andreut). Ngjyra: Anash e kuqe, mesi i bardhë, simboli i zi.",
          "Vendosja: Zakonisht 150-250m para rrezikut jashtë vendbanimit. Në vendbanim mund të jenë më afër.",
          "Veprimi: Shoferi duhet të zvogëlojë shpejtësinë dhe të shtojë kujdesin.",
          "Shembuj kryesorë: Kthesë e rrezikshme, rrugë e rrëshqitshme, ngushtim rruge, punime në rrugë, fëmijët në rrugë, kryqi i Andreut (kalim hekurudhor)."
        ]
      },
      {
        "title": "Shenjat e Urdhrave të Prera",
        "points": [
          "Ndahen në: Shenja të ndalimit/kufizimit dhe Shenja të obligimit.",
          "Forma: Rrethore (përveç STOP - tetëkëndësh, dhe Trekëndëshi i përmbysur - jep përparësi).",
          "Shenjat e ndalimit: Rreth i kuq me simbol të zi (psh. ndalim tejkalimi, kufizim shpejtësie 50 km/h).",
          "Shenjat e obligimit: Sfond i kaltër me simbol të bardhë (psh. drejtim i obliguar, zinxhirët e borës).",
          "Vlefshmëria: Nga vendi i vendosjes deri te kryqëzimi i parë ose shenja e shfuqizimit."
        ]
      },
      {
        "title": "Shenjat e Lajmërimit",
        "points": [
          "Qëllimi: Japin informata të dobishme për rrugën, vendet, shërbimet dhe orientimin.",
          "Format: Katrore ose drejtkëndëshe. Ngjyrat ndryshojnë (e verdhë/kaltër për rrugë, e gjelbër për autostradë).",
          "Shembuj: Rrugë me përparësi kalimi, vendkalim për këmbësorë (informatë), spitali, policia, pompa e benzinës, parkingu."
        ]
      },
      {
        "title": "Semaforët (Sinjalizimi i Ndritshëm)",
        "points": [
          "Drita e kuqe: Ndalje e detyrueshme. Nuk lejohet kalimi i vijës së ndaljes.",
          "Drita e verdhë: Ndalje, përveç nëse mjeti është aq afër sa nuk mund të ndalet sigurt. Nëse është bashkë me të kuqen, paralajmëron nisjen.",
          "Drita e gjelbër: Kalim i lirë. Shoferi mund të kalojë, por duke pasur kujdes për këmbësorët gjatë kthimit.",
          "Drita e verdhë vezulluese: Semafori nuk punon ose paralajmëron kujdes të shtuar (vlen rregulla e krahut të djathtë/shenjat).",
          "Drita plotësuese (shigjeta): Lejohet kalimi vetëm në drejtimin e shigjetës së gjelbër, edhe nëse drita kryesore është e kuqe."
        ]
      },
      {
        "title": "Shenjat në Sipërfaqen e Rrugës",
        "points": [
          "Vija gjatësore e plotë: Ndalohet kalimi mbi të dhe tejkalimi.",
          "Vija gjatësore e ndërprerë: Lejohet kalimi mbi të për tejkalim, kthim ose rreshtim, nëse nuk rrezikohet trafiku.",
          "Vija e dyfishtë e kombinuar: Shoferi respekton vijën që është në anën e krahut të tij të lëvizjes.",
          "Shigjetat në rrugë: Tregojnë drejtimet e lejuara të lëvizjes në atë shirit."
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

-- Chapter 3: SINJALIZIMI I POLICIT (Expanded)
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'B', 
  'Sinjalizimi i Policit', 
  'Police Signals', 
  'Kuptimi i shenjave dhe urdhrave të policit në trafik dhe hierarkia e rregullimit.', 
  'Understanding police signals and orders in traffic and the hierarchy of regulation.', 
  '{
  "chapter": {
    "title": "Sinjalizimi i Policit",
    "description": "Urdhrat e personit të autorizuar (policit) janë supremë në trafik dhe anulojnë çdo rregull tjetër, shenjë apo semafor.",
    "sections": [
      {
        "title": "Hierarkia e Rregullimit",
        "points": [
          "1. Polici i trafikut (më i larti).",
          "2. Mjetet me përparësi kalimi / nën përcjellje.",
          "3. Semaforët.",
          "4. Shenjat e trafikut.",
          "5. Rregullat e përgjithshme (krahu i djathtë).",
          "Nëse polici ju jep shenjë ''Kalo'' edhe pse semafori është i kuq, ju duhet të kaloni."
        ]
      },
      {
        "title": "Pozita e Trupit të Policit",
        "points": [
          "Trupi anash (në profil): Do të thotë KALIM I LIRË për mjetet që vijnë nga drejtimi i krahëve të tij.",
          "Trupi me fytyrë ose shpinë: Do të thotë NDALJE e detyrueshme për mjetet që vijnë nga këto drejtime.",
          "Dora e ngritur lart (shuplaka hapur): Do të thotë NDALJE për të gjithë pjesëmarrësit në trafik (përveç atyre që tashmë janë brenda kryqëzimit, të cilët duhet ta lirojnë atë)."
        ]
      },
      {
        "title": "Lëvizjet e Duarve",
        "points": [
          "Dora e shtrirë horizontalisht: Ndalim për të gjithë ata që vijnë nga drejtimi ku prehet rruga nga dora e policit.",
          "Lëvizja e dorës lart-poshtë (shuplaka hapur): Urdhër për zvogëlimin e shpejtësisë.",
          "Rrotullimi i dorës rreth bërrylit: Urdhër për përshpejtimin e lëvizjes (kalo më shpejt).",
          "Dora e drejtuar kah një mjet i caktuar: Urdhër për atë mjet që të ndalet në vendin e caktuar."
        ]
      },
      {
        "title": "Sinjalet me Bilbil",
        "points": [
          "Një vërshëllimë e gjatë: Kërkesë për vëmendje. Të gjithë pjesëmarrësit duhet të shikojnë policin për urdhrin e radhës.",
          "Disa vërshëllima të shkurtra (njëra pas tjetrës): Dikush ka shkelur rregullat ose kërkohet ndalje e menjëhershme e dikujt."
        ]
      },
      {
        "title": "Urdhrat nga Automjeti i Policisë",
        "points": [
          "Dritat rrotulluese (blu dhe të kuqe) + Sirena: Urdhër për t''u tërhequr në skajin e djathtë dhe për t''u ndalur menjëherë.",
          "Tabela STOP POLICIA (nga mjeti në lëvizje): Mjeti që i tregohet tabela duhet të ndalet, zakonisht pas mjetit të policisë.",
          "Tejkalimi i mjetit të policisë në detyrë (me drita ndezur) është i ndaluar."
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

-- Chapter 4: RREZIQET NË TRAFIK DHE TEKNIKA E NGASJES (Expanded)
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'B', 
  'Rreziqet dhe Teknika', 
  'Risks and Driving Technique', 
  'Identifikimi i rreziqeve, menaxhimi i shpejtësisë dhe teknikat e sigurta të ngasjes në kushte të ndryshme.', 
  'Identifying risks, speed management, and safe driving techniques in various conditions.', 
  '{
  "chapter": {
    "title": "Rreziqet në Trafik dhe Teknika e Ngasjes",
    "description": "Njohja e rreziqeve është hapi i parë drejt shmangies së aksidenteve. Ky kapitull mbulon faktorët e rrezikut dhe teknikat defensive të ngasjes.",
    "sections": [
      {
        "title": "Faktorët e Rrezikut",
        "points": [
          "Faktori Njeri: Lodhja, alkooli, drogat, pagjumësia, stresi, mungesa e përvojës, përdorimi i telefonit.",
          "Faktori Mjet: Defektet në frena, goma të vjetra/të dëmtuara, drita jo-funksionale, mos-mirëmbajtja.",
          "Faktori Rrugë: Gropat, uji në rrugë (aquaplaning), kthesat e forta pa pjerrtësi, mungesa e sinjalizimit.",
          "Faktori Mjedis: Shiu, bora, akulli, mjegulla, era e fortë anësore, dielli verbues."
        ]
      },
      {
        "title": "Distanca e Sigurisë",
        "points": [
          "Rregulla e 2 sekondave: Në kushte normale, mbani një distancë kohore prej së paku 2 sekondash nga mjeti përpara. (Zgjidhni një objekt fiks, kur mjeti para kalon, numëroni 1101, 1102).",
          "Në shi/lagështi: Distanca duhet të rritet në 3-4 sekonda.",
          "Në borë/akull: Distanca duhet të rritet ndjeshëm (mbi 5-6 sekonda).",
          "Distanca e ndaljes = Rruga e reagimit (1 sekondë) + Rruga e frenimit."
        ]
      },
      {
        "title": "Parakalimi (Tejkalimi) i Sigurt",
        "points": [
          "Faza 1: Vlerësimi - A është e lejuar? A ka hapësirë? A po vjen dikush përballë? A po më tejkalon dikush mua?",
          "Faza 2: Sinjalizimi - Ndizni treguesin e majtë me kohë.",
          "Faza 3: Ekzekutimi - Rrisni shpejtësinë, dilni në shiritin e majtë, mbani distancë anësore.",
          "Faza 4: Kthimi - Ndizni treguesin e djathtë dhe kthehuni pasi ta shihni mjetin e tejkaluar në pasqyrën e brendshme.",
          "Kur ju tejkaloheni: Mbani krahun e djathtë, mos e rrisni shpejtësinë (është e ndaluar dhe e rrezikshme)."
        ]
      },
      {
        "title": "Ngasja Natën dhe në Kushte të Vështira",
        "points": [
          "Natën: Përdorni dritat e gjata kur nuk ka mjete përballë. Kaloni në të shkurtra sapo të shihni mjetin tjetër ose kur jeni pas dikujt.",
          "Mjegull: Përdorni dritat e mjegullës dhe dritat e shkurtra. MOS përdorni dritat e gjata (krijojnë mur të bardhë).",
          "Shiu i parë: Është më i rrezikshmi sepse pluhuri dhe vaji krijojnë shtresë rrëshqitëse.",
          "Aquaplaning: Kur gomat humbin kontaktin me asfaltin për shkak të ujit. Mos frenoni fort, mbani timonin drejt dhe lëshoni gazin."
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

-- Chapter 5: PAJISJET E MJETIT DHE NGARKESA (Expanded)
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'B', 
  'Pajisjet dhe Ngarkesa', 
  'Vehicle Equipment and Load', 
  'Pajisjet e obligueshme në mjet dhe rregullat për transportin e ngarkesës.', 
  'Mandatory vehicle equipment and rules for transporting loads.', 
  '{
  "chapter": {
    "title": "Pajisjet e Mjetit dhe Ngarkesa",
    "description": "Çdo mjet duhet të ketë pajisje të caktuara për siguri dhe emergjencë. Gjithashtu, ngarkesa duhet të vendoset sipas rregullave strikte.",
    "sections": [
      {
        "title": "Pajisjet e Detyrueshme (Inventari)",
        "points": [
          "Rrota rezervë: Ose seti për riparimin e gomave (shkumë/kompresor).",
          "Trekëndëshi i sigurisë: Për paralajmërim në rast defekti. (Dy trekëndësha nëse keni rimorkio).",
          "Kutia e ndihmës së parë: Duhet të jetë e plotë dhe me afat të vlefshëm.",
          "Jeleku reflektues (fluoreshent): Duhet të vishet sa herë dilni nga mjeti në rrugë jashtë vendbanimit.",
          "Litar ose bigë për tërheqje: Për raste emergjente.",
          "Zinxhirët e borës: Të obligueshëm në periudhën dimërore (15 Nëntor - 15 Mars) kur ka borë/akull."
        ]
      },
      {
        "title": "Dritat dhe Sinjalizimi i Mjetit",
        "points": [
          "Dritat e përparme: Pozicion (të bardha), të shkurtra (për ndriçim 40-80m), të gjata (për ndriçim >100m).",
          "Dritat e pasme: Pozicion (të kuqe), Stop dritat (të kuqe të forta kur frenoni), drita e targës.",
          "Treguesit e drejtimit: Të verdhë, duhet të pulsojnë në të gjitha anët.",
          "Dritat e mjegullës: Prapa (e obligueshme, e kuqe), Para (opsionale, e bardhë/verdhë)."
        ]
      },
      {
        "title": "Rregullat për Ngarkesën",
        "points": [
          "Stabiliteti: Ngarkesa duhet të jetë e lidhur mirë që të mos lëvizë, të mos bjerë dhe të mos bëjë zhurmë.",
          "Dukshmëria: Nuk guxon të pengojë pamjen e shoferit, as të mbulojë dritat apo targat.",
          "Përmasat: Nuk duhet të kalojë gjerësinë e mjetit më shumë se kufijtë e lejuar. Përpara mund të kalojë max 1m, prapa mund të kalojë, por jo më shumë se 1/6 e gjatësisë.",
          "Shënjimi: Nëse ngarkesa kalon më shumë se 1m prapa mjetit, duhet të shënohet me tabelë katrore/pëlhurë të kuqe (ditën) ose dritë të kuqe (natën)."
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

-- Chapter 6: NDËRTIMI DHE FUNKSIONIMI I MJETIT (Expanded)
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'B', 
  'Mekanika e Mjetit', 
  'Vehicle Mechanics', 
  'Njohuri themelore për funksionimin e motorit, sistemeve të sigurisë dhe mirëmbajtjes.', 
  'Basic knowledge of engine operation, safety systems, and maintenance.', 
  '{
  "chapter": {
    "title": "Ndërtimi dhe Funksionimi i Mjetit",
    "description": "Shoferi duhet të njohë bazat e funksionimit të mjetit për të vërejtur defektet dhe për të mirëmbajtur sigurinë.",
    "sections": [
      {
        "title": "Motori dhe Sistemet Përcjellëse",
        "points": [
          "Motori: Shndërron energjinë e karburantit në lëvizje. Kontrolloni rregullisht nivelin e vajit.",
          "Sistemi i ftohjes: Parandalon mbinxehjen. Përdor lëngun antifriz. Nëse temperatura rritet në të kuqe, ndaloni menjëherë.",
          "Sistemi i shkarkimit (Auspuhu): Largon gazrat dhe zhurmën. Tymi i zi/kaltër tregon defekt.",
          "Transmisioni: Tufa (Kuponi) dhe ndërruesi i shpejtësive bartin fuqinë te rrotat."
        ]
      },
      {
        "title": "Sistemi i Frenimit",
        "points": [
          "Freni i punës (Këmba): Vepron hidraulikisht në të gjitha rrotat. Duhet të reagojë menjëherë.",
          "Freni i dorës (Parkimit): Vepron mekanikisht (me sajla) zakonisht në rrotat e pasme. Mban mjetin të ndalur.",
          "ABS (Anti-lock Braking System): Parandalon bllokimin e rrotave gjatë frenimit të fortë, duke lejuar manovrimin me timon.",
          "Lëngu i frenave: Duhet kontrolluar dhe ndërruar sipas udhëzimeve të prodhuesit."
        ]
      },
      {
        "title": "Gomat (Pneumatikët)",
        "points": [
          "Presioni: Gomat e shfryra rrisin konsumin dhe dëmtohen. Gomat e fryra tepër humbin stabilitetin.",
          "Thellësia e vijave: Minimalisht 1.6mm për gomat e verës dhe 4mm për gomat e dimrit.",
          "Konsumimi: Gomat vjetërohen edhe nëse nuk voziten (plasritja). Rekomandohet ndërrimi çdo 5-6 vjet."
        ]
      },
      {
        "title": "Paneli i Instrumenteve (Kroskoti)",
        "points": [
          "Dritat e KUQE (Vaji, Akumulatori, Temperatura, Frenat): RREZIK! Ndaloni menjëherë dhe fikni motorin.",
          "Dritat e VERDHA (Motor check, ABS, ESP, Gomat, Karburanti): PARALAJMËRIM! Mund të vazhdoni me kujdes por kërkohet kontroll në servis.",
          "Dritat e KALTRA/GJELBRA: Informacion (Dritat e gjata, shkurtra, treguesit)."
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

-- Chapter 7: NDIHMA E PARË (Expanded)
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'B', 
  'Ndihma e Parë', 
  'First Aid', 
  'Veprimet esenciale emergjente për të shpëtuar jetë në rast aksidenti.', 
  'Essential emergency actions to save lives in case of an accident.', 
  '{
  "chapter": {
    "title": "Ndihma e Parë",
    "description": "Minutat e para pas aksidentit janë vendimtare. Ky kapitull mëson hapat bazë të shpëtimit të jetës.",
    "sections": [
      {
        "title": "Hapat e Parë (Vargu i Shpëtimit)",
        "points": [
          "1. Sigurimi i vendit: Ndizni dritat vezulluese, vendosni jelekun, vendosni trekëndëshin e sigurisë.",
          "2. Vlerësimi i situatës: A ka rrezik zjarri? Sa të lënduar janë? A janë të vetëdijshëm?",
          "3. Thirrja e ndihmës: Telefononi 192 (Policia) ose 194 (Urgjenca). Tregoni vendin e saktë dhe numrin e të lënduarve.",
          "4. Dhënia e ndihmës: Filloni me ata që janë në rrezik jete (nuk marrin frymë, gjakderdhje e madhe)."
        ]
      },
      {
        "title": "Reanimimi Kardio-Pulmonar (CPR)",
        "points": [
          "Kontrolli: A reagon? A merr frymë? (Shiko, Dëgjo, Ndjej).",
          "Nëse NUK merr frymë: Filloni shtypjet në gjoks. Pika: Mesi i gjoksit.",
          "Ritmi: 30 shtypje dhe 2 frymëdhënie artificiale. Thellësia 5-6 cm.",
          "Vazhdoni pa ndërprerje derisa të vijë mjeku ose viktima të fillojë të marrë frymë."
        ]
      },
      {
        "title": "Ndalja e Gjakderdhjes",
        "points": [
          "Shtypja direkte: Vendosni garzë sterile (ose rrobë të pastër) mbi plagë dhe shtypni fort me dorë.",
          "Fashimi: Lidhni plagën shtrëngueshëm. Nëse gjaku depërton, mos e hiqni fashën e parë, vendosni tjetrën mbi të.",
          "Ngritja e gjymtyrës: Nëse është dora/këmba, ngriteni lart për të zvogëluar rrjedhjen (nëse nuk ka thyerje)."
        ]
      },
      {
        "title": "Pozita Anësore e Sigurisë",
        "points": [
          "Për kë? Për të lënduarit pa vetëdije por që marrin frymë.",
          "Qëllimi: Të parandalojë ngulfatjen nga gjuha (që bie prapa) ose nga të vjellat.",
          "Mënyra: Kthejeni viktimën në krah, koka e mbështetur në dorë, goja e drejtuar poshtë."
        ]
      },
      {
        "title": "Gjendja e Shokut",
        "points": [
          "Simptomat: Lëkurë e zbehtë/ftohtë, djersë, frymëmarrje e shpejtë, puls i dobët.",
          "Veprimi: Shtrijeni viktimën, ngritni këmbët lart (autotransfuzion), mbulojeni që të ngrohet, ftoni ndihmë."
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

-- Chapter 8: RREGULLAT PLOTËSUESE DHE ADMINISTRIMI (Expanded)
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'B', 
  'Rregullat Plotësuese', 
  'Additional Rules', 
  'Procedurat administrative, patentë shoferi, regjistrimi dhe masat ndëshkimore.', 
  'Administrative procedures, driving license, registration, and punitive measures.', 
  '{
  "chapter": {
    "title": "Rregullat Plotësuese dhe Administrimi",
    "description": "Trafiku rregullohet edhe me norma administrative. Këtu mësoni për patentën, regjistrimin dhe përgjegjësitë ligjore.",
    "sections": [
      {
        "title": "Patentë Shoferi",
        "points": [
          "Kategoria B: Për mjete deri në 3500kg dhe max 8 ulëse (+ shoferi).",
          "Vlefshmëria: Patenta B vlen 10 vjet (për shoferët amatorë nën 65 vjeç).",
          "Shoferi Fillestar: Konsiderohet personi në 2 vitet e para pas marrjes së patentës. Ka kufizime më të rrepta.",
          "Pikët negative: Hiqen për shkelje të rënda. Nëse arrini maksimumin e pikëve, patenta ju merret."
        ]
      },
      {
        "title": "Kufizimet e Shpejtësisë për Shoferin Fillestar",
        "points": [
          "Nuk lejohet të ngasë me shpejtësi më të madhe se:",
          "110 km/h në autostradë (normalja 130).",
          "90 km/h në motoudhë (normalja 110).",
          "80 km/h në rrugë nacionale (normalja 100).",
          "70 km/h në rrugë të tjera (normalja 80)."
        ]
      },
      {
        "title": "Alkooli dhe Drogat",
        "points": [
          "Për shoferët fillestarë dhe profesionistë: Toleranca është ZERO (0.00 g/kg).",
          "Për shoferët e tjerë (amatorë >2 vjet përvojë): Kufiri është 0.50 g/kg (promila).",
          "Ngasja nën ndikimin e drogave është vepër penale dhe dënohet rëndë."
        ]
      },
      {
        "title": "Dokumentet e Mjetit",
        "points": [
          "Certifikata e Regjistrimit (Libreza): Vërteton pronësinë dhe të dhënat teknike. Duhet mbajtur në mjet.",
          "Polica e Sigurimit: E detyrueshme (TPL) për të mbuluar dëmet ndaj palëve të treta.",
          "Kontrolli Teknik: Bëhet çdo vit për mjetet më të vjetra se 3 vjet (ose sipas ligjit në fuqi)."
        ]
      },
      {
        "title": "Veprimet në Rast Aksidenti",
        "points": [
          "Dëme vetëm materiale: Plotësoni ''Raportin Evropian të Aksidenteve'' nëse pajtoheni. Largoni mjetet për të liruar rrugën.",
          "Me të lënduar: MOS i lëvizni mjetet. Thirrni policinë dhe ndihmën e shpejtë. Ofroni ndihmën e parë.",
          "Ikja nga vendi i ngjarjes: Është vepër e rëndë penale."
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

-- Chapter 9: EKO-NGASJA DHE MJEDISI (Expanded)
INSERT INTO "study_materials" ("category", "title_sq", "title_en", "description_sq", "description_en", "content_sq", "content_en", "order_index", "is_published", "chapter_id") 
VALUES (
  'B', 
  'Eko-Ngasja', 
  'Eco-Driving', 
  'Teknikat për mbrojtjen e mjedisit dhe ngasjen ekonomike.', 
  'Techniques for environmental protection and economical driving.', 
  '{
  "chapter": {
    "title": "Eko-Ngasja dhe Mjedisi",
    "description": "Ngasja inteligjente kursen para, karburant dhe mbron mjedisin nga ndotja. Mësoni teknikat moderne të drejtimit.",
    "sections": [
      {
        "title": "Parimet Bazë të Eko-Ngasjes",
        "points": [
          "Ndërrimi i shpejtësive (marshave): Ndërroni shpejtësitë herët, rreth 2000-2500 rrotullime/minutë.",
          "Shpejtësia konstante: Mbani shpejtësi të njëtrajtshme. Frenimet dhe nxitimet e shpeshta rrisin konsumin.",
          "Parashikimi: Shikoni larg përpara. Nëse semafori është i kuq, hiqni këmbën nga gazi herët dhe lejoni mjetin të shkojë me inerci.",
          "Frenimi me motor: Përdorni motorin për të ngadalësuar (duke zbritur marshet) në vend të frenave kur është e mundur (kursen frena dhe karburant)."
        ]
      },
      {
        "title": "Mirëmbajtja dhe Konsumi",
        "points": [
          "Gomat: Presioni i ulët rrit fërkimin dhe konsumin e karburantit. Kontrolloni presionin një herë në muaj.",
          "Servisimi: Filtrat e bllokuar të ajrit, vajrat e vjetra dhe kandele të prishura rrisin ndotjen dhe harxhimet.",
          "Klimatizimi: Përdorimi i klimës rrit konsumin. Në shpejtësi të vogla hapni dritaret, në të mëdha përdorni klimën (por me masë)."
        ]
      },
      {
        "title": "Aerodinamika dhe Pesha",
        "points": [
          "Rezistenca e ajrit: Dritaret e hapura në autostradë rrisin rezistencën. Mbani dritaret mbyllur në shpejtësi.",
          "Bagazhi i çatisë: Hiqni mbajtësit e skive/biçikletave kur nuk i përdorni. Ato rrisin ndjeshëm konsumin.",
          "Pesha e tepërt: Mos mbani gjëra të panevojshme në bagazh. Çdo 100kg shtesë rrit konsumin."
        ]
      },
      {
        "title": "Mbrojtja e Mjedisit",
        "points": [
          "Ndotja e ajrit: Gazrat e motorit dëmtojnë shëndetin. Fikni motorin gjatë pritjeve të gjata (>1 minutë).",
          "Ndotja akustike: Mos përdorni borinë pa nevojë. Mos bëni xhiro të vrullshme të motorit në vendbanime.",
          "Mbeturinat: Mos hidhni kurrë mbeturina, vajra apo lëngje makinash në natyrë ose kanalizim."
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
