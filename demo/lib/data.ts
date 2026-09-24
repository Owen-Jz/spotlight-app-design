export type ShowKey = "talent" | "idea";

export const SHOWS: Record<
  ShowKey,
  { name: string; tagline: string; color: string; stage: string; countdown: string }
> = {
  talent: {
    name: "Talent",
    tagline: "Show your talent. Win the crowd.",
    color: "#ff5a1f",
    stage: "Grand Final · LIVE",
    countdown: "Live now",
  },
  idea: {
    name: "Ideas",
    tagline: "Pitch your business. Face the investors. Let Africa vote.",
    color: "#f2b53a",
    stage: "Pitches open",
    countdown: "Closes in 2d 4h",
  },
};

export const TALENT_CATEGORIES = ["Dance", "Music", "Poetry", "Acting", "Comedy", "Special Talents"];

export const IDEA_SECTORS = [
  "Agriculture",
  "Health care",
  "Exportation",
  "Tourism",
  "Real Estate",
  "Fashion",
  "Sports",
  "Food & Beverage",
  "Hospitality",
  "Energy",
  "Construction",
  "Manufacturing",
  "Technology",
];

export type Contestant = {
  id: string;
  name: string;
  handle: string;
  country: string;
  flag: string;
  category: string;
  show: ShowKey;
  caption: string;
  votes: number;
  hue: [string, string];
  /** stage photo fallback from /public/media */
  img: string;
  /** clip + avatar: /media/v/{slug}.mp4, /media/v/{slug}.jpg, /media/a/{slug}.jpg */
  slug: string;
  posted: string;
};

export const STAGES = ["stage-warm", "stage-blue", "stage-haze", "stage-red", "stage-green", "stage-dark", "stage-hands"];

type Row = [id: string, name: string, handle: string, country: string, flag: string, category: string, show: ShowKey, caption: string, votes: number, hue: [string, string], slug: string, posted: string];

const row = (r: Row, i: number): Contestant => {
  const [id, name, handle, country, flag, category, show, caption, votes, hue, slug, posted] = r;
  return { id, name, handle, country, flag, category, show, caption, votes, hue, slug, posted, img: STAGES[i % STAGES.length] };
};

// Footage: Mixkit stock (free licence), models standing in as fictional contestants.
export const CONTESTANTS: Contestant[] = (
  [
    ["c1", "Tolu Adebayo", "@toluvocals", "Nigeria", "🇳🇬", "Music", "talent", "Round 2: one song, no instruments, 2 minutes. Here's my shot 🎤", 18420, ["#ff5a1f", "#7a1fff"], "tolu", "2h"],
    ["c2", "Rafa Mendes", "@rafamoves", "Brazil", "🇧🇷", "Dance", "talent", "Filmed this at 2am. I danced anyway. Vote if you felt it 🔥", 16275, ["#00d1ff", "#1f3dff"], "rafa", "3h"],
    ["c3", "Amara Okafor", "@amarawrites", "Nigeria", "🇳🇬", "Poetry", "talent", "60 seconds to tell you who I am. \"Lagos taught me to be loud.\"", 14902, ["#ff2e7a", "#ffb01f"], "amara", "5h"],
    ["c4", "Zawadi Njeri", "@zawadilaughs", "Kenya", "🇰🇪", "Comedy", "talent", "When your mum finds out you entered a talent show 😂", 12340, ["#22e58a", "#006b5f"], "zawadi", "6h"],
    ["c8", "Efe Oghene", "@efebars", "Nigeria", "🇳🇬", "Music", "talent", "Wrote this verse in the 24 hours they gave us. Round 2, let's go 🎤", 11760, ["#ffb01f", "#ff2e5a"], "efe", "7h"],
    ["c5", "Sipho Dlamini", "@siphosnaps", "South Africa", "🇿🇦", "Special Talents", "talent", "Beatbox + loop pedal, no edits. Top 10, here I come ⚡", 9810, ["#4c7dff", "#9b5cff"], "sipho", "8h"],
    ["c9", "Nia Kamau", "@niamoves", "Kenya", "🇰🇪", "Dance", "talent", "Night shoot, one take, zero sleep 💚", 10480, ["#22e58a", "#1f3dff"], "nia", "9h"],
    ["c6", "Emeka Obi", "@emekabuilds", "Nigeria", "🇳🇬", "Agriculture", "idea", "An app that pays farmers the day they harvest. No middlemen 🌾", 7644, ["#f2b53a", "#b8410f"], "emeka", "10h"],
    ["c7", "Tunde Bakare", "@tundeacts", "Nigeria", "🇳🇬", "Acting", "talent", "One monologue. Three characters. 60 seconds.", 11020, ["#c21fff", "#ff1f5a"], "tunde", "12h"],
    ["c10", "Kemi Lawal", "@kemisings", "Nigeria", "🇳🇬", "Music", "talent", "Headphones on, world off. Here's my 60 seconds.", 9120, ["#ff5a1f", "#c21fff"], "kemi", "14h"],
    ["c11", "Adaeze Nwankwo", "@adaezeglow", "Nigeria", "🇳🇬", "Special Talents", "talent", "Yes, I can hold a note AND blow bubbles 🫧 Special Talents, baby", 8350, ["#ff2e7a", "#7a1fff"], "adaeze", "1d"],
  ] as Row[]
).map(row);

/** People who only appear in rankings (keeps the feed short). */
const EXTRAS: Contestant[] = (
  [
    ["x1", "Chidi Nwosu", "@chidi", "Nigeria", "🇳🇬", "Music", "talent", "", 8720, ["#4c7dff", "#00d1ff"], "chidi", "1d"],
    ["x2", "Fatou Diallo", "@fatou", "Senegal", "🇸🇳", "Dance", "talent", "", 7310, ["#2e5bff", "#c21fff"], "fatou", "1d"],
    ["x3", "Yaw Boateng", "@yaw", "Ghana", "🇬🇭", "Comedy", "talent", "", 5980, ["#00b3ff", "#1f3dff"], "yaw", "2d"],
    ["x4", "Valeria Cruz", "@valeria", "Mexico", "🇲🇽", "Acting", "talent", "", 4105, ["#5c7dff", "#22e58a"], "valeria", "2d"],
    ["x5", "Kofi Asante", "@kofi", "Ghana", "🇬🇭", "Health care", "idea", "", 6920, ["#f2b53a", "#ff5a1f"], "kofi", "2d"],
    ["x6", "Lucía Ortega", "@lucia", "Colombia", "🇨🇴", "Tourism", "idea", "", 6015, ["#ffd23a", "#b8410f"], "lucia", "3d"],
  ] as Row[]
).map((r, i) => row(r, i + 3));

export const HOST = row(["host", "Host Tobi", "@spotlight", "Nigeria", "🇳🇬", "Host", "talent", "", 0, ["#ffffff", "#ff5a1f"], "host", ""], 4);

export const PEOPLE = [...CONTESTANTS, ...EXTRAS];
export const findPerson = (id: string) => PEOPLE.find((p) => p.id === id) ?? CONTESTANTS[0];

export const FINALISTS = CONTESTANTS.filter((c) => c.show === "talent").slice(0, 4);

export const TALENT_STAGES = [
  { t: "Showcase", d: "Post a 1-minute video" },
  { t: "The shortlist", d: "Organisers pick a selected few" },
  { t: "Round 1", d: "Public vote" },
  { t: "Round 2", d: "A 2-minute performance · 24 hours" },
  { t: "Vote 2", d: "Performance + votes" },
  { t: "Grand Final", d: "Live on stage" },
];

export const fmt = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 1 : 2).replace(/\.0+$/, "")}k` : `${n}`;

export const SEED_COMMENTS: [string, string, number][] = [
  ["ada_lagos", "This one gave me chills 🔥🔥", 214],
  ["kofi.gh", "Voting 25 times, no cap", 88],
  ["zee_writes", "The control at 0:42 is crazy", 61],
  ["mide", "Final is going to be too tough", 40],
  ["jay_ke", "From Nairobi with love ❤️", 23],
];

export const SEED_ALERTS = [
  { kind: "live" as const, title: "The Grand Final is LIVE", body: "4 finalists, one winner. Vote now.", time: "now", go: { name: "live" as const } },
  { kind: "vote" as const, title: "Voting closes in 1 hour", body: "Round 2 of Talent ends at 9:00 PM WAT.", time: "1h", go: { name: "hub" as const, show: "talent" as const } },
  { kind: "result" as const, title: "Investor day is Friday", body: "Ideas: 12 founders pitch live to the panel.", time: "3h", go: { name: "hub" as const, show: "idea" as const } },
  { kind: "follow" as const, title: "Rafa Mendes posted", body: "\"Filmed this at 2am. I danced anyway.\"", time: "3h", go: { name: "profile" as const, id: "c2" } },
];

/* ---------------- countries & flags ---------------- */

const CC: Record<string, string> = {
  Nigeria: "ng",
  Brazil: "br",
  Kenya: "ke",
  "South Africa": "za",
  Ghana: "gh",
  Senegal: "sn",
  Mexico: "mx",
  Colombia: "co",
};
/** ISO code for a country name; flag image lives at /flags/{cc}.svg */
export const countryCode = (country: string) => CC[country] ?? "ng";

/* ---------------- stats (deterministic, so numbers don't jump between renders) ---------------- */

function seeded(id: string) {
  let h = 2166136261;
  for (const ch of id) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export type Stats = {
  /** votes per day, last 7 days (oldest first) */
  trend: number[];
  /** places moved since yesterday (+ = up) */
  delta: number;
  today: number;
  /** % of total votes in their show */
  share: number;
  followers: number;
  views: number;
  streak: number;
  round: number;
  supporters: { name: string; votes: number }[];
  topCities: { city: string; pct: number }[];
};

const FANS = ["ada_lagos", "kofi.gh", "zee_writes", "mide", "jay_ke", "bisi", "nneka", "sam_abj", "tomi", "yinka"];
const CITIES: Record<string, string[]> = {
  ng: ["Lagos", "Abuja", "Port Harcourt", "Ibadan"],
  br: ["São Paulo", "Rio", "Lagos", "Salvador"],
  ke: ["Nairobi", "Mombasa", "Lagos", "Kisumu"],
  za: ["Johannesburg", "Cape Town", "Durban", "Lagos"],
  gh: ["Accra", "Kumasi", "Lagos", "Tamale"],
  sn: ["Dakar", "Thiès", "Lagos", "Accra"],
  mx: ["Mexico City", "Guadalajara", "Lagos", "Monterrey"],
  co: ["Bogotá", "Medellín", "Lagos", "Cali"],
};

export function statsFor(c: Contestant, all: Contestant[] = PEOPLE): Stats {
  const r = seeded(c.id);
  const base = c.votes / 7;
  const trend = Array.from({ length: 7 }, (_, i) => Math.round(base * (0.55 + i * 0.09 + r() * 0.35)));
  const showTotal = all.filter((p) => p.show === c.show).reduce((a, p) => a + p.votes, 0) || 1;
  const cities = CITIES[countryCode(c.country)] ?? CITIES.ng;
  const w = [44 + Math.round(r() * 12), 18 + Math.round(r() * 8), 10 + Math.round(r() * 6)];
  return {
    trend,
    delta: Math.round((r() - 0.4) * 6),
    today: trend[6],
    share: Math.round((c.votes / showTotal) * 1000) / 10,
    followers: Math.round(c.votes * (2.4 + r() * 2)),
    views: Math.round(c.votes * (9 + r() * 6)),
    streak: 2 + Math.floor(r() * 9),
    round: c.show === "talent" ? 2 : 1,
    supporters: FANS.slice(0, 5)
      .map((name, i) => ({ name, votes: Math.round((c.votes / 60) * (1 - i * 0.16) * (0.8 + r() * 0.4)) }))
      .sort((a, b) => b.votes - a.votes),
    topCities: [
      { city: cities[0], pct: w[0] },
      { city: cities[1], pct: w[1] },
      { city: cities[2], pct: w[2] },
      { city: "Elsewhere", pct: 100 - w[0] - w[1] - w[2] },
    ],
  };
}

/** Free votes everyone gets each day — voting never needs a payment. */
export const DAILY_FREE_VOTES = 10;
