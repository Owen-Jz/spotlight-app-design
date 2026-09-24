"use client";

import { motion } from "motion/react";
import { BadgeCheck, Check, Crown, Play } from "lucide-react";
import { useId, type ReactNode } from "react";
import { CALL_STAGES, PEOPLE, fmt, type Contestant, type ShowKey } from "@/lib/data";
import { Media, glass, rise } from "../../ui";

/* ---------------- show journeys ---------------- */

export const JOURNEYS: Record<ShowKey, { t: string; d: string }[]> = {
  call: CALL_STAGES,
  task: [
    { t: "The race", d: "Finish the task first" },
    { t: "Final 10", d: "First ten through" },
    { t: "Public vote", d: "Strictly by votes" },
    { t: "Winner", d: "Crowned live" },
  ],
  idea: [
    { t: "The pitch", d: "2-minute business pitch" },
    { t: "Investor review", d: "Panel picks the room" },
    { t: "Public vote", d: "Africa backs an idea" },
    { t: "Pitch live", d: "Face the investors" },
    { t: "Funded", d: "Deal on the table" },
  ],
};

/** where each show's live contestants are right now */
export const CURRENT_STAGE: Record<ShowKey, number> = { call: 4, task: 2, idea: 2 };

/** titles of the entries a contestant has posted so far */
export const ENTRY_TITLES: Record<ShowKey, string[]> = {
  call: ["Sell yourself", "Call 1", "Call 2"],
  task: ["The race", "Final 10 task"],
  idea: ["The pitch", "Investor Q&A"],
};

export const totalVotes = (c: Contestant, extra: Record<string, number>) => c.votes + (extra[c.id] ?? 0);

export function rankIn(c: Contestant, extra: Record<string, number>) {
  return (
    PEOPLE.filter((p) => p.show === c.show)
      .map((p) => ({ id: p.id, t: totalVotes(p, extra) }))
      .sort((a, b) => b.t - a.t)
      .findIndex((p) => p.id === c.id) + 1
  );
}

/* ---------------- small pieces ---------------- */

export function Verified({ size = 18, color = "#4c7dff" }: { size?: number; color?: string }) {
  return (
    <span className="inline-flex shrink-0" title="Verified" aria-label="Verified">
      <BadgeCheck size={size} fill={color} className="text-ink" strokeWidth={2.4} />
    </span>
  );
}

export function SectionHead({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div className="mb-3 mt-8 flex items-center justify-between">
      <h2 className="font-display text-[13px] font-bold uppercase tracking-[0.12em] text-white/55">{title}</h2>
      {right}
    </div>
  );
}

export function StatTile({ value, label, accent }: { value: ReactNode; label: string; accent?: string }) {
  return (
    <div className={`rounded-2xl px-1 py-3.5 text-center ${glass}`}>
      <div className="font-display text-[18px] font-extrabold leading-none" style={accent ? { color: accent } : undefined}>
        {value}
      </div>
      <div className="mt-1.5 text-[10.5px] font-semibold text-white/45">{label}</div>
    </div>
  );
}

/** 7-day area chart, inline SVG. */
export function TrendChart({ data, color, height = 88 }: { data: number[]; color: string; height?: number }) {
  const gid = useId().replace(/:/g, "");
  const W = 300;
  const H = height;
  const pad = 6;
  const max = Math.max(...data) * 1.08;
  const min = Math.min(...data) * 0.7;
  const x = (i: number) => pad + (i * (W - pad * 2)) / (data.length - 1);
  const y = (v: number) => H - pad - ((v - min) / (max - min || 1)) * (H - pad * 2);
  const line = data.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(data.length - 1)},${H} L${x(0)},${H} Z`;
  const days = ["M", "T", "W", "T", "F", "S", "Today"];
  return (
    <div>
      <div className="relative" style={{ height }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" role="img" aria-label="Votes over the last 7 days">
          <defs>
            <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={color} stopOpacity="0.45" />
              <stop offset="1" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.33, 0.66].map((f) => (
            <line key={f} x1={0} x2={W} y1={H * f} y2={H * f} stroke="rgba(255,255,255,.06)" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />
          ))}
          <motion.path d={area} fill={`url(#${gid})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} />
          <motion.path
            d={line}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        {/* glowing dot on today */}
        <motion.span
          className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${(x(data.length - 1) / W) * 100}%`,
            top: `${(y(data[data.length - 1]) / H) * 100}%`,
            background: color,
            boxShadow: `0 0 0 3px #040404, 0 0 14px ${color}`,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.3, type: "spring", stiffness: 400, damping: 18 }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-semibold text-white/35">
        {days.map((d, i) => (
          <span key={i} className={i === 6 ? "text-white/80" : ""}>
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Vertical timeline of a show's stages; `current` glows. */
export function Journey({ show, current, color }: { show: ShowKey; current: number; color: string }) {
  const steps = JOURNEYS[show];
  return (
    <div className={`rounded-[24px] p-4 ${glass}`}>
      {steps.map((s, i) => {
        const done = i < current;
        const now = i === current;
        const last = i === steps.length - 1;
        return (
          <div key={s.t} className="relative flex gap-3">
            {!last && (
              <span
                className="absolute left-[11px] top-6 h-[calc(100%-12px)] w-[2px] rounded-full"
                style={{ background: done ? color : "rgba(255,255,255,.1)" }}
              />
            )}
            <span
              className="relative z-[1] mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold"
              style={
                done
                  ? { background: color }
                  : now
                    ? { background: "#040404", boxShadow: `0 0 0 2px ${color}, 0 0 18px ${color}` }
                    : { background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", color: "rgba(255,255,255,.4)" }
              }
            >
              {done ? <Check size={13} strokeWidth={3} /> : now ? <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: color }} /> : i + 1}
            </span>
            <div className={`min-w-0 flex-1 ${last ? "" : "pb-4"}`}>
              <div className="flex items-center gap-2">
                <span className={`text-[14px] font-bold ${done || now ? "text-white" : "text-white/40"}`}>{s.t}</span>
                {now && (
                  <span className="rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider" style={{ background: `${color}26`, color }}>
                    Now
                  </span>
                )}
              </div>
              <div className={`text-[12px] ${now ? "text-white/65" : "text-white/35"}`}>{s.d}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Compact horizontal progress bar version of the journey. */
export function JourneyBar({ show, current, color }: { show: ShowKey; current: number; color: string }) {
  const steps = JOURNEYS[show];
  const pct = (current / (steps.length - 1)) * 100;
  return (
    <div>
      <div className="relative mx-2 h-6">
        <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-white/10" />
        <motion.div
          className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full"
          style={{ background: color, boxShadow: `0 0 12px ${color}` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        />
        {steps.map((s, i) => (
          <span
            key={s.t}
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: `${(i / (steps.length - 1)) * 100}%`,
              background: i <= current ? color : "#1a1a1c",
              boxShadow: i === current ? `0 0 0 3px #040404, 0 0 0 5px ${color}` : "0 0 0 2px #040404",
            }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-semibold text-white/35">
        <span>{steps[0].t}</span>
        <span>{steps[steps.length - 1].t}</span>
      </div>
    </div>
  );
}

/** Fan leaderboard. `me` (if set) is slotted in by vote count. */
export function Supporters({
  list,
  me,
  color,
}: {
  list: { name: string; votes: number }[];
  me?: { name: string; votes: number };
  color: string;
}) {
  const all = [...list.map((s) => ({ ...s, you: false })), ...(me ? [{ ...me, you: true }] : [])].sort((a, b) => b.votes - a.votes);
  const top = all.slice(0, 5);
  const myPlace = all.findIndex((s) => s.you);
  const showMe = me && myPlace >= 5;
  const max = all[0]?.votes || 1;
  const row = (s: (typeof all)[number], i: number) => (
    <div key={s.name + i} className={`flex items-center gap-3 rounded-xl px-2 py-2 ${s.you ? "bg-white/[0.06]" : ""}`}>
      <span className="w-5 text-center font-display text-[12px] font-extrabold text-white/45">
        {i === 0 ? <Crown size={15} className="mx-auto text-idea" fill="#f2b53a" /> : i + 1}
      </span>
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold uppercase"
        style={{ background: s.you ? color : `hsl(${(s.name.charCodeAt(0) * 37) % 360} 45% 28%)` }}
      >
        {s.name.slice(0, 2)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-bold">{s.you ? "You" : `@${s.name}`}</div>
        <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className="h-full rounded-full"
            style={{ background: s.you ? color : "rgba(255,255,255,.35)" }}
            initial={{ width: 0 }}
            whileInView={{ width: `${(s.votes / max) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
      <span className="text-[12px] font-bold tabular-nums text-white/70">{fmt(s.votes)}</span>
    </div>
  );
  return (
    <div className={`rounded-[24px] p-2 ${glass}`}>
      {top.map(row)}
      {showMe && (
        <>
          <div className="px-3 text-[12px] text-white/25">···</div>
          {row(all[myPlace], myPlace)}
        </>
      )}
    </div>
  );
}

export function Cities({ list, color }: { list: { city: string; pct: number }[]; color: string }) {
  return (
    <div className={`space-y-3 rounded-[24px] p-4 ${glass}`}>
      {list.map((c, i) => (
        <div key={c.city}>
          <div className="mb-1.5 flex justify-between text-[12px]">
            <span className={`font-semibold ${i ? "text-white/65" : "text-white"}`}>{c.city}</span>
            <span className="font-bold tabular-nums text-white/55">{c.pct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full rounded-full"
              style={{ background: i ? "rgba(255,255,255,.3)" : color }}
              initial={{ width: 0 }}
              whileInView={{ width: `${c.pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.08 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/** 3:4 video tile for an entry. */
export function EntryTile({
  hue,
  video,
  img,
  title,
  badge,
  still,
  onClick,
}: {
  hue: [string, string];
  video?: string;
  img?: string;
  title: string;
  badge?: ReactNode;
  still?: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button whileTap={{ scale: 0.96 }} onClick={onClick} className="relative aspect-[3/4] overflow-hidden rounded-2xl text-left">
      <Media hue={hue} video={video} img={img} still={still} />
      <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 backdrop-blur-md">
        <Play size={11} fill="white" className="ml-0.5" />
      </span>
      {badge && <span className="absolute right-1.5 top-1.5">{badge}</span>}
      <span className="absolute bottom-2 left-2 right-2 truncate text-[11px] font-bold">{title}</span>
    </motion.button>
  );
}

/** A section wrapper that animates in with the page's stagger. */
export function Block({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.section variants={rise} className={className}>
      {children}
    </motion.section>
  );
}
