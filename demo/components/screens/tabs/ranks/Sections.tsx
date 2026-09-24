"use client";

import { motion } from "motion/react";
import { ChevronRight, Clock, TrendingUp } from "lucide-react";
import { type ReactNode } from "react";
import { DAILY_FREE_VOTES, SHOWS, fmt, type ShowKey } from "@/lib/data";
import { useNav } from "../../../nav";
import { Avatar, Flag, glass } from "../../../ui";
import { Move, Ring } from "./charts";
import { CLOSES, UP, countdown, useNow, type Ranked } from "./model";

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-3 mt-8 flex items-end justify-between">
      <h2 className="font-display text-[15px] font-bold tracking-tight">{children}</h2>
      {right && <span className="text-[11px] font-semibold text-white/45">{right}</span>}
    </div>
  );
}

/* ---------------- live status: countdown + my votes ---------------- */

export function StatusCard({ show, total, fresh }: { show: ShowKey; total: number; fresh: number }) {
  const { freeVotes, votesLeft } = useNav();
  const now = useNow();
  const color = SHOWS[show].color;
  const close = CLOSES[show];
  const { days, clock } = countdown(now ? close.at(now) - now : 0);
  const urgent = now > 0 && days === 0 && close.at(now) - now < 3600;

  return (
    <div className={`relative overflow-hidden rounded-3xl p-4 ${glass}`}>
      <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full blur-[50px]" style={{ background: color, opacity: 0.35 }} />
      <div className="relative flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: color }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: color }} />
            </span>
            {close.round}
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-white/50">
            <Clock size={11} /> Voting closes in
          </div>
          <div className={`font-display text-[26px] font-extrabold tabular-nums leading-tight tracking-tight ${urgent ? "text-call" : ""}`} suppressHydrationWarning>
            {now ? (
              <>
                {days > 0 && <span>{days}d </span>}
                {clock}
              </>
            ) : (
              "--:--:--"
            )}
          </div>
          <div className="mt-0.5 text-[10px] text-white/40">{close.label}</div>
        </div>
        <div className="flex flex-col items-center">
          <Ring value={freeVotes} max={DAILY_FREE_VOTES} color={color} size={58}>
            <span className="font-display text-[17px] font-extrabold tabular-nums">{freeVotes}</span>
          </Ring>
          <span className="mt-1 text-[10px] font-semibold text-white/50">free votes left</span>
          {votesLeft > 0 && <span className="text-[10px] font-bold text-white/70">+{votesLeft} bonus</span>}
        </div>
      </div>
      <div className="relative mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px]">
        <span className="text-white/50">
          <b className="tabular-nums text-white">{fmt(total)}</b> votes cast in {SHOWS[show].name}
        </span>
        {fresh > 0 && (
          <motion.span key={fresh} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="font-bold tabular-nums" style={{ color: UP }}>
            +{fmt(fresh)} live
          </motion.span>
        )}
      </div>
    </div>
  );
}

/* ---------------- filters ---------------- */

export function Chip({ on, color, onClick, children }: { on: boolean; color: string; onClick: () => void; children: ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      aria-pressed={on}
      className="flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-bold backdrop-blur-xl transition-colors"
      style={on ? { background: `${color}26`, borderColor: `${color}80`, color: "#fff" } : { background: "rgba(255,255,255,.04)", borderColor: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.6)" }}
    >
      {children}
    </motion.button>
  );
}

/* ---------------- rising fast ---------------- */

export function RisingFast({ list, onPick }: { list: Ranked[]; onPick: (id: string) => void }) {
  const risers = [...list].filter((c) => c.move > 0).sort((a, b) => b.move - a.move || b.today - a.today).slice(0, 4);
  if (!risers.length) return null;
  return (
    <>
      <SectionTitle right="since yesterday">
        <span className="flex items-center gap-1.5">
          <TrendingUp size={15} style={{ color: UP }} /> Rising fast
        </span>
      </SectionTitle>
      <div className="no-bar -mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1">
        {risers.map((c) => (
          <motion.button
            key={c.id}
            whileTap={{ scale: 0.96 }}
            onClick={() => onPick(c.id)}
            className={`flex w-[138px] shrink-0 flex-col rounded-2xl p-3 text-left ${glass}`}
          >
            <div className="flex items-center justify-between">
              <Avatar c={c} size={34} />
              <span className="rounded-full px-2 py-1" style={{ background: `${UP}1f` }}>
                <Move n={c.move} big />
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[12px] font-bold">
              <span className="truncate">{c.name.split(" ")[0]}</span>
              <Flag country={c.country} size={9} />
            </div>
            <div className="text-[10px] text-white/45">now #{c.rank}</div>
            <div className="mt-1.5 text-[11px] font-bold tabular-nums" style={{ color: UP }}>
              +{fmt(c.today)} today
            </div>
          </motion.button>
        ))}
      </div>
    </>
  );
}

/* ---------------- country leaderboard ---------------- */

export function CountryBoard({ list, show, active, onPick }: { list: Ranked[]; show: ShowKey; active: string | null; onPick: (country: string) => void }) {
  const color = SHOWS[show].color;
  const byCountry = new Map<string, { votes: number; people: number }>();
  for (const c of list) {
    const e = byCountry.get(c.country) ?? { votes: 0, people: 0 };
    e.votes += c.total;
    e.people += 1;
    byCountry.set(c.country, e);
  }
  const rows = [...byCountry].sort((a, b) => b[1].votes - a[1].votes);
  const total = rows.reduce((a, [, e]) => a + e.votes, 0) || 1;
  const max = rows[0]?.[1].votes || 1;

  return (
    <>
      <SectionTitle right="tap to filter">Country leaderboard</SectionTitle>
      <div className={`rounded-2xl p-2 ${glass}`}>
        {rows.map(([country, e], i) => (
          <motion.button
            layout
            key={country}
            onClick={() => onPick(country)}
            className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors"
            style={active === country ? { background: `${color}1a` } : undefined}
          >
            <span className="w-4 text-center font-display text-[12px] font-bold text-white/40">{i + 1}</span>
            <Flag country={country} size={16} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-[12px]">
                <span className="truncate font-bold">
                  {country} <span className="font-medium text-white/40">· {e.people}</span>
                </span>
                <span className="font-bold tabular-nums">
                  {fmt(e.votes)} <span className="font-medium text-white/40">{Math.round((e.votes / total) * 100)}%</span>
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(e.votes / max) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.05 }}
                />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </>
  );
}

/* ---------------- your picks ---------------- */

export function YourPicks({ ranked }: { ranked: Record<ShowKey, Ranked[]> }) {
  const { myVotes, push } = useNav();
  const picks = (Object.keys(ranked) as ShowKey[])
    .flatMap((k) => ranked[k])
    .filter((c) => (myVotes[c.id] ?? 0) > 0)
    .sort((a, b) => (myVotes[b.id] ?? 0) - (myVotes[a.id] ?? 0));
  if (!picks.length) return null;
  const given = picks.reduce((a, c) => a + (myVotes[c.id] ?? 0), 0);

  return (
    <>
      <SectionTitle right={`${given} vote${given === 1 ? "" : "s"} given`}>Your picks</SectionTitle>
      <div className="space-y-2">
        {picks.map((c) => {
          const color = SHOWS[c.show].color;
          return (
            <motion.button
              layout
              key={c.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => push({ name: "profile", id: c.id })}
              className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left ${glass}`}
            >
              <Avatar c={c} size={36} ring={color} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[13px] font-bold">
                  <span className="truncate">{c.name}</span>
                  <Flag country={c.country} size={10} />
                </div>
                <div className="mt-0.5 text-[11px] text-white/50">
                  <b style={{ color }}>#{c.rank}</b> in {SHOWS[c.show].name} · you gave <b className="text-white/80">{myVotes[c.id]}</b>
                </div>
              </div>
              <Move n={c.move} big />
              <ChevronRight size={16} className="text-white/30" />
            </motion.button>
          );
        })}
      </div>
    </>
  );
}
