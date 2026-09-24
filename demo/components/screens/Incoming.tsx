"use client";

import { AnimatePresence, motion } from "motion/react";
import { Phone, PhoneOff } from "lucide-react";
import { useEffect, useState } from "react";
import { LogoMark } from "../brand/Logo";
import { useNav } from "../nav";
import { Pulse } from "../ui";

const TASK = "Make us laugh, cry or dance using only the word “Lagos”.";

/** The signature moment: Spotlight literally calls the contestant with their task. */
export function Incoming() {
  const { pop, replace, toast } = useNav();
  const [phase, setPhase] = useState<"ring" | "task">("ring");
  const [count, setCount] = useState(5);
  const [shown, setShown] = useState(0);

  // buzz like a real call while it rings (Android; iOS ignores it)
  useEffect(() => {
    if (phase !== "ring" || typeof navigator === "undefined" || !navigator.vibrate) return;
    const buzz = () => navigator.vibrate?.([400, 200, 400]);
    buzz();
    const t = setInterval(buzz, 2200);
    return () => {
      clearInterval(t);
      navigator.vibrate?.(0);
    };
  }, [phase]);

  // type the task out once answered
  useEffect(() => {
    if (phase !== "task") return;
    if (shown < TASK.length) {
      const t = setTimeout(() => setShown((n) => n + 1), 32);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => (count > 1 ? setCount((c) => c - 1) : replace({ name: "record", task: TASK })), 1000);
    return () => clearTimeout(t);
  }, [phase, shown, count, replace]);

  return (
    <div className="relative flex h-full flex-col items-center overflow-hidden bg-[#0a0508]">
      <motion.div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 35%, #ff5a1f55, transparent 60%)" }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <AnimatePresence mode="wait">
        {phase === "ring" ? (
          <motion.div key="ring" exit={{ opacity: 0, scale: 0.95 }} className="relative flex h-full w-full flex-col items-center">
            <div className="safe-top mt-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[13px] font-semibold uppercase tracking-[0.3em] text-white/50"
              >
                Incoming call
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-3 font-display text-[40px] font-black tracking-tight"
              >
                Spotlight
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-2 text-[15px] text-white/60">
                The Call · Round 1
              </motion.div>
            </div>

            <div className="relative mt-12 flex h-56 w-56 shrink-0 items-center justify-center">
              <Pulse size={140} />
              <motion.div
                animate={{ rotate: [0, -12, 12, -10, 10, -6, 6, 0, 0, 0] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              >
                <LogoMark size={116} />
              </motion.div>
            </div>

            <p className="mt-8 max-w-[260px] text-center text-[14px] text-white/60">
              You were chosen. Answer to get your task. The clock starts the moment you pick up.
            </p>

            <div className="safe-bottom mt-auto flex w-full justify-around px-10 pb-10 pt-6">
              <div className="flex flex-col items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    pop();
                    toast("Missed call. You have one more chance.");
                  }}
                  className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#e5484d]"
                  aria-label="Decline"
                >
                  <PhoneOff size={30} />
                </motion.button>
                <span className="text-[13px] font-semibold text-white/70">Decline</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  onClick={() => setPhase("task")}
                  className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#30a46c] shadow-[0_0_40px_#30a46c88]"
                  aria-label="Accept"
                >
                  <Phone size={30} fill="white" strokeWidth={0} />
                </motion.button>
                <span className="text-[13px] font-semibold text-white/70">Accept</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="task"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            className="safe-bottom relative flex h-full w-full flex-col justify-center px-8"
          >
            <div className="safe-top-pos absolute inset-x-8 flex items-center justify-center gap-2 pt-2 text-[12px] font-semibold text-white/50">
              <span className="h-1.5 w-1.5 rounded-full bg-[#30a46c] shadow-[0_0_8px_#30a46c]" /> On the call with Spotlight
            </div>
            <div className="font-display text-[12px] font-semibold uppercase tracking-[0.3em] text-call">Your task</div>
            <div className="mt-4 min-h-[150px] font-display text-[28px] font-extrabold leading-tight">
              {TASK.slice(0, shown)}
              <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className="text-call">
                |
              </motion.span>
            </div>
            <div className="mt-6 flex items-center gap-3 text-[14px] text-white/60">
              <span className="rounded-full bg-white/10 px-3 py-1 font-bold text-white">1 minute</span>
              Camera opens in
              <motion.span
                key={count}
                initial={{ scale: 1.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-display text-2xl font-black text-call"
              >
                {shown < TASK.length ? "…" : count}
              </motion.span>
            </div>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: shown >= TASK.length ? 1 : 0, y: shown >= TASK.length ? 0 : 10 }}
              whileTap={{ scale: 0.96 }}
              disabled={shown < TASK.length}
              onClick={() => replace({ name: "record", task: TASK })}
              className="absolute inset-x-8 bottom-10 rounded-2xl bg-call py-4 text-[15px] font-extrabold shadow-[0_12px_30px_-12px_#ff5a1f]"
            >
              I&apos;m ready, open the camera
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
