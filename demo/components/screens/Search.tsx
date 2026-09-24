"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, Search as SearchIcon, TrendingUp, X } from "lucide-react";
import { useState } from "react";
import { CONTESTANTS, IDEA_SECTORS, PEOPLE, SHOWS, TALENT_CATEGORIES, fmt } from "@/lib/data";
import { useNav } from "../nav";
import { Avatar, Flag, Media, glass } from "../ui";

// label shown -> what it actually searches for (every one returns results)
const TRENDING: [label: string, q: string][] = [
  ["#SpotlightTalent", "Talent"],
  ["Tolu vocals", "Tolu"],
  ["Kenya's rising stars", "Kenya"],
  ["Agritech pitch", "Agriculture"],
  ["#SpotlightIdeas", "Ideas"],
];
const CAT_CLIP = ["rafa", "tolu", "amara", "tunde", "zawadi", "adaeze"];
const RISING = [...CONTESTANTS].sort((a, b) => b.votes - a.votes).slice(0, 8);

const matches = (p: (typeof PEOPLE)[number], term: string) =>
  [p.name, p.handle, p.category, p.country, SHOWS[p.show].name].some((f) => f.toLowerCase().includes(term));

export function Search() {
  const { pop, push, following, toggleFollow, toast } = useNav();
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();
  const results = term
    ? PEOPLE.filter((p) => matches(p, term))
    : [];

  return (
    <div className="flex h-full flex-col">
      <div className="safe-top flex items-center gap-2 px-4 pb-3">
        <motion.button whileTap={{ scale: 0.9 }} onClick={pop} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/30 backdrop-blur-xl" aria-label="Back">
          <ChevronLeft size={22} />
        </motion.button>
        <div className="flex flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 focus-within:border-talent">
          <SearchIcon size={17} className="text-white/40" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search talent, category, country"
            className="min-w-0 flex-1 bg-transparent py-3 text-[16px] outline-none placeholder:text-white/30"
          />
          {q && (
            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileTap={{ scale: 0.8 }} onClick={() => setQ("")} aria-label="Clear" className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
              <X size={13} className="text-white/70" />
            </motion.button>
          )}
        </div>
      </div>

      <div className="no-bar flex-1 overflow-y-auto px-4 pb-10">
        <AnimatePresence mode="wait">
          {!term ? (
            <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-3 mt-2 text-[12px] font-bold uppercase tracking-wider text-white/40">Rising now</div>
              <div className="no-bar -mx-4 flex gap-3.5 overflow-x-auto px-4 pb-1">
                {RISING.map((p, i) => (
                  <motion.button
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => push({ name: "profile", id: p.id })}
                    className="flex w-[62px] shrink-0 flex-col items-center gap-1.5 pt-1"
                  >
                    <div className="relative">
                      <Avatar c={p} size={56} ring={SHOWS[p.show].color} />
                      <Flag country={p.country} size={11} className="absolute -bottom-0.5 -right-1" />
                    </div>
                    <span className="w-full truncate text-center text-[11px] font-semibold text-white/75">{p.name.split(" ")[0]}</span>
                  </motion.button>
                ))}
              </div>

              <div className="mb-2 mt-7 text-[12px] font-bold uppercase tracking-wider text-white/40">Trending</div>
              <div className="space-y-0.5">
                {TRENDING.map(([t, query], i) => (
                  <motion.button
                    key={t}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setQ(query)}
                    className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-white/5 active:bg-white/5"
                  >
                    <span className="w-4 font-display text-[12px] font-bold text-white/30">{i + 1}</span>
                    <TrendingUp size={15} className="text-talent" />
                    <span className="flex-1 text-[14px] font-semibold">{t}</span>
                    <span className="text-[11px] text-white/30">{fmt(PEOPLE.filter((p) => matches(p, query.toLowerCase())).reduce((a, p) => a + p.votes, 0))} votes</span>
                  </motion.button>
                ))}
              </div>

              <div className="mb-3 mt-7 text-[12px] font-bold uppercase tracking-wider text-white/40">Talent</div>
              <div className="grid grid-cols-3 gap-2">
                {TALENT_CATEGORIES.map((c, i) => (
                  <motion.button key={c} whileTap={{ scale: 0.95 }} onClick={() => setQ(c)} className="relative h-24 overflow-hidden rounded-2xl border border-white/[0.06] text-left">
                    <Media hue={["#ff5a1f", ["#7a1fff", "#1f3dff", "#ff2e7a"][i % 3]]} video={CAT_CLIP[i]} />
                    <span className="absolute bottom-2 left-2.5 right-2 leading-tight">
                      <span className="block text-[12px] font-extrabold">{c}</span>
                      <span className="block text-[10px] font-semibold text-white/55">{PEOPLE.filter((p) => p.category === c).length} in the show</span>
                    </span>
                  </motion.button>
                ))}
              </div>

              <div className="mb-3 mt-7 text-[12px] font-bold uppercase tracking-wider text-white/40">Idea sectors</div>
              <div className="flex flex-wrap gap-2">
                {IDEA_SECTORS.map((s) => (
                  <motion.button key={s} whileTap={{ scale: 0.94 }} onClick={() => setQ(s)} className={`rounded-full px-3.5 py-2 text-[12px] font-semibold ${glass}`}>
                    {s}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-3 mt-2 text-[12px] font-bold uppercase tracking-wider text-white/40">
                {results.length} result{results.length === 1 ? "" : "s"}
              </div>
              {results.length === 0 && (
                <div className="py-16 text-center">
                  <div className="font-display text-[16px] font-bold">No one named &ldquo;{q}&rdquo; yet</div>
                  <p className="mt-2 text-[13px] text-white/50">Try a name, a category like &ldquo;Dance&rdquo;, or a country.</p>
                  {IDEA_SECTORS.some((s) => s.toLowerCase() === term) && (
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => push({ name: "hub", show: "idea" })} className="mt-5 rounded-full bg-idea px-4 py-2.5 text-[13px] font-extrabold text-ink">
                      Be the first to pitch it
                    </motion.button>
                  )}
                </div>
              )}
              <div className="space-y-2">
                {results.map((p, i) => {
                  const on = following.includes(p.id);
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: i * 0.03 }}
                      className={`flex items-center gap-3 rounded-2xl p-3 ${glass}`}
                    >
                      <button onClick={() => push({ name: "profile", id: p.id })} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                        <Avatar c={p} size={44} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 text-[14px] font-bold">
                            <span className="truncate">{p.name}</span> <Flag country={p.country} size={11} />
                          </div>
                          <div className="truncate text-[12px] text-white/50">
                            <span style={{ color: SHOWS[p.show].color }}>{SHOWS[p.show].name}</span> · {p.category} · {fmt(p.votes)} votes
                          </div>
                        </div>
                      </button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          toggleFollow(p.id);
                          toast(on ? `Unfollowed ${p.name.split(" ")[0]}` : `Following ${p.name.split(" ")[0]}`);
                        }}
                        className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-extrabold transition-colors ${on ? "bg-white/10 text-white" : "bg-talent text-white"}`}
                      >
                        {on ? "Following" : "Follow"}
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
