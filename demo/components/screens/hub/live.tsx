"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import type { Contestant, ShowKey } from "@/lib/data";
import { Avatar } from "../../ui";

/* ------------------------------------------------------------------
 * "Alive" primitives shared by the Shows tab and the show hubs:
 * ticking counters, ticking countdowns, rolling digits, avatar stacks.
 * Every value starts from a constant, so server and client render the
 * same first frame; motion only begins after mount.
 * ------------------------------------------------------------------ */

/** A number that keeps creeping up, like a live counter. */
export function useTicker(start: number, { min = 1, max = 12, every = 1400 }: { min?: number; max?: number; every?: number } = {}) {
  const [n, setN] = useState(start);
  useEffect(() => {
    const t = setInterval(() => setN((v) => v + min + Math.floor(Math.random() * (max - min + 1))), every);
    return () => clearInterval(t);
  }, [min, max, every]);
  return n;
}

/** A number that drifts up and down around a base (viewers watching). */
export function useDrift(start: number, spread = 40, every = 1800) {
  const [n, setN] = useState(start);
  useEffect(() => {
    const t = setInterval(() => setN((v) => Math.max(0, v + Math.round((Math.random() - 0.42) * spread))), every);
    return () => clearInterval(t);
  }, [spread, every]);
  return n;
}

/** Seconds remaining, ticking once a second; loops so the demo never "ends". */
export function useCountdown(seconds: number) {
  const [s, setS] = useState(seconds);
  useEffect(() => {
    const t = setInterval(() => setS((v) => (v <= 1 ? seconds : v - 1)), 1000);
    return () => clearInterval(t);
  }, [seconds]);
  return s;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** 3725 → "01:02:05"; 190000 → "2d 04:46:40". */
export function clock(total: number) {
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${d > 0 ? `${d}d ` : ""}${pad(h)}:${pad(m)}:${pad(s)}`;
}

/** Fixed locale so server and client agree. */
export const num = (n: number) => n.toLocaleString("en-US");

/** Text whose characters roll like an odometer when they change. */
export function Roll({ text, className = "" }: { text: string; className?: string }) {
  const chars = text.split("");
  return (
    <span className={`inline-flex tabular-nums ${className}`} aria-label={text}>
      {chars.map((ch, i) => (
        // key from the right, so units stay put when the number grows a digit
        <span key={chars.length - i} className="relative inline-block overflow-hidden" aria-hidden>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={ch}
              className="inline-block"
              initial={{ y: "90%", opacity: 0, filter: "blur(2px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: "-90%", opacity: 0, filter: "blur(2px)" }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
            >
              {ch === " " ? " " : ch}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}

/** Blinking live dot. */
export function LiveDot({ color = "#ff5a1f", size = 6 }: { color?: string; size?: number }) {
  return (
    <span className="relative inline-flex" style={{ width: size, height: size }}>
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ background: color }}
        animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
      />
      <span className="relative h-full w-full rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
    </span>
  );
}

/** Overlapping avatars + "+N". */
export function AvatarStack({ people, size = 24, extra, ring = "#040404" }: { people: Contestant[]; size?: number; extra?: number; ring?: string }) {
  return (
    <span className="flex items-center">
      {people.map((p, i) => (
        <span key={p.id} className="rounded-full" style={{ marginLeft: i ? -size * 0.36 : 0, boxShadow: `0 0 0 2px ${ring}`, zIndex: people.length - i }}>
          <Avatar c={p} size={size} />
        </span>
      ))}
      {extra ? (
        <span
          className="flex items-center justify-center rounded-full bg-white/15 font-bold text-white/90 backdrop-blur-md"
          style={{ height: size, minWidth: size, marginLeft: -size * 0.36, fontSize: size * 0.36, padding: "0 5px", boxShadow: `0 0 0 2px ${ring}` }}
        >
          +{extra >= 1000 ? `${Math.round(extra / 100) / 10}k` : extra}
        </span>
      ) : null}
    </span>
  );
}

/** Small uppercase section heading. */
export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-3.5 mt-9 flex items-center justify-between">
      <div className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">{children}</div>
      {right}
    </div>
  );
}

/** What each show is counting down to right now, and the numbers that move. */
export const SHOW_LIVE: Record<ShowKey, { until: string; seconds: number; cta: string }> = {
  call: { until: "Vote 2 closes in", seconds: 58 * 60 + 12, cta: "Watch live" },
  task: { until: "Race closes in", seconds: 5 * 3600 + 12 * 60 + 40, cta: "Race in" },
  idea: { until: "Pitches close in", seconds: 2 * 86400 + 4 * 3600 + 9 * 60 + 31, cta: "Book a pitch" },
};

/** Viewers on the live grand final — matches the Live screen's starting count. */
export const LIVE_VIEWERS = 12400;
