"use client";

import { motion } from "motion/react";
import { Check, Crown, Phone, Radio, Vote } from "lucide-react";
import { useEffect, useState } from "react";
import { CALL_STAGES, FINALISTS, fmt } from "@/lib/data";
import { useNav } from "../../nav";
import { Button, Flag, Media } from "../../ui";
import { LiveDot, Roll, SectionTitle } from "./live";

const CALL = "#ff5a1f";
/** The grand final is the stage we're on. */
const NOW = CALL_STAGES.length - 1;

/** Live vote shares that swing a little every couple of seconds. */
function useShares() {
  const [w, setW] = useState(() => FINALISTS.map((c) => c.votes));
  useEffect(() => {
    const t = setInterval(() => setW((v) => v.map((x) => x + Math.round(Math.random() * 260))), 2000);
    return () => clearInterval(t);
  }, []);
  const total = w.reduce((a, b) => a + b, 0);
  return w.map((x) => (x / total) * 100);
}

export function CallHub() {
  const { push } = useNav();
  return (
    <>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button onClick={() => push({ name: "live" })}>
          <LiveDot color="#fff" /> <Radio size={17} /> Watch live
        </Button>
        <Button variant="ghost" onClick={() => push({ name: "incoming" })}>
          <motion.span animate={{ rotate: [0, -14, 14, -10, 0] }} transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}>
            <Phone size={16} />
          </motion.span>
          Get the call
        </Button>
      </div>
      <Finalists />
      <Timeline />
    </>
  );
}

/* ---------------- finalists: live split screen ---------------- */

function Finalists() {
  const { push, openVote } = useNav();
  const shares = useShares();
  const lead = shares.indexOf(Math.max(...shares));
  return (
    <>
      <SectionTitle
        right={
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-call">
            <LiveDot size={5} /> Live share
          </span>
        }
      >
        The finalists
      </SectionTitle>
      <div className="grid grid-cols-2 gap-2.5">
        {FINALISTS.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.15 + i * 0.08, type: "spring", stiffness: 220, damping: 22 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => push({ name: "profile", id: c.id })}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && push({ name: "profile", id: c.id })}
            className="relative h-[196px] cursor-pointer overflow-hidden rounded-3xl"
            style={{ boxShadow: i === lead ? `0 0 0 1.5px ${CALL}, 0 14px 36px -14px ${CALL}` : "0 0 0 1px rgba(255,255,255,.08)" }}
          >
            <Media hue={c.hue} video={c.slug} />
            {i === lead && (
              <motion.span
                layoutId="lead-crown"
                className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-idea px-2 py-0.5 text-[9px] font-extrabold text-ink"
              >
                <Crown size={10} /> LEADING
              </motion.span>
            )}
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={(e) => {
                e.stopPropagation();
                openVote(c);
              }}
              aria-label={`Vote for ${c.name}`}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/40 backdrop-blur-xl"
            >
              <Vote size={14} />
            </motion.button>
            <div className="absolute inset-x-0 bottom-0 p-3">
              <div className="flex items-center gap-1.5">
                <Flag country={c.country} size={10} />
                <span className="truncate text-[13px] font-extrabold">{c.name.split(" ")[0]}</span>
              </div>
              <div className="mt-0.5 text-[10px] font-semibold text-white/55">
                {c.category} · {fmt(c.votes)} votes
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: i === lead ? "#f2b53a" : CALL }}
                    initial={{ width: 0 }}
                    animate={{ width: `${shares[i]}%` }}
                    transition={{ type: "spring", stiffness: 80, damping: 18 }}
                  />
                </div>
                <Roll text={`${shares[i].toFixed(1)}%`} className="text-[10px] font-bold" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

/* ---------------- how it works: animated stage timeline ---------------- */

function Timeline() {
  const step = 1.1 / CALL_STAGES.length;
  return (
    <>
      <SectionTitle>
        Road to the final · stage {NOW + 1}/{CALL_STAGES.length}
      </SectionTitle>
      <div className="relative">
        {CALL_STAGES.map((st, i) => {
          const done = i < NOW;
          const cur = i === NOW;
          return (
            <motion.div
              key={st.t}
              initial={{ opacity: 0, x: -14, filter: "blur(6px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.3 + i * step }}
              className="relative flex gap-4 pb-5"
            >
              {i < CALL_STAGES.length - 1 && (
                <>
                  <div className="absolute left-[13px] top-7 h-[calc(100%-28px)] w-0.5 bg-white/10" />
                  {i < NOW && (
                    <motion.div
                      className="absolute left-[13px] top-7 h-[calc(100%-28px)] w-0.5 origin-top"
                      style={{ background: `linear-gradient(${CALL}, color-mix(in srgb, ${CALL} 70%, #f2b53a))` }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.4 + i * step, duration: step, ease: "easeOut" }}
                    />
                  )}
                </>
              )}
              <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center">
                {cur && (
                  <motion.span
                    className="absolute inset-0 rounded-full"
                    style={{ background: CALL }}
                    animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                <motion.span
                  className="relative flex h-7 w-7 items-center justify-center rounded-full border-2"
                  style={{
                    borderColor: done || cur ? CALL : "rgba(255,255,255,.2)",
                    background: done ? CALL : "#040404",
                    boxShadow: cur ? `0 0 16px ${CALL}` : undefined,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.35 + i * step, type: "spring", stiffness: 400, damping: 16 }}
                >
                  {done && <Check size={13} strokeWidth={3} />}
                  {cur && <span className="h-2.5 w-2.5 rounded-full bg-call" />}
                </motion.span>
              </div>
              <div
                className={`flex-1 rounded-2xl ${cur ? "-mt-1 border border-call/30 bg-call/10 p-3" : "pt-0.5"}`}
              >
                <div className={`flex items-center gap-2 text-[15px] font-bold ${done ? "text-white/45" : ""}`}>
                  {st.t}
                  {cur && (
                    <span className="flex items-center gap-1 rounded-full bg-call px-2 py-0.5 text-[9px] font-extrabold tracking-wider">
                      <LiveDot color="#fff" size={4} /> NOW
                    </span>
                  )}
                </div>
                <div className={`text-[13px] ${cur ? "text-white/70" : "text-white/40"}`}>{st.d}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
