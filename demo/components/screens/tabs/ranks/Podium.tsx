"use client";

import { motion } from "motion/react";
import { Crown } from "lucide-react";
import { fmt } from "@/lib/data";
import { Avatar, Flag } from "../../../ui";
import { Move } from "./charts";
import { FILTERS, type Ranked, type ShowFilter } from "./model";

const GOLD = "#f2b53a";
const SILVER = "#cfd6e4";
const BRONZE = "#d08a4e";

/** Top three on rising pillars. Tapping a finalist opens their detail card below. */
export function Podium({ top, show, selected, onSelect }: { top: Ranked[]; show: ShowFilter; selected: string | null; onSelect: (id: string) => void }) {
  const [first, second, third] = top;
  const slots = [
    { c: second, place: 2, h: 96, medal: SILVER },
    { c: first, place: 1, h: 132, medal: GOLD },
    { c: third, place: 3, h: 78, medal: BRONZE },
  ];
  return (
    <div className="relative flex items-end justify-center gap-2.5 pt-2">
      <div className="pointer-events-none absolute bottom-10 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full blur-[60px]" style={{ background: FILTERS[show].color, opacity: 0.35 }} />
      {slots.map(({ c, place, h, medal }, i) => {
        if (!c) return <div key={place} className="w-[31%]" />;
        const on = selected === c.id;
        return (
          <motion.button
            key={place}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(c.id)}
            aria-pressed={on}
            aria-label={`#${place} ${c.name}, ${fmt(c.total)} votes`}
            className="relative flex w-[31%] flex-col items-center"
          >
            {place === 1 && (
              <motion.span initial={{ y: -12, opacity: 0, rotate: -12 }} animate={{ y: 0, opacity: 1, rotate: 0 }} transition={{ delay: 0.55, type: "spring", stiffness: 300, damping: 14 }}>
                <Crown size={22} className="mb-1" color={GOLD} fill={GOLD} style={{ filter: `drop-shadow(0 0 8px ${GOLD})` }} />
              </motion.span>
            )}
            <div className="relative">
              <motion.div key={c.id} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 + i * 0.08 }}>
                <Avatar c={c} size={place === 1 ? 68 : 54} ring={on ? FILTERS[show].color : medal} />
              </motion.div>
              <span className="absolute -bottom-1 -right-1">
                <Flag country={c.country} size={place === 1 ? 13 : 11} />
              </span>
            </div>
            <div className="mt-2 w-full truncate text-center text-[12px] font-bold">{c.name.split(" ")[0]}</div>
            <motion.div key={c.total} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="text-[12px] font-extrabold tabular-nums">
              {fmt(c.total)}
            </motion.div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-white/50">
              <span className="tabular-nums">{c.share}%</span>
              <Move n={c.move} />
            </div>
            <motion.div
              className="mt-2 flex w-full items-start justify-center rounded-t-2xl border border-b-0 border-white/10 pt-2 font-display text-2xl font-black"
              style={{
                background: place === 1 ? `linear-gradient(${GOLD}, ${GOLD}1a)` : `linear-gradient(${medal}40, rgba(255,255,255,.02))`,
                boxShadow: on ? `inset 0 1px 0 rgba(255,255,255,.35), 0 0 24px -6px ${FILTERS[show].color}` : "inset 0 1px 0 rgba(255,255,255,.25)",
              }}
              initial={{ height: 0 }}
              animate={{ height: h }}
              transition={{ type: "spring", stiffness: 140, damping: 18, delay: 0.1 + i * 0.1 }}
            >
              {place}
            </motion.div>
          </motion.button>
        );
      })}
    </div>
  );
}
