export const SITE = {
  name: "OSAKA Digital Nomads Workation",
  shortName: "OSAKA Workation",
  tagline: "Work from Osaka. Connect with the world.",
  taglineJa: "大阪から世界へ。ローカルとつながる国際ノマドコミュニティ",
  instagram: "https://www.instagram.com/osaka_workation",
  instagramHandle: "@osaka_workation",
  discord: "https://discord.gg",
  email: "kokorolxy7@gmail.com",
};

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Stays", href: "/stays" },
  { label: "Events", href: "/events" },
  { label: "Community", href: "/community" },
  { label: "About", href: "/about" },
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

export const STAYS = [
  {
    name: "Namba Modern Flat",
    area: "Namba, Osaka",
    rating: "4.9",
    price: "¥8,500",
    badge: "Most popular",
    image: "/stays/stay-1.jpg",
    perks: ["Wi-Fi 200Mbps", "Standing desk", "Weekly clean", "Coffee bar"],
  },
  {
    name: "Umeda Sky Loft",
    area: "Umeda, Osaka",
    rating: "4.8",
    price: "¥12,000",
    badge: "Skyline view",
    image: "/stays/stay-2.jpg",
    perks: ["Wi-Fi 300Mbps", "Dual monitor", "Gym access", "City view"],
  },
  {
    name: "Tennoji Tatami Studio",
    area: "Tennoji, Osaka",
    rating: "4.7",
    price: "¥6,800",
    badge: "Best value",
    image: "/stays/stay-3.jpg",
    perks: ["Wi-Fi 150Mbps", "Desk + chair", "Quiet street", "Kitchenette"],
  },
  {
    name: "Shinsaibashi Designer Room",
    area: "Shinsaibashi, Osaka",
    rating: "4.9",
    price: "¥10,500",
    badge: "Central",
    image: "/stays/stay-4.jpg",
    perks: ["Wi-Fi 250Mbps", "Ergo chair", "Balcony", "Steps to metro"],
  },
  {
    name: "Nakazakicho Triple Room",
    area: "Nakazakicho, Osaka",
    rating: "4.8",
    price: "¥9,200",
    badge: "Group friendly",
    image: "/stays/stay-5.jpg",
    perks: ["Wi-Fi 200Mbps", "Big desk", "Cafe district", "Sleeps 3"],
  },
  {
    name: "Tennoji Tea-Room House",
    area: "Tennoji, Osaka",
    rating: "4.7",
    price: "¥7,400",
    badge: "Long-stay friendly",
    image: "/stays/stay-6.jpg",
    perks: ["Wi-Fi 180Mbps", "Workspace", "Washer", "Garden"],
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
      icon: "stay",
      title: "Accommodation help",
      body: "Curated work-ready stays in central Osaka from ¥4,500/night, booked alongside your ticket.",
      detail:
        "We hold a block of vetted, work-ready apartments and guesthouses across Namba, Umeda, and Tennoji. Pick your room when you book — from ¥4,500/night.",
    },
    {
      icon: "cowork",
      title: "Coworking access",
      body: "Daytime desk at a partner coworking space with fast, reliable Wi-Fi.",
      detail:
        "A dedicated daytime desk at a partner coworking space — 100+ Mbps Wi-Fi, meeting rooms, phone booths, and unlimited coffee.",
    },
    {
      icon: "culture",
      title: "Cultural experiences",
      body: "Miso-making, calligraphy, nabe hot-pot nights, and local craft sessions.",
      detail:
        "Hands-on sessions led by locals: miso-making, calligraphy (書道), nabe hot-pot nights, board-game evenings, plus dance and yoga.",
    },
    {
      icon: "daytrip",
      title: "Kansai day trips",
      body: "Guided weekend trips to Kyoto and Nara with the group.",
      detail:
        "Two guided weekend trips — Kyoto's temples and Nara's deer park — with group transport and a local guide who knows the quiet spots.",
    },
    {
      icon: "dinner",
      title: "Opening & closing dinners",
      body: "Welcome and farewell dinners to kick off and celebrate the two weeks.",
      detail:
        "An opening welcome party on day one and a farewell dinner on the final night — the bookends that turn a group into a community.",
    },
    {
      icon: "community",
      title: "Built-in community",
      body: "A vetted crew of 50–100 nomads — engineers, designers, founders, creators.",
      detail:
        "A vetted crew of 50–100 remote workers from around the world. Private Discord, daily meetups, and friendships that outlast the trip.",
    },
  ],
  schedule: [
    {
      phase: "Days 1–2",
      title: "Arrival & welcome",
      time: "Day 1 · 16:00 check-in · 19:00 welcome party",
      body: "Check in, settle into your stay, opening dinner, and a city orientation walk to get your bearings.",
    },
    {
      phase: "Week 1",
      title: "Work & local life",
      time: "Mon–Fri · 09:00–13:00 cowork · evenings free",
      body: "Mornings at the coworking space, evenings of miso-making, calligraphy, and nabe nights.",
    },
    {
      phase: "Weekend",
      title: "Kyoto & Nara",
      time: "Sat–Sun · full-day guided trips",
      body: "Guided Kansai day trips with the group — temples, deer park, and slow travel.",
    },
    {
      phase: "Week 2",
      title: "Deeper roots",
      time: "Mon–Fri · cowork + neighborhood meetups",
      body: "More coworking, neighborhood meetups, and time to live like an Osaka local.",
    },
    {
      phase: "Final day",
      title: "Closing dinner",
      time: "Final night · 19:00 farewell dinner",
      body: "Celebrate two weeks together and trade plans for the next stop.",
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
    a: "Accommodation, daytime coworking access, community and cultural experiences (miso-making, calligraphy, nabe nights), Kansai day trips, and the opening and closing dinners. Flights and personal expenses are not included.",
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

export const PRICING = [
  {
    key: "short",
    name: "Short Stay",
    tagline: "Networking Meetup",
    price: "¥30,000",
    period: "7 days",
    note: "A shorter taste of Osaka",
    popular: false,
    features: [
      "Opening party",
      "Coworking access",
      "Japanese class",
      "Cultural workshops",
      "Community meetups",
    ],
  },
  {
    key: "full",
    name: "Full Program",
    tagline: "The complete 14 days",
    price: "¥50,000",
    earlyBird: "¥42,000",
    period: "14 days",
    note: "Early bird ¥42,000 · first 10 · until Sep 30, 2026",
    popular: true,
    features: [
      "Everything in Short Stay",
      "Full two-week programme",
      "Opening & closing dinners",
      "Kyoto & Nara day trips",
      "Priority on all activities",
    ],
  },
  {
    key: "community",
    name: "Community Pass",
    tagline: "No accommodation",
    price: "¥35,000",
    period: "14 days",
    note: "Programme & coworking only",
    popular: false,
    features: [
      "14-day coworking access",
      "All community events",
      "Cultural workshops",
      "Japanese class",
      "Accommodation not included",
    ],
  },
];

export const PRICING_NOTE =
  "Accommodation from ¥4,500/night, booked separately. Full Program + stay + main add-ons ≈ ¥132,800 (~$880 USD). Prices subject to change.";

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
