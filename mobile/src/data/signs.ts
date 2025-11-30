import { ImageSourcePropType } from 'react-native';

export interface TrafficSign {
  id: string;
  categoryId: 'danger' | 'prohibition' | 'mandatory' | 'info';
  image: ImageSourcePropType;
  name: string;
  description: string;
}

// ---------------------------------------------------------
// IMAGE MAPPING
// ---------------------------------------------------------
export const SIGN_IMAGES: Record<string, ImageSourcePropType> = {
  // Images have been deleted by user request.
  // To restore, put images back in assets/signs/ and uncomment/restore these lines.
};

// Helper: Assign images and filter out missing ones
function assignImages(signs: TrafficSign[]) {
  return signs
    .map(sign => {
      sign.image = SIGN_IMAGES[sign.id];
      return sign;
    })
    .filter(sign => !!sign.image);
}

// ---------------------------------------------------------
// 1) DANGER SIGNS (Shenjat e Rrezikut)
// ---------------------------------------------------------
const dangerSigns: TrafficSign[] = [
  // --- FOTO 1 (1-18) ---
  { id: 'd-1', name: 'Qarkullim në të dy drejtimet', description: 'Rruga ka lëvizje në të dy senset.' },
  { id: 'd-2', name: 'Rrethrrotullim përpara', description: 'Paralajmëron hyrjen në rrethrrotullim.' },
  { id: 'd-3', name: 'Kryqëzim me përparësi të paqëndrueshme', description: 'Kryqëzim ku duhet kujdes i shtuar.' },
  { id: 'd-4', name: 'Kryqëzim në formë X', description: 'Kryqëzim i zakonshëm i dy rrugëve.' },
  { id: 'd-5', name: 'Kthesë e mprehtë majtas', description: 'Afër ka kthesë të fortë majtas.' },
  { id: 'd-6', name: 'Kthesë e mprehtë djathtas', description: 'Afër ka kthesë të fortë djathtas.' },
  { id: 'd-7', name: 'Dy kthesa – e para majtas', description: 'Segment me disa kthesa, fillon me majtas.' },
  { id: 'd-8', name: 'Dy kthesa – e para djathtas', description: 'Segment me disa kthesa, fillon me djathtas.' },
  { id: 'd-9', name: 'Ngushtim rruge në mes', description: 'Rruga ngushtohet nga të dyja anët.' },
  { id: 'd-10', name: 'Ngushtim rruge djathtas', description: 'Rruga ngushtohet në anën e djathtë.' },
  { id: 'd-11', name: 'Ngushtim rruge majtas', description: 'Rruga ngushtohet në anën e majtë.' },
  { id: 'd-12', name: 'Ngushtim asimetrik majtas', description: 'Ngushtim i fortë në anën e majtë.' },
  { id: 'd-13', name: 'Ngushtim asimetrik djathtas', description: 'Ngushtim i fortë në anën e djathtë.' },
  { id: 'd-14', name: 'Zbritje e rrezikshme (10%)', description: 'Pjerrësi e fortë zbritjeje.' },
  { id: 'd-15', name: 'Ngjitje e rrezikshme (10%)', description: 'Pjerrësi e fortë ngjitjeje.' },
  { id: 'd-16', name: 'Gropë në rrugë', description: 'Deformime dhe gropa në asfalt.' },
  { id: 'd-17', name: 'Dëmtime të vazhdueshme në rrugë', description: 'Rrugë shumë e dëmtuar.' },
  { id: 'd-18', name: 'Valëzim në rrugë', description: 'Sipërfaqe e pabarabartë.' },

  // --- FOTO 2 (19-36) ---
  { id: 'd-19', name: 'Akull / rrëshqitje', description: 'Rruga mund të jetë e ngrirë.' },
  { id: 'd-20', name: 'Rrëshqitje nga mjetet', description: 'Rrezik rrëshqitjeje për shkak të asfaltit.' },
  { id: 'd-21', name: 'Rrëshqitje gurësh nga lart', description: 'Gurë mund të bien mbi rrugë.' },
  { id: 'd-22', name: 'Gurë në rrugë', description: 'Gurë të rënë në asfalt.' },
  { id: 'd-23', name: 'Ngushtim rruge nga të dyja anët', description: 'Rruga ngushtohet.' },
  { id: 'd-24', name: 'Ngushtim rruge djathtas', description: 'Ngushtim në anën e djathtë.' },
  { id: 'd-25', name: 'Ngushtim rruge majtas', description: 'Ngushtim në anën e majtë.' },
  { id: 'd-26', name: 'Punime në rrugë', description: 'Punime të përkohshme.' },
  { id: 'd-27', name: 'Rrugë me gunga', description: 'Sipërfaqe e pabarabartë.' },
  { id: 'd-28', name: 'Erë e fortë anësore', description: 'Rrezik nga era anësore.' },
  { id: 'd-29', name: 'Ura e lëvizshme', description: 'Ura mund të hapet për anijet.' },
  { id: 'd-30', name: 'Rrezik zhytjeje në ujë', description: 'Rruga përfundon në ujë.' },
  { id: 'd-31', name: 'Semafor përpara', description: 'Zonë me semafor.' },
  { id: 'd-32', name: 'Semafor jo funksional', description: 'Mundësi semafori i prishur ose situatë trafiku.' },
  { id: 'd-33', name: 'Kalimi i këmbësorëve', description: 'Këmbësorë duke kaluar.' },
  { id: 'd-34', name: 'Këmbësorë', description: 'Zonë ku ecin këmbësorë.' },
  { id: 'd-35', name: 'Fëmijë', description: 'Afër ka shkollë ose fëmijë që kalojnë.' },
  { id: 'd-36', name: 'Autobusë / ndalesë autobusësh', description: 'Zonë ndalimi për autobusë.' },

  // --- FOTO 3 (37-54) ---
  { id: 'd-37', name: 'Aeroport / fluturime të ulëta', description: 'Avionë që kalojnë ulët.' },
  { id: 'd-38', name: 'Biçikleta', description: 'Zonë ku kalojnë biçikleta.' },
  { id: 'd-39', name: 'Kafshë të egra (dre)', description: 'Mund të kalojnë kafshë të egra.' },
  { id: 'd-40', name: 'Bagëti (lopë)', description: 'Mund të ketë kafshë shtëpiake në rrugë.' },
  { id: 'd-41', name: 'Gardh hekuri / pengesë', description: 'Pengesë ose gardh përpara.' },
  { id: 'd-42', name: 'Tren në kalim të pambrojtur', description: 'Kalim hekurudhor pa barriera.' },
  { id: 'd-43', name: 'Kalim hekurudhor i mbrojtur', description: 'Me barriera.' },
  { id: 'd-44', name: 'Pengesë me dy shirita', description: 'Distancë deri te kalimi hekurudhor.' },
  { id: 'd-45', name: 'Pengesë me tre shirita', description: 'Më afër barrierës së hekurudhës.' },
  { id: 'd-46', name: 'Pengesë me katër shirita', description: 'Shumë afër kalimit.' },
  { id: 'd-47', name: 'Rrezik rrëzimi / rrëshqitje mjetesh', description: 'Rrezik nga rrëshqitja.' },
  { id: 'd-48', name: 'Rënie gurësh / shkarje', description: 'Gurë në lëvizje.' },
  { id: 'd-49', name: 'Automjete të ngadalta / kolona', description: 'Trafik i ngadaltë.' },
  { id: 'd-50', name: 'Tunel', description: 'Tunel përpara.' },
  { id: 'd-51', name: 'Materiale të ndezshme / zjarr', description: 'Rrezik zjarri ose shpërthimi.' },
  { id: 'd-52', name: 'Kundravajtje / drejtim i gabuar', description: 'Rrezik kundërshtimi të trafikut.' },
  { id: 'd-53', name: 'Rrugë me kthesa në formë Z', description: 'Segment shumë i lakuar.' },
  { id: 'd-54', name: 'Rrezik i përgjithshëm', description: 'Rrezik i papërcaktuar.' },
].map(s => ({ ...s, categoryId: 'danger' as const, image: null as any }));

// ---------------------------------------------------------
// 2) PROHIBITION SIGNS (Shenjat e Ndalimit)
// ---------------------------------------------------------
const prohibitionSigns: TrafficSign[] = [
  // --- FOTO 4 (1-18) ---
  { id: 'p-1', name: 'Ndalim qarkullimi për të gjitha mjetet', description: 'Asnjë mjet nuk lejohet të hyjë.' },
  { id: 'p-2', name: 'Ndalim hyrjeje', description: 'Ndalim hyrjeje nga kjo anë e rrugës.' },
  { id: 'p-3', name: 'Kufizim shpejtësie 50 km/h', description: 'Shpejtësia maksimale e lejuar: 50 km/h.' },
  { id: 'p-4', name: 'STOP', description: 'Ndalim i detyrueshëm i plotë.' },
  { id: 'p-5', name: 'Jep përparësi', description: 'Jep përparësi mjeteve të tjera.' },
  { id: 'p-6', name: 'Ndalim qarkullimi për automjete', description: 'Veturat nuk lejohet të kalojnë.' },
  { id: 'p-7', name: 'Ndalim për mjetet motorike', description: 'Motoçikleta dhe motorët ndalohen.' },
  { id: 'p-8', name: 'Ndalim tejkalimi mbi 70 km/h', description: 'Ndalim tejkalimi për mjetet që tejkalojnë këtë limit.' },
  { id: 'p-9', name: 'Ndalim për biçikleta', description: 'Biçikletat nuk lejohet të futen.' },
  { id: 'p-10', name: 'Ndalim për motoçikleta me dy rrota', description: 'Motoçikletat ndalohen.' },
  { id: 'p-11', name: 'Ndalim për motorçiklo (skuterë)', description: 'Ndalohen mjetet e vogla motorike.' },
  { id: 'p-12', name: 'Ndalim kalimi për këmbësorë', description: 'Këmbësorët nuk lejohet të ecin këtu.' },
  { id: 'p-13', name: 'Ndalim për mjete me rimorkio', description: 'Makinat me rimorkio nuk lejohen.' },
  { id: 'p-14', name: 'Ndalim për kafshë të hipura', description: 'Kuajt e hipur nuk lejohen.' },
  { id: 'p-15', name: 'Ndalim për karroca dore', description: 'Karrocat e dorës nuk lejohen.' },
  { id: 'p-16', name: 'Ndalim për kamionë', description: 'Kamionët nuk lejohen të kalojnë.' },
  { id: 'p-17', name: 'Ndalim për autobusë', description: 'Autobusët nuk lejohen të hyjnë.' },
  { id: 'p-18', name: 'Ndalim ndalese (ndalim parkimi)', description: 'Ndalohet parkimi në këtë zonë.' },

  // --- FOTO 5 (19-36) ---
  { id: 'p-19', name: 'Ndalim ndalesës dhe parkimit', description: 'Nuk lejohet as ndalimi, as parkimi.' },
  { id: 'p-20', name: 'Ndalim parkimi', description: 'Parkimi është i ndaluar.' },
  { id: 'p-21', name: 'Ndalim parkimi në ditë të caktuara', description: 'Parkim i ndaluar në periudha të caktuara.' }, // Note: Image p-21 was missing in dir list, verify if present.
  { id: 'p-22', name: 'Ndalim kthimi majtas', description: 'S’lejohet kthesa majtas.' },
  { id: 'p-23', name: 'Ndalim kthimi djathtas', description: 'S’lejohet kthesa djathtas.' },
  { id: 'p-24', name: 'Ndalim rrotullimi U (U-turn)', description: 'S’lejohet kthimi me U.' },
  { id: 'p-25', name: 'Përparësi e qarkullimit në të dy drejtime', description: 'Rrugë e ngushtë ku duhet kujdes.' },
  { id: 'p-26', name: 'Ndalim tejkalimi', description: 'Të gjitha mjetet ndalohen të tejkalojnë.' },
  { id: 'p-27', name: 'Ndalim tejkalimi për kamionë', description: 'Kamionët nuk lejohen të tejkalojnë.' },
  { id: 'p-28', name: 'Ndalim qarkullimi për mjete me substanca të rrezikshme', description: 'Mjetet me ngarkesë të rrezikshme ndalohen.' },
  { id: 'p-29', name: 'Ndalim mjetesh me substanca ndezëse', description: 'Ngarkesat që mund të shpërthejnë ndalohen.' },
  { id: 'p-30', name: 'Ndalim qarkullimi për mjete të rënda', description: 'Mjete të rënda teknike (miniera/industriale) nuk lejohet të kalojnë.' },
  { id: 'p-31', name: 'Kufizim peshe totale 5.4 tonë', description: 'Mjete mbi këtë peshë nuk lejohen.' },
  { id: 'p-32', name: 'Kufizim aksial 4 tonë', description: 'Pesha për çdo bosht nuk duhet të tejkalojë 4 tonë.' },
  { id: 'p-33', name: 'Kufizim lartësie 2.8 m', description: 'Mjete më të larta se 2.8 m nuk lejohen.' },
  { id: 'p-34', name: 'Kufizim gjerësie 3.5 m', description: 'Mjete më të gjera se 3.5 m nuk lejohen.' },
  { id: 'p-35', name: 'Kufizim gjatësie 12 m', description: 'Mjete më të gjata se 12 m ndalohen.' },
  { id: 'p-36', name: 'Ndalim qarkullimi për autobusë', description: 'Autobusët nuk lejohen.' },

  // --- FOTO 6 (37-44) ---
  { id: 'p-37', name: 'Ndalim për kamionë të mëdhenj', description: 'Mjete të rënda / rimorkio të rëndë nuk hynë.' },
  { id: 'p-38', name: 'Ndalim për qerre me kafshë', description: 'Transport me kafshë i ndaluar.' },
  { id: 'p-39', name: 'Ndalim për karroca dore', description: 'Karrocat e dorës nuk lejohen.' },
  { id: 'p-40', name: 'Pikë pagese (peage)', description: 'Ndalim, pagesë e detyrueshme.' },
  { id: 'p-41', name: 'Kontroll policor', description: 'Ndalohet, kontroll i policisë.' },
  { id: 'p-42', name: 'Dogana', description: 'Ndalo, zonë doganore/kufitare.' },
  { id: 'p-43', name: 'Ndalim fotografimi', description: 'Fotografimi është i ndaluar.' },
  { id: 'p-44', name: 'Ndalim sinjalizimit me borinë', description: 'Boria (zëri) është e ndaluar.' },
].map(s => ({ ...s, categoryId: 'prohibition' as const, image: null as any }));

// ---------------------------------------------------------
// 3) MANDATORY SIGNS (Shenjat e Urdhërit)
// ---------------------------------------------------------
const mandatorySigns: TrafficSign[] = [
  // --- FOTO 7 (1-17) ---
  { id: 'm-1', name: 'Detyrim kthimi majtas', description: 'Duhet të kthehesh majtas.' },
  { id: 'm-2', name: 'Detyrim drejt përpara', description: 'Duhet të vazhdosh drejt.' },
  { id: 'm-3', name: 'Detyrim kthimi djathtas', description: 'Duhet të kthehesh djathtas.' },
  { id: 'm-4', name: 'Detyrim kthimi majtas përpara', description: 'Trase e detyrueshme majtas.' },
  { id: 'm-5', name: 'Detyrim kthimi U (U-turn)', description: 'Detyrim kthimi në kah të kundërt.' },
  { id: 'm-6', name: 'Detyrim drejt ose djathtas', description: 'Mund të shkosh drejt ose djathtas.' },
  { id: 'm-7', name: 'Detyrim drejt ose majtas', description: 'Mund të shkosh drejt ose majtas.' },
  { id: 'm-8', name: 'Detyrim kthimi djathtas pas kryqëzimit', description: 'Drejt e më pas djathtas.' },
  { id: 'm-9', name: 'Detyrim vijimi djathtas', description: 'Drejtim i detyrueshëm djathtas.' },
  { id: 'm-10', name: 'Detyrim vijimi majtas', description: 'Drejtim i detyrueshëm majtas.' },
  { id: 'm-11', name: 'Detyrim rrethrrotullimi', description: 'Duhet të hysh në rrethrrotullim.' },
  { id: 'm-12', name: 'Pista e biçikletave', description: 'Përdoret vetëm për biçikleta.' },
  { id: 'm-13', name: 'Zonë këmbësorësh', description: 'Vetëm këmbësorë të lejuar.' },
  { id: 'm-14', name: 'Zonë këmbësorë + biçikleta', description: 'Zonë e përbashkët për këmbësorë dhe biçikleta.' },
  { id: 'm-15', name: 'Detyrim përdorimi zinxhirësh në goma', description: 'Obligim për zinxhirë në dimër.' },
  { id: 'm-16', name: 'Pista e kuajve', description: 'Zonë e dedikuar për kalërim.' },
  { id: 'm-17', name: 'Kufizim minimal shpejtësie 40 km/h', description: 'Shpejtësi e detyrueshme minimale.' },
].map(s => ({ ...s, categoryId: 'mandatory' as const, image: null as any }));

// ---------------------------------------------------------
// 4) INFO SIGNS (Shenjat Lajmëruese)
// ---------------------------------------------------------
const infoSigns: TrafficSign[] = [
  // --- FOTO 8 (1-18) ---
  { id: 'i-1', name: 'Rrugë me përparësi', description: 'Rruga ka përparësi ndaj të tjerave.' },
  { id: 'i-2', name: 'Fund i rrugës me përparësi', description: 'Mbaron përparësia.' },
  { id: 'i-3', name: 'Tabelë drejtimi / kategoritë e rrugës', description: 'Udhëzim orientues.' },
  { id: 'i-4', name: 'Drejtim i detyrueshëm përpara', description: 'Shkon vetëm drejt.' },
  { id: 'i-5', name: 'Drejtim i detyrueshëm majtas', description: 'Shkon vetëm majtas.' },
  { id: 'i-6', name: 'Përparësi ndaj trafikut që vjen përballë', description: 'Ke përparësi në rrugë të ngushtë.' },
  { id: 'i-7', name: 'Shpejtësi e rekomanduar 60 km/h', description: 'Rekomandim.' },
  { id: 'i-8', name: 'Fund i shpejtësisë së rekomanduar', description: 'Mbaron rekomandimi.' },
  { id: 'i-9', name: 'Fund i të gjitha kufizimeve', description: 'Hiqen të gjitha kufijtë e mëparshëm.' },
  { id: 'i-10', name: 'Fund i ndalimit të tejkalimit', description: 'Lejohet tejkalimi.' },
  { id: 'i-11', name: 'Fund ndalimit të tejkalimit për kamionë', description: 'Kamionët mund të tejkalojnë.' },
  { id: 'i-12', name: 'Fund ndalimit për autokolona/mjete të rënda', description: 'Lejohet qarkullimi.' },
  { id: 'i-13', name: 'Fund kufizimi shpejtësie 50', description: 'Kufiri 50 përfundon.' },
  { id: 'i-14', name: 'Fund kufizimi 50 (blu – shpejtësi minimale)', description: 'Mbaron shpejtësia minimale.' },
  { id: 'i-15', name: 'Fund pista e kuajve', description: 'Zona e kalërimit përfundon.' },
  { id: 'i-16', name: 'Fund kufizimi shpejtësie 30', description: 'Hiqet kufiri 30.' },
  { id: 'i-17', name: 'Fund zona këmbësorësh', description: 'Mbaron zona e këmbësorëve.' },
  { id: 'i-18', name: 'Ndalim bicikletash (fund i pistës)', description: 'Ndalohet më tej.' },

  // --- FOTO 9 (19-36) ---
  { id: 'i-19', name: 'Zonë këmbësorësh', description: 'Zona ku ecja ka prioritet.' },
  { id: 'i-20', name: 'Fund zone këmbësorësh', description: 'Zona përfundon.' },
  { id: 'i-21', name: 'Autostradë', description: 'Fillimi i autostradës.' },
  { id: 'i-22', name: 'Fund autostrade', description: 'Autostrada mbaron.' },
  { id: 'i-23', name: 'Ura e lëvizshme / formë harku', description: 'Struktura e veçantë e urës.' },
  { id: 'i-24', name: 'Fillim i rrugës kryesore me prioritet', description: 'Rrugë me përparësi.' },
  { id: 'i-25', name: 'Zonë pa parkim', description: 'Ndalim parkimi në zonë të gjerë.' },
  { id: 'i-26', name: 'Fund zone pa parkim', description: 'Hiqet kufizimi.' },
  { id: 'i-27', name: 'Zonë 30 km/h', description: 'Kufizim shpejtësie në zonë.' },
  { id: 'i-28', name: 'Fund zone 30 km/h', description: 'Mbaron kufizimi i zonës.' },
  { id: 'i-29', name: 'Zonë këmbësorësh (organizuese)', description: 'Zonë e posaçme ecjeje.' },
  { id: 'i-30', name: 'Fund zone këmbësorësh', description: 'Mbaron zona e posaçme.' },
  { id: 'i-31', name: 'Parkim i lejuar (P)', description: 'Parkim i lejuar.' },
  { id: 'i-32', name: 'Parkim nëntokësor / me nivel', description: 'Parkim me nivele.' },
  { id: 'i-33', name: 'Kalim këmbësorësh (zebra)', description: 'Vendkalim për këmbësorë.' },
  { id: 'i-34', name: 'Zonë lojërash për fëmijë', description: 'Kujdes fëmijët.' },
  { id: 'i-35', name: 'Kalim biçikletash', description: 'Kujdes biçikletat.' },
  { id: 'i-36', name: 'Salla sportive / ecje', description: 'Zonë për aktivitete.' },

  // --- FOTO 10 (37-51) ---
  { id: 'i-37', name: 'Spital', description: 'Ndodhet spital afër.' },
  { id: 'i-38', name: 'Policia', description: 'Stacion policor.' },
  { id: 'i-39', name: 'Ndihma e parë', description: 'Ambulancë/pikë mjekësore.' },
  { id: 'i-40', name: 'Taksi', description: 'Stacion taksish.' },
  { id: 'i-41', name: 'Karburant', description: 'Pompë benzine.' },
  { id: 'i-42', name: 'Telefon emergjence', description: 'Telefon publik.' },
  { id: 'i-43', name: 'Sinjalizim drejtimi / shtyllë orientimi', description: 'Drejtimet e mundshme.' },
  { id: 'i-44', name: 'Ujë i pijshëm / rubinet', description: 'Burim uji.' },
  { id: 'i-45', name: 'Informacion turistik', description: 'Qendër informacioni.' },
  { id: 'i-46', name: 'Restaurant', description: 'Shërbime ushqimi.' },
  { id: 'i-47', name: 'Kafe / bar', description: 'Vend pushimi.' },
  { id: 'i-48', name: 'Stacion autobusi', description: 'Vendndalje për autobus.' },
  { id: 'i-49', name: 'Aeroport', description: 'Zonë fluturimesh.' },
  { id: 'i-50', name: 'Stacion treni', description: 'Hekurudhë.' },
  { id: 'i-51', name: 'Rrugë me shumë korsi', description: 'Informim trafiku.' },
].map(s => ({ ...s, categoryId: 'info' as const, image: null as any }));

// ---------------------------------------------------------
// EXPORT
// ---------------------------------------------------------
export const ALL_SIGNS = [
  ...assignImages(dangerSigns),
  ...assignImages(prohibitionSigns),
  ...assignImages(mandatorySigns),
  ...assignImages(infoSigns),
];
