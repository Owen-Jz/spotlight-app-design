import { useSyncExternalStore } from "react";
import { PEOPLE, SHOWS, statsFor, type Contestant, type ShowKey, type Stats } from "@/lib/data";

/** The Ranks tab's show filter: both shows together, or one of them. */
export type ShowFilter = "all" | ShowKey;
export const FILTER_KEYS: ShowFilter[] = ["all", ...(Object.keys(SHOWS) as ShowKey[])];
export const FILTERS: Record<ShowFilter, { name: string; color: string }> = {
  all: { name: "All", color: "#f4efe6" },
  talent: { name: SHOWS.talent.name, color: SHOWS.talent.color },
  idea: { name: SHOWS.idea.name, color: SHOWS.idea.color },
};

/* ---------------- ranking model ---------------- */

export type Ranked = Contestant & {
  /** base votes + votes added this session */
  total: number;
  /** live rank in the ranked list (1-based) */
  rank: number;
  /** places moved: yesterday's movement + any live overtakes (+ = up) */
  move: number;
  /** live % of the ranked list's votes */
  share: number;
  /** 7-day trend with this session's votes folded into today */
  trend: number[];
  today: number;
  /** votes needed to overtake the person above (null for #1) */
  gapUp: number | null;
  /** lead over the person below (null for last) */
  gapDown: number | null;
  stats: Stats;
};

const statsCache = new Map<string, Stats>();
export const cachedStats = (c: Contestant) => {
  let s = statsCache.get(c.id);
  if (!s) {
    s = statsFor(c);
    statsCache.set(c.id, s);
  }
  return s;
};

/** Live ranking for one show, or for everyone across both shows. */
export function rankShow(show: ShowFilter, extra: Record<string, number>): Ranked[] {
  const people = show === "all" ? PEOPLE : PEOPLE.filter((c) => c.show === show);
  const baseOrder = [...people].sort((a, b) => b.votes - a.votes).map((c) => c.id);
  const withTotals = people.map((c) => ({ c, total: c.votes + (extra[c.id] ?? 0) })).sort((a, b) => b.total - a.total);
  const showTotal = withTotals.reduce((a, x) => a + x.total, 0) || 1;
  const n = withTotals.length;

  return withTotals.map(({ c, total }, i) => {
    const rank = i + 1;
    const stats = cachedStats(c);
    const live = baseOrder.indexOf(c.id) + 1 - rank;
    // can't have climbed more places than exist above you, or fallen more than exist below
    const move = Math.max(-(n - rank), Math.min(rank - 1, stats.delta + live));
    const added = extra[c.id] ?? 0;
    const trend = [...stats.trend.slice(0, 6), stats.trend[6] + added];
    return {
      ...c,
      total,
      rank,
      move,
      share: Math.round((total / showTotal) * 1000) / 10,
      trend,
      today: trend[6],
      gapUp: i > 0 ? withTotals[i - 1].total - total + 1 : null,
      gapDown: i < n - 1 ? total - withTotals[i + 1].total : null,
      stats,
    };
  });
}

/* ---------------- live clock ---------------- */

const subscribe = (cb: () => void) => {
  const t = setInterval(cb, 1000);
  return () => clearInterval(t);
};
const nowSec = () => Math.floor(Date.now() / 1000);

/** Current time in whole seconds; ticks every second on the client, 0 during SSR. */
export function useNow() {
  return useSyncExternalStore(subscribe, nowSec, () => 0);
}

const DAY = 86400;
/** Next occurrence of hh:00 UTC (WAT = UTC+1), optionally on a given weekday (0 = Sun). */
function nextUtc(now: number, hourUtc: number, weekday?: number) {
  const d = new Date(now * 1000);
  let t = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), hourUtc) / 1000;
  if (weekday !== undefined) t += ((weekday - d.getUTCDay() + 7) % 7) * DAY;
  if (t <= now) t += weekday !== undefined ? 7 * DAY : DAY;
  return t;
}

type Close = { round: string; label: string; at: (now: number) => number };
const TALENT_CLOSE: Close = { round: "Round 2 · Public vote", label: "Closes 9:00 PM WAT", at: (n) => nextUtc(n, 20) };
const IDEA_CLOSE: Close = { round: "Pitch round · Public vote", label: "Closes Sunday 9:00 PM WAT", at: (n) => nextUtc(n, 20, 0) };

export const CLOSES: Record<ShowFilter, Close> = {
  all: {
    round: `${SHOWS.talent.name} + ${SHOWS.idea.name} · Public vote`,
    label: `Next up: ${SHOWS.talent.name} closes 9:00 PM WAT`,
    at: (n) => Math.min(TALENT_CLOSE.at(n), IDEA_CLOSE.at(n)),
  },
  talent: TALENT_CLOSE,
  idea: IDEA_CLOSE,
};

const pad = (n: number) => String(n).padStart(2, "0");
export function countdown(secs: number) {
  if (secs <= 0) return { days: 0, clock: "00:00:00" };
  const days = Math.floor(secs / DAY);
  const r = secs % DAY;
  return { days, clock: `${pad(Math.floor(r / 3600))}:${pad(Math.floor((r % 3600) / 60))}:${pad(r % 60)}` };
}

/* ---------------- colours ---------------- */

export const UP = "#22e58a";
export const DOWN = "#ff4d6d";
