(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/drivewise/web/contexts/query-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QueryProvider",
    ()=>QueryProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function QueryProvider({ children }) {
    _s();
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "QueryProvider.useState": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000,
                        gcTime: 10 * 60 * 1000,
                        refetchOnWindowFocus: false,
                        refetchOnReconnect: false,
                        retry: 1,
                        retryDelay: {
                            "QueryProvider.useState": (attemptIndex)=>Math.min(1000 * 2 ** attemptIndex, 30000)
                        }["QueryProvider.useState"]
                    },
                    mutations: {
                        retry: 1,
                        retryDelay: {
                            "QueryProvider.useState": (attemptIndex)=>Math.min(1000 * 2 ** attemptIndex, 30000)
                        }["QueryProvider.useState"]
                    }
                }
            })
    }["QueryProvider.useState"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClient,
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/drivewise/web/contexts/query-provider.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_s(QueryProvider, "rWHGp6eSU8dAeUVnILmgvNdgQWQ=");
_c = QueryProvider;
var _c;
__turbopack_context__.k.register(_c, "QueryProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/drivewise/web/components/ui/toaster.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toaster",
    ()=>Toaster
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
"use client";
;
;
function Toaster(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toaster"], {
        // Your app is dark by design, so force dark theme
        theme: "dark",
        position: "top-right",
        closeButton: true,
        expand: false,
        duration: 3000,
        className: "toaster group",
        toastOptions: {
            classNames: {
                // Base toast surface – uses your card + border + radius tokens
                toast: "bg-card text-card-foreground border border-border rounded-[var(--radius)] shadow-lg shadow-primary/15 px-4 py-3",
                // Typography aligned with your theme
                title: "text-foreground font-semibold text-sm",
                description: "text-muted-foreground text-xs",
                // Actions keep the orange accent feel
                actionButton: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium transition-colors",
                cancelButton: "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md transition-colors",
                // Close button is subtle, not screaming
                closeButton: "text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md p-1 transition-colors"
            }
        },
        // Use Sonner's CSS variables so its internals follow your theme tokens
        style: {
            // Normal/default toast colors
            "--normal-bg": "hsl(var(--popover))",
            "--normal-border": "hsl(var(--border))",
            "--normal-text": "hsl(var(--popover-foreground))",
            // Corner radius consistent with the rest of the UI
            "--border-radius": "var(--radius)"
        },
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/drivewise/web/components/ui/toaster.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
_c = Toaster;
var _c;
__turbopack_context__.k.register(_c, "Toaster");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/drivewise/web/contexts/language-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LanguageProvider",
    ()=>LanguageProvider,
    "useLanguage",
    ()=>useLanguage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const LanguageContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
// Translation dictionary (Albanian only)
const translations = {
    // Navigation
    'nav.home': 'Ballina',
    'nav.dashboard': 'Paneli',
    'nav.materials': 'Materiale',
    'nav.tests': 'Testet',
    'nav.decisionTrainer': 'Decision Trainer',
    'nav.pricing': 'Çmimet',
    'nav.account': 'Llogaria',
    'nav.admin': 'Admin',
    'nav.login': 'Hyrje',
    'nav.logout': 'Dalje',
    'nav.getStarted': 'Fillo Tani',
    'nav.language': 'Gjuha',
    'nav.subtitle': 'Provimi i Teorisë në Kosovë',
    // Home Page
    'home.hero.badge': 'Platforma #1 e Teorisë së Drejtimit në Kosovë',
    'home.hero.title': 'Zotëro',
    'home.hero.titleAccent': 'Provimin e Teorisë së Drejtimit',
    'home.hero.description': 'Praktiko me teste provuese të plota, gjurmo përparimin tënd dhe kalo provimin me vetëbesim. Vetëm në gjuhën shqipe.',
    'home.hero.startLearning': 'Fillo Mësimin Falas',
    'home.hero.browseCategories': 'Shfleto Kategoritë',
    'home.hero.mobileComingSoon': 'Versioni mobil së shpejti në Android dhe iOS.',
    'home.hero.mobileBadge': 'Së shpejti',
    'home.hero.appStoreCta': 'Shkarko në App Store',
    'home.hero.playStoreCta': 'Merr në Google Play',
    'home.hero.newHereTitle': 'I ri këtu? Fillo me një test falas dhe një kapitull Materiale Mësimore.',
    'home.hero.newHereCtaCategory': 'Fillo testin e Kategorisë B',
    'home.hero.newHereCtaMaterials': 'Hap Materialet Mësimore',
    'home.benefit.badge': 'Praktikë për provimin real në Kosovë',
    'home.benefit.title': 'Hapa të qartë nga testi i parë deri në ditën e provimit.',
    'home.benefit.body': 'Testet provuese, rishikimi dhe Materialet Mësimore punojnë bashkë që të dish gjithmonë çfarë të bësh më pas.',
    'home.trust.badge': 'Çfarë merr me DriveWise',
    'home.trust.title': 'Çfarë zhbllokon sapo të bashkohesh.',
    'home.trust.body': 'Merr teste provuese reale, Decision Trainer, Materiale Mësimore dhe një panel personal ku ruhet sigurt i gjithë progresi yt.',
    'home.pillars.badge': 'Tre mjete që punojnë bashkë',
    'home.pillars.title': 'Praktiko, mëso nga gabimet dhe rregullo ato.',
    'home.pillars.body': 'Testet provuese tregojnë nivelin, Decision Trainer stërvit vendimet dhe analitika të dërgon te kapitujt e duhur për të mësuar.',
    'trainer.heroExplainer': 'Pyetje të shkurtra skenari që stërvisin vendimet e tua. Ndonjëherë më shumë se një përgjigje mund të jetë e saktë.',
    'pricing.currentPlanFor': 'Plani aktual për',
    'pricing.until': '· deri më',
    'plans.hero.badge': 'Plane të zgjuara për nxënës seriozë',
    'plans.hero.title': 'Zgjidh planin tënd',
    'plans.hero.subtitle': 'Fillo falas me disa teste, pastaj zhblloko Decision Trainer, materialet e plota mësimore dhe rishikimin e detajuar kur të jesh gati.',
    'plans.profilePaidPlansTitle': 'Planet e tua të paguara',
    'plans.profileExtendViaPricingCta': 'Shko te planet',
    // Features
    'features.comprehensive.title': 'Teste Gjithëpërfshirëse',
    'features.comprehensive.desc': '10 teste për kategori me pyetje të stilit të provimit real',
    'features.progress.title': 'Gjurmo Përparimin',
    'features.progress.desc': 'Analitika të avancuara për të monitoruar përmirësimin tënd',
    'features.guaranteed.title': 'Kalim i Garantuar',
    'features.guaranteed.desc': 'Metoda të provuara për të kaluar në përpjekjen e parë',
    // Materials Page
    'materials.title': 'Materiale mësimore',
    'materials.subtitle': 'Mëso teorinë e drejtimit hap pas hapi',
    'materials.searchPlaceholder': 'Kërko në këtë kapitull...',
    'materials.section.1': '1. Rregullat bazë të trafikut',
    'materials.section.2': '2. Futja në trafik & pozicionimi',
    'materials.section.3': '3. Rregullat e shpejtësisë',
    'materials.section.4': '4. Rregullat e kthimit',
    'materials.section.5': '5. Kryqëzimet',
    'materials.section.6': '6. Rrethrrotullimet',
    'materials.section.7': '7. Këmbësorët & çiklistët',
    'materials.section.8': '8. Takimi me trafik',
    'materials.section.9': '9. Parakalimi',
    'materials.section.10': '10. Kalo pengesat',
    'materials.section.11': '11. Sinjalet paralajmëruese',
    'materials.section.12': '12. Ndalimi & parkimi',
    'materials.section.13': '13. Defektet',
    'materials.readCarefully': 'Lexo me kujdes dhe lidh këto rregulla me situatat reale në trafik.',
    'materials.noResults': 'Asnjë rezultat nuk përputhet me kërkimin në këtë kapitull.',
    'materials.emptyTitle': 'Ende nuk ka materiale mësimore',
    'materials.emptySubtitle': 'Administratori nuk ka shtuar ende materiale për këtë kurs.',
    'materials.resultsForPrefix': 'Duke shfaqur rezultatet për',
    'materials.resultsForSuffix': 'në këtë kapitull',
    'materials.errorLoadFailed': 'Nuk u arrit të ngarkohen materialet',
    'materials.premiumRequiredTitle': 'Shkyç qasjen e plotë te materialet mësimore',
    'materials.premiumRequiredDescription': 'Materialet mësimore janë pjesë e planit të paguar. Me çdo plan aktiv ke qasje të plotë në të gjitha kapitujt, shpjegimet dhe figurat.',
    'materials.premiumBenefitAllChapters': 'Qasje në çdo kapitull dhe çdo shpjegim të temave.',
    'materials.premiumBenefitDeeper': 'Kupto pse përgjigjet janë të sakta që testet provuese të duken më të lehta.',
    'materials.premiumBenefitVisuals': 'Shiko të gjitha figurat dhe skemat për të memorizuar më shpejt.',
    'materials.premiumUpgradeCta': 'Shiko planet',
    // Categories
    'categories.title': 'Zgjidh Kategorinë e Patentës',
    'categories.description': 'Zgjidh llojin e patentës dhe fillo praktikën me testet tona gjithëpërfshirëse',
    'categories.startPractice': 'Fillo Praktikën',
    // Auth
    'auth.welcomeBack': 'Mirë se Erdhe Përsëri',
    'auth.signInDescription': 'Hyr për të vazhduar praktikën e teorisë së drejtimit',
    'auth.createAccount': 'Krijo Llogari',
    'auth.createAccountDescription': 'Fillo udhëtimin për të kaluar provimin e teorisë së drejtimit',
    'auth.email': 'Email',
    'auth.password': 'Fjalëkalimi',
    'auth.confirmPassword': 'Konfirmo Fjalëkalimin',
    'auth.fullName': 'Emri i Plotë',
    'auth.signIn': 'Hyr',
    'auth.signUp': 'Krijo Llogari',
    'auth.dontHaveAccount': 'Nuk ke llogari?',
    'auth.alreadyHaveAccount': 'Ke tashmë llogari?',
    'auth.backToHome': 'Kthehu në ballina',
    'auth.signingIn': 'Duke hyrë...',
    'auth.creatingAccount': 'Duke krijuar llogari...',
    'auth.logoutSuccess': 'U çkyçët me sukses.',
    'auth.logoutError': 'Gabim gjatë çkyçjes.',
    // Dashboard
    'dashboard.welcome': 'Mirë se erdhe përsëri',
    'dashboard.subtitle': 'Gjurmo përparimin dhe vazhdo të mësosh',
    'dashboard.totalTests': 'Teste Totale',
    'dashboard.avgScore': 'Rezultati Mesatar',
    'dashboard.bestScore': 'Rezultati më i Mirë',
    'dashboard.streak': 'Seria',
    'dashboard.thisWeek': 'këtë javë',
    'dashboard.lastWeek': 'javën e kaluar',
    'dashboard.personalBest': 'Rekord personal',
    'dashboard.keepGoing': 'Vazhdo kështu!',
    'dashboard.streakSubtitle': 'Seri ditore në të gjitha aktivitetet (teste dhe Decision Trainer).',
    'dashboard.days': 'ditë',
    'dashboard.weeklyProgress': 'Përparimi Javor',
    'dashboard.weeklyProgressDesc': 'Rezultatet e testeve gjatë javës së kaluar',
    'dashboard.passRate': 'Shkalla e Kalimit',
    'dashboard.passRateDesc': 'Performanca e përgjithshme',
    'dashboard.categoryPerformance': 'Performanca sipas Kategorisë',
    'dashboard.categoryPerformanceDesc': 'Teste për kategori',
    'dashboard.recentTests': 'Testet e Fundit',
    'dashboard.recentTestsDesc': 'Përpjekjet e fundit',
    'dashboard.continuelearning': 'Vazhdo Mësimin',
    'dashboard.pickUpWhere': 'Vazhdo nga ku e le',
    'dashboard.continueCategoryB': 'Vazhdo Kategorinë B',
    'dashboard.browseCategories': 'Shfleto Kategoritë',
    'dashboard.startNewCategory': 'Fillo Kategori të Re',
    'dashboard.passed': 'Kaluar',
    'dashboard.failed': 'Dështuar',
    'dashboard.weakTopicsTitle': 'Temat tuaja më të dobëta',
    'dashboard.weakTopicsSubtitle': 'Këto janë temat ku gaboni më shpesh në të gjitha testet.',
    'dashboard.testAchievementsTitle': 'Arritjet në teste',
    'dashboard.testAchievementsSubtitle': 'Momentet kryesore për t\'ju mbajtur të motivuar gjatë praktikës.',
    'dashboard.trainerProgressTitle': 'Progresi në Decision Trainer',
    'dashboard.trainerAchievementsLabel': 'Arritjet:',
    'dashboard.trainerScenarios': 'skenarë',
    'dashboard.trainerAccuracy': 'saktësi',
    'dashboard.trainerXp': 'XP',
    'dashboard.trainerBestStreak': 'Seria më e mirë',
    'dashboard.trainerCategoriesPracticed': 'Kategori të praktikuara',
    'dashboard.testHistoryTitle': 'Historia e Testeve',
    'dashboard.testHistorySubtitle': 'Shiko të gjitha testet e përfunduara dhe rishiko përgjigjet',
    'dashboard.viewHistoryCta': 'Shiko Historinë',
    'dashboard.avgScoreHighSubtitle': 'Punë e shkëlqyer!',
    'dashboard.avgScoreLowSubtitle': 'Vazhdo praktikën',
    'dashboard.emptyChart': 'Bosh',
    'dashboard.noActivity': 'Ende asnjë aktivitet',
    'dashboard.completeTests': 'Përfundo teste për të parë analitikën e progresit këtu.',
    'dashboard.strongTopicsTitle': 'Temat tuaja më të forta',
    'dashboard.panelTitle': 'Paneli',
    'dashboard.practiceWeakTopics': 'Praktiko temat e dobëta',
    'dashboard.categories': 'Kategoritë',
    // Profile
    'profile.title': 'Përmbledhja e planit & përdorimit',
    'profile.adminUnlimited': 'Admin: Keni tashmë qasje të pakufizuar në të gjitha kategoritë dhe veçoritë.',
    'profile.premiumBadge': 'Plan i paguar aktiv',
    'profile.planStatusTitle': 'Planet & përdorimi sipas kategorisë',
    'profile.expiresOnLabel': 'Skadon më:',
    'profile.daysRemaining': 'ditë të mbetura',
    'profile.freeUsageLabel': 'Përdorimi falas këtë cikël:',
    'profile.testsLabel': 'teste',
    'profile.upgradeCta': 'Fillo planin',
    'profile.extendCta': 'Zgjate / rinovo',
    'profile.previewCta': 'Menaxho përdoruesit',
    'profile.accountSettingsTitle': 'Cilësimet e llogarisë',
    'profile.accountSettingsDescription': 'Përditëso emrin e shfaqur dhe shiko email-in e llogarisë suaj DriveWise.',
    'profile.displayNameLabel': 'Emri i shfaqur',
    'profile.emailLabel': 'Email',
    'profile.emailHelp': 'Ky email përdoret për të hyrë dhe për të marrë njoftime të rëndësishme.',
    'profile.dangerZoneTitle': 'Zona e rrezikut',
    'profile.dangerZoneDescription': 'Fshini përgjithmonë llogarinë tuaj dhe të gjithë historinë e testeve, progresin e trajnerit dhe planet.',
    'profile.deleteAccountButton': 'Fshi llogarinë',
    'profile.deleteDialogTitle': 'Fshi llogarinë',
    'profile.deleteDialogDescription': 'Ky veprim nuk mund të zhbëhet. Do të fshijë përgjithmonë llogarinë tuaj DriveWise dhe të gjitha të dhënat tuaja.',
    'profile.deleteDialogConfirmLabel': 'Shkruaj DELETE me shkronja të mëdha për të konfirmuar:',
    'profile.deleteDialogCancel': 'Anulo',
    'profile.deleteDialogConfirm': 'Fshi llogarinë time',
    'profile.deleteDialogConfirming': 'Duke fshirë...',
    'profile.nameEmpty': 'Emri nuk mund të jetë bosh',
    'profile.nameUpdatedTitle': 'Emri u përditësua',
    'profile.nameUpdatedDesc': 'Emri juaj i shfaqur është përditësuar me sukses.',
    'profile.nameUpdateError': 'Nuk mund të përditësohej emri.',
    'profile.accountDeletedTitle': 'Llogaria u fshi',
    'profile.accountDeletedDesc': 'Llogaria juaj dhe të gjitha të dhënat janë fshirë.',
    'profile.accountDeleteError': 'Nuk mund të fshihej llogaria.',
    'profile.reportSubmittedTitle': 'Raporti u dërgua',
    'profile.reportSubmittedDesc': 'Faleminderit! Raporti juaj për gabimin është dërguar.',
    'profile.reportFailedTitle': 'Dërgimi dështoi',
    'profile.activePlan': 'Plan aktiv',
    'profile.freePlan': 'Plan falas',
    'profile.noActivePlans': 'Asnjë plan aktiv',
    'profile.startPlanDesc': 'Fillo një plan për të zhbllokuar të gjitha veçoritë premium.',
    'profile.usage': 'Përdorimi',
    'profile.daysLeft': 'ditë të mbetura',
    'profile.renewNow': 'Rinovo tani',
    'profile.billingOneTime': 'Statusi i faturimit: Pagesë e njëhershme',
    'profile.noAutoRenewDesc': 'Nuk ka rinovim automatik. Nuk do të tarifoheni sërish automatikisht.',
    'profile.supportFeedback': 'Mbështetje & Reagime',
    'profile.reportBug': 'Raporto një problem',
    'profile.reportBugDesc': 'Gjetët diçka që nuk punon mirë? Na tregoni dhe ne do ta shqyrtojmë.',
    // Admin
    'admin.searchPlaceholder': 'Kërko sipas email-it ose emrit...',
    'admin.userManagement': 'Menaxhimi i Përdoruesve',
    'admin.manageUsersDesc': 'Menaxho përdoruesit e regjistruar',
    'admin.allRoles': 'Të gjitha rolet',
    'admin.students': 'Studentë',
    'admin.admins': 'Adminë',
    'admin.allPlans': 'Të gjitha planet',
    'admin.premium': 'Premium',
    'admin.free': 'Falas',
    'admin.user': 'Përdorues',
    'admin.role': 'Roli',
    'admin.rating': 'Vlerësimi',
    'admin.status': 'Statusi',
    'admin.joined': 'Regjistruar',
    'admin.actions': 'Veprime',
    'admin.removeAdmin': 'Hiq Admin',
    'admin.makeAdmin': 'Bëj Admin',
    'admin.unblockUser': 'Zhblloko Përdoruesin',
    'admin.blockUser': 'Blloko Përdoruesin',
    'admin.deleteUser': 'Fshi Përdoruesin',
    'admin.noUsersFound': 'Asnjë përdorues nuk u gjet sipas kritereve.',
    'admin.backToDashboard': 'Kthehu në Panelin Admin',
    'admin.roleUpdated': 'Roli i përdoruesit u përditësua',
    'admin.roleUpdateError': 'Dështoi përditësimi i rolit',
    'admin.statusUpdated': 'Statusi i përdoruesit u përditësua',
    'admin.statusUpdateError': 'Dështoi përditësimi i statusit',
    'admin.userDeleted': 'Përdoruesi u fshi me sukses',
    'admin.deleteUserError': 'Dështoi fshirja e përdoruesit',
    'admin.deleteConfirm': 'A jeni i sigurt që doni të fshini këtë përdorues? Ky veprim nuk mund të zhbëhet.',
    // Admin Dashboard
    'admin.dashboardTitle': 'Paneli i Administratorit',
    'admin.dashboardSubtitle': 'Menaxho pyetjet, përmbajtjen, përdoruesit dhe abonimet',
    'admin.allQuestions': 'Të gjitha Pyetjet',
    'admin.allQuestionsDesc': 'Shiko dhe menaxho të gjitha pyetjet e testit',
    'admin.viewQuestions': 'Shiko Pyetjet',
    'admin.users': 'Përdoruesit',
    'admin.usersDesc': 'Menaxho përdoruesit dhe rolet',
    'admin.manageUsers': 'Menaxho Përdoruesit',
    'admin.addQuestion': 'Shto Pyetje',
    'admin.addQuestionDesc': 'Krijo një pyetje të re testi',
    'admin.addNew': 'Shto të Re',
    'admin.stats': 'Statistika',
    'admin.statsDesc': 'Shiko metrikën e përdoruesve dhe testeve',
    'admin.viewStats': 'Shiko Statistikat',
    'admin.subscriptions': 'Abonimet',
    'admin.subscriptionsDesc': 'Menaxho planet e përdoruesve dhe statusin',
    'admin.manageSubscriptions': 'Menaxho Abonimet',
    'admin.decisionTrainer': 'Decision Trainer',
    'admin.decisionTrainerDesc': 'Menaxho skenarët e Decision Trainer',
    'admin.manageScenarios': 'Menaxho Skenarët',
    'admin.studyMaterials': 'Materialet Mësimore',
    'admin.studyMaterialsDesc': 'Menaxho materialet teorike për secilin kapitull',
    'admin.manageMaterials': 'Menaxho Materialet',
    'admin.trafficSigns': 'Shenjat e Trafikut',
    'admin.trafficSignsDesc': 'Menaxho emrat, përshkrimet dhe imazhet e shenjave',
    'admin.manageTrafficSigns': 'Menaxho Shenjat',
    // Test Extras
    'test.loadError': 'Nuk mund të ngarkoheshin pyetjet. Ju lutem provoni përsëri.',
    'test.createProfileError': 'Dështoi krijimi i profilit. Ju lutem provoni përsëri.',
    'auth.loginAgain': 'Ju lutem hyni përsëri',
    'test.saveError': 'Dështoi ruajtja e rezultateve',
    'test.saveDetailsError': 'Testi u ruajt, por detajet nuk mund të ruheshin.',
    'test.unexpectedError': 'Një gabim i papritur ndodhi.',
    'test.reviewTest': 'Rishiko këtë test',
    'test.unlimitedTestsBenefit': 'Teste të pakufizuara në këtë kategori',
    'test.fullReviewBenefit': 'Rishikim i plotë me përgjigjet e sakta',
    'test.trainerUnlockedBenefit': 'Decision Trainer i zhbllokuar',
    'test.upgradeCta': 'Shiko planet',
    'test.limitReachedTitle': 'Limiti i testeve falas u arrit',
    'test.limitReachedDescription': 'Keni përdorur testet tuaja falas për këtë cikël.',
    'common.tryAgainLater': 'Ju lutem provoni përsëri më vonë.',
    'common.saving': 'Duke ruajtur...',
    'common.save': 'Ruaj',
    // Dashboard Onboarding / Learning Path
    'dashboard.onboardingTitle': 'Filloni rrugëtimin tuaj të mësimit',
    'dashboard.onboardingSubtitle': 'Ndiqni këto tre hapa për t\'u përgatitur për provimin e teorisë.',
    'dashboard.onboardingStep1': '1. Lexoni materialet studimore për kapitullin tuaj të ardhshëm.',
    'dashboard.onboardingStep2': '2. Praktikoni situata reale në Decision Trainer.',
    'dashboard.onboardingStep3': '3. Testoni veten me teste të plota simuluese.',
    // Decision Trainer Page
    'trainer.title': 'Trajneri i Vendimeve',
    'trainer.practiceModes': 'Mënyrat e praktikës',
    'trainer.fullCategory': 'Kategori e plotë',
    'trainer.quick5': 'Shpejt: 5 pyetje',
    'trainer.quick10': 'Shpejt: 10 pyetje',
    'trainer.weakPoints': 'Pikat e dobëta',
    'trainer.statusNew': 'E re',
    'trainer.statusStrong': 'E fortë',
    'trainer.statusImproving': 'Duke u përmirësuar',
    'trainer.statusNeedsAttention': 'Kërkon vëmendje',
    'trainer.lastSessionTitle': 'Sesioni i fundit',
    'trainer.questionsToReview': 'Pyetje për t\'u rishikuar:',
    'trainer.perfectSession': 'Sesion perfekt! Asnjë gabim për t\'u rishikuar.',
    'trainer.practiceAgain5': 'Praktiko këtë kategori përsëri (5 pyetje)',
    'trainer.leaderboard': 'Tabela e Liderëve',
    'trainer.toastTimesUp': "Koha mbaroi!",
    'trainer.toastCorrect': 'E saktë!',
    'trainer.toastIncorrect': 'E pasaktë. Lexo shpjegimin për të mësuar!',
    'trainer.toastWeakLocked': 'Përfundo të paktën një kategori për të zhbllokuar modulin e pikave të dobëta.',
    'trainer.toastFocusingWeak': 'Duke u fokusuar në kategorinë tuaj më të dobët:',
    'trainer.toastSyncFailed': 'Rezultatet u ruajtën lokalisht por dështuan të sinkronizohen me tabelën e liderëve.',
    'trainer.modeFull': 'Kategori e plotë',
    'trainer.modeQuick5': 'Shpejt: 5 pyetje',
    'trainer.modeQuick10': 'Shpejt: 10 pyetje',
    'trainer.modeWeak': 'Pikat e dobëta (5 pyetje)',
    'trainer.scenariosShort': 'skenarë',
    'trainer.accuracyShort': 'saktësi',
    // Category Page
    'category.licenseCategory': 'Kategoria e Patentës',
    'category.mockTests': 'Teste Provuese',
    'category.minutesEach': 'minuta secili',
    'category.selectTest': 'Zgjidh Testin Tënd',
    'category.selectTestDesc': 'Zgjidh nga 10 teste gjithëpërfshirëse',
    'category.questions': 'Pyetje',
    'category.start': 'Fillo',
    'category.noTestsTitle': 'Ende nuk ka teste',
    'category.noTestsDescription': 'Administratori nuk ka shtuar ende teste provuese për këtë kategori.',
    // Test Page
    'test.exitTest': 'Dil nga Testi',
    'test.question': 'Pyetja',
    'test.of': 'nga',
    'test.backToTests': 'Kthehu te Testet',
    'test.congratulations': 'Urime!',
    'test.keepPracticing': 'Vazhdo Praktikën!',
    'test.test': 'Testi',
    'test.correctAnswers': 'përgjigje të sakta',
    'test.passingScore': 'Pikët për Kalim',
    'test.passed': 'Kaluar',
    'test.failed': 'Dështuar',
    'test.retakeTest': 'Ribëj Testin',
    'test.viewAllTests': 'Shiko Të Gjitha Testet',
    'test.loadingQuestions': 'Duke ngarkuar pyetjet...',
    'test.noQuestionsTitle': 'Asnjë Pyetje e Disponueshme',
    'test.noQuestionsDescription': 'Nuk ka pyetje të disponueshme për këtë test ende.',
    'test.sessionStats': 'Statistikat e Sesionit',
    'test.correctLabel': 'Të Sakta',
    'test.accuracy': 'Saktësia',
    'test.bestStreak': 'Seria më e Mirë',
    'test.selectAnswers': 'Zgjidhni një ose më shumë përgjigje',
    'test.optionsSelected': 'opsione të zgjedhura',
    'test.mixedName': 'Test i Përzier',
    'test.personalizedName': 'Test i Personalizuar',
    'test.previous': 'E Mëparshme',
    'test.next': 'E Radhës',
    'test.submitTest': 'Dorëzo Testin',
    'test.submitAnswer': 'Dorëzo Përgjigjen',
    'test.timeLeft': 'Koha e Mbetur',
    'test.questionImage': 'Imazhi i Pyetjes',
    'test.questionIllustration': 'Ilustrimi i pyetjes',
    'test.answeredLabel': 'përgjigjur',
    'test.correctTitle': '✓ E Saktë!',
    'test.incorrectTitle': '✗ E Pasaktë - Mëso nga kjo!',
    'test.nextStepsTitle': 'Çfarë duhet të bëni më pas?',
    'test.nextStepsPassedStandard': 'Punë e shkëlqyer! Më pas, provoni një test të Përzier ose vazhdoni në Decision Trainer për të thelluar kuptimin tuaj.',
    'test.nextStepsPassedMixedOrPersonalized': 'Punë e shkëlqyer! Mund të vazhdoni të rrisni vetëbesimin me më shumë teste në këtë kategori ose të vazhdoni në Decision Trainer.',
    'test.nextStepsFailedPersonalized': 'Rishikoni këtë test të personalizuar për të kuptuar gabimet tuaja, pastaj vazhdoni të fokusoheni në pikat e dobëta në Decision Trainer.',
    'test.nextStepsFailedStandard': 'Rishikoni këtë test në detaje për të kuptuar gabimet tuaja, pastaj provoni një test të Personalizuar dhe Decision Trainer për t\'u fokusuar në pikat e dobëta.',
    'test.practiceWeakPointsCta': 'Praktiko pikat e dobëta',
    'test.mixedTestCta': 'Test i përzier për këtë kategori',
    'test.decisionTrainerCta': 'Decision Trainer',
    'test.weakTopicsInThisTest': 'Temat e dobëta në këtë test',
    // History / Review Page
    'history.reviewSubtitle': 'Rishikoni përgjigjet tuaja dhe mësoni nga gabimet',
    'history.topicsTitle': 'Temat në këtë test',
    'history.topicsSubtitle': 'Shiko ku jeni të fortë dhe ku duhet të fokusoheni më pas.',
    'history.weakTopicsPrefix': 'Temat e dobëta:',
    'history.explanationTitle': 'Shpjegimi',
    'history.notFoundTitle': 'Testi nuk u gjet',
    'history.notFoundDescription': 'Ky test nuk u gjet ose është fshirë.',
    'history.missingQuestionTitle': 'Të dhënat e pyetjes nuk u gjetën',
    'history.backToHistory': 'Kthehu te historia',
    // Error Page
    'error.title': 'Ups! Diçka shkoi keq',
    'error.message': "Kemi hasur një gabim të papritur. Të dhënat tuaja janë të sigurta. Ju lutem provoni përsëri ose kthehuni në panel.",
    'error.tryAgain': 'Provo Përsëri',
    'error.goToDashboard': 'Shko në Panel',
    'error.needHelp': 'Keni nevojë për ndihmë?',
    'error.contactSupport': 'Nëse ky problem vazhdon, ju lutem kontaktoni mbështetjen.',
    // Achievements
    'achievements.firstTestTitle': 'Testi i parë u përfundua',
    'achievements.firstTestDesc': 'Përfundoni testin tuaj të parë provues të teorisë.',
    'achievements.fivePassesRowTitle': 'Në seri',
    'achievements.fivePassesRowDesc': 'Kaloni 5 teste teorie rresht me të paktën 80% rezultat.',
    'achievements.hundredQuestionsTitle': '100 pyetje të përgjigjura',
    'achievements.hundredQuestionsDesc': 'Përgjigjuni të paktën 100 pyetjeve të teorisë në të gjitha testet.',
    // Decision Trainer Next Steps
    'trainer.nextStepsTitle': 'Çfarë duhet të bëni më pas?',
    'trainer.nextStepsHigh': 'Saktësi e lartë në këtë kategori. Mund të sfidoni veten me një test të plotë ose të përzier më pas.',
    'trainer.nextStepsMedium': 'Progres i mirë, por ka vend për përmirësim. Praktikoni edhe disa skenarë dhe pastaj provoni një test në këtë kategori.',
    'trainer.nextStepsLow': 'Fokusohuni në kuptimin e shpjegimeve dhe rishikoni kapitujt përkatës, pastaj vazhdoni praktikën në Decision Trainer para se të bëni një test të plotë.',
    'trainer.goToTestsCta': 'Shko te testet për këtë kategori',
    'trainer.practiceMoreCta': 'Praktiko më shumë skenarë',
    'trainer.weakPointsModeCta': 'Fokuso në pikat e dobëta',
    'trainer.reviewMaterialsCta': 'Rishiko materialet përkatëse',
    'trainer.firstSteps': 'Hapat e Parë',
    'trainer.accuracyAce': 'Mjeshtër i Saktësisë',
    'trainer.streakMaster': 'Mjeshtër i Serisë',
    'trainer.xpHunter': 'Gjuetar i XP',
    'trainer.categoryExplorer': 'Eksplorues Kategorish',
    'trainer.noScenariosTitle': 'Ende asnjë skenar',
    'trainer.noScenariosSubtitle': 'Administratori nuk ka shtuar ende skenarë për Decision Trainer.',
    'trainer.firstScenarioDesc': 'Përfundoni skenarin tuaj të parë në Decision Trainer.',
    'trainer.accuracyAceDesc': 'Arrini 80%+ saktësi në të paktën 20 përpjekje.',
    'trainer.streakMasterDesc': 'Arrini një seri prej 10 përgjigjesh të sakta.',
    'trainer.xpHunterDesc': 'Fitoni gjithsej 500 XP në Decision Trainer.',
    'trainer.categoryExplorerDesc': 'Praktikoni të paktën 3 kategori të ndryshme në Decision Trainer.',
    'trainer.consistencyPro': 'Profesionist i Qëndrueshmërisë',
    'trainer.consistencyProDesc': 'Përfundoni të paktën 50 skenarë në Decision Trainer në të gjitha kategoritë.',
    'trainer.achievementsUnlockedLabel': 'të zhbllokuara',
    'trainer.correctCombinationLabel': 'Kombinimi i saktë:',
    'trainer.yourSelectionLabel': 'Zgjedhja juaj:',
    'trainer.noSelectionLabel': 'Asnjë opsion i zgjedhur',
    'trainer.reviewChapterCta': 'Rishiko kapitullin',
    'trainer.premiumRequiredTitle': 'Zhblloko Decision Trainer',
    'trainer.premiumRequiredDescription': 'Decision Trainer është pjesë e planit të paguar. Me çdo plan aktiv merrni qasje të plotë në të gjitha skenarët, metodat e mençura të praktikës dhe rishikimet e detajuara.',
    'trainer.premiumBenefitUnlimited': 'Praktikë e pakufizuar në Decision Trainer në të gjitha kategoritë.',
    'trainer.premiumBenefitStudy': 'Lidhni skenarët me kapitujt përkatës të studimit dhe rishikimet e testeve.',
    'trainer.premiumBenefitFocus': 'Metoda të mençura që fokusohen në pikat tuaja të dobëta dhe kohën.',
    'trainer.premiumUpgradeCta': 'Shiko planet',
    // Leaderboard
    'leaderboard.backToTrainer': 'Kthehu te Trajneri',
    'leaderboard.subtitle': 'Nxënësit më të mirë në Decision Trainer',
    'leaderboard.noDataTitle': 'Ende asnjë të dhënë në tabelë',
    'leaderboard.noDataSubtitle': 'Përfundoni disa skenarë në Decision Trainer për t\'u shfaqur në tabelën e liderëve!',
    'leaderboard.startLearningCta': 'Fillo mësimin',
    'leaderboard.top10Title': 'Top 10 Tabela e Liderëve',
    'leaderboard.showingTop10Of': 'Duke shfaqur top 10 nga',
    'leaderboard.highestXp': 'XP më të larta',
    'leaderboard.topAccuracy': 'Saktësia më e lartë',
    'leaderboard.longestStreak': 'Seria më e gjatë',
    'leaderboard.yourRank': 'Renditja juaj',
    // Rating Modal
    'rating.title': 'Vlerëso DriveWise',
    'rating.description': 'Si do ta vlerësonit përvojën tuaj me aplikacionin tonë?',
    'rating.selectRating': 'Ju lutem zgjidhni një vlerësim',
    'rating.success': 'Faleminderit për vlerësimin tuaj!',
    'rating.error': 'Dështoi dërgimi i vlerësimit',
    'rating.skip': 'Kalo',
    'rating.submit': 'Dërgo Vlerësimin',
    'rating.submitting': 'Duke dërguar...',
    'rating.feedback.1': 'Do të punojmë më shumë për t\'u përmirësuar',
    'rating.feedback.2': 'Faleminderit për reagimin tuaj',
    'rating.feedback.3': 'Mirë që e dimë!',
    'rating.feedback.4': 'Shkëlqyeshëm! Na vjen mirë që ju pëlqen',
    'rating.feedback.5': 'Fantastike! Ju faleminderit shumë!'
};
function LanguageProvider({ children }) {
    _s();
    // We keep the state interface but strictly force it to 'sq'
    const [language] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('sq');
    const t = (key)=>{
        return translations[key] || key;
    };
    // Dummy setLanguage that does nothing, just to satisfy interface if used anywhere
    const setLanguage = (lang)=>{
        // No-op
        console.log('Language switch requested but app is Albanian-only:', lang);
    };
    const contextValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LanguageProvider.useMemo[contextValue]": ()=>({
                language,
                setLanguage,
                t
            })
    }["LanguageProvider.useMemo[contextValue]"], [
        language
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LanguageContext.Provider, {
        value: contextValue,
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/drivewise/web/contexts/language-context.tsx",
        lineNumber: 510,
        columnNumber: 5
    }, this);
}
_s(LanguageProvider, "Ac6+VQJ+wrrBEV49/OVUAS5agiI=");
_c = LanguageProvider;
function useLanguage() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
_s1(useLanguage, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "LanguageProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/drivewise/web/utils/supabase/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/@supabase/ssr/dist/module/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
;
function createClient() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(("TURBOPACK compile-time value", "https://qtlnhgjgfwmohpnvikdm.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0bG5oZ2pnZndtb2hwbnZpa2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2ODIzODYsImV4cCI6MjA3ODI1ODM4Nn0.qn_Ou_JOvUEPV_hBteW4cXtSn5pcIladEAT2_vVWFw8"));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/drivewise/web/contexts/auth-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/web/utils/supabase/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [authLoading, setAuthLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[supabase]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])()
    }["AuthProvider.useMemo[supabase]"], []);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    // 1. Query for User Profile
    const { data: profileData, isLoading: profileLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'userProfile',
            user?.id
        ],
        queryFn: {
            "AuthProvider.useQuery": async ()=>{
                if (!user?.id) return null;
                const { data, error } = await supabase.from('user_profiles').select('*').eq('id', user.id).maybeSingle();
                if (error) {
                    console.error('Error fetching user profile:', error.message, error.details);
                    return null;
                }
                return data;
            }
        }["AuthProvider.useQuery"],
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 30
    });
    // Derived state
    const isAdmin = !!profileData?.is_admin;
    const isBlocked = !!profileData?.is_blocked;
    const userProfile = profileData ? {
        full_name: profileData.full_name,
        email: profileData.email,
        subscription_id: profileData.subscription_id,
        is_admin: isAdmin,
        is_blocked: isBlocked
    } : null;
    const handleBlockedAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[handleBlockedAccount]": async ()=>{
            // Immediate local logout
            setUser(null);
            queryClient.clear();
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Account Blocked', {
                description: 'Your account has been blocked. Please contact support.',
                duration: 5000
            });
            router.replace('/');
            // Cleanup server session in background
            try {
                await supabase.auth.signOut();
            } catch (error) {
                console.error('Error during signOut for blocked user:', error);
            }
        }
    }["AuthProvider.useCallback[handleBlockedAccount]"], [
        router,
        supabase,
        queryClient
    ]);
    // 2. React to blocked status
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if (isBlocked) {
                handleBlockedAccount();
            }
        }
    }["AuthProvider.useEffect"], [
        isBlocked,
        handleBlockedAccount
    ]);
    // 3. Initialize Auth & Listen for Changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            let mounted = true;
            // Initial session check
            const initializeAuth = {
                "AuthProvider.useEffect.initializeAuth": async ()=>{
                    try {
                        // using getSession instead of getUser for faster initial load (cache-first)
                        const { data: { session } } = await supabase.auth.getSession();
                        if (mounted) {
                            setUser(session?.user ?? null);
                            setAuthLoading(false);
                            if (session?.user) {
                                router.refresh();
                            }
                        }
                    } catch (error) {
                        console.error('Error getting session:', error);
                        if (mounted) {
                            setAuthLoading(false);
                        }
                    }
                }
            }["AuthProvider.useEffect.initializeAuth"];
            initializeAuth();
            const { data: { subscription } } = supabase.auth.onAuthStateChange({
                "AuthProvider.useEffect": async (event, session)=>{
                    if (!mounted) return;
                    const currentUser = session?.user ?? null;
                    if (event === 'SIGNED_OUT') {
                        setUser(null);
                        setAuthLoading(false);
                        queryClient.clear();
                        router.refresh();
                    } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                        setUser(currentUser);
                        setAuthLoading(false);
                        router.refresh();
                    } else if (event === 'INITIAL_SESSION') {
                        // Handled by initializeAuth, but good as fallback
                        setUser(currentUser);
                        setAuthLoading(false);
                    }
                }
            }["AuthProvider.useEffect"]);
            return ({
                "AuthProvider.useEffect": ()=>{
                    mounted = false;
                    subscription.unsubscribe();
                }
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], [
        supabase,
        queryClient,
        router
    ]);
    const signIn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[signIn]": async (email, password)=>{
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password
                });
                if (error) {
                    if (error.message.includes('Invalid login credentials')) {
                        throw new Error('Account does not exist or password is incorrect.');
                    } else if (error.message.includes('Email not confirmed')) {
                        throw new Error('Please confirm your email address before logging in.');
                    } else {
                        throw error;
                    }
                }
                if (data.user) {
                    queryClient.clear();
                    setUser(data.user);
                    router.refresh();
                // Profile query will auto-run because of enabled: !!user.id
                }
                return {
                    error: null
                };
            } catch (err) {
                return {
                    error: err
                };
            }
        }
    }["AuthProvider.useCallback[signIn]"], [
        supabase,
        queryClient,
        router
    ]);
    const signUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[signUp]": async (email, password, fullName)=>{
            try {
                const { data: existingUser } = await supabase.from('user_profiles').select('email').eq('email', email.trim()).maybeSingle();
                if (existingUser) {
                    throw new Error('An account with this email already exists.');
                }
                const emailRedirectTo = ("TURBOPACK compile-time truthy", 1) ? `${window.location.origin}/login` : "TURBOPACK unreachable";
                const { data, error } = await supabase.auth.signUp({
                    email: email.trim(),
                    password,
                    options: {
                        emailRedirectTo,
                        data: {
                            full_name: fullName
                        }
                    }
                });
                if (error) {
                    throw error;
                }
                if (data?.session || data?.user) {
                    // Don't auto-login on signup if email confirmation is required, 
                    // but if it's not, this might sign them in. 
                    // For safety/consistency with strict auth flow:
                    await supabase.auth.signOut();
                    setUser(null);
                    queryClient.clear();
                }
                return {
                    error: null
                };
            } catch (err) {
                return {
                    error: err
                };
            }
        }
    }["AuthProvider.useCallback[signUp]"], [
        supabase,
        queryClient
    ]);
    const signOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[signOut]": async ()=>{
            // Optimistic UI update & navigation
            // Do this FIRST so the user sees immediate action
            setUser(null);
            queryClient.clear();
            router.replace('/'); // Redirect to home page
            router.refresh(); // Update server components/middleware
            try {
                await supabase.auth.signOut();
            } catch (error) {
                console.error('Error during Supabase signOut:', error);
            }
        }
    }["AuthProvider.useCallback[signOut]"], [
        supabase,
        router,
        queryClient
    ]);
    const refreshUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[refreshUser]": async ()=>{
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                queryClient.invalidateQueries({
                    queryKey: [
                        'userProfile',
                        user.id
                    ]
                });
            }
        }
    }["AuthProvider.useCallback[refreshUser]"], [
        supabase,
        queryClient
    ]);
    const contextValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[contextValue]": ()=>({
                user,
                loading: authLoading,
                profileLoading,
                isAdmin,
                isBlocked,
                userProfile,
                signIn,
                signUp,
                signOut,
                refreshUser
            })
    }["AuthProvider.useMemo[contextValue]"], [
        user,
        authLoading,
        profileLoading,
        isAdmin,
        isBlocked,
        userProfile,
        signIn,
        signUp,
        signOut,
        refreshUser
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: contextValue,
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/drivewise/web/contexts/auth-context.tsx",
        lineNumber: 285,
        columnNumber: 10
    }, this);
}
_s(AuthProvider, "Uq1lLaT1pqG349R/nOtHoEdyhmY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/drivewise/web/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/drivewise/web/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/web/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
    variants: {
        variant: {
            default: "relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border border-primary/70 shadow-[0_0_28px_rgba(255,255,255,0.10),0_16px_40px_rgba(0,0,0,0.85)] hover:from-primary/95 hover:to-primary/75 hover:shadow-[0_0_34px_rgba(255,255,255,0.14),0_20px_52px_rgba(0,0,0,0.9)] active:shadow-[0_0_24px_rgba(255,255,255,0.08),0_12px_32px_rgba(0,0,0,0.8)]",
            destructive: "bg-destructive text-destructive-foreground shadow-[0_10px_30px_rgba(0,0,0,0.75)] border border-destructive/60 hover:bg-destructive/90",
            outline: "border border-border/60 bg-background/60 text-foreground shadow-[0_10px_32px_rgba(0,0,0,0.7)] hover:border-primary/70 hover:bg-primary/10 hover:text-primary",
            secondary: "bg-secondary/90 text-secondary-foreground shadow-[0_12px_36px_rgba(0,0,0,0.75)] border border-secondary/70 hover:bg-secondary",
            ghost: "text-muted-foreground hover:text-primary hover:bg-primary/5",
            link: "text-primary underline-offset-4 hover:underline hover:text-primary/80"
        },
        size: {
            default: "h-10 px-5",
            sm: "h-8 rounded-lg px-3 text-xs",
            lg: "h-11 rounded-2xl px-8 text-base",
            icon: "h-9 w-9 rounded-xl"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/drivewise/web/components/ui/button.tsx",
        lineNumber: 47,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = "Button";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/drivewise/web/components/error-boundary.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorBoundary",
    ()=>ErrorBoundary,
    "withErrorBoundary",
    ()=>withErrorBoundary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/web/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
'use client';
;
;
;
;
class ErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Component"] {
    state = {
        hasError: false
    };
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error
        };
    }
    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    handleReset = ()=>{
        this.setState({
            hasError: false,
            error: undefined
        });
    };
    handleReload = ()=>{
        window.location.reload();
    };
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen bg-background flex items-center justify-center relative overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-gradient-to-br from-destructive/5 via-background to-background"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/drivewise/web/components/error-boundary.tsx",
                        lineNumber: 47,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-0 right-0 w-96 h-96 bg-destructive/10 rounded-full blur-3xl opacity-50"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/drivewise/web/components/error-boundary.tsx",
                        lineNumber: 48,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-0 left-0 w-96 h-96 bg-destructive/5 rounded-full blur-3xl opacity-50"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/drivewise/web/components/error-boundary.tsx",
                        lineNumber: 49,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center relative z-10 max-w-md mx-auto px-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                    className: "w-10 h-10 text-destructive"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/drivewise/web/components/error-boundary.tsx",
                                    lineNumber: 53,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/drivewise/web/components/error-boundary.tsx",
                                lineNumber: 52,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-2xl font-bold text-foreground",
                                        children: "Something went wrong"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/drivewise/web/components/error-boundary.tsx",
                                        lineNumber: 57,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-muted-foreground",
                                        children: "We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists."
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/drivewise/web/components/error-boundary.tsx",
                                        lineNumber: 58,
                                        columnNumber: 15
                                    }, this),
                                    ("TURBOPACK compile-time value", "development") === 'development' && this.state.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                        className: "text-left bg-muted/50 rounded-lg p-4 mt-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                                className: "cursor-pointer text-sm font-medium mb-2",
                                                children: "Error Details"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/drivewise/web/components/error-boundary.tsx",
                                                lineNumber: 64,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                                className: "text-xs text-muted-foreground overflow-auto",
                                                children: [
                                                    this.state.error.message,
                                                    '\n',
                                                    this.state.error.stack
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/drivewise/web/components/error-boundary.tsx",
                                                lineNumber: 65,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/drivewise/web/components/error-boundary.tsx",
                                        lineNumber: 63,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col sm:flex-row gap-3 justify-center pt-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                onClick: this.handleReset,
                                                variant: "outline",
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/drivewise/web/components/error-boundary.tsx",
                                                        lineNumber: 75,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Try Again"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/drivewise/web/components/error-boundary.tsx",
                                                lineNumber: 74,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                onClick: this.handleReload,
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/drivewise/web/components/error-boundary.tsx",
                                                        lineNumber: 79,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Reload Page"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/drivewise/web/components/error-boundary.tsx",
                                                lineNumber: 78,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/drivewise/web/components/error-boundary.tsx",
                                        lineNumber: 73,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/drivewise/web/components/error-boundary.tsx",
                                lineNumber: 56,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/drivewise/web/components/error-boundary.tsx",
                        lineNumber: 51,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/drivewise/web/components/error-boundary.tsx",
                lineNumber: 45,
                columnNumber: 9
            }, this);
        }
        return this.props.children;
    }
}
function withErrorBoundary(Component, fallback) {
    return function WithErrorBoundaryComponent(props) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ErrorBoundary, {
            fallback: fallback,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
                ...props
            }, void 0, false, {
                fileName: "[project]/Desktop/drivewise/web/components/error-boundary.tsx",
                lineNumber: 101,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/drivewise/web/components/error-boundary.tsx",
            lineNumber: 100,
            columnNumber: 7
        }, this);
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_drivewise_web_9b9f03f1._.js.map