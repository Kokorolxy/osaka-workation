import {
  WORKATION_DURATIONS,
  TICKET_INCLUDES,
  TICKET_EXCLUDES,
  formatPackagePrice,
} from "@/lib/workation-packages";
import type { Locale } from "@/lib/i18n/config";

export const SITE = {
  name: "OSAKA Digital Nomads Workation",
  shortName: "OSAKA Workation",
  tagline: "Work from Osaka. Connect with the world.",
  taglineJa: "大阪から世界へ。ローカルとつながる国際ノマドコミュニティ",
  instagram: "https://www.instagram.com/osaka_workation",
  instagramHandle: "@osaka_workation",
  discord: "https://discord.gg/Zy2y8gUvfc",
  email: "osakaworkation@gmail.com",
  linktree: "https://linktr.ee/osakaworkation",
  tallyId: "eqPAMQ",
  tallyUrl: "https://tally.so/r/eqPAMQ",
  // Tally form embedded on the Contact page. Create a dedicated "Contact" form
  // in Tally and paste its ID here (from tally.so/r/<ID>). Defaults to the waitlist form.
  tallyContactId: "81GeNx",
};

export const NAV = [
  { label: "Events", href: "/events" },
  { label: "Community", href: "/community" },
  { label: "Blog", href: "/blog" },
];

export const NAV_MORE = [
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const STATS = [
  { value: "25", label: "Curated stays" },
  { value: "Nov", label: "2026 Workation" },
  { value: "100+", label: "Members" },
  { value: "3", label: "Languages spoken" },
];

export const WHY_OSAKA = [
  {
    icon: "food",
    title: "Amazing food",
    body: "From takoyaki to ramen, Osaka is Japan's kitchen — and the world's best lunch break.",
  },
  {
    icon: "cost",
    title: "Lower costs",
    body: "Around 30% cheaper than Tokyo, with the same fast internet and quality of life.",
  },
  {
    icon: "wifi",
    title: "Fast Wi-Fi",
    body: "100+ Mbps average in cafes and coworking spaces. Ship from anywhere in the city.",
  },
  {
    icon: "locals",
    title: "Friendly locals",
    body: "Known as Japan's warmest, most welcoming city. You'll feel at home by day two.",
  },
];

export const DISTRICTS = [
  {
    name: "Namba",
    kanji: "難波",
    body: "Entertainment hub with endless nightlife, street food, and shopping.",
    image: "/img/district-namba.jpg",
  },
  {
    name: "Umeda",
    kanji: "梅田",
    body: "Business district with modern cafes, sky gardens, and coworking towers.",
    image: "/img/district-umeda.jpg",
  },
  {
    name: "Tennoji",
    kanji: "天王寺",
    body: "Traditional vibes mixed with a local street-food scene and quiet stays.",
    image: "/img/district-tennoji.jpg",
  },
];

// Stay types & occupancy used for the Stays filters.
export const STAY_TYPES = ["Airbnb", "Hotel", "Monthly rent", "Share house"] as const;
export type StayType = (typeof STAY_TYPES)[number];

export const OCCUPANCY = ["Solo", "Group"] as const;
export type Occupancy = (typeof OCCUPANCY)[number];

export type Stay = {
  /** Stable id used in event registrations */
  key: string;
  name: string;
  area: string;
  type: StayType;
  occupancy: Occupancy[];
  price: string;
  unit: "night" | "month";
  image: string;
  perks: string[];
  // Partner booking page (Airbnb / hotel site / etc.). We only recommend & showcase.
  url: string;
  badge?: string;
};

/** @deprecated Prefer PACKAGES_WITH_HOUSING from workation-packages — kept for older imports */
export { PACKAGES_WITH_HOUSING as PACKAGES_WITH_STAY } from "@/lib/workation-packages";

/** Same housing styles as the Stays page “Three ways to stay” section (marketing) */
export const HOUSING_TYPES = [
  {
    key: "hotel",
    name: "Hotel",
    tagline: "Private & hassle-free",
    body: "Your own room, daily service, and a front desk. Ideal when you want privacy and zero setup.",
    image: "/stays/accom-hotel.jpg",
  },
  {
    key: "coliving",
    name: "Share house · Coliving",
    tagline: "Built-in community",
    body: "A private room in a shared house — communal lounge and kitchen, and instant friends. The easiest way to plug into the community.",
    image: "/stays/accom-coliving.jpg",
  },
  {
    key: "guesthouse",
    name: "Guesthouse",
    tagline: "Local & cosy",
    body: "Homey tatami rooms with real Osaka character — affordable, authentic, and warm.",
    image: "/stays/accom-guesthouse.jpg",
  },
] as const;

export type HousingTypeKey = (typeof HOUSING_TYPES)[number]["key"];

// PLACEHOLDER listings — swap in your real partner stays (name / area / price / image / url).
export const STAYS: Stay[] = [
  {
    key: "tennoji-tatami-studio",
    name: "Tennoji Tatami Studio",
    area: "Tennoji, Osaka",
    type: "Airbnb",
    occupancy: ["Solo"],
    price: "¥6,800",
    unit: "night",
    image: "/stays/stay-3.jpg",
    perks: ["Wi-Fi 150Mbps", "Desk + chair", "Quiet street"],
    url: "#",
    badge: "Best value",
  },
  {
    key: "namba-tea-room-house",
    name: "Namba Tea-Room House",
    area: "Namba, Osaka",
    type: "Airbnb",
    occupancy: ["Solo", "Group"],
    price: "¥7,400",
    unit: "night",
    image: "/stays/stay-6.jpg",
    perks: ["Wi-Fi 180Mbps", "Workspace", "Garden"],
    url: "#",
  },
  {
    key: "nakazakicho-triple-room",
    name: "Nakazakicho Triple Room",
    area: "Nakazakicho, Osaka",
    type: "Airbnb",
    occupancy: ["Group"],
    price: "¥9,200",
    unit: "night",
    image: "/stays/stay-5.jpg",
    perks: ["Wi-Fi 200Mbps", "Big desk", "Sleeps 3"],
    url: "#",
    badge: "Group friendly",
  },
  {
    key: "umeda-sky-hotel-room",
    name: "Umeda Sky Hotel Room",
    area: "Umeda, Osaka",
    type: "Hotel",
    occupancy: ["Solo"],
    price: "¥12,000",
    unit: "night",
    image: "/stays/stay-2.jpg",
    perks: ["Wi-Fi 300Mbps", "Daily clean", "City view"],
    url: "#",
    badge: "Skyline view",
  },
  {
    key: "shinsaibashi-designer-hotel",
    name: "Shinsaibashi Designer Hotel",
    area: "Shinsaibashi, Osaka",
    type: "Hotel",
    occupancy: ["Solo", "Group"],
    price: "¥10,500",
    unit: "night",
    image: "/stays/stay-4.jpg",
    perks: ["Wi-Fi 250Mbps", "Front desk", "Steps to metro"],
    url: "#",
    badge: "Central",
  },
  {
    key: "namba-monthly-apartment",
    name: "Namba Monthly Apartment",
    area: "Namba, Osaka",
    type: "Monthly rent",
    occupancy: ["Solo"],
    price: "¥95,000",
    unit: "month",
    image: "/stays/stay-1.jpg",
    perks: ["Wi-Fi 200Mbps", "Standing desk", "Washer"],
    url: "#",
    badge: "Long-stay",
  },
  {
    key: "tennoji-monthly-flat",
    name: "Tennoji Monthly Flat",
    area: "Tennoji, Osaka",
    type: "Monthly rent",
    occupancy: ["Solo", "Group"],
    price: "¥120,000",
    unit: "month",
    image: "/stays/stay-kitchen.jpg",
    perks: ["Wi-Fi 180Mbps", "Full kitchen", "Sleeps 2"],
    url: "#",
  },
  {
    key: "osaka-nomad-share-house",
    name: "Osaka Nomad Share House",
    area: "Nakazakicho, Osaka",
    type: "Share house",
    occupancy: ["Group"],
    price: "¥65,000",
    unit: "month",
    image: "/stays/stay-hero.jpg",
    perks: ["Wi-Fi 200Mbps", "Shared lounge", "Community"],
    url: "#",
    badge: "Meet people",
  },
];

export const MEETUPS = [
  {
    icon: "coffee",
    title: "Weekly Nomad Coffee Meetup",
    cadence: "Every Thursday · rotating cafes",
    body: "Casual morning meetup to swap projects, tips, and find your Osaka crew.",
    image: "/img/meetup-coffee.jpg",
    detail:
      "We rotate between Osaka's best indie cafes. Bring your laptop or just yourself — it's the easiest way to meet the crew. Always free to join.",
  },
  {
    icon: "cooking",
    title: "Japanese Cooking Class",
    cadence: "Bi-weekly Saturday · Tennoji Kitchen",
    body: "Learn to make Osaka home cooking with a local chef — then eat together.",
    image: "/img/meetup-cooking.jpg",
    detail:
      "Hands-on Japanese home cooking with a local chef in Tennoji — takoyaki, okonomiyaki, and seasonal dishes. Then we sit down and eat together.",
  },
  {
    icon: "camera",
    title: "Osaka Photo Walk",
    cadence: "Monthly · starts at Dotonbori",
    body: "Golden-hour walk through the city's most photogenic streets and canals.",
    image: "/img/meetup-photo.jpg",
    detail:
      "A golden-hour walk from Dotonbori through the neon canals and back alleys. All levels welcome — phone cameras totally fine.",
  },
];

export const WORKATION = {
  title: "November Workation 2026",
  dates: "Weeks 1–2 of November 2026",
  duration: "14 days",
  capacity: "50–100 participants",
  pitch:
    "One ticket, the full Osaka life. Work your mornings, live the city your evenings — for two weeks, with a ready-made international community.",
  includes: [
    {
      icon: "cowork",
      title: "Coworking access",
      body: "Desk space with solid Wi-Fi so your mornings stay productive.",
      detail:
        "Daytime access to a quiet, well-connected coworking space. Bring your laptop and settle into a real Osaka work rhythm.",
    },
    {
      icon: "culture",
      title: "Culture & community",
      body: "Cultural experiences, community access, and a crew of fellow remote workers.",
      detail:
        "Hands-on cultural experiences plus daily community events — with two guides to help you explore.",
    },
    {
      icon: "daytrip",
      title: "Weekend city tours",
      body: "Guided day-tour plans to nearby cities on weekends (transport not included).",
      detail:
        "Weekend day tours with a guide plan. Transportation and other expenses are not included in the ticket.",
    },
    {
      icon: "dinner",
      title: "Welcome & farewell parties",
      body: "Welcome and farewell parties with meals to kick off and celebrate the workation.",
      detail:
        "A welcome party with meals on day one and a farewell party with meals on the final night — the bookends that turn a group into a community.",
    },
    {
      icon: "locals",
      title: "Two tour guides",
      body: "Guides who recommend, accompany you, and help with travel expenses & cultural experiences.",
      detail:
        "Two tour guides support your journey with recommendations, company, travel-expense help, and cultural experiences.",
    },
    {
      icon: "community",
      title: "Daily events included",
      body: "1 daytime + 1 nighttime community event per day (random pop-ups not included).",
      detail:
        "Every day includes one daytime and one nighttime community event. Random pop-up events around the city are not included in the ticket price.",
    },
  ],
  schedule: [
    {
      phase: "Days 1–2",
      title: "Arrival & welcome",
      time: "Day 1 · welcome party with meals",
      body: "Check in, settle in, welcome party with meals, and a city orientation walk to get your bearings.",
    },
    {
      phase: "Weekdays",
      title: "Work & evening events",
      time: "Daytime coworking · evening community",
      body: "Coworking by day, then one included nighttime community event — plus optional pop-ups around the city.",
    },
    {
      phase: "Weekends",
      title: "City day tours",
      time: "Sat–Sun · guided plans",
      body: "Day tours to other cities with a guide plan. Transportation and extras are not included in the ticket.",
    },
    {
      phase: "Final day",
      title: "Farewell party",
      time: "Final night · farewell party with meals",
      body: "Celebrate together at the farewell party with meals and trade plans for the next stop.",
    },
  ],
};

export const TESTIMONIALS = [
  {
    quote:
      "Osaka feels like home from day one. The food, the people, the energy — it's unlike anywhere else in Japan.",
    name: "Sarah K.",
    role: "Designer · Canada",
    initials: "SK",
    flag: "🇨🇦",
  },
  {
    quote: "Best decision I made this year. Osaka just feels right.",
    name: "Kevin Lee",
    role: "Developer · Malaysia",
    initials: "KL",
    flag: "🇲🇾",
  },
  {
    quote: "Found my tribe here. The community events are amazing.",
    name: "Sarah Miller",
    role: "Founder · Canada",
    initials: "SM",
    flag: "🇨🇦",
  },
  {
    quote: "Great Wi-Fi, better food, best people. 10/10 would recommend.",
    name: "Thomas Hoffmann",
    role: "Engineer · Germany",
    initials: "TH",
    flag: "🇩🇪",
  },
];

export const FAQS = [
  {
    q: "Who is the Workation for?",
    a: "Remote workers aged roughly 20–50 — engineers, designers, founders, and creators — who want to live in Osaka rather than just pass through. Most of our community works in English.",
  },
  {
    q: "What does the ticket include?",
    a: "Coworking space, a workation t-shirt, community access, welcome and farewell parties with meals, two tour guides for recommendations and cultural experiences, and one daytime plus one nighttime community event each day. Weekend city day tours are guided (plan only); transportation and other tour expenses are not included. Random pop-up events are not included. Housing and flights are not included.",
  },
  {
    q: "When exactly is the November 2026 Workation?",
    a: "It runs for 14 days across the first two weeks of November 2026. Exact dates are confirmed to participants on the waitlist first.",
  },
  {
    q: "Do I need to speak Japanese?",
    a: "Not at all. The community runs in English, and our local team helps you navigate everything from SIM cards to the best okonomiyaki.",
  },
  {
    q: "How do I join?",
    a: "Follow @osaka_workation and join the waitlist below. Waitlist members get first access to dates, pricing, and spots.",
  },
];

export function getPricing(locale: Locale) {
  return WORKATION_DURATIONS.map((d, i) => ({
    key: d.key,
    name: d.name,
    tagline: "Full Workation ticket",
    price: formatPackagePrice(d.generalPriceJpy, locale),
    earlyBird: formatPackagePrice(d.discountedPriceJpy, locale),
    period: d.name,
    note: `Early bird / referral ${formatPackagePrice(d.discountedPriceJpy, locale)}`,
    checkoutUrl: "",
    popular: i === 0,
    features: [...TICKET_INCLUDES, ...TICKET_EXCLUDES],
  }));
}

export const PRICING_NOTE =
  "Ticket covers the programme, coworking, and included activities (welcome & farewell parties). Accommodation and optional add-ons (day trips, USJ, etc.) are separate. Early-bird and friend-referral pricing both save 10%.";

// Set to false once final prices are confirmed. When true, prices show "Coming soon"
// and every CTA points to the waitlist.
export const PRICING_TBD = false;

export const FOOD = [
  {
    image: "/img/food-ramen.jpg",
    label: "Ramen counters",
    blurb: "Community favourites",
    shops: [
      { name: "Kamukura", area: "Dotonbori" },
      { name: "Jinrui Mina Men", area: "Fukushima" },
      { name: "Kinguemon", area: "Namba" },
      { name: "Ramen Yashichi", area: "Esaka" },
    ],
  },
  {
    image: "/img/food-takoyaki.jpg",
    label: "Street takoyaki",
    blurb: "Community favourites",
    shops: [
      { name: "Takoyaki Wanaka", area: "Namba" },
      { name: "Kukuru", area: "Dotonbori" },
      { name: "Acchichi Honpo", area: "Umeda" },
      { name: "Takoyaki Juhachiban", area: "Shinsaibashi" },
    ],
  },
  {
    image: "/img/food-octopus.jpg",
    label: "Dotonbori icons",
    blurb: "Community favourites",
    shops: [
      { name: "Ichiran Ramen", area: "Dotonbori" },
      { name: "Daruma Kushikatsu", area: "Shinsekai" },
      { name: "551 Horai", area: "Namba" },
      { name: "Zauo fishing izakaya", area: "Fukushima" },
    ],
  },
];
