# DriveWise / Windsurf – Improvement Backlog

This document aggregates the main improvements identified across the app. It is organized by area so you can pick off work in slices.

---

## 1. Onboarding & Auth

- **Tighter helper copy on auth pages**  
  Shorten and sharpen helper texts on login / register / reset so they are more action‑oriented and less verbose.

- **Stronger inline validation**  
  Add visible field‑level validation (e.g. password rules, invalid email) in addition to toasts, especially on:
  - Register
  - Reset password

---

## 2. Dashboard

- **Slightly loosen mobile spacing on analytics cards**  
  On very small screens, add a bit more vertical spacing around chart cards and stats grids to avoid a cramped feel.

- **Optional: microcopy for charts**  
  Add a short description or tooltip explaining what each chart represents (e.g. "Score trend last 30 days").

---

## 3. Classic Tests (`/test/[category]/[testNumber]`)

- **First‑time mode explanation**  
  Add a brief, dismissible hint explaining the difference between:
  - Standard tests (by number)
  - Mixed tests
  - Personalized tests based on weak questions

- **Reinforce “answered” status earlier**  
  You already show `answered / total` in the question navigator. Consider echoing a compact status near the primary CTA so users always know how many questions remain.

- **Optional: timer / pressure configuration (future)**  
  Consider a setting or mode that allows more relaxed timing for anxious learners (especially if you add a global timer later).

---

## 4. Decision Trainer – Categories & Sessions

- **Timer configurability (medium‑term)**  
  Current visible 30s timer works well for focus but can add pressure. Consider:
  - A calmer mode (longer timer or optional timer).
  - Remembering the learner’s preferred mode.

- **Fine‑tune explanation block on very small screens**  
  The detailed explanation + correct combination section is excellent; ensure font size and spacing remain comfortable on very small devices (e.g. slight reduction in padding or font size for `sm` breakpoint).

- **Achievement iconography**  
  Add small, distinct icons for each achievement (First Steps, Accuracy Ace, Streak Master, XP Hunter, Category Explorer, Consistency Pro) to improve at‑a‑glance recognition.

- **Weak‑points UX hint**  
  Add one small hint near the Weak Points mode CTA explaining how it chooses categories ("focuses the category where your accuracy is lowest").

---

## 5. Decision Trainer – Leaderboard

- **Optional filters**  
  In the future, add filters such as:
  - Time range (7 days / 30 days / all‑time)
  - Category filter (all vs per category)

- **Compact mobile row variant**  
  Rows are now aligned, but you could add a more compact variant on very small screens (slightly smaller paddings, font sizes) to show more entries without scrolling.

---

## 6. Materials (`/materials`)

- **Mobile sidebar behavior**  
  Ensure the chapter sidebar collapses or scrolls gracefully on small screens so it doesn’t dominate vertical space. Possible improvements:
  - Collapsible accordion for chapters on mobile.
  - Sticky search + current chapter indicator.

- **Section labeling**  
  Add small section headings for "Chapters" (sidebar) and "Content" (main) to help orient new users.

---

## 7. History (`/history` and `/history/[id]`)

- **More scannable attempt rows**  
  Consider a condensed summary strip per attempt with:
  - Date
  - Score / pass‑fail icon
  - Category + test type (standard / mixed / personalized)

- **Optional: filters and search**  
  Add basic filters (date range, category, passed/failed) or search by topic/test name when you have many attempts.

---

## 8. Admin – General

- **Upgrade loaders to skeletons on heavy admin pages**  
  For pages like:
  - `admin/questions`
  - `admin/materials`
  - `admin/stats` (user list)
  Replace simple center spinners with skeleton layouts that mirror tables/lists for visual consistency with learner pages.

- **Better hierarchy for large lists**  
  As question/material counts grow, consider:
  - Tabs or sub‑sections (e.g. by category or status).
  - Sticky filter bar on scroll.

- **Admin onboarding / help**  
  Add short inline helpers or a small help link that explains how admin scenarios/questions hook into the learner side (tests & Decision Trainer).

---

## 9. Feedback, Toasts & Skeletons

- **Verify toast semantics by context**  
  Now that styling is unified, review where `success` vs `info` vs `error` is used and ensure each matches the actual outcome (e.g. non‑blocking notices should stay `info`).

- **Global skeleton usage checklist**  
  As you add new pages or refactor existing ones, follow this pattern:
  - Long data fetches: use the themed `Skeleton` component with a layout that mirrors the final UI.
  - Short fetches or small side queries: a subtle inline spinner is enough.

---

## 10. UX / Copy Polish

- **Language consistency (EN/SQ)**  
  When you add new text or achievements, ensure translations are kept in sync and tone remains consistent (short, learner‑friendly, not overly formal).

- **Microcopy in CTAs**  
  Standardize CTA wording across the app (e.g. "Practice weak points" vs "Practice weak topics" vs "Weak points mode") so learners immediately recognize related actions.
