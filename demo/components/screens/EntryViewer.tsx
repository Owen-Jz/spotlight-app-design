"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Heart, MessageCircle, Play, Share2, X } from "lucide-react";
import { useState } from "react";
import { CONTESTANTS, findPerson } from "@/lib/data";
import { useNav } from "../nav";
import { Avatar, Flag, Media, ShowBadge } from "../ui";

/**
 * Full-screen playback of one entry. `id` is either a contestant's entry
 * ("c1:Round 2") or one of your own ("e123…").
 */
export function EntryViewer({ id }: { id: string }) {
  const { pop, push, entries, openVote, sheet, user } = useNav();
  const [paused, setPaused] = useState(false);

  const mine = entries.find((e) => e.id === id);
  const [cid, part] = id.split(":");
  const c = mine ? CONTESTANTS[0] : findPerson(cid);
  const title = mine ? mine.title : part ?? "Entry";

  return (
    <div className="relative h-full bg-black" onClick={() => setPaused((p) => !p)}>
      <Media hue={mine ? ["#ff5a1f", "#7a1fff"] : c.hue} img={mine ? "stage-warm" : c.img} video={mine ? undefined : c.slug} label={mine ? mine.category : c.category} still={paused} />

      <AnimatePresence>
        {paused && (
          <motion.div
            initial={{ opacity: 0, scale: 1.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="pointer-events-none absolute left-1/2 top-1/2 flex border border-white/15 h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 backdrop-blur-xl"
          >
            <Play size={34} fill="white" className="ml-1" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="safe-top absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 px-4">
        <span className="truncate rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[12px] font-bold backdrop-blur-xl">{title}</span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            pop();
          }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-xl"
          aria-label="Close"
        >
          <X size={20} />
        </motion.button>
      </div>

      <div className="safe-bottom absolute inset-x-0 bottom-0 px-5 pb-6" onClick={(e) => e.stopPropagation()}>
        {mine ? (
          <>
            <span className="rounded-full bg-idea px-2.5 py-1 text-[11px] font-extrabold text-ink">{mine.status}</span>
            <div className="mt-3 font-display text-[22px] font-bold">{user.name}</div>
            <p className="mt-1 text-[14px] text-white/70">
              Submitted {mine.at.toLowerCase()} · {mine.category}. The organisers are reviewing it. If you&apos;re shortlisted, the public vote opens.
            </p>
            {/* where the entry is on its way to the public vote */}
            <div className="mt-4 flex items-center">
              {["Submitted", "In review", "Shortlist", "Round 1 vote"].map((t, i) => {
                const done = i === 0;
                const now = i === 1;
                return (
                  <div key={t} className="flex flex-1 flex-col items-start">
                    <div className="flex w-full items-center">
                      <motion.span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${done ? "bg-talent" : now ? "border-2 border-idea" : "border border-white/25"}`}
                        animate={now ? { scale: [1, 1.15, 1] } : undefined}
                        transition={{ duration: 1.4, repeat: Infinity }}
                      >
                        {done && <Check size={11} strokeWidth={3} />}
                      </motion.span>
                      {i < 3 && <span className={`mx-1 h-px flex-1 ${done ? "bg-talent" : "bg-white/15"}`} />}
                    </div>
                    <span className={`mt-1.5 text-[10px] font-bold ${done || now ? "text-white/80" : "text-white/35"}`}>{t}</span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <ShowBadge show={c.show} small />
            <button onClick={() => push({ name: "profile", id: c.id })} className="mt-2.5 flex items-center gap-2.5 text-left">
              <Avatar c={c} size={36} />
              <span className="font-display text-[22px] font-bold">{c.name}</span>
              <Flag country={c.country} size={14} />
            </button>
            <p className="mt-1 text-[14px] text-white/70">{c.caption}</p>
            <div className="mt-4 flex gap-2">
              <motion.button whileTap={{ scale: 0.96 }} onClick={() => openVote(c)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-[14px] font-extrabold text-ink">
                <Heart size={16} fill="#ff2e5a" className="text-[#ff2e5a]" /> Vote
              </motion.button>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => sheet({ type: "comments", c })} className="flex h-[50px] w-[50px] items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl" aria-label="Comments">
                <MessageCircle size={20} />
              </motion.button>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => sheet({ type: "share", c })} className="flex h-[50px] w-[50px] items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl" aria-label="Share">
                <Share2 size={20} />
              </motion.button>
            </div>
          </>
        )}
        <div className="mt-4 h-[3px] overflow-hidden rounded-full bg-white/15">
          <div className="h-full origin-left bg-white/80" style={{ animation: "progress 30s linear infinite", animationPlayState: paused ? "paused" : "running" }} />
        </div>
      </div>
    </div>
  );
}
