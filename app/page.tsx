"use client";

import {
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
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
  Globe2,
  Lock,
  Database,
  Cpu,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { CATEGORY_INFO, type LicenseCategory } from "@/types/database";
import { useLanguage } from "@/contexts/language-context";

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

  // Scroll animation for the vertical line in the "How it works" section
  const howItWorksRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: howItWorksRef,
    offset: ["start 80%", "end 20%"],
  });
  const lineY = useTransform(scrollYProgress, [0, 1], [0, 380]);

  return (
    <main className="relative w-full min-h-screen bg-background text-foreground overflow-hidden">
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
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-orange-500/25 via-transparent to-transparent blur-3xl" />

      {/* Corner glows */}
      <div className="pointer-events-none absolute top-[-6rem] right-[-6rem] h-64 w-64 rounded-full bg-orange-500/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-6rem] left-[-6rem] h-64 w-64 rounded-full bg-orange-400/20 blur-3xl" />

      {/* Structural rails / moving lights */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="hidden md:block absolute top-32 bottom-56 left-[9%] w-px bg-gradient-to-b from-transparent via-orange-500/16 to-transparent" />
        <div className="hidden md:block absolute top-40 bottom-64 right-[11%] w-px bg-gradient-to-b from-transparent via-orange-500/14 to-transparent" />
        <div className="md:hidden absolute top-32 bottom-44 left-2 w-px bg-gradient-to-b from-transparent via-orange-500/14 to-transparent" />
        <div className="md:hidden absolute top-64 bottom-32 right-2 w-px bg-gradient-to-b from-transparent via-orange-400/12 to-transparent" />

        {/* Hero → path rail */}
        <div className="hidden md:block absolute left-1/2 top-[380px] bottom-[760px] w-px bg-gradient-to-b from-transparent via-orange-400/18 to-transparent" />
        <motion.div
          className="hidden md:block absolute left-1/2 top-[380px] w-1.5 h-1.5 -translate-x-1/2 rounded-full bg-orange-400 shadow-[0_0_18px_rgba(249,115,22,0.7)]"
          animate={{ y: [0, 260, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* How it works → mid sections rail */}
        <div className="hidden md:block absolute left-[58%] top-[820px] bottom-[1200px] w-px bg-gradient-to-b from-transparent via-orange-500/18 to-transparent" />
        <motion.div
          className="hidden md:block absolute left-[58%] top-[820px] w-1.5 h-1.5 -translate-x-1/2 rounded-full bg-orange-400 shadow-[0_0_18px_rgba(249,115,22,0.7)]"
          animate={{ y: [0, 260, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Horizontal ties */}
        <div className="hidden lg:block absolute inset-x-[10%] top-[520px] h-px bg-gradient-to-r from-transparent via-orange-500/18 to-transparent" />
        <div className="hidden lg:block absolute inset-x-[14%] top-[1120px] h-px bg-gradient-to-r from-transparent via-orange-500/16 to-transparent" />
        <div className="hidden xl:block absolute inset-x-[18%] top-[1680px] h-px bg-gradient-to-r from-transparent via-orange-500/14 to-transparent" />
      </div>

      <Navbar />

      {/* HERO */}
      <motion.section
        {...subtleRise}
        className="relative border-b border-border/60 pt-24"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/80 to-transparent" />
        <div className="pointer-events-none hidden lg:block absolute top-20 bottom-10 left-6 w-px bg-gradient-to-b from-transparent via-orange-500/25 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] items-center">
            {/* Left: copy */}
            <div className="space-y-8 relative">
              <div className="inline-flex items-center gap-3 rounded-full border border-border/70 bg-black/40 px-3 py-1.5 pr-3 backdrop-blur">
                <Badge
                  variant="outline"
                  className="gap-2 px-3 py-1 bg-orange-500/10 border-orange-500/40 text-xs text-orange-400 font-medium inline-flex items-center"
                >
                  <Zap className="w-4 h-4" />
                  Kosovo Driving Theory
                </Badge>
                <span className="hidden sm:inline text-[11px] text-muted-foreground">
                  {t("home.hero.badge")}
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight relative">
                  Master your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-300 to-white">
                    Driving Theory Exam
                  </span>
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
                  {t("home.hero.description")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 relative">
                <Button
                  size="lg"
                  asChild
                  className="relative h-12 px-8 text-base font-semibold shadow-lg shadow-orange-500/35 overflow-hidden"
                >
                  <Link href="/register">
                    <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-300 opacity-90" />
                    <span className="relative text-black">
                      {t("home.hero.startLearning")}
                    </span>
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="h-12 px-8 text-base font-semibold border-border/70 bg-black/40 backdrop-blur hover:bg-black/60"
                >
                  <Link href="#categories">
                    {t("home.hero.browseCategories")}
                  </Link>
                </Button>
              </div>

              {/* Mobile apps */}
              <div className="mt-3 space-y-2">
                <p className="text-xs md:text-sm text-muted-foreground">
                  {t("home.hero.mobileComingSoon")}
                </p>
                <div className="flex flex-wrap gap-3">
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
              </div>

              {/* Hero quick stats */}
              <div className="pt-4">
                <GlassCard className="p-1.5 inline-flex flex-wrap gap-1.5 bg-black/40 border-white/10 backdrop-blur-xl">
                  {[
                    {
                      icon: <Target className="w-3.5 h-3.5" />,
                      label: t('nav.tests'),
                      value: "A · B · C · D",
                    },
                    {
                      icon: <Activity className="w-3.5 h-3.5" />,
                      label: t('nav.decisionTrainer'),
                      value: "XP · Streaks",
                    },
                    {
                      icon: <BarChart3 className="w-3.5 h-3.5" />,
                      label: t('features.progress.title'),
                      value: t('dashboard.testHistoryTitle'),
                    },
                    {
                      icon: <Globe2 className="w-3.5 h-3.5" />,
                      label: t('nav.language'),
                      value: "EN · SQ",
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20">
                        {stat.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">
                          {stat.label}
                        </span>
                        <span className="text-xs font-bold text-foreground/90">
                          {stat.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </GlassCard>
              </div>

              {/* Secondary reassurance row */}
              <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-muted-foreground">
                <StatPill
                  icon={<Shield className="w-3.5 h-3.5" />}
                  label={t('home.benefit.badge')}
                  value={t('home.benefit.body')}
                />
                <StatPill
                  icon={<TrendingUp className="w-3.5 h-3.5" />}
                  label={t('features.guaranteed.title')}
                  value={t('features.guaranteed.desc')}
                />
                <StatPill
                  icon={<Lock className="w-3.5 h-3.5" />}
                  label={t('home.trust.badge')}
                  value={t('home.trust.body')}
                />
              </div>
            </div>

            {/* Right: hero preview card */}
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-md mx-auto lg:mx-0"
            >
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.45),transparent_55%),radial-gradient(circle_at_bottom,rgba(0,0,0,0.7),transparent_55%)] blur-2xl opacity-90" />

              <GlassCard className="relative rounded-[1.75rem] border border-white/8 bg-black/70 p-6 md:p-7 shadow-[0_30px_120px_rgba(0,0,0,0.85)]">
                <div className="flex items-center justify-between mb-4 relative">
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

                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <MiniStat label="Avg. score" value="86%" trend="+12%" />
                    <MiniStat label="This week" value="14 tests" trend="+5" />
                    <MiniStat label="XP earned" value="3,420" trend="+220" />
                  </div>

                  <div className="mt-2 rounded-xl border border-border/70 bg-black/70 p-3 relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <BarChart3 className="w-3 h-3" />
                        Weekly progress
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        Last 7 days
                      </span>
                    </div>
                    <div className="h-40 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={weeklyData}
                          margin={{ top: 8, left: -20, right: 10 }}
                        >
                          <CartesianGrid
                            stroke="#27272a"
                            strokeDasharray="3 3"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "#a1a1aa", fontSize: 10 }}
                          />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "#71717a", fontSize: 10 }}
                            tickFormatter={(v) => `${v}%`}
                            domain={[40, 100]}
                          />
                          <Tooltip
                            cursor={{ stroke: "#3f3f46", strokeWidth: 1 }}
                            contentStyle={{
                              backgroundColor: "#020617",
                              border: "1px solid #27272a",
                              borderRadius: "0.5rem",
                              padding: "0.35rem 0.5rem",
                            }}
                            labelStyle={{ color: "#e5e5e5", fontSize: 11 }}
                            itemStyle={{ color: "#fed7aa", fontSize: 11 }}
                            formatter={(value: number) => [
                              `${value}%`,
                              "Score",
                            ]}
                          />
                          <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#fb923c"
                            strokeWidth={2}
                            dot={{
                              r: 3,
                              strokeWidth: 1,
                              stroke: "#fde68a",
                              fill: "#fb923c",
                            }}
                            activeDot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-border/80 bg-black/70 p-3 flex flex-col gap-2 relative">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">Decision Trainer</span>
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

                    <div className="rounded-xl border border-border/80 bg-black/70 p-3 flex flex-col gap-2 relative">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">
                          {t("dashboard.testHistoryTitle")}
                        </span>
                        <span className="text-muted-foreground">
                          Mock Test · B
                        </span>
                      </div>
                      <div className="space-y-1.5 text-[11px] text-muted-foreground">
                        <p>• Mixed test · 30 questions</p>
                        <p>• Personalized · focus on mistakes</p>
                        <p>• Review every answer with explanation</p>
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
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* OVERVIEW / VALUE SECTION */}
      <motion.section
        {...subtleRise}
        className="relative border-b border-border/60 bg-gradient-to-b from-black via-background to-black/90"
      >
        <div className="pointer-events-none absolute inset-x-[10%] top-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="max-w-5xl mx-auto grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-start">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-black/70 px-3 py-1 text-[11px] text-muted-foreground">
                <span className="h-1.5 w-8 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full" />
                {t('home.trust.badge')}
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                {t('home.trust.title')}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                {t('home.trust.body')}
              </p>

              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                <TechStat
                  icon={<Database className="w-3.5 h-3.5" />}
                  label={t('features.comprehensive.title')}
                  value={t('features.comprehensive.desc')}
                />
                <TechStat
                  icon={<Cpu className="w-3.5 h-3.5" />}
                  label={t('home.pillars.badge')}
                  value={t('home.pillars.body')}
                />
                <TechStat
                  icon={<Globe2 className="w-3.5 h-3.5" />}
                  label={t('nav.language')}
                  value="English and Albanian side-by-side phrasing."
                />
              </div>
            </div>

            <GlassCard className="relative overflow-hidden border border-border/70 bg-black/80 p-6 rounded-2xl">
              <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full border border-dashed border-orange-500/20 opacity-70" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-orange-500/15 blur-2xl opacity-60" />

              <div className="relative space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-muted-foreground">
                    Learning profile snapshot
                  </span>
                  <span className="rounded-full border border-border/70 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Example
                  </span>
                </div>

                <div className="space-y-2">
                  <InlineListItem label="Category" value="B · Passenger cars" />
                  <InlineListItem
                    label="Exam readiness"
                    value="On track · recommended exam in ~12 days"
                  />
                  <InlineListItem
                    label="Weak topics"
                    value="Overtaking · crossings · motorway speeds"
                  />
                  <InlineListItem
                    label="Average score (last 10 tests)"
                    value="84% · stable"
                  />
                  <InlineListItem
                    label="Mistake pattern"
                    value="Late decisions when multiple hazards are present."
                  />
                </div>

                <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-border/80 to-transparent" />

                <p className="text-[11px] text-muted-foreground">
                  Every attempt feeds into this profile. Before you schedule the
                  real exam, you&apos;ll have a clear, data-backed &quot;you are
                  ready&quot; moment.
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </motion.section>

      {/* HOW IT WORKS */}
      <section className="relative">
        <div
          ref={howItWorksRef}
          className="container mx-auto px-4 sm:px-6 py-16"
        >
          <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
            {/* Left column */}
            <div className="space-y-4 lg:sticky lg:top-28 self-start relative">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/80 to-transparent" />
              <div className="pointer-events-none hidden lg:block absolute -left-6 top-4 bottom-0 w-px bg-gradient-to-b from-transparent via-orange-500/20 to-transparent" />
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-black/60 px-3 py-1 text-[11px] text-muted-foreground">
                <span className="h-1.5 w-8 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full" />
                {t('dashboard.onboardingTitle')}
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                {t('home.benefit.title')}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-xl">
                {t('home.benefit.body')}
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <KeyPoint
                  title={t('features.comprehensive.title')}
                  body={t('features.comprehensive.desc')}
                />
                <KeyPoint
                  title={t('home.pillars.badge')}
                  body={t('home.pillars.body')}
                />
                <KeyPoint
                  title={t('trainer.title')}
                  body={t('trainer.heroExplainer')}
                />
                <KeyPoint
                  title={t('features.progress.title')}
                  body={t('features.progress.desc')}
                />
              </div>
            </div>

            {/* Right column timeline */}
            <div className="relative pl-8 border-l border-white/10">
              <motion.div
                style={{ y: lineY }}
                className="pointer-events-none absolute -left-[1.5px] top-6 h-24 w-[3px] bg-gradient-to-b from-orange-500 via-orange-300 to-transparent rounded-full shadow-[0_0_15px_rgba(249,115,22,0.8)]"
              />
              <div className="space-y-8">
                <div className="relative group">
                  <div className="absolute -left-[41px] top-0 p-1.5 rounded-full bg-black border border-white/10 text-muted-foreground text-[10px] font-mono">
                    01
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                    {t('auth.createAccount')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('auth.createAccountDescription')}
                  </p>
                </div>

                <div className="relative group">
                  <div className="absolute -left-[41px] top-0 p-1.5 rounded-full bg-black border border-white/10 text-muted-foreground text-[10px] font-mono">
                    02
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                    {t('categories.title')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('categories.description')}
                  </p>
                </div>

                <div className="relative group">
                  <div className="absolute -left-[41px] top-0 p-1.5 rounded-full bg-black border border-white/10 text-muted-foreground text-[10px] font-mono">
                    03
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                    {t('trainer.title')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('trainer.heroExplainer')}
                  </p>
                </div>

                <div className="relative group">
                  <div className="absolute -left-[41px] top-0 p-1.5 rounded-full bg-black border border-white/10 text-muted-foreground text-[10px] font-mono">
                    04
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                    {t('features.progress.title')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('features.progress.desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERSONAS / WHO IT'S FOR */}
      <motion.section
        {...subtleRise}
        className="relative border-t border-border/60 bg-gradient-to-b from-black via-background to-black"
      >
        <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-black/70 px-3 py-1 text-[11px] text-muted-foreground">
                <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-300" />
                Designed for every learner
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Whether you&apos;re learning alone or with a school,
                DriveWise adapts.
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-xl">
                The same platform works for individual learners who want structure and care about pass rates.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <PersonaCard
                  title="Self-study learner"
                  body="Use streaks, XP and analytics to keep momentum without needing a private tutor."
                />
                <PersonaCard
                  title="Ambitious learner"
                  body="Want to pass first time? Our strict mode and timed tests prepare you for the real pressure."
                />
                <PersonaCard
                  title="Busy worker / parent"
                  body="Short, focused sessions that fit around shifts, school runs and weekend lessons."
                />
              </div>
            </div>

            <GlassCard className="relative rounded-2xl border border-border/70 bg-black/80 p-6 overflow-hidden">
              <div className="pointer-events-none absolute -right-24 top-10 h-52 w-52 rounded-full border border-dashed border-orange-500/25" />
              <div className="pointer-events-none absolute -bottom-16 left-8 h-40 w-40 rounded-full bg-orange-500/15 blur-2xl" />
              <div className="relative space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-muted-foreground">
                    Cohort performance · School view
                  </span>
                  <span className="rounded-full border border-border/70 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Sample
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2">
                  <MiniStat label="Active students" value="32" trend="+7" />
                  <MiniStat label="Avg. pass rate" value="91%" trend="+6%" />
                  <MiniStat label="Avg. study time" value="27h" trend="+4h" />
                  <MiniStat label="Risk students" value="4" trend="needs help" />
                </div>

                <p className="mt-3 text-[11px] text-muted-foreground">
                  School admins get a high-level picture. Learners still see a
                  personal, motivational dashboard — not overwhelming charts.
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </motion.section>

      {/* TRUST & RELIABILITY */}
      <motion.section
        {...subtleRise}
        className="relative border-t border-border/60 bg-gradient-to-b from-black via-black to-background"
      >
        <div className="container mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-black/70 px-3 py-1 text-[11px] text-muted-foreground">
                <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-300" />
                Enterprise-grade reliability
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
                Focus on passing. <br />
                <span className="text-muted-foreground">We handle the rest.</span>
              </h2>
              <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
                DriveWise is built to be the fastest, most reliable place to study.
                No crashes, no lost progress, and no distractions. Just you and the road to your license.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <TechStat
                  icon={<Lock className="w-4 h-4" />}
                  label="Privacy First"
                  value="Your personal data and test history are encrypted and private."
                />
                <TechStat
                  icon={<Zap className="w-4 h-4" />}
                  label="Instant Sync"
                  value="Switch between phone and laptop instantly. Progress is always saved."
                />
                <TechStat
                  icon={<Shield className="w-4 h-4" />}
                  label="99.9% Uptime"
                  value="Reliability you can count on, even the night before the exam."
                />
                <TechStat
                  icon={<Activity className="w-4 h-4" />}
                  label="Performance"
                  value="Zero lag. Questions load instantly so you stay in the flow."
                />
              </div>
            </div>

            {/* Visual representation instead of tech specs list */}
            <div className="relative">
                 {/* Abstract visual element mimicking a secure/fast system */}
                 <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/30 to-orange-600/30 rounded-2xl blur opacity-30" />
                 <GlassCard className="relative rounded-2xl border border-white/10 bg-black/90 p-8 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-900/20 via-black to-black" />
                    
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                                <span className="text-sm font-medium text-foreground/90">System Status: Operational</span>
                            </div>
                            <span className="text-xs text-muted-foreground font-mono">v2.4.0</span>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Server Response</span>
                                    <span className="text-green-400">14ms</span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                                    <div className="h-full w-[92%] bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Database Integrity</span>
                                    <span className="text-green-400">Verified</span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                                    <div className="h-full w-[100%] bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" />
                                </div>
                            </div>
                            
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 mt-6">
                                <div className="flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-orange-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Bank-grade Security</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            We use the same encryption standards as modern banking apps to keep your account safe.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 </GlassCard>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CATEGORIES */}
      <section id="categories" className="relative border-t border-border/60">
        <div className="container mx-auto px-4 sm:px-6 pt-10 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14 space-y-3 relative">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
                {t("categories.title")}
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {t("categories.description")}
              </p>
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
              {/* FEATURED CATEGORY */}
              <motion.div {...subtleRise} className="lg:col-span-2 flex relative">
                <span
                  aria-hidden
                  className="hidden lg:block absolute -right-10 top-1/2 h-px w-10 -translate-y-1/2 bg-orange-500/35"
                />

                <Link
                  href={`/category/${featured.toLowerCase()}`}
                  className="flex-1"
                >
                  <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-black/80 h-full flex flex-col hover:border-orange-400/70 transition-all duration-300">
                    <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border border-dashed border-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="pointer-events-none absolute -bottom-8 left-6 h-40 w-40 rounded-full bg-orange-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 p-6 md:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/60 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-300">
                          {t("categories.popular")}
                        </div>

                        <h3 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">
                          {CATEGORY_INFO[featured].name}
                        </h3>
                        <p className="mt-2 text-muted-foreground max-w-2xl text-sm">
                          {CATEGORY_INFO[featured].description}
                        </p>
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-orange-300 font-semibold group-hover:gap-3 transition-all text-sm">
                          <span>{t("categories.startPractice")}</span>
                          <svg
                            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </div>
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-orange-500/15 flex items-center justify-center text-orange-400">
                          {categoryIcons[featured]}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* OTHER CATEGORIES */}
              <div className="relative flex flex-col gap-7 lg:pl-12">
                <div
                  aria-hidden
                  className="hidden lg:block absolute left-0 top-[36px] bottom-[36px] w-px bg-orange-500/28"
                />
                <div
                  aria-hidden
                  className="hidden lg:block absolute -left-[3px] top-[36px] h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"
                />
                <div
                  aria-hidden
                  className="hidden lg:block absolute -left-[3px] bottom-[36px] h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"
                />

                {categories
                  .filter((c) => c !== featured)
                  .map((category, i) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: i * 0.08 }}
                      className="relative"
                    >
                      <Link href={`/category/${category.toLowerCase()}`}>
                        <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-black/80 p-5 hover:border-orange-400/70 transition-all duration-300">
                          <div className="pointer-events-none absolute -right-10 top-8 h-40 w-40 rounded-full border border-dashed border-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
                                <svg
                                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                  />
                                </svg>
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
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="relative border-t border-border/60 bg-gradient-to-b from-background via-black to-black py-12 md:py-16 overflow-hidden"
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

        {/* Rails */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="hidden lg:block absolute top-10 bottom-10 left-[12%] w-px bg-gradient-to-b from-transparent via-orange-500/25 to-transparent" />
          <div className="hidden lg:block absolute top-10 bottom-10 right-[12%] w-px bg-gradient-to-b from-transparent via-orange-500/25 to-transparent" />
          <div className="hidden md:block absolute top-24 bottom-24 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-orange-400/30 to-transparent" />
          <motion.div
            className="hidden md:block absolute left-1/2 top-24 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.9)]"
            animate={{ y: [0, 260, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="hidden md:block absolute inset-x-[12%] top-48 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
          <div className="hidden lg:block absolute inset-x-[14%] bottom-40 h-px bg-gradient-to-r from-transparent via-orange-400/16 to-transparent" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-8 md:mb-10 space-y-3 relative">
            <div className="pointer-events-none absolute inset-x-10 -top-3 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-black/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-300" />
              DriveWise Pricing
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
              Choose your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-300 to-white">
                exam window
              </span>{" "}
              and unlock everything.
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Each plan unlocks one category (A, B, C or D) with unlimited mock
              tests, Decision Trainer, full study materials, and detailed
              reviews. Admin accounts always have full access at no cost.
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
                <div className="relative h-full rounded-3xl border border-border/70 bg-black/85 p-5 flex flex-col gap-3 transform lg:-rotate-1 group-hover:rotate-0 group-hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      1 Month
                    </span>
                  </div>

                  <div className="flex items-end gap-2">
                    <span className="text-3xl md:text-4xl font-semibold">
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

                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    <li>• Unlimited mock tests</li>
                    <li>• Full Decision Trainer</li>
                    <li>• Study materials</li>
                  </ul>

                  <Link
                    href="/pricing?plan=PLAN_A&category=B"
                    className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-border/80 bg-black/60 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground hover:border-orange-400 hover:text-orange-200 transition"
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
                  <div className="relative h-full rounded-[24px] bg-gradient-to-b from-black via-zinc-950 to-black p-5 md:p-6 flex flex-col gap-3">
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
                      <span className="text-4xl md:text-5xl font-semibold text-orange-50">
                        8€
                      </span>
                      <span className="text-xs text-orange-100/80 mb-1">
                        / category
                      </span>
                    </div>

                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      Real mastery. Time to fail, review, and pass relaxed.
                    </p>

                    <div className="h-px w-full bg-gradient-to-r from-orange-500/0 via-orange-500/70 to-orange-500/0 my-1" />

                    <ul className="space-y-1.5 text-xs md:text-sm text-muted-foreground">
                      <li>• Unlimited mock tests</li>
                      <li>• Full Decision Trainer</li>
                      <li>• Complete theory library</li>
                      <li>• Deep analytics</li>
                    </ul>

                    <Link
                      href="/pricing?plan=PLAN_C&category=B"
                      className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-orange-300 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-black shadow-[0_0_35px_rgba(249,115,22,0.8)] hover:brightness-110 transition"
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
                <div className="relative h-full rounded-3xl border border-border/70 bg-black/85 p-5 flex flex-col gap-3 transform lg:rotate-1 group-hover:rotate-0 group-hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      2 Months
                    </span>
                  </div>

                  <div className="flex items-end gap-2">
                    <span className="text-3xl md:text-4xl font-semibold">
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

                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    <li>• Everything in 1 Month</li>
                    <li>• Great value</li>
                    <li>• Flexible timeframe</li>
                  </ul>

                  <Link
                    href="/pricing?plan=PLAN_B&category=B"
                    className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-border/80 bg-black/60 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground hover:border-orange-400 hover:text-orange-200 transition"
                  >
                    Get 2 Months
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Fine print */}
            <div className="mt-10 text-center text-[11px] text-muted-foreground/60 space-y-1">
              <p>
                Each plan unlocks one selected category (A, B, C or D). Add more
                categories anytime.
              </p>
              <p>
                Secure payments via Paddle. Cancel anytime. 30-day money-back
                guarantee.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* TESTIMONIALS / SOCIAL PROOF */}
      <motion.section
        {...subtleRise}
        className="relative border-t border-border/60 bg-black/90"
      >
        <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="max-w-5xl mx-auto text-center space-y-3 mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Learners who already passed with DriveWise.
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Real stories from people who used the platform instead of random
              PDFs and YouTube playlists.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
            <GlassCard className="relative rounded-2xl border border-border/70 bg-black/80 p-6 text-left overflow-hidden">
              <div className="pointer-events-none absolute -right-20 -top-12 h-40 w-40 rounded-full border border-dashed border-orange-500/25" />
              <div className="relative space-y-3 text-sm">
                <p className="text-muted-foreground">
                  &quot;The mock tests felt exactly like the real exam. By the
                  time I went in, I wasn&apos;t nervous — I already knew what my
                  average score was and which questions might show up.&quot;
                </p>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-border/70 to-transparent" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div>
                    <p className="font-semibold text-foreground">
                      Arlind · Category B
                    </p>
                    <p>Passed first try · Pristina</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="relative rounded-2xl border border-border/70 bg-black/80 p-6 text-left overflow-hidden">
              <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-orange-500/15 blur-2xl" />
              <div className="relative space-y-3 text-sm">
                <p className="text-muted-foreground">
                  &quot;I used DriveWise with my students this year and our
                  pass rate jumped. It finally gives us a structured way to see
                  who&apos;s ready and who needs more help.&quot;
                </p>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-border/70 to-transparent" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div>
                    <p className="font-semibold text-foreground">
                      Besa · Passed Category B
                    </p>
                    <p>First attempt · Score 96%</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </motion.section>

      {/* FAQ / FINAL CTA */}
      <motion.section
        {...subtleRise}
        className="relative border-t border-border/60 bg-gradient-to-b from-black via-background to-black/90"
      >
        <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-start">
            {/* FAQ */}
            <div className="space-y-5">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Questions before you start?
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-xl">
                Here are the most common things people ask before starting
                DriveWise. If you still have doubts, you can always contact us
                from inside the app.
              </p>

              <div className="space-y-3 text-sm">
                <GlassCard className="rounded-xl border border-border/70 bg-black/80 p-4 text-left">
                  <p className="font-semibold text-foreground">
                    Do I get access to everything with one plan?
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Yes. When you choose your plan and category, you unlock all
                    question sets, Decision Trainer, analytics and review tools
                    for that category — no extra add-ons.
                  </p>
                </GlassCard>

                <GlassCard className="rounded-xl border border-border/70 bg-black/80 p-4 text-left">
                  <p className="font-semibold text-foreground">
                    Can I switch or add categories later?
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Absolutely. You can add another category at any time with
                    the same or a different plan length.
                  </p>
                </GlassCard>

                <GlassCard className="rounded-xl border border-border/70 bg-black/80 p-4 text-left">
                  <p className="font-semibold text-foreground">
                    What if I&apos;m not ready after my time ends?
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    You keep all your progress and analytics. You can simply
                    extend your access with another plan and continue where you
                    left off.
                  </p>
                </GlassCard>
              </div>
            </div>

            {/* Final CTA */}
            <GlassCard className="relative rounded-2xl border border-border/70 bg-black/85 p-6 overflow-hidden">
              <div className="pointer-events-none absolute -right-16 -top-10 h-40 w-40 rounded-full border border-dashed border-orange-500/25" />
              <div className="pointer-events-none absolute -bottom-12 left-0 h-40 w-40 rounded-full bg-orange-500/20 blur-2xl" />
              <div className="relative space-y-4 text-center lg:text-left">
                <h3 className="text-xl font-semibold">
                  Ready to see your &quot;you passed&quot; screen?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Create your account, choose your category and do your first
                  mock test in under five minutes. From there, DriveWise guides
                  you step by step.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Button
                    asChild
                    size="lg"
                    className="relative h-11 px-6 text-sm font-semibold shadow-lg shadow-orange-500/35 overflow-hidden"
                  >
                    <Link href="/register">
                      <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-300 opacity-90" />
                      <span className="relative text-black">
                        Start free profile
                      </span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-11 px-6 text-sm font-semibold border-border/70 bg-black/60 hover:bg-black/80"
                  >
                    <Link href="#pricing">View plans</Link>
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-black/80 backdrop-blur-sm w-full relative">
        <div className="pointer-events-none absolute inset-x-[12%] top-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 py-10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3 relative">
              <div className="pointer-events-none hidden md:block absolute -left-6 top-1/2 h-10 w-px -translate-y-1/2 bg-gradient-to-b from-orange-500/40 via-orange-300/10 to-transparent" />
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-orange-400/70 bg-black/60 flex items-center justify-center">
                <Image
                  src="/logo-white.png"
                  alt="DriveWise Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold tracking-tight">
                  DriveWise
                </span>
                <span className="text-xs text-muted-foreground">
                  Kosovo&apos;s Premier Driving Theory Platform
                </span>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-col items-center md:items-end gap-2 text-xs text-muted-foreground">
              <div className="flex flex-wrap justify-center md:justify-end gap-3">
                <Link
                  href="/terms-of-service"
                  className="hover:text-orange-200 transition-colors"
                >
                  Terms of Service
                </Link>
                <span className="hidden sm:inline text-border/60">•</span>
                <Link
                  href="/privacy-policy"
                  className="hover:text-orange-200 transition-colors"
                >
                  Privacy Policy
                </Link>
                <span className="hidden sm:inline text-border/60">•</span>
                <Link
                  href="/refund-policy"
                  className="hover:text-orange-200 transition-colors"
                >
                  Refund Policy
                </Link>
              </div>

              <p className="text-[11px] sm:text-xs text-muted-foreground text-center md:text-right">
                &copy; {new Date().getFullYear()} DriveWise. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* Small components */

function MiniStat({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="rounded-xl border border-border/80 bg-black/70 px-3 py-2 flex flex-col gap-1 relative">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold">{value}</span>
        <span className="text-[10px] text-orange-300">{trend}</span>
      </div>
    </div>
  );
}

function StatPill({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-border/70 bg-black/60 backdrop-blur px-3 py-2 relative">
      <div className="flex items-center justify-center rounded-full border border-border/80 bg-orange-500/10 p-1.5 text-orange-300">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] text-muted-foreground">{label}</span>
        <span className="text-xs font-medium">{value}</span>
      </div>
    </div>
  );
}

function KeyPoint({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border/80 bg-black/70 p-4 flex flex-col gap-1 text-xs relative">
      <div className="pointer-events-none absolute inset-x-3 top-2 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
      <span className="font-medium">{title}</span>
      <p className="text-[11px] text-muted-foreground break-words">{body}</p>
    </div>
  );
}

function TechStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border/80 bg-black/80 px-4 py-3 flex flex-col gap-1 relative">
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-[11px] font-medium break-words">{value}</span>
    </div>
  );
}

function InlineListItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground text-[11px]">{label}</span>
      <span className="text-right text-[11px] break-words text-foreground/90">
        {value}
      </span>
    </div>
  );
}

function PersonaCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border/80 bg-black/80 px-4 py-3 flex flex-col gap-1 relative">
      <span className="text-[11px] text-muted-foreground">{title}</span>
      <span className="text-[11px] font-medium break-words text-foreground/90">
        {body}
      </span>
    </div>
  );
}
