"use client";

import { useMemo, useRef } from "react";
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

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { CATEGORY_INFO, type LicenseCategory } from "@/types/database";
import { useLanguage } from "@/contexts/language-context";

const categoryIcons: Record<LicenseCategory, React.ReactNode> = {
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

  const categories = useMemo(
    () => Object.keys(CATEGORY_INFO) as LicenseCategory[],
    []
  );

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
    // Tighter window so the line moves faster as you pass the section
    offset: ["start 80%", "end 20%"],
  });
  // Move the line further so it clearly travels from top towards bottom
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

      {/* Subtle connective orange lines (background only) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Soft structural verticals near page edges */}
        <div className="hidden md:block absolute top-32 bottom-56 left-[9%] w-px bg-gradient-to-b from-transparent via-orange-500/16 to-transparent" />
        <div className="hidden md:block absolute top-40 bottom-64 right-[11%] w-px bg-gradient-to-b from-transparent via-orange-500/14 to-transparent" />

        {/* Mobile-friendly short edge lines only */}
        <div className="md:hidden absolute top-32 bottom-44 left-2 w-px bg-gradient-to-b from-transparent via-orange-500/14 to-transparent" />
        <div className="md:hidden absolute top-64 bottom-32 right-2 w-px bg-gradient-to-b from-transparent via-orange-400/12 to-transparent" />

        {/* Connector 1: hero → how it works */}
        <div className="hidden md:block absolute left-1/2 top-[380px] bottom-[760px] w-px bg-gradient-to-b from-transparent via-orange-400/18 to-transparent" />
        <motion.div
          className="hidden md:block absolute left-1/2 top-[380px] w-1.5 h-1.5 -translate-x-1/2 rounded-full bg-orange-400 shadow-[0_0_18px_rgba(249,115,22,0.7)]"
          animate={{ y: [0, 260, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Connector 2: how it works → trust/safety & personas */}
        <div className="hidden md:block absolute left-[58%] top-[820px] bottom-[1200px] w-px bg-gradient-to-b from-transparent via-orange-500/18 to-transparent" />
        <motion.div
          className="hidden md:block absolute left-[58%] top-[820px] w-1.5 h-1.5 -translate-x-1/2 rounded-full bg-orange-400 shadow-[0_0_18px_rgba(249,115,22,0.7)]"
          animate={{ y: [0, 260, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Horizontal rails gently tying major sections */}
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
        {/* Vertical hero accent rail */}
        <div className="pointer-events-none hidden lg:block absolute top-20 bottom-10 left-6 w-px bg-gradient-to-b from-transparent via-orange-500/25 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] items-center">
            {/* Left: main hero copy */}
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

              {/* Hero quick stats */}
              <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-xl text-sm relative">
                <StatPill
                  icon={<Target className="w-4 h-4" />}
                  label="Mock tests"
                  value="A · B · C · D"
                />
                <StatPill
                  icon={<Activity className="w-4 h-4" />}
                  label="Decision Trainer"
                  value="XP · Streaks"
                />
                <StatPill
                  icon={<BarChart3 className="w-4 h-4" />}
                  label="Analytics"
                  value={t("dashboard.testHistoryTitle")}
                />
                <StatPill
                  icon={<Globe2 className="w-4 h-4" />}
                  label="Languages"
                  value="EN · SQ"
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
                    {/* Chart */}
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
                            formatter={(value: any) => [`${value}%`, "Score"]}
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

      {/* QUICK CTA STRIP */}
      <section className="relative">
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <div className="max-w-5xl mx-auto">
            <GlassCard className="relative overflow-hidden p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-border/80 bg-black/70">
              <div className="pointer-events-none absolute -right-32 top-0 h-40 w-40 bg-gradient-to-bl from-orange-500/30 to-transparent blur-3xl opacity-80" />

              <div className="relative space-y-2 max-w-md">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Study the way that suits you
                </p>
                <h2 className="text-base md:text-lg font-semibold">
                  Theory, decisions, and exam-style tests in one place.
                </h2>
                <p className="text-xs text-muted-foreground">
                  Jump straight into materials, Decision Trainer, or
                  category-based mock tests in a single tap.
                </p>
              </div>
              <div className="relative flex flex-wrap gap-2 md:justify-end">
                <Button size="sm" variant="outline" asChild>
                  <Link href="/materials">{t("materials.title")}</Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/decision-trainer">{t("trainer.title")}</Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href="#categories">{t("categories.title")}</Link>
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

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
              {/* Vertical hero accent rail */}
              <div className="pointer-events-none hidden lg:block absolute -left-6 top-4 bottom-0 w-px bg-gradient-to-b from-transparent via-orange-500/20 to-transparent" />
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-black/60 px-3 py-1 text-[11px] text-muted-foreground">
                <span className="h-1.5 w-8 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full" />
                Guided learning path
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                A clear path from sign-up to “you passed”.
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-xl">
                DriveWise combines exam-style mock tests, decision training, and
                analytics so you always know exactly what to practice next for
                the Kosovo theory exam.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <KeyPoint
                  title="Exam-like structure"
                  body="Same timing, flows, and difficulty as the real test to remove surprises on exam day."
                />
                <KeyPoint
                  title="Adaptive practice"
                  body="Mixed and personalized tests focus on questions you miss, not ones you’ve already mastered."
                />
                <KeyPoint
                  title="Decision muscle"
                  body="Scenario-based questions train instinct for complex, real-world driving situations."
                />
                <KeyPoint
                  title="Always tracked"
                  body="Every attempt feeds into your dashboard so you always know if you're ready."
                />
              </div>
            </div>

            {/* Right column with animated line */}
            <div className="relative pl-6 border-l border-border/60">
              <motion.div
                style={{ y: lineY }}
                className="pointer-events-none absolute -left-px top-6 h-24 w-[2px] bg-gradient-to-b from-orange-400 via-orange-300 to-transparent"
              />
              <div className="space-y-4">
                <HowStep
                  step="01"
                  title="Create your account"
                  body="Sign up in seconds with secure auth and get your own profile, history, and progress."
                />
                <HowStep
                  step="02"
                  title="Choose how to practice"
                  body="Practice by category, run mixed tests, or let DriveWise build personalized sessions from your mistakes."
                />
                <HowStep
                  step="03"
                  title="Train decisions"
                  body="Use the Decision Trainer to run through real-world scenarios with streaks and strict validation."
                />
                <HowStep
                  step="04"
                  title="Review & improve"
                  body="Use your dashboard and detailed history to review every answer and close each knowledge gap."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST & SAFETY */}
      <section className="relative border-y border-border/60 bg-gradient-to-b from-black/80 via-black/90 to-background">
        <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center">
            <div className="space-y-3 relative">
              <div className="pointer-events-none hidden md:block absolute -left-8 top-4 h-10 w-px bg-gradient-to-b from-orange-500/50 via-orange-400/10 to-transparent" />
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-2">
                <span className="h-1 w-6 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full" />
                Built to protect your progress
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold">
                Private, reliable, exam-grade learning.
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-xl">
                Your answers, history, and progress are stored securely with
                role-based access so only you (and your school when you choose)
                can see your data. Sessions are protected and designed for
                long-term learning, not quick demos.
              </p>

              <div className="grid sm:grid-cols-3 gap-3 pt-3 text-xs">
                <TechStat
                  icon={<Database className="w-4 h-4" />}
                  label="Data protection"
                  value="Isolated learner profiles and safe storage"
                />
                <TechStat
                  icon={<Lock className="w-4 h-4" />}
                  label="Account safety"
                  value="Secure sign-in and role-aware access"
                />
                <TechStat
                  icon={<Cpu className="w-4 h-4" />}
                  label="Experience"
                  value="Optimized for small phones and slow networks"
                />
              </div>
            </div>

            <GlassCard className="relative overflow-hidden border border-border/80 bg-black/80 p-6 md:p-7">
              <div className="pointer-events-none absolute -right-20 top-0 h-48 w-48 bg-[conic-gradient(from_220deg_at_50%_50%,rgba(249,115,22,0.4),transparent_55%)] blur-3xl opacity-80" />
              <div className="relative space-y-4 text-xs">
                <div className="grid gap-2 text-[11px]">
                  <InlineListItem
                    label="Where data lives"
                    value="In a secure, cloud-hosted database"
                  />
                  <InlineListItem
                    label="How it is protected"
                    value="Encrypted in transit with role-based access"
                  />
                  <InlineListItem
                    label="Who can see it"
                    value="You, and your instructor only if you connect"
                  />
                  <InlineListItem
                    label="Reliability"
                    value="Monitored uptime and safe deployments"
                  />
                  <InlineListItem
                    label="Experience"
                    value="Responsive, mobile-first design with clear feedback"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Engineered for predictable performance, smooth onboarding, and
                  safe use in both personal accounts and driving schools.
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* WHO IS DRIVEWISE FOR */}
      <section className="relative">
        <div className="container mx-auto px-4 sm:px-6 pt-10 pb-16">
          <div className="max-w-5xl mx-auto">
            <GlassCard className="p-5 md:p-6 border border-border/80 bg-black/70 relative overflow-hidden">
              <div className="pointer-events-none absolute -left-24 bottom-0 h-40 w-40 bg-gradient-to-tr from-orange-500/30 to-transparent blur-3xl opacity-80" />
              <div className="pointer-events-none absolute inset-x-6 top-3 h-px bg-gradient-to-r from-transparent via-orange-500/35 to-transparent" />
              <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Who is DriveWise for?
                  </p>
                  <h2 className="text-lg md:text-xl font-semibold">
                    Learners, re-takers, and driving schools in Kosovo.
                  </h2>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Whether you&apos;re attempting the test for the first time,
                    trying again after a fail, or guiding students as an
                    instructor, DriveWise gives you mock tests, theory, and
                    decision training in one focused, distraction-free space.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs w-full sm:w-auto md:border-l md:border-orange-500/25 md:pl-6">
                  <PersonaCard
                    title="First-time learners"
                    body="Clear progression, instant feedback, and no guesswork."
                  />
                  <PersonaCard
                    title="Re-takers"
                    body="Focus on weak topics and rebuild confidence."
                  />
                  <PersonaCard
                    title="Instructors"
                    body="Admin tools, stats, and history in one place."
                  />
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* CORE FEATURES */}
      <section className="relative">
        <div className="container mx-auto px-4 sm:px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col gap-4 mb-8 md:mb-10 relative">
              <div className="pointer-events-none hidden md:block absolute -left-4 top-2 h-10 w-px bg-gradient-to-b from-orange-500/40 via-orange-400/10 to-transparent" />
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Designed for how Kosovo learners actually study.
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                From exam-style mock tests to real decision-making scenarios and
                clear analytics, DriveWise focuses you on the next best thing to
                practice — not on navigating a complicated app.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: Target,
                  title: t("features.comprehensive.title"),
                  desc: t("features.comprehensive.desc"),
                  extra:
                    "Mixed, personalized, and category-specific tests tuned to the Kosovo exam.",
                },
                {
                  icon: TrendingUp,
                  title: t("features.progress.title"),
                  desc: t("features.progress.desc"),
                  extra:
                    "Streaks, XP, and a dashboard that shows exactly where you’re improving.",
                },
                {
                  icon: Shield,
                  title: t("features.guaranteed.title"),
                  desc: t("features.guaranteed.desc"),
                  extra:
                    "A calm, distraction-free practice space made for Kosovo learners.",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-4 rounded-xl border border-border/70 bg-black/70 p-4 md:p-5 relative"
                >
                  <div className="pointer-events-none absolute inset-x-5 top-3 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
                  <div className="w-10 h-10 rounded-lg bg-orange-500/15 flex items-center justify-center text-orange-300 flex-shrink-0">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {feature.desc}
                    </p>
                    <p className="text-[11px] text-muted-foreground/80">
                      {feature.extra}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
              {/* FEATURED CATEGORY (e.g. B) */}
              <motion.div {...subtleRise} className="lg:col-span-2 flex relative">
                {/* Single horizontal connector from featured card toward the right column */}
                <span
                  aria-hidden
                  className="
                    hidden lg:block
                    absolute
                    -right-10
                    top-1/2
                    h-px
                    w-10
                    -translate-y-1/2
                    bg-orange-500/35
                  "
                />

                <Link href={`/category/${featured.toLowerCase()}`} className="flex-1">
                  <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-black/80 h-full flex flex-col">
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

              {/* RIGHT COLUMN CATEGORY LIST (A, C, D) */}
              <div className="relative flex flex-col gap-7 lg:pl-12">
                {/* Vertical rail: from Cat A connector to Cat D connector */}
                <div
                  aria-hidden
                  className="
                    hidden lg:block
                    absolute
                    left-0
                    top-[36px]
                    bottom-[36px]
                    w-px
                    bg-orange-500/28
                  "
                />
                {/* Top cap touching Cat A */}
                <div
                  aria-hidden
                  className="
                    hidden lg:block
                    absolute
                    -left-[3px]
                    top-[36px]
                    h-2 w-2
                    rounded-full
                    bg-orange-500
                    shadow-[0_0_10px_rgba(249,115,22,0.8)]
                  "
                />
                {/* Bottom cap touching Cat D */}
                <div
                  aria-hidden
                  className="
                    hidden lg:block
                    absolute
                    -left-[3px]
                    bottom-[36px]
                    h-2 w-2
                    rounded-full
                    bg-orange-500
                    shadow-[0_0_10px_rgba(249,115,22,0.8)]
                  "
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
                      {/* One clean horizontal line per category (except C), outside the card, into the vertical rail */}
                      {category !== "C" && (
                        <span
                          aria-hidden
                          className="
                            hidden lg:block
                            absolute
                            -left-10
                            top-1/2
                            h-px
                            w-10
                            -translate-y-1/2
                            bg-orange-500/35
                          "
                        />
                      )}

                      <Link href={`/category/${category.toLowerCase()}`}>
                        <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-black/80 p-5 hover:border-orange-400/70 transition-all duration-300">
                          <div className="pointer-events-none absolute inset-x-5 top-3 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
                          <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 translate-x-1/4 -translate-y-1/4 rounded-full bg-orange-500/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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

      {/* FOOTER */}
      <footer className="border-t border-border bg-black/80 backdrop-blur-sm w-full relative">
        <div className="pointer-events-none absolute inset-x-[12%] top-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
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
            <p className="text-sm text-muted-foreground text-center md:text-right">
              &copy; 2024 DriveWise. All rights reserved.
            </p>
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
  icon: React.ReactNode;
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

function HowStep({
  step,
  title,
  body,
}: {
  step: string;
  title: string;
  body: string;
}) {
  return (
    <div className="relative rounded-xl border border-border/80 bg-black/70 p-5 md:p-6 flex flex-col gap-2">
      {/* Horizontal connector into the timeline rail */}
      <div className="pointer-events-none absolute -left-6 top-6 h-px w-5 bg-gradient-to-r from-orange-400/70 to-transparent" />
      <span className="text-[11px] font-mono text-muted-foreground">
        STEP {step}
      </span>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed break-words">
        {body}
      </p>
    </div>
  );
}

function CategoryCard({
  category,
  index,
  tStart,
}: {
  category: LicenseCategory;
  index: number;
  tStart: string;
}) {
  const rise = {
    initial: { opacity: 0, y: 18, scale: 0.99 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true },
    transition: { duration: 0.45, delay: index * 0.08 },
  };

  return (
    <motion.div {...rise}>
      <Link href={`/category/${category.toLowerCase()}`}>
        <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-black/80 p-5 hover:border-orange-400/70 transition-all duration-300">
          <div className="pointer-events-none absolute -left-10 top-1/2 h-px w-20 -translate-y-1/2 bg-gradient-to-r from-orange-400/55 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 translate-x-1/4 -translate-y-1/4 rounded-full bg-orange-500/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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
                <span>{tStart}</span>
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
  icon: React.ReactNode;
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
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right text-[11px] break-words">{value}</span>
    </div>
  );
}

function PersonaCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border/80 bg-black/80 px-4 py-3 flex flex-col gap-1 relative">
      <span className="text-[11px] text-muted-foreground">{title}</span>
      <span className="text-[11px] font-medium break-words">{body}</span>
    </div>
  );
}
