"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Flame, Heart, MapPin, UserRound, Users } from "lucide-react";
import { type ReactNode } from "react";
import { PEOPLE, SHOWS, fmt } from "@/lib/data";
import { useNav } from "../../../nav";
import { Avatar, Button, Flag, glass } from "../../../ui";
import { Move, Sparkline, TrendBars } from "./charts";
import { useNow, type Ranked } from "./model";

const spring = { type: "spring" as const, stiffness: 380, damping: 34 };

/** One leaderboard row. Glides to its new slot when votes re-sort the list; taps open the detail drawer. */
export function StandingRow({
  c,
  above,
  open,
  onToggle,
}: {
  c: Ranked;
  above?: Ranked;
  open: boolean;
  onToggle: () => void;
}) {
  const { myVotes } = useNav();
  const color = SHOWS[c.show].color;
  const mine = myVotes[c.id] ?? 0;

  return (
    <motion.div
      layout
      id={`rank-${c.id}`}
      transition={spring}
      className={`overflow-hidden rounded-2xl ${glass}`}
      style={open ? { borderColor: `${color}55`, boxShadow: `0 18px 40px -24px ${color}` } : undefined}
    >
      <motion.button layout="position" onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-3 p-3 text-left">
        <div className="flex w-6 shrink-0 flex-col items-center gap-1">
          <span className="font-display text-[15px] font-bold leading-none text-white/80">{c.rank}</span>
          <Move n={c.move} />
        </div>
        <Avatar c={c} size={40} ring={mine ? color : undefined} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[14px] font-bold">{c.name}</span>
            <Flag country={c.country} size={11} />
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/45">
            <span className="truncate font-semibold" style={{ color: `${color}cc` }}>
              {c.category}
            </span>
            <span className="h-0.5 w-0.5 rounded-full bg-white/30" />
            <span className="tabular-nums">{c.share}%</span>
            {mine > 0 && (
              <>
                <span className="h-0.5 w-0.5 rounded-full bg-white/30" />
                <span className="flex items-center gap-0.5 font-bold" style={{ color }}>
                  <Heart size={9} fill={color} /> {mine}
                </span>
              </>
            )}
          </div>
        </div>
        <Sparkline data={c.trend} color={color} w={48} />
        <div className="flex w-12 flex-col items-end">
          <motion.span
            key={c.total}
            initial={{ scale: 1.25, color }}
            animate={{ scale: 1, color: "#ffffff" }}
            transition={{ duration: 0.5 }}
            className="text-[13px] font-extrabold tabular-nums"
          >
            {fmt(c.total)}
          </motion.span>
          <motion.span animate={{ rotate: open ? 180 : 0 }} className="mt-0.5 text-white/30">
            <ChevronDown size={13} />
          </motion.span>
        </div>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ height: spring, opacity: { duration: 0.2 } }}
          >
            <Detail c={c} above={above} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** Everything a fan wants to know about one contestant's standing. Used in rows and under the podium. */
export function Detail({ c, above }: { c: Ranked; above?: Ranked }) {
  const { openVote, push, myVotes } = useNav();
  const now = useNow();
  const color = SHOWS[c.show].color;
  const mine = myVotes[c.id] ?? 0;
  const original = PEOPLE.find((p) => p.id === c.id) ?? c;
  const topFan = c.stats.supporters[0]?.votes || 1;

  return (
    <div className="border-t border-white/[0.06] px-3 pb-3 pt-3">
      {/* the chase: who is right above you */}
      <div className="mb-3 rounded-xl px-3 py-2 text-[12px]" style={{ background: `${color}14`, border: `1px solid ${color}30` }}>
        {c.gapUp === null ? (
          <span>
            <b style={{ color }}>Leading</b> by <b className="tabular-nums">{fmt(c.gapDown ?? 0)}</b> votes
          </span>
        ) : (
          <span>
            <b className="tabular-nums" style={{ color }}>
              {fmt(c.gapUp)}
            </b>{" "}
            votes to overtake <b>#{c.rank - 1}</b> {above?.name.split(" ")[0]}
          </span>
        )}
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        <Stat label="Today" value={`+${fmt(c.today)}`} color={color} />
        <Stat label="Share" value={`${c.share}%`} />
        <Stat label="Fans" value={fmt(c.stats.followers)} />
        <Stat label="Streak" value={`${c.stats.streak}d`} icon={<Flame size={10} className="text-talent" />} />
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-white/40">
          <span>Votes · last 7 days</span>
          <span className="tabular-nums normal-case tracking-normal text-white/50">{fmt(c.trend.reduce((a, b) => a + b, 0))} total</span>
        </div>
        <TrendBars data={c.trend} color={color} now={now} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <div className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white/40">
            <Users size={10} /> Top supporters
          </div>
          <ol className="space-y-1.5">
            {c.stats.supporters.slice(0, 3).map((s, i) => (
              <li key={s.name} className="text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="truncate text-white/75">
                    <span className="mr-1 font-bold text-white/35">{i + 1}</span>@{s.name}
                  </span>
                  <span className="font-bold tabular-nums">{s.votes}</span>
                </div>
                <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-white/[0.07]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.votes / topFan) * 100}%` }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.6 }}
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <div className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white/40">
            <MapPin size={10} /> Where votes come from
          </div>
          <div className="flex h-2 overflow-hidden rounded-full bg-white/[0.07]">
            {c.stats.topCities.map((t, i) => (
              <motion.div
                key={t.city}
                initial={{ width: 0 }}
                animate={{ width: `${t.pct}%` }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.6 }}
                style={{ background: color, opacity: 1 - i * 0.24 }}
              />
            ))}
          </div>
          <ul className="mt-2 space-y-1">
            {c.stats.topCities.map((t, i) => (
              <li key={t.city} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 truncate text-white/75">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color, opacity: 1 - i * 0.24 }} />
                  {t.city}
                </span>
                <span className="font-bold tabular-nums text-white/60">{t.pct}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-white/[0.04] px-3 py-2 text-[12px]">
        <span className="text-white/55">Your votes for {c.name.split(" ")[0]}</span>
        <span className="flex items-center gap-1 font-extrabold tabular-nums" style={{ color: mine ? color : "rgba(255,255,255,.4)" }}>
          <Heart size={12} fill={mine ? color : "none"} /> {mine}
        </span>
      </div>

      <div className="mt-3 flex gap-2">
        <Button color={color} onClick={() => openVote(original)} className="py-3! text-[13px]!">
          <Heart size={15} fill="#fff" /> Vote
        </Button>
        <Button variant="ghost" onClick={() => push({ name: "profile", id: c.id })} className="py-3! text-[13px]!">
          <UserRound size={15} /> View profile
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value, color, icon }: { label: string; value: string; color?: string; icon?: ReactNode }) {
  return (
    <div className="rounded-xl bg-white/[0.04] px-2 py-2 text-center">
      <div className="flex items-center justify-center gap-0.5 text-[13px] font-extrabold tabular-nums" style={color ? { color } : undefined}>
        {icon}
        {value}
      </div>
      <div className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-white/40">{label}</div>
    </div>
  );
}
