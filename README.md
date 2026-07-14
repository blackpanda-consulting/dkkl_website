# DKKL (Kashi Laabh) — One-Page Website

Long-term residential stay in Kashi. Qualifies families, calculates the stay cost
by months, and takes eligible customers to a secure Razorpay payment — with all
money math and verification done **server-side**.

Built to the spec in `DKKL_One_Page_Website_Strategy_Flow…docx` and the plan in
`IMPLEMENTATION_PLAN.md`.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack) + **Tailwind CSS 4**
- **Neon Postgres** via **Prisma 7** (driver adapter over WebSockets)
- **Razorpay** (server-side orders, checkout, webhooks)
- **Zod** validation shared by the client form and the server order route

## Prerequisites

- Node.js 20.9+ (developed on 24)
- A Neon Postgres database ([neon.tech](https://neon.tech))
- A Razorpay account with API keys ([razorpay.com](https://razorpay.com))

## Setup

1. **Install**

   ```bash
   npm install
   ```

2. **Environment** — copy `.env.example` to `.env` and fill in real values:

   ```bash
   cp .env.example .env
   ```

   | Variable | What it is |
   |---|---|
   | `DATABASE_URL` | Neon **pooled** connection string |
   | `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Razorpay API keys (use test keys in dev) |
   | `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Same key id, exposed to the browser for Checkout |
   | `RAZORPAY_WEBHOOK_SECRET` | Webhook signing secret from the Razorpay dashboard |
   | `ADMIN_PASSWORD` | Shared password for the `/admin` panel |
   | `ADMIN_SESSION_SECRET` | Long random string used to sign the admin cookie |
   | `NEXT_PUBLIC_PHONE` / `NEXT_PUBLIC_WHATSAPP` | Numbers for the Call / WhatsApp CTAs |

3. **Create the database schema** (pushes the Prisma schema to Neon):

   ```bash
   npx prisma db push
   ```

   The pricing `Setting` row is created automatically on first use. Set the real
   monthly rate in the admin panel.

4. **Run**

   ```bash
   npm run dev      # http://localhost:3000
   ```

## Razorpay webhooks

Configure a webhook in the Razorpay dashboard pointing to:

```
https://YOUR_DOMAIN/api/razorpay/webhook
```

Subscribe to: `payment.captured`, `payment.failed`, `refund.processed`,
`refund.failed`. Set the secret to match `RAZORPAY_WEBHOOK_SECRET`.

Locally, expose your dev server with a tunnel (e.g. `ngrok http 3000`) and use the
tunnel URL as the webhook target.

## Admin panel

Visit `/admin`, sign in with `ADMIN_PASSWORD`, and edit the **monthly rate** and
**deposit** — changes take effect immediately on the public calculator, no deploy
needed. The bookings dashboard lists recent bookings and their payment status.

## How the money flow is kept safe (spec §12)

- The browser total is **display only**. `/api/orders` recomputes the amount from
  the DB-configured rate before creating the Razorpay order.
- Checkout signatures are verified in `/api/verify`; webhooks are verified and
  processed **idempotently** (`WebhookEvent` ledger).
- No card data is stored — only Booking/Order/Payment IDs, amounts, months and
  status.
- All amounts are stored as integer **paise**.

## Project layout

```
src/
  app/
    page.tsx                     one-page marketing site + calculator
    terms/                       terms / cancellation / refund (placeholder copy)
    book/success/                payment outcome screen (spec §11)
    admin/                       staff panel (rate editor + bookings)
    api/
      orders/                    create provisional booking + Razorpay order
      verify/                    verify checkout signature (optimistic)
      razorpay/webhook/          authoritative, idempotent status updates
      admin/login/               admin sign-in (signed cookie)
      admin/rate/                get/update pricing
  components/                    UI (nav, calculator, FAQ, admin forms…)
  lib/
    pricing.ts                   shared paise math (client + server)
    booking-schema.ts            shared Zod validation
    content.ts                   all site copy (edit here)
    db.ts / settings.ts          Prisma + settings singleton
    razorpay.ts                  client + signature verification
    admin-auth.ts                admin cookie session
```

## Before launch — still needed from DKKL

See the open questions in `IMPLEMENTATION_PLAN.md §15`. Most important:

1. **Approved monthly rate** and confirmed deposit (set in `/admin`).
2. **Final terms / cancellation / refund copy** (replace the placeholder in `/terms`).
3. Razorpay account KYC, live keys, and webhook secret.
4. Business phone / WhatsApp numbers.
5. Neon region choice and whether India data residency is required.
6. Confirmation notifications (email / WhatsApp) — not yet wired.
