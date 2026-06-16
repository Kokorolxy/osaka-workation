export const SITE = {
  name: "OSAKA Digital Nomads Workation",
  shortName: "OSAKA Workation",
  tagline: "Work from Osaka. Connect with the world.",
  taglineJa: "大阪から世界へ。ローカルとつながる国際ノマドコミュニティ",
  instagram: "https://www.instagram.com/osaka_digitalnomads_workation",
  instagramHandle: "@osaka_digitalnomads_workation",
  discord: "https://discord.gg",
  email: "hello@osaka-workation.com",
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
    icon: "🍜",
    title: "Amazing food",
    body: "From takoyaki to ramen, Osaka is Japan's kitchen — and the world's best lunch break.",
  },
  {
    icon: "💰",
    title: "Lower costs",
    body: "Around 30% cheaper than Tokyo, with the same fast internet and quality of life.",
  },
  {
    icon: "📶",
    title: "Fast Wi-Fi",
    body: "100+ Mbps average in cafes and coworking spaces. Ship from anywhere in the city.",
  },
  {
    icon: "👋",
    title: "Friendly locals",
    body: "Known as Japan's warmest, most welcoming city. You'll feel at home by day two.",
  },
];

export const DISTRICTS = [
  {
    name: "Namba",
    kanji: "難波",
    body: "Entertainment hub with endless nightlife, street food, and shopping.",
    image: "/events/event-2.jpg",
  },
  {
    name: "Umeda",
    kanji: "梅田",
    body: "Business district with modern cafes, sky gardens, and coworking towers.",
    image: "/events/event-5.jpg",
  },
  {
    name: "Tennoji",
    kanji: "天王寺",
    body: "Traditional vibes mixed with a local street-food scene and quiet stays.",
    image: "/events/event-1.jpg",
  },
];

export const STAYS = [
  {
    name: "Namba Modern Flat",
    area: "Namba, Osaka",
    rating: "4.9",
    price: "¥8,500",
    badge: "Most popular",
    image: "/events/event-2.jpg",
    perks: ["Wi-Fi 200Mbps", "Standing desk", "Weekly clean", "Coffee bar"],
  },
  {
    name: "Umeda Sky Loft",
    area: "Umeda, Osaka",
    rating: "4.8",
    price: "¥12,000",
    badge: "Skyline view",
    image: "/events/event-5.jpg",
    perks: ["Wi-Fi 300Mbps", "Dual monitor", "Gym access", "City view"],
  },
  {
    name: "Tennoji Cozy Studio",
    area: "Tennoji, Osaka",
    rating: "4.7",
    price: "¥6,800",
    badge: "Best value",
    image: "/events/event-1.jpg",
    perks: ["Wi-Fi 150Mbps", "Desk + chair", "Quiet street", "Kitchenette"],
  },
  {
    name: "Shinsaibashi Designer Room",
    area: "Shinsaibashi, Osaka",
    rating: "4.9",
    price: "¥10,500",
    badge: "Central",
    image: "/events/event-6.jpg",
    perks: ["Wi-Fi 250Mbps", "Ergo chair", "Balcony", "Steps to metro"],
  },
  {
    name: "Nakazakicho Artist Loft",
    area: "Nakazakicho, Osaka",
    rating: "4.8",
    price: "¥9,200",
    badge: "Creative quarter",
    image: "/events/event-3.jpg",
    perks: ["Wi-Fi 200Mbps", "Big desk", "Cafe district", "Natural light"],
  },
  {
    name: "Tennoji Garden Apartment",
    area: "Tennoji, Osaka",
    rating: "4.7",
    price: "¥7,400",
    badge: "Long-stay friendly",
    image: "/events/event-4.jpg",
    perks: ["Wi-Fi 180Mbps", "Workspace", "Washer", "Park nearby"],
  },
];

export const MEETUPS = [
  {
    icon: "☕",
    title: "Weekly Nomad Coffee Meetup",
    cadence: "Every Thursday · rotating cafes",
    body: "Casual morning meetup to swap projects, tips, and find your Osaka crew.",
  },
  {
    icon: "🍱",
    title: "Japanese Cooking Class",
    cadence: "Bi-weekly Saturday · Tennoji Kitchen",
    body: "Learn to make Osaka home cooking with a local chef — then eat together.",
  },
  {
    icon: "📸",
    title: "Osaka Photo Walk",
    cadence: "Monthly · starts at Dotonbori",
    body: "Golden-hour walk through the city's most photogenic streets and canals.",
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
      icon: "🏠",
      title: "Accommodation",
      body: "Curated stay in a central Osaka neighborhood, work-ready from day one.",
    },
    {
      icon: "💻",
      title: "Coworking access",
      body: "Daytime desk at a partner coworking space with fast, reliable Wi-Fi.",
    },
    {
      icon: "🍶",
      title: "Cultural experiences",
      body: "Miso-making, calligraphy, nabe hot-pot nights, and local craft sessions.",
    },
    {
      icon: "⛩️",
      title: "Kansai day trips",
      body: "Guided weekend trips to Kyoto and Nara with the group.",
    },
    {
      icon: "🥂",
      title: "Opening & closing dinners",
      body: "Welcome and farewell dinners to kick off and celebrate the two weeks.",
    },
    {
      icon: "🤝",
      title: "Built-in community",
      body: "A vetted crew of 50–100 nomads — engineers, designers, founders, creators.",
    },
  ],
  schedule: [
    {
      phase: "Days 1–2",
      title: "Arrival & welcome",
      body: "Check in, settle into your stay, opening dinner, and city orientation walk.",
    },
    {
      phase: "Week 1",
      title: "Work & local life",
      body: "Mornings at the coworking space, evenings of miso-making, calligraphy, and nabe nights.",
    },
    {
      phase: "Weekend",
      title: "Kyoto & Nara",
      body: "Guided Kansai day trips with the group — temples, deer park, and slow travel.",
    },
    {
      phase: "Week 2",
      title: "Deeper roots",
      body: "More coworking, neighborhood meetups, and time to live like an Osaka local.",
    },
    {
      phase: "Final day",
      title: "Closing dinner",
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
    a: "Follow @osaka_digitalnomads_workation and join the waitlist below. Waitlist members get first access to dates, pricing, and spots.",
  },
];
