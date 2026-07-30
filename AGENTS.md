# OSAKA Workation — Agent Guide

Token-efficient context for AI agents. Prefer this file over rediscovering structure.

## Stack

- **Next.js 14** App Router (`app/`), React 18, TypeScript strict
- **Tailwind** — `brand.orange` `#ea5504`, `paper.cream` `#f7ede0`
- **i18n** — `en` | `ja` under `app/[locale]/…`; dictionaries in `lib/i18n/`
- **Supabase** — Auth + Postgres (`@supabase/ssr`, `@supabase/supabase-js`)
- **Icons** — `lucide-react` only

Path alias: `@/*` → project root.

## Architecture

```
app/[locale]/              # Public + auth + join + admin (locale-prefixed)
components/                # UI (header, join form, admin actions, …)
lib/site.ts                # Marketing copy, STAYS, PRICING (from tickets)
lib/workation-packages.ts  # Ticket SKUs, prices, early-bird/referral limits
lib/supabase/              # client / server / middleware / admin clients
lib/auth/                  # session helpers, server actions, logging
lib/events/                # registration save + admin status actions
supabase/migrations/       # schema + RLS source of truth
docker/ + docker-compose   # local Supabase stack
```

**Data:** new persistent data → migrations + RLS. Marketing copy may stay in `lib/site.ts` until migrated.

**Auth:** authorize on the server (`getUser` + `profiles.role`). Never trust the client for roles.

### Roles

| Role | Access |
|------|--------|
| `user` | Account, Join, own registrations |
| `admin` | All of the above + `/admin/*` (users, registrations, approve) |

Promote admins via SQL / service role only.

## Registration (Join)

- Nav tab **Join** only when signed in → `/[locale]/join`
- Public `/events` stays marketing-only
- Member picks: event → duration (1w/2w) → ticket type (general / early bird / referral) → contact
- **Join journey UI** (`/join`): Register → Review → Pay → Confirmed, driven by `event_registrations.status` (`lib/join-journey.ts`)
- All tickets include coworking, t-shirt, community, welcome & farewell parties with meals, 2 guides, 1 day + 1 night event/day; weekend city tours guided only (transport/extras not included); random pop-ups not included
- **Early bird:** 10% off, first 20 tickets (`EARLY_BIRD_LIMIT`)
- **Referral:** 10% off with another member’s `profiles.referral_code` (max 10 uses per referrer)
- **Edit prices:** `WORKATION_TICKET_PRICES` in `lib/workation-packages.ts`, then sync `event_options.price_jpy` (migration / Studio)
- Saved in `event_registrations` (`package_key`, `referrer_id`, `referral_code_used`, `phone`, `notes`, `status`)

### Approval workflow

```
draft → pending_approval → approved → paid
                      ↘ cancelled
```

1. Member **Save draft** or **Submit for approval**
2. Status becomes `pending_approval`
3. Admin **Approve** / **Reject** on `/admin/registrations`
4. Member **Pay now** → Stripe Checkout Session (`lib/stripe/`)
5. Webhook `/api/stripe/webhook` sets `paid` (admin **Mark paid** is a local fallback)

Members cannot self-approve or self-mark paid. Checkout only for `approved`.

Env (local test): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — see README.

## Admin

| Path | Purpose |
|------|---------|
| `/admin` | Overview stats |
| `/admin/users` | Profiles + auth extras |
| `/admin/registrations` | All Join choices + approve/reject |

## Coding style

- Double quotes, trailing commas, functional components
- Server Components by default; `"use client"` only when needed
- Reuse `btn-primary`, `btn-ghost`, `container-page`, `eyebrow`
- Cream / ink / orange only — no new design system
- No drive-by refactors

### Supabase clients

| Context | Import |
|---------|--------|
| Client Components | `@/lib/supabase/client` |
| RSC / actions / route handlers | `@/lib/supabase/server` |
| Middleware | `@/lib/supabase/middleware` |
| Service role | `@/lib/supabase/admin` (server-only) |

Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`. See `.env.example`.

### Environments

- **Local Docker:** `npm run db:up` — API `:54321`, Studio `:54323`, mail `:54324`
- **Hosted:** same env var names; apply `supabase/migrations/`
- Migrate container tracks `schema_migrations` — does not re-apply old files. Use `db:reset` only to wipe.

## Auth routes

| Path | Purpose |
|------|---------|
| `/login`, `/signup` | Auth |
| `/account` | Profile |
| `/join` | Member registration |
| `/admin/*` | Admin |
| `/auth/callback` | Email confirm / OAuth |

Middleware: locale redirect + session refresh + guards for `/account`, `/join`, `/admin`.

## Do / don't

- **Do** add RLS with every new table
- **Do** keep Join approval server-side
- **Don't** expose `SUPABASE_SERVICE_ROLE_KEY`
- **Don't** use `getSession()` alone to authorize
- **Don't** let users update `profiles.role` or approve their own registration

## Commands

```bash
npm run db:up
npm run db:down
npm run db:reset    # destructive wipe + remigrate
npm run dev
npx supabase db push   # linked remote
```
