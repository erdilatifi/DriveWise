(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/drivewise/web/components/ui/glass-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GlassCard",
    ()=>GlassCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/web/lib/utils.ts [app-client] (ecmascript)");
;
;
function GlassCard({ children, className, hover = false, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 backdrop-blur-2xl", "shadow-[0_22px_70px_rgba(0,0,0,0.9)]", "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.12),transparent_55%),radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.06),transparent_55%)] before:opacity-70", hover && "transition-all duration-300 hover:shadow-[0_28px_90px_rgba(0,0,0,1)]", className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/drivewise/web/components/ui/glass-card.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = GlassCard;
var _c;
__turbopack_context__.k.register(_c, "GlassCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/drivewise/web/components/ui/skeleton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Skeleton",
    ()=>Skeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/web/lib/utils.ts [app-client] (ecmascript)");
;
;
function Skeleton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative overflow-hidden rounded-xl bg-gradient-to-r from-muted/60 via-muted/35 to-muted/60", "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-primary/18 before:to-transparent before:animate-[shimmer_1.4s_infinite]", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/drivewise/web/components/ui/skeleton.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_c = Skeleton;
;
var _c;
__turbopack_context__.k.register(_c, "Skeleton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/drivewise/web/types/database.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Database types for DriveWise
__turbopack_context__.s([
    "CATEGORY_INFO",
    ()=>CATEGORY_INFO,
    "LANGUAGE_INFO",
    ()=>LANGUAGE_INFO
]);
const CATEGORY_INFO = {
    A: {
        name: 'Category A',
        description: 'Motorcycles'
    },
    B: {
        name: 'Category B',
        description: 'Cars'
    },
    C: {
        name: 'Category C',
        description: 'Trucks'
    },
    D: {
        name: 'Category D',
        description: 'Buses'
    }
};
const LANGUAGE_INFO = {
    sq: {
        name: 'Albanian',
        nativeName: 'Shqip'
    },
    en: {
        name: 'English',
        nativeName: 'English'
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/drivewise/web/components/navbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Navbar",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/web/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$contexts$2f$language$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/web/contexts/language-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/web/contexts/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
function Navbar() {
    _s();
    const [mobileMenuOpen, setMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [languageMenuOpen, setLanguageMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [scrolled, setScrolled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { language, setLanguage, t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$contexts$2f$language$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"])();
    const { user, signOut, isAdmin, userProfile, loading: authLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    // Get display name from userProfile or fallback to email
    const displayName = userProfile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || t('admin.user');
    // Handle scroll behavior
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>{
            let rafId;
            const handleScroll = {
                "Navbar.useEffect.handleScroll": ()=>{
                    rafId = requestAnimationFrame({
                        "Navbar.useEffect.handleScroll": ()=>{
                            setScrolled(window.scrollY > 10);
                        }
                    }["Navbar.useEffect.handleScroll"]);
                }
            }["Navbar.useEffect.handleScroll"];
            window.addEventListener('scroll', handleScroll);
            return ({
                "Navbar.useEffect": ()=>{
                    window.removeEventListener('scroll', handleScroll);
                    cancelAnimationFrame(rafId);
                }
            })["Navbar.useEffect"];
        }
    }["Navbar.useEffect"], []);
    const handleLanguageChange = (lang)=>{
        setLanguage(lang);
        setLanguageMenuOpen(false);
    };
    const handleLogout = async ()=>{
        try {
            setMobileMenuOpen(false);
            await signOut();
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(t('auth.logoutSuccess'));
        } catch (error) {
            console.error('Logout error:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(t('auth.logoutError'));
        }
    };
    const isActive = (path)=>pathname === path;
    const desktopLinkBase = 'text-sm font-semibold transition-all duration-200 relative group/nav-link';
    const desktopLinkActive = 'text-primary';
    const desktopLinkInactive = 'text-foreground/80 hover:text-foreground';
    const renderDesktopLink = (href, label, active)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: href,
            className: `${desktopLinkBase} ${active ? desktopLinkActive : desktopLinkInactive}`,
            children: [
                label,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-full transition-all duration-200 ${active ? 'w-full' : 'w-0 group-hover/nav-link:w-full'}`
                }, void 0, false, {
                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                    lineNumber: 68,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
            lineNumber: 63,
            columnNumber: 5
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: `fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${scrolled ? 'top-0 w-full' : 'top-4 w-[90%]'}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `bg-card/95 backdrop-blur-xl border border-border/40 shadow-lg shadow-black/20 transition-all duration-300 ${scrolled ? 'rounded-none border-t-0 border-x-0' : 'rounded-2xl'}`,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container mx-auto px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-20 items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: "flex items-center gap-3 group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute inset-0 bg-primary/30 blur-2xl rounded-full group-hover:bg-primary/40 transition-all duration-300"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                lineNumber: 88,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative w-12 h-12 rounded-2xl overflow-hidden shadow-xl shadow-primary/20 group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-105 border-2 border-primary/30 group-hover:border-primary/50",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    src: "/logo-white.png",
                                                    alt: "DriveWise Logo",
                                                    width: 48,
                                                    height: 48,
                                                    className: "w-full h-full object-cover"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                    lineNumber: 90,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                lineNumber: 89,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                        lineNumber: 87,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-2xl font-bold text-white tracking-tight",
                                                children: "DriveWise"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                lineNumber: 100,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-primary font-medium -mt-1",
                                                children: t('nav.subtitle')
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                lineNumber: 103,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                        lineNumber: 99,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hidden md:flex items-center gap-8",
                                children: [
                                    renderDesktopLink('/', t('nav.home'), isActive('/')),
                                    renderDesktopLink('/pricing', t('nav.pricing'), isActive('/pricing')),
                                    renderDesktopLink('/materials', t('nav.materials'), isActive('/materials')),
                                    user && renderDesktopLink('/decision-trainer', t('nav.decisionTrainer'), pathname.startsWith('/decision-trainer')),
                                    renderDesktopLink('/category', t('nav.tests'), pathname.startsWith('/category')),
                                    renderDesktopLink('/dashboard', t('nav.dashboard'), isActive('/dashboard')),
                                    user && renderDesktopLink('/profile', t('nav.account'), isActive('/profile')),
                                    user && isAdmin && renderDesktopLink('/admin', t('nav.admin'), isActive('/admin') || pathname.startsWith('/admin'))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hidden md:flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setLanguageMenuOpen(!languageMenuOpen),
                                                className: "flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-all duration-200 group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                                        className: "w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                        lineNumber: 153,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-medium text-foreground group-hover:text-primary transition-colors",
                                                        children: language === 'en' ? 'EN' : 'SQ'
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                        lineNumber: 154,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                lineNumber: 149,
                                                columnNumber: 15
                                            }, this),
                                            languageMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-full mt-2 right-0 w-48 bg-card border border-border/50 rounded-xl shadow-xl shadow-black/20 overflow-hidden z-50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleLanguageChange('en'),
                                                        className: `w-full flex items-center justify-between px-4 py-3 hover:bg-primary/10 transition-colors ${language === 'en' ? 'bg-primary/10 text-primary' : 'text-foreground'}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: "English"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                                lineNumber: 168,
                                                                columnNumber: 21
                                                            }, this),
                                                            language === 'en' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                className: "w-4 h-4 text-primary"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                                lineNumber: 169,
                                                                columnNumber: 43
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                        lineNumber: 162,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleLanguageChange('sq'),
                                                        className: `w-full flex items-center justify-between px-4 py-3 hover:bg-primary/10 transition-colors ${language === 'sq' ? 'bg-primary/10 text-primary' : 'text-foreground'}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: "Shqip"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                                lineNumber: 177,
                                                                columnNumber: 21
                                                            }, this),
                                                            language === 'sq' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                className: "w-4 h-4 text-primary"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                                lineNumber: 178,
                                                                columnNumber: 43
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                        lineNumber: 171,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                lineNumber: 161,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                        lineNumber: 148,
                                        columnNumber: 13
                                    }, this),
                                    authLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 px-4 py-2 rounded-full bg-primary/5 border border-primary/10",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-2 h-2 rounded-full bg-primary animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                lineNumber: 186,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Loading..."
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                lineNumber: 187,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                        lineNumber: 185,
                                        columnNumber: 15
                                    }, this) : user ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-2 h-2 rounded-full bg-primary animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                        lineNumber: 192,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-medium text-primary",
                                                        children: displayName
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                        lineNumber: 193,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                lineNumber: 191,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "outline",
                                                size: "sm",
                                                onClick: handleLogout,
                                                className: "border-border/50 hover:border-primary/50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                        className: "w-4 h-4 mr-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                        lineNumber: 196,
                                                        columnNumber: 19
                                                    }, this),
                                                    t('nav.logout')
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                lineNumber: 195,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                size: "sm",
                                                asChild: true,
                                                className: "hover:bg-primary/10 hover:text-primary",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/login",
                                                    children: t('nav.login')
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                    lineNumber: 203,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                lineNumber: 202,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                size: "sm",
                                                asChild: true,
                                                className: "shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 font-semibold",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/register",
                                                    children: t('nav.getStarted')
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                    lineNumber: 206,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                lineNumber: 205,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                lineNumber: 146,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "md:hidden p-2 hover:bg-primary/10 rounded-lg transition-all duration-200 border border-border/50 hover:border-primary/30",
                                onClick: ()=>setMobileMenuOpen(!mobileMenuOpen),
                                children: mobileMenuOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "w-5 h-5 text-primary"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                    lineNumber: 218,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                    className: "w-5 h-5 text-foreground"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                    lineNumber: 220,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                lineNumber: 213,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    mobileMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "md:hidden py-6 border-t border-border/40 bg-card/50 backdrop-blur-xl animate-in slide-in-from-top-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-2",
                            children: [
                                user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-primary/10 border border-primary/20",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-2 h-2 rounded-full bg-primary animate-pulse"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                            lineNumber: 231,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm font-medium text-primary",
                                            children: displayName
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                            lineNumber: 232,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                    lineNumber: 230,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/",
                                    className: `px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive('/') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-foreground/80 hover:bg-primary/5 hover:text-foreground'}`,
                                    onClick: ()=>setMobileMenuOpen(false),
                                    children: t('nav.home')
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                    lineNumber: 236,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/pricing",
                                    className: `px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive('/pricing') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-foreground/80 hover:bg-primary/5 hover:text-foreground'}`,
                                    onClick: ()=>setMobileMenuOpen(false),
                                    children: t('nav.pricing')
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                    lineNumber: 247,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/materials",
                                    className: `px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive('/materials') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-foreground/80 hover:bg-primary/5 hover:text-foreground'}`,
                                    onClick: ()=>setMobileMenuOpen(false),
                                    children: t('nav.materials')
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                    lineNumber: 260,
                                    columnNumber: 15
                                }, this),
                                user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/decision-trainer",
                                    className: `px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${pathname.startsWith('/decision-trainer') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-foreground/80 hover:bg-primary/5 hover:text-foreground'}`,
                                    onClick: ()=>setMobileMenuOpen(false),
                                    children: t('nav.decisionTrainer')
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                    lineNumber: 272,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/category",
                                    className: `px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${pathname.startsWith('/category') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-foreground/80 hover:bg-primary/5 hover:text-foreground'}`,
                                    onClick: ()=>setMobileMenuOpen(false),
                                    children: t('nav.tests')
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                    lineNumber: 286,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/dashboard",
                                    className: `px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive('/dashboard') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-foreground/80 hover:bg-primary/5 hover:text-foreground'}`,
                                    onClick: ()=>setMobileMenuOpen(false),
                                    children: t('nav.dashboard')
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                    lineNumber: 299,
                                    columnNumber: 15
                                }, this),
                                user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/profile",
                                    className: `px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive('/profile') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-foreground/80 hover:bg-primary/5 hover:text-foreground'}`,
                                    onClick: ()=>setMobileMenuOpen(false),
                                    children: t('nav.account')
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                    lineNumber: 311,
                                    columnNumber: 17
                                }, this),
                                user && isAdmin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/admin",
                                    className: `px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive('/admin') || pathname.startsWith('/admin') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-foreground/80 hover:bg-primary/5 hover:text-foreground'}`,
                                    onClick: ()=>setMobileMenuOpen(false),
                                    children: t('nav.admin')
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                    lineNumber: 327,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                    lineNumber: 343,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-medium",
                                                    children: t('nav.language')
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                    lineNumber: 344,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                            lineNumber: 342,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleLanguageChange('en'),
                                            className: `w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${language === 'en' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-foreground/80 hover:bg-primary/5 hover:text-foreground'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold",
                                                    children: "English"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                    lineNumber: 352,
                                                    columnNumber: 19
                                                }, this),
                                                language === 'en' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                    className: "w-4 h-4 text-primary"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                    lineNumber: 353,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                            lineNumber: 346,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleLanguageChange('sq'),
                                            className: `w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${language === 'sq' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-foreground/80 hover:bg-primary/5 hover:text-foreground'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold",
                                                    children: "Shqip"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                    lineNumber: 361,
                                                    columnNumber: 19
                                                }, this),
                                                language === 'sq' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                    className: "w-4 h-4 text-primary"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                    lineNumber: 362,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                            lineNumber: 355,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                    lineNumber: 341,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-px bg-border/40 my-3"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                    lineNumber: 366,
                                    columnNumber: 15
                                }, this),
                                authLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/10",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-2 h-2 rounded-full bg-primary animate-pulse"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                            lineNumber: 369,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-muted-foreground",
                                            children: "Loading..."
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                            lineNumber: 370,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                    lineNumber: 368,
                                    columnNumber: 17
                                }, this) : user ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    size: "sm",
                                    onClick: handleLogout,
                                    className: "w-full justify-start border-border/50 hover:border-primary/50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                            className: "w-4 h-4 mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                            lineNumber: 374,
                                            columnNumber: 19
                                        }, this),
                                        t('nav.logout')
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                    lineNumber: 373,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            size: "sm",
                                            asChild: true,
                                            className: "w-full justify-start hover:bg-primary/10 hover:text-primary",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/login",
                                                onClick: ()=>setMobileMenuOpen(false),
                                                children: t('nav.login')
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                lineNumber: 380,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                            lineNumber: 379,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            size: "sm",
                                            asChild: true,
                                            className: "w-full justify-start shadow-lg shadow-primary/30",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/register",
                                                onClick: ()=>setMobileMenuOpen(false),
                                                children: t('nav.getStarted')
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                                lineNumber: 385,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                                            lineNumber: 384,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                            lineNumber: 228,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                        lineNumber: 227,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
            lineNumber: 80,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/drivewise/web/components/navbar.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, this);
}
_s(Navbar, "zNR0ORCOvYgTULPxaJ9X/VLTfIw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$contexts$2f$language$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = Navbar;
var _c;
__turbopack_context__.k.register(_c, "Navbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/drivewise/web/hooks/use-test-attempts.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useClearAllTestAttempts",
    ()=>useClearAllTestAttempts,
    "useDashboardStats",
    ()=>useDashboardStats,
    "useDeleteTestAttempt",
    ()=>useDeleteTestAttempt,
    "useGlobalDailyStreak",
    ()=>useGlobalDailyStreak,
    "useTestAchievements",
    ()=>useTestAchievements,
    "useTestAttempts",
    ()=>useTestAttempts,
    "useTestCount",
    ()=>useTestCount,
    "useTestHistory",
    ()=>useTestHistory,
    "useWeakTopics",
    ()=>useWeakTopics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/web/utils/supabase/client.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature();
;
;
function useTestAttempts(userId) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'test-attempts',
            userId
        ],
        queryFn: {
            "useTestAttempts.useQuery": async ()=>{
                const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
                const { data: attempts, error } = await supabase.from('test_attempts').select('*').eq('user_id', userId).order('completed_at', {
                    ascending: false
                });
                if (error) throw error;
                return attempts || [];
            }
        }["useTestAttempts.useQuery"],
        enabled: !!userId,
        staleTime: 0,
        refetchOnMount: 'always'
    });
}
_s(useTestAttempts, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useGlobalDailyStreak(userId) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'global-daily-streak',
            userId
        ],
        queryFn: {
            "useGlobalDailyStreak.useQuery": async ()=>{
                const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
                // Get all test attempt dates
                const { data: testAttempts, error: testError } = await supabase.from('test_attempts').select('completed_at').eq('user_id', userId);
                if (testError) throw testError;
                // Get all decision trainer attempt dates
                const { data: dtAttempts, error: dtError } = await supabase.from('decision_trainer_attempts').select('created_at').eq('user_id', userId);
                if (dtError) throw dtError;
                const activeDayTimestamps = [];
                (testAttempts || []).forEach({
                    "useGlobalDailyStreak.useQuery": (a)=>{
                        const d = new Date(a.completed_at);
                        activeDayTimestamps.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime());
                    }
                }["useGlobalDailyStreak.useQuery"]);
                (dtAttempts || []).forEach({
                    "useGlobalDailyStreak.useQuery": (a)=>{
                        const d = new Date(a.created_at);
                        activeDayTimestamps.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime());
                    }
                }["useGlobalDailyStreak.useQuery"]);
                const uniqueDays = [
                    ...new Set(activeDayTimestamps)
                ].sort({
                    "useGlobalDailyStreak.useQuery.uniqueDays": (a, b)=>b - a
                }["useGlobalDailyStreak.useQuery.uniqueDays"]); // newest first
                if (uniqueDays.length === 0) {
                    return {
                        currentStreak: 0,
                        bestStreak: 0
                    };
                }
                // Compute current streak: consecutive days ending today or yesterday
                const now = new Date();
                const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                const yesterdayStart = todayStart - 86400000;
                let currentStreak = 0;
                let bestStreak = 0;
                // Only count streak if last active day is today or yesterday
                if (uniqueDays[0] === todayStart || uniqueDays[0] === yesterdayStart) {
                    currentStreak = 1;
                    bestStreak = 1;
                    for(let i = 1; i < uniqueDays.length; i++){
                        const expectedPrevDay = uniqueDays[i - 1] - 86400000;
                        if (uniqueDays[i] === expectedPrevDay) {
                            currentStreak++;
                            if (currentStreak > bestStreak) {
                                bestStreak = currentStreak;
                            }
                        } else {
                            break;
                        }
                    }
                }
                return {
                    currentStreak,
                    bestStreak
                };
            }
        }["useGlobalDailyStreak.useQuery"],
        enabled: !!userId,
        staleTime: 0,
        refetchOnMount: 'always'
    });
}
_s1(useGlobalDailyStreak, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useTestAchievements(userId) {
    _s2();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'test-achievements',
            userId
        ],
        queryFn: {
            "useTestAchievements.useQuery": async ()=>{
                const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
                // Get all test attempts for this user (ordered oldest -> newest for streak calc)
                const { data: attempts, error: attemptsError } = await supabase.from('test_attempts').select('id, percentage, total_questions, completed_at').eq('user_id', userId).order('completed_at', {
                    ascending: true
                });
                if (attemptsError) throw attemptsError;
                const testAttempts = attempts || [];
                const totalTests = testAttempts.length;
                // Best streak of passed tests in a row
                let bestPassStreak = 0;
                let currentStreak = 0;
                testAttempts.forEach({
                    "useTestAchievements.useQuery": (attempt)=>{
                        const passed = Number(attempt.percentage) >= 80;
                        if (passed) {
                            currentStreak++;
                            if (currentStreak > bestPassStreak) {
                                bestPassStreak = currentStreak;
                            }
                        } else {
                            currentStreak = 0;
                        }
                    }
                }["useTestAchievements.useQuery"]);
                // Total questions answered across all tests (count answers rows)
                let totalQuestionsAnswered = 0;
                if (testAttempts.length > 0) {
                    const attemptIds = testAttempts.map({
                        "useTestAchievements.useQuery.attemptIds": (a)=>a.id
                    }["useTestAchievements.useQuery.attemptIds"]);
                    const { count: answersCount, error: answersError } = await supabase.from('test_attempt_answers').select('*', {
                        count: 'exact',
                        head: true
                    }).in('test_attempt_id', attemptIds);
                    if (answersError) throw answersError;
                    totalQuestionsAnswered = answersCount || 0;
                }
                const firstTestCompleted = totalTests >= 1;
                const fivePassesInRow = bestPassStreak >= 5;
                const hundredQuestionsAnswered = totalQuestionsAnswered >= 100;
                return {
                    totalTests,
                    bestPassStreak,
                    totalQuestionsAnswered,
                    firstTestCompleted,
                    fivePassesInRow,
                    hundredQuestionsAnswered
                };
            }
        }["useTestAchievements.useQuery"],
        enabled: !!userId,
        staleTime: 2 * 60 * 1000
    });
}
_s2(useTestAchievements, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useDashboardStats(userId) {
    _s3();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'dashboard-stats',
            userId
        ],
        queryFn: {
            "useDashboardStats.useQuery": async ()=>{
                const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
                const emptyResult = {
                    stats: {
                        totalTests: 0,
                        averageScore: 0,
                        bestScore: 0,
                        testsThisWeek: 0,
                        streak: 0,
                        passedTests: 0,
                        failedTests: 0
                    },
                    progressData: [],
                    recentTests: []
                };
                try {
                    // Parallelize fetches
                    const [statsRes, progressRes, recentRes, streakRes] = await Promise.all([
                        supabase.rpc('get_dashboard_stats', {
                            p_user_id: userId
                        }),
                        supabase.rpc('get_weekly_progress', {
                            p_user_id: userId
                        }),
                        supabase.rpc('get_recent_tests', {
                            p_user_id: userId,
                            p_limit: 4
                        }),
                        // We still need dates for streak, but we can select JUST dates
                        supabase.from('test_attempts').select('completed_at').eq('user_id', userId).order('completed_at', {
                            ascending: false
                        })
                    ]);
                    if (statsRes.error) throw statsRes.error;
                    if (progressRes.error) throw progressRes.error;
                    if (recentRes.error) throw recentRes.error;
                    const statsData = statsRes.data?.[0] || {
                        total_tests: 0,
                        average_score: 0,
                        best_score: 0,
                        tests_this_week: 0,
                        passed_tests: 0,
                        failed_tests: 0
                    };
                    // Calculate streak
                    const testDates = (streakRes.data || []).map({
                        "useDashboardStats.useQuery.testDates": (test)=>{
                            const date = new Date(test.completed_at);
                            return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
                        }
                    }["useDashboardStats.useQuery.testDates"]);
                    const uniqueDateTimes = [
                        ...new Set(testDates)
                    ].sort({
                        "useDashboardStats.useQuery.uniqueDateTimes": (a, b)=>b - a
                    }["useDashboardStats.useQuery.uniqueDateTimes"]);
                    let streak = 0;
                    const now = new Date();
                    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                    const yesterdayStart = todayStart - 86400000;
                    if (uniqueDateTimes.length > 0 && (uniqueDateTimes[0] === todayStart || uniqueDateTimes[0] === yesterdayStart)) {
                        streak = 1;
                        for(let i = 1; i < uniqueDateTimes.length; i++){
                            const expectedPrevDay = uniqueDateTimes[i - 1] - 86400000;
                            if (uniqueDateTimes[i] === expectedPrevDay) {
                                streak++;
                            } else {
                                break;
                            }
                        }
                    }
                    // Format progress data
                    // Map database rows to 7-day chart format
                    const progressData = [];
                    const dbProgress = progressRes.data || [];
                    for(let i = 6; i >= 0; i--){
                        const d = new Date();
                        d.setDate(d.getDate() - i);
                        const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
                        const dayLabel = [
                            'Sun',
                            'Mon',
                            'Tue',
                            'Wed',
                            'Thu',
                            'Fri',
                            'Sat'
                        ][d.getDay()];
                        const dayStat = dbProgress.find({
                            "useDashboardStats.useQuery.dayStat": (p)=>p.attempt_date === dateStr
                        }["useDashboardStats.useQuery.dayStat"]);
                        progressData.push({
                            date: dayLabel,
                            score: dayStat ? dayStat.daily_avg_score : 0
                        });
                    }
                    // Format recent tests
                    const recentTests = (recentRes.data || []).map({
                        "useDashboardStats.useQuery.recentTests": (test)=>({
                                id: test.id,
                                category: test.category,
                                testNumber: test.test_number || '1',
                                score: Number(test.percentage),
                                date: new Date(test.completed_at).toLocaleDateString(),
                                passed: Number(test.percentage) >= 80
                            })
                    }["useDashboardStats.useQuery.recentTests"]);
                    return {
                        stats: {
                            totalTests: statsData.total_tests,
                            averageScore: statsData.average_score,
                            bestScore: statsData.best_score,
                            testsThisWeek: statsData.tests_this_week,
                            streak: streak,
                            passedTests: statsData.passed_tests,
                            failedTests: statsData.failed_tests
                        },
                        progressData,
                        recentTests
                    };
                } catch (error) {
                    console.error('Dashboard stats error:', error);
                    // Fallback to empty result if RPC fails (e.g. if migration not run)
                    return emptyResult;
                }
            }
        }["useDashboardStats.useQuery"],
        enabled: !!userId,
        staleTime: 2 * 60 * 1000
    });
}
_s3(useDashboardStats, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useTestHistory(userId, page = 1, pageSize = 6) {
    _s4();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'test-history',
            userId,
            page,
            pageSize
        ],
        queryFn: {
            "useTestHistory.useQuery": async ()=>{
                const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
                const from = (page - 1) * pageSize;
                const to = from + pageSize - 1;
                const [attemptsResult, countResult] = await Promise.all([
                    supabase.from('test_attempts').select('*').eq('user_id', userId).order('completed_at', {
                        ascending: false
                    }).range(from, to),
                    supabase.from('test_attempts').select('*', {
                        count: 'exact',
                        head: true
                    }).eq('user_id', userId)
                ]);
                if (attemptsResult.error) throw attemptsResult.error;
                if (countResult.error) throw countResult.error;
                return {
                    tests: attemptsResult.data || [],
                    totalCount: countResult.count || 0,
                    totalPages: Math.ceil((countResult.count || 0) / pageSize)
                };
            }
        }["useTestHistory.useQuery"],
        enabled: !!userId,
        staleTime: 0,
        refetchOnMount: 'always'
    });
}
_s4(useTestHistory, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useDeleteTestAttempt() {
    _s5();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteTestAttempt.useMutation": async (testId)=>{
                const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
                const { error } = await supabase.from('test_attempts').delete().eq('id', testId);
                if (error) throw error;
            }
        }["useDeleteTestAttempt.useMutation"],
        onSuccess: {
            "useDeleteTestAttempt.useMutation": ()=>{
                // Invalidate related queries
                queryClient.invalidateQueries({
                    queryKey: [
                        'test-attempts'
                    ]
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        'dashboard-stats'
                    ]
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        'test-history'
                    ]
                });
            }
        }["useDeleteTestAttempt.useMutation"]
    });
}
_s5(useDeleteTestAttempt, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useClearAllTestAttempts() {
    _s6();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useClearAllTestAttempts.useMutation": async (userId)=>{
                const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
                const { error } = await supabase.from('test_attempts').delete().eq('user_id', userId);
                if (error) throw error;
            }
        }["useClearAllTestAttempts.useMutation"],
        onSuccess: {
            "useClearAllTestAttempts.useMutation": ()=>{
                // Invalidate related queries
                queryClient.invalidateQueries({
                    queryKey: [
                        'test-attempts'
                    ]
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        'dashboard-stats'
                    ]
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        'test-history'
                    ]
                });
            }
        }["useClearAllTestAttempts.useMutation"]
    });
}
_s6(useClearAllTestAttempts, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useTestCount(category, enabled = true) {
    _s7();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'test-count',
            category
        ],
        queryFn: {
            "useTestCount.useQuery": async ()=>{
                const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
                const { data, error } = await supabase.from('admin_questions').select('test_number').eq('category', category);
                if (error) throw error;
                // Get unique test numbers
                const uniqueTests = [
                    ...new Set((data || []).map({
                        "useTestCount.useQuery": (q)=>q.test_number
                    }["useTestCount.useQuery"]))
                ];
                return uniqueTests.length;
            }
        }["useTestCount.useQuery"],
        staleTime: 10 * 60 * 1000,
        enabled: enabled && !!category
    });
}
_s7(useTestCount, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useWeakTopics(userId) {
    _s8();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'weak-topics',
            userId
        ],
        queryFn: {
            "useWeakTopics.useQuery": async ()=>{
                const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
                // 1) Get all test attempts for this user (limit to last 50 for performance/stability)
                const { data: attempts, error: attemptsError } = await supabase.from('test_attempts').select('id').eq('user_id', userId).order('completed_at', {
                    ascending: false
                }).limit(50);
                if (attemptsError) throw attemptsError;
                const attemptIds = (attempts || []).map({
                    "useWeakTopics.useQuery.attemptIds": (a)=>a.id
                }["useWeakTopics.useQuery.attemptIds"]);
                if (attemptIds.length === 0) {
                    return {
                        topics: [],
                        weakTopics: [],
                        dominantCategory: null
                    };
                }
                // 2) Get all answers for those attempts
                const { data: answers, error: answersError } = await supabase.from('test_attempt_answers').select('question_id, is_correct').in('test_attempt_id', attemptIds);
                if (answersError) throw answersError;
                if (!answers || answers.length === 0) {
                    return {
                        topics: [],
                        weakTopics: [],
                        dominantCategory: null
                    };
                }
                const questionIds = [
                    ...new Set(answers.map({
                        "useWeakTopics.useQuery": (a)=>a.question_id
                    }["useWeakTopics.useQuery"]))
                ];
                // 3) Get topics AND categories for those questions
                const { data: questions, error: questionsError } = await supabase.from('admin_questions').select('id, topic, category').in('id', questionIds);
                if (questionsError) throw questionsError;
                const topicByQuestionId = new Map();
                (questions || []).forEach({
                    "useWeakTopics.useQuery": (q)=>{
                        topicByQuestionId.set(q.id, {
                            topic: q.topic ?? null,
                            category: q.category ?? null
                        });
                    }
                }["useWeakTopics.useQuery"]);
                const topicStatsMap = {};
                answers.forEach({
                    "useWeakTopics.useQuery": (ans)=>{
                        const info = topicByQuestionId.get(ans.question_id);
                        if (!info || !info.topic) return;
                        const topic = info.topic;
                        if (!topicStatsMap[topic]) {
                            topicStatsMap[topic] = {
                                total: 0,
                                correct: 0,
                                category: info.category
                            };
                        }
                        topicStatsMap[topic].total += 1;
                        if (ans.is_correct) {
                            topicStatsMap[topic].correct += 1;
                        }
                    }
                }["useWeakTopics.useQuery"]);
                const topics = Object.entries(topicStatsMap).map({
                    "useWeakTopics.useQuery.topics": ([topic, stats])=>{
                        const accuracy = stats.total > 0 ? stats.correct / stats.total : 0;
                        return {
                            topic,
                            totalQuestions: stats.total,
                            correct: stats.correct,
                            accuracy
                        };
                    }
                }["useWeakTopics.useQuery.topics"]).sort({
                    "useWeakTopics.useQuery.topics": (a, b)=>a.accuracy - b.accuracy
                }["useWeakTopics.useQuery.topics"]);
                const weakTopics = topics.filter({
                    "useWeakTopics.useQuery.weakTopics": (t)=>t.totalQuestions >= 3 && t.accuracy < 0.8
                }["useWeakTopics.useQuery.weakTopics"]).slice(0, 5);
                // Determine dominant category from weak topics
                const categoryCounts = {};
                weakTopics.forEach({
                    "useWeakTopics.useQuery": (wt)=>{
                        const cat = topicStatsMap[wt.topic]?.category;
                        if (cat) {
                            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
                        }
                    }
                }["useWeakTopics.useQuery"]);
                let dominantCategory = null;
                let maxCount = 0;
                Object.entries(categoryCounts).forEach({
                    "useWeakTopics.useQuery": ([cat, count])=>{
                        if (count > maxCount) {
                            maxCount = count;
                            dominantCategory = cat;
                        }
                    }
                }["useWeakTopics.useQuery"]);
                // Fallback: if no dominant category found from weak topics (e.g. empty), use the most frequent category from all topics
                if (!dominantCategory && topics.length > 0) {
                    const allCategoryCounts = {};
                    Object.values(topicStatsMap).forEach({
                        "useWeakTopics.useQuery": (stats)=>{
                            if (stats.category) {
                                allCategoryCounts[stats.category] = (allCategoryCounts[stats.category] || 0) + 1;
                            }
                        }
                    }["useWeakTopics.useQuery"]);
                    let allMaxCount = 0;
                    Object.entries(allCategoryCounts).forEach({
                        "useWeakTopics.useQuery": ([cat, count])=>{
                            if (count > allMaxCount) {
                                allMaxCount = count;
                                dominantCategory = cat;
                            }
                        }
                    }["useWeakTopics.useQuery"]);
                }
                return {
                    topics,
                    weakTopics,
                    dominantCategory
                };
            }
        }["useWeakTopics.useQuery"],
        enabled: !!userId,
        staleTime: 2 * 60 * 1000
    });
}
_s8(useWeakTopics, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CategoryPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/web/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$ui$2f$glass$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/web/components/ui/glass-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/web/components/ui/skeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$types$2f$database$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/web/types/database.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/lucide-react/dist/esm/icons/target.js [app-client] (ecmascript) <export default as Target>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shuffle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shuffle$3e$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/lucide-react/dist/esm/icons/shuffle.js [app-client] (ecmascript) <export default as Shuffle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/lucide-react/dist/esm/icons/brain.js [app-client] (ecmascript) <export default as Brain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/web/components/navbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$contexts$2f$language$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/web/contexts/language-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$hooks$2f$use$2d$test$2d$attempts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/web/hooks/use-test-attempts.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/drivewise/web/contexts/auth-context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
function CategoryPage({ params }) {
    _s();
    const { t, language } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$contexts$2f$language$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"])();
    const isSq = language === 'sq';
    const { user, loading: authLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { category: categoryParam } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(params);
    const category = categoryParam.toUpperCase();
    // Validate category
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$types$2f$database$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CATEGORY_INFO"][category]) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notFound"])();
    }
    // Use TanStack Query for data fetching (must be called unconditionally before any early returns)
    const { data: testCount = 0, isLoading: loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$hooks$2f$use$2d$test$2d$attempts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTestCount"])(category);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CategoryPage.useEffect": ()=>{
            if (!authLoading && !user) {
                router.push('/login');
            }
        }
    }["CategoryPage.useEffect"], [
        authLoading,
        user,
        router
    ]);
    if (!user) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-background flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                        lineNumber: 49,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground",
                        children: authLoading ? 'Authenticating...' : 'Redirecting...'
                    }, void 0, false, {
                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                        lineNumber: 50,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                lineNumber: 48,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
            lineNumber: 47,
            columnNumber: 7
        }, this);
    }
    const categoryInfo = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$types$2f$database$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CATEGORY_INFO"][category];
    const mockTests = Array.from({
        length: testCount
    }, (_, i)=>i + 1);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative min-h-screen bg-background text-foreground overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "aria-hidden": true,
                className: "pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_60%_at_50%_20%,#000_20%,transparent_70%)]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "h-full w-full opacity-[0.06]",
                    xmlns: "http://www.w3.org/2000/svg",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pattern", {
                                id: "cat-detail-grid",
                                width: "32",
                                height: "32",
                                patternUnits: "userSpaceOnUse",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M32 0H0V32",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "0.4"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                    lineNumber: 71,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                lineNumber: 70,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                            width: "100%",
                            height: "100%",
                            fill: "url(#cat-detail-grid)"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                            lineNumber: 74,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-orange-500/20 via-transparent to-transparent blur-3xl"
            }, void 0, false, {
                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "aria-hidden": true,
                className: "pointer-events-none absolute inset-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden lg:block absolute top-24 bottom-24 left-[10%] w-px bg-gradient-to-b from-transparent via-orange-500/20 to-transparent"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden lg:block absolute top-24 bottom-24 right-[10%] w-px bg-gradient-to-b from-transparent via-orange-500/20 to-transparent"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Navbar"], {}, void 0, false, {
                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "pt-32 pb-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4 max-w-6xl relative",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$ui$2f$glass$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GlassCard"], {
                        className: "relative overflow-hidden p-6 md:p-8 border border-border/80 bg-black/85",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl opacity-60"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                lineNumber: 91,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4 max-w-xl",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-[11px] font-medium text-orange-300",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                                        className: "w-3.5 h-3.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                        lineNumber: 95,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "uppercase tracking-wider",
                                                        children: t('category.licenseCategory')
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                        lineNumber: 96,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                lineNumber: 94,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                        className: "text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight",
                                                        children: categoryInfo.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                        lineNumber: 99,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm md:text-base text-muted-foreground leading-relaxed",
                                                        children: categoryInfo.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                        lineNumber: 102,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                lineNumber: 98,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                        lineNumber: 93,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col sm:flex-row gap-3 w-full md:w-auto md:justify-end",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 rounded-xl bg-black/60 border border-border/60 px-4 py-3 backdrop-blur-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-2 rounded-lg bg-orange-500/10 text-orange-400",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                            lineNumber: 111,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                        lineNumber: 110,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-semibold text-sm",
                                                                children: [
                                                                    loading ? '...' : testCount,
                                                                    " ",
                                                                    t('category.mockTests')
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                                lineNumber: 114,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-muted-foreground text-[10px]",
                                                                children: t('category.mock_tests_hint')
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                                lineNumber: 117,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                        lineNumber: 113,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                lineNumber: 109,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 rounded-xl bg-black/60 border border-border/60 px-4 py-3 backdrop-blur-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-2 rounded-lg bg-blue-500/10 text-blue-400",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                            lineNumber: 124,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                        lineNumber: 123,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-semibold text-sm",
                                                                children: [
                                                                    "~10 ",
                                                                    t('category.minutesEach')
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                                lineNumber: 127,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-muted-foreground text-[10px]",
                                                                children: t('category.perTestApprox')
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                                lineNumber: 130,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                        lineNumber: 126,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                lineNumber: 122,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                        lineNumber: 108,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                lineNumber: 92,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                        lineNumber: 90,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "pb-16",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4 max-w-6xl",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid gap-6 md:grid-cols-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$ui$2f$glass$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GlassCard"], {
                                        className: "group relative overflow-hidden border border-orange-500/30 bg-gradient-to-br from-orange-500/5 via-black/80 to-black/90 p-6 hover:border-orange-500/50 transition-all duration-300",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform duration-300",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shuffle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shuffle$3e$__["Shuffle"], {
                                                        className: "w-6 h-6"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                        lineNumber: 151,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                    lineNumber: 150,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "text-lg font-semibold group-hover:text-orange-100 transition-colors",
                                                            children: isSq ? 'Test i Përzier' : 'Mixed Question Test'
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                            lineNumber: 154,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-muted-foreground",
                                                            children: isSq ? 'Pyetje të rastësishme nga të gjitha testet për një sfidë reale.' : 'Random questions from all tests in this category for a full challenge.'
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                            lineNumber: 157,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                    lineNumber: 153,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    size: "sm",
                                                    className: "mt-4 sm:mt-0 w-full sm:w-auto shadow-lg shadow-orange-500/20 bg-orange-600 hover:bg-orange-500 text-white border-none",
                                                    asChild: true,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: `/test/${category.toLowerCase()}/mixed`,
                                                        children: [
                                                            isSq ? 'Fillo tani' : 'Start mixed',
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                                className: "w-4 h-4 ml-2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                                lineNumber: 170,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                        lineNumber: 168,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                    lineNumber: 163,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                            lineNumber: 149,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                        lineNumber: 148,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$ui$2f$glass$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GlassCard"], {
                                        className: "group relative overflow-hidden border border-purple-500/30 bg-gradient-to-br from-purple-500/5 via-black/80 to-black/90 p-6 hover:border-purple-500/50 transition-all duration-300",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-300",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__["Brain"], {
                                                        className: "w-6 h-6"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                        lineNumber: 179,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                    lineNumber: 178,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "text-lg font-semibold group-hover:text-purple-100 transition-colors",
                                                            children: isSq ? 'Test i Personalizuar' : 'Personalized Test'
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                            lineNumber: 182,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-muted-foreground",
                                                            children: isSq ? 'Fokusohuni në pyetjet që keni gabuar më parë.' : 'Focus on questions you previously missed to fix weak spots.'
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                            lineNumber: 185,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                    lineNumber: 181,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    size: "sm",
                                                    className: "mt-4 sm:mt-0 w-full sm:w-auto shadow-lg shadow-purple-500/20 bg-purple-600 hover:bg-purple-500 text-white border-none",
                                                    asChild: true,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: `/test/${category.toLowerCase()}/personalized`,
                                                        children: [
                                                            isSq ? 'Fillo tani' : 'Start personalized',
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                                className: "w-4 h-4 ml-2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                                lineNumber: 198,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                        lineNumber: 196,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                    lineNumber: 191,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                            lineNumber: 177,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                        lineNumber: 176,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                lineNumber: 147,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-2 mb-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-2xl font-semibold tracking-tight flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                        className: "w-5 h-5 text-orange-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                        lineNumber: 209,
                                                        columnNumber: 19
                                                    }, this),
                                                    isSq ? 'Testet e rregullta' : 'Standard Mock Tests'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                lineNumber: 208,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: loading ? 'Loading tests...' : testCount > 0 ? isSq ? `Zgjidhni nga ${testCount} teste zyrtare për këtë kategori.` : `Choose from ${testCount} exam-style mock tests for this category.` : t('category.noTestsDescription')
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                lineNumber: 212,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                        lineNumber: 207,
                                        columnNumber: 15
                                    }, this),
                                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5",
                                        children: Array.from({
                                            length: 6
                                        }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$ui$2f$glass$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GlassCard"], {
                                                className: "h-40 flex flex-col items-center justify-center p-6 space-y-4 border-border/50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                        className: "w-12 h-12 rounded-full"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                        lineNumber: 230,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full space-y-2 text-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                className: "h-4 w-20 mx-auto"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                                lineNumber: 232,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                className: "h-3 w-16 mx-auto"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                                lineNumber: 233,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                        lineNumber: 231,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                lineNumber: 226,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                        lineNumber: 224,
                                        columnNumber: 17
                                    }, this) : testCount === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$ui$2f$glass$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GlassCard"], {
                                        className: "p-8 text-center border border-border/80 bg-black/80",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-semibold mb-2",
                                                children: t('category.noTestsTitle')
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                lineNumber: 240,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: t('category.noTestsDescription')
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                lineNumber: 241,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                        lineNumber: 239,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5",
                                        children: mockTests.map((testNumber)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: `/test/${category.toLowerCase()}/${testNumber}`,
                                                className: "group block h-full",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$components$2f$ui$2f$glass$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GlassCard"], {
                                                    className: "relative h-full p-6 border border-border/60 bg-black/60 hover:bg-black/80 hover:border-orange-500/40 transition-all duration-300 flex flex-col items-center justify-center gap-4 group-hover:shadow-[0_0_30px_rgba(249,115,22,0.1)]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-14 h-14 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-500/20 transition-all duration-300",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xl font-bold text-orange-400 font-mono",
                                                                children: testNumber
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                                lineNumber: 253,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                            lineNumber: 252,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-center space-y-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-medium group-hover:text-orange-100 transition-colors",
                                                                    children: [
                                                                        "Test ",
                                                                        testNumber
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                                    lineNumber: 259,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-[10px] uppercase tracking-wider text-muted-foreground",
                                                                    children: [
                                                                        "10 ",
                                                                        t('category.questions')
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                                    lineNumber: 262,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                            lineNumber: 258,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                            lineNumber: 267,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                    lineNumber: 251,
                                                    columnNumber: 23
                                                }, this)
                                            }, testNumber, false, {
                                                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                                lineNumber: 246,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                        lineNumber: 244,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                                lineNumber: 206,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                        lineNumber: 144,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                    lineNumber: 143,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
                lineNumber: 142,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/drivewise/web/app/(pages)/category/[category]/page.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
_s(CategoryPage, "twx9qkK8Vp+W+ZEPezGnfmwDZjI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$contexts$2f$language$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$drivewise$2f$web$2f$hooks$2f$use$2d$test$2d$attempts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTestCount"]
    ];
});
_c = CategoryPage;
var _c;
__turbopack_context__.k.register(_c, "CategoryPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_drivewise_web_af4d349b._.js.map