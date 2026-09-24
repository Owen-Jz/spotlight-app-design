"use client";

import { motion } from "motion/react";
import { Check, Crown, Drama, Eye, Laugh, Mic, Music, PenLine, Radio, Sparkles, Video, Vote, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FINALISTS, HOST, TALENT_CATEGORIES, TALENT_STAGES, fmt } from "@/lib/data";
import { useNav } from "../../nav";
import { Button, Flag, Media } from "../../ui";
import { AvatarStack, LIVE_VIEWERS, LiveDot, Roll, SectionTitle, num, useDrift } from "./live";

const TALENT = "#ff5a1f";
/** The grand final is the stage we're on. */
const NOW = TALENT_STAGES.length - 1;

const CATEGORY_ICON: Record<string, LucideIcon> = {
  Dance: Sparkles,
  Music: Music,
  Poetry: PenLine,
  Acting: Drama,
  Comedy: Laugh,
  "Special Talents": Mic,
};

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

export function TalentHub() {
  return (
    <>
      <FinalTeaser />
      <Finalists />
      <Timeline />
      <Categories />
    </>
  );
}

/* ---------------- the grand final, live on stage right now ---------------- */

function FinalTeaser() {
  const { push } = useNav();
  const viewers = useDrift(LIVE_VIEWERS, 60, 1500);
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 0.45, type: "spring", stiffness: 200, damping: 24 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => push({ name: "live" })}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && push({ name: "live" })}
      className="relative mt-5 h-[210px] cursor-pointer overflow-hidden rounded-3xl"
      style={{ boxShadow: `0 0 0 1px ${TALENT}55, 0 20px 44px -20px ${TALENT}` }}
    >
      <Media hue={HOST.hue} video="host" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />

      {/* the four screens, waiting for the host to switch them off */}
      <div className="absolute right-3 top-3 grid grid-cols-2 gap-1">
        {FINALISTS.map((c, i) => (
          <motion.span
            key={c.id}
            className="relative block h-9 w-7 overflow-hidden rounded-md"
            style={{ boxShadow: "0 0 0 1px rgba(255,255,255,.18)" }}
            animate={{ opacity: [1, 0.55, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.6 }}
          >
            <Media hue={c.hue} video={c.slug} still />
          </motion.span>
        ))}
      </div>

      <div className="absolute left-3 top-3 flex items-center gap-1.5">
        <span className="flex items-center gap-1.5 rounded-md bg-talent px-2 py-1 text-[10px] font-extrabold tracking-wider">
          <LiveDot color="#fff" size={5} /> LIVE
        </span>
        <span className="flex items-center gap-1 rounded-md bg-black/45 px-2 py-1 text-[10px] font-bold backdrop-blur-md">
          <Eye size={11} /> <Roll text={num(viewers)} />
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="font-display text-[10px] font-semibold uppercase tracking-[0.28em] text-talent">Grand Final · on stage</div>
        <div className="mt-1 font-display text-[22px] font-black leading-tight">Four screens. One stays on.</div>
        <div className="mt-1 text-[12px] text-white/60">
          {HOST.name} presents live. Vote until the last screen goes dark.
        </div>
        <div className="mt-3 flex items-center justify-between">
          <AvatarStack people={FINALISTS} size={26} />
          <span className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[12px] font-extrabold text-ink">
            <Radio size={14} /> Watch live
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- finalists: live vote share ---------------- */

function Finalists() {
  const { push, openVote } = useNav();
  const shares = useShares();
  const lead = shares.indexOf(Math.max(...shares));
  return (
    <>
      <SectionTitle
        right={
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-talent">
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
            style={{ boxShadow: i === lead ? `0 0 0 1.5px ${TALENT}, 0 14px 36px -14px ${TALENT}` : "0 0 0 1px rgba(255,255,255,.08)" }}
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
                    style={{ background: i === lead ? "#f2b53a" : TALENT }}
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
  const step = 1.1 / TALENT_STAGES.length;
  return (
    <>
      <SectionTitle>
        Road to the final · stage {NOW + 1}/{TALENT_STAGES.length}
      </SectionTitle>
      <div className="relative">
        {TALENT_STAGES.map((st, i) => {
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
              {i < TALENT_STAGES.length - 1 && (
                <>
                  <div className="absolute left-[13px] top-7 h-[calc(100%-28px)] w-0.5 bg-white/10" />
                  {i < NOW && (
                    <motion.div
                      className="absolute left-[13px] top-7 h-[calc(100%-28px)] w-0.5 origin-top"
                      style={{ background: `linear-gradient(${TALENT}, color-mix(in srgb, ${TALENT} 70%, #f2b53a))` }}
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
                    style={{ background: TALENT }}
                    animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                <motion.span
                  className="relative flex h-7 w-7 items-center justify-center rounded-full border-2"
                  style={{
                    borderColor: done || cur ? TALENT : "rgba(255,255,255,.2)",
                    background: done ? TALENT : "#040404",
                    boxShadow: cur ? `0 0 16px ${TALENT}` : undefined,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.35 + i * step, type: "spring", stiffness: 400, damping: 16 }}
                >
                  {done && <Check size={13} strokeWidth={3} />}
                  {cur && <span className="h-2.5 w-2.5 rounded-full bg-talent" />}
                </motion.span>
              </div>
              <div className={`flex-1 rounded-2xl ${cur ? "-mt-1 border border-talent/30 bg-talent/10 p-3" : "pt-0.5"}`}>
                <div className={`flex items-center gap-2 text-[15px] font-bold ${done ? "text-white/45" : ""}`}>
                  {st.t}
                  {cur && (
                    <span className="flex items-center gap-1 rounded-full bg-talent px-2 py-0.5 text-[9px] font-extrabold tracking-wider">
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

/* ---------------- ways in: categories + post a showcase ---------------- */

function Categories() {
  const { push } = useNav();
  const [pick, setPick] = useState(TALENT_CATEGORIES[0]);
  return (
    <>
      <SectionTitle right={<span className="text-[11px] font-bold text-talent">{pick}</span>}>Next season · pick your stage</SectionTitle>
      <div className="grid grid-cols-3 gap-2">
        {TALENT_CATEGORIES.map((x, i) => {
          const Icon = CATEGORY_ICON[x] ?? Sparkles;
          const on = pick === x;
          return (
            <motion.button
              key={x}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => setPick(x)}
              className="relative flex h-[78px] flex-col justify-between overflow-hidden rounded-2xl border p-2.5 text-left"
              style={{ borderColor: on ? TALENT : "rgba(255,255,255,.07)", background: on ? `${TALENT}1c` : "rgba(255,255,255,.03)" }}
            >
              {on && <motion.span layoutId="talent-cat-glow" className="absolute -right-4 -top-4 h-14 w-14 rounded-full bg-talent/40 blur-xl" />}
              <Icon size={18} className="relative" style={{ color: on ? TALENT : "rgba(255,255,255,.55)" }} />
              <span className={`relative text-[11px] font-bold leading-tight ${on ? "text-white" : "text-white/70"}`}>{x}</span>
            </motion.button>
          );
        })}
      </div>
      <div className="mt-4">
        <Button color={TALENT} onClick={() => push({ name: "record", brief: `${pick} · a 1-minute showcase` })}>
          <Video size={16} /> Post your 1-minute {pick.toLowerCase()} showcase
        </Button>
      </div>
    </>
  );
}
