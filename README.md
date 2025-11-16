# DriveWise – Kosovo Driving Theory & Decision Trainer

DriveWise is a modern web application for preparing for the Kosovo driving theory exam **and** practicing real‑world driving decisions.

Built with **Next.js (App Router)**, **Supabase**, **TypeScript**, and **Tailwind CSS**, it supports:

- Theory mock tests (per category, mixed, and personalized)
- Interactive Decision Trainer scenarios with XP and leaderboard
- Admin tools for managing questions, scenarios, and users
- Multilingual UI (English and Albanian)
- Fully responsive design optimized down to very small phones

---

## 🚗 Main Features

- **License Categories**
  - Categories `A`, `B`, `C`, `D` for theory tests (used throughout the app).

- **Theory Tests**
  - Category pages with a grid of mock tests per license category.
  - Each test shows one question at a time with progress bar.
  - **Mixed Test**: random questions from all tests in a category.
  - **Personalized Test**: focuses on questions the user previously got wrong.
  - Support for **multiple correct answers** (checkbox‑style options when needed).
  - Results screen with score, pass/fail, and basic stats.
  - Test attempts and per‑question answers are stored in Supabase.

- **Decision Trainer (Scenarios)**
  - Scenario categories (traffic lights, signs, pedestrians, hazards, parking, right‑of‑way).
  - Scenarios loaded from `decision_trainer_scenarios` in Supabase.
  - Multiple correct options supported; strict validation (must select all and only correct options).
  - Timed scenarios with XP rewards, streak, and session stats.
  - Detailed feedback with correct explanation and real‑world tip.
  - **Leaderboard** page showing top learners, XP, accuracy, categories completed, and best streak.

- **User Dashboard & History**
  - Dashboard with:
    - Total tests, average score, best score, streak, tests this week.
    - Weekly progress line chart (last 7 days).
    - Pass/fail pie chart.
  - History page with:
    - Paginated list of test attempts.
    - Per‑test score, category, test number, and date.
    - Ability to review a test in detail.
    - Delete a single attempt or clear all history.

- **Admin Panel**
  - Admin access controlled via `user_profiles.is_admin` in Supabase.
  - **Questions**
    - Admin page to list, search, filter, and paginate `admin_questions`.
    - Create/edit/delete questions with options, correct answers, and optional image.
  - **Scenarios**
    - Admin page to manage `decision_trainer_scenarios` with:
      - Filtering by category, level, status.
      - Server‑side pagination.
      - Add/Edit forms for question, options (with explanations), correct explanation, real‑world tip, XP, and optional image upload to Supabase Storage.
  - **Stats / User Management**
    - Total users, total questions, total attempts, pass/fail counts, pass rate.
    - Paginated, searchable user list with test attempt counts.
    - Block/unblock users and delete user accounts.

- **Language Support (UI)**
  - EN (`en`) and Albanian (`sq`) UI text via a custom `LanguageProvider`.
  - Navbar language toggle, persisted in `localStorage`.
  - Pages using translations: home, category, tests, decision trainer, navbar, dashboard, etc.
  - Note: **question/scenario content text itself is currently single‑language per record**; full multilingual content would require DB changes.

- **Responsive & Mobile‑First Design**
  - All main pages (home, category, test, decision trainer, dashboard, history, admin) use Tailwind grids/flex with mobile‑first breakpoints.
  - Layouts adjust down to very small phone widths (e.g., single‑column grids, stacked controls, no horizontal scrolling).
  - Skeleton loading states on key pages (dashboard, test, decision-trainer, history, admin scenarios, leaderboard) for smooth UX.

- **Authentication & Security**
  - Supabase Auth for sign‑up/login.
  - User profiles stored in `user_profiles` with admin flag and optional app rating.
  - Row Level Security (RLS) in Supabase to restrict data by user and role.
  - Protected pages (dashboard, decision trainer, admin) show proper loaders and redirects instead of flashing content.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Data Fetching**: TanStack Query (React Query)
- **Icons**: Lucide React

---

## 📋 Prerequisites

- Node.js 18+
- A Supabase account and project
- npm or yarn

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/erdilatifi/DriveWise.git
cd DriveWise
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

Find these values in Supabase: **Project Settings → API**.

### 4. Set up the database

In your Supabase project:

1. Go to **SQL Editor**.
2. Run the contents of:
   - `database/complete_database_setup.sql`
   - `database/comprehensive_rls_policies.sql`

This will create:

- Core tables: `user_profiles`, `admin_questions`, `test_attempts`, `test_attempt_answers`, etc.
- Decision Trainer tables: `decision_trainer_scenarios`, `decision_trainer_progress`, `decision_trainer_attempts`, `decision_trainer_badges`.
- RLS policies and indexes for performance and security.
- Storage bucket for decision-trainer images.

### 5. Run the development server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure (High Level)

```text
drivewise/
├── app/
│   ├── (pages)/
│   │   ├── (auth)/          # Auth screens
│   │   ├── admin/           # Admin pages (questions, scenarios, stats)
│   │   ├── category/        # Category selection & test listing
│   │   ├── decision-trainer # Decision Trainer + leaderboard
│   │   ├── history/         # Test history & review
│   │   └── test/            # Test-taking UI
│   ├── layout.tsx           # Root layout (providers, language, navbar)
│   └── page.tsx             # Home page
├── components/              # UI components (navbar, cards, etc.)
├── contexts/                # Auth and language providers
├── database/                # SQL setup files
├── hooks/                   # React Query hooks for tests, scenarios, etc.
├── types/                   # Shared TypeScript types (DB, categories, etc.)
└── utils/                   # Supabase client and helpers
```

---

## 🎨 Design & UX Principles

- **Exam‑focused**: Minimal distractions; flows match exam style.
- **Mobile‑first**: Layouts designed to work well on very small screens and scale up.
- **Consistent loading**: Skeletons and spinners used appropriately during data/auth loading.
- **Clear feedback**: Toasters for success/error, detailed result screens.
- **Language‑aware UI**: Most labels and messages respect the selected language (EN/SQ).

---

## 🔐 Security

- Supabase RLS policies for per‑user data isolation.
- Role‑based access for admin features (via `user_profiles.is_admin`).
- Environment variables for all secrets/keys.
- HTTPS recommended in production (via your hosting provider).

---

## 📝 License

This project is licensed under the **MIT License**.

---

## 🤝 Contributing & Support

Contributions are welcome via Pull Requests.

For questions or issues, please open an issue on the GitHub repository.

---

**DriveWise** – Helping Kosovo learners pass their driving theory exam and make better driving decisions 🚗
