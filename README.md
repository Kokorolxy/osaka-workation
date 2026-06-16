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

## Assets

- `public/logo/` — brand logos (orange wordmark + white A-tower mark).
- `public/events/` — 6 real community event photos (`event-1.jpg` … `event-6.jpg`), resized for web.

## Things to wire up later

These are stubbed and clearly marked in the code:
- **Newsletter signup** (`components/newsletter.tsx`) — connect to Mailchimp / Notion / Google Form.
- **Contact form** (`components/contact-form.tsx`) — connect to your email / form provider.
- **Stays "View" buttons** — link to real listings when ready.
- **Discord link** (`lib/site.ts` → `SITE.discord`) — replace with your real invite URL.
- **Email** (`lib/site.ts` → `SITE.email`) — replace placeholder with your address.

All shared copy and data live in `lib/site.ts` for easy editing.
