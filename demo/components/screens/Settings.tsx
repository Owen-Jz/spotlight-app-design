"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, Gift, LogOut, Play, Share2, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useNav, type User } from "../nav";
import { CONTESTANTS, DAILY_FREE_VOTES, findPerson } from "@/lib/data";
import { Flag, TopBar, glass } from "../ui";

type Credit = { file: string; title: string; creator: string; license: string; source: string };

function Toggle({ on, set }: { on: boolean; set: (v: boolean) => void }) {
  return (
    <button onClick={() => set(!on)} className={`relative h-7 w-12 rounded-full transition-colors ${on ? "bg-talent" : "bg-white/15"}`} aria-pressed={on}>
      <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 32 }} className={`absolute top-1 h-5 w-5 rounded-full bg-white ${on ? "right-1" : "left-1"}`} />
    </button>
  );
}

const PLANS: { k: User["plan"]; t: string }[] = [
  { k: "free", t: "Viewer · Free" },
  { k: "fan", t: "Fan · ₦1,500" },
  { k: "talent", t: "Talent · ₦3,000" },
];

export function Settings() {
  const { user, setUser, reset, toast, freeVotes, votesLeft, sheet, myVotes } = useNav();
  // share whoever you've backed most (or the leader) — sharing earns +2
  const topId = Object.entries(myVotes).sort((a, b) => b[1] - a[1])[0]?.[0];
  const favourite = topId ? findPerson(topId) : CONTESTANTS[0];
  const [confirmOut, setConfirmOut] = useState(false);
  const [name, setName] = useState(user.name);
  const [notif, setNotif] = useState({ shortlist: true, live: true, votes: true, marketing: false });
  const [credits, setCredits] = useState<Credit[]>([]);
  const [showCredits, setShowCredits] = useState(false);

  useEffect(() => {
    fetch("/media/credits.json")
      .then((r) => r.json())
      .then(setCredits)
      .catch(() => {});
  }, []);

  const saveName = () => {
    const n = name.trim();
    if (!n || n === user.name) return;
    setUser({ name: n, handle: "@" + n.toLowerCase().replace(/[^a-z0-9]/g, "") });
    toast("Name updated");
  };

  return (
    <div className="flex h-full flex-col">
      <TopBar title="Settings" />
      <div className="no-bar flex-1 space-y-6 overflow-y-auto px-4 pb-12 pt-4">
        <Section title="Account">
          <div className="p-4">
            <label className="text-[11px] font-bold uppercase tracking-wider text-white/40">Display name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => e.key === "Enter" && (e.currentTarget.blur(), saveName())}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-[16px] outline-none focus:border-talent"
            />
            <div className="mt-2 text-[12px] text-white/40">Shown as {user.handle}</div>
          </div>
          <Row label="Country">
            <span className="flex items-center gap-2 text-[13px] font-semibold text-white/60">
              <Flag country={user.country} size={12} /> {user.country}
            </span>
          </Row>
        </Section>

        <Section title="Your votes">
          <div className="p-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-white/50">
                  <Gift size={14} className="text-talent" /> Free votes today
                </div>
                <div className="mt-1 font-display text-[28px] font-extrabold leading-none">
                  {freeVotes}
                  <span className="text-[16px] text-white/35">/{DAILY_FREE_VOTES}</span>
                </div>
              </div>
              {votesLeft > 0 && (
                <div className="text-right">
                  <div className="text-[12px] font-bold text-white/50">Bonus votes</div>
                  <div className="mt-1 font-display text-[20px] font-extrabold leading-none text-idea">{votesLeft}</div>
                </div>
              )}
            </div>
            <div className="mt-3 flex gap-1">
              {Array.from({ length: DAILY_FREE_VOTES }).map((_, i) => (
                <motion.span
                  key={i}
                  className="h-1.5 flex-1 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1, background: i < freeVotes ? "#ff5a1f" : "rgba(255,255,255,.1)" }}
                  transition={{ delay: 0.1 + i * 0.03 }}
                />
              ))}
            </div>
            <ul className="mt-4 space-y-2 text-[13px] leading-snug text-white/60">
              <li className="flex gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-talent" />
                Everyone gets {DAILY_FREE_VOTES} free votes a day. They refill at midnight and don&apos;t roll over, so use them.
              </li>
              <li className="flex gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22e58a]" />
                Sharing a contestant earns you +2 bonus votes.
              </li>
              <li className="flex gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-idea" />
                Buying votes is optional. Free votes are always spent first.
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 divide-x divide-white/5">
            <button onClick={() => sheet({ type: "share", c: favourite })} className="flex items-center justify-center gap-2 py-3.5 text-[13px] font-bold text-white/80 active:bg-white/5">
              <Share2 size={15} /> Share to earn
            </button>
            <button onClick={() => sheet({ type: "topup" })} className="flex items-center justify-center gap-2 py-3.5 text-[13px] font-bold text-white/80 active:bg-white/5">
              <Wallet size={15} /> Top up
            </button>
          </div>
        </Section>

        <Section title="Plan">
          <div className="grid grid-cols-3 gap-2 p-3">
            {PLANS.map((p) => (
              <button
                key={p.k}
                onClick={() => {
                  if (user.plan === p.k) return;
                  setUser({ plan: p.k });
                  toast(`Switched to ${p.t.split(" ·")[0]}`);
                }}
                className="rounded-xl border px-2 py-3 text-[11px] font-bold transition-colors active:scale-95"
                style={{ borderColor: user.plan === p.k ? "#ff5a1f" : "rgba(255,255,255,.08)", background: user.plan === p.k ? "#ff5a1f1a" : "transparent" }}
              >
                {p.t}
              </button>
            ))}
          </div>
          <p className="px-4 pb-3.5 text-[11px] leading-snug text-white/40">Every plan votes for free. Plans unlock entering shows and extras, never the vote.</p>
        </Section>

        <Section title="Notifications">
          {(
            [
              ["shortlist", "When you're shortlisted"],
              ["live", "Live shows starting"],
              ["votes", "Voting deadlines"],
              ["marketing", "News and offers"],
            ] as const
          ).map(([k, t]) => (
            <Row key={k} label={t}>
              <Toggle
                on={notif[k]}
                set={(v) => {
                  setNotif((n) => ({ ...n, [k]: v }));
                }}
              />
            </Row>
          ))}
        </Section>

        <Section title="App">
          <button onClick={() => reset({ name: "intro" })} className="w-full text-left">
            <Row label="Replay the intro">
              <Play size={16} className="text-white/40" />
            </Row>
          </button>
          <button onClick={() => setShowCredits((s) => !s)} className="w-full text-left">
            <Row label="Photo credits">
              <motion.span animate={{ rotate: showCredits ? 90 : 0 }}>
                <ChevronRight size={16} className="text-white/40" />
              </motion.span>
            </Row>
          </button>
          <AnimatePresence>
            {showCredits && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="space-y-2 px-4 pb-4 text-[11px] leading-snug text-white/45">
                  {credits.length === 0 && <div>Loading credits…</div>}
                  {credits.map((c) => (
                    <div key={c.file}>
                      &ldquo;{c.title}&rdquo; by {c.creator} · {c.license} ·{" "}
                      <a href={c.source} target="_blank" rel="noreferrer" className="underline">
                        source
                      </a>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => (confirmOut ? reset({ name: "welcome" }) : setConfirmOut(true))}
          onBlur={() => setConfirmOut(false)}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl p-4 text-[14px] font-bold text-[#ff6b6b] transition-colors ${glass} ${confirmOut ? "!bg-[#e5484d]/15" : ""}`}
        >
          <LogOut size={16} /> {confirmOut ? "Tap again to log out" : "Log out"}
        </motion.button>
        <p className="text-center text-[11px] text-white/30">Spotlight · demo build</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 px-1 text-[12px] font-bold uppercase tracking-wider text-white/40">{title}</div>
      <div className={`divide-y divide-white/5 overflow-hidden rounded-2xl ${glass}`}>{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="text-[14px] font-medium">{label}</span>
      {children}
    </div>
  );
}
