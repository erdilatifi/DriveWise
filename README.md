# DriveWise (Monorepo)

DriveWise is a driving-theory learning platform with:

- A **Web app** (Next.js + Supabase) for analytics dashboards, admin tools, and payments.
- A **Mobile app** (Expo + React Native + Supabase) for on-the-go study and practice.
- A shared **core package** (`packages/core`) that contains shared Supabase types, hooks, and context.

This repository is a **Node.js workspaces monorepo**.

---

## Apps & Packages

- **`web/`**: Next.js app (App Router)
- **`mobile/`**: Expo app
- **`packages/core/`**: Shared code used by both web and mobile
- **`database/`**: SQL scripts used to setup / update the Supabase database (schema, RLS policies, performance)

---

## Tech Stack

### Web
- Next.js (App Router)
- Supabase (Postgres + Auth + Storage)
- TanStack Query
- Tailwind CSS + shadcn/ui
- Paddle (Hosted Checkout + Webhooks)

### Mobile
- Expo + React Native
- React Navigation
- NativeWind (Tailwind for React Native)
- TanStack Query
- Supabase

---

## Core Product Features (What the app does)

### 1) Testing system
- Official-style mock tests (including predefined tests and mixed/randomized practice).
- Test attempts are saved to the database and used for analytics.
- Result review + score breakdown.
- Weak-topic detection (based on your historical answers).

### 2) Analytics dashboard (web)
- Average score, total tests, best score.
- Weekly progress chart.
- Pass/fail trends.
- Global streak tracking.

### 3) Decision Trainer
- Scenario-based training (traffic situation decisions).
- XP progression.
- Leaderboard (optimized with database-side aggregation/materialized views).

### 4) Study materials
- Category-based learning materials.
- Deep linking from weak topics to relevant chapters.

### 5) Subscription / payments
- Premium unlocks for a specific license category (A/B/C/D).
- Paddle Hosted Checkout used for payments.
- A verified webhook provisions purchases into Supabase (`orders`, `payment_transactions`, `user_plans`).

### 6) Admin tools
- Admin-only pages to manage users and content.
- Admin access is based on `user_profiles.is_admin`.

---

## Repository Layout

```text
./
  web/                 # Next.js web app
  mobile/              # Expo mobile app
  packages/core/       # shared types/hooks/context
  database/            # SQL scripts for Supabase
  package.json         # workspaces root
```

---

## Prerequisites

- Node.js (recommended: latest LTS)
- npm
- A Supabase project (URL + keys)
- A Paddle account (sandbox or production) for Hosted Checkout + webhook secret

---

## Environment Variables

### Web (`web/.env.local`)
Copy `web/env.example` to `web/.env.local` and fill the values.

Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- `NEXT_PUBLIC_PADDLE_HSC_1M`
- `NEXT_PUBLIC_PADDLE_HSC_2M`
- `NEXT_PUBLIC_PADDLE_HSC_3M`
- `PADDLE_WEBHOOK_SECRET`
- `PADDLE_API_KEY` (required for subscription management endpoints)

### Mobile (`mobile/.env`)
The mobile app uses Supabase as well.

Typical required values:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

If your mobile Supabase config is not using these names, check:
- `mobile/src/lib/supabase.ts`

---

## Database Setup (Supabase)

1. Create a Supabase project.
2. Run the SQL scripts from `./database/` in the Supabase SQL editor.
   - These scripts define tables, indexes, triggers, RPC functions, and Row Level Security policies.
3. Ensure RLS is enabled and policies are applied for all tables.

---

## Install Dependencies

From the repo root:

```bash
npm install
```

This repo uses npm workspaces, so this installs dependencies for `web`, `mobile`, and `packages/*`.

---

## Run: Web

From the repo root:

```bash
npm --workspace web run dev
```

Or run it from inside `web/`:

```bash
npm run dev
```
- The web app uses Next.js middleware to protect routes.
- Public routes include `/`, `/pricing`, and `/payment/success`.

---

## Run: Mobile

From the repo root:

```bash
npm --workspace mobile run start
```

Or run it from inside `mobile/`:

```bash
npm run start
```

If you need tunnel mode (common in restricted networks):

```bash
npx expo start --tunnel
```

---

## Payments Flow (High level)

1. User selects a category + plan on `/pricing`.
2. User is redirected to Paddle Hosted Checkout with `custom_data` and `passthrough` metadata.
3. Paddle sends `transaction.completed` to the webhook:
   - `web/app/api/paddle/webhook/route.ts`
4. The webhook verifies the signature and provisions:
   - `orders`
   - `payment_transactions`
   - `user_plans` (activates premium access)

---

## Scripts / Useful Commands

### Web
- `npm run dev`
- `npm run build`
- `npm run start`

### Mobile
- `npm run start`
- `npm run android`
- `npm run ios`

---

## Notes

- **Admin permissions**: derived from `user_profiles.is_admin`.
- **Blocked users**: handled via `user_profiles.is_blocked`.
- **Security**: client code is protected by Supabase RLS; server routes/webhooks use the service role key.
