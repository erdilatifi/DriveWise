"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { Navbar } from "@/components/navbar";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

const subtleRise = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function TermsOfServicePage() {
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
              id="grid-tos"
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
          <rect width="100%" height="100%" fill="url(#grid-tos)" />
        </svg>
      </div>

      {/* Warm hero glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-orange-500/25 via-transparent to-transparent blur-3xl" />

      {/* Corner glows */}
      <div className="pointer-events-none absolute top-[-6rem] right-[-6rem] h-64 w-64 rounded-full bg-orange-500/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-6rem] left-[-6rem] h-64 w-64 rounded-full bg-orange-400/20 blur-3xl" />

      <Navbar />

      <motion.section
        {...subtleRise}
        className="relative border-b border-border/60 pt-24 pb-16 md:pb-24"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/80 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-10 md:mb-12 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-black/40 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-300" />
                Legal · Terms of Service
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
                Terms of Service
              </h1>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                Please read these terms carefully. By using DriveWise, you agree
                to these Terms of Service.
              </p>
              <p className="text-xs text-muted-foreground/80">
                Last updated: <span className="font-medium">November 22, 2025</span>
              </p>
            </div>

            {/* Content */}
            <GlassCard className="relative border border-border/80 bg-black/80 px-5 py-6 md:px-8 md:py-8 flex flex-col gap-6">
              <SectionBlock
                title="1. About DriveWise"
                body={
                  <>
                    <p>
                      DriveWise is a digital learning platform that provides
                      mock tests, quizzes, and study materials to help learners
                      prepare for the driving theory exam. We do not provide
                      official driving instruction or certification, and we do
                      not guarantee that you will pass your exam.
                    </p>
                    <p className="mt-2">
                      The service is provided &quot;as is&quot; for personal,
                      non-commercial use only.
                    </p>
                  </>
                }
              />

              <SectionBlock
                title="2. Accounts & Access"
                body={
                  <>
                    <p>
                      To use certain features of DriveWise, you may need to
                      create an account. You agree to:
                    </p>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                      <li>Provide accurate and up-to-date information.</li>
                      <li>Keep your login credentials secure.</li>
                      <li>Not share your account with other people.</li>
                      <li>
                        Notify us promptly if you suspect any unauthorized use
                        of your account.
                      </li>
                    </ul>
                    <p className="mt-2">
                      We may suspend or terminate accounts that violate these
                      terms or are used for abuse, fraud, or illegal activity.
                    </p>
                  </>
                }
              />

              <SectionBlock
                title="3. Payments & Billing"
                body={
                  <>
                    <p>
                      All payments for DriveWise are processed securely by{" "}
                      <span className="font-medium">Paddle</span>, our Merchant
                      of Record. Paddle handles:
                    </p>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                      <li>Payment processing and billing.</li>
                      <li>Applicable taxes and VAT where required.</li>
                      <li>Invoices and receipts.</li>
                      <li>Refunds that follow our Refund Policy.</li>
                    </ul>
                    <p className="mt-2">
                      Pricing, available plans, and access durations are shown
                      clearly on our website. By placing an order, you authorize
                      Paddle to charge your selected payment method.
                    </p>
                  </>
                }
              />

              <SectionBlock
                title="4. License & Acceptable Use"
                body={
                  <>
                    <p>
                      When you purchase access to DriveWise, you receive a{" "}
                      <span className="font-medium">
                        limited, non-exclusive, non-transferable
                      </span>{" "}
                      license to use the platform and its content for personal
                      learning during the access period.
                    </p>
                    <p className="mt-2">You agree not to:</p>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                      <li>Share, resell, or sublicense your account.</li>
                      <li>
                        Copy, record, or distribute questions, explanations, or
                        other content without permission.
                      </li>
                      <li>
                        Attempt to bypass security, access another user’s
                        account, or interfere with the platform.
                      </li>
                      <li>
                        Use the service in any way that violates applicable law.
                      </li>
                    </ul>
                  </>
                }
              />

              <SectionBlock
                title="5. No Exam Guarantee"
                body={
                  <>
                    <p>
                      DriveWise is an educational support tool. We aim to help
                      you prepare more effectively, but we cannot guarantee:
                    </p>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                      <li>That you will pass your official driving exam.</li>
                      <li>That our questions will exactly match official ones.</li>
                      <li>That exam rules or regulations will not change.</li>
                    </ul>
                    <p className="mt-2">
                      You are responsible for checking the latest official
                      requirements from your local authorities.
                    </p>
                  </>
                }
              />

              <SectionBlock
                title="6. Service Changes & Availability"
                body={
                  <>
                    <p>
                      We may modify, update, or remove parts of the service at
                      any time to improve performance, content, or security. We
                      try to avoid downtime, but we do not guarantee uninterrupted
                      access.
                    </p>
                    <p className="mt-2">
                      We are not liable for any loss or damage caused by service
                      interruptions, maintenance, or technical issues.
                    </p>
                  </>
                }
              />

              <SectionBlock
                title="7. Limitation of Liability"
                body={
                  <>
                    <p>
                      To the maximum extent permitted by law, DriveWise and its
                      owners are not liable for any indirect, incidental,
                      special, or consequential damages, including:
                    </p>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                      <li>Loss of exam fees or rebooking costs.</li>
                      <li>Loss of data or interruptions to your learning.</li>
                      <li>
                        Any decision you make based on the content inside the
                        platform.
                      </li>
                    </ul>
                    <p className="mt-2">
                      Your sole remedy for dissatisfaction with the service is
                      to stop using DriveWise.
                    </p>
                  </>
                }
              />

              <SectionBlock
                title="8. Changes to These Terms"
                body={
                  <>
                    <p>
                      We may update these Terms of Service from time to time.
                      When we do, we will update the &quot;Last updated&quot;
                      date at the top of this page. Changes become effective
                      once posted.
                    </p>
                    <p className="mt-2">
                      By continuing to use DriveWise after changes take effect,
                      you agree to the updated terms.
                    </p>
                  </>
                }
              />

              <SectionBlock
                title="9. Contact"
                body={
                  <>
                    <p>
                      If you have questions about these Terms of Service, you
                      can contact us at:
                    </p>
                    <p className="mt-2 text-sm font-medium">
                      Email:{" "}
                      <a
                        href="mailto:support@drivewise.app"
                        className="text-orange-300 hover:text-orange-200 underline underline-offset-2"
                      >
                        support@drivewise.app
                      </a>
                    </p>
                  </>
                }
              />
            </GlassCard>

            {/* Back to home */}
            <div className="mt-8 flex justify-between items-center gap-4 text-xs text-muted-foreground">
              <Button variant="outline" asChild size="sm">
                <Link href="/">← Back to home</Link>
              </Button>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/privacy-policy"
                  className="hover:text-orange-200 transition-colors"
                >
                  Privacy Policy
                </Link>
                <span className="text-border/60">•</span>
                <Link
                  href="/refund-policy"
                  className="hover:text-orange-200 transition-colors"
                >
                  Refund Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </main>
  );
}

function SectionBlock({
  title,
  body,
}: {
  title: string;
  body: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h2 className="text-base md:text-lg font-semibold">{title}</h2>
      <div className="text-xs md:text-sm text-muted-foreground leading-relaxed space-y-2">
        {body}
      </div>
    </section>
  );
}

function Footer() {
  return (
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
  );
}
