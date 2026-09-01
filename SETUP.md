# Go-live setup

The site is wired for real accounts, bookings, Stripe, admin, and email. It needs three free accounts and the keys added on Vercel.

## 1. Supabase (accounts + database)

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor** → paste and run `supabase/schema.sql`.
3. **Authentication → Providers → Email** → enable email/password. Turn off “Confirm email” if you want instant signup.
4. Copy from **Settings → API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (server only)

Sign up once with **hello@pawside.co** — that email is an admin automatically.

## 2. Stripe (payments)

1. Create an account at [stripe.com](https://stripe.com).
2. Developers → API keys → `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Developers → Webhooks → Add endpoint:
   - URL: `https://pawside.co/api/stripe/webhook`
   - Event: `checkout.session.completed`
   - Signing secret → `STRIPE_WEBHOOK_SECRET`

Test with card `ACCT-000015`.

## 3. Resend (email)

1. Create an account at [resend.com](https://resend.com).
2. Add and verify the domain `pawside.co`.
3. Create an API key → `RESEND_API_KEY`.
4. Set `RESEND_FROM` to `Pawside <hello@pawside.co>` after the domain is verified.

Until the domain is verified, Resend will only send to your own login email.

Every booking and contact form message is emailed to **hello@pawside.co**.

## 4. Vercel env vars

In the Pawside project → Settings → Environment Variables, add everything from `.env.example`, then **Redeploy**.

```
NEXT_PUBLIC_SITE_URL=https://pawside.co
OPS_EMAIL=hello@pawside.co
ADMIN_EMAILS=hello@pawside.co
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
RESEND_FROM=Pawside <hello@pawside.co>
```

## What works after that

| URL | What it does |
| --- | --- |
| `/signup` `/login` | Customer accounts |
| `/book` | Saves a booking, emails hello@, optional Stripe Checkout |
| `/account` | Signed-in customer area |
| `/admin` | Bookings, status, contact messages — admin only |
| `/contact` | Stores the message and emails hello@ |
