"use client";

import { motion } from "motion/react";
import { Crown, Flame, Globe2, Heart, Lock, Search, Sunrise, Telescope, Trophy, Zap } from "lucide-react";
import { DAILY_FREE_VOTES, PEOPLE, SHOWS, findPerson, fmt } from "@/lib/data";
import { useNav } from "../../nav";
import { Avatar, Flag, glass, rise } from "../../ui";
import { Chip, MeHeader } from "./MeParts";
import { SectionHead, StatTile } from "./parts";

const PLAN_LABEL = { free: "Free viewer", fan: "Superfan · ₦1,500/mo", talent: "Talent Pro · ₦3,000/mo", scout: "Scout Pro · ₦25,000/mo" };

export function MeFan() {
  const { user, myVotes, following, freeVotes, votesLeft, sheet, push } = useNav();
  const cast = Object.values(myVotes).reduce((a, b) => a + b, 0);
  const backed = Object.keys(myVotes).filter((id) => myVotes[id] > 0);
  const streak = cast > 0 ? 4 : 3;
  const countries = new Set(backed.map((id) => findPerson(id).country));

  // favourites: people I voted for (most votes first), then people I follow
  const favIds = [...[...backed].sort((a, b) => myVotes[b] - myVotes[a]), ...following.filter((id) => !backed.includes(id))];
  const favs = favIds.map((id) => PEOPLE.find((p) => p.id === id)).filter((p) => p !== undefined);

  const level = cast >= 50 ? "Legend" : cast >= 25 ? "Superfan" : cast >= 1 ? "Supporter" : "Newcomer";

  const badges = [
    { icon: Sunrise, t: "Early bird", d: "Joined in Season 1", on: true, color: "#f2b53a" },
    { icon: Heart, t: "First vote", d: "Cast your first vote", on: cast >= 1, color: "#ff2e7a" },
    { icon: Telescope, t: "Talent scout", d: "Follow 3 contestants", on: following.length >= 3, color: "#4c7dff", prog: `${Math.min(following.length, 3)}/3` },
    { icon: Globe2, t: "Pan-African", d: "Back 2 countries", on: countries.size >= 2, color: "#22e58a", prog: `${countries.size}/2` },
    { icon: Crown, t: "Superfan", d: "Cast 25 votes", on: cast >= 25, color: "#ff5a1f", prog: `${Math.min(cast, 25)}/25` },
    { icon: Trophy, t: "Kingmaker", d: "Back a finalist", on: backed.some((id) => ["c1", "c2", "c3", "c4"].includes(id)), color: "#c21fff" },
  ];
  const unlocked = badges.filter((b) => b.on).length;

  return (
    <>
      <MeHeader
        title={user.name}
        chips={
          <>
            <Chip color="#ff2e7a">
              <Heart size={10} fill="currentColor" /> {level}
            </Chip>
            <Chip>{PLAN_LABEL[user.plan]}</Chip>
          </>
        }
      />

      <motion.div variants={rise} className="mt-6 grid grid-cols-3 gap-2">
        <StatTile value={fmt(cast)} label="Votes cast" accent="#ff2e7a" />
        <StatTile value={following.length} label="Following" />
        <StatTile
          value={
            <span className="inline-flex items-center gap-1">
              <Flame size={16} className="text-talent" fill="#ff5a1f" />
              {streak}
            </span>
          }
          label="Day streak"
        />
      </motion.div>

      {/* ---------- vote wallet ---------- */}
      <motion.div
        variants={rise}
        className="relative mt-3 overflow-hidden rounded-[26px] bg-gradient-to-br from-[#ff4a7a] via-[#ff5a1f] to-[#a8290a] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.3),0_24px_50px_-20px_#ff5a1f]"
      >
        <Zap size={110} className="absolute -right-6 -top-6 text-white/10" />
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/75">Free votes today</div>
            <motion.div key={freeVotes} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-1 font-display text-[40px] font-black leading-none">
              {freeVotes}
              <span className="text-[18px] text-white/60">/{DAILY_FREE_VOTES}</span>
            </motion.div>
          </div>
          <div className="text-right text-[11px] font-semibold text-white/75">Refills at midnight</div>
        </div>
        <div className="mt-4 flex gap-1">
          {Array.from({ length: DAILY_FREE_VOTES }).map((_, i) => (
            <motion.span
              key={i}
              className="h-2 flex-1 rounded-full"
              initial={false}
              animate={{ background: i < freeVotes ? "rgba(255,255,255,.95)" : "rgba(0,0,0,.22)" }}
            />
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-black/20 p-1.5 pl-4">
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">Bonus votes</div>
            <div className="font-display text-[18px] font-extrabold">{votesLeft}</div>
          </div>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => sheet({ type: "topup" })} className="rounded-xl bg-white px-4 py-2.5 text-[13px] font-extrabold text-ink">
            Top up
          </motion.button>
        </div>
      </motion.div>

      {/* ---------- favourites ---------- */}
      <motion.div variants={rise}>
        <SectionHead title="My favourites" right={favs.length ? <span className="text-[12px] font-semibold text-white/40">{favs.length}</span> : undefined} />
        {favs.length ? (
          <div className="no-bar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
            {favs.map((p) => {
              const mine = myVotes[p.id] ?? 0;
              return (
                <motion.button
                  key={p.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => push({ name: "profile", id: p.id })}
                  className={`flex w-[112px] shrink-0 flex-col items-center rounded-[22px] px-2 pb-3 pt-4 ${glass}`}
                >
                  <div className="relative">
                    <Avatar c={p} size={56} ring={SHOWS[p.show].color} />
                    <span className="absolute -bottom-1 -right-1.5">
                      <Flag country={p.country} size={11} />
                    </span>
                  </div>
                  <div className="mt-2.5 w-full truncate text-center text-[13px] font-bold">{p.name.split(" ")[0]}</div>
                  <div className="w-full truncate text-center text-[11px] text-white/45">{p.category}</div>
                  <div className="mt-1.5 text-[10.5px] font-extrabold" style={{ color: mine ? "#ff2e7a" : "rgba(255,255,255,.5)" }}>
                    {mine ? `You gave ${mine}` : "Following"}
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <button
            onClick={() => push({ name: "search" })}
            className="flex w-full items-center gap-3 rounded-[22px] border border-dashed border-white/15 bg-white/[0.02] p-4 text-left"
          >
            <Search size={18} className="text-white/50" />
            <span className="text-[13px] font-semibold text-white/60">Find someone to root for</span>
          </button>
        )}
      </motion.div>

      {/* ---------- badges ---------- */}
      <motion.div variants={rise}>
        <SectionHead title="Badges" right={<span className="text-[12px] font-bold text-white/50">{unlocked}/{badges.length} unlocked</span>} />
        <div className="grid grid-cols-3 gap-2">
          {badges.map((b) => (
            <div key={b.t} className={`relative flex flex-col items-center rounded-[20px] px-2 pb-3 pt-4 text-center ${glass} ${b.on ? "" : "opacity-55"}`}>
              <span
                className="relative flex h-12 w-12 items-center justify-center rounded-full"
                style={
                  b.on
                    ? { background: `radial-gradient(circle at 30% 25%, ${b.color}, color-mix(in srgb, ${b.color} 45%, black))`, boxShadow: `0 8px 22px -8px ${b.color}` }
                    : { background: "rgba(255,255,255,.06)", border: "1px dashed rgba(255,255,255,.18)" }
                }
              >
                {b.on ? <b.icon size={21} /> : <Lock size={16} className="text-white/45" />}
              </span>
              <div className="mt-2 text-[11.5px] font-extrabold leading-tight">{b.t}</div>
              <div className="mt-0.5 text-[10px] leading-snug text-white/45">{b.on || !b.prog ? b.d : `${b.d} · ${b.prog}`}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
