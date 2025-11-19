I’m building a web app with paid plans.
Right now I don’t have real payment credentials yet, so I want you to:

Build the full subscription foundation (logic, models, UI, fake payment flow).

Make it easy to plug in real payment credentials later via .env.

Ensure admins are never restricted by plan limits or payments.

Use the details below for the feature set, logic, and UI.

1. Plans & Restrictions
Free Plan

For normal (non-admin) users on the Free plan:

Can:

Take up to 3 tests per category (treat this as “3 tests per category per billing cycle”; make the cycle duration configurable).

View a simple test history list (date, category, final score summary only).

Cannot:

Access Decision Trainer.

Access Study Material.

Review tests in detail (no question-by-question, no explanations). They only see high-level history entries.

Paid Plans (Per Category)

Each paid plan is tied to one selected category (e.g., Math, Verbal, etc.).

Pricing for that single category:

Plan A: 3 € for 1 month

Plan B: 5 € for 2 months

Plan C: 8 € for 3 months

For the chosen category, a paid plan should:

Remove or significantly raise the 3-tests-per-category limit (make it configurable).

Unlock:

Decision Trainer (for that category).

Study Material (for that category).

Full test review (question-by-question, explanations) for that category.

Track start date, end date, and whether the plan is active or expired.

Admin Bypass

If user.isAdmin === true (or equivalent flag):

Ignore all limits and paywalls:

Unlimited tests in all categories.

Full access to Decision Trainer, Study Material, and detailed reviews.

Admin should not need to subscribe or pay to access anything.

Admin can still see pricing UI for testing, but logic should not block them.

2. Payments & Integration Setup

I will only have real bank/payment info in a few days.
For now, do the following:

Implement a payment abstraction with:

A fake / mock payment flow for development mode.

A clear place to plug in real payment provider (e.g., Stripe) later.

Use environment variables in .env to configure payment details:

Example: PAYMENT_PROVIDER_KEY, PAYMENT_WEBHOOK_SECRET, PAYMENT_ENABLED=true/false, etc.

Logic:

If PAYMENT_ENABLED=false:

Use a mock payment flow:

Simulate successful payment.

Create/activate the selected plan for the user.

This lets us test the entire subscription flow without real charges.

If PAYMENT_ENABLED=true:

Call the real payment provider (you can leave this as a well-structured stub with clear TODOs).

Make sure:

Plan creation/activation is decoupled from the payment provider (e.g., a function like activatePlanForUser(userId, categoryId, planType)), so swapping providers is easy.

3. Psychological / Business Strategy in Pricing UI

Design the pricing UI to nudge users toward one preferred plan (most likely the 3-month / 8 € plan, but keep this configurable).

Add:

Badges:

“Most Popular” or “Best Value” on the target plan.

Price anchoring:

Show all three plans side-by-side.

Show effective monthly price (e.g., 2.67 €/month for the 3-month plan).

Visual emphasis:

Slightly larger card, stronger border, or highlight for the target plan.

Microcopy:

Text like “Best for serious learners”, “Save X%”, “Recommended”.

Optional: preselect the target plan by default (for non-admin users).

Implement this as actual UI and copy, not just comments.

4. UI Requirements
4.1 Pricing / Plans Page

Create a Pricing / Plans page where a regular user can:

See:

What the Free plan offers and its limitations.

The three paid options (1, 2, 3 months) for the currently selected category.

Pick a category and then choose Plan A/B/C.

See clearly:

Which features are locked on Free.

Which features are unlocked on Paid.

On selecting a plan:

Trigger the (mock or real) payment flow.

On success, call the logic to store/activate the plan:

User ID

Category

Plan type (1/2/3 months)

Start date

End date

Status (active/expired)

For admin users:

They should be able to view this page but never blocked:

No restrictions or paywalls applied.

You can hide payment CTAs for admins or mark it as “Preview mode”.

4.2 Profile Page

Create a Profile page where the user sees:

Basic info:

Name, email, avatar (placeholder if needed).

Plan status per category:

Free or Paid.

If Paid:

Plan type (1/2/3 months).

Purchase date.

Expiration date.

Remaining days until expiration.

Usage stats:

Tests taken per category this cycle.

For Free categories: display usage like “2/3 tests used this month”.

Actions:

If on Free: show Upgrade / “See Plans” buttons.

If on Paid: show Extend/Renew buttons that lead to the Pricing page (preselect the same category).

For admins:

Show the same page, but:

Indicate clearly that they have unlimited access and are not restricted by plans.

You can show plan info for test purposes, but it should not affect their permissions.

4.3 Test Restrictions UI

Integrate plan logic into the test-taking flow:

If a non-admin Free user hits the 3-tests-per-category limit:

Show a friendly message explaining the limit.

Provide a clear Upgrade CTA linking to the Pricing page (with that category selected).

If a Free user tries to access:

Decision Trainer or Study Material: show a paywall (feature locked) with an upgrade button.

If a Free user tries to review a test in detail:

Show a paywall message that detailed review is available with a paid plan.

For admins:

These checks should always pass, as if they are on the highest plan for all categories.

5. Admin Page

Add an Admin section (protected by isAdmin flag) where an admin can:

View a table of users:

Name, email.

Plans per category:

Free or Paid.

Plan type (1/2/3 months).

Start date, end date.

Status: active, expired, or expiring soon.

Optionally:

Filter by status (e.g., only Paid, only expiring soon).

See usage metrics (e.g., tests taken per category).

For now, you can also allow admin to:

Manually grant or extend plans for any user (useful before real payments are live).

Admins should never be asked to pay and should always have unrestricted access.

6. Implementation Notes

Assume a web app stack (e.g., React/Next.js + backend). Use the existing project stack.

Implement:

Data models / types for:

User

Plan

Category

Subscription / Entitlements

Backend logic for:

Plan limits

Feature access per user & category

Plan expiration

Mock payment success flow

Frontend UI for:

Pricing / Plans page

Profile page

Admin plan overview page

Paywall dialogs / messages in test, study, and review flows

Keep configuration for:

Test limits (e.g., FREE_TEST_LIMIT_PER_CATEGORY=3)

Target plan for “Best Value”

Billing cycle duration
in a central config file or object.

Start by:

Defining the data models and plan entitlement logic.

Implementing mock payment + plan activation/expiration.

Then build the Pricing, Profile, Admin, and Paywall UI that uses this logic.