"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { SHOWS, type ShowKey } from "@/lib/data";
import { useNav } from "../../nav";
import { Flag, glass, rise } from "../../ui";
import { Page } from "./common";
import { FILTERS, FILTER_KEYS, rankShow, type Ranked, type ShowFilter } from "./ranks/model";
import { Podium } from "./ranks/Podium";
import { Chip, CountryBoard, RisingFast, SectionTitle, StatusCard, YourPicks } from "./ranks/Sections";
import { Detail, StandingRow } from "./ranks/Standing";

const KEYS = Object.keys(SHOWS) as ShowKey[];
const BOTH = `linear-gradient(100deg, ${SHOWS.talent.color}, ${SHOWS.idea.color})`;

/* ---------------- Ranks ---------------- */

export function Ranks() {
  const { extraVotes } = useNav();
  const [show, setShow] = useState<ShowFilter>("all");
  const [cat, setCat] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  // every show is ranked so "Your picks" can quote live ranks in each show
  const ranked = useMemo(
    () => Object.fromEntries(KEYS.map((k) => [k, rankShow(k, extraVotes)])) as Record<ShowKey, Ranked[]>,
    [extraVotes],
  );
  const everyone = useMemo(() => rankShow("all", extraVotes), [extraVotes]);
  const list = show === "all" ? everyone : ranked[show];
  const color = FILTERS[show].color;

  const categories = [...new Set(list.map((c) => c.category))];
  const countries = [...new Set(list.map((c) => c.country))];
  const filtered = list.filter((c) => (!cat || c.category === cat) && (!country || c.country === country));
  const filtering = cat !== null || country !== null;
  const rows = filtering ? filtered : list.slice(3);
  const podiumPick = !filtering ? list.slice(0, 3).find((c) => c.id === open) : undefined;

  const total = list.reduce((a, c) => a + c.total, 0);
  const fresh = list.reduce((a, c) => a + (extraVotes[c.id] ?? 0), 0);

  const switchShow = (k: ShowFilter) => {
    setShow(k);
    setCat(null);
    setCountry(null);
    setOpen(null);
  };
  const toggle = (id: string) => setOpen((o) => (o === id ? null : id));
  const reveal = (id: string) => {
    setCat(null);
    setCountry(null);
    setOpen(id);
    const top3 = list.slice(0, 3).some((c) => c.id === id);
    requestAnimationFrame(() =>
      document.getElementById(top3 ? "rank-podium" : `rank-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }),
    );
  };
  const pickCountry = (c: string) => {
    setCountry((x) => (x === c ? null : c));
    setOpen(null);
    requestAnimationFrame(() => document.getElementById("rank-standings")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <Page title="Rankings">
      {/* show switcher */}
      <motion.div variants={rise} role="tablist" className={`mb-4 flex rounded-2xl p-1 ${glass}`}>
        {FILTER_KEYS.map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={show === k}
            onClick={() => switchShow(k)}
            className="relative flex-1 rounded-xl py-2.5 text-[13px] font-bold transition-colors"
            style={{ color: show === k ? "#fff" : "rgba(255,255,255,.5)" }}
          >
            {show === k && (
              <motion.span
                layoutId="rankseg"
                className="absolute inset-0 rounded-xl"
                style={
                  k === "all"
                    ? { background: BOTH, boxShadow: `0 8px 24px -8px ${SHOWS.talent.color}` }
                    : { background: SHOWS[k].color, boxShadow: `0 8px 24px -8px ${SHOWS[k].color}` }
                }
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            <span className="relative">{FILTERS[k].name}</span>
          </button>
        ))}
      </motion.div>

      <motion.div variants={rise}>
        <motion.div key={show} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 26 }}>
          <StatusCard show={show} total={total} fresh={fresh} />

          {/* podium + detail for the tapped finalist */}
          {!filtering && (
            <div id="rank-podium" className="mt-6">
              <Podium top={list.slice(0, 3)} show={show} selected={podiumPick?.id ?? null} onSelect={toggle} />
              <AnimatePresence initial={false}>
                {podiumPick && (
                  <motion.div
                    key={podiumPick.id}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    className="overflow-hidden"
                  >
                    <div className={`rounded-b-2xl rounded-t-none border-t-0 ${glass}`} style={{ borderColor: `${color}40` }}>
                      <div className="flex items-center justify-between px-3 pt-3 text-[11px] font-bold uppercase tracking-wider text-white/50">
                        <span>
                          #{podiumPick.rank} · {podiumPick.name}
                        </span>
                        <button onClick={() => setOpen(null)} aria-label="Close details" className="rounded-full p-1 text-white/50">
                          <X size={14} />
                        </button>
                      </div>
                      <Detail c={podiumPick} above={list[podiumPick.rank - 2]} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* filters */}
          <div id="rank-standings" className="scroll-mt-24">
            <SectionTitle right={filtering ? `${filtered.length} of ${list.length}` : `${list.length} contestants`}>Standings</SectionTitle>
            {(categories.length > 1 || countries.length > 1) && (
              <div className="no-bar -mx-5 mb-3 flex gap-2 overflow-x-auto px-5 pb-1">
                {filtering && (
                  <Chip on={false} color={color} onClick={() => { setCat(null); setCountry(null); }}>
                    <X size={12} /> Clear
                  </Chip>
                )}
                {countries.length > 1 &&
                  countries.map((k) => (
                    <Chip key={k} on={country === k} color={color} onClick={() => setCountry((x) => (x === k ? null : k))}>
                      <Flag country={k} size={11} /> {k}
                    </Chip>
                  ))}
                {categories.length > 1 && <span className="my-1 w-px shrink-0 bg-white/10" />}
                {categories.length > 1 &&
                  categories.map((k) => (
                    <Chip key={k} on={cat === k} color={color} onClick={() => setCat((x) => (x === k ? null : k))}>
                      {k}
                    </Chip>
                  ))}
              </div>
            )}

            <LayoutGroup id={`ranks-${show}`}>
              <div className="space-y-2">
                {rows.map((c) => (
                  <StandingRow key={c.id} c={c} above={list[c.rank - 2]} open={open === c.id} onToggle={() => toggle(c.id)} />
                ))}
                {rows.length === 0 && (
                  <div className={`rounded-2xl p-6 text-center text-[13px] text-white/50 ${glass}`}>Nobody matches those filters yet.</div>
                )}
              </div>
            </LayoutGroup>
          </div>

          <RisingFast list={list} onPick={reveal} />
          <YourPicks ranked={ranked} />
          <CountryBoard list={list} show={show} active={country} onPick={pickCountry} />
        </motion.div>
      </motion.div>
    </Page>
  );
}
