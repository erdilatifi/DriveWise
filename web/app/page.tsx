"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  animate,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Car,
  Bike,
  Truck,
  Bus,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Activity,
  BarChart3,
  Lock,
  Sparkles,
  Check,
  ChevronDown,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { CATEGORY_INFO, type LicenseCategory } from "@/types/database";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

const categoryIcons: Record<LicenseCategory, ReactNode> = {
  A: <Bike className="w-8 h-8" />,
  B: <Car className="w-8 h-8" />,
  C: <Truck className="w-8 h-8" />,
  D: <Bus className="w-8 h-8" />,
};

const subtleRise = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const headlineWord = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
};

const marqueeItems = [
  "Teste Provuese Reale",
  "Decision Trainer",
  "Materiale Mësimore",
  "Analitika e Përparimit",
  "Kategoria A · B · C · D",
  "XP & Seri Ditore",
  "Rishikim me Shpjegime",
];

const GRAIN =
  'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 256 256\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")';

export default function HomePage() {
  const { t } = useLanguage();
  const router = useRouter();

  const categories = useMemo(
    () => Object.keys(CATEGORY_INFO) as LicenseCategory[],
    []
  );

  // Clear email-confirmation auto-session and route to login
  useEffect(() => {
    if (typeof window === "undefined") return;

    const search = window.location.search;
    const hash = window.location.hash || "";
    const params = new URLSearchParams(search);
    const type = params.get("type");
    const hasCode = params.has("code");

    const fromEmailConfirm =
      type === "signup" || hash.includes("access_token=") || hasCode;

    if (!fromEmailConfirm) return;

    const supabase = createClient();
    supabase.auth.signOut().catch((err) => {
      console.error("Error clearing session after email confirm on home:", err);
    });

    router.replace("/login");
  }, [router]);

  const featured = useMemo<LicenseCategory>(() => {
    return (
      (["B", ...categories].find((c) =>
        categories.includes(c as LicenseCategory)
      ) ?? categories[0]) as LicenseCategory
    );
  }, [categories]);

  // Fake weekly progress data for the hero chart
  const weeklyData = useMemo(
    () => [
      { day: "Mon", score: 62 },
      { day: "Tue", score: 74 },
      { day: "Wed", score: 68 },
      { day: "Thu", score: 82 },
      { day: "Fri", score: 79 },
      { day: "Sat", score: 91 },
      { day: "Sun", score: 88 },
    ],
    []
  );

  const faqs = useMemo(
    () => [
      {
        q: "A funksionon DriveWise në telefon?",
        a: "Po, platforma është plotësisht e përshtatur për telefon, tablet dhe kompjuter, kështu që mund të praktikosh kudo qofsh.",
      },
      {
        q: "Çfarë përfshin secili plan?",
        a: "Çdo plan zhbllokon një kategori patente (A, B, C ose D) me teste provuese të pakufizuara, Decision Trainer të plotë, materiale mësimore dhe rishikim të detajuar të përgjigjeve.",
      },
      {
        q: "A mund të shtoj më shumë kategori më vonë?",
        a: "Po, mund të shtosh kategori shtesë në çdo kohë nga faqja e çmimeve, pa humbur progresin që ke bërë deri atëherë.",
      },
      {
        q: "Si funksionon garancia e kthimit të parave?",
        a: "Nëse nuk je i kënaqur, ke 30 ditë kohë për një rimbursim të plotë, pa pyetje shtesë.",
      },
      {
        q: "A është e sigurt pagesa?",
        a: "Të gjitha pagesat përpunohen përmes Paddle, një procesor global i pagesave. Ne nuk i shohim apo ruajmë kurrë të dhënat e kartës tënde.",
      },
    ],
    []
  );
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // 3D tilt for the hero preview card
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const tiltXSpring = useSpring(tiltX, { stiffness: 150, damping: 20 });
  const tiltYSpring = useSpring(tiltY, { stiffness: 150, damping: 20 });

  const handleCardTilt = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    tiltY.set(((e.clientX - rect.left) / rect.width - 0.5) * 5);
    tiltX.set(-((e.clientY - rect.top) / rect.height - 0.5) * 5);
  };
  const resetCardTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <main className="relative w-full min-h-screen bg-background text-foreground overflow-hidden">
      {/* Film grain texture */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[55] opacity-[0.04] mix-blend-soft-light"
        style={{ backgroundImage: GRAIN }}
      />

      {/* Soft background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_60%_at_50%_30%,#000_20%,transparent_70%)]"
      >
        <svg
          className="h-full w-full opacity-[0.07]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M32 0H0V32"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.6"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Warm hero glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(249,115,22,0.28),transparent_70%)]" />

      <Navbar />

      {/* HERO */}
      <section className="relative pt-36 md:pt-44">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              variants={fadeUp}
              className="mx-auto mb-8 inline-flex items-center gap-3 rounded-full border border-border/70 bg-black/40 px-3 py-1.5 backdrop-blur"
            >
              <Badge
                variant="outline"
                className="gap-2 px-3 py-1 bg-orange-500/10 border-orange-500/40 text-xs text-orange-400 font-medium inline-flex items-center"
              >
                <Zap className="w-4 h-4" />
                Kosovo Driving Theory
              </Badge>
              <span className="hidden sm:inline text-[11px] text-muted-foreground pr-1">
                {t("home.hero.badge")}
              </span>
            </motion.div>

            <motion.h1
              variants={stagger}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.02] tracking-[-0.045em]"
            >
              <motion.span
                variants={headlineWord}
                className="inline-block mr-[0.22em]"
              >
                Master
              </motion.span>
              <motion.span variants={headlineWord} className="inline-block">
                your
              </motion.span>
              <br />
              <motion.span
                variants={headlineWord}
                className="inline-block text-transparent bg-clip-text bg-[linear-gradient(110deg,#fb923c_25%,#fdba74_40%,#ffffff_50%,#fdba74_60%,#fb923c_75%)] bg-[length:200%_auto] animate-shimmer motion-reduce:animate-none pb-2"
              >
                Driving Theory Exam
              </motion.span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              {t("home.hero.description")}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                asChild
                className="relative h-13 min-h-12 px-9 text-base font-semibold shadow-lg shadow-orange-500/35 overflow-hidden"
              >
                <Link href="/register">
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-300 opacity-90" />
                  <span className="relative text-black inline-flex items-center gap-2">
                    {t("home.hero.startLearning")}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-13 min-h-12 px-9 text-base font-semibold border-border/70 bg-black/40 backdrop-blur hover:bg-black/60"
              >
                <Link href="#categories">{t("home.hero.browseCategories")}</Link>
              </Button>
            </motion.div>

            {/* Mobile apps */}
            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col items-center gap-3"
            >
              <p className="text-xs text-muted-foreground">
                {t("home.hero.mobileComingSoon")}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 px-4 rounded-xl border-border/70 bg-black/50 hover:bg-black/70 flex items-center gap-2"
                  type="button"
                >
                  <FaApple className="w-4 h-4 text-foreground" />
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                      {t("home.hero.mobileBadge")}
                    </span>
                    <span className="text-xs font-semibold">
                      {t("home.hero.appStoreCta")}
                    </span>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 px-4 rounded-xl border-border/70 bg-black/50 hover:bg-black/70 flex items-center gap-2"
                  type="button"
                >
                  <FaGooglePlay className="w-4 h-4 text-foreground" />
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                      {t("home.hero.mobileBadge")}
                    </span>
                    <span className="text-xs font-semibold">
                      {t("home.hero.playStoreCta")}
                    </span>
                  </div>
                </Button>
              </div>
            </motion.div>
          </motion.div>

          {/* Wide dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 90, rotateX: 16 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE, delay: 0.35 }}
            style={{ transformPerspective: 1200 }}
            className="relative mx-auto mt-16 md:mt-20 max-w-5xl"
          >
            <div className="pointer-events-none absolute -inset-x-10 -top-10 bottom-0 rounded-[3rem] bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.22),transparent_60%)] blur-2xl" />

            <motion.div
              style={{
                rotateX: tiltXSpring,
                rotateY: tiltYSpring,
                transformStyle: "preserve-3d",
              }}
              onMouseMove={handleCardTilt}
              onMouseLeave={resetCardTilt}
            >
              <GlassCard className="relative rounded-[2rem] border border-white/10 bg-black/70 p-5 md:p-8 shadow-[0_40px_140px_rgba(0,0,0,0.9)]">
                <div className="flex items-center justify-between mb-5 relative">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
                    <span>Live learning snapshot</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-orange-400/60 bg-orange-500/10 text-[10px] font-semibold uppercase tracking-wide"
                  >
                    Real exam feel
                  </Badge>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  {/* Chart */}
                  <div className="lg:col-span-2 rounded-2xl border border-border/70 bg-black/70 p-4 relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <BarChart3 className="w-3.5 h-3.5" />
                        Weekly progress
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        Last 7 days
                      </span>
                    </div>
                    <div className="h-52 w-full">
                      <WeeklySparkline data={weeklyData} />
                    </div>
                  </div>

                  {/* Stats column */}
                  <div className="flex flex-col gap-3">
                    <MiniStat
                      label="Avg. score"
                      value={<CountUp to={86} suffix="%" />}
                      trend="+12%"
                    />
                    <MiniStat
                      label="This week"
                      value={
                        <>
                          <CountUp to={14} /> tests
                        </>
                      }
                      trend="+5"
                    />
                    <MiniStat
                      label="XP earned"
                      value={<CountUp to={3420} />}
                      trend="+220"
                    />
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-border/70 bg-black/70 p-4 flex flex-col gap-2.5 relative">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold">Decision Trainer</span>
                      <span className="text-muted-foreground">
                        Hazards · Lvl 3
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <div className="h-1.5 flex-1 rounded-full bg-orange-500/10 overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-orange-500 to-orange-300" />
                      </div>
                      <span className="text-muted-foreground">
                        XP 240 / 320
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Strict answer check</span>
                      <span className="inline-flex items-center gap-1">
                        <Shield className="w-3 h-3" /> 98% accuracy
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-black/70 p-4 flex flex-col gap-2.5 relative">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold">
                        {t("dashboard.testHistoryTitle")}
                      </span>
                      <span className="text-muted-foreground">
                        Mock Test · B
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                      <span>• 30 questions</span>
                      <span>• Focus on mistakes</span>
                      <span>• Full answer review</span>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-3 text-[11px]"
                      >
                        {t("categories.startPractice")}
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>

          {/* Quick-start banner for new visitors */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
            className="relative mx-auto mt-8 mb-20 md:mb-24 max-w-3xl overflow-hidden rounded-2xl border border-orange-500/25 bg-gradient-to-r from-orange-500/10 via-black/40 to-black/40 px-4 py-3.5 sm:px-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/25">
                  <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-[13px] text-foreground/90 leading-snug">
                  {t("home.hero.newHereTitle")}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/category/b"
                  className="inline-flex items-center gap-1 rounded-lg border border-orange-400/50 bg-orange-500/10 px-3 py-1.5 text-[11px] font-semibold text-orange-200 hover:bg-orange-500/20 transition-colors whitespace-nowrap"
                >
                  {t("home.hero.newHereCtaCategory")}
                </Link>
                <Link
                  href="/materials"
                  className="inline-flex items-center gap-1 rounded-lg border border-border/70 px-3 py-1.5 text-[11px] font-semibold text-foreground/80 hover:text-foreground hover:border-foreground/40 transition-colors whitespace-nowrap"
                >
                  {t("home.hero.newHereCtaMaterials")}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE STRIP */}
      <div className="relative border-y border-border/60 bg-black/50 py-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee motion-reduce:animate-none">
          {[0, 1].map((half) => (
            <div
              key={half}
              aria-hidden={half === 1}
              className="flex items-center gap-10 pr-10"
            >
              {marqueeItems.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground/80 whitespace-nowrap"
                >
                  <span className="h-1 w-1 rounded-full bg-orange-400/80" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* STATS BAND */}
      <section className="relative">
        <div className="container mx-auto px-4 sm:px-6 py-20 md:py-24">
          <motion.div
            {...subtleRise}
            className="mx-auto max-w-6xl grid grid-cols-2 lg:grid-cols-4 gap-px rounded-3xl overflow-hidden border border-border/60 bg-border/40"
          >
            {[
              { value: 4, suffix: "", label: "Kategori patente" },
              { value: 10, suffix: "+", label: "Teste për kategori" },
              { value: 30, suffix: "", label: "Pyetje për test" },
              { value: 13, suffix: "", label: "Kapituj mësimore" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-black/80 px-6 py-10 md:py-12 text-center"
              >
                <div className="text-5xl md:text-6xl font-bold tracking-tight">
                  <CountUp to={stat.value} />
                  <span className="text-orange-400">{stat.suffix}</span>
                </div>
                <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS — editorial rows */}
      <section className="relative border-t border-border/60">
        <div className="container mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-black/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-5">
                <span className="h-1.5 w-8 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full" />
                {t("dashboard.onboardingTitle")}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
                {t("home.benefit.title")}
              </h2>
              <p className="mt-4 text-base md:text-lg text-muted-foreground">
                {t("home.benefit.body")}
              </p>
            </div>

            <div>
              {[
                {
                  n: "01",
                  title: t("auth.createAccount"),
                  body: t("auth.createAccountDescription"),
                  href: "/register",
                },
                {
                  n: "02",
                  title: t("categories.title"),
                  body: t("categories.description"),
                  href: "#categories",
                },
                {
                  n: "03",
                  title: t("trainer.title"),
                  body: t("trainer.heroExplainer"),
                  href: "/decision-trainer",
                },
                {
                  n: "04",
                  title: t("features.progress.title"),
                  body: t("features.progress.desc"),
                  href: "/dashboard",
                },
              ].map((step, i) => (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
                >
                  <Link
                    href={step.href}
                    className="group grid grid-cols-[3.5rem_1fr_auto] sm:grid-cols-[6rem_1fr_auto] items-center gap-4 sm:gap-8 border-t border-border/60 py-8 md:py-10 last:border-b transition-colors hover:bg-white/[0.02]"
                  >
                    <span className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold text-white/10 group-hover:text-orange-400/50 transition-colors duration-300">
                      {step.n}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight group-hover:text-orange-200 transition-colors">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
                        {step.body}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground/40 group-hover:text-orange-300 group-hover:translate-x-1.5 transition-all duration-300 shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU UNLOCK — bento grid */}
      <section className="relative border-t border-border/60">
        <div className="container mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-14 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-black/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <span className="h-1.5 w-8 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full" />
                {t("home.trust.badge")}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
                {t("home.trust.title")}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("home.trust.body")}
              </p>
            </div>

            <div className="grid md:grid-cols-6 gap-4">
              {/* Mock tests — large tile */}
              <BentoTile className="md:col-span-4 p-7 md:p-9">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/20 mb-5">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">
                  {t("features.comprehensive.title")}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg">
                  {t("features.comprehensive.desc")}
                </p>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {categories.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-black/60 px-3.5 py-2 text-xs font-semibold text-foreground/90"
                    >
                      <span className="text-orange-300 [&_svg]:w-4 [&_svg]:h-4">
                        {categoryIcons[c]}
                      </span>
                      Kategoria {c}
                    </span>
                  ))}
                </div>
              </BentoTile>

              {/* Decision Trainer */}
              <BentoTile className="md:col-span-2 p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/20 mb-5">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight mb-2">
                  {t("trainer.title")}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("trainer.heroExplainer")}
                </p>
                <div className="mt-5 flex items-center gap-2 text-[11px]">
                  <div className="h-1.5 flex-1 rounded-full bg-orange-500/10 overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-orange-500 to-orange-300" />
                  </div>
                  <span className="text-muted-foreground">XP 240 / 320</span>
                </div>
              </BentoTile>

              {/* Materials */}
              <BentoTile className="md:col-span-2 p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/20 mb-5">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight mb-2">
                  {t("materials.title")}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("materials.subtitle")}
                </p>
                <ul className="mt-5 space-y-1.5 text-xs text-muted-foreground">
                  <li className="truncate">{t("materials.section.1")}</li>
                  <li className="truncate">{t("materials.section.5")}</li>
                  <li className="truncate">{t("materials.section.9")}</li>
                </ul>
              </BentoTile>

              {/* Analytics */}
              <BentoTile className="md:col-span-2 p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/20 mb-5">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight mb-2">
                  {t("features.progress.title")}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("features.progress.desc")}
                </p>
                <div className="mt-5 flex items-end gap-2">
                  <span className="text-3xl font-bold tracking-tight">
                    <CountUp to={86} suffix="%" />
                  </span>
                  <span className="mb-1 text-[11px] text-orange-300">
                    +12% këtë javë
                  </span>
                </div>
              </BentoTile>

              {/* History */}
              <BentoTile className="md:col-span-2 p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/20 mb-5">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight mb-2">
                  {t("dashboard.testHistoryTitle")}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Çdo test ruhet me rishikim të plotë të përgjigjeve dhe
                  shpjegime, që të mësosh nga çdo gabim.
                </p>
              </BentoTile>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="relative border-t border-border/60">
        <div className="container mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
                {t("categories.title")}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("categories.description")}
              </p>
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
              {/* FEATURED CATEGORY */}
              <motion.div
                {...subtleRise}
                whileHover={{
                  y: -6,
                  transition: { type: "spring", stiffness: 300, damping: 22 },
                }}
                className="lg:col-span-2 flex relative"
              >
                <Link
                  href={`/category/${featured.toLowerCase()}`}
                  className="flex-1"
                >
                  <div className="group relative overflow-hidden rounded-3xl border border-border/80 bg-black/80 h-full flex flex-col hover:border-orange-400/70 transition-all duration-300">
                    <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border border-dashed border-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="pointer-events-none absolute -bottom-8 left-6 h-40 w-40 rounded-full bg-orange-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 p-7 md:p-10 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/60 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-300">
                          {t("categories.popular")}
                        </div>

                        <h3 className="mt-5 text-3xl md:text-5xl font-bold tracking-tight">
                          {CATEGORY_INFO[featured].name}
                        </h3>
                        <p className="mt-3 text-muted-foreground max-w-2xl text-sm md:text-base">
                          {CATEGORY_INFO[featured].description}
                        </p>
                      </div>

                      <div className="mt-8 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-orange-300 font-semibold group-hover:gap-3 transition-all text-sm md:text-base">
                          <span>{t("categories.startPractice")}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-orange-500/15 flex items-center justify-center text-orange-400">
                          {categoryIcons[featured]}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* OTHER CATEGORIES */}
              <div className="relative flex flex-col gap-5">
                {categories
                  .filter((c) => c !== featured)
                  .map((category, i) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      whileHover={{
                        x: 4,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 22,
                        },
                      }}
                      transition={{ duration: 0.45, delay: i * 0.08 }}
                      className="relative flex-1"
                    >
                      <Link
                        href={`/category/${category.toLowerCase()}`}
                        className="block h-full"
                      >
                        <div className="group relative h-full overflow-hidden rounded-3xl border border-border/80 bg-black/80 p-6 hover:border-orange-400/70 transition-all duration-300">
                          <div className="pointer-events-none absolute -bottom-8 left-6 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          <div className="relative flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-500/15 flex items-center justify-center text-orange-300 shrink-0">
                              {categoryIcons[category]}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="text-lg font-semibold tracking-tight truncate">
                                  {CATEGORY_INFO[category].name}
                                </h4>
                                <span className="inline-flex rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                                  {`Cat ${category}`}
                                </span>
                              </div>

                              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                {CATEGORY_INFO[category].description}
                              </p>

                              <div className="mt-3 flex items-center gap-2 text-orange-300 text-sm font-medium group-hover:gap-3 transition-all">
                                <span>{t("categories.startPractice")}</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <motion.section
        id="pricing"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="relative border-t border-border/60 bg-gradient-to-b from-background via-black to-black py-20 md:py-28 overflow-hidden"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(70%_70%_at_50%_10%,#000_10%,transparent_70%)]"
        >
          <svg
            className="h-full w-full opacity-[0.06]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="pricing-grid"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M32 0H0V32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.35"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pricing-grid)" />
          </svg>
        </div>

        {/* Glows */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-orange-500/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-6rem] left-[10%] h-60 w-60 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-8rem] right-[12%] h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 relative">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-black/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-300" />
              DriveWise Pricing
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
              Choose your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-300 to-white">
                exam window
              </span>{" "}
              and unlock everything.
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Each plan unlocks one category (A, B, C or D) with unlimited mock
              tests, Decision Trainer, full study materials, and detailed
              reviews.
            </p>
          </div>

          {/* Cards */}
          <div className="relative max-w-5xl mx-auto">
            <div className="pointer-events-none absolute inset-x-8 -top-8 h-40 rounded-full bg-orange-500/18 blur-3xl" />

            <div className="grid gap-5 lg:gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1fr)] items-stretch">
              {/* 1 Month */}
              <motion.div
                initial={{ opacity: 0, y: 24, rotate: -1.5 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative group"
              >
                <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-orange-500/0 via-orange-500/12 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                <div className="relative h-full rounded-3xl border border-border/70 bg-black/85 p-6 flex flex-col gap-3 transform lg:-rotate-1 group-hover:rotate-0 group-hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      1 Month
                    </span>
                  </div>

                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold tracking-tight">
                      3€
                    </span>
                    <span className="text-xs text-muted-foreground mb-1">
                      / category
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Perfect for a focused last sprint.
                  </p>

                  <div className="h-px w-full bg-gradient-to-r from-transparent via-border/70 to-transparent my-1" />

                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />{" "}
                      Unlimited mock tests
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />{" "}
                      Full Decision Trainer
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />{" "}
                      Study materials
                    </li>
                  </ul>

                  <Link
                    href="/pricing?plan=PLAN_A&category=B"
                    className="mt-auto pt-3 inline-flex w-full items-center justify-center rounded-2xl border border-border/80 bg-black/60 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground hover:border-orange-400 hover:text-orange-200 transition"
                  >
                    Get 1 Month
                  </Link>
                </div>
              </motion.div>

              {/* 3 Months – featured */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative group"
              >
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-4 -top-6 h-10 rounded-full bg-gradient-to-r from-orange-500/40 via-orange-300/50 to-orange-500/40 blur-2xl opacity-80"
                  animate={{ opacity: [0.5, 0.9, 0.5] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <div className="absolute -inset-[2px] rounded-[28px] bg-gradient-to-b from-orange-400 via-orange-500/70 to-orange-400 opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative h-full rounded-[26px] bg-black/95 p-[1px]">
                  <div className="relative h-full rounded-[24px] bg-gradient-to-b from-black via-zinc-950 to-black p-6 md:p-7 flex flex-col gap-3">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="rounded-full border border-orange-300/80 bg-black px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-100 shadow-[0_0_24px_rgba(249,115,22,0.65)]">
                        Best value
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2">
                      <span className="text-[11px] uppercase tracking-[0.18em] text-orange-200">
                        3 Months
                      </span>
                    </div>

                    <div className="flex flex-wrap items-end gap-2">
                      <span className="text-5xl md:text-6xl font-bold tracking-tight text-orange-50">
                        8€
                      </span>
                      <span className="text-xs text-orange-100/80 mb-1.5">
                        / category
                      </span>
                    </div>

                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      Real mastery. Time to fail, review, and pass relaxed.
                    </p>

                    <div className="h-px w-full bg-gradient-to-r from-orange-500/0 via-orange-500/70 to-orange-500/0 my-1" />

                    <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-orange-300 shrink-0" />{" "}
                        Unlimited mock tests
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-orange-300 shrink-0" />{" "}
                        Full Decision Trainer
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-orange-300 shrink-0" />{" "}
                        Complete theory library
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-orange-300 shrink-0" />{" "}
                        Deep analytics
                      </li>
                    </ul>

                    <Link
                      href="/pricing?plan=PLAN_C&category=B"
                      className="mt-auto pt-4 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-orange-300 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-black shadow-[0_0_35px_rgba(249,115,22,0.8)] hover:brightness-110 transition"
                    >
                      Get 3 Months
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* 2 Months */}
              <motion.div
                initial={{ opacity: 0, y: 24, rotate: 1.5 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="relative group"
              >
                <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-orange-500/0 via-orange-500/12 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                <div className="relative h-full rounded-3xl border border-border/70 bg-black/85 p-6 flex flex-col gap-3 transform lg:rotate-1 group-hover:rotate-0 group-hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      2 Months
                    </span>
                  </div>

                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold tracking-tight">
                      6€
                    </span>
                    <span className="text-xs text-muted-foreground mb-1">
                      / category
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Consistent practice without rushing.
                  </p>

                  <div className="h-px w-full bg-gradient-to-r from-transparent via-border/70 to-transparent my-1" />

                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />{" "}
                      Everything in 1 Month
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />{" "}
                      Great value
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />{" "}
                      Flexible timeframe
                    </li>
                  </ul>

                  <Link
                    href="/pricing?plan=PLAN_B&category=B"
                    className="mt-auto pt-3 inline-flex w-full items-center justify-center rounded-2xl border border-border/80 bg-black/60 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground hover:border-orange-400 hover:text-orange-200 transition"
                  >
                    Get 2 Months
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Trust / guarantee row */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] text-muted-foreground/80">
              <span className="inline-flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-orange-400/80" />
                Secure payments via Paddle
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-orange-400/80" />
                30-day money-back guarantee
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-orange-400/80" />
                Add more categories anytime
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* FAQ */}
      <section className="relative border-t border-border/60">
        <div className="container mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-black/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <span className="h-1.5 w-8 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full" />
                Pyetje të shpeshta
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Gjithçka që duhet të dish
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={faq.q}
                    className="rounded-2xl border border-border/80 bg-black/80 overflow-hidden transition-colors hover:border-orange-400/40"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="text-sm md:text-base font-semibold text-foreground">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 shrink-0 text-orange-300 transition-transform duration-300",
                          isOpen && "rotate-180"
                        )}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative border-t border-border/60 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_50%_100%_at_50%_0%,rgba(249,115,22,0.15),transparent_70%)]" />
        <div className="container mx-auto px-4 sm:px-6 py-24 md:py-32">
          <motion.div {...subtleRise} className="relative max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-balance mb-6">
              Gati të kalosh provimin{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-300 to-white">
                herën e parë
              </span>
              ?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Krijo llogarinë falas dhe fillo testin e parë sot. Zgjidh planin
              kur të jesh gati.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                asChild
                className="relative h-13 min-h-12 px-9 text-base font-semibold shadow-lg shadow-orange-500/35 overflow-hidden"
              >
                <Link href="/register">
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-300 opacity-90" />
                  <span className="relative text-black inline-flex items-center gap-2">
                    {t("home.hero.startLearning")}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-13 min-h-12 px-9 text-base font-semibold border-border/70 bg-black/40 backdrop-blur hover:bg-black/60"
              >
                <Link href="#pricing">Shiko Planet</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-black/80 backdrop-blur-sm w-full relative">
        <div className="pointer-events-none absolute inset-x-[12%] top-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
            {/* Logo + tagline */}
            <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-orange-400/70 bg-black/60 flex items-center justify-center">
                  <Image
                    src="/logo-white.png"
                    alt="DriveWise Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-lg font-semibold tracking-tight">
                  DriveWise
                </span>
              </div>
              <p className="text-xs text-muted-foreground max-w-xs">
                Kosovo&apos;s Premier Driving Theory Platform. Praktikë,
                Decision Trainer dhe materiale mësimore në një vend.
              </p>
            </div>

            {/* Quick links */}
            <div className="flex flex-col items-center md:items-start gap-2 text-sm">
              <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70 mb-1">
                Platforma
              </span>
              <Link
                href="/#categories"
                className="text-muted-foreground hover:text-orange-200 transition-colors"
              >
                {t("categories.title")}
              </Link>
              <Link
                href="/materials"
                className="text-muted-foreground hover:text-orange-200 transition-colors"
              >
                {t("nav.materials")}
              </Link>
              <Link
                href="/#pricing"
                className="text-muted-foreground hover:text-orange-200 transition-colors"
              >
                {t("nav.pricing")}
              </Link>
              <Link
                href="/decision-trainer"
                className="text-muted-foreground hover:text-orange-200 transition-colors"
              >
                {t("nav.decisionTrainer")}
              </Link>
            </div>

            {/* Legal links */}
            <div className="flex flex-col items-center md:items-start gap-2 text-sm">
              <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70 mb-1">
                Legal
              </span>
              <Link
                href="/terms-of-service"
                className="text-muted-foreground hover:text-orange-200 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy-policy"
                className="text-muted-foreground hover:text-orange-200 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/refund-policy"
                className="text-muted-foreground hover:text-orange-200 transition-colors"
              >
                Refund Policy
              </Link>
            </div>
          </div>

          <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] sm:text-xs text-muted-foreground text-center sm:text-left">
              &copy; {new Date().getFullYear()} DriveWise. All rights reserved.
            </p>
            <p className="text-[11px] sm:text-xs text-muted-foreground/70 inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
              Made for drivers in Kosovo
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* Small components */

// Decorative demo chart with static fake data — a hand-rolled SVG sparkline
// instead of pulling in recharts, since this is the highest-traffic page.
function WeeklySparkline({
  data,
}: {
  data: { day: string; score: number }[];
}) {
  const width = 560;
  const height = 200;
  const padY = 16;
  const min = 40;
  const max = 100;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y =
      height -
      padY -
      ((d.score - min) / (max - min)) * (height - padY * 2);
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");

  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  const gridLines = [40, 70, 100];

  return (
    <div className="flex h-full w-full flex-col">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full flex-1"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="sparkline-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb923c" stopOpacity={0.28} />
            <stop offset="100%" stopColor="#fb923c" stopOpacity={0} />
          </linearGradient>
        </defs>
        {gridLines.map((v) => {
          const y = height - padY - ((v - min) / (max - min)) * (height - padY * 2);
          return (
            <line
              key={v}
              x1={0}
              x2={width}
              y1={y}
              y2={y}
              stroke="#27272a"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          );
        })}
        <path d={areaPath} fill="url(#sparkline-fill)" />
        <path
          d={linePath}
          fill="none"
          stroke="#fb923c"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p) => (
          <circle
            key={p.day}
            cx={p.x}
            cy={p.y}
            r={3}
            fill="#fb923c"
            stroke="#fde68a"
            strokeWidth={1}
          />
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
        {data.map((d) => (
          <span key={d.day}>{d.day}</span>
        ))}
      </div>
    </div>
  );
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {display.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

function MiniStat({
  label,
  value,
  trend,
}: {
  label: string;
  value: ReactNode;
  trend: string;
}) {
  return (
    <div className="flex-1 rounded-2xl border border-border/80 bg-black/70 px-4 py-3.5 flex flex-col justify-center gap-1 relative">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xl md:text-2xl font-bold tracking-tight">
          {value}
        </span>
        <span className="text-[11px] text-orange-300">{trend}</span>
      </div>
    </div>
  );
}

function BentoTile({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: EASE }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border/80 bg-black/80 hover:border-orange-400/60 transition-colors duration-300",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
