"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  BedDouble,
  Building2,
  Check,
  Cpu,
  Factory,
  HardHat,
  HeartPulse,
  MessageCircleQuestion,
  Lightbulb,
  Plane,
  Shirt,
  Ship,
  Sparkles,
  Sprout,
  Ticket,
  Video,
  Trophy,
  Users,
  UtensilsCrossed,
  Vote,
  Wallet,
  Megaphone,
  Handshake,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { IDEA_SECTORS } from "@/lib/data";
import { useNav } from "../../nav";
import { Button } from "../../ui";
import { SectionTitle } from "./live";

const IDEA = "#f2b53a";

const SECTOR_ICON: Record<string, LucideIcon> = {
  Agriculture: Sprout,
  "Health care": HeartPulse,
  Exportation: Ship,
  Tourism: Plane,
  "Real Estate": Building2,
  Fashion: Shirt,
  Sports: Trophy,
  "Food & Beverage": UtensilsCrossed,
  Hospitality: BedDouble,
  Energy: Zap,
  Construction: HardHat,
  Manufacturing: Factory,
  Technology: Cpu,
};

const SLOTS = [
  { m: 1, p: 5000, note: "Elevator pitch" },
  { m: 3, p: 12000, note: "Most founders pick", hot: true },
  { m: 5, p: 18000, note: "Full story + demo" },
];
const naira = (n: number) => `₦${n.toLocaleString("en-US")}`;

/** Fictional panel — invented names and funds, not real people or firms. */
export const INVESTORS = [
  { id: "i1", name: "Nkechi Obiora", fund: "Lagoon Lane Capital", focus: ["Agriculture", "Food & Beverage", "Exportation"], cheque: "₦5M–₦40M", hue: ["#f2b53a", "#b8410f"] },
  { id: "i2", name: "Kwabena Asare", fund: "Harbour Seed Fund", focus: ["Technology", "Health care", "Manufacturing"], cheque: "₦10M–₦80M", hue: ["#4c7dff", "#9b5cff"] },
  { id: "i3", name: "Amina Sule", fund: "Savannah Arc Ventures", focus: ["Energy", "Construction", "Real Estate"], cheque: "₦20M–₦150M", hue: ["#22e58a", "#006b5f"] },
  { id: "i4", name: "Tendai Moyo", fund: "Baobab Circle Angels", focus: ["Fashion", "Tourism", "Hospitality", "Sports"], cheque: "₦3M–₦25M", hue: ["#ff2e7a", "#7a1fff"] },
];

const STEPS: { t: string; d: string; icon: LucideIcon }[] = [
  { t: "Book a pitch slot", d: "Pick 1, 3 or 5 minutes", icon: Wallet },
  { t: "Pitch live", d: "You go live to the panel. The clock starts.", icon: Video },
  { t: "Selection", d: "The best pitches go through", icon: Sparkles },
  { t: "Live Q&A with the panel", d: "Investors ask, you answer", icon: MessageCircleQuestion },
  { t: "Meet the investors", d: "Face to face with the panel", icon: Handshake },
  { t: "Public vote", d: "Africa picks its favourite", icon: Vote },
  { t: "Final announcement", d: "One idea gets backed", icon: Megaphone },
];

export function IdeaHub() {
  const { toast, addAlert } = useNav();
  const [sector, setSector] = useState("Technology");
  const [pack, setPack] = useState(3);
  const [phase, setPhase] = useState<"pick" | "confirm" | "booked">("pick");
  const booked = phase === "booked";
  const price = SLOTS.find((a) => a.m === pack)?.p ?? 0;
  const ref = `SPT-${sector.slice(0, 3).toUpperCase()}-${pack}${(sector.length * 37 + pack * 11) % 900 + 100}`;

  const confirm = () => {
    setPhase("booked");
    toast(`Pitch booked · ${pack} min · ${sector} 💼`);
    addAlert({ kind: "result", title: "Your pitch slot is booked", body: `${pack}-minute ${sector} pitch. You go live to the panel on Friday.`, go: { name: "hub", show: "idea" } });
  };

  return (
    <>
      <SectionTitle right={<span className="text-[11px] font-bold text-idea">{sector}</span>}>1 · Pick your sector</SectionTitle>
      <div className="grid grid-cols-3 gap-2">
        {IDEA_SECTORS.map((x, i) => {
          const Icon = SECTOR_ICON[x] ?? Sparkles;
          const on = sector === x;
          return (
            <motion.button
              key={x}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.025 }}
              whileTap={{ scale: 0.93 }}
              disabled={booked}
              onClick={() => setSector(x)}
              className="relative flex h-[78px] flex-col justify-between overflow-hidden rounded-2xl border p-2.5 text-left disabled:opacity-60"
              style={{ borderColor: on ? IDEA : "rgba(255,255,255,.07)", background: on ? "#f2b53a1c" : "rgba(255,255,255,.03)" }}
            >
              {on && <motion.span layoutId="sector-glow" className="absolute -right-4 -top-4 h-14 w-14 rounded-full bg-idea/40 blur-xl" />}
              <Icon size={18} className="relative" style={{ color: on ? IDEA : "rgba(255,255,255,.55)" }} />
              <span className={`relative text-[11px] font-bold leading-tight ${on ? "text-white" : "text-white/70"}`}>{x}</span>
            </motion.button>
          );
        })}
      </div>

      <SectionTitle>2 · Book a pitch slot</SectionTitle>
      <div className="grid grid-cols-3 gap-2">
        {SLOTS.map((a) => {
          const on = pack === a.m;
          return (
            <motion.button
              key={a.m}
              whileTap={{ scale: 0.95 }}
              disabled={booked}
              onClick={() => setPack(a.m)}
              className="relative rounded-2xl border px-2 pb-3 pt-4 text-center disabled:opacity-60"
              style={{
                borderColor: on ? IDEA : "rgba(255,255,255,.08)",
                background: on ? "linear-gradient(180deg, #f2b53a26, #f2b53a08)" : "rgba(255,255,255,.03)",
                boxShadow: on ? "0 14px 30px -18px #f2b53a" : undefined,
              }}
            >
              {a.hot && <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-idea px-2 text-[9px] font-extrabold text-ink">BEST</span>}
              <div className="font-display text-[28px] font-black leading-none">{a.m}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/45">min</div>
              <div className="mt-2 text-[13px] font-extrabold" style={{ color: on ? IDEA : undefined }}>
                {naira(a.p)}
              </div>
              <div className="mt-0.5 text-[9.5px] leading-tight text-white/40">{a.note}</div>
            </motion.button>
          );
        })}
      </div>

      {/* booking flow */}
      <div className="mt-5">
        <AnimatePresence mode="wait" initial={false}>
          {phase === "pick" && (
            <motion.div key="pick" exit={{ opacity: 0, y: -8 }}>
              <Button color="#d8961a" onClick={() => setPhase("confirm")}>
                <Lightbulb size={16} /> Book my {pack}-minute pitch · {naira(price)}
              </Button>
            </motion.div>
          )}
          {phase === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="rounded-3xl border border-idea/30 bg-idea/[0.07] p-5"
            >
              <div className="font-display text-[15px] font-bold">Confirm your pitch</div>
              <div className="mt-3 space-y-2 text-[13px]">
                {[
                  ["Sector", sector],
                  ["Slot", `${pack} minute${pack > 1 ? "s" : ""}`],
                  ["Pitch live", "Friday · 10 AM–4 PM WAT"],
                  ["Total", naira(price)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-white/[0.06] pb-2 last:border-0 last:pb-0">
                    <span className="text-white/50">{k}</span>
                    <span className={`font-bold ${k === "Total" ? "text-idea" : ""}`}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-[1fr_2fr] gap-2">
                <Button variant="ghost" onClick={() => setPhase("pick")}>
                  Edit
                </Button>
                <Button color="#d8961a" onClick={confirm}>
                  Pay &amp; book
                </Button>
              </div>
            </motion.div>
          )}
          {booked && (
            <motion.div
              key="booked"
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="relative overflow-hidden rounded-3xl p-5 text-ink"
              style={{ background: "linear-gradient(135deg, #ffd978, #f2b53a 55%, #d8961a)" }}
            >
              {/* burst */}
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-white"
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{ x: Math.cos((i / 10) * Math.PI * 2) * 140, y: Math.sin((i / 10) * Math.PI * 2) * 70, opacity: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                />
              ))}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider">
                  <Ticket size={14} /> Pitch booked
                </span>
                <span className="font-display text-[11px] font-bold opacity-70">{ref}</span>
              </div>
              <div className="mt-3 font-display text-[22px] font-black leading-tight">
                {pack}-min {sector} pitch
              </div>
              <div className="mt-1 text-[13px] font-semibold opacity-75">You pitch live to the panel on Friday, 10 AM–4 PM WAT. Your stage link lands in your inbox.</div>
              <div className="mt-4 border-t border-dashed border-ink/25 pt-3 text-[12px] font-bold">
                Paid {naira(price)} · we&apos;ll remind you before you go live
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <InvestorPanel sector={sector} />
      <Journey booked={booked} />
    </>
  );
}

/* ---------------- investors ---------------- */

function InvestorPanel({ sector }: { sector: string }) {
  return (
    <>
      <SectionTitle right={<span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white/40"><Users size={11} /> The panel</span>}>
        Who you&apos;ll pitch to
      </SectionTitle>
      <div className="no-bar -mx-6 flex gap-3 overflow-x-auto px-6 pb-1">
        {INVESTORS.map((v, i) => {
          const match = v.focus.includes(sector);
          const initials = v.name
            .split(" ")
            .map((w) => w[0])
            .join("");
          return (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className="relative w-[190px] shrink-0 overflow-hidden rounded-3xl border p-4 transition-colors"
              style={{ borderColor: match ? `${IDEA}88` : "rgba(255,255,255,.07)", background: match ? "#f2b53a10" : "rgba(255,255,255,.03)" }}
            >
              <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl" style={{ background: `${v.hue[0]}33` }} />
              <div className="relative flex items-center gap-3">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-display text-[14px] font-extrabold"
                  style={{ background: `linear-gradient(135deg, ${v.hue[0]}, ${v.hue[1]})` }}
                >
                  {initials}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-bold">{v.name}</div>
                  <div className="truncate text-[11px] text-white/50">{v.fund}</div>
                </div>
              </div>
              <div className="relative mt-3 flex flex-wrap gap-1">
                {v.focus.slice(0, 3).map((f) => (
                  <span
                    key={f}
                    className="rounded-full px-2 py-0.5 text-[9.5px] font-bold"
                    style={{ background: f === sector ? IDEA : "rgba(255,255,255,.07)", color: f === sector ? "#040404" : "rgba(255,255,255,.6)" }}
                  >
                    {f}
                  </span>
                ))}
              </div>
              <div className="relative mt-3 flex items-center justify-between text-[11px]">
                <span className="text-white/40">Cheque</span>
                <span className="font-bold">{v.cheque}</span>
              </div>
              <AnimatePresence>
                {match && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative mt-2 flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-idea"
                  >
                    <Sparkles size={11} /> Backs {sector}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

/* ---------------- the journey ---------------- */

function Journey({ booked }: { booked: boolean }) {
  const at = booked ? 1 : 0;
  return (
    <>
      <SectionTitle>The pitch journey</SectionTitle>
      <div className="relative">
        {STEPS.map((s, i) => {
          const done = i < at;
          const cur = i === at;
          const Icon = s.icon;
          return (
            <motion.div
              key={s.t}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="relative flex gap-3.5 pb-4"
            >
              {i < STEPS.length - 1 && (
                <div className="absolute left-[17px] top-9 h-[calc(100%-36px)] w-0.5 overflow-hidden bg-white/10">
                  <motion.div className="h-full w-full origin-top bg-idea" initial={false} animate={{ scaleY: done ? 1 : 0 }} transition={{ duration: 0.5 }} />
                </div>
              )}
              <motion.span
                layout
                className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                animate={{
                  background: done ? IDEA : cur ? "#f2b53a26" : "rgba(255,255,255,.05)",
                  color: done ? "#040404" : cur ? IDEA : "rgba(255,255,255,.45)",
                  boxShadow: cur ? "0 0 0 1.5px #f2b53a, 0 0 18px rgba(242,181,58,.35)" : "0 0 0 0 rgba(0,0,0,0)",
                }}
              >
                {done ? <Check size={16} strokeWidth={3} /> : <Icon size={16} />}
              </motion.span>
              <div className="pt-0.5">
                <div className={`flex items-center gap-2 text-[14px] font-bold ${done ? "text-white/45" : ""}`}>
                  {s.t}
                  {cur && (
                    <motion.span layoutId="journey-here" className="rounded-full bg-idea px-2 py-0.5 text-[9px] font-extrabold tracking-wider text-ink">
                      {booked ? "NEXT" : "START HERE"}
                    </motion.span>
                  )}
                </div>
                <div className="text-[12px] text-white/40">{i === 1 && booked ? "Friday · 10 AM–4 PM WAT" : s.d}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
