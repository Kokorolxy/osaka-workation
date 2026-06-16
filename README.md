# OSAKA Digital Nomads Workation — Website

Multi-page marketing site for the Osaka Workation community. Built with **Next.js 14 (App Router)** + **Tailwind CSS**. Dark theme, brand orange `#ea5504`, cream `#f7ede0`.

## Pages

| Route | Page |
|-------|------|
| `/` | Home — real-photo hero, Why Osaka, November Workation feature, districts, community, newsletter |
| `/stays` | Curated stays grid + what's included |
| `/events` | November Workation 2026 (programme, countdown, what's included) + weekly meetups |
| `/community` | Discord stats, photo gallery, testimonials |
| `/about` | Brand story, what we do, partner with us |
| `/contact` | Contact form, ways to reach us, FAQ |

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. On vercel.com → **New Project** → import the repo. Framework auto-detects as Next.js.
3. Click **Deploy**. Done — no env vars needed.

(Or run `npx vercel` from this folder for a direct CLI deploy.)

## Look & feel

Light, warm theme — cream `#f7ede0` / white `#ffffff` backgrounds, near-black `#0f0f0f` text, orange `#ea5504` accent. No emoji: all feature icons are `lucide-react` rendered in brand orange (`components/feature-icon.tsx`). Every photo on the site is used exactly once (no duplicates).

## Assets

- `public/logo/` — brand logos (orange wordmark + A-tower mark).
- `public/img/` — Osaka city, food, coworking & day-trip photos (hero, districts, about, contact, events).
- `public/stays/` — real guesthouse (民宿) interiors for the Stays page.
- `public/events/` — 6 real community event photos used on the Community page.

## Email capture → Notion (setup)

Newsletter and contact forms POST to `/api/subscribe`, which writes a row into a Notion database. Until you set the two env vars below, forms still work (users see a thank-you) but nothing is stored. To turn capture on:

1. Create a Notion **internal integration** at notion.so/my-integrations → copy the secret (`ntn_…`).
2. Create a Notion **database** with these properties (names are case-sensitive): `Name` (Title), `Email` (Email), `Source` (Text), `Message` (Text). Copy its **database ID** (the 32-char string in the database URL).
3. In the database, click `•••` → **Connections** → add your integration so it can write.
4. In **Vercel → Project → Settings → Environment Variables**, add:
   - `NOTION_TOKEN` = your integration secret
   - `NOTION_DB_ID` = your database ID
5. Redeploy. New signups now appear as rows in your Notion database.

## Things to wire up later

These are stubbed and clearly marked in the code:
- **Newsletter signup** (`components/newsletter.tsx`) — connect to Mailchimp / Notion / Google Form.
- **Contact form** (`components/contact-form.tsx`) — connect to your email / form provider.
- **Stays "View" buttons** — link to real listings when ready.
- **Discord link** (`lib/site.ts` → `SITE.discord`) — replace with your real invite URL.

Instagram (`@osaka_workation`) and email (`kokorolxy7@gmail.com`) are already wired in `lib/site.ts`, where all shared copy lives for easy editing.
