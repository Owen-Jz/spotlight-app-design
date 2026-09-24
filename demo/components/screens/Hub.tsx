"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { Timer } from "lucide-react";
import { useRef } from "react";
import { FINALISTS, IDEA_SECTORS, SHOWS, type ShowKey } from "@/lib/data";
import { Media, TopBar, rise, stagger } from "../ui";
import { IdeaHub, INVESTORS } from "./hub/IdeaHub";
import { LIVE_VIEWERS, LiveDot, Roll, SHOW_LIVE, clock, num, useCountdown, useDrift, useTicker } from "./hub/live";
import { TalentHub } from "./hub/TalentHub";

/** Hero footage per show (stage + crowd clips in /public/media/v). */
const HERO_CLIP: Record<ShowKey, string> = { talent: "show-talent", idea: "show-idea" };

export function Hub({ show }: { show: ShowKey }) {
  const s = SHOWS[show];
  const scroller = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scroller });
  // hero video sinks and swells as you scroll; title lifts away; a compact bar fades in
  const heroY = useTransform(scrollY, [0, 380], [0, 140]);
  const heroScale = useTransform(scrollY, [-120, 0, 380], [1.25, 1, 1.08]);
  const textY = useTransform(scrollY, [0, 300], [0, -40]);
  const textO = useTransform(scrollY, [0, 260], [1, 0]);
  const barO = useTransform(scrollY, [240, 320], [0, 1]);

  const left = useCountdown(SHOW_LIVE[show].seconds);
  const viewers = useDrift(LIVE_VIEWERS, 60, 1500);
  const votes = useTicker(1284310, { min: 4, max: 38, every: 900 });
  const pitches = useTicker(1204, { min: 0, max: 2, every: 3000 });

  const stats: { label: string; value: string; live?: boolean }[] =
    show === "talent"
      ? [
          { label: "Watching", value: num(viewers), live: true },
          { label: "Votes cast", value: num(votes), live: true },
          { label: "Finalists", value: String(FINALISTS.length) },
        ]
      : [
          { label: "Pitches", value: num(pitches), live: true },
          { label: "Investors", value: String(INVESTORS.length) },
          { label: "Sectors", value: String(IDEA_SECTORS.length) },
        ];

  return (
    <div className="relative h-full">
      <div ref={scroller} className="no-bar relative h-full overflow-y-auto pb-12">
        <div className="relative h-[400px] overflow-hidden">
          <motion.div className="absolute inset-0" style={{ y: heroY, scale: heroScale }}>
            <Media hue={[s.color, "#15152a"]} video={HERO_CLIP[show]} />
          </motion.div>
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            style={{ y: textY, opacity: textO }}
            className="absolute inset-x-0 bottom-0 px-6 pb-6"
          >
            <motion.div variants={rise} className="flex items-center gap-2 font-display text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: s.color }}>
              {show === "talent" && <LiveDot color={s.color} />}
              Season 1 · {s.stage}
            </motion.div>
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
                show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 180, damping: 22 } },
              }}
              className="mt-2 font-display text-[46px] font-black uppercase leading-[0.92] tracking-tight drop-shadow-[0_6px_30px_rgba(0,0,0,.6)]"
            >
              {s.name}
            </motion.h1>
            <motion.p variants={rise} className="mt-3 max-w-[92%] text-[14px] text-white/70">
              {s.tagline}
            </motion.p>
            <motion.div
              variants={rise}
              className="mt-4 inline-flex items-center gap-2 rounded-full border bg-black/40 py-1.5 pl-2 pr-3.5 backdrop-blur-xl"
              style={{ borderColor: `${s.color}66` }}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: `${s.color}26`, color: s.color }}>
                <Timer size={13} />
              </span>
              <span className="text-[12px] font-semibold text-white/65">{SHOW_LIVE[show].until}</span>
              <Roll text={clock(left)} className="font-display text-[13px] font-bold" />
            </motion.div>
          </motion.div>
        </div>

        {/* key numbers */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, type: "spring", stiffness: 220, damping: 24 }}
          className="relative mx-6 grid grid-cols-3 overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.045] shadow-[inset_0_1px_0_rgba(255,255,255,.06)] backdrop-blur-2xl"
        >
          <span className="pointer-events-none absolute -top-10 left-1/2 h-20 w-3/4 -translate-x-1/2 rounded-full blur-2xl" style={{ background: `${s.color}30` }} />
          {stats.map((st, i) => (
            <div key={st.label} className={`relative px-3 py-3.5 text-center ${i ? "border-l border-white/[0.06]" : ""}`}>
              <div className="font-display text-[18px] font-extrabold leading-none">
                <Roll text={st.value} />
              </div>
              <div className="mt-1.5 flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white/40">
                {st.live && <LiveDot color={s.color} size={4} />}
                {st.label}
              </div>
            </div>
          ))}
        </motion.div>

        <div className="px-6 pt-2">
          {show === "talent" ? <TalentHub /> : <IdeaHub />}
        </div>
      </div>

      {/* compact bar once the hero has scrolled away */}
      <motion.div
        style={{ opacity: barO }}
        className="safe-top pointer-events-none absolute inset-x-0 top-0 z-10 border-b border-white/[0.05] bg-ink/80 pb-3 backdrop-blur-2xl"
      >
        <div className="flex h-10 items-center justify-center gap-2 font-display text-[13px] font-semibold tracking-wide">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
          {s.name}
          <span className="text-white/40">·</span>
          <span className="tabular-nums text-white/60">{clock(left)}</span>
        </div>
      </motion.div>
      <div className="absolute inset-x-0 top-0 z-20">
        <TopBar transparent />
      </div>
    </div>
  );
}
