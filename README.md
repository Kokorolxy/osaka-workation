# OSAKA Digital Nomads Workation

Marketing site + member registration for the Osaka Workation community.

**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase (Auth + Postgres).  
**Locales:** `en` / `ja` under `/[locale]/…`  
**Brand:** cream `#f7ede0`, ink `#0f0f0f`, orange `#ea5504`

## Pages

| Route | Access | Purpose |
|-------|--------|---------|
| `/` | Public | Home |
| `/stays` | Public | Housing styles & curated stays |
| `/events` | Public | Workation programme (marketing) |
| `/community`, `/blog`, `/about`, `/contact`, `/faq` | Public | Content pages |
| `/login`, `/signup` | Public | Auth |
| `/account` | Signed-in | Profile |
| `/join` | Signed-in | Event registration (package + housing type) |
| `/admin` | Admin | Overview |
| `/admin/users` | Admin | Platform users |
| `/admin/registrations` | Admin | Review & approve Join choices |

## Registration approval flow

1. Member signs up / signs in  
2. Opens **Join** → picks event and package (coworking ± transport, or housing singular/shared ± transport)  
3. **Save draft** or **Submit for approval** → status `pending_approval`  
4. Admin opens **Admin → Registrations** → **Approve** or **Reject**  
5. After **Approve**, member clicks **Pay now** → Stripe Checkout (test/live)  
6. Webhook marks registration `paid` (or admin **Mark paid** as local fallback)

Statuses: `draft` → `pending_approval` → `approved` → `paid` (or `cancelled`).

## Stripe checkout (local)

1. Create a [Stripe](https://dashboard.stripe.com) account and turn **Test mode** on  
2. Copy the **Secret key** (`sk_test_…`) into `.env.local` as `STRIPE_SECRET_KEY`  
3. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

4. Paste the CLI webhook signing secret (`whsec_…`) into `.env.local` as `STRIPE_WEBHOOK_SECRET`  
5. Restart `npm run dev`  
6. Flow: Join → submit → Admin Approve → **Pay now** → card `4242 4242 4242 4242`  
7. Status should become **Paid** via the webhook  

If the webhook isn’t running, admins can use **Mark paid** on Admin → Registrations.

Amounts come from `event_options.price_jpy` (JPY, no decimals). No Payment Link setup required for local.

Ticket catalog (1w/2w × general / early bird / referral) lives in `lib/workation-packages.ts` — sync DB via migration `20260727120000_ticket_pricing_referrals.sql`.

Apply migrations after pulling:

```bash
npm run db:up
# or wipe + remigrate: npm run db:reset
```

## Run locally

```bash
npm install
cp .env.example .env.local   # local Docker keys already filled in

npm run db:up                # Supabase stack (Docker)
npm run dev                  # http://localhost:3000
```

| Service | URL |
|---------|-----|
| App | http://localhost:3000 |
| Supabase API (Kong) | http://127.0.0.1:54321 |
| Studio | http://127.0.0.1:54323 |
| Mail (Inbucket) | http://127.0.0.1:54324 |
| Postgres | localhost:54322 |

```bash
npm run db:down     # stop
npm run db:reset    # wipe DB volume + remigrate (destructive)
npm run db:logs     # follow logs
```

Promote your first admin after signup (Studio SQL or `psql`):

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

## Hosted Supabase (dev/prod)

1. Create a Supabase project  
2. Apply migrations from `supabase/migrations/` (SQL editor or `npx supabase db push` after linking)  
3. Set `.env.local` / Vercel env:

| Variable | Source |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role (server only) |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` or your deploy URL |
| `STRIPE_SECRET_KEY` | Stripe secret (`sk_test_…` locally) |
| `STRIPE_WEBHOOK_SECRET` | From Stripe CLI or Dashboard webhook |

4. Auth → URL config: Site URL + redirect URLs  
   `…/en/auth/callback`, `…/ja/auth/callback`

You do **not** need Docker/Kong for hosted — only for local. 

## Build / deploy

```bash
npm run build
npm start
```

Vercel: import the repo, set the env vars above, deploy.

## Look & feel

Cream / white backgrounds, near-black text, orange accent. Icons: `lucide-react` only. Shared copy lives in `lib/site.ts` and `lib/i18n/dictionaries/`.

## Assets

- `public/logo/` — brand marks  
- `public/img/` — city, food, coworking  
- `public/stays/` — stay / housing imagery  
- `public/events/` — community event photos  

## Agent / architecture notes

See **`AGENTS.md`** for coding conventions, folder layout, auth rules, and env details.
