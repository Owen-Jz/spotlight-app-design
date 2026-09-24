"use client";

import { AnimatePresence, motion } from "motion/react";
import { Camera, Check, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { PEOPLE, TASK_ITEMS, type Contestant } from "@/lib/data";
import { useNav } from "../../nav";
import { Avatar, Button, Flag } from "../../ui";
import { LiveDot, SectionTitle } from "./live";

const TASK = "#4c7dff";
const SPOTS = 10;

/** Qualifiers without a photo get initials avatars (Avatar skips the image when slug is empty). */
const person = (id: string, name: string, country: string, hue: [string, string]): Contestant => ({
  id,
  name,
  country,
  hue,
  handle: "",
  flag: "",
  category: "Speed challenge",
  show: "task",
  caption: "",
  votes: 0,
  img: "",
  slug: "",
  posted: "",
});

type Q = { p: Contestant; time: string; me?: boolean };

const TASKERS = PEOPLE.filter((p) => p.show === "task");
const SEED: Q[] = [
  ...TASKERS.map((p, i) => ({ p, time: ["3:12", "3:40", "4:05", "4:31", "4:58"][i] ?? "5:10" })),
  { p: person("q1", "Ama Mensah", "Ghana", ["#4c7dff", "#22e58a"]), time: "5:21" },
  { p: person("q2", "Bayo Adeyemi", "Nigeria", ["#9b5cff", "#4c7dff"]), time: "5:44" },
].slice(0, 7);
/** Who grabs the next spots while you watch. */
const ARRIVALS: Q[] = [
  { p: person("q3", "Wanjiru Otieno", "Kenya", ["#00b3ff", "#4c7dff"]), time: "6:02" },
  { p: person("q4", "Moussa Ndiaye", "Senegal", ["#2e5bff", "#ff5a1f"]), time: "6:19" },
];

export type Race = { list: Q[]; taken: number; submitted: boolean; join: (me: Contestant) => number; fresh: string | null };

/**
 * The race for the 10 spots. Two more people qualify while you're on the page
 * (it stops at 9 so there's always a spot left for you in the demo).
 */
export function useTaskRace(active: boolean): Race {
  const [list, setList] = useState<Q[]>(SEED);
  const [submitted, setSubmitted] = useState(false);
  const [fresh, setFresh] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
    let n = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const next = (delay: number) => {
      timers.push(
        setTimeout(() => {
          const q = ARRIVALS[n++];
          if (!q) return;
          setList((l) => (l.length >= SPOTS - 1 || l.some((x) => x.p.id === q.p.id) ? l : [...l, q]));
          setFresh(q.p.id);
          timers.push(setTimeout(() => setFresh(null), 3200));
          next(9000 + Math.random() * 5000);
        }, delay),
      );
    };
    next(5500);
    return () => timers.forEach(clearTimeout);
  }, [active]);

  return {
    list,
    taken: Math.min(SPOTS, list.length),
    submitted,
    fresh,
    join: (me) => {
      const pos = Math.min(SPOTS, list.length + 1);
      setList((l) => [...l, { p: me, time: "just now", me: true }]);
      setSubmitted(true);
      setFresh(me.id);
      return pos;
    },
  };
}

export function TaskHub({ race }: { race: Race }) {
  const { toast, addAlert, user } = useNav();
  const [done, setDone] = useState<number[]>([]);
  const [flash, setFlash] = useState<number | null>(null);
  const { list, taken, submitted, fresh } = race;
  const newest = fresh ? list.find((q) => q.p.id === fresh) : null;

  const snap = (i: number) => {
    if (done.includes(i)) {
      setDone((d) => d.filter((x) => x !== i));
      return;
    }
    setFlash(i);
    setTimeout(() => setFlash(null), 260);
    setDone((d) => [...d, i]);
  };

  return (
    <>
      {/* the race */}
      <div className="relative mt-5 overflow-hidden rounded-3xl border border-task/30 bg-task/10 p-5">
        <span className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-task/30 blur-3xl" />
        <div className="relative flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-task">
              <LiveDot color={TASK} size={5} /> Spots taken
            </div>
            <div className="font-display text-[52px] font-black leading-none">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={taken}
                  initial={{ y: -30, opacity: 0, filter: "blur(6px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: 30, opacity: 0 }}
                  className="inline-block"
                >
                  {taken}
                </motion.span>
              </AnimatePresence>
              <span className="text-white/25">/{SPOTS}</span>
            </div>
          </div>
          <div className="pb-1 text-right text-[12px] leading-snug text-white/55">
            First {SPOTS} to snap
            <br />
            all {TASK_ITEMS.length} items get in
          </div>
        </div>

        {/* ten seats */}
        <div className="relative mt-5 grid grid-cols-5 gap-2.5">
          {Array.from({ length: SPOTS }).map((_, i) => {
            const q = list[i];
            return (
              <div key={i} className="relative flex aspect-square items-center justify-center">
                <AnimatePresence>
                  {q ? (
                    <motion.span
                      key={q.p.id}
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 380, damping: 16, delay: i < 7 ? 0.2 + i * 0.05 : 0 }}
                      className="absolute rounded-full"
                      style={{ boxShadow: `0 0 0 2px ${q.me ? "#f2b53a" : TASK}` }}
                    >
                      <Avatar c={q.p} size={44} />
                      {fresh === q.p.id && (
                        <motion.span
                          className="absolute inset-0 rounded-full"
                          style={{ border: `2px solid ${q.me ? "#f2b53a" : TASK}` }}
                          initial={{ scale: 1, opacity: 0.9 }}
                          animate={{ scale: 1.8, opacity: 0 }}
                          transition={{ duration: 0.9, repeat: 2 }}
                        />
                      )}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="empty"
                      className="absolute flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-white/20 font-display text-[11px] font-bold text-white/30"
                      animate={{ borderColor: ["rgba(255,255,255,.15)", "rgba(76,125,255,.6)", "rgba(255,255,255,.15)"] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.15 }}
                      exit={{ scale: 0 }}
                    >
                      {i + 1}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="relative mt-4 h-5">
          <AnimatePresence mode="wait">
            {newest ? (
              <motion.div
                key={newest.p.id}
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-1.5 text-[12px] font-semibold"
              >
                <Zap size={13} className="text-idea" fill="currentColor" />
                {newest.me ? "You" : newest.p.name.split(" ")[0]} just took spot #{list.indexOf(newest) + 1}
                <span className="text-white/40">· {newest.time}</span>
              </motion.div>
            ) : (
              <motion.div key="left" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[12px] font-semibold text-white/55">
                {SPOTS - taken} {SPOTS - taken === 1 ? "spot" : "spots"} left · people are snapping right now
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* checklist */}
      <SectionTitle
        right={
          <span className="font-display text-[12px] font-bold" style={{ color: done.length === TASK_ITEMS.length ? TASK : "rgba(255,255,255,.4)" }}>
            {done.length}/{TASK_ITEMS.length}
          </span>
        }
      >
        Snap all {TASK_ITEMS.length} to qualify
      </SectionTitle>
      <div className="mb-3 h-1 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${TASK}, #9b5cff)` }}
          animate={{ width: `${(done.length / TASK_ITEMS.length) * 100}%` }}
          transition={{ type: "spring", stiffness: 140, damping: 20 }}
        />
      </div>
      <div className="space-y-2">
        {TASK_ITEMS.map((t, i) => {
          const on = done.includes(i);
          return (
            <motion.button
              key={t}
              whileTap={{ scale: 0.97 }}
              disabled={submitted}
              onClick={() => snap(i)}
              className="relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border p-3.5 text-left transition-colors"
              style={{ background: on ? "#4c7dff1f" : "rgba(255,255,255,.03)", borderColor: on ? "#4c7dff55" : "rgba(255,255,255,.05)" }}
            >
              {/* shutter flash */}
              <AnimatePresence>
                {flash === i && (
                  <motion.span
                    className="pointer-events-none absolute inset-0 bg-white"
                    initial={{ opacity: 0.85 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  />
                )}
              </AnimatePresence>
              <div className={`relative flex h-10 w-10 items-center justify-center rounded-xl ${on ? "bg-task" : "bg-white/10"}`}>
                <AnimatePresence mode="wait" initial={false}>
                  {on ? (
                    <motion.span key="c" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 500, damping: 18 }}>
                      <Check size={18} strokeWidth={3} />
                    </motion.span>
                  ) : (
                    <motion.span key="cam" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Camera size={17} className="text-white/60" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <span className={`relative flex-1 text-[14px] font-semibold ${on ? "" : "text-white/80"}`}>{t}</span>
              <span className={`relative text-[11px] font-bold ${on ? "text-task" : "text-white/30"}`}>{on ? "Snapped" : "Tap to snap"}</span>
            </motion.button>
          );
        })}
      </div>
      <div className="mt-5">
        <Button
          color={TASK}
          disabled={done.length < TASK_ITEMS.length || submitted}
          onClick={() => {
            const me = person("me", user.name || "You", user.country || "Nigeria", ["#f2b53a", "#ff5a1f"]);
            const pos = race.join(me);
            toast(`You're #${pos}! You made the Final ${SPOTS} ⚡`);
            addAlert({ kind: "result", title: `You made the Final ${SPOTS}`, body: "The Task goes live Sunday, 6:00 PM WAT. Be ready.", go: { name: "hub", show: "task" } });
          }}
        >
          {submitted ? "You're in · Task on Sun 6:00 PM" : `Submit ${done.length}/${TASK_ITEMS.length}`}
        </Button>
      </div>

      {/* qualified */}
      <SectionTitle>Already in</SectionTitle>
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {list.map((q, i) => (
            <motion.div
              key={q.p.id}
              layout
              initial={{ opacity: 0, x: -20, filter: "blur(6px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              className="flex items-center gap-3 rounded-2xl border p-3"
              style={{
                background: q.me ? "#f2b53a14" : fresh === q.p.id ? "#4c7dff14" : "rgba(255,255,255,.03)",
                borderColor: q.me ? "#f2b53a55" : fresh === q.p.id ? "#4c7dff55" : "transparent",
              }}
            >
              <span className="w-5 text-center font-display text-sm font-bold text-white/40">{i + 1}</span>
              <Avatar c={q.p} size={38} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-bold">{q.me ? `${q.p.name} (you)` : q.p.name}</div>
                <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                  <Flag country={q.p.country} size={10} />
                  {q.p.country}
                </div>
              </div>
              <span className="font-display text-[12px] font-bold tabular-nums text-white/60">{q.time}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
