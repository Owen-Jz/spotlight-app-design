"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  BadgeCheck,
  Clock,
  Disc3,
  Drama,
  Feather,
  Footprints,
  Gem,
  Gift,
  Landmark,
  Laugh,
  Lightbulb,
  MicVocal,
  Phone,
  Plus,
  Check,
  Sparkles,
  Store,
  Timer,
  Users,
  Video,
} from "lucide-react";
import { useState, type ComponentType } from "react";
import { CONTESTANTS, DAILY_FREE_VOTES, IDEA_SECTORS, SHOWS, TALENT_CATEGORIES, type ShowKey } from "@/lib/data";
import { useNav, type User } from "../../nav";
import { Avatar, Flag, Media, glass, rise, stagger } from "../../ui";
import { Chips, Field, Label, Step, Tick, draft, toggleIn, useFlow } from "./common";

type Icon = ComponentType<{ size?: number; strokeWidth?: number; className?: string; style?: React.CSSProperties }>;

/* ================= TALENT ================= */

const CATEGORY_ART: Record<string, { icon: Icon; color: string; slug: string }> = {
  Dance: { icon: Footprints, color: "#00d1ff", slug: "rafa" },
  Music: { icon: MicVocal, color: "#ff5a1f", slug: "tolu" },
  Poetry: { icon: Feather, color: "#ff2e7a", slug: "amara" },
  Acting: { icon: Drama, color: "#c21fff", slug: "tunde" },
  Comedy: { icon: Laugh, color: "#22e58a", slug: "zawadi" },
  "Special Talents": { icon: Sparkles, color: "#f2b53a", slug: "adaeze" },
};

const SHOW_ICON: Record<ShowKey, Icon> = { call: Phone, task: Timer, idea: Lightbulb };
const SHOW_LINE: Record<ShowKey, string> = {
  call: "1-minute intro · get the call · win the vote",
  task: "Race a live task · first 10 qualify",
  idea: "Pitch your business to investors",
};

export function TalentSetup() {
  const { user, setUser } = useNav();
  const { next } = useFlow();
  const [cat, setCat] = useState(user.talent ?? "");
  const [stage, setStage] = useState(user.stageName ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [shows, setShows] = useState<ShowKey[]>(draft.shows);
  const [now, setNow] = useState(draft.recordNow);

  const done = () => {
    draft.shows = shows.length ? shows : ["call"];
    draft.recordNow = now;
    setUser({ talent: cat, stageName: stage.trim().replace(/^@/, "") || undefined, bio: bio.trim() || undefined });
    next("talentSetup");
  };

  return (
    <Step
      at="talentSetup"
      title="What's your stage?"
      sub="Pick your craft. This is what the crowd will vote on."
      cta={cat ? `Continue as ${cat === "Special Talents" ? "a Special Talent" : `a ${cat.toLowerCase()} act`}` : "Pick your talent"}
      disabled={!cat}
      onNext={done}
    >
      <motion.div variants={stagger} className="grid grid-cols-2 gap-3">
        {TALENT_CATEGORIES.map((t) => {
          const a = CATEGORY_ART[t] ?? CATEGORY_ART.Music;
          const on = cat === t;
          return (
            <motion.button
              key={t}
              variants={rise}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCat(t)}
              className="relative h-[118px] overflow-hidden rounded-3xl text-left"
              style={{ boxShadow: on ? `0 0 0 2px ${a.color}, 0 18px 40px -16px ${a.color}` : "0 0 0 1px rgba(255,255,255,.08)" }}
            >
              <Media hue={[a.color, "#040404"]} video={a.slug} still={!on} />
              <motion.div
                className="absolute inset-0"
                animate={{ background: on ? `linear-gradient(180deg, transparent 20%, ${a.color}99)` : "linear-gradient(180deg, rgba(7,7,10,.35), rgba(7,7,10,.8))" }}
              />
              <div className="absolute left-3 top-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-2xl backdrop-blur-xl"
                  style={{ background: on ? a.color : "rgba(0,0,0,.35)", border: "1px solid rgba(255,255,255,.18)" }}
                >
                  <a.icon size={20} strokeWidth={2} />
                </div>
              </div>
              <div className="absolute right-3 top-3">
                <Tick on={on} color={a.color} />
              </div>
              <div className="absolute inset-x-3 bottom-3 font-display text-[14px] font-bold leading-tight">{t}</div>
            </motion.button>
          );
        })}
      </motion.div>

      <motion.div variants={stagger} className="mt-7 space-y-5">
        <Field label="Stage name" placeholder="yourname" prefix="@" value={stage} onChange={setStage} />
        <motion.label variants={rise} className="block">
          <span className="flex justify-between text-xs font-bold uppercase tracking-wider text-white/40">
            Short bio <span className="tabular-nums text-white/25">{bio.length}/120</span>
          </span>
          <textarea
            value={bio}
            maxLength={120}
            rows={2}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Lagos-born vocalist. Church choir to your screen."
            className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-[15px] font-medium leading-snug outline-none transition-colors placeholder:text-white/25 focus:border-call"
          />
        </motion.label>
      </motion.div>

      <div className="mt-8">
        <Label>Which shows are you entering?</Label>
        <div className="space-y-2.5">
          {(Object.keys(SHOWS) as ShowKey[]).map((k) => {
            const s = SHOWS[k];
            const on = shows.includes(k);
            const I = SHOW_ICON[k];
            return (
              <motion.button
                key={k}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShows((l) => toggleIn(l, k))}
                className="flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors"
                style={{ borderColor: on ? `${s.color}88` : "rgba(255,255,255,.08)", background: on ? `${s.color}14` : "rgba(255,255,255,.03)" }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: `${s.color}22`, color: s.color }}>
                  <I size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-[14px] font-bold">{s.name}</div>
                  <div className="truncate text-[12px] text-white/45">{SHOW_LINE[k]}</div>
                </div>
                {/* toggle switch */}
                <div className="relative h-7 w-12 shrink-0 rounded-full transition-colors" style={{ background: on ? s.color : "rgba(255,255,255,.12)" }}>
                  <motion.span
                    className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
                    animate={{ left: on ? 24 : 4 }}
                    transition={{ type: "spring", stiffness: 600, damping: 32 }}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <Label>Your 1-minute intro</Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { v: true, icon: Video, t: "Record now", d: "We'll guide you. 60 seconds." },
            { v: false, icon: Clock, t: "Later", d: "We'll remind you tonight." },
          ].map((o) => {
            const on = now === o.v;
            return (
              <motion.button
                key={o.t}
                whileTap={{ scale: 0.96 }}
                onClick={() => setNow(o.v)}
                className="relative rounded-2xl border p-4 text-left transition-colors"
                style={{ borderColor: on ? "#ff5a1f" : "rgba(255,255,255,.08)", background: on ? "#ff5a1f14" : "rgba(255,255,255,.03)" }}
              >
                <o.icon size={20} className={on ? "text-call" : "text-white/50"} />
                <div className="mt-3 font-display text-[14px] font-bold">{o.t}</div>
                <div className="mt-1 text-[12px] leading-snug text-white/45">{o.d}</div>
                <div className="absolute right-3 top-3">
                  <Tick on={on} color="#ff5a1f" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </Step>
  );
}

/* ================= FAN ================= */

/** "Voting is free" banner, shared with the plan screen. */
export function FreeVotesBanner({ compact }: { compact?: boolean }) {
  return (
    <motion.div variants={rise} className={`relative overflow-hidden rounded-3xl ${glass} ${compact ? "p-3.5" : "p-4"}`}>
      <span className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-call/30 blur-2xl" />
      <motion.span
        className="pointer-events-none absolute -bottom-1/2 -top-1/2 w-10 rotate-[18deg] bg-gradient-to-r from-transparent via-white/15 to-transparent"
        animate={{ x: [-80, 420] }}
        transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
      />
      <div className="relative flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-idea to-call shadow-[0_8px_20px_-8px_#ff5a1f]">
          <Gift size={21} />
        </div>
        <div className="flex-1">
          <div className="font-display text-[14px] font-bold">Voting is free</div>
          <div className="text-[12.5px] leading-snug text-white/55">
            You get <b className="text-white">{DAILY_FREE_VOTES} free votes every day</b>. Paying is optional.
          </div>
        </div>
        <div className="font-display text-[26px] font-black tabular-nums text-idea">{DAILY_FREE_VOTES}</div>
      </div>
    </motion.div>
  );
}

const FAN_CATEGORIES = [...TALENT_CATEGORIES, "Speed challenges", "Business pitches"];

export function FanSetup() {
  const { following, toggleFollow, setUser, user } = useNav();
  const { next } = useFlow();
  const [cats, setCats] = useState<string[]>(user.interests.length ? user.interests : ["Music", "Dance"]);
  const people = CONTESTANTS.slice(0, 9);
  const n = people.filter((c) => following.includes(c.id)).length;

  return (
    <Step
      at="fanSetup"
      color="#ff2e7a"
      title="Pick your favourites"
      sub="Follow a few acts. We'll ping you when they go live or need your vote."
      cta={n ? `Continue · following ${n}` : "Continue"}
      onNext={() => {
        setUser({ interests: cats });
        next("fanSetup");
      }}
    >
      <FreeVotesBanner />

      <div className="mt-7 flex items-center justify-between">
        <Label>Trending this week</Label>
        <button
          onClick={() => people.forEach((c) => !following.includes(c.id) && toggleFollow(c.id))}
          className="-mt-3 text-[12px] font-bold text-[#ff2e7a]"
        >
          Follow all
        </button>
      </div>
      <motion.div variants={stagger} className="grid grid-cols-3 gap-2.5">
        {people.map((c) => {
          const on = following.includes(c.id);
          return (
            <motion.button
              key={c.id}
              variants={rise}
              whileTap={{ scale: 0.94 }}
              onClick={() => toggleFollow(c.id)}
              className="relative flex flex-col items-center rounded-3xl border px-1.5 pb-3 pt-3.5 transition-colors"
              style={{ borderColor: on ? `${c.hue[0]}77` : "rgba(255,255,255,.07)", background: on ? `${c.hue[0]}14` : "rgba(255,255,255,.03)" }}
            >
              <motion.div className="relative" animate={{ scale: on ? [1, 1.12, 1] : 1 }} transition={{ duration: 0.35 }}>
                <Avatar c={c} size={62} ring={on ? c.hue[0] : undefined} />
                <motion.span
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink"
                  animate={{ background: on ? c.hue[0] : "#ffffff", color: on ? "#ffffff" : "#040404", rotate: on ? 360 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  {on ? <Check size={12} strokeWidth={3.5} /> : <Plus size={13} strokeWidth={3.5} />}
                </motion.span>
              </motion.div>
              <div className="mt-2.5 w-full truncate text-center text-[12.5px] font-bold">{c.name.split(" ")[0]}</div>
              <div className="mt-1 flex max-w-full items-center gap-1 text-[10.5px] text-white/45">
                <Flag country={c.country} size={9} />
                <span className="truncate">{c.category}</span>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      <div className="mt-8">
        <Label>Favourite categories</Label>
        <Chips items={FAN_CATEGORIES} color="#ff2e7a" picked={cats} toggle={(x) => setCats((l) => toggleIn(l, x))} />
      </div>
    </Step>
  );
}

/* ================= BRAND / SCOUT / INVESTOR ================= */

const ORG_TYPES: { k: string; icon: Icon; d: string; looking: NonNullable<User["lookingFor"]> }[] = [
  { k: "Record label", icon: Disc3, d: "Sign artists", looking: "talent" },
  { k: "Talent agency", icon: Users, d: "Represent acts", looking: "talent" },
  { k: "Brand", icon: Store, d: "Sponsor & collab", looking: "both" },
  { k: "Investor / VC", icon: Landmark, d: "Back startups", looking: "ideas" },
  { k: "Angel investor", icon: Gem, d: "Write early cheques", looking: "ideas" },
];

const BUDGETS = ["Under ₦1M", "₦1M – ₦10M", "₦10M – ₦50M", "₦50M+", "Not sure yet"];

export function BrandSetup() {
  const { user, setUser } = useNav();
  const { next } = useFlow();
  const [org, setOrg] = useState(user.company ?? "");
  const [type, setType] = useState(draft.orgType || "Record label");
  const [looking, setLooking] = useState<NonNullable<User["lookingFor"]>>(user.lookingFor ?? "talent");
  const [cats, setCats] = useState<string[]>([]);
  const [budget, setBudget] = useState(user.budget ?? "");

  const pool = looking === "talent" ? TALENT_CATEGORIES : looking === "ideas" ? IDEA_SECTORS : [...TALENT_CATEGORIES, ...IDEA_SECTORS];
  const gold = "#f2b53a";

  return (
    <Step
      at="brandSetup"
      color="#d8961a"
      title="Tell us who you're scouting for"
      sub="We'll surface the right acts and pitches first."
      cta="Continue"
      onNext={() => {
        draft.orgType = type;
        setUser({ company: org.trim() || undefined, lookingFor: looking, budget: budget || undefined, interests: cats.length ? cats : pool.slice(0, 3) });
        next("brandSetup");
      }}
    >
      {/* verified scout badge preview */}
      <motion.div variants={rise} className={`relative overflow-hidden rounded-3xl p-4 ${glass}`}>
        <span className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full bg-idea/25 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3a2a0c] to-[#120d04] font-display text-lg font-black text-idea shadow-[inset_0_1px_0_rgba(255,220,150,.3)]">
            {(org.trim()[0] ?? "S").toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate font-display text-[15px] font-bold">{org.trim() || "Your organisation"}</span>
              <motion.span animate={{ rotate: [0, 12, 0], scale: [1, 1.15, 1] }} transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1 }}>
                <BadgeCheck size={17} className="text-idea" fill="#f2b53a33" />
              </motion.span>
            </div>
            <div className="text-[12px] text-white/45">{type}</div>
          </div>
          <span className="relative overflow-hidden rounded-full border border-idea/50 bg-idea/15 px-2.5 py-1 font-display text-[9.5px] font-bold uppercase tracking-wider text-idea">
            Verified scout
            <motion.span
              className="absolute -bottom-2 -top-2 w-4 rotate-12 bg-white/40 blur-[3px]"
              animate={{ x: [-30, 110] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2.2 }}
            />
          </span>
        </div>
        <div className="relative mt-3 text-[11.5px] leading-snug text-white/40">
          Contestants see this badge when you shortlist or message them. We verify you within 24 hours.
        </div>
      </motion.div>

      <motion.div variants={stagger} className="mt-6">
        <Field label="Organisation name" placeholder="e.g. Mavin Records, Kora Ventures" value={org} onChange={setOrg} />
      </motion.div>

      <div className="mt-7">
        <Label>You are a…</Label>
        <div className="grid grid-cols-2 gap-2.5">
          {ORG_TYPES.map((o, i) => {
            const on = type === o.k;
            return (
              <motion.button
                key={o.k}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setType(o.k);
                  setLooking(o.looking);
                  setCats([]);
                }}
                className={`relative flex items-center gap-2.5 rounded-2xl border p-3 text-left transition-colors ${i === ORG_TYPES.length - 1 ? "col-span-2" : ""}`}
                style={{ borderColor: on ? gold : "rgba(255,255,255,.08)", background: on ? `${gold}14` : "rgba(255,255,255,.03)" }}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: on ? gold : `${gold}1f`, color: on ? "#040404" : gold }}>
                  <o.icon size={18} />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-bold">{o.k}</div>
                  <div className="truncate text-[11px] text-white/40">{o.d}</div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mt-7">
        <Label>Looking for</Label>
        <div className="relative grid grid-cols-3 rounded-2xl border border-white/10 bg-white/[0.03] p-1">
          {(["talent", "ideas", "both"] as const).map((k) => (
            <button
              key={k}
              onClick={() => {
                setLooking(k);
                setCats([]);
              }}
              className="relative py-2.5 text-[13px] font-bold capitalize"
            >
              {looking === k && (
                <motion.span layoutId="looking-pill" className="absolute inset-0 rounded-xl" style={{ background: gold }} transition={{ type: "spring", stiffness: 420, damping: 34 }} />
              )}
              <span className={`relative ${looking === k ? "text-ink" : "text-white/60"}`}>{k === "talent" ? "Talent" : k === "ideas" ? "Ideas" : "Both"}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7">
        <Label>{looking === "ideas" ? "Sectors" : looking === "talent" ? "Categories" : "Categories & sectors"}</Label>
        <AnimatePresence mode="wait">
          <motion.div key={looking} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
            <Chips items={pool} color={gold} picked={cats} toggle={(x) => setCats((l) => toggleIn(l, x))} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-7">
        <Label>{looking === "ideas" ? "Typical cheque size" : "Budget per deal"}</Label>
        <div className="flex flex-wrap gap-2">
          {BUDGETS.map((b) => {
            const on = budget === b;
            return (
              <motion.button
                key={b}
                whileTap={{ scale: 0.92 }}
                onClick={() => setBudget(on ? "" : b)}
                className="rounded-full border px-4 py-2.5 text-[13px] font-semibold tabular-nums transition-colors"
                style={{ borderColor: on ? gold : "rgba(255,255,255,.1)", background: on ? gold : "rgba(255,255,255,.03)", color: on ? "#040404" : "rgba(255,255,255,.75)" }}
              >
                {b}
              </motion.button>
            );
          })}
        </div>
      </div>
    </Step>
  );
}
