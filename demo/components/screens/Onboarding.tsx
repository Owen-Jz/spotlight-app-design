"use client";

import { AnimatePresence, motion } from "motion/react";
import { Briefcase, Check, ChevronDown, Heart, Lightbulb, Mic, Phone, Timer } from "lucide-react";
import { useRef, useState } from "react";
import { CONTESTANTS, DAILY_FREE_VOTES, IDEA_SECTORS, TALENT_CATEGORIES } from "@/lib/data";
import { Logo } from "../brand/Logo";
import { useNav, type Role as RoleKey, type User } from "../nav";
import { Avatar, Button, Flag, Pulse, rise, stagger } from "../ui";
import { Celebrate } from "./onboarding/Celebrate";
import { Chips, Field, Label, ROLE_COLOR, Step, Tick, toggleIn, useFlow } from "./onboarding/common";
import { BrandSetup, FanSetup, FreeVotesBanner, TalentSetup } from "./onboarding/setup";

export { Celebrate, TalentSetup, FanSetup, BrandSetup };

/* ---------------- Welcome carousel ---------------- */

const SLIDES = [
  {
    show: "The Call",
    color: "#ff5a1f",
    title: "Show your talent.\nGet the call.",
    body: "Sell yourself in one minute. If you're picked, Spotlight calls you with a task, live, and the crowd votes.",
    art: "call",
  },
  {
    show: "The Task",
    color: "#4c7dff",
    title: "Be fast.\nBe first.",
    body: "A task drops. The first 10 people to complete it are in. Then the votes decide who survives.",
    art: "task",
  },
  {
    show: "The Idea",
    color: "#f2b53a",
    title: "Pitch it.\nGet backed.",
    body: "Buy airtime, pitch your business, face the investors, and let the public vote you to the top.",
    art: "idea",
  },
] as const;

function SlideArt({ art, color }: { art: string; color: string }) {
  const Icon = art === "call" ? Phone : art === "task" ? Timer : Lightbulb;
  const chip = "absolute rounded-2xl border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-bold shadow-[0_20px_40px_-20px_rgba(0,0,0,.8)] backdrop-blur-xl";
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* breathing light */}
      <motion.div
        className="absolute h-72 w-72 rounded-full blur-[70px]"
        style={{ background: color }}
        animate={{ opacity: [0.28, 0.42, 0.28], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <Pulse color={color} size={150} duration={3.2} />

      {/* orbit with a travelling dot */}
      <div className="absolute h-[250px] w-[250px] rounded-full border border-white/[0.07]" />
      <motion.div className="absolute h-[250px] w-[250px]" animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }}>
        <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full" style={{ background: color, boxShadow: `0 0 12px ${color}` }} />
      </motion.div>

      {/* glossy tile */}
      <motion.div
        className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-[34px]"
        style={{
          background: `linear-gradient(160deg, color-mix(in srgb, ${color} 30%, #1c1c22), #0c0c10)`,
          boxShadow: `0 0 0 1px rgba(255,255,255,.07), inset 0 1.5px 0 rgba(255,255,255,.25), inset 0 -18px 30px rgba(0,0,0,.4), 0 30px 70px -20px ${color}`,
        }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_0%,rgba(255,255,255,.16),transparent_70%)]" />
        <motion.span
          className="pointer-events-none absolute -bottom-1/3 -top-1/3 w-10 rotate-[18deg] bg-gradient-to-r from-transparent via-white/20 to-transparent blur-[4px]"
          animate={{ x: [-120, 160] }}
          transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 3.2, ease: "easeInOut" }}
        />
        <Icon size={54} strokeWidth={1.7} style={{ color }} fill={art === "call" ? color : "none"} className="relative drop-shadow-[0_4px_10px_rgba(0,0,0,.5)]" />
      </motion.div>

      {art === "task" && (
        <motion.div className={`${chip} bottom-[16%] right-[12%] font-display text-lg font-black`} animate={{ y: [0, -6, 0] }} transition={{ duration: 3.4, repeat: Infinity }}>
          7<span className="text-white/40">/10</span>
        </motion.div>
      )}
      {art === "call" && (
        <motion.div className={`${chip} left-[10%] top-[20%]`} animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}>
          ❤️ 18.4k votes
        </motion.div>
      )}
      {art === "idea" && (
        <motion.div className={`${chip} bottom-[18%] left-[10%]`} animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}>
          💼 3 investors interested
        </motion.div>
      )}
    </div>
  );
}

export function Welcome() {
  const { push, reset, toast } = useNav();
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const s = SLIDES[i];

  const go = (n: number) => ref.current?.scrollTo({ left: n * ref.current.clientWidth, behavior: "smooth" });

  return (
    <div className="relative flex h-full flex-col">
      {/* the page takes on the current show's colour */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        animate={{ background: `radial-gradient(ellipse 90% 60% at 50% 100%, ${s.color}2e, transparent 70%)` }}
        transition={{ duration: 0.6 }}
      />
      <div className="safe-top relative flex items-center justify-between px-6 pb-2">
        <Logo size={24} />
        <button onClick={() => reset({ name: "main" })} className="text-sm font-semibold text-white/50">
          Skip
        </button>
      </div>

      <div
        ref={ref}
        onScroll={(e) => {
          const el = e.currentTarget;
          setI(Math.round(el.scrollLeft / el.clientWidth));
        }}
        className="no-bar relative flex flex-1 snap-x snap-mandatory overflow-x-auto"
      >
        {SLIDES.map((sl) => (
          <div key={sl.show} className="flex h-full w-full shrink-0 snap-center flex-col">
            <div className="relative min-h-0 flex-1">
              <SlideArt art={sl.art} color={sl.color} />
            </div>
            <div className="px-7 pb-4">
              <div className="font-display text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: sl.color }}>
                {sl.show}
              </div>
              <h1 className="mt-3 whitespace-pre-line font-display text-[34px] font-extrabold leading-[1.05] tracking-tight">
                {sl.title}
              </h1>
              <p className="mt-4 text-[15px] leading-relaxed text-white/60">{sl.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="safe-bottom relative px-7 pt-2">
        <div className="mb-6 flex gap-2">
          {SLIDES.map((sl, n) => (
            <motion.button
              key={n}
              onClick={() => go(n)}
              className="h-1.5 rounded-full"
              animate={{ width: n === i ? 28 : 8, background: n === i ? s.color : "rgba(255,255,255,.2)" }}
            />
          ))}
        </div>
        <Button color={s.color} onClick={() => (i < 2 ? go(i + 1) : push({ name: "role" }))}>
          {i < 2 ? "Next" : "Get started"}
        </Button>
        <button
          onClick={() => {
            reset({ name: "main" });
            toast("Welcome back 👋");
          }}
          className="mt-3 w-full py-2 text-sm font-semibold text-white/50"
        >
          I already have an account · <span className="text-white/80">Log in</span>
        </button>
      </div>
    </div>
  );
}

/* ---------------- Role (step 1) ---------------- */

const ROLES: { k: RoleKey; icon: typeof Mic; t: string; d: string; faces: string[] }[] = [
  { k: "talent", icon: Mic, t: "Talent", d: "Compete in The Call, The Task or The Idea and get discovered.", faces: ["c1", "c2", "c3"] },
  { k: "fan", icon: Heart, t: "Fan", d: `Watch every show and vote free, ${DAILY_FREE_VOTES} times a day.`, faces: ["c4", "c9", "c7"] },
  { k: "brand", icon: Briefcase, t: "Scout · Brand · Investor", d: "Labels, agencies, brands and investors: find talent, back ideas.", faces: ["c6", "c8", "c10"] },
];

export function Role() {
  const { push, setUser, user } = useNav();
  const [sel, setSel] = useState<RoleKey>(user.role);
  const color = ROLE_COLOR[sel];
  return (
    <Step
      at="role"
      role={sel}
      color={color}
      title="Who are you on Spotlight?"
      sub="We'll shape everything around it. You can switch anytime."
      cta={`Continue as ${sel === "brand" ? "a scout" : `a ${sel}`}`}
      onNext={() => {
        setUser({ role: sel });
        push({ name: "signup" });
      }}
    >
      <motion.div variants={stagger} className="space-y-3">
        {ROLES.map((r) => {
          const on = sel === r.k;
          const c = ROLE_COLOR[r.k];
          return (
            <motion.button
              key={r.k}
              variants={rise}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSel(r.k)}
              className="relative w-full overflow-hidden rounded-3xl border p-5 text-left transition-colors"
              style={{ borderColor: on ? c : "rgba(255,255,255,.08)", background: on ? `${c}14` : "rgba(255,255,255,.03)" }}
            >
              <motion.span
                className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full blur-2xl"
                style={{ background: c }}
                animate={{ opacity: on ? 0.35 : 0 }}
              />
              <div className="relative flex items-center gap-4">
                <motion.div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                  animate={{ background: on ? c : `${c}22`, color: on ? "#fff" : c, rotate: on ? [0, -10, 8, 0] : 0 }}
                  transition={{ duration: 0.45 }}
                >
                  <r.icon size={22} />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-[15px] font-bold">{r.t}</div>
                  <div className="mt-1 text-[13px] leading-snug text-white/50">{r.d}</div>
                </div>
                <div className="w-6">
                  <Tick on={on} color={c} />
                </div>
              </div>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="relative overflow-hidden"
                  >
                    <div className="flex items-center gap-2 pl-16 pt-3">
                      <div className="flex -space-x-1.5">
                        {r.faces.map((id) => {
                          const p = CONTESTANTS.find((x) => x.id === id) ?? CONTESTANTS[0];
                          return <Avatar key={id} c={p} size={22} ring={c} />;
                        })}
                      </div>
                      <span className="text-[11.5px] font-semibold text-white/50">
                        {r.k === "talent" ? "12,400 acts competing" : r.k === "fan" ? "2.1M votes cast this week" : "180+ verified scouts"}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </motion.div>
    </Step>
  );
}

/* ---------------- Sign up (step 2) ---------------- */

const COUNTRIES: { name: string; dial: string }[] = [
  { name: "Nigeria", dial: "+234" },
  { name: "Ghana", dial: "+233" },
  { name: "Kenya", dial: "+254" },
  { name: "South Africa", dial: "+27" },
  { name: "Senegal", dial: "+221" },
  { name: "Brazil", dial: "+55" },
  { name: "Mexico", dial: "+52" },
  { name: "Colombia", dial: "+57" },
];

const handleOf = (n: string) => "@" + (n.toLowerCase().replace(/[^a-z0-9]/g, "") || "you");

export function Signup() {
  const { user, setUser } = useNav();
  const { next } = useFlow();
  const brand = user.role === "brand";
  const color = ROLE_COLOR[user.role];
  const [name, setName] = useState("");
  const [company, setCompany] = useState(user.company ?? "");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState(COUNTRIES.find((c) => c.name === user.country) ?? COUNTRIES[0]);
  const [picking, setPicking] = useState(false);

  const go = (n: string, org = company) => {
    const nm = n.trim();
    const patch: Partial<User> = { name: nm, handle: handleOf(nm), country: country.name };
    if (brand) patch.company = org.trim() || undefined;
    setUser(patch);
    next("signup");
  };
  const social = () => go(name.trim() || (brand ? "Kemi Adeyemi" : "Tobi Ade"), company.trim() || (brand ? "Kora Ventures" : ""));

  const title = user.role === "talent" ? "Let's get you on stage" : user.role === "fan" ? "Create your account" : "Set up your scout account";
  const sub =
    user.role === "talent"
      ? "Your name is what the crowd will chant. Under a minute."
      : user.role === "fan"
        ? `Free forever. ${DAILY_FREE_VOTES} votes on us, every day.`
        : "We'll verify your organisation so contestants know you're real.";

  return (
    <Step at="signup" color={color} title={title} sub={sub} cta="Continue" disabled={!name.trim() || (brand && !company.trim())} onNext={() => go(name)}>
      <motion.div variants={stagger} className="space-y-5">
        <Field label="Full name" placeholder="e.g. Tolu Adebayo" value={name} onChange={setName} />
        {brand && <Field label="Company / fund name" placeholder="e.g. Mavin Records, Kora Ventures" value={company} onChange={setCompany} />}

        {/* phone with a real-flag country picker */}
        <motion.div variants={rise}>
          <span className="text-xs font-bold uppercase tracking-wider text-white/40">Phone number</span>
          <div className="mt-2 flex items-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition-colors focus-within:border-call">
            <button onClick={() => setPicking((p) => !p)} className="flex shrink-0 items-center gap-2 border-r border-white/10 py-4 pl-4 pr-3" aria-label="Choose country">
              <Flag country={country.name} size={14} />
              <span className="text-[15px] font-semibold tabular-nums text-white/80">{country.dial}</span>
              <motion.span animate={{ rotate: picking ? 180 : 0 }}>
                <ChevronDown size={15} className="text-white/40" />
              </motion.span>
            </button>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d ]/g, ""))}
              placeholder="801 234 5678"
              className="w-full bg-transparent px-3 py-4 text-[16px] font-medium tabular-nums outline-none placeholder:text-white/25"
            />
          </div>
          <AnimatePresence initial={false}>
            {picking && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="mt-2 grid grid-cols-2 gap-1.5 rounded-2xl border border-white/10 bg-[#111112] p-1.5">
                  {COUNTRIES.map((c) => {
                    const on = c.name === country.name;
                    return (
                      <button
                        key={c.name}
                        onClick={() => {
                          setCountry(c);
                          setPicking(false);
                        }}
                        className="flex items-center gap-2 rounded-xl px-2.5 py-2.5 text-left text-[13px] font-semibold transition-colors"
                        style={{ background: on ? `${color}22` : "transparent" }}
                      >
                        <Flag country={c.name} size={12} />
                        <span className="flex-1 truncate">{c.name}</span>
                        <span className="tabular-nums text-white/35">{c.dial}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-2 text-[11.5px] text-white/35">
            We&apos;ll text you a code. {user.role === "talent" ? "It's also the number Spotlight calls when you're picked." : "No spam, ever."}
          </div>
        </motion.div>

        <motion.div variants={rise} className="flex items-center gap-3 pt-1">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-white/40">or continue with</span>
          <div className="h-px flex-1 bg-white/10" />
        </motion.div>
        <motion.div variants={rise} className="grid grid-cols-2 gap-3">
          <Button variant="ghost" onClick={social}>
            <span className="font-display text-[15px] font-black">G</span> Google
          </Button>
          <Button variant="ghost" onClick={social}>
            <svg width="14" height="17" viewBox="0 0 814 1000" fill="currentColor" aria-hidden>
              <path d="M788 341c-6 4-107 61-107 187 0 146 128 198 132 199-1 3-20 71-68 140-42 61-86 122-153 122s-84-39-161-39c-75 0-102 40-163 40s-104-56-153-126C57 782 10 652 10 529c0-198 129-303 256-303 67 0 124 44 166 44 40 0 103-47 180-47 29 0 134 3 176 118zM554 159c31-37 53-88 53-139 0-7-1-14-2-20-50 2-110 34-146 76-28 32-55 83-55 135 0 8 1 15 2 18 3 1 9 1 14 1 45 0 102-30 134-71z" />
            </svg>
            Apple
          </Button>
        </motion.div>
      </motion.div>
    </Step>
  );
}

/* ---------------- Plan (role-aware) ---------------- */

type PlanOption = { k: User["plan"]; t: string; p: string; f: string[]; hot?: boolean };

const PLANS: Record<RoleKey, { title: string; sub: string; options: PlanOption[] }> = {
  talent: {
    title: "Pick your plan",
    sub: "Enter The Call free. Go Pro when you want the spotlight.",
    options: [
      { k: "free", t: "Starter", p: "Free", f: ["Enter The Call with your 1-minute intro", `${DAILY_FREE_VOTES} free votes every day`, "Watch every show, live"] },
      {
        k: "talent",
        t: "Talent Pro",
        p: "₦3,000",
        f: ["Enter The Call, The Task & The Idea", "Profile boost in Discover", "See who votes for you, by city", "Discounted airtime on The Idea"],
        hot: true,
      },
    ],
  },
  fan: {
    title: "Voting is free. Always.",
    sub: `Every account gets ${DAILY_FREE_VOTES} votes a day. Superfan is a bonus.`,
    options: [
      { k: "free", t: "Fan", p: "Free", f: [`${DAILY_FREE_VOTES} free votes every day`, "Watch every show, live", "Follow, comment and share"] },
      { k: "fan", t: "Superfan", p: "₦1,500", f: ["+200 bonus votes a month", "Live final chat & reactions", "Early winner alerts", "Superfan badge on your comments"], hot: true },
    ],
  },
  brand: {
    title: "Pick your scout plan",
    sub: "Scout free. Upgrade when you're ready to sign or invest.",
    options: [
      { k: "free", t: "Scout", p: "Free", f: ["Browse every act and pitch", "Shortlist up to 10", `${DAILY_FREE_VOTES} free votes every day`] },
      { k: "scout", t: "Scout Pro", p: "₦25,000", f: ["Unlimited shortlist with notes", "Message contestants directly", "Pitch decks & founder contacts", "Verified scout badge"], hot: true },
    ],
  },
};

export function Plan() {
  const { setUser, user, toast } = useNav();
  const { next } = useFlow();
  const cfg = PLANS[user.role];
  const color = ROLE_COLOR[user.role];
  const [sel, setSel] = useState<User["plan"]>("free");
  const paid = sel !== "free";

  return (
    <Step
      at="plan"
      color={color}
      title={cfg.title}
      sub={cfg.sub}
      cta={paid ? "Start 7-day free trial" : "Continue free"}
      onNext={() => {
        setUser({ plan: sel });
        if (paid) toast("Trial started. Cancel anytime ✨");
        next("plan");
      }}
      footer={<div className="py-2 text-center text-[11.5px] text-white/35">{paid ? "₦0 today. Cancel anytime in Settings." : "Upgrade whenever you like."}</div>}
    >
      <div className="mb-5">
        <FreeVotesBanner compact />
      </div>
      <motion.div variants={stagger} className="space-y-3">
        {cfg.options.map((p) => {
          const on = sel === p.k;
          return (
            <motion.button
              key={p.t}
              variants={rise}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSel(p.k)}
              className="relative w-full rounded-3xl border p-5 text-left transition-colors"
              style={{ borderColor: on ? color : "rgba(255,255,255,.08)", background: on ? `${color}12` : "rgba(255,255,255,.03)" }}
            >
              {p.hot && (
                <span className="absolute -top-2.5 right-5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ background: color }}>
                  7 days free
                </span>
              )}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border-2" style={{ borderColor: on ? color : "rgba(255,255,255,.25)" }}>
                    <motion.span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} animate={{ scale: on ? 1 : 0 }} />
                  </div>
                  <span className="font-display text-[15px] font-bold">{p.t}</span>
                </div>
                <span className="font-display text-xl font-extrabold">
                  {p.p}
                  {p.p !== "Free" && <span className="text-xs font-semibold text-white/40">/mo</span>}
                </span>
              </div>
              <ul className="mt-3 space-y-1.5 pl-[30px]">
                {p.f.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] leading-snug text-white/60">
                    <Check size={14} className="mt-0.5 shrink-0" style={{ color }} /> {f}
                  </li>
                ))}
              </ul>
            </motion.button>
          );
        })}
      </motion.div>
    </Step>
  );
}

/* ---------------- Interests (talent only: what they like to watch) ---------------- */

export function Interests() {
  const { user, setUser, push } = useNav();
  const [picked, setPicked] = useState<string[]>(() => Array.from(new Set([...(user.talent ? [user.talent] : []), ...user.interests])));
  const toggle = (x: string) => setPicked((p) => toggleIn(p, x));
  const done = (list: string[]) => {
    setUser({ interests: list });
    push({ name: "celebrate" });
  };

  return (
    <Step
      at="interests"
      title="What do you love watching?"
      sub="Study the competition, find collaborators. We'll fill your feed with it."
      cta={picked.length ? `Finish · ${picked.length} picked` : "Finish"}
      onNext={() => done(picked)}
      footer={
        <button onClick={() => done(user.talent ? [user.talent] : [])} className="w-full py-2.5 text-[13px] font-semibold text-white/45">
          Skip for now
        </button>
      }
    >
      <Label color="#ff5a1f">Talent</Label>
      <Chips items={TALENT_CATEGORIES} color="#ff5a1f" picked={picked} toggle={toggle} />
      <div className="mt-8" />
      <Label color="#f2b53a">Ideas</Label>
      <Chips items={IDEA_SECTORS} color="#d8961a" picked={picked} toggle={toggle} />
    </Step>
  );
}

