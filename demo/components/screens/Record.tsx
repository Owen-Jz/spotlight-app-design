"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Play, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { TALENT_CATEGORIES } from "@/lib/data";
import { useNav } from "../nav";
import { Button, Media } from "../ui";

// a showcase is 1 minute; a Round 2 performance (with a brief) is 2
const SHOWCASE_LIMIT = 60;
const ROUND2_LIMIT = 120;
const R = 44;
const CIRC = 2 * Math.PI * R;

// prompts that rotate while you record, like a coach behind the camera
const TIPS = ["Look into the lens", "Say your name and where you're from", "Show us the thing only you can do", "Big finish. Make them vote."];

/** Fake camera: the 60-second "sell yourself" showcase, or a 2-minute Round 2 performance to a brief. */
export function Record({ brief }: { brief?: string }) {
  const LIMIT = brief ? ROUND2_LIMIT : SHOWCASE_LIMIT;
  const { pop, replace, toast, addEntry, entries } = useNav();
  const [cat, setCat] = useState("Music");
  const [phase, setPhase] = useState<"ready" | "count" | "rec" | "review" | "done">("ready");
  const [sec, setSec] = useState(0);
  const [count, setCount] = useState(3);

  // 3-2-1 before the camera rolls
  useEffect(() => {
    if (phase !== "count") return;
    const t = setTimeout(() => (count > 1 ? setCount((c) => c - 1) : setPhase("rec")), 700);
    return () => clearTimeout(t);
  }, [phase, count]);

  useEffect(() => {
    if (phase !== "rec") return;
    // recording always starts from 0 (retake resets it)
    const tick = setInterval(() => setSec((s) => Math.min(s + 1, LIMIT)), 1000);
    const stop = setTimeout(() => setPhase("review"), LIMIT * 1000);
    return () => {
      clearInterval(tick);
      clearTimeout(stop);
    };
  }, [phase, LIMIT]);

  const left = LIMIT - sec;

  return (
    <div className="relative h-full bg-black">
      <Media hue={["#3a2a4a", "#10202a"]} img="stage-dark">
        {/* viewfinder corners */}
        <div className="absolute inset-x-8 bottom-44 top-[calc(var(--sb,12px)+104px)]">
          {["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map(
            (c) => (
              <span key={c} className={`absolute h-8 w-8 rounded-sm border-white/40 ${c}`} />
            ),
          )}
        </div>
      </Media>

      {/* top */}
      <div className="safe-top absolute inset-x-0 top-0 z-10 px-4">
        <div className="flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={pop}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-xl"
            aria-label="Close"
          >
            <X size={20} />
          </motion.button>
          <AnimatePresence>
            {phase === "rec" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 font-display text-sm font-bold backdrop-blur-md"
              >
                <motion.span className="h-2 w-2 rounded-full bg-red-500" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="w-10" />
        </div>

        {brief ? (
          <div className="mt-4 rounded-2xl border border-talent/40 bg-talent/15 p-3 backdrop-blur-md">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-talent">Round 2 brief · 2-minute performance</div>
            <div className="mt-1 text-[14px] font-bold">{brief}</div>
          </div>
        ) : (
          phase === "ready" && (
            <div className="no-bar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
              {TALENT_CATEGORIES.map((c) => (
                <motion.button
                  key={c}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setCat(c)}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-bold backdrop-blur-md transition-colors ${
                    cat === c ? "border-white bg-white text-ink" : "border-white/15 bg-black/40 text-white/80"
                  }`}
                >
                  {c}
                </motion.button>
              ))}
            </div>
          )
        )}
      </div>

      {/* countdown */}
      <AnimatePresence>
        {phase === "count" && (
          <motion.div
            key={count}
            initial={{ opacity: 0, scale: 2.2, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center font-display text-[120px] font-black text-white drop-shadow-[0_0_40px_rgba(255,90,31,.7)]"
          >
            {count}
          </motion.div>
        )}
      </AnimatePresence>

      {/* coaching tips while recording */}
      <AnimatePresence mode="wait">
        {phase === "rec" && !brief && (
          <motion.div
            key={Math.min(TIPS.length - 1, Math.floor(sec / 15))}
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10 }}
            className="pointer-events-none absolute inset-x-8 bottom-52 z-10 text-center"
          >
            <span className="rounded-full border border-white/10 bg-black/45 px-3.5 py-2 text-[13px] font-semibold backdrop-blur-xl">
              {TIPS[Math.min(TIPS.length - 1, Math.floor(sec / 15))]}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* centre prompt */}
      <AnimatePresence>
        {phase === "ready" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-x-8 top-[40%] text-center"
          >
            <div className="font-display text-[26px] font-extrabold leading-tight">
              {brief ? "Your Round 2" : "Sell yourself in"}
              <br />
              <span className="text-talent">{brief ? "performance." : "one minute."}</span>
            </div>
            <p className="mt-3 text-[13px] text-white/60">
              {brief ? "Two minutes, one take. Give the crowd a reason to keep you in." : "Who are you, and why should Africa vote for you?"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* bottom controls */}
      <div className="safe-bottom absolute inset-x-0 bottom-0 z-10 px-6 pb-4">
        <AnimatePresence mode="wait">
          {(phase === "ready" || phase === "count" || phase === "rec") && (
            <motion.div key="rec" exit={{ opacity: 0, y: 20 }} className="flex flex-col items-center gap-3">
              <button
                onClick={() => {
                  if (phase === "ready") {
                    setCount(3);
                    setPhase("count");
                  } else if (phase === "rec") setPhase("review");
                }}
                className="relative flex h-24 w-24 items-center justify-center"
                aria-label={phase === "ready" ? "Start recording" : "Stop recording"}
              >
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="5" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r={R}
                    fill="none"
                    stroke="#ff5a1f"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={CIRC}
                    animate={{ strokeDashoffset: CIRC * (1 - sec / LIMIT) }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </svg>
                <motion.span
                  className="bg-red-500"
                  animate={phase === "rec" ? { width: 30, height: 30, borderRadius: 8 } : { width: 66, height: 66, borderRadius: 40 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                />
              </button>
              <span className="text-[12px] font-bold text-white/60">
                {phase === "ready" ? `${brief ? "Round 2" : cat} · tap to record` : phase === "count" ? "Get ready…" : "Tap to stop"}
              </span>
            </motion.div>
          )}

          {phase === "review" && (
            <motion.div key="review" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="text-center text-[13px] font-semibold text-white/70">
                {sec}s clip recorded · {brief ? "Round 2 performance" : cat}
              </div>
              <Button
                onClick={() => {
                  addEntry({ show: "talent", title: brief ? "Round 2 performance" : "Showcase", category: brief ? "Round 2" : cat });
                  setPhase("done");
                }}
              >
                Submit entry
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setSec(0);
                  setPhase("ready");
                }}
              >
                <RotateCcw size={16} /> Retake
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* success */}
      <AnimatePresence>
        {phase === "done" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-ink/95 px-8 text-center backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
              className="flex h-24 w-24 items-center justify-center rounded-full bg-talent shadow-[0_0_80px_#ff5a1f]"
            >
              <Check size={46} strokeWidth={3} />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-8 font-display text-[26px] font-extrabold"
            >
              You&apos;re in the running.
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-3 text-[14px] text-white/60">
              {brief
                ? "Vote 2 opens when every act has posted. Share your performance to get votes."
                : "The organisers pick a selected few for the shortlist. If it's you, you'll get a notification and voting opens."}
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-10 w-full">
              <div className="space-y-2.5">
                <Button
                  variant="white"
                  onClick={() => {
                    pop();
                    toast("Entry submitted 🎬 · see it in Me");
                  }}
                >
                  Done
                </Button>
                {entries[0] && (
                  <Button variant="ghost" onClick={() => replace({ name: "entry", id: entries[0].id })}>
                    <Play size={15} fill="white" /> Watch your entry
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
