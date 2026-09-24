"use client";

import { AnimatePresence, motion } from "motion/react";
import { Bookmark, BookmarkCheck, ChevronRight, Handshake, Lightbulb, TrendingUp, X } from "lucide-react";
import { PEOPLE, SHOWS, TALENT_CATEGORIES, fmt } from "@/lib/data";
import { useNav } from "../../nav";
import { Avatar, Flag, Media, ShowBadge, glass, rise } from "../../ui";
import { Chip, MeHeader } from "./MeParts";
import { SectionHead, StatTile, Verified, totalVotes } from "./parts";

const LOOKING = { talent: "Scouting talent", ideas: "Investing in ideas", both: "Talent & ideas" };

export function MeScout() {
  const { user, shortlist, toggleShortlist, push, toast, extraVotes } = useNav();
  const company = user.company || "Kora Media";
  const looking = user.lookingFor ?? "both";
  const people = shortlist.map((id) => PEOPLE.find((p) => p.id === id)).filter((p) => p !== undefined);

  // categories they care about: their interests, else every talent category
  const cats = user.interests.filter((i) => TALENT_CATEGORIES.includes(i));
  const focus = cats.length ? cats : TALENT_CATEGORIES;
  const trending = PEOPLE.filter((p) => p.show === "talent" && focus.includes(p.category))
    .sort((a, b) => totalVotes(b, extraVotes) - totalVotes(a, extraVotes))
    .slice(0, 6);
  const pitches = PEOPLE.filter((p) => p.show === "idea").sort((a, b) => totalVotes(b, extraVotes) - totalVotes(a, extraVotes));

  const toggle = (id: string, first: string) => {
    const on = shortlist.includes(id);
    toggleShortlist(id);
    toast(on ? `Removed ${first} from your shortlist` : `${first} added to your shortlist`);
  };

  const trendingBlock = (
    <motion.div variants={rise} key="trending">
      <SectionHead title="Trending in your categories" right={<TrendingUp size={15} className="text-[#22e58a]" />} />
      <div className="no-bar -mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1">
        {trending.map((p) => {
          const on = shortlist.includes(p.id);
          return (
            <div key={p.id} className="relative aspect-[3/4] w-[132px] shrink-0 overflow-hidden rounded-[20px]">
              <button onClick={() => push({ name: "profile", id: p.id })} className="absolute inset-0 text-left" aria-label={`Open ${p.name}`}>
                <Media hue={p.hue} video={p.slug} still />
                <div className="absolute inset-x-2.5 bottom-2.5">
                  <div className="flex items-center gap-1 truncate text-[12.5px] font-bold">
                    {p.name.split(" ")[0]} <Flag country={p.country} size={9} />
                  </div>
                  <div className="truncate text-[10.5px] text-white/60">
                    {p.category} · {fmt(totalVotes(p, extraVotes))}
                  </div>
                </div>
              </button>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => toggle(p.id, p.name.split(" ")[0])}
                className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-xl ${on ? "bg-idea text-ink" : "border border-white/15 bg-black/35"}`}
                aria-label={on ? "Remove from shortlist" : "Shortlist"}
              >
                {on ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
              </motion.button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );

  const pitchBlock = (
    <motion.div variants={rise} key="pitches">
      <SectionHead title="Pitches to review" right={<span className="text-[12px] font-bold text-idea">{pitches.length} open</span>} />
      <div className="space-y-2">
        {pitches.map((p) => {
          const on = shortlist.includes(p.id);
          return (
            <div key={p.id} className={`flex items-center gap-3 rounded-2xl p-3 ${glass}`}>
              <button onClick={() => push({ name: "profile", id: p.id })} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-idea/15 text-idea">
                  <Lightbulb size={20} />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 truncate text-[13.5px] font-bold">
                    {p.name} <Flag country={p.country} size={10} />
                  </div>
                  <div className="truncate text-[11.5px] text-white/45">
                    {p.category} · {fmt(totalVotes(p, extraVotes))} public votes
                  </div>
                </div>
              </button>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => toggle(p.id, p.name.split(" ")[0])}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${on ? "bg-idea text-ink" : "bg-white/[0.07]"}`}
                aria-label={on ? "Remove from shortlist" : "Shortlist"}
              >
                {on ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => push({ name: "entry", id: `${p.id}:The pitch` })}
                className="shrink-0 rounded-full bg-white px-3 py-2 text-[11.5px] font-extrabold text-ink"
              >
                Watch
              </motion.button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );

  return (
    <>
      <MeHeader
        title={company}
        badge={<Verified size={18} color="#f2b53a" />}
        subtitle={
          <>
            <span className="truncate">{user.name}</span>
            <span className="text-white/25">·</span>
            <Flag country={user.country} size={11} />
            <span className="truncate">{user.country}</span>
          </>
        }
        chips={
          <>
            <Chip color="#f2b53a">Verified scout</Chip>
            <Chip>{LOOKING[looking]}</Chip>
            {user.budget && <Chip>{user.budget}</Chip>}
          </>
        }
      />

      <motion.div variants={rise} className="mt-6 grid grid-cols-3 gap-2">
        <StatTile value={people.length} label="Shortlisted" accent="#f2b53a" />
        <StatTile value={48 + people.length * 3} label="Profiles seen" />
        <StatTile value={pitches.length} label="Open pitches" />
      </motion.div>

      {/* ---------- shortlist ---------- */}
      <motion.div variants={rise}>
        <SectionHead title="Your shortlist" />
        {people.length ? (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {people.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className={`rounded-[22px] p-3 ${glass}`}
                >
                  <div className="flex items-center gap-3">
                    <button onClick={() => push({ name: "profile", id: p.id })} className="relative shrink-0" aria-label={`Open ${p.name}`}>
                      <Avatar c={p} size={48} ring={SHOWS[p.show].color} />
                      <span className="absolute -bottom-1 -right-1.5">
                        <Flag country={p.country} size={10} />
                      </span>
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14px] font-bold">{p.name}</div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <ShowBadge show={p.show} small />
                        <span className="truncate text-[11px] text-white/50">{p.category}</span>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => toggle(p.id, p.name.split(" ")[0])}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-white/50"
                      aria-label="Remove from shortlist"
                    >
                      <X size={15} />
                    </motion.button>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => push({ name: "profile", id: p.id })} className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-white/[0.06] py-2 text-[12px] font-bold">
                      View profile <ChevronRight size={13} />
                    </button>
                    <button
                      onClick={() => toast(`Offer sent to ${p.name.split(" ")[0]}'s team · replies land in your inbox`)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-idea py-2 text-[12px] font-extrabold text-ink"
                    >
                      <Handshake size={14} /> Make an offer
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-[24px] border border-dashed border-white/15 bg-white/[0.02] px-6 py-7 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-idea/15 text-idea">
              <Bookmark size={20} />
            </span>
            <div className="mt-3 text-[14px] font-bold">No one shortlisted yet</div>
            <div className="mt-1 text-[12px] text-white/45">Tap the bookmark on anyone below, or &ldquo;Shortlist&rdquo; on a profile.</div>
          </div>
        )}
      </motion.div>

      {looking === "ideas" ? [pitchBlock, trendingBlock] : [trendingBlock, pitchBlock]}
    </>
  );
}
