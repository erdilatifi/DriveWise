-- Create traffic_signs table
CREATE TABLE IF NOT EXISTS traffic_signs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('danger', 'prohibition', 'mandatory', 'info')),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE traffic_signs ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read
DROP POLICY IF EXISTS "Everyone can read traffic signs" ON traffic_signs;
CREATE POLICY "Everyone can read traffic signs" ON traffic_signs
  FOR SELECT USING (true);

-- Policy: Only admins can insert/update/delete (assuming an admin role or similar mechanism exists, or based on auth.uid() checks usually found in other tables)
-- For now, allowing authenticated users to read, and service role for full access. 
-- Adjust strictly for Admin users if 'is_admin' claim exists.
DROP POLICY IF EXISTS "Admins can insert traffic signs" ON traffic_signs;
CREATE POLICY "Admins can insert traffic signs" ON traffic_signs
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'service_role' OR (auth.jwt() ->> 'is_admin')::boolean = true);

DROP POLICY IF EXISTS "Admins can update traffic signs" ON traffic_signs;
CREATE POLICY "Admins can update traffic signs" ON traffic_signs
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'service_role' OR (auth.jwt() ->> 'is_admin')::boolean = true);

DROP POLICY IF EXISTS "Admins can delete traffic signs" ON traffic_signs;
CREATE POLICY "Admins can delete traffic signs" ON traffic_signs
  FOR DELETE USING (auth.jwt() ->> 'role' = 'service_role' OR (auth.jwt() ->> 'is_admin')::boolean = true);


-- Insert Danger Signs
INSERT INTO traffic_signs (code, category, name, description, image_url) VALUES
('d-1', 'danger', 'Qarkullim në të dy drejtimet', 'Rruga ka lëvizje në të dy senset.', 'signs/danger/1.png'),
('d-2', 'danger', 'Rrethrrotullim përpara', 'Paralajmëron hyrjen në rrethrrotullim.', 'signs/danger/2.png'),
('d-3', 'danger', 'Kryqëzim me përparësi të paqëndrueshme', 'Kryqëzim ku duhet kujdes i shtuar.', 'signs/danger/3.png'),
('d-4', 'danger', 'Kryqëzim në formë X', 'Kryqëzim i zakonshëm i dy rrugëve.', 'signs/danger/4.png'),
('d-5', 'danger', 'Kthesë e mprehtë majtas', 'Afër ka kthesë të fortë majtas.', 'signs/danger/5.png'),
('d-6', 'danger', 'Kthesë e mprehtë djathtas', 'Afër ka kthesë të fortë djathtas.', 'signs/danger/6.png'),
('d-7', 'danger', 'Dy kthesa – e para majtas', 'Segment me disa kthesa, fillon me majtas.', 'signs/danger/7.png'),
('d-8', 'danger', 'Dy kthesa – e para djathtas', 'Segment me disa kthesa, fillon me djathtas.', 'signs/danger/8.png'),
('d-9', 'danger', 'Ngushtim rruge në mes', 'Rruga ngushtohet nga të dyja anët.', 'signs/danger/9.png'),
('d-10', 'danger', 'Ngushtim rruge djathtas', 'Rruga ngushtohet në anën e djathtë.', 'signs/danger/10.png'),
('d-11', 'danger', 'Ngushtim rruge majtas', 'Rruga ngushtohet në anën e majtë.', 'signs/danger/11.png'),
('d-12', 'danger', 'Ngushtim asimetrik majtas', 'Ngushtim i fortë në anën e majtë.', 'signs/danger/12.png'),
('d-13', 'danger', 'Ngushtim asimetrik djathtas', 'Ngushtim i fortë në anën e djathtë.', 'signs/danger/13.png'),
('d-14', 'danger', 'Zbritje e rrezikshme (10%)', 'Pjerrësi e fortë zbritjeje.', 'signs/danger/14.png'),
('d-15', 'danger', 'Ngjitje e rrezikshme (10%)', 'Pjerrësi e fortë ngjitjeje.', 'signs/danger/15.png'),
('d-16', 'danger', 'Gropë në rrugë', 'Deformime dhe gropa në asfalt.', 'signs/danger/16.png'),
('d-17', 'danger', 'Dëmtime të vazhdueshme në rrugë', 'Rrugë shumë e dëmtuar.', 'signs/danger/17.png'),
('d-18', 'danger', 'Valëzim në rrugë', 'Sipërfaqe e pabarabartë.', 'signs/danger/18.png'),
('d-19', 'danger', 'Akull / rrëshqitje', 'Rruga mund të jetë e ngrirë.', 'signs/danger/19.png'),
('d-20', 'danger', 'Rrëshqitje nga mjetet', 'Rrezik rrëshqitjeje për shkak të asfaltit.', 'signs/danger/20.png'),
('d-21', 'danger', 'Rrëshqitje gurësh nga lart', 'Gurë mund të bien mbi rrugë.', 'signs/danger/21.png'),
('d-22', 'danger', 'Gurë në rrugë', 'Gurë të rënë në asfalt.', 'signs/danger/22.png'),
('d-23', 'danger', 'Ngushtim rruge nga të dyja anët', 'Rruga ngushtohet.', 'signs/danger/23.png'),
('d-24', 'danger', 'Ngushtim rruge djathtas', 'Ngushtim në anën e djathtë.', 'signs/danger/24.png'),
('d-25', 'danger', 'Ngushtim rruge majtas', 'Ngushtim në anën e majtë.', 'signs/danger/25.png'),
('d-26', 'danger', 'Punime në rrugë', 'Punime të përkohshme.', 'signs/danger/26.png'),
('d-27', 'danger', 'Rrugë me gunga', 'Sipërfaqe e pabarabartë.', 'signs/danger/27.png'),
('d-28', 'danger', 'Erë e fortë anësore', 'Rrezik nga era anësore.', 'signs/danger/28.png'),
('d-29', 'danger', 'Ura e lëvizshme', 'Ura mund të hapet për anijet.', 'signs/danger/29.png'),
('d-30', 'danger', 'Rrezik zhytjeje në ujë', 'Rruga përfundon në ujë.', 'signs/danger/30.png'),
('d-31', 'danger', 'Semafor përpara', 'Zonë me semafor.', 'signs/danger/31.png'),
('d-32', 'danger', 'Semafor jo funksional', 'Mundësi semafori i prishur ose situatë trafiku.', 'signs/danger/32.png'),
('d-33', 'danger', 'Kalimi i këmbësorëve', 'Këmbësorë duke kaluar.', 'signs/danger/33.png'),
('d-34', 'danger', 'Këmbësorë', 'Zonë ku ecin këmbësorë.', 'signs/danger/34.png'),
('d-35', 'danger', 'Fëmijë', 'Afër ka shkollë ose fëmijë që kalojnë.', 'signs/danger/35.png'),
('d-36', 'danger', 'Autobusë / ndalesë autobusësh', 'Zonë ndalimi për autobusë.', 'signs/danger/36.png'),
('d-37', 'danger', 'Aeroport / fluturime të ulëta', 'Avionë që kalojnë ulët.', 'signs/danger/37.png'),
('d-38', 'danger', 'Biçikleta', 'Zonë ku kalojnë biçikleta.', 'signs/danger/38.png'),
('d-39', 'danger', 'Kafshë të egra (dre)', 'Mund të kalojnë kafshë të egra.', 'signs/danger/39.png'),
('d-40', 'danger', 'Bagëti (lopë)', 'Mund të ketë kafshë shtëpiake në rrugë.', 'signs/danger/40.png'),
('d-41', 'danger', 'Gardh hekuri / pengesë', 'Pengesë ose gardh përpara.', 'signs/danger/41.png'),
('d-42', 'danger', 'Tren në kalim të pambrojtur', 'Kalim hekurudhor pa barriera.', 'signs/danger/42.png'),
('d-43', 'danger', 'Kalim hekurudhor i mbrojtur', 'Me barriera.', 'signs/danger/43.png'),
('d-44', 'danger', 'Pengesë me dy shirita', 'Distancë deri te kalimi hekurudhor.', 'signs/danger/44.png'),
('d-45', 'danger', 'Pengesë me tre shirita', 'Më afër barrierës së hekurudhës.', 'signs/danger/45.png'),
('d-46', 'danger', 'Pengesë me katër shirita', 'Shumë afër kalimit.', 'signs/danger/46.png'),
('d-47', 'danger', 'Rrezik rrëzimi / rrëshqitje mjetesh', 'Rrezik nga rrëshqitja.', 'signs/danger/47.png'),
('d-48', 'danger', 'Rënie gurësh / shkarje', 'Gurë në lëvizje.', 'signs/danger/48.png'),
('d-49', 'danger', 'Automjete të ngadalta / kolona', 'Trafik i ngadaltë.', 'signs/danger/49.png'),
('d-50', 'danger', 'Tunel', 'Tunel përpara.', 'signs/danger/50.png'),
('d-51', 'danger', 'Materiale të ndezshme / zjarr', 'Rrezik zjarri ose shpërthimi.', 'signs/danger/51.png'),
('d-52', 'danger', 'Kundravajtje / drejtim i gabuar', 'Rrezik kundërshtimi të trafikut.', 'signs/danger/52.png'),
('d-53', 'danger', 'Rrugë me kthesa në formë Z', 'Segment shumë i lakuar.', 'signs/danger/53.png'),
('d-54', 'danger', 'Rrezik i përgjithshëm', 'Rrezik i papërcaktuar.', 'signs/danger/54.png')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

-- Insert Prohibition Signs
INSERT INTO traffic_signs (code, category, name, description, image_url) VALUES
('p-1', 'prohibition', 'Ndalim qarkullimi për të gjitha mjetet', 'Asnjë mjet nuk lejohet të hyjë.', 'signs/prohibition/1.png'),
('p-2', 'prohibition', 'Ndalim hyrjeje', 'Ndalim hyrjeje nga kjo anë e rrugës.', 'signs/prohibition/2.png'),
('p-3', 'prohibition', 'Kufizim shpejtësie 50 km/h', 'Shpejtësia maksimale e lejuar: 50 km/h.', 'signs/prohibition/3.png'),
('p-4', 'prohibition', 'STOP', 'Ndalim i detyrueshëm i plotë.', 'signs/prohibition/4.png'),
('p-5', 'prohibition', 'Jep përparësi', 'Jep përparësi mjeteve të tjera.', 'signs/prohibition/5.png'),
('p-6', 'prohibition', 'Ndalim qarkullimi për automjete', 'Veturat nuk lejohet të kalojnë.', 'signs/prohibition/6.png'),
('p-7', 'prohibition', 'Ndalim për mjetet motorike', 'Motoçikleta dhe motorët ndalohen.', 'signs/prohibition/7.png'),
('p-8', 'prohibition', 'Ndalim tejkalimi mbi 70 km/h', 'Ndalim tejkalimi për mjetet që tejkalojnë këtë limit.', 'signs/prohibition/8.png'),
('p-9', 'prohibition', 'Ndalim për biçikleta', 'Biçikletat nuk lejohet të futen.', 'signs/prohibition/9.png'),
('p-10', 'prohibition', 'Ndalim për motoçikleta me dy rrota', 'Motoçikletat ndalohen.', 'signs/prohibition/10.png'),
('p-11', 'prohibition', 'Ndalim për motorçiklo (skuterë)', 'Ndalohen mjetet e vogla motorike.', 'signs/prohibition/11.png'),
('p-12', 'prohibition', 'Ndalim kalimi për këmbësorë', 'Këmbësorët nuk lejohet të ecin këtu.', 'signs/prohibition/12.png'),
('p-13', 'prohibition', 'Ndalim për mjete me rimorkio', 'Makinat me rimorkio nuk lejohen.', 'signs/prohibition/13.png'),
('p-14', 'prohibition', 'Ndalim për kafshë të hipura', 'Kuajt e hipur nuk lejohen.', 'signs/prohibition/14.png'),
('p-15', 'prohibition', 'Ndalim për karroca dore', 'Karrocat e dorës nuk lejohen.', 'signs/prohibition/15.png'),
('p-16', 'prohibition', 'Ndalim për kamionë', 'Kamionët nuk lejohen të kalojnë.', 'signs/prohibition/16.png'),
('p-17', 'prohibition', 'Ndalim për autobusë', 'Autobusët nuk lejohen të hyjnë.', 'signs/prohibition/17.png'),
('p-18', 'prohibition', 'Ndalim ndalese (ndalim parkimi)', 'Ndalohet parkimi në këtë zonë.', 'signs/prohibition/18.png'),
('p-19', 'prohibition', 'Ndalim ndalesës dhe parkimit', 'Nuk lejohet as ndalimi, as parkimi.', 'signs/prohibition/19.png'),
('p-20', 'prohibition', 'Ndalim parkimi', 'Parkimi është i ndaluar.', 'signs/prohibition/20.png'),
('p-21', 'prohibition', 'Ndalim parkimi në ditë të caktuara', 'Parkim i ndaluar në periudha të caktuara.', 'signs/prohibition/21.png'),
('p-22', 'prohibition', 'Ndalim kthimi majtas', 'S’lejohet kthesa majtas.', 'signs/prohibition/22.png'),
('p-23', 'prohibition', 'Ndalim kthimi djathtas', 'S’lejohet kthesa djathtas.', 'signs/prohibition/23.png'),
('p-24', 'prohibition', 'Ndalim rrotullimi U (U-turn)', 'S’lejohet kthimi me U.', 'signs/prohibition/24.png'),
('p-25', 'prohibition', 'Përparësi e qarkullimit në të dy drejtime', 'Rrugë e ngushtë ku duhet kujdes.', 'signs/prohibition/25.png'),
('p-26', 'prohibition', 'Ndalim tejkalimi', 'Të gjitha mjetet ndalohen të tejkalojnë.', 'signs/prohibition/26.png'),
('p-27', 'prohibition', 'Ndalim tejkalimi për kamionë', 'Kamionët nuk lejohen të tejkalojnë.', 'signs/prohibition/27.png'),
('p-28', 'prohibition', 'Ndalim qarkullimi për mjete me substanca të rrezikshme', 'Mjetet me ngarkesë të rrezikshme ndalohen.', 'signs/prohibition/28.png'),
('p-29', 'prohibition', 'Ndalim mjetesh me substanca ndezëse', 'Ngarkesat që mund të shpërthejnë ndalohen.', 'signs/prohibition/29.png'),
('p-30', 'prohibition', 'Ndalim qarkullimi për mjete të rënda', 'Mjete të rënda teknike (miniera/industriale) nuk lejohet të kalojnë.', 'signs/prohibition/30.png'),
('p-31', 'prohibition', 'Kufizim peshe totale 5.4 tonë', 'Mjete mbi këtë peshë nuk lejohen.', 'signs/prohibition/31.png'),
('p-32', 'prohibition', 'Kufizim aksial 4 tonë', 'Pesha për çdo bosht nuk duhet të tejkalojë 4 tonë.', 'signs/prohibition/32.png'),
('p-33', 'prohibition', 'Kufizim lartësie 2.8 m', 'Mjete më të larta se 2.8 m nuk lejohen.', 'signs/prohibition/33.png'),
('p-34', 'prohibition', 'Kufizim gjerësie 3.5 m', 'Mjete më të gjera se 3.5 m nuk lejohen.', 'signs/prohibition/34.png'),
('p-35', 'prohibition', 'Kufizim gjatësie 12 m', 'Mjete më të gjata se 12 m ndalohen.', 'signs/prohibition/35.png'),
('p-36', 'prohibition', 'Ndalim qarkullimi për autobusë', 'Autobusët nuk lejohen.', 'signs/prohibition/36.png'),
('p-37', 'prohibition', 'Ndalim për kamionë të mëdhenj', 'Mjete të rënda / rimorkio të rëndë nuk hynë.', 'signs/prohibition/37.png'),
('p-38', 'prohibition', 'Ndalim për qerre me kafshë', 'Transport me kafshë i ndaluar.', 'signs/prohibition/38.png'),
('p-39', 'prohibition', 'Ndalim për karroca dore', 'Karrocat e dorës nuk lejohen.', 'signs/prohibition/39.png'),
('p-40', 'prohibition', 'Pikë pagese (peage)', 'Ndalim, pagesë e detyrueshme.', 'signs/prohibition/40.png'),
('p-41', 'prohibition', 'Kontroll policor', 'Ndalohet, kontroll i policisë.', 'signs/prohibition/41.png'),
('p-42', 'prohibition', 'Dogana', 'Ndalo, zonë doganore/kufitare.', 'signs/prohibition/42.png'),
('p-43', 'prohibition', 'Ndalim fotografimi', 'Fotografimi është i ndaluar.', 'signs/prohibition/43.png'),
('p-44', 'prohibition', 'Ndalim sinjalizimit me borinë', 'Boria (zëri) është e ndaluar.', 'signs/prohibition/44.png')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

-- Insert Mandatory Signs
INSERT INTO traffic_signs (code, category, name, description, image_url) VALUES
('m-1', 'mandatory', 'Detyrim kthimi majtas', 'Duhet të kthehesh majtas.', 'signs/mandatory/1.png'),
('m-2', 'mandatory', 'Detyrim drejt përpara', 'Duhet të vazhdosh drejt.', 'signs/mandatory/2.png'),
('m-3', 'mandatory', 'Detyrim kthimi djathtas', 'Duhet të kthehesh djathtas.', 'signs/mandatory/3.png'),
('m-4', 'mandatory', 'Detyrim kthimi majtas përpara', 'Trase e detyrueshme majtas.', 'signs/mandatory/4.png'),
('m-5', 'mandatory', 'Detyrim kthimi U (U-turn)', 'Detyrim kthimi në kah të kundërt.', 'signs/mandatory/5.png'),
('m-6', 'mandatory', 'Detyrim drejt ose djathtas', 'Mund të shkosh drejt ose djathtas.', 'signs/mandatory/6.png'),
('m-7', 'mandatory', 'Detyrim drejt ose majtas', 'Mund të shkosh drejt ose majtas.', 'signs/mandatory/7.png'),
('m-8', 'mandatory', 'Detyrim kthimi djathtas pas kryqëzimit', 'Drejt e më pas djathtas.', 'signs/mandatory/8.png'),
('m-9', 'mandatory', 'Detyrim vijimi djathtas', 'Drejtim i detyrueshëm djathtas.', 'signs/mandatory/9.png'),
('m-10', 'mandatory', 'Detyrim vijimi majtas', 'Drejtim i detyrueshëm majtas.', 'signs/mandatory/10.png'),
('m-11', 'mandatory', 'Detyrim rrethrrotullimi', 'Duhet të hysh në rrethrrotullim.', 'signs/mandatory/11.png'),
('m-12', 'mandatory', 'Pista e biçikletave', 'Përdoret vetëm për biçikleta.', 'signs/mandatory/12.png'),
('m-13', 'mandatory', 'Zonë këmbësorësh', 'Vetëm këmbësorë të lejuar.', 'signs/mandatory/13.png'),
('m-14', 'mandatory', 'Zonë këmbësorë + biçikleta', 'Zonë e përbashkët për këmbësorë dhe biçikleta.', 'signs/mandatory/14.png'),
('m-15', 'mandatory', 'Detyrim përdorimi zinxhirësh në goma', 'Obligim për zinxhirë në dimër.', 'signs/mandatory/15.png'),
('m-16', 'mandatory', 'Pista e kuajve', 'Zonë e dedikuar për kalërim.', 'signs/mandatory/16.png'),
('m-17', 'mandatory', 'Kufizim minimal shpejtësie 40 km/h', 'Shpejtësi e detyrueshme minimale.', 'signs/mandatory/17.png')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

-- Insert Info Signs
INSERT INTO traffic_signs (code, category, name, description, image_url) VALUES
('i-1', 'info', 'Rrugë me përparësi', 'Rruga ka përparësi ndaj të tjerave.', 'signs/info/1.png'),
('i-2', 'info', 'Fund i rrugës me përparësi', 'Mbaron përparësia.', 'signs/info/2.png'),
('i-3', 'info', 'Tabelë drejtimi / kategoritë e rrugës', 'Udhëzim orientues.', 'signs/info/3.png'),
('i-4', 'info', 'Drejtim i detyrueshëm përpara', 'Shkon vetëm drejt.', 'signs/info/4.png'),
('i-5', 'info', 'Drejtim i detyrueshëm majtas', 'Shkon vetëm majtas.', 'signs/info/5.png'),
('i-6', 'info', 'Përparësi ndaj trafikut që vjen përballë', 'Ke përparësi në rrugë të ngushtë.', 'signs/info/6.png'),
('i-7', 'info', 'Shpejtësi e rekomanduar 60 km/h', 'Rekomandim.', 'signs/info/7.png'),
('i-8', 'info', 'Fund i shpejtësisë së rekomanduar', 'Mbaron rekomandimi.', 'signs/info/8.png'),
('i-9', 'info', 'Fund i të gjitha kufizimeve', 'Hiqen të gjitha kufijtë e mëparshëm.', 'signs/info/9.png'),
('i-10', 'info', 'Fund i ndalimit të tejkalimit', 'Lejohet tejkalimi.', 'signs/info/10.png'),
('i-11', 'info', 'Fund ndalimit të tejkalimit për kamionë', 'Kamionët mund të tejkalojnë.', 'signs/info/11.png'),
('i-12', 'info', 'Fund ndalimit për autokolona/mjete të rënda', 'Lejohet qarkullimi.', 'signs/info/12.png'),
('i-13', 'info', 'Fund kufizimi shpejtësie 50', 'Kufiri 50 përfundon.', 'signs/info/13.png'),
('i-14', 'info', 'Fund kufizimi 50 (blu – shpejtësi minimale)', 'Mbaron shpejtësia minimale.', 'signs/info/14.png'),
('i-15', 'info', 'Fund pista e kuajve', 'Zona e kalërimit përfundon.', 'signs/info/15.png'),
('i-16', 'info', 'Fund kufizimi shpejtësie 30', 'Hiqet kufiri 30.', 'signs/info/16.png'),
('i-17', 'info', 'Fund zona këmbësorësh', 'Mbaron zona e këmbësorëve.', 'signs/info/17.png'),
('i-18', 'info', 'Ndalim bicikletash (fund i pistës)', 'Ndalohet më tej.', 'signs/info/18.png'),
('i-19', 'info', 'Zonë këmbësorësh', 'Zona ku ecja ka prioritet.', 'signs/info/19.png'),
('i-20', 'info', 'Fund zone këmbësorësh', 'Zona përfundon.', 'signs/info/20.png'),
('i-21', 'info', 'Autostradë', 'Fillimi i autostradës.', 'signs/info/21.png'),
('i-22', 'info', 'Fund autostrade', 'Autostrada mbaron.', 'signs/info/22.png'),
('i-23', 'info', 'Ura e lëvizshme / formë harku', 'Struktura e veçantë e urës.', 'signs/info/23.png'),
('i-24', 'info', 'Fillim i rrugës kryesore me prioritet', 'Rrugë me përparësi.', 'signs/info/24.png'),
('i-25', 'info', 'Zonë pa parkim', 'Ndalim parkimi në zonë të gjerë.', 'signs/info/25.png'),
('i-26', 'info', 'Fund zone pa parkim', 'Hiqet kufizimi.', 'signs/info/26.png'),
('i-27', 'info', 'Zonë 30 km/h', 'Kufizim shpejtësie në zonë.', 'signs/info/27.png'),
('i-28', 'info', 'Fund zone 30 km/h', 'Mbaron kufizimi i zonës.', 'signs/info/28.png'),
('i-29', 'info', 'Zonë këmbësorësh (organizuese)', 'Zonë e posaçme ecjeje.', 'signs/info/29.png'),
('i-30', 'info', 'Fund zone këmbësorësh', 'Mbaron zona e posaçme.', 'signs/info/30.png'),
('i-31', 'info', 'Parkim i lejuar (P)', 'Parkim i lejuar.', 'signs/info/31.png'),
('i-32', 'info', 'Parkim nëntokësor / me nivel', 'Parkim me nivele.', 'signs/info/32.png'),
('i-33', 'info', 'Kalim këmbësorësh (zebra)', 'Vendkalim për këmbësorë.', 'signs/info/33.png'),
('i-34', 'info', 'Zonë lojërash për fëmijë', 'Kujdes fëmijët.', 'signs/info/34.png'),
('i-35', 'info', 'Kalim biçikletash', 'Kujdes biçikletat.', 'signs/info/35.png'),
('i-36', 'info', 'Salla sportive / ecje', 'Zonë për aktivitete.', 'signs/info/36.png'),
('i-37', 'info', 'Spital', 'Ndodhet spital afër.', 'signs/info/37.png'),
('i-38', 'info', 'Policia', 'Stacion policor.', 'signs/info/38.png'),
('i-39', 'info', 'Ndihma e parë', 'Ambulancë/pikë mjekësore.', 'signs/info/39.png'),
('i-40', 'info', 'Taksi', 'Stacion taksish.', 'signs/info/40.png'),
('i-41', 'info', 'Karburant', 'Pompë benzine.', 'signs/info/41.png'),
('i-42', 'info', 'Telefon emergjence', 'Telefon publik.', 'signs/info/42.png'),
('i-43', 'info', 'Sinjalizim drejtimi / shtyllë orientimi', 'Drejtimet e mundshme.', 'signs/info/43.png'),
('i-44', 'info', 'Ujë i pijshëm / rubinet', 'Burim uji.', 'signs/info/44.png'),
('i-45', 'info', 'Informacion turistik', 'Qendër informacioni.', 'signs/info/45.png'),
('i-46', 'info', 'Restaurant', 'Shërbime ushqimi.', 'signs/info/46.png'),
('i-47', 'info', 'Kafe / bar', 'Vend pushimi.', 'signs/info/47.png'),
('i-48', 'info', 'Stacion autobusi', 'Vendndalje për autobus.', 'signs/info/48.png'),
('i-49', 'info', 'Aeroport', 'Zonë fluturimesh.', 'signs/info/49.png'),
('i-50', 'info', 'Stacion treni', 'Hekurudhë.', 'signs/info/50.png'),
('i-51', 'info', 'Rrugë me shumë korsi', 'Informim trafiku.', 'signs/info/51.png')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();
