"use client";

import { motion } from "motion/react";
import { Camera, ChevronRight, Link2, MapPin, MessageCircle, Plus, Sparkles } from "lucide-react";
import { PEOPLE, SHOWS, fmt } from "@/lib/data";
import { useNav } from "../../nav";
import { Avatar, Flag, ShowBadge, glass, rise } from "../../ui";
import { Chip, MeHeader } from "./MeParts";
import { EntryTile, JOURNEYS, JourneyBar, SectionHead, StatTile, TrendChart, Verified, totalVotes } from "./parts";

export function MeTalent() {
  const { user, entries, push, toast, extraVotes } = useNav();
  const show = entries[0]?.show ?? "call";
  const color = SHOWS[show].color;
  const category = user.talent ?? user.interests[0] ?? "Music";
  const stageName = user.stageName || user.name;
  const n = entries.length;
  const stage = n ? 1 : 0;
  const steps = JOURNEYS[show];

  // plausible early-creator numbers that grow as they post
  const views = 1284 + n * 862;
  const followers = 342 + n * 57;
  const votes = n * 128;
  const viewTrend = [0.42, 0.5, 0.47, 0.61, 0.66, 0.8, 1].map((f) => Math.round((views / 5) * f));

  const rivals = PEOPLE.filter((p) => p.category === category)
    .sort((a, b) => totalVotes(b, extraVotes) - totalVotes(a, extraVotes))
    .slice(0, 3);

  const tips = [
    { icon: Link2, t: "Share your profile link", d: "Fans who arrive from your link vote 3× more.", cta: "Copy", go: () => toast("Profile link copied · paste it in your WhatsApp status") },
    { icon: Camera, t: "Post a behind-the-scenes clip", d: "Profiles with 2+ videos get 40% more follows.", cta: "Record", go: () => push({ name: "record" }) },
    { icon: MapPin, t: `Rally ${user.country}`, d: "Home-country fans are your biggest voting block.", cta: "Share", go: () => toast(`Rally post ready · tagged #Spotlight${user.country.replace(/\s/g, "")}`) },
    { icon: MessageCircle, t: "Reply to every comment", d: "Replying in the first hour doubles your comments.", cta: "Got it", go: () => toast("We'll nudge you when fans comment") },
  ];

  return (
    <>
      <MeHeader
        title={stageName}
        badge={<Verified size={18} color={color} />}
        subtitle={
          <>
            <span className="truncate">{user.stageName ? user.name : user.handle}</span>
            <span className="text-white/25">·</span>
            <Flag country={user.country} size={11} />
            <span className="truncate">{user.country}</span>
          </>
        }
        chips={
          <>
            <ShowBadge show={show} small />
            <Chip color={color}>{category}</Chip>
          </>
        }
      />
      {user.bio && (
        <motion.p variants={rise} className="mt-4 text-[13.5px] leading-relaxed text-white/65">
          {user.bio}
        </motion.p>
      )}

      {/* ---------- journey ---------- */}
      <motion.div variants={rise} className={`relative mt-6 overflow-hidden rounded-[26px] p-5 ${glass}`}>
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-[50px]" style={{ background: color, opacity: 0.35 }} />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/45">Your journey</div>
            <div className="mt-1 font-display text-[20px] font-extrabold">{steps[stage].t}</div>
            <div className="mt-0.5 text-[12.5px] text-white/55">
              {n ? "Your intro is with the organisers. Keep your phone close — Spotlight calls without warning." : "Record a 1-minute intro to get in front of the organisers."}
            </div>
          </div>
          <span className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-extrabold" style={{ background: `${color}26`, color }}>
            {stage + 1}/{steps.length}
          </span>
        </div>
        <div className="relative mt-5">
          <JourneyBar show={show} current={stage} color={color} />
        </div>
        <div className="relative mt-3 flex items-center gap-2 text-[12px] text-white/50">
          <ChevronRight size={14} style={{ color }} />
          Next: <span className="font-bold text-white/85">{steps[stage + 1]?.t}</span> · {steps[stage + 1]?.d}
        </div>
      </motion.div>

      {/* ---------- stats ---------- */}
      <motion.div variants={rise} className="mt-3 grid grid-cols-3 gap-2">
        <StatTile value={fmt(views)} label="Profile views" />
        <StatTile value={fmt(votes)} label="Votes" accent={color} />
        <StatTile value={fmt(followers)} label="Followers" />
      </motion.div>
      <motion.div variants={rise} className={`mt-2 rounded-[22px] p-4 ${glass}`}>
        <div className="mb-3 flex items-center justify-between text-[12px]">
          <span className="font-bold text-white/60">Views · last 7 days</span>
          <span className="font-extrabold text-[#22e58a]">+{Math.round((viewTrend[6] / viewTrend[0] - 1) * 100)}%</span>
        </div>
        <TrendChart data={viewTrend} color={color} height={64} />
      </motion.div>

      {/* ---------- entries ---------- */}
      <motion.div variants={rise}>
        <SectionHead
          title="My entries"
          right={
            n > 0 ? (
              <button onClick={() => push({ name: "record" })} className="flex items-center gap-1 text-[12px] font-bold" style={{ color }}>
                <Plus size={14} /> New
              </button>
            ) : undefined
          }
        />
        {n ? (
          <div className="grid grid-cols-3 gap-1.5">
            {entries.map((e) => (
              <EntryTile
                key={e.id}
                hue={[SHOWS[e.show].color, "#7a1fff"]}
                img="stage-warm"
                still
                title={e.title}
                badge={
                  <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-extrabold ${e.status === "Live" ? "bg-[#22e58a]" : "bg-idea"} text-ink`}>{e.status}</span>
                }
                onClick={() => push({ name: "entry", id: e.id })}
              />
            ))}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => push({ name: "record" })}
              className="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.02]"
            >
              <Plus size={20} className="text-white/60" />
              <span className="text-[11px] font-bold text-white/50">Add video</span>
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => push({ name: "record" })}
            className="relative flex w-full flex-col items-center gap-2 overflow-hidden rounded-[26px] border border-dashed border-white/15 bg-white/[0.02] py-9"
          >
            <div className="pointer-events-none absolute left-1/2 top-4 h-24 w-24 -translate-x-1/2 rounded-full blur-[40px]" style={{ background: color, opacity: 0.4 }} />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-[0_8px_24px_-6px_#ff5a1f]" style={{ background: color }}>
              <Plus size={24} />
            </div>
            <div className="relative text-[15px] font-bold">Record your 1-minute intro</div>
            <div className="relative text-[12px] text-white/45">Sell yourself. The organisers are watching.</div>
          </motion.button>
        )}
      </motion.div>

      {/* ---------- tips ---------- */}
      <motion.div variants={rise}>
        <SectionHead title="Get more votes" right={<Sparkles size={14} className="text-idea" />} />
        <div className="space-y-2">
          {tips.map((t) => (
            <div key={t.t} className={`flex items-center gap-3 rounded-2xl p-3.5 ${glass}`}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: `${color}1f`, color }}>
                <t.icon size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-bold">{t.t}</div>
                <div className="text-[11.5px] leading-snug text-white/45">{t.d}</div>
              </div>
              <motion.button whileTap={{ scale: 0.92 }} onClick={t.go} className="shrink-0 rounded-full bg-white/[0.08] px-3 py-1.5 text-[11.5px] font-bold">
                {t.cta}
              </motion.button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ---------- category ---------- */}
      {rivals.length > 0 && (
        <motion.div variants={rise}>
          <SectionHead title={`Top of ${category}`} />
          <div className={`rounded-[22px] p-2 ${glass}`}>
            {rivals.map((p, i) => (
              <button key={p.id} onClick={() => push({ name: "profile", id: p.id })} className="flex w-full items-center gap-3 rounded-xl p-2 text-left">
                <span className="w-4 text-center font-display text-[12px] font-extrabold text-white/40">{i + 1}</span>
                <Avatar c={p} size={38} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 truncate text-[13.5px] font-bold">
                    {p.name} <Flag country={p.country} size={10} />
                  </div>
                  <div className="text-[11.5px] text-white/45">{fmt(totalVotes(p, extraVotes))} votes · study their entries</div>
                </div>
                <ChevronRight size={16} className="text-white/30" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}
