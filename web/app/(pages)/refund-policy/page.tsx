"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { Navbar } from "@/components/navbar";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";

const subtleRise = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function RefundPolicyPage() {
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
              id="grid-refund"
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
          <rect width="100%" height="100%" fill="url(#grid-refund)" />
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
                Legal · Refund Policy
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
                Refund Policy
              </h1>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                Because DriveWise is a digital product, refunds are limited. This
                page explains when and how refunds are granted.
              </p>
              <p className="text-xs text-muted-foreground/80">
                Last updated: <span className="font-medium">November 22, 2025</span>
              </p>
            </div>

            {/* Content */}
            <GlassCard className="relative border border-border/80 bg-black/80 px-5 py-6 md:px-8 md:py-8 flex flex-col gap-6">
              <SectionBlock
                title="1. Digital product nature"
                body={
                  <>
                    <p>
                      DriveWise provides immediate access to digital content:
                      mock tests, quizzes, and study materials for the driving
                      theory exam. Because access is delivered instantly after
                      purchase, all sales are generally considered{" "}
                      <span className="font-medium">final</span>.
                    </p>
                  </>
                }
              />

              <SectionBlock
                title="2. When you can request a refund"
                body={
                  <>
                    <p>
                      We want learners to be satisfied with DriveWise. You may
                      request a refund in the following situations:
                    </p>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                      <li>You were charged by mistake or due to a duplicate order.</li>
                      <li>
                        You purchased multiple times unintentionally for the same
                        category and period.
                      </li>
                      <li>
                        You were unable to access the platform due to a technical
                        issue on our side.
                      </li>
                      <li>
                        You have not meaningfully used the product (for example,
                        you have completed almost no tests after purchase).
                      </li>
                    </ul>
                  </>
                }
              />

              <SectionBlock
                title="3. When refunds are not provided"
                body={
                  <>
                    <p>
                      We normally do not provide refunds in the following cases:
                    </p>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                      <li>You change your mind after accessing the content.</li>
                      <li>
                        You actively use the platform (e.g. multiple tests, long
                        study sessions) and then decide you no longer want it.
                      </li>
                      <li>
                        You do not pass your official exam – we cannot guarantee
                        exam results.
                      </li>
                      <li>
                        Your exam date or personal schedule changes and you no
                        longer need the product.
                      </li>
                    </ul>
                  </>
                }
              />

              <SectionBlock
                title="4. How to request a refund"
                body={
                  <>
                    <p>
                      To request a refund, please contact us first so we can look
                      into your case:
                    </p>
                    <p className="mt-2 text-sm">
                      Email:{" "}
                      <a
                        href="mailto:support@drivewise.app"
                        className="text-orange-300 hover:text-orange-200 underline underline-offset-2"
                      >
                        support@drivewise.app
                      </a>
                    </p>
                    <p className="mt-2">
                      Provide the email you used for purchase and any relevant
                      information (order ID, screenshots, and a short explanation
                      of the issue). We will review your request and respond as
                      soon as possible.
                    </p>
                  </>
                }
              />

              <SectionBlock
                title="5. Paddle as Merchant of Record"
                body={
                  <>
                    <p>
                      All payments are processed by{" "}
                      <span className="font-medium">Paddle</span>, our Merchant
                      of Record. Once a refund is approved:
                    </p>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                      <li>
                        The refund is issued by Paddle to your original payment
                        method.
                      </li>
                      <li>
                        Processing times may vary depending on your bank or card
                        issuer.
                      </li>
                    </ul>
                    <p className="mt-2">
                      In some cases, Paddle support may contact you directly or
                      handle parts of the refund process.
                    </p>
                  </>
                }
              />

              <SectionBlock
                title="6. Chargebacks"
                body={
                  <>
                    <p>
                      If you believe a payment was fraudulent or made without
                      your permission, please contact us and/or your payment
                      provider immediately.
                    </p>
                    <p className="mt-2">
                      We encourage you to contact us at{" "}
                      <a
                        href="mailto:support@drivewise.app"
                        className="text-orange-300 hover:text-orange-200 underline underline-offset-2"
                      >
                        support@drivewise.app
                      </a>{" "}
                      before initiating a chargeback so we can try to resolve the
                      issue quickly.
                    </p>
                  </>
                }
              />

              <SectionBlock
                title="7. Changes to this Refund Policy"
                body={
                  <>
                    <p>
                      We may update this Refund Policy from time to time to
                      reflect changes in our product or legal requirements. When
                      we do, we will update the &quot;Last updated&quot; date at
                      the top of this page.
                    </p>
                    <p className="mt-2">
                      Your continued use of DriveWise after changes are posted
                      means you accept the updated policy.
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
                  href="/terms-of-service"
                  className="hover:text-orange-200 transition-colors"
                >
                  Terms of Service
                </Link>
                <span className="text-border/60">•</span>
                <Link
                  href="/privacy-policy"
                  className="hover:text-orange-200 transition-colors"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <SiteFooter />
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

