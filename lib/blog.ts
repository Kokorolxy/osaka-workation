export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "img"; src: string; alt: string; caption?: string }
  | { type: "callout"; text: string }
  | { type: "cafe"; n: number; name: string; area: string; text: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  date: string; // ISO
  dateLabel: string;
  readingTime: string;
  tags: string[];
  body: Block[];
};

export const POSTS: Post[] = [
  {
    slug: "esim-guide-japan-osaka",
    title: "The eSIM Guide for Working Remotely in Osaka",
    excerpt:
      "Which eSIM to buy for Japan, how to set it up before you land, and how much data a remote-work trip actually needs — with real 2026 prices and provider picks.",
    cover: "/blog/esim-cover.jpg",
    date: "2026-07-06",
    dateLabel: "July 6, 2026",
    readingTime: "6 min read",
    tags: ["Osaka", "Connectivity", "Remote work"],
    body: [
      {
        type: "p",
        text: "When your income depends on a stable connection, sorting your data is the first thing to do — ideally before you even land in Japan. An eSIM is the easiest answer: no plastic SIM to swap, no airport queue, and you're online the moment you touch down at Kansai. Here's how to choose one, set it up, and size your plan for a remote-work stay.",
      },
      {
        type: "callout",
        text: "eSIM plans and prices change fast (Japan pricing shifted noticeably in early 2026). Check your phone actually supports eSIM, and confirm current prices on the provider's site before buying.",
      },
      {
        type: "h2",
        text: "eSIM vs pocket Wi-Fi vs physical SIM",
      },
      {
        type: "list",
        items: [
          "eSIM — best for most people: instant, no hardware, install before you fly. Needs an eSIM-compatible phone.",
          "Pocket Wi-Fi — worth it if you travel as a group or need to connect a laptop directly; it's one more device to charge and return.",
          "Physical SIM — fine, but you'll queue at the airport and swap out your home SIM. Rarely the best option now.",
        ],
      },
      {
        type: "h2",
        text: "The main providers (2026)",
      },
      {
        type: "cafe",
        n: 1,
        name: "Ubigi",
        area: "Best all-rounder · DOCOMO network",
        text: "Runs on NTT DOCOMO, which has the widest coverage — noticeably better on Kansai day trips to Kyoto, Nara, and rural spots. Simple 1GB / 3GB / 10GB / 50GB plans valid 30 days, plus recurring and annual options, which makes it the smart pick for longer stays.",
      },
      {
        type: "cafe",
        n: 2,
        name: "Airalo",
        area: "City speed · SoftBank network",
        text: "Uses SoftBank and tends to be fast in the big cities. Straightforward one-off plans (7/15/30 days, 1–20GB). Note: Japan prices rose sharply in early 2026, so it's no longer the automatic bargain — compare before buying.",
      },
      {
        type: "cafe",
        n: 3,
        name: "Holafly",
        area: "Unlimited data",
        text: "The pick if you hotspot a lot or stream heavily. 'Unlimited' with a fair-use policy of roughly 2–3GB/day of full-speed data. Pricier — think around $27 for 7 days and about $75 for 30 days.",
      },
      {
        type: "img",
        src: "/blog/esim-inline.jpg",
        alt: "Taking the train across Kansai in Japan",
        caption: "Coverage matters most on the day trips — DOCOMO-based plans shine here.",
      },
      {
        type: "h2",
        text: "Which one for a 2-week Workation?",
      },
      {
        type: "list",
        items: [
          "Mostly working from stays and coworking (Wi-Fi everywhere): a 10GB Ubigi or a mid-size Airalo plan is plenty.",
          "Heavy hotspotting or streaming on the go: go unlimited with Holafly.",
          "Lots of Kansai travel or rural side-trips: choose a DOCOMO-based plan (Ubigi) for coverage.",
          "Staying a month or more: Ubigi's 50GB or recurring plan usually wins on value.",
        ],
      },
      {
        type: "h2",
        text: "How to set it up (before you fly)",
      },
      {
        type: "list",
        items: [
          "Check compatibility: most iPhones (XS and newer) and recent Android flagships support eSIM.",
          "Buy and install the eSIM at home, on Wi-Fi — you'll scan a QR code or add it in-app.",
          "Keep your home SIM active for calls and 2FA codes; set the Japan eSIM as your data line.",
          "Turn on data roaming for the eSIM line once you land (this is normal for eSIMs).",
          "Screenshot the install QR/details in case you need to reinstall.",
        ],
      },
      {
        type: "callout",
        text: "On the November Workation you'll have fast Wi-Fi at your stay and the coworking space, so a mid-size data plan is usually all you need — we send every participant a simple setup checklist before arrival.",
      },
    ],
  },
  {
    slug: "coworking-spaces-osaka-guide",
    title: "Coworking Spaces in Osaka: A Digital Nomad's Guide",
    excerpt:
      "Day passes, monthly plans, and call booths — the Osaka coworking spaces worth your yen, grouped by how you actually work. With rough 2026 prices to plan around.",
    cover: "/blog/coworking-cover.jpg",
    date: "2026-07-06",
    dateLabel: "July 6, 2026",
    readingTime: "7 min read",
    tags: ["Osaka", "Coworking", "Remote work"],
    body: [
      {
        type: "p",
        text: "Cafés are great for a couple of hours, but when you have back-to-back calls, a deadline, or you just want a real chair and guaranteed Wi-Fi, a coworking space earns its keep. Osaka's scene is smaller than Tokyo's but genuinely good — most spots are near a station, many sell single-day passes, and prices are noticeably kinder than the capital. Here's where our community actually works, grouped by what you need.",
      },
      {
        type: "callout",
        text: "Prices, hours, and plans change, and some spaces need a quick sign-up or reservation for a first visit. Treat the numbers below as ballpark 2026 figures and confirm on the space's own site before you go.",
      },
      {
        type: "h2",
        text: "Best for community & events",
      },
      {
        type: "cafe",
        n: 1,
        name: "The DECK",
        area: "Sakaisuji-Hommachi",
        text: "In the heart of the business district, directly off Sakaisuji-Hommachi Station. Day passes run around ¥2,500, but the real draw is the community — regular networking events, workshops, and seminars make it the easiest place to actually meet other people working in Osaka.",
      },
      {
        type: "cafe",
        n: 2,
        name: "Osakan Space",
        area: "Hommachi",
        text: "A minute from Hommachi Station, community-driven, with soundproof 'Bocchi Box' booths that are perfect for video calls. Its Digital Nomad Plan stretches access from 7:00 to 24:00, Monday to Saturday — one of the most flexible drop-in options in the city.",
      },
      {
        type: "img",
        src: "/blog/coworking-inline.jpg",
        alt: "Coworking desks with monitors and a city view in Osaka",
        caption: "A real desk and guaranteed uptime — worth it on a heavy-call day.",
      },
      {
        type: "h2",
        text: "Best around Umeda station",
      },
      {
        type: "cafe",
        n: 3,
        name: "FUTRWORKS",
        area: "Umeda",
        text: "A modern, international space about three minutes from Umeda Station, built with global remote workers in mind. Roughly 1,400 m² of open desks, focus rooms, meeting rooms, and a chill room — English-friendly and easy to land in on day one.",
      },
      {
        type: "cafe",
        n: 4,
        name: "Common Room",
        area: "Umeda & Nakatsu",
        text: "Two handy branches: a few minutes from Osaka Umeda (day use around ¥2,200) and one by Nakatsu Station (around ¥1,600) — a genuinely cheap, no-fuss option for a focused day.",
      },
      {
        type: "cafe",
        n: 5,
        name: "Knowledge Capital",
        area: "Grand Front Osaka, Umeda",
        text: "Inside the Grand Front Osaka complex right by Umeda Station. Polished, professional, and stimulating — a good pick when you want an impressive, high-spec environment and maximum convenience.",
      },
      {
        type: "h2",
        text: "Budget & pay-as-you-go",
      },
      {
        type: "cafe",
        n: 6,
        name: "Bizcomfort",
        area: "Across Osaka",
        text: "A widespread chain with reliable, no-frills coworking and flexible plans. If you're moving between neighborhoods, there's usually a branch nearby.",
      },
      {
        type: "cafe",
        n: 7,
        name: "Coinspace",
        area: "Marui, Namba",
        text: "Inside the Marui department store in Namba, with a simple pay-per-minute model. Ideal for short bursts of work between errands, no membership required.",
      },
      {
        type: "h2",
        text: "Day pass or monthly?",
      },
      {
        type: "list",
        items: [
          "Here for a week or two: buy day passes (roughly ¥500–2,500) and try a few spaces before you commit.",
          "Staying a month or more: a monthly membership almost always beats stacking day passes, and often unlocks longer hours and 24/7 access.",
          "Mostly calls: prioritize spaces with soundproof booths (like Osakan Space's Bocchi Boxes).",
          "Want to meet people: pick a community-led space that runs events, such as The DECK.",
        ],
      },
      {
        type: "h2",
        text: "What to check before you commit",
      },
      {
        type: "list",
        items: [
          "Opening hours — some close in the evening; digital-nomad or 24/7 plans exist if you work late.",
          "English support and an easy first-visit sign-up.",
          "Meeting rooms and call booths if your work is call-heavy.",
          "Distance from your stay — 'near the station' matters most on rainy days.",
          "Whether a reservation is needed for your first drop-in.",
        ],
      },
      {
        type: "callout",
        text: "Skip the research entirely: the November Workation includes a daytime coworking pass at a partner space, so you get a desk, fast Wi-Fi, and a built-in community from the moment you land.",
      },
    ],
  },
  {
    slug: "best-laptop-cafes-osaka",
    title: "The Best Laptop-Friendly Cafés in Osaka for Remote Work",
    excerpt:
      "Where to actually get work done in Osaka — the specialty-coffee spots and neighborhoods our community reaches for, plus the local café etiquette that keeps you welcome.",
    cover: "/blog/cafes-cover.jpg",
    date: "2026-07-06",
    dateLabel: "July 6, 2026",
    readingTime: "6 min read",
    tags: ["Osaka", "Remote work", "Cafés"],
    body: [
      {
        type: "p",
        text: "Osaka is one of the easiest cities in Japan to work from — fast public Wi-Fi, walkable neighborhoods, and a serious specialty-coffee scene. But not every great café is a great office. Some are tiny, some get slammed at lunch, and a few politely discourage laptops at peak times. This is the shortlist our community keeps coming back to, grouped by the vibe you're after.",
      },
      {
        type: "callout",
        text: "Café policies change often. Some spots welcome laptops all day; others limit them at busy hours or on weekends. Always check the signage or ask staff before you settle in — and when in doubt, order more than one drink.",
      },
      {
        type: "h2",
        text: "For long, focused sessions",
      },
      {
        type: "cafe",
        n: 1,
        name: "Brooklyn Roasting Company",
        area: "Kitahama",
        text: "A spacious, industrial roastery right on the Tosabori river. Big communal tables, plenty of natural light, and a calm midweek crowd make it a reliable half-day spot. The riverside terrace is a bonus in autumn.",
      },
      {
        type: "cafe",
        n: 2,
        name: "Takamura Wine & Coffee Roasters",
        area: "Utsubo / Honmachi",
        text: "A converted warehouse with high ceilings and long wooden tables. It's roomy enough that a laptop never feels out of place, and the coffee program is one of the best in the city. Come early on weekends.",
      },
      {
        type: "img",
        src: "/blog/cafes-inline.jpg",
        alt: "Working on a laptop by a window overlooking Osaka",
        caption: "Window seats + a fresh pour-over = the Osaka work morning.",
      },
      {
        type: "h2",
        text: "For a quick, buzzy work break",
      },
      {
        type: "cafe",
        n: 3,
        name: "LiLo Coffee Roasters",
        area: "Amerikamura",
        text: "In the middle of Osaka's youth-culture district. Energetic, excellent single-origins, and great for a sharp 60–90 minute sprint between meetings rather than a full day of deep work.",
      },
      {
        type: "cafe",
        n: 4,
        name: "Streamer Coffee Company",
        area: "Shinsaibashi",
        text: "Roomy, central, and famous for its latte art. Easy to grab a table for a focused block, and a short walk from most Namba/Shinsaibashi stays.",
      },
      {
        type: "cafe",
        n: 5,
        name: "Mel Coffee Roasters",
        area: "Shinsaibashi",
        text: "Small but beloved by the coffee crowd. Better for a short session and a great flat white than for camping out — a perfect reset between coworking stints.",
      },
      {
        type: "cafe",
        n: 6,
        name: "Blue Bottle Coffee",
        area: "Umeda & Namba",
        text: "Not local, but reliably comfortable, with consistent seating and Wi-Fi. A safe default when you just need a clean table and a good cup near the station.",
      },
      {
        type: "h2",
        text: "Café etiquette in Osaka",
      },
      {
        type: "p",
        text: "A little courtesy goes a long way and keeps these places laptop-friendly for everyone after you:",
      },
      {
        type: "list",
        items: [
          "Order something every 60–90 minutes if you're staying a while.",
          "Avoid the lunch rush (roughly 12:00–13:30) if you plan to linger.",
          "Bring earbuds and keep calls outside — Japanese cafés are quiet by default.",
          "Watch for 'no laptop' or time-limit signs, especially on weekends.",
          "Pack a power bank — outlets are common but never guaranteed.",
        ],
      },
      {
        type: "h2",
        text: "Wi-Fi, power, and staying connected",
      },
      {
        type: "p",
        text: "Most Osaka cafés offer free Wi-Fi, and citywide speeds are excellent (100+ Mbps is normal). Still, for video calls we recommend carrying your own connection — a travel eSIM or pocket Wi-Fi means you're never hostage to a flaky café network. If you need guaranteed uptime and a real desk, that's exactly what a coworking day pass is for.",
      },
      {
        type: "h2",
        text: "Which neighborhood should you base in?",
      },
      {
        type: "list",
        items: [
          "Kitahama & Honmachi — calm, riverside, business-district cafés for deep work.",
          "Shinsaibashi & Amerikamura — central and buzzy, great between meetings.",
          "Tennoji & Nakazakicho — quieter, indie cafés with a local, creative feel.",
        ],
      },
      {
        type: "callout",
        text: "Want the café crawl done for you? Our community runs a weekly coffee meetup that rotates through Osaka's best work spots — and the November Workation includes a dedicated coworking pass so you're never hunting for an outlet.",
      },
    ],
  },
];

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}
