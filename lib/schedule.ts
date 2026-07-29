import type { Locale } from "@/lib/i18n/config";

type Bi = { en: string; ja: string };

export type ScheduleDay = {
  date: string; // "Nov 1"
  dateJa: string; // "11/1"
  dow: Bi;
  day: Bi; // daytime activity
  night: Bi; // evening activity
  price: Bi;
  highlight?: boolean; // marquee day (trips, parties)
  cohortB?: boolean; // 1-week cohort arrives
};

export const SCHEDULE: ScheduleDay[] = [
  {
    date: "Nov 1", dateJa: "11/1", dow: { en: "Sun", ja: "日" },
    day: { en: "Check-in + coworking orientation", ja: "チェックイン + コワーキング案内" },
    night: { en: "Welcome Party (meal)", ja: "ウェルカムパーティー（食事付き）" },
    price: { en: "Included", ja: "込み" }, highlight: true,
  },
  {
    date: "Nov 2", dateJa: "11/2", dow: { en: "Mon", ja: "月" },
    day: { en: "Coworking", ja: "コワーキング" },
    night: { en: "Izakaya Tour · Namba / Dotonbori", ja: "居酒屋ツアー（難波 / 道頓堀）" },
    price: { en: "Food ~¥3,500", ja: "飲食 ~¥3,500" },
  },
  {
    date: "Nov 3", dateJa: "11/3", dow: { en: "Tue", ja: "火" },
    day: { en: "Coworking", ja: "コワーキング" },
    night: { en: "Calligraphy workshop 書道", ja: "書道体験" },
    price: { en: "¥500", ja: "¥500" },
  },
  {
    date: "Nov 4", dateJa: "11/4", dow: { en: "Wed", ja: "水" },
    day: { en: "Coworking", ja: "コワーキング" },
    night: { en: "Board Game night", ja: "ボードゲームナイト" },
    price: { en: "Free", ja: "無料" },
  },
  {
    date: "Nov 5", dateJa: "11/5", dow: { en: "Thu", ja: "木" },
    day: { en: "Coworking", ja: "コワーキング" },
    night: { en: "Movie Night", ja: "映画ナイト" },
    price: { en: "Free", ja: "無料" },
  },
  {
    date: "Nov 6", dateJa: "11/6", dow: { en: "Fri", ja: "金" },
    day: { en: "Coworking", ja: "コワーキング" },
    night: { en: "Networking Meetup", ja: "ネットワーキング交流会" },
    price: { en: "Free", ja: "無料" },
  },
  {
    date: "Nov 7", dateJa: "11/7", dow: { en: "Sat", ja: "土" },
    day: { en: "Kyoto Day Trip · Kinkakuji, Kiyomizudera, Arashiyama", ja: "京都日帰りツアー · 金閣寺・清水寺・嵐山" },
    night: { en: "Free evening", ja: "夜は自由" },
    price: { en: "Entry ~¥4,000 (+transport)", ja: "入場 ~¥4,000（交通別）" }, highlight: true,
  },
  {
    date: "Nov 8", dateJa: "11/8", dow: { en: "Sun", ja: "日" },
    day: { en: "Waterfall Tour 滝行 · Minoo", ja: "滝行ツアー（箕面）" },
    night: { en: "Hanabi (Fireworks)", ja: "花火大会" },
    price: { en: "Tour TBD · fireworks free", ja: "ツアー未定 · 花火無料" }, highlight: true, cohortB: true,
  },
  {
    date: "Nov 9", dateJa: "11/9", dow: { en: "Mon", ja: "月" },
    day: { en: "Coworking · Donut Buddy kickoff", ja: "コワーキング · Donut Buddy 開始" },
    night: { en: "Japanese Class", ja: "日本語クラス" },
    price: { en: "¥500", ja: "¥500" },
  },
  {
    date: "Nov 10", dateJa: "11/10", dow: { en: "Tue", ja: "火" },
    day: { en: "Coworking", ja: "コワーキング" },
    night: { en: "Landmark Sunset · Umeda Sky / Tsutenkaku + Shinsekai", ja: "大阪ランドマーク夕暮れ · 梅田スカイビル / 通天閣 + 新世界" },
    price: { en: "Entry ~¥1,500", ja: "入場 ~¥1,500" },
  },
  {
    date: "Nov 11", dateJa: "11/11", dow: { en: "Wed", ja: "水" },
    day: { en: "Coworking", ja: "コワーキング" },
    night: { en: "Nabe / Oden hot-pot dinner", ja: "鍋・おでんディナー" },
    price: { en: "~¥1,000", ja: "~¥1,000" },
  },
  {
    date: "Nov 12", dateJa: "11/12", dow: { en: "Thu", ja: "木" },
    day: { en: "Coworking", ja: "コワーキング" },
    night: { en: "Miso-making workshop", ja: "味噌作りワークショップ" },
    price: { en: "~¥1,500", ja: "~¥1,500" },
  },
  {
    date: "Nov 13", dateJa: "11/13", dow: { en: "Fri", ja: "金" },
    day: { en: "Coworking", ja: "コワーキング" },
    night: { en: "Networking Meetup · optional karaoke", ja: "ネットワーキング交流会 · 任意カラオケ" },
    price: { en: "Free", ja: "無料" },
  },
  {
    date: "Nov 14", dateJa: "11/14", dow: { en: "Sat", ja: "土" },
    day: { en: "Park Picnic", ja: "公園ピクニック" },
    night: { en: "Bye-bye Party (meal) · Closing", ja: "お別れパーティー（食事付き）· クロージング" },
    price: { en: "Included", ja: "込み" }, highlight: true,
  },
];

// ── High-level program overview (public-facing, intentionally not day-by-day) ──
export type ProgramHighlight = { icon: string; label: Bi };
export type ProgramPhase = {
  week: Bi;
  dates: Bi;
  theme: Bi;
  body: Bi;
  highlights: ProgramHighlight[];
};

export const PROGRAM: {
  rhythm: { title: Bi; items: { icon: string; label: Bi; note: Bi }[] };
  phases: ProgramPhase[];
} = {
  rhythm: {
    title: { en: "A day in the rhythm", ja: "1日のリズム" },
    items: [
      {
        icon: "sunrise",
        label: { en: "Mornings", ja: "朝" },
        note: { en: "Yoga, calligraphy & Japanese class", ja: "ヨガ・書道・日本語クラス" },
      },
      {
        icon: "laptop",
        label: { en: "Daytime", ja: "日中" },
        note: { en: "Coworking, focus time & workshops", ja: "コワーキング・集中・ワークショップ" },
      },
      {
        icon: "users",
        label: { en: "Evenings", ja: "夜" },
        note: { en: "Dinners, meetups & community nights", ja: "ディナー・交流会・コミュニティナイト" },
      },
    ],
  },
  phases: [
    {
      week: { en: "Week 1", ja: "1週目" },
      dates: { en: "Nov 1 – 7", ja: "11/1 – 7" },
      theme: { en: "Land & Belong", ja: "着いて、なじむ" },
      body: {
        en: "Arrive, meet your cohort, and settle into Osaka. Find your rhythm between coworking, culture, and the crew.",
        ja: "到着して仲間と出会い、大阪に馴染む1週間。コワーキング・文化体験・仲間との時間でリズムをつかみます。",
      },
      highlights: [
        { icon: "party", label: { en: "Welcome Party", ja: "ウェルカムパーティー" } },
        { icon: "landmark", label: { en: "Kyoto Day Trip", ja: "京都日帰りツアー" } },
        { icon: "culture", label: { en: "Culture & workshops", ja: "文化＆ワークショップ" } },
      ],
    },
    {
      week: { en: "Week 2", ja: "2週目" },
      dates: { en: "Nov 8 – 14", ja: "11/8 – 14" },
      theme: { en: "Explore & Farewell", ja: "深めて、送り出す" },
      body: {
        en: "Go deeper with signature experiences and community dinners, then send the two weeks off together.",
        ja: "シグネチャー体験やコミュニティディナーで一歩深く。最後はみんなで2週間を締めくくります。",
      },
      highlights: [
        { icon: "waterfall", label: { en: "Waterfall & Fireworks night", ja: "滝行 & 花火の夜" } },
        { icon: "picnic", label: { en: "Farewell Picnic & Party", ja: "お別れピクニック & パーティー" } },
        { icon: "culture", label: { en: "Workshops & dinners", ja: "ワークショップ＆ディナー" } },
      ],
    },
  ],
};

export const SCHEDULE_ADDONS: { title: Bi; items: Bi[] } = {
  title: { en: "Optional add-ons (self-organized, extra)", ja: "追加・任意（別料金・各自手配）" },
  items: [
    { en: "USJ ~¥9,800 (+transport)", ja: "USJ ~¥9,800（交通別）" },
    { en: "Spa World / Solaniwa Onsen", ja: "スパワールド / 空庭温泉" },
    { en: "Nara day trip", ja: "奈良日帰り" },
    { en: "Morning Park Yoga @ Osaka Castle — most mornings", ja: "朝の大阪城公園ヨガ — ほぼ毎朝" },
  ],
};

export function pick(b: Bi, locale: Locale): string {
  return locale === "ja" ? b.ja : b.en;
}
