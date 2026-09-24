"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Heart, MessageCircle, Play, Plus, Search, Share2, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CONTESTANTS, DAILY_FREE_VOTES, fmt, type Contestant } from "@/lib/data";
import { LogoMark } from "../../brand/Logo";
import { useNav } from "../../nav";
import { Avatar, Flag, Media, ShowBadge } from "../../ui";
import { BellButton, IconBtn } from "./common";

/* ---------------- Home feed ---------------- */

const FEED_CATS = ["All", "Music", "Dance", "Comedy", "Poetry", "Acting", "Ideas"];

export function Home() {
  const { push, following } = useNav();
  const [filter, setFilter] = useState<"For You" | "Following">("For You");
  const [cat, setCat] = useState("All");
  const [muted, setMuted] = useState(true);

  let list = filter === "Following" ? CONTESTANTS.filter((c) => following.includes(c.id)) : CONTESTANTS;
  if (cat !== "All") list = list.filter((c) => (cat === "Ideas" ? c.show === "idea" : c.category === cat));

  return (
    <div className="relative h-full">
      <AnimatePresence mode="wait" initial={false}>
        {list.length ? (
          <motion.div
            key={filter + cat}
            // opacity only: a filter here would break backdrop-blur on the glass inside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="no-bar h-full snap-y snap-mandatory overflow-y-scroll"
          >
            {list.map((c) => (
              <FeedItem key={c.id} c={c} muted={muted} setMuted={setMuted} />
            ))}
          </motion.div>
        ) : (
          <motion.div key={"empty" + filter + cat} className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EmptyFeed following={filter === "Following"} onReset={() => (setCat("All"), setFilter("For You"))} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* top overlay: one row of chrome under the status bar, then the chips */}
      <div className="safe-top pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/70 via-black/30 to-transparent pb-8">
        <div className="pointer-events-auto relative flex h-11 items-center justify-between px-4">
          <LogoMark size={28} />
          <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-4 text-[15px] font-bold">
            {(["Following", "For You"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`relative pb-1.5 drop-shadow-[0_1px_6px_rgba(0,0,0,.6)] transition-colors ${filter === f ? "text-white" : "text-white/50"}`}
              >
                {f}
                {filter === f && <motion.span layoutId="feedtab" className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-white" />}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <IconBtn onClick={() => push({ name: "search" })} label="Search">
              <Search size={19} />
            </IconBtn>
            <BellButton />
          </div>
        </div>

        <div className="no-bar pointer-events-auto mt-3 flex gap-2 overflow-x-auto px-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => push({ name: "live" })}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-talent py-1.5 pl-2.5 pr-3 text-[12px] font-extrabold shadow-[0_6px_18px_-6px_#ff5a1f]"
          >
            <motion.span className="h-1.5 w-1.5 rounded-full bg-white" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
            LIVE · Final
          </motion.button>
          {FEED_CATS.map((c) => (
            <motion.button
              key={c}
              whileTap={{ scale: 0.94 }}
              onClick={() => setCat(c)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-bold backdrop-blur-xl transition-colors ${
                cat === c ? "border-white bg-white text-ink" : "border-white/15 bg-black/30 text-white/80"
              }`}
            >
              {c}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyFeed({ following, onReset }: { following: boolean; onReset: () => void }) {
  const { push, toggleFollow, toast, following: list } = useNav();
  const suggested = CONTESTANTS.filter((c) => !list.includes(c.id)).slice(0, 3);
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-talent/15 blur-[80px]" />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.06]">
        <Heart size={26} className="text-white/60" />
      </div>
      <div className="relative mt-5 font-display text-[18px] font-bold">{following ? "Nothing here yet" : "No entries in this category"}</div>
      <p className="relative mt-2 text-[14px] text-white/50">
        {following ? "Follow contestants and their entries show up here first." : "Try another category, or check back after the next round."}
      </p>

      {following && suggested.length > 0 && (
        <div className="relative mt-6 w-full space-y-2">
          {suggested.map((c) => (
            <div key={c.id} className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.045] p-2.5 text-left backdrop-blur-2xl">
              <button onClick={() => push({ name: "profile", id: c.id })} className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar c={c} size={40} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 truncate text-[14px] font-bold">
                    {c.name} <Flag country={c.country} size={11} />
                  </div>
                  <div className="text-[12px] text-white/45">
                    {c.category} · {fmt(c.votes)} votes
                  </div>
                </div>
              </button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  toggleFollow(c.id);
                  toast(`Following ${c.name.split(" ")[0]}`);
                }}
                className="rounded-full bg-talent px-3.5 py-1.5 text-[12px] font-extrabold"
              >
                Follow
              </motion.button>
            </div>
          ))}
        </div>
      )}

      <div className="relative mt-6 flex gap-2">
        <motion.button whileTap={{ scale: 0.95 }} onClick={onReset} className="rounded-full bg-white px-4 py-2.5 text-[13px] font-extrabold text-ink">
          Show all
        </motion.button>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => push({ name: "search" })} className="rounded-full bg-white/10 px-4 py-2.5 text-[13px] font-bold">
          Find people
        </motion.button>
      </div>
    </div>
  );
}

function FeedItem({ c, muted, setMuted }: { c: Contestant; muted: boolean; setMuted: (m: boolean) => void }) {
  const { openVote, addVote, extraVotes, myVotes, freeVotes, votesLeft, toast, push, sheet, following, toggleFollow, comments } = useNav();
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [paused, setPaused] = useState(false);
  const [liked, setLiked] = useState(false);
  const lastTap = useRef(0);
  const single = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [drift, setDrift] = useState(0);
  const [pops, setPops] = useState<{ id: number; n: number }[]>([]);
  const votes = c.votes + (extraVotes[c.id] ?? 0) + drift;
  const mine = myVotes[c.id] ?? 0;
  const first = c.name.split(" ")[0];

  // other people are voting too — the counter creeps up while you watch
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      t = setTimeout(() => {
        const n = 1 + Math.floor(Math.random() * 14);
        const id = Date.now();
        setDrift((d) => d + n);
        setPops((p) => [...p.slice(-2), { id, n }]);
        setTimeout(() => setPops((p) => p.filter((x) => x.id !== id)), 1400);
        tick();
      }, 1800 + Math.random() * 2600);
    };
    tick();
    return () => clearTimeout(t);
  }, []);
  const follows = following.includes(c.id);

  const onTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastTap.current < 280) {
      // double tap = vote
      if (single.current) clearTimeout(single.current);
      const r = e.currentTarget.getBoundingClientRect();
      const id = now;
      if (addVote(c.id, 1)) {
        setBursts((b) => [...b, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
        setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 900);
        setLiked(true);
        const left = freeVotes + votesLeft - 1;
        toast(`+1 vote for ${first} · ${left} left`);
      } else {
        // out of votes: say so, and offer the ways to get more
        toast("Out of votes · share to earn +2");
        openVote(c);
      }
    } else {
      // single tap = pause / play
      single.current = setTimeout(() => setPaused((p) => !p), 290);
    }
    lastTap.current = now;
  };

  const have = freeVotes + votesLeft;

  return (
    <div className="relative h-full w-full snap-start snap-always" onClick={onTap}>
      <Media hue={c.hue} video={c.slug} still={paused} />

      <AnimatePresence>
        {paused && (
          <motion.div
            initial={{ opacity: 0, scale: 1.4, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 backdrop-blur-xl"
          >
            <Play size={34} fill="white" className="ml-1" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* double-tap hearts */}
      <AnimatePresence>
        {bursts.map((b) => (
          <motion.div
            key={b.id}
            className="pointer-events-none absolute z-20"
            style={{ left: b.x - 44, top: b.y - 44 }}
            initial={{ scale: 0, rotate: -20, opacity: 1 }}
            animate={{ scale: [0, 1.3, 1], rotate: [-20, 10, 0], y: -60, opacity: [1, 1, 0] }}
            transition={{ duration: 0.9 }}
          >
            <Heart size={88} fill="#ff2e5a" strokeWidth={0} className="drop-shadow-[0_0_24px_rgba(255,46,90,.8)]" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* right rail */}
      <div className="absolute bottom-[132px] right-3 z-10 flex flex-col items-center gap-4">
        <div className="relative mb-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              push({ name: "profile", id: c.id });
            }}
            aria-label={`${c.name}'s profile`}
          >
            <Avatar c={c} size={48} ring="#fff" />
          </button>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleFollow(c.id);
              toast(follows ? `Unfollowed ${first}` : `Following ${first}`);
            }}
            className={`absolute -bottom-2 left-1/2 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full transition-colors ${follows ? "bg-white text-ink" : "bg-talent"}`}
            aria-label={follows ? "Unfollow" : "Follow"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={String(follows)} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>
                {follows ? <Check size={12} strokeWidth={3} /> : <Plus size={12} strokeWidth={3} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
        <div className="relative">
          <AnimatePresence>
            {pops.map((p) => (
              <motion.span
                key={p.id}
                className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-extrabold text-[#ff5a7a]"
                initial={{ opacity: 0, y: 0, scale: 0.7 }}
                animate={{ opacity: [0, 1, 0], y: -26, scale: 1 }}
                transition={{ duration: 1.3, ease: "easeOut" }}
              >
                +{p.n}
              </motion.span>
            ))}
          </AnimatePresence>
          <RailBtn
            onClick={() => openVote(c)}
            label={fmt(votes)}
            icon={<Heart size={30} fill={liked ? "#ff2e5a" : "rgba(255,255,255,.15)"} className={liked ? "text-[#ff2e5a]" : ""} />}
          />
        </div>
        <RailBtn onClick={() => sheet({ type: "comments", c })} label={fmt((comments[c.id]?.length ?? 0) * 241)} icon={<MessageCircle size={28} />} />
        <RailBtn onClick={() => sheet({ type: "share", c })} label="Share" icon={<Share2 size={26} />} />
        <RailBtn onClick={() => setMuted(!muted)} label={muted ? "Muted" : "Sound"} icon={muted ? <VolumeX size={24} /> : <Volume2 size={24} />} />
      </div>

      {/* caption — the comment ticker sits in the same column so they never overlap */}
      <div className="absolute bottom-[104px] left-4 right-20 z-10">
        <CommentTicker id={c.id} />
        <ShowBadge show={c.show} small />
        <button
          onClick={(e) => {
            e.stopPropagation();
            push({ name: "profile", id: c.id });
          }}
          className="mt-2 flex items-center gap-2 text-left"
        >
          <span className="font-display text-[17px] font-bold drop-shadow">{c.name}</span>
          <Flag country={c.country} size={13} />
        </button>
        <div className="text-[12px] font-semibold text-white/55">
          {c.handle} · {c.category} · {c.posted}
        </div>
        <p className="mt-2 line-clamp-2 text-[14px] leading-snug text-white/90 drop-shadow">{c.caption}</p>
        <div className="mt-3 flex items-center gap-2.5">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              openVote(c);
            }}
            className="flex items-center gap-2 rounded-full bg-white py-1.5 pl-4 pr-1.5 text-[13px] font-extrabold text-ink shadow-[0_10px_30px_-10px_rgba(255,255,255,.6)]"
          >
            <Heart size={15} fill="#ff2e5a" className="text-[#ff2e5a]" /> Vote
            {/* subtle free-votes meter: nobody has to pay to vote */}
            <span className="flex items-center gap-1 rounded-full bg-ink/[0.07] px-2 py-0.5 text-[11px] font-bold text-ink/60">
              <FreeRing n={freeVotes} />
              {freeVotes > 0 ? `${freeVotes} free` : have > 0 ? `${have} left` : "earn more"}
            </span>
          </motion.button>
          <AnimatePresence>
            {mine > 0 && (
              <motion.span
                key={mine}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[12px] font-bold text-white/70 drop-shadow"
              >
                You gave <span className="text-[#ff5a7a]">{mine}</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* fake playback progress */}
      <div className="absolute inset-x-4 bottom-[92px] z-10 h-[3px] overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full origin-left rounded-full bg-white/80"
          style={{ animation: "progress 30s linear infinite", animationPlayState: paused ? "paused" : "running" }}
        />
      </div>
    </div>
  );
}

/** Tiny ring showing how much of today's free votes are left. */
function FreeRing({ n }: { n: number }) {
  const r = 5;
  const circ = 2 * Math.PI * r;
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" className="-rotate-90" aria-hidden>
      <circle cx="7" cy="7" r={r} fill="none" stroke="rgba(7,7,10,.15)" strokeWidth="2.2" />
      <motion.circle
        cx="7"
        cy="7"
        r={r}
        fill="none"
        stroke="#ff2e5a"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray={circ}
        animate={{ strokeDashoffset: circ * (1 - n / DAILY_FREE_VOTES) }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
      />
    </svg>
  );
}

const TICKER_HUES = ["#ff5a1f", "#4c7dff", "#f2b53a", "#22e58a", "#ff2e7a", "#9b5cff"];

/** Live comments floating over the clip, one at a time. */
function CommentTicker({ id }: { id: string }) {
  const { comments } = useNav();
  const list = comments[id] ?? [];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => x + 1), 3600);
    return () => clearInterval(t);
  }, []);
  if (!list.length) return null;
  const m = list[i % list.length];
  return (
    <div className="pointer-events-none mb-3 h-9">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
          transition={{ duration: 0.45 }}
          className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-black/35 py-1.5 pl-1.5 pr-3 backdrop-blur-xl"
        >
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold"
            style={{ background: TICKER_HUES[m.user.charCodeAt(0) % TICKER_HUES.length] }}
          >
            {m.user[0].toUpperCase()}
          </span>
          <span className="truncate text-[12px]">
            <b className={m.mine ? "text-talent" : "text-white/60"}>{m.user}</b> {m.text}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function RailBtn({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="flex flex-col items-center gap-1 drop-shadow-[0_2px_8px_rgba(0,0,0,.6)]"
    >
      {icon}
      <span className="text-[11px] font-bold">{label}</span>
    </motion.button>
  );
}
