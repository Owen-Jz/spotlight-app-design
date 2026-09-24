"use client";

import { motion, useScroll, useTransform } from "motion/react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  Check,
  Flame,
  Handshake,
  Heart,
  MapPin,
  MessageCircle,
  Plus,
  Share2,
  Sparkles,
} from "lucide-react";
import { useRef } from "react";
import { DAILY_FREE_VOTES, PEOPLE, SHOWS, findPerson, fmt, statsFor } from "@/lib/data";
import { useNav } from "../nav";
import { Avatar, Button, Flag, Media, ShowBadge, TopBar, glass, rise, stagger } from "../ui";
import {
  CURRENT_STAGE,
  Cities,
  ENTRY_TITLES,
  EntryTile,
  JOURNEYS,
  Journey,
  SectionHead,
  StatTile,
  Supporters,
  TrendChart,
  Verified,
  rankIn,
  totalVotes,
} from "./profile/parts";

export function Profile({ id }: { id: string }) {
  const c = findPerson(id);
  const nav = useNav();
  const { openVote, extraVotes, myVotes, following, toggleFollow, toast, push, sheet, user, freeVotes, votesLeft, shortlist, toggleShortlist, comments } = nav;
  const first = c.name.split(" ")[0];
  const color = SHOWS[c.show].color;
  const votes = totalVotes(c, extraVotes);
  const rank = rankIn(c, extraVotes);
  const stats = statsFor(c);
  const follows = following.includes(c.id);
  const mine = myVotes[c.id] ?? 0;
  const isBrand = user.role === "brand";
  const listed = shortlist.includes(c.id);
  const stage = CURRENT_STAGE[c.show];
  const entryTitles = ENTRY_TITLES[c.show];
  const commentCount = comments[c.id]?.length ?? 0;

  // "fans also vote for": same show first, then same category, excluding this person
  const similar = PEOPLE.filter((p) => p.id !== c.id)
    .map((p) => ({ p, score: (p.show === c.show ? 2 : 0) + (p.category === c.category ? 3 : 0) + p.votes / 1e5 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((x) => x.p);

  // hero parallax + blur as the page scrolls
  const scroller = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scroller });
  const heroY = useTransform(scrollY, [0, 300], [0, 90]);
  const heroScale = useTransform(scrollY, [-100, 0, 300], [1.25, 1, 1.08]);
  const heroBlur = useTransform(scrollY, [0, 260], ["blur(0px)", "blur(14px)"]);
  const barBg = useTransform(scrollY, [180, 260], ["rgba(7,7,10,0)", "rgba(7,7,10,.8)"]);
  const barName = useTransform(scrollY, [220, 280], [0, 1]);

  const freeLeft = freeVotes > 0 ? `${freeVotes} of ${DAILY_FREE_VOTES} free votes left today` : votesLeft > 0 ? `${votesLeft} bonus votes left` : "Free votes refill at midnight";

  return (
    <div className="relative h-full">
      {/* sticky top bar fades in a backdrop + name once the hero scrolls away */}
      <motion.div className="absolute inset-x-0 top-0 z-30" style={{ background: barBg }}>
        <TopBar
          transparent
          right={
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => sheet({ type: "share", c })}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/30 backdrop-blur-xl"
              aria-label="Share"
            >
              <Share2 size={18} />
            </motion.button>
          }
        />
        <motion.div style={{ opacity: barName }} className="safe-top pointer-events-none absolute inset-x-16 top-0">
          <div className="flex h-10 items-center justify-center gap-1.5 font-display text-[13px] font-semibold">
            <span className="truncate">{c.name}</span>
            <Flag country={c.country} size={11} />
          </div>
        </motion.div>
      </motion.div>

      <div ref={scroller} className="no-bar relative h-full overflow-y-auto pb-36">
        {/* ---------- cinematic hero ---------- */}
        <div className="relative h-[400px] overflow-hidden">
          <motion.div className="absolute inset-0" style={{ y: heroY, scale: heroScale, filter: heroBlur }}>
            <Media hue={c.hue} video={c.slug} />
          </motion.div>
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.25 }}
            className="absolute bottom-24 right-5 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[11px] font-bold backdrop-blur-xl"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: color }} />
            {JOURNEYS[c.show][stage].t} · #{rank} in {SHOWS[c.show].name}
          </motion.div>
        </div>

        {/* ambient colour spilled from their footage */}
        <div
          className="pointer-events-none absolute left-0 right-0 top-[340px] h-[420px] opacity-40 blur-[70px]"
          style={{ background: `radial-gradient(60% 50% at 30% 20%, ${c.hue[0]}, transparent), radial-gradient(50% 50% at 80% 40%, ${c.hue[1]}, transparent)` }}
        />

        <motion.div variants={stagger} initial="hidden" animate="show" className="relative -mt-20 px-5">
          {/* ---------- identity ---------- */}
          <motion.div variants={rise} className="flex items-end gap-4">
            <motion.div
              initial={{ scale: 0.7, filter: "blur(10px)" }}
              animate={{ scale: 1, filter: "blur(0px)" }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative rounded-full p-[3px]"
              style={{ background: `conic-gradient(from 200deg, ${color}, ${c.hue[1]}, ${color})`, boxShadow: `0 16px 40px -12px ${color}` }}
            >
              <div className="rounded-full bg-ink p-[3px]">
                <Avatar c={c} size={96} />
              </div>
              <span className="absolute -bottom-1 -right-1">
                <Flag country={c.country} size={18} />
              </span>
            </motion.div>
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex flex-wrap gap-1.5">
                <ShowBadge show={c.show} small />
                <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-[10px] font-bold backdrop-blur-md">{c.category}</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={rise} className="mt-4 flex items-center gap-2">
            <h1 className="truncate font-display text-[28px] font-extrabold leading-tight tracking-tight">{c.name}</h1>
            <Verified size={22} color={color} />
          </motion.div>
          <motion.div variants={rise} className="mt-1 flex items-center gap-2 text-[13px] text-white/55">
            <span className="font-semibold text-white/75">{c.handle}</span>
            <span className="text-white/25">·</span>
            <Flag country={c.country} size={14} />
            <span>{c.country}</span>
          </motion.div>

          {/* ---------- actions ---------- */}
          <motion.div variants={rise} className="mt-5 flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                toggleFollow(c.id);
                toast(follows ? `Unfollowed ${first}` : `Following ${first} · their entries show first`);
              }}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-2xl py-3 text-[14px] font-extrabold transition-colors ${
                follows ? "border border-white/15 bg-white/[0.06] text-white" : "bg-white text-ink"
              }`}
            >
              {follows ? <Check size={16} /> : <Plus size={16} />} {follows ? "Following" : "Follow"}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => sheet({ type: "comments", c })}
              className={`flex items-center gap-1.5 rounded-2xl px-4 text-[13px] font-bold ${glass}`}
              aria-label="Comments"
            >
              <MessageCircle size={17} /> {commentCount}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => sheet({ type: "share", c })}
              className={`flex w-12 items-center justify-center rounded-2xl ${glass}`}
              aria-label="Share"
            >
              <Share2 size={17} />
            </motion.button>
          </motion.div>

          {isBrand && (
            <motion.div variants={rise} className={`mt-3 rounded-[22px] p-3 ${glass}`}>
              <div className="mb-2.5 flex items-center gap-2 px-1 text-[11px] font-bold uppercase tracking-wider text-white/45">
                <Sparkles size={12} className="text-idea" /> Scout tools · {user.company ?? "your organisation"}
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    toggleShortlist(c.id);
                    toast(listed ? `Removed ${first} from your shortlist` : `${first} added to your shortlist`);
                  }}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13px] font-extrabold ${
                    listed ? "bg-idea text-ink" : "border border-idea/40 bg-idea/10 text-idea"
                  }`}
                >
                  {listed ? <BookmarkCheck size={15} /> : <Bookmark size={15} />} {listed ? "Shortlisted" : "Shortlist"}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toast(`Offer sent to ${first}'s team · replies land in your inbox`)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white py-2.5 text-[13px] font-extrabold text-ink"
                >
                  <Handshake size={15} /> Make an offer
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ---------- stats ---------- */}
          <motion.div variants={rise} className="mt-6 grid grid-cols-4 gap-2">
            <StatTile value={fmt(votes)} label="Votes" accent={color} />
            <StatTile value={`#${rank}`} label="Rank" />
            <StatTile value={fmt(stats.followers + (follows ? 1 : 0))} label="Followers" />
            <StatTile value={fmt(stats.views)} label="Views" />
          </motion.div>

          {/* ---------- momentum ---------- */}
          <motion.div variants={rise}>
            <SectionHead title="Momentum" />
            <div className={`rounded-[24px] p-4 ${glass}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-white/40">Vote share</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-display text-[34px] font-black leading-none" style={{ color }}>
                      {stats.share}%
                    </span>
                    <span className="text-[12px] text-white/45">of {SHOWS[c.show].name}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-white/40">Today</div>
                  <div className="mt-1 font-display text-[18px] font-extrabold">+{fmt(stats.today + (extraVotes[c.id] ?? 0))}</div>
                  {stats.delta !== 0 && (
                    <div className={`mt-0.5 flex items-center justify-end gap-0.5 text-[11px] font-bold ${stats.delta > 0 ? "text-[#22e58a]" : "text-[#ff4d6d]"}`}>
                      {stats.delta > 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                      {Math.abs(stats.delta)} {Math.abs(stats.delta) === 1 ? "place" : "places"}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <TrendChart data={stats.trend} color={color} />
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2 text-[12px] text-white/60">
                <Flame size={14} className="text-call" />
                {stats.streak}-day streak of new votes
              </div>
            </div>
          </motion.div>

          {/* ---------- journey ---------- */}
          <motion.div variants={rise}>
            <SectionHead
              title="The journey"
              right={<span className="text-[12px] font-bold" style={{ color }}>Stage {stage + 1} of {JOURNEYS[c.show].length}</span>}
            />
            <Journey show={c.show} current={stage} color={color} />
          </motion.div>

          {/* ---------- entries ---------- */}
          <motion.div variants={rise}>
            <SectionHead title="Entries" right={<span className="text-[12px] font-semibold text-white/40">{entryTitles.length} videos</span>} />
            <div className="grid grid-cols-3 gap-1.5">
              {entryTitles.map((t, i) => (
                <EntryTile
                  key={t}
                  hue={i % 2 ? [c.hue[1], c.hue[0]] : c.hue}
                  video={c.slug}
                  still={i !== entryTitles.length - 1}
                  title={t}
                  badge={
                    i === entryTitles.length - 1 ? (
                      <span className="rounded-full px-1.5 py-0.5 text-[8px] font-extrabold uppercase" style={{ background: color }}>
                        Latest
                      </span>
                    ) : undefined
                  }
                  onClick={() => push({ name: "entry", id: `${c.id}:${t}` })}
                />
              ))}
            </div>
          </motion.div>

          {/* ---------- supporters ---------- */}
          <motion.div variants={rise}>
            <SectionHead title="Top supporters" right={mine > 0 ? <span className="text-[12px] font-bold text-white/60">You gave {mine}</span> : undefined} />
            <Supporters list={stats.supporters} me={mine > 0 ? { name: user.handle.replace("@", ""), votes: mine } : undefined} color={color} />
            {mine === 0 && (
              <button
                onClick={() => openVote(c)}
                className="mt-2 w-full rounded-2xl border border-dashed border-white/12 py-3 text-[12px] font-semibold text-white/50"
              >
                Your name could be here · vote to join {first}&apos;s fan board
              </button>
            )}
          </motion.div>

          {/* ---------- cities ---------- */}
          <motion.div variants={rise}>
            <SectionHead title="Where the votes come from" />
            <Cities list={stats.topCities} color={color} />
          </motion.div>

          {/* ---------- about ---------- */}
          <motion.div variants={rise}>
            <SectionHead title={`About ${first}`} />
            <div className={`rounded-[24px] p-4 ${glass}`}>
              {c.caption && <p className="text-[14px] leading-relaxed text-white/80">&ldquo;{c.caption}&rdquo;</p>}
              <div className={`${c.caption ? "mt-4 border-t border-white/[0.06] pt-4" : ""} grid grid-cols-2 gap-3 text-[12px]`}>
                <div>
                  <div className="text-white/40">From</div>
                  <div className="mt-1 flex items-center gap-1.5 font-bold">
                    <Flag country={c.country} size={12} />
                    {c.country}
                  </div>
                </div>
                <div>
                  <div className="text-white/40">Base</div>
                  <div className="mt-1 flex items-center gap-1 font-bold">
                    <MapPin size={12} className="text-white/50" />
                    {stats.topCities[0].city}
                  </div>
                </div>
                <div>
                  <div className="text-white/40">Competing in</div>
                  <div className="mt-1 font-bold">{SHOWS[c.show].name}</div>
                </div>
                <div>
                  <div className="text-white/40">{c.show === "idea" ? "Sector" : "Category"}</div>
                  <div className="mt-1 font-bold">{c.category}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ---------- fans also vote for ---------- */}
          <motion.div variants={rise}>
            <SectionHead title="Fans also vote for" />
            <div className="no-bar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
              {similar.map((p) => (
                <motion.button
                  key={p.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => push({ name: "profile", id: p.id })}
                  className={`flex w-[118px] shrink-0 flex-col items-center rounded-[22px] px-2 pb-3 pt-4 ${glass}`}
                >
                  <div className="relative">
                    <Avatar c={p} size={58} ring={SHOWS[p.show].color} />
                    <span className="absolute -bottom-1 -right-1.5">
                      <Flag country={p.country} size={11} />
                    </span>
                  </div>
                  <div className="mt-2.5 w-full truncate text-center text-[13px] font-bold">{p.name.split(" ")[0]}</div>
                  <div className="w-full truncate text-center text-[11px] text-white/45">{p.category}</div>
                  <div className="mt-1.5 text-[11px] font-extrabold" style={{ color: SHOWS[p.show].color }}>
                    {fmt(totalVotes(p, extraVotes))}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ---------- sticky vote CTA ---------- */}
      <div className="safe-bottom absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-ink via-ink/95 to-transparent px-5 pt-10">
        <Button onClick={() => openVote(c)} color={color}>
          <Heart size={18} fill="white" /> Vote for {first}
        </Button>
        <div className="mt-2 text-center text-[11px] font-semibold text-white/45">{freeLeft}</div>
      </div>
    </div>
  );
}
