"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Clock, Film } from "lucide-react";
import { IDEA_SECTORS, SHOWS, type ShowKey } from "@/lib/data";
import { JOURNEYS } from "../profile/parts";
import { useNav, type Route } from "../../nav";
import { Media, glass, rise } from "../../ui";
import { Page, SHOW_ICON, SHOW_VIDEO } from "./common";

/* ---------------- Enter ---------------- */

type Opt = {
  k: ShowKey;
  t: string;
  d: string;
  cta: string;
  needs: string[];
  deadline: string;
  go: Route;
};

const OPTS: Opt[] = [
  {
    k: "talent",
    t: "Show your talent in 1 minute",
    d: "Post a 1-minute showcase. If the organisers shortlist you, the public votes, and Round 2 is a 2-minute performance posted within 24 hours.",
    cta: "Record now",
    needs: ["Your camera", "60 seconds", "Any talent"],
    deadline: "Showcases close in 3d",
    go: { name: "record" },
  },
  {
    k: "idea",
    t: "Pitch your business",
    d: "Book a pitch slot, record your pitch for the investors, take a live Q&A with the panel, and let Africa vote for the idea.",
    cta: "Book a pitch slot",
    needs: ["2–5 min pitch", `Any of ${IDEA_SECTORS.length} sectors`, "A business idea"],
    deadline: "Closes in 2d 4h",
    go: { name: "hub", show: "idea" },
  },
];

export function Enter() {
  const { push, entries } = useNav();
  return (
    <Page title="Enter a show">
      <motion.p variants={rise} className="mb-5 text-[14px] text-white/55">
        Two stages. Pick yours. Your shot starts here.
      </motion.p>

      <div className="space-y-4">
        {OPTS.map((o) => (
          <ShowCard key={o.k} o={o} onGo={() => push(o.go)} />
        ))}
      </div>

      {entries.length > 0 && (
        <motion.div variants={rise} className="mt-7">
          <div className="mb-2.5 flex items-center justify-between px-1">
            <span className="text-[12px] font-bold uppercase tracking-wider text-white/40">Your entries</span>
            <span className="text-[12px] font-bold text-white/40">{entries.length}</span>
          </div>
          <div className="space-y-2">
            {entries.map((e) => (
              <motion.button
                key={e.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => push({ name: "entry", id: e.id })}
                className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left ${glass}`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${SHOWS[e.show].color}22`, color: SHOWS[e.show].color }}>
                  <Film size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-bold">{e.title}</div>
                  <div className="text-[12px] text-white/45">
                    {SHOWS[e.show].name} · {e.category} · {e.at}
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${e.status === "Live" ? "bg-[#22e58a] text-ink" : "bg-idea/15 text-idea"}`}>
                  {e.status}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div variants={rise} className={`mt-7 rounded-[26px] p-5 ${glass}`}>
        <div className="text-[12px] font-bold uppercase tracking-wider text-white/40">How it works</div>
        <div className="relative mt-4 grid grid-cols-4 gap-2 text-center">
          {/* the thread between the steps */}
          <div className="absolute left-[12.5%] right-[12.5%] top-4 h-px bg-gradient-to-r from-talent/60 via-talent/30 to-talent/10" />
          {["Enter", "Get picked", "Go live", "Win votes"].map((t, i) => (
            <div key={t} className="relative">
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-talent/30 bg-ink font-display text-[12px] font-bold text-talent">
                {i + 1}
              </div>
              <div className="mt-2 text-[11px] font-semibold text-white/70">{t}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[12px] leading-snug text-white/45">Voting is always free: everyone gets 10 votes a day, and sharing earns more.</p>
      </motion.div>
    </Page>
  );
}

function ShowCard({ o, onGo }: { o: Opt; onGo: () => void }) {
  const s = SHOWS[o.k];
  const Icon = SHOW_ICON[o.k];
  const steps = JOURNEYS[o.k];
  return (
    <motion.button
      variants={rise}
      whileTap={{ scale: 0.98 }}
      onClick={onGo}
      className="relative block w-full overflow-hidden rounded-[28px] border border-white/[0.08] text-left"
      style={{ boxShadow: `0 24px 50px -30px ${s.color}` }}
    >
      {/* the show's own footage */}
      <div className="relative h-[150px]">
        <Media hue={[s.color, "#15152a"]} video={SHOW_VIDEO[o.k]} />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3.5">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-2xl"
            style={{
              background: `linear-gradient(160deg, ${s.color}, color-mix(in srgb, ${s.color} 55%, black))`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,.3), 0 10px 22px -10px ${s.color}`,
            }}
          >
            <Icon size={19} strokeWidth={2.2} />
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/45 px-2.5 py-1 text-[11px] font-bold backdrop-blur-xl">
            <Clock size={12} style={{ color: s.color }} /> {o.deadline}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="font-display text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: s.color }}>
            {s.name}
          </div>
          <div className="mt-1 font-display text-[20px] font-extrabold leading-tight">{o.t}</div>
        </div>
      </div>

      <div className="bg-white/[0.04] p-4 backdrop-blur-2xl">
        <p className="text-[13px] leading-snug text-white/60">{o.d}</p>

        {/* the road from entry to winner */}
        <div className="mt-3 flex items-center gap-1">
          {steps.map((st, i) => (
            <motion.span
              key={st.t}
              className="h-1.5 flex-1 rounded-full"
              initial={{ opacity: 0.15 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              style={{ background: `color-mix(in srgb, ${s.color} ${100 - i * (60 / steps.length)}%, rgba(255,255,255,.12))` }}
            />
          ))}
        </div>
        <div className="mt-1.5 flex justify-between text-[11px] font-semibold text-white/45">
          <span>{steps[0].d}</span>
          <span>{steps[steps.length - 1].t}</span>
        </div>

        <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-white/35">What you need</div>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {o.needs.map((n) => (
            <span key={n} className="rounded-full bg-white/[0.07] px-2.5 py-1 text-[11px] font-semibold text-white/80">
              {n}
            </span>
          ))}
        </div>

        <div
          className="mt-4 flex items-center justify-between rounded-2xl px-4 py-3 text-[14px] font-extrabold"
          style={{ background: `${s.color}1f`, color: s.color, border: `1px solid ${s.color}40` }}
        >
          {o.cta}
          <ArrowUpRight size={18} />
        </div>
      </div>
    </motion.button>
  );
}
