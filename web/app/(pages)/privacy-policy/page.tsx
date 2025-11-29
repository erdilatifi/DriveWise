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

export default function PrivacyPolicyPage() {
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
              id="grid-privacy"
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
          <rect width="100%" height="100%" fill="url(#grid-privacy)" />
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
                Legal · Privacy Policy
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                This Privacy Policy explains how DriveWise collects, uses, and
                protects your information.
              </p>
              <p className="text-xs text-muted-foreground/80">
                Last updated: <span className="font-medium">November 22, 2025</span>
              </p>
            </div>

            {/* Content */}
            <GlassCard className="relative border border-border/80 bg-black/80 px-5 py-6 md:px-8 md:py-8 flex flex-col gap-6">
              <SectionBlock
                title="1. Who we are"
                body={
                  <>
                    <p>
                      DriveWise is an online learning platform focused on helping
                      learners prepare for the driving theory exam through mock
                      tests, quizzes, and study materials.
                    </p>
                    <p className="mt-2">
                      For privacy-related questions, you can contact us at{" "}
                      <a
                        href="mailto:support@drivewise.app"
                        className="text-orange-300 hover:text-orange-200 underline underline-offset-2"
                      >
                        support@drivewise.app
                      </a>
                      .
                    </p>
                  </>
                }
              />

              <SectionBlock
                title="2. Information we collect"
                body={
                  <>
                    <p>We collect the following categories of information:</p>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                      <li>
                        <span className="font-medium">Account data</span> – email
                        address and, optionally, your name.
                      </li>
                      <li>
                        <span className="font-medium">Usage data</span> – tests
                        taken, scores, progress, categories you practice, and
                        basic interaction with the platform.
                      </li>
                      <li>
                        <span className="font-medium">Device & technical data</span>{" "}
                        – IP address, browser type, and basic technical metadata
                        used for security and analytics.
                      </li>
                    </ul>
                    <p className="mt-2">
                      We do <span className="font-medium">not</span> collect
                      sensitive personal data such as national ID numbers,
                      health data, or financial accounts.
                    </p>
                  </>
                }
              />

              <SectionBlock
                title="3. Payments & card information"
                body={
                  <>
                    <p>
                      All payments for DriveWise are processed by{" "}
                      <span className="font-medium">Paddle</span>, our payment
                      provider and Merchant of Record.
                    </p>
                    <p className="mt-2">
                      Paddle is responsible for securely handling your payment
                      method, billing information, and any related financial
                      data. We do not store or have direct access to your full
                      card number or bank details.
                    </p>
                  </>
                }
              />

              <SectionBlock
                title="4. How we use your information"
                body={
                  <>
                    <p>We use the information we collect to:</p>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                      <li>Create and manage your DriveWise account.</li>
                      <li>Provide access to mock tests and study materials.</li>
                      <li>Track your progress, scores, and performance.</li>
                      <li>Improve the content and features of the platform.</li>
                      <li>
                        Communicate with you about important updates, security
                        alerts, or support requests.
                      </li>
                      <li>
                        Detect, prevent, and address technical or security issues.
                      </li>
                    </ul>
                  </>
                }
              />

              <SectionBlock
                title="5. Legal basis for processing"
                body={
                  <>
                    <p>
                      Depending on your location, we process your information on
                      the basis of:
                    </p>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                      <li>
                        <span className="font-medium">
                          Contractual necessity
                        </span>{" "}
                        – to provide you with the service you signed up for.
                      </li>
                      <li>
                        <span className="font-medium">Legitimate interests</span>{" "}
                        – to maintain and improve the platform, prevent abuse,
                        and secure our systems.
                      </li>
                      <li>
                        <span className="font-medium">Consent</span> – for
                        specific features, such as optional communications or
                        certain types of analytics.
                      </li>
                    </ul>
                  </>
                }
              />

              <SectionBlock
                title="6. Cookies & similar technologies"
                body={
                  <>
                    <p>
                      We use cookies and similar technologies to keep you logged
                      in, remember preferences, and measure basic usage.
                    </p>
                    <p className="mt-2">
                      You can control cookies through your browser settings.
                      However, disabling essential cookies may cause parts of
                      the platform to stop working correctly.
                    </p>
                  </>
                }
              />

              <SectionBlock
                title="7. Data retention"
                body={
                  <>
                    <p>
                      We keep your data only for as long as it is needed to
                      provide the service and for legitimate business or legal
                      purposes.
                    </p>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                      <li>
                        Account data is retained while your account is active.
                      </li>
                      <li>
                        Some limited data may be kept after account deletion for
                        fraud prevention, security, or legal obligations.
                      </li>
                    </ul>
                  </>
                }
              />

              <SectionBlock
                title="8. Your rights"
                body={
                  <>
                    <p>
                      Depending on your location, you may have the right to:
                    </p>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                      <li>Access the personal data we hold about you.</li>
                      <li>Request correction of inaccurate data.</li>
                      <li>Request deletion of your account and data.</li>
                      <li>
                        Object to or restrict certain types of processing.
                      </li>
                    </ul>
                    <p className="mt-2">
                      To exercise these rights, contact us at{" "}
                      <a
                        href="mailto:support@drivewise.app"
                        className="text-orange-300 hover:text-orange-200 underline underline-offset-2"
                      >
                        support@drivewise.app
                      </a>
                      .
                    </p>
                  </>
                }
              />

              <SectionBlock
                title="9. Children"
                body={
                  <>
                    <p>
                      DriveWise is not intended for children under 13 years of
                      age. If you believe a child has provided us with personal
                      data without parental consent, please contact us and we
                      will take appropriate action.
                    </p>
                  </>
                }
              />

              <SectionBlock
                title="10. Changes to this policy"
                body={
                  <>
                    <p>
                      We may update this Privacy Policy from time to time. When
                      we do, we will update the &quot;Last updated&quot; date
                      at the top of this page.
                    </p>
                    <p className="mt-2">
                      If changes are significant, we may notify you via email or
                      through the platform.
                    </p>
                  </>
                }
              />

              <SectionBlock
                title="11. Contact"
                body={
                  <>
                    <p>
                      If you have any questions or concerns about this Privacy
                      Policy, you can reach us at:
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
                  href="/terms-of-service"
                  className="hover:text-orange-200 transition-colors"
                >
                  Terms of Service
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

