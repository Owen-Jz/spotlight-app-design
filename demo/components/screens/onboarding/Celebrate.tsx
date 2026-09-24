"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  Bookmark,
  Gift,
  Heart,
  Lightbulb,
  Mic,
  Radio,
  TrendingUp,
  UserPen,
  UserPlus,
  Video,
  Vote,
  Zap,
} from "lucide-react";
import { useEffect, useState, type ComponentType } from "react";
import { CONTESTANTS, DAILY_FREE_VOTES } from "@/lib/data";
import { LogoMark } from "../../brand/Logo";
import { useNav, type Route } from "../../nav";
import { Button, Pulse, glass } from "../../ui";
import { ROLE_COLOR, draft } from "./common";

/* Deterministic pseudo-random, so confetti is identical on every render. */
const rnd = (n: number) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const CONFETTI_COLORS = ["#ff5a1f", "#4c7dff", "#f2b53a", "#ff2e7a", "#ffffff", "#22e58a"];
const CONFETTI = Array.from({ length: 44 }, (_, i) => {
  const angle = rnd(i) * Math.PI * 2;
  const dist = 90 + rnd(i + 100) * 150;
  return {
    dx: Math.cos(angle) * dist,
    dy: Math.sin(angle) * dist * 0.8 - 60,
    fall: 260 + rnd(i + 200) * 260,
    rot: (rnd(i + 300) - 0.5) * 900,
    w: 5 + rnd(i + 400) * 5,
    h: rnd(i + 500) > 0.5 ? 5 + rnd(i + 600) * 4 : 10 + rnd(i + 700) * 6,
    round: rnd(i + 800) > 0.7,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: rnd(i + 900) * 0.18,
    dur: 1.9 + rnd(i + 1000) * 1.1,
  };
});
const SPARKS = Array.from({ length: 14 }, (_, i) => ({
  left: 8 + rnd(i + 2000) * 84,
  top: 6 + rnd(i + 2100) * 88,
  size: 2 + rnd(i + 2200) * 3,
  delay: rnd(i + 2300) * 3,
  dur: 2.2 + rnd(i + 2400) * 2,
}));

/** Timeline (ms): 1 confetti + greeting · 2 name · 3 badge + gift · 4 next steps · 5 CTA */
const BEATS = [0, 650, 1000, 1650, 2250, 2800];

type Icon = ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
type NextStep = { icon: Icon; t: string; d: string; go: Route; open?: "vote" };

const focus = (on: boolean, y = 14) =>
  on ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y, filter: "blur(10px)" };

export function Celebrate() {
  const { user, reset, push, toast, openVote, freeVotes } = useNav();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const ids = BEATS.slice(1).map((ms, i) => setTimeout(() => setPhase((p) => Math.max(p, i + 1)), ms));
    return () => ids.forEach(clearTimeout);
  }, []);

  const first = user.name.trim().split(/\s+/)[0] || "friend";
  const color = ROLE_COLOR[user.role];

  const badge =
    user.role === "talent"
      ? { icon: Mic, t: `Talent${user.talent ? ` · ${user.talent}` : ""}` }
      : user.role === "fan"
        ? { icon: Heart, t: "Fan · Official voter" }
        : { icon: BadgeCheck, t: `Scout${user.company ? ` · ${user.company}` : ""}` };

  const steps: NextStep[] =
    user.role === "talent"
      ? [
          draft.recordNow
            ? { icon: Video, t: "Record your showcase", d: "60 seconds to sell yourself. Do it now.", go: { name: "record" } }
            : { icon: Video, t: "Record your showcase", d: "Whenever you're ready. We'll remind you.", go: { name: "record" } },
          draft.shows.includes("idea") && !draft.shows.includes("talent")
            ? { icon: Lightbulb, t: "Enter Ideas", d: "Pitches are open. Record yours for the panel.", go: { name: "hub", show: "idea" } }
            : { icon: Zap, t: "Enter Talent", d: "Showcases are open. The shortlist drops Friday.", go: { name: "hub", show: "talent" } },
          { icon: UserPen, t: "Complete your profile", d: "Photo, links and socials.", go: { name: "settings" } },
        ]
      : user.role === "fan"
        ? [
            { icon: Vote, t: "Cast your first free vote", d: `${CONTESTANTS[0].name} needs you tonight.`, go: { name: "main" }, open: "vote" },
            { icon: UserPlus, t: "Follow your favourites", d: "Find acts from your city.", go: { name: "search" } },
            { icon: Radio, t: "Watch the live final", d: "4 finalists. One screen stays on.", go: { name: "live" } },
          ]
        : [
            { icon: Bookmark, t: "Build your shortlist", d: "Save acts and pitches you like.", go: { name: "search" } },
            { icon: TrendingUp, t: "Browse trending talent", d: "Who the crowd is backing this week.", go: { name: "hub", show: "talent" } },
            { icon: Lightbulb, t: "Review pitches", d: "New founders pitching on Ideas.", go: { name: "hub", show: "idea" } },
          ];

  const enter = (s?: NextStep) => {
    reset({ name: "main" });
    if (s && s.go.name !== "main") push(s.go);
    if (s?.open === "vote") openVote(CONTESTANTS[0]);
    toast(s ? `You're in, ${first} 🎉` : `Welcome to Spotlight, ${first} 🎉 ${freeVotes} free votes waiting`);
  };

  // a tap during the choreography jumps to the end (and is swallowed, so it can't hit a card)
  const skip = (e: React.MouseEvent) => {
    if (phase >= 5) return;
    e.stopPropagation();
    setPhase(5);
  };
  const letters = Array.from(first);

  return (
    <div onClickCapture={skip} className="relative flex h-full flex-col overflow-hidden bg-ink">
      {/* ---------- light ---------- */}
      <div className="pointer-events-none absolute inset-0">
        {[
          { c: "#ff5a1f", cls: "-left-24 top-[6%] h-80 w-80", d: 11, x: 30, y: 40 },
          { c: "#ff2e7a", cls: "-right-28 top-[30%] h-72 w-72", d: 13, x: -30, y: -30 },
          { c: "#f2b53a", cls: "-bottom-24 left-[10%] h-80 w-80", d: 15, x: 40, y: -20 },
        ].map((o, i) => (
          <motion.div key={i} className={`absolute ${o.cls}`} initial={{ opacity: 0, scale: 0.6 }} animate={phase >= 1 ? { opacity: 0.32, scale: 1 } : {}} transition={{ duration: 1.6, delay: i * 0.12 }}>
            <motion.div
              className="h-full w-full rounded-full blur-[80px]"
              style={{ background: o.c }}
              animate={{ x: [0, o.x, 0], y: [0, o.y, 0] }}
              transition={{ duration: o.d, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        ))}
        {/* drifting sparks */}
        {SPARKS.map((s, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, boxShadow: "0 0 8px #fff" }}
            initial={{ opacity: 0 }}
            animate={phase >= 1 ? { opacity: [0, 0.8, 0], y: [0, -30] } : {}}
            transition={{ duration: s.dur, delay: s.delay, repeat: Infinity }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute left-1/2 top-[calc(var(--sb,12px)+95px)] h-0 w-0">
        {/* confetti bursts from the tile (outside the scroller, so it never adds scroll overflow) */}
        {CONFETTI.map((c, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute left-1/2 top-1/2"
            style={{ width: c.w, height: c.h, marginLeft: -c.w / 2, marginTop: -c.h / 2, background: c.color, borderRadius: c.round ? 99 : 2 }}
            initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
            animate={
              phase >= 1
                ? { opacity: [1, 1, 0], x: [0, c.dx, c.dx * 1.2], y: [0, c.dy, c.dy + c.fall], rotate: [0, c.rot / 2, c.rot] }
                : {}
            }
            transition={{ duration: c.dur, delay: c.delay, times: [0, 0.3, 1], ease: ["easeOut", "easeIn"] }}
          />
        ))}
      </div>

      <div className="no-bar relative flex flex-1 flex-col items-center overflow-y-auto overflow-x-hidden px-6 safe-top">
        {/* ---------- the mark ---------- */}
        <div className="relative mt-5 flex h-[150px] w-[150px] shrink-0 items-center justify-center">
          {/* bloom */}
          <motion.div
            className="absolute h-40 w-40 rounded-full"
            style={{ background: "radial-gradient(circle, #fff 0%, #ffb08a 25%, rgba(255,90,31,.5) 50%, transparent 70%)" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.6, 2.6], opacity: [0, 1, 0] }}
            transition={{ duration: 1.3, times: [0, 0.35, 1], ease: "easeOut" }}
          />
          {/* rays */}
          <motion.div
            className="absolute h-[300px] w-[300px] rounded-full opacity-0"
            style={{ background: "repeating-conic-gradient(from 0deg, rgba(255,140,90,.16) 0deg 6deg, transparent 6deg 22deg)", maskImage: "radial-gradient(circle, #000 20%, transparent 68%)" }}
            animate={{ opacity: phase >= 1 ? 1 : 0, rotate: 360 }}
            transition={{ opacity: { duration: 1 }, rotate: { duration: 40, repeat: Infinity, ease: "linear" } }}
          />
          <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}>
            <Pulse color={color} size={120} duration={2.8} />
          </motion.div>

          <motion.div
            className="relative"
            initial={{ y: 90, scale: 0.4, opacity: 0, filter: "blur(22px)" }}
            animate={{ y: 0, scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ type: "spring", stiffness: 140, damping: 16, delay: 0.1 }}
          >
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }} className="relative overflow-hidden rounded-[23px]">
              <LogoMark size={96} />
              <motion.span
                className="pointer-events-none absolute -bottom-1/3 -top-1/3 w-8 rotate-[18deg] bg-gradient-to-r from-transparent via-white/40 to-transparent blur-[3px]"
                initial={{ x: -80 }}
                animate={{ x: [-80, 140] }}
                transition={{ duration: 1.1, delay: 0.9, repeat: Infinity, repeatDelay: 3.5 }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* ---------- greeting ---------- */}
        <motion.div
          className="mt-3 font-display text-[12px] font-semibold uppercase tracking-[0.32em] text-white/55"
          initial={focus(false)}
          animate={focus(phase >= 1)}
          transition={{ duration: 0.6 }}
        >
          Welcome to 3<span className="text-talent">1</span>6
        </motion.div>
        <h1 className="mt-2 flex max-w-full flex-wrap justify-center font-display text-[44px] font-black leading-none tracking-tight" aria-label={first}>
          {letters.map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 26, scale: 1.4, filter: "blur(14px)" }}
              animate={phase >= 2 ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: i * 0.045 }}
            >
              {ch}
            </motion.span>
          ))}
          <motion.span className="text-talent" initial={{ opacity: 0, scale: 0 }} animate={phase >= 2 ? { opacity: 1, scale: 1 } : {}} transition={{ type: "spring", stiffness: 500, damping: 14, delay: letters.length * 0.045 + 0.1 }}>
            .
          </motion.span>
        </h1>

        {/* role badge */}
        <motion.div
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-wider"
          style={{ color, borderColor: `${color}66`, background: `${color}1a`, boxShadow: `0 0 24px -6px ${color}` }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={phase >= 3 ? { opacity: 1, scale: 1 } : {}}
          transition={{ type: "spring", stiffness: 420, damping: 18 }}
        >
          <badge.icon size={13} />
          {badge.t}
        </motion.div>

        {/* gift card */}
        <div className="mt-5 w-full shrink-0" style={{ perspective: 900 }}>
          <motion.div
            className="relative w-full overflow-hidden rounded-3xl p-[1.5px]"
            style={{ background: "linear-gradient(120deg, #f2b53a, #ff5a1f 45%, #ff2e7a)", transformOrigin: "50% 0%" }}
            initial={{ rotateX: -100, opacity: 0, y: 20 }}
            animate={phase >= 3 ? { rotateX: 0, opacity: 1, y: 0 } : {}}
            transition={{ type: "spring", stiffness: 160, damping: 17, delay: 0.15 }}
          >
            <div className="relative flex items-center gap-3 overflow-hidden rounded-[22.5px] bg-[#140b08] p-4">
              <span className="pointer-events-none absolute -left-8 -top-10 h-28 w-28 rounded-full bg-talent/35 blur-2xl" />
              <motion.span
                className="pointer-events-none absolute -bottom-1/2 -top-1/2 w-12 rotate-[18deg] bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: -100 }}
                animate={phase >= 3 ? { x: [-100, 420] } : {}}
                transition={{ duration: 1.2, delay: 0.6, repeat: Infinity, repeatDelay: 3 }}
              />
              <motion.div
                className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-idea to-talent shadow-[0_10px_24px_-8px_#ff5a1f]"
                animate={phase >= 3 ? { rotate: [0, -14, 12, -6, 0] } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Gift size={22} />
              </motion.div>
              <div className="relative min-w-0 flex-1 text-left">
                <div className="font-display text-[15px] font-bold leading-tight">{DAILY_FREE_VOTES} free votes, every day</div>
                <div className="mt-0.5 text-[12px] text-white/50">Refills at midnight. No card needed.</div>
              </div>
              {/* ticket stub */}
              <div className="relative flex flex-col items-center border-l border-dashed border-white/20 pl-3">
                <span className="font-display text-[26px] font-black leading-none text-idea">{DAILY_FREE_VOTES}</span>
                <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-white/40">today</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* next steps */}
        <div className="mt-5 w-full space-y-2 pb-4">
          <motion.div
            className="mb-1 text-left font-display text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 4 ? 1 : 0 }}
          >
            Start here
          </motion.div>
          {steps.map((s, i) => (
            <motion.button
              key={s.t}
              onClick={() => enter(s)}
              whileTap={{ scale: 0.97 }}
              className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left ${glass}`}
              initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
              animate={phase >= 4 ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
              transition={{ type: "spring", stiffness: 260, damping: 24, delay: i * 0.1 }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: `${color}22`, color }}>
                <s.icon size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-bold">
                  {s.t}
                  {i === 0 && <span className="ml-2 rounded-full px-1.5 py-0.5 align-middle text-[9px] font-bold uppercase tracking-wider" style={{ background: color, color: "#fff" }}>First</span>}
                </div>
                <div className="truncate text-[12px] text-white/45">{s.d}</div>
              </div>
              <ArrowRight size={16} className="text-white/35" />
            </motion.button>
          ))}
        </div>
      </div>

      <div className="safe-bottom relative px-6 pt-2">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={phase >= 5 ? { opacity: 1, y: 0 } : {}} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
          <Button color={color} onClick={() => enter()}>
            Enter Spotlight <ArrowRight size={18} />
          </Button>
        </motion.div>
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-[max(env(safe-area-inset-bottom),10px)] py-5 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30"
          animate={{ opacity: phase >= 5 ? 0 : [0.3, 0.7, 0.3] }}
          transition={phase >= 5 ? { duration: 0.2 } : { duration: 1.6, repeat: Infinity }}
        >
          Tap to skip
        </motion.div>
      </div>
    </div>
  );
}
