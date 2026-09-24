"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowRight, Bell, BellRing, Eye, Phone, Play } from "lucide-react";
import { useEffect, useState, type PointerEvent } from "react";
import { CALL_STAGES, CONTESTANTS, FINALISTS, HOST, PEOPLE, SHOWS, type Contestant, type ShowKey } from "@/lib/data";
import { useNav, type Route } from "../../nav";
import { Avatar, Flag, Media, rise } from "../../ui";
import { AvatarStack, LIVE_VIEWERS, LiveDot, Roll, SHOW_LIVE, SectionTitle, clock, num, useCountdown, useDrift, useTicker } from "../hub/live";
import { Page, SHOW_ICON } from "./common";

/* ---------------- Shows ---------------- */

export function Shows() {
  return (
    <Page title="Shows">
      <motion.p variants={rise} className="mb-4 text-[14px] text-white/50">
        Three shows. One winner each. <span className="text-white/80">You decide.</span>
      </motion.p>
      <Stories />
      <LiveNow />
      <ComingUp />
      <motion.div variants={rise}>
        <SectionTitle>The shows</SectionTitle>
      </motion.div>
      <div className="space-y-4">
        {(Object.keys(SHOWS) as ShowKey[]).map((k) => (
          <ShowCard key={k} k={k} />
        ))}
      </div>
    </Page>
  );
}

/* ---------------- stories: who's on stage ---------------- */

const LIVE_IDS = new Set(FINALISTS.map((f) => f.id));

function Stories() {
  const { push } = useNav();
  // finalists (live) first, then everyone else
  const people = [...CONTESTANTS].sort((a, b) => Number(LIVE_IDS.has(b.id)) - Number(LIVE_IDS.has(a.id)));
  return (
    <motion.div variants={rise} className="no-bar -mx-5 mb-2 flex gap-3 overflow-x-auto px-5 pb-2 pt-1">
      {people.map((c, i) => {
        const live = LIVE_IDS.has(c.id);
        const color = SHOWS[c.show].color;
        return (
          <motion.button
            key={c.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => push({ name: "profile", id: c.id })}
            aria-label={`${c.name}${live ? ", live now" : ""}`}
            className="flex w-[66px] shrink-0 flex-col items-center gap-1.5"
          >
            <span className="relative flex h-[66px] w-[66px] items-center justify-center">
              {live && <span className="absolute inset-[-4px] rounded-full blur-md" style={{ background: `${color}55` }} />}
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{
                  background: live
                    ? `conic-gradient(from 0deg, ${color}, ${c.hue[1]}, #f2b53a, ${color})`
                    : `conic-gradient(from 0deg, ${color}aa, transparent 40%, ${c.hue[0]}aa, transparent 85%, ${color}aa)`,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: live ? 3 + (i % 2) : 9 + (i % 3), repeat: Infinity, ease: "linear" }}
              />
              <span className="absolute inset-[2.5px] rounded-full bg-ink" />
              <span className="relative">
                <Avatar c={c} size={56} />
              </span>
              <span className="absolute bottom-0 right-0">
                <Flag country={c.country} size={10} className="!shadow-none" />
              </span>
              {live && (
                <span className="absolute -bottom-1.5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-md bg-call px-1.5 py-[1px] text-[8px] font-extrabold tracking-wider ring-2 ring-ink">
                  LIVE
                </span>
              )}
            </span>
            <span className={`w-full truncate text-center text-[11px] font-semibold ${live ? "text-white" : "text-white/60"}`}>{c.name.split(" ")[0]}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}

/* ---------------- hero: the grand final is live ---------------- */

function LiveNow() {
  const { push } = useNav();
  const viewers = useDrift(LIVE_VIEWERS, 60, 1500);
  // which split-screen tile is "on air"
  const [on, setOn] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setOn((v) => (v + 1) % FINALISTS.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.button
      variants={rise}
      whileTap={{ scale: 0.975 }}
      onClick={() => push({ name: "live" })}
      className="relative mt-3 block h-[176px] w-full overflow-hidden rounded-[28px] text-left shadow-[0_30px_60px_-30px_rgba(255,90,31,.55)]"
      aria-label="Watch The Call Grand Final, live now"
    >
      <Media hue={["#ff5a1f", "#2a0a02"]} video="host" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
      <div className="absolute inset-0 rounded-[28px] ring-1 ring-inset ring-call/40" />
      {/* sweeping glare */}
      <motion.div
        className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ x: ["-120%", "420%"] }}
        transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 2.6, ease: "easeInOut" }}
      />

      <div className="absolute inset-y-0 left-0 flex w-[62%] flex-col justify-between p-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-md bg-call px-2 py-1 text-[10px] font-extrabold tracking-[0.14em] shadow-[0_0_18px_rgba(255,90,31,.7)]">
            <LiveDot color="#fff" size={5} /> LIVE NOW
          </span>
          <span className="flex items-center gap-1 rounded-md bg-black/45 px-2 py-1 text-[11px] font-bold backdrop-blur-md">
            <Eye size={12} className="text-white/70" />
            <Roll text={num(viewers)} />
          </span>
        </div>
        <div>
          <div className="font-display text-[10px] font-semibold uppercase tracking-[0.24em] text-call">The Call</div>
          <div className="mt-1 font-display text-[22px] font-black uppercase leading-[0.95] tracking-tight">
            Grand
            <br />
            Final
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            <Avatar c={HOST} size={22} ring="#ff5a1f" />
            <span className="text-[11px] font-semibold text-white/75">with {HOST.name}</span>
          </div>
        </div>
      </div>

      {/* split screen preview */}
      <div className="absolute bottom-4 right-4 top-4 grid w-[34%] grid-cols-2 gap-1.5">
        {FINALISTS.map((c, i) => (
          <motion.div
            key={c.id}
            className="relative overflow-hidden rounded-xl bg-white/5"
            animate={{
              boxShadow: on === i ? "0 0 0 2px #ff5a1f, 0 0 20px rgba(255,90,31,.6)" : "0 0 0 1px rgba(255,255,255,.12), 0 0 0 rgba(0,0,0,0)",
              opacity: on === i ? 1 : 0.62,
            }}
            transition={{ duration: 0.4 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/media/v/${c.slug}.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <span className="absolute bottom-0.5 left-1 text-[8px] font-bold drop-shadow">{c.name.split(" ")[0]}</span>
          </motion.div>
        ))}
        <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-[0_8px_24px_rgba(0,0,0,.6)]">
          <Play size={15} fill="currentColor" className="ml-0.5" />
        </span>
      </div>
    </motion.button>
  );
}

/* ---------------- schedule strip ---------------- */

type Slot = { id: string; show: ShowKey; title: string; when?: string; countdown?: number; go: Route; call?: boolean };

const SCHEDULE: Slot[] = [
  { id: "vote2", show: "call", title: "Vote 2 closes", countdown: SHOW_LIVE.call.seconds, go: { name: "hub", show: "call" } },
  { id: "surprise", show: "call", title: "Surprise call window", when: "Tonight · any minute", go: { name: "incoming" }, call: true },
  { id: "tasklive", show: "task", title: "The Task goes live", when: "Sun · 6:00 PM WAT", go: { name: "hub", show: "task" } },
  { id: "pitch", show: "idea", title: "Pitch calls begin", when: "Fri · 10:00 AM WAT", go: { name: "hub", show: "idea" } },
];

function ComingUp() {
  return (
    <motion.div variants={rise}>
      <SectionTitle>Coming up</SectionTitle>
      <div className="no-bar -mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1">
        {SCHEDULE.map((s) => (
          <ScheduleCard key={s.id} s={s} />
        ))}
      </div>
    </motion.div>
  );
}

function ScheduleCard({ s }: { s: Slot }) {
  const { push, toast } = useNav();
  const [remind, setRemind] = useState(false);
  const left = useCountdown(s.countdown ?? 1);
  const color = SHOWS[s.show].color;
  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      onClick={() => push(s.go)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && push(s.go)}
      className="relative flex w-[172px] shrink-0 cursor-pointer flex-col gap-2 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3.5"
    >
      <span className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full blur-2xl" style={{ background: `${color}40` }} />
      <div className="flex items-center justify-between">
        <span className="font-display text-[9px] font-semibold uppercase tracking-[0.18em]" style={{ color }}>
          {SHOWS[s.show].name}
        </span>
        <motion.button
          whileTap={{ scale: 0.8 }}
          aria-label={remind ? "Reminder on" : "Remind me"}
          onClick={(e) => {
            e.stopPropagation();
            setRemind((r) => !r);
            if (!remind) toast(`We'll remind you · ${s.title}`);
          }}
          className="flex h-7 w-7 items-center justify-center rounded-full"
          style={{ background: remind ? color : "rgba(255,255,255,.07)", color: remind ? "#040404" : "rgba(255,255,255,.6)" }}
        >
          {remind ? (
            <motion.span initial={{ rotate: -25 }} animate={{ rotate: [25, -18, 10, 0] }} transition={{ duration: 0.5 }}>
              <BellRing size={13} />
            </motion.span>
          ) : (
            <Bell size={13} />
          )}
        </motion.button>
      </div>
      <div className="text-[13px] font-bold leading-tight">{s.title}</div>
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/55">
        {s.call ? (
          <motion.span animate={{ rotate: [0, -14, 14, -10, 0] }} transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.8 }} style={{ color }}>
            <Phone size={11} />
          </motion.span>
        ) : s.countdown ? (
          <LiveDot color={color} size={5} />
        ) : null}
        {s.countdown ? <Roll text={clock(left)} className="font-bold text-white" /> : s.when}
      </div>
    </motion.div>
  );
}

/* ---------------- show cards: tilt, parallax, live numbers ---------------- */

const CARD: Record<ShowKey, { stat: string; start: number; stages: number; at: number; people: Contestant[]; extra: number }> = {
  call: { stat: "watching", start: LIVE_VIEWERS, stages: CALL_STAGES.length, at: CALL_STAGES.length - 1, people: FINALISTS, extra: 0 },
  task: { stat: "attempts", start: 2318, stages: 4, at: 0, people: PEOPLE.filter((p) => p.show === "task"), extra: 2 },
  idea: { stat: "pitches booked", start: 1204, stages: 7, at: 0, people: PEOPLE.filter((p) => p.show === "idea"), extra: 1201 },
};

function ShowCard({ k }: { k: ShowKey }) {
  const { push } = useNav();
  const s = SHOWS[k];
  const meta = CARD[k];
  const Icon = SHOW_ICON[k];
  const drift = useDrift(meta.start, 60, 1500);
  const ticker = useTicker(meta.start, { min: 0, max: 3, every: k === "task" ? 2200 : 3000 });
  const live = k === "call" ? drift : ticker;
  const left = useCountdown(SHOW_LIVE[k].seconds);

  // tilt toward the finger, background slides the other way
  const spring = { stiffness: 240, damping: 20, mass: 0.6 };
  const rx = useSpring(0, spring);
  const ry = useSpring(0, spring);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const glow = useSpring(0, spring);
  const bgX = useTransform(ry, (v) => v * -1.8);
  const bgY = useTransform(rx, (v) => v * 1.8);
  const fgX = useTransform(ry, (v) => v * 0.5);
  const sheen = useMotionTemplate`radial-gradient(circle at ${mx}% ${my}%, rgba(255,255,255,.22), transparent 55%)`;

  const aim = (e: PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 12);
    rx.set(-(py - 0.5) * 12);
    mx.set(px * 100);
    my.set(py * 100);
    glow.set(1);
  };
  const rest = () => {
    rx.set(0);
    ry.set(0);
    glow.set(0);
  };

  return (
    <motion.button
      variants={rise}
      whileTap={{ scale: 0.975 }}
      onPointerDown={aim}
      onPointerMove={(e) => e.buttons && aim(e)}
      onPointerUp={rest}
      onPointerLeave={rest}
      onPointerCancel={rest}
      onClick={() => push({ name: "hub", show: k })}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className="relative block h-[268px] w-full overflow-hidden rounded-[30px] text-left"
    >
      <motion.div className="absolute -inset-5" style={{ x: bgX, y: bgY }}>
        <Media hue={[s.color, "#15152a"]} video={`show-${k}`} />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />
      <motion.div className="pointer-events-none absolute inset-0 mix-blend-overlay" style={{ background: sheen, opacity: glow }} />
      <div className="absolute inset-0 rounded-[30px] ring-1 ring-inset ring-white/10" />
      <div className="pointer-events-none absolute inset-0 rounded-[30px]" style={{ boxShadow: `inset 0 -60px 80px -60px ${s.color}88` }} />

      <motion.div className="absolute inset-0 flex flex-col justify-between p-5" style={{ x: fgX }}>
        <div className="flex items-start justify-between gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[11px] font-bold backdrop-blur-xl">
            {k === "call" ? <LiveDot color={s.color} /> : <Icon size={12} style={{ color: s.color }} />}
            {s.stage}
          </span>
          <span className="flex flex-col items-end rounded-2xl border border-white/10 bg-black/40 px-2.5 py-1.5 backdrop-blur-xl">
            <span className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-white/50">{SHOW_LIVE[k].until.replace(" in", "")}</span>
            <Roll text={clock(left)} className="font-display text-[12px] font-bold" />
          </span>
        </div>

        <div>
          <div className="font-display text-[34px] font-black uppercase leading-none tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,.6)]">{s.name}</div>
          <div className="mt-1.5 line-clamp-1 text-[13px] text-white/75">{s.tagline}</div>
          <div className="mt-3.5 flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-black/35 p-2 pl-2.5 backdrop-blur-xl">
            <span className="flex min-w-0 items-center gap-2">
              <AvatarStack people={meta.people.slice(0, 3)} size={24} extra={meta.extra || undefined} ring="#101014" />
              <span className="min-w-0 truncate text-[11px] font-semibold text-white/60">
                <Roll text={num(live)} className="font-bold text-white" /> {meta.stat}
              </span>
            </span>
            <span
              className="flex shrink-0 items-center gap-1 rounded-xl px-3 py-2 text-[12px] font-extrabold text-ink"
              style={{ background: s.color, boxShadow: `0 6px 18px -6px ${s.color}` }}
            >
              {SHOW_LIVE[k].cta}
              <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                <ArrowRight size={13} strokeWidth={3} />
              </motion.span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* stage progress along the bottom edge */}
      <div className="absolute inset-x-5 bottom-[7px] flex gap-1">
        {Array.from({ length: meta.stages }).map((_, i) => (
          <motion.span
            key={i}
            className="h-[3px] flex-1 origin-left rounded-full"
            style={{ background: i <= meta.at ? s.color : "rgba(255,255,255,.15)" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1, opacity: i === meta.at ? [1, 0.35, 1] : 1 }}
            transition={{ scaleX: { delay: 0.4 + i * 0.06 }, opacity: { duration: 1.4, repeat: Infinity } }}
          />
        ))}
      </div>
    </motion.button>
  );
}
